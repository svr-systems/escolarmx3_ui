<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack
            :route="{
              name: routeName + (!isStoreMode ? '/show' : ''),
              params: {
                student_id: getEncodeId(studentId),
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
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      label="Nivel educativo"
                      v-model="item.level_id"
                      :items="levels"
                      :loading="levelsLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Institución educativa"
                      v-model="item.institution_name"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="100"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Carrera"
                      v-model="item.name"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="100"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      label="Estado"
                      v-model="item.municipality.state_id"
                      :items="states"
                      :loading="statesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                      @update:modelValue="getMunicipalities"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      label="Municipio"
                      v-model="item.municipality_id"
                      :items="municipalities"
                      :loading="municipalitiesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <InpDate
                      label="Inicio"
                      v-model="item.start_at"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <InpDate
                      label="Fin"
                      v-model="item.end_at"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Núm. cédula"
                      v-model="item.license_number"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="20"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3" class="d-flex">
                    <v-file-input
                      label="Cédula (PDF)*"
                      v-model="item.license_doc"
                      variant="outlined"
                      density="compact"
                      prepend-icon=""
                      show-size
                      accept=".pdf"
                      :rules="rules.fileOptional"
                      :disabled="item.license_dlt"
                    />
                    <div
                      v-if="
                        !isStoreMode && item.license_path && !item.license_doc
                      "
                    >
                      <BtnDwd
                        :value="item.license_b64"
                        :disabled="item.license_dlt"
                      />
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        :color="item.license_dlt ? 'error' : undefined"
                        @click.prevent="item.license_dlt = !item.license_dlt"
                      >
                        <v-icon size="small">
                          mdi-delete{{ item.license_dlt ? "-off" : "" }}
                        </v-icon>
                        <v-tooltip activator="parent" location="bottom">
                          {{
                            item.license_dlt
                              ? "Revertir eliminación"
                              : "Eliminar"
                          }}
                        </v-tooltip>
                      </v-btn>
                    </div>
                  </v-col>
                  <v-col cols="12" md="3" class="d-flex">
                    <v-file-input
                      label="Certificado (PDF)*"
                      v-model="item.certificate_doc"
                      variant="outlined"
                      density="compact"
                      prepend-icon=""
                      show-size
                      accept=".pdf"
                      :rules="rules.fileOptional"
                      :disabled="item.certificate_dlt"
                    />
                    <div
                      v-if="
                        !isStoreMode &&
                        item.certificate_path &&
                        !item.certificate_doc
                      "
                    >
                      <BtnDwd
                        :value="item.certificate_b64"
                        :disabled="item.certificate_dlt"
                      />
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        :color="item.certificate_dlt ? 'error' : undefined"
                        @click.prevent="
                          item.certificate_dlt = !item.certificate_dlt
                        "
                      >
                        <v-icon size="small">
                          mdi-delete{{ item.certificate_dlt ? "-off" : "" }}
                        </v-icon>
                        <v-tooltip activator="parent" location="bottom">
                          {{
                            item.certificate_dlt
                              ? "Revertir eliminación"
                              : "Eliminar"
                          }}
                        </v-tooltip>
                      </v-btn>
                    </div>
                  </v-col>
                  <v-col cols="12" md="3" class="d-flex">
                    <v-file-input
                      label="Título (PDF)*"
                      v-model="item.title_doc"
                      variant="outlined"
                      density="compact"
                      prepend-icon=""
                      show-size
                      accept=".pdf"
                      :rules="rules.fileOptional"
                      :disabled="item.title_dlt"
                    />
                    <div
                      v-if="!isStoreMode && item.title_path && !item.title_doc"
                    >
                      <BtnDwd
                        :value="item.title_b64"
                        :disabled="item.title_dlt"
                      />
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        :color="item.title_dlt ? 'error' : undefined"
                        @click.prevent="item.title_dlt = !item.title_dlt"
                      >
                        <v-icon size="small">
                          mdi-delete{{ item.title_dlt ? "-off" : "" }}
                        </v-icon>
                        <v-tooltip activator="parent" location="bottom">
                          {{
                            item.title_dlt ? "Revertir eliminación" : "Eliminar"
                          }}
                        </v-tooltip>
                      </v-btn>
                    </div>
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
import { getObj, getFormData } from "@/utils/helpers";

// Componentes
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import BtnDwd from "@/components/BtnDwd.vue";
import InpDate from "@/components/InpDate.vue";

// Constantes fijas
const routeName = "student_degrees";

// Estado y referencias
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

// Estado reactivo
const studentId = ref(getDecodeId(route.params.student_id));
const itemId = ref(route.params.id ? getDecodeId(route.params.id) : null);
const isStoreMode = ref(!itemId.value);
const isLoading = ref(true);
const formRef = ref(null);
const item = ref(null);
const rules = getRules();
const levels = ref([]);
const levelsLoading = ref(true);
const states = ref([]);
const statesLoading = ref(true);
const municipalities = ref([]);
const municipalitiesLoading = ref(false);

// Obtener catálogos
const getCatalogs = async () => {
  let endpoint = null;
  let response = null;

  try {
    endpoint = `${URL_API}/states`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    states.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    statesLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/levels`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    levels.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    levelsLoading.value = false;
  }
};

// Obtener datos
const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      id: null,
      is_active: 1,
      student_id: studentId.value,
      level_id: null,
      institution_name: null,
      name: null,
      municipality: {
        state_id: null,
      },
      municipality_id: null,
      start_at: null,
      end_at: null,
      license_number: null,
      license_path: null,
      license_doc: null,
      license_dlt: false,
      certificate_path: null,
      certificate_doc: null,
      certificate_dlt: false,
      title_path: null,
      title_doc: null,
      title_dlt: false,
    };
    isLoading.value = false;
  } else {
    try {
      const endpoint = `${URL_API}/students/${routeName}/${itemId.value}`;
      const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
      item.value = getRsp(response).data.item;

      getMunicipalities(true);
    } catch (err) {
      alert?.show("red-darken-1", getErr(err));
    } finally {
      isLoading.value = false;
    }
  }
};

const getMunicipalities = async (mounted = false) => {
  const stateId = item.value.municipality.state_id;
  municipalitiesLoading.value = true;
  if (!mounted) {
    municipalities.value = [];
    item.value.municipality_id = null;
  }

  try {
    const endpoint = `${URL_API}/municipalities`;
    const response = await axios.get(endpoint, {
      params: { state_id: stateId },
      ...getHdrs(store.getAuth?.token),
    });
    municipalities.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    municipalitiesLoading.value = false;
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
  payload.student_id = studentId.value;

  try {
    const endpoint = `${URL_API}/students/${routeName}${
      !isStoreMode.value ? `/${payload.id}` : ""
    }`;
    const response = getRsp(
      await axios.post(
        endpoint,
        getFormData(payload),
        getHdrs(store.getAuth?.token, true)
      )
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
