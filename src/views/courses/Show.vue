<template>
  <v-card :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack
            :route="{
              name: routeName,
              params: {
                program_id: getEncodeId(programId),
              },
            }"
          />
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>
        <v-col v-if="item" cols="2" class="text-right">
          <v-btn
            v-if="item.is_active"
            icon
            variant="flat"
            size="x-small"
            color="warning"
            :to="{
              name: `${routeName}/update`,
              params: {
                program_id: getEncodeId(programId),
                id: getEncodeId(itemId),
              },
            }"
          >
            <v-icon>mdi-pencil</v-icon>
            <v-tooltip activator="parent" location="left">Editar</v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text v-if="item">
      <div cols="12" class="text-caption text-center">
        <span v-if="programMeta">
          {{
            `${programMeta.campus.name} | ${programMeta.name} | ${programMeta.code} | ${programMeta.plan_year}`
          }}
        </span>
        <v-progress-circular v-else indeterminate size="12" />
      </div>
      <v-row>
        <v-col v-if="!item.is_active" cols="12">
          <v-alert type="error" density="compact" class="rounded">
            <v-row dense>
              <v-col class="grow pt-2">El registro se encuentra inactivo</v-col>
              <v-col
                v-if="store.getAuth?.user?.role_id === 1"
                class="shrink text-right"
              >
                <v-btn
                  icon
                  variant="flat"
                  size="x-small"
                  color="success"
                  @click.prevent="restoreItem"
                >
                  <v-icon>mdi-delete-restore</v-icon>
                  <v-tooltip activator="parent" location="left">
                    Reactivar
                  </v-tooltip>
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-row dense>
                <v-col cols="11">
                  <CardTitle :text="'DATOS GENERALES | ' + item.uiid" sub />
                </v-col>
                <v-col cols="1" class="text-right">
                  <v-btn
                    v-if="store.getAuth?.user?.role_id === 1"
                    icon
                    variant="flat"
                    size="x-small"
                    @click.prevent="regDialog = true"
                  >
                    <v-icon>mdi-clock-outline</v-icon>
                    <v-tooltip activator="parent" location="left">
                      Registro
                    </v-tooltip>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="6">
                  <VisVal label="Nombre" :value="item.name" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Clave" :value="item.code" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Clave interna" :value="item.alt_code" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Tipo" :value="item.course_type?.name" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Creditos" :value="item.credits" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal
                    label="Duracion de sesión (min.)"
                    :value="item.session_minutes"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Periodo al que pertenece" :value="item.term" />
                </v-col>
                <v-col cols="12" md="6">
                  <VisVal
                    label="Asignatura precedente"
                    :value="
                      item.prerequisite_course
                        ? `${item.prerequisite_course.name} | ${item.prerequisite_course.code}`
                        : null
                    "
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          v-if="item.is_active && store.getAuth?.user?.role_id === 1"
          cols="12"
        >
          <v-btn
            icon
            variant="flat"
            size="x-small"
            color="red-darken-1"
            @click.prevent="deleteItem"
          >
            <v-icon>mdi-minus-thick</v-icon>
            <v-tooltip activator="parent" location="right">Inactivar</v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <DlgReg v-model="regDialog" :item="item" />
  </v-card>
</template>

<script setup>
// Importaciones de librerías externas
import { ref, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

// Importaciones internas del proyecto
import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId, getEncodeId } from "@/utils/coders";

// Componentes
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import DlgReg from "@/components/DlgReg.vue";
import VisVal from "@/components/VisVal.vue";

// Constantes fijas
const routeName = "courses";

// Estado y referencias
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

// Estado reactivo
const programId = ref(getDecodeId(route.params.program_id));
const programMeta = ref(null);
const itemId = ref(getDecodeId(route.params.id));
const isLoading = ref(true);
const item = ref(null);
const regDialog = ref(false);

const getMeta = async () => {
  try {
    const endpoint = `${URL_API}/programs/${programId.value}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    programMeta.value = getRsp(response).data.item;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Obtener registro
const getItem = async () => {
  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/programs/${routeName}/${itemId.value}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    item.value = getRsp(response).data.item;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Inactivar
const deleteItem = async () => {
  const confirmed = await confirm?.show("¿Confirma inactivar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/programs/${routeName}/${itemId.value}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    );

    alert?.show("red-darken-1", response.msg);
    router.push({ name: routeName });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Reactivar
const restoreItem = async () => {
  const confirmed = await confirm?.show("¿Confirma activar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/programs/${routeName}/restore`;
    const response = getRsp(
      await axios.post(
        endpoint,
        { id: itemId.value },
        getHdrs(store.getAuth?.token)
      )
    );
    item.value = response.data.item;
    alert?.show("success", response.msg);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Inicializar
onMounted(() => {
  getMeta();
  getItem();
});
</script>
