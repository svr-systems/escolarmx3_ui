<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack
            :route="{
              name: routeName + (!isStoreMode ? '/show' : ''),
              params: {
                program_id: getEncodeId(programId),
                id: getEncodeId(itemId),
              },
            }"
          />
          <CardTitle :text="$route.meta.title" :icon="$route.meta.icon" />
        </v-col>
        <v-col cols="2" class="text-right" />
      </v-row>
    </v-card-title>

    <v-card-text v-if="item">
      <v-form ref="formRef" @submit.prevent>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-row dense>
                  <v-col cols="11">
                    <CardTitle
                      :text="`DATOS GENERALES${
                        isStoreMode ? '' : ' | ' + (item.uiid || '')
                      }`"
                      sub
                    />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="8">
                    <v-text-field
                      label="Nombre"
                      v-model="item.name"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-text-field
                      label="Clave"
                      v-model="item.code"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="10"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-text-field
                      label="Clave interna"
                      v-model="item.alt_code"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="10"
                      counter
                      :rules="rules.textOptional"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      label="Tipo"
                      v-model="item.course_type_id"
                      :items="courseTypes"
                      :loading="courseTypesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-text-field
                      label="Creditos"
                      v-model="item.credits"
                      type="number"
                      variant="outlined"
                      density="compact"
                      max="999"
                      min="0.1"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-text-field
                      label="Duracion de sesión (min.)"
                      v-model="item.session_minutes"
                      type="number"
                      variant="outlined"
                      density="compact"
                      max="999"
                      min="0"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Periodo al que pertenece"
                      v-model="item.term"
                      type="number"
                      variant="outlined"
                      density="compact"
                      min="1"
                      max="99"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-autocomplete
                      label="Asignatura precedente"
                      v-model="item.prerequisite_course_id"
                      :items="prerequisiteCourses"
                      :loading="prerequisiteCoursesLoading"
                      item-value="id"
                      :item-title="(i) => `${i.name} | ${i.code}`"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <div class="text-right">
              <v-btn
                icon
                variant="flat"
                size="x-small"
                :color="isStoreMode ? 'success' : 'warning'"
                @click.prevent="handleAction"
                :loading="isLoading"
              >
                <v-icon>mdi-check</v-icon>
                <v-tooltip activator="parent" location="left">
                  Continuar
                </v-tooltip>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
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
import { getRules } from "@/utils/validators";
import { getObj } from "@/utils/helpers";

// Componentes
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";

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
const itemId = ref(route.params.id ? getDecodeId(route.params.id) : null);
const isStoreMode = ref(!itemId.value);
const isLoading = ref(true);
const formRef = ref(null);
const item = ref(null);
const rules = getRules();
const courseTypes = ref([]);
const courseTypesLoading = ref(true);
const prerequisiteCourses = ref([]);
const prerequisiteCoursesLoading = ref(true);

// Obtener catálogos
const getCatalogs = async () => {
  let endpoint = null;
  let response = null;

  try {
    endpoint = `${URL_API}/course_types`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    courseTypes.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    courseTypesLoading.value = false;
  }

  try {
    const endpoint = `${URL_API}/programs/${routeName}`;
    const response = await axios.get(endpoint, {
      params: {
        is_active: 1,
        filter: 0,
        program_id: programId.value,
      },
      ...getHdrs(store.getAuth?.token),
    });
    prerequisiteCourses.value = getRsp(response).data.items;
    prerequisiteCourses.value.push({
      id: null,
      name: "NO APLICA",
      code: "N/A",
    });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    prerequisiteCoursesLoading.value = false;
  }
};

// Obtener datos
const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      program_id: programId.value,
      name: null,
      course_type_id: null,
      code: null,
      alt_code: null,
      credits: null,
      session_minutes: "0",
      term: null,
      prerequisite_course_id: null,
    };
    isLoading.value = false;
  } else {
    try {
      const endpoint = `${URL_API}/programs/${routeName}/${itemId.value}`;
      const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
      item.value = getRsp(response).data.item;
    } catch (err) {
      alert?.show("red-darken-1", getErr(err));
    } finally {
      isLoading.value = false;
    }
  }
};

// Agregar o editar
const handleAction = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma ${isStoreMode.value ? "agregar" : "editar"} registro?`
  );
  if (!confirmed) return;

  isLoading.value = true;
  const payload = getObj(item.value, isStoreMode.value);
  payload.program_id = programId.value;

  try {
    const endpoint = `${URL_API}/programs/${routeName}${
      !isStoreMode.value ? `/${payload.id}` : ""
    }`;
    const response = getRsp(
      await axios.post(endpoint, payload, getHdrs(store.getAuth?.token))
    );

    alert?.show("success", response.msg);

    router.push({
      name: `${routeName}/show`,
      params: {
        id: getEncodeId(
          isStoreMode.value ? response.data.item.id : itemId.value
        ),
      },
    });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Inicialización
onMounted(() => {
  getCatalogs();
  getItem();
});
</script>
