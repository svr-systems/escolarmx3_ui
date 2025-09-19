<template>
  <v-card :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack :route="{ name: routeName }" />
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>
        <v-col v-if="item" cols="2" class="text-right">
          <v-btn
            v-if="item.user.is_active"
            icon
            variant="flat"
            size="x-small"
            color="warning"
            :to="{
              name: `${routeName}/update`,
              params: { id: getEncodeId(itemId) },
            }"
          >
            <v-icon>mdi-pencil</v-icon>
            <v-tooltip activator="parent" location="left">Editar</v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text v-if="item">
      <v-row>
        <v-col v-if="!item.user.is_active" cols="12">
          <v-alert type="error" density="compact" class="rounded">
            <v-row dense>
              <v-col class="grow pt-2">El registro se encuentra inactivo</v-col>
              <v-col
                v-if="[1, 2].includes(store.getAuth?.user?.role_id)"
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
                  <CardTitle text="DATOS GENERALES" sub />
                </v-col>
                <v-col cols="1" class="text-right" />
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="6">
                  <VisVal label="Nombre" :value="item.user.name" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal
                    label="Apellido paterno"
                    :value="item.user.surname_p"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal
                    label="Apellido materno"
                    :value="item.user.surname_m"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="CURP" :value="item.user.curp" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="E-mail" :value="item.user.email" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Teléfono" :value="item.user.phone" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal
                    label="Estado civil"
                    :value="item.user.marital_status?.name"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-row dense>
                <v-col cols="11">
                  <CardTitle text="DOCUMENTOS" sub />
                </v-col>
                <v-col cols="1" class="text-right" />
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="4">
                  <VisDoc
                    label="Fotografía"
                    :value="item.user.avatar_b64"
                    img
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <VisDoc label="CURP (PDF)" :value="item.user.curp_b64" />
                </v-col>
                <v-col cols="12" md="4">
                  <VisDoc
                    label="Acta de nacimiento  (PDF)"
                    :value="item.user.birth_certificate_b64"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <VisDoc label="INE (PDF)" :value="item.user.ine_b64" />
                </v-col>
                <v-col cols="12" md="4">
                  <VisDoc label="Currículum Vitae (PDF)" :value="item.cv_b64" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-row dense>
                <v-col cols="11">
                  <CardTitle text="PERSONA DE CONTACTO" sub />
                </v-col>
                <v-col cols="1" class="text-right" />
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="3">
                  <VisVal
                    label="Parentesco"
                    :value="item.user.contact_kinship?.name"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <VisVal label="Nombre" :value="item.user.contact_name" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Teléfono" :value="item.user.contact_phone" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-row dense>
                <v-col cols="11">
                  <CardTitle text="ESTUDIOS ANTECEDENTES" sub />
                </v-col>
                <v-col cols="1" class="text-right" />
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-row
                dense
                v-for="(teacher_degree, i) of item.teacher_degrees"
                :key="i"
              >
                <v-col cols="12" md="4">
                  <VisVal
                    label="Nivel educativo"
                    :value="teacher_degree.level?.name"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <VisVal
                    label="Institución educativa"
                    :value="teacher_degree.institution_name"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <VisVal label="Carrera" :value="teacher_degree.name" />
                </v-col>
                <v-col cols="12" md="4">
                  <VisVal
                    label="Núm. cédula"
                    :value="teacher_degree.license_number"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <VisDoc
                    label="Cédula (PDF)"
                    :value="teacher_degree.license_b64"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <VisDoc
                    label="Título (PDF)"
                    :value="teacher_degree.title_b64"
                  />
                </v-col>
                <v-col cols="12" class="pb-4">
                  <v-divider />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-row dense>
                <v-col cols="11">
                  <CardTitle text="CAMPUS" sub />
                </v-col>
                <v-col cols="1" class="text-right" />
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-row
                dense
                v-for="(user_campus, i) of item.user.user_campuses"
                :key="i"
              >
                <v-col cols="12">
                  <VisVal label="Nombre" :value="user_campus.campus?.name" />
                </v-col>
                <v-col cols="12" class="pb-4">
                  <v-divider />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          v-if="
            item.user.is_active && [1, 2].includes(store.getAuth?.user?.role_id)
          "
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

    <DlgReg v-model="regDialog" :item="item?.user" />
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
import VisDoc from "@/components/VisDoc.vue";

// Constantes fijas
const routeName = "teachers";

// Estado y referencias
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

// Estado reactivo
const itemId = ref(getDecodeId(route.params.id));
const isLoading = ref(true);
const item = ref(null);
const regDialog = ref(false);

// Obtener registro
const getItem = async () => {
  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
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
    const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
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
    const endpoint = `${URL_API}/${routeName}/restore`;
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
  getItem();
});
</script>
