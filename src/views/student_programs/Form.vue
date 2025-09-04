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
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      label="Carrera"
                      v-model="item.program_id"
                      :items="programs"
                      :loading="programsLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      label="Ciclo de ingreso"
                      v-model="item.cycle_entry_id"
                      :items="cycles"
                      :loading="cyclesLoading"
                      item-value="id"
                      item-title="code"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-switch
                      label="Equivalencia"
                      v-model="item.is_equivalency"
                      color="info"
                      density="compact"
                      class="ml-1"
                    />
                  </v-col>
                  <v-col
                    v-if="item.is_equivalency"
                    cols="12"
                    md="6"
                    class="d-flex"
                  >
                    <v-file-input
                      label="Evidencia de equivalencia (PDF)*"
                      v-model="item.equivalency_doc"
                      variant="outlined"
                      density="compact"
                      prepend-icon=""
                      show-size
                      accept=".pdf"
                      :rules="rules.imageOptional"
                      :disabled="item.equivalency_dlt"
                    />
                    <div
                      v-if="
                        !isStoreMode &&
                        item.equivalency_path &&
                        !item.equivalency_doc
                      "
                    >
                      <BtnDwd
                        :value="item.equivalency_b64"
                        :disabled="item.equivalency_dlt"
                      />
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        :color="item.equivalency_dlt ? 'error' : undefined"
                        @click.prevent="
                          item.equivalency_dlt = !item.equivalency_dlt
                        "
                      >
                        <v-icon size="small">
                          mdi-delete{{ item.equivalency_dlt ? "-off" : "" }}
                        </v-icon>
                        <v-tooltip activator="parent" location="bottom">
                          {{
                            item.equivalency_dlt
                              ? "Revertir eliminación"
                              : "Eliminar"
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

// Constantes fijas
const routeName = "student_programs";

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
const programs = ref([]);
const programsLoading = ref(true);
const cycles = ref([]);
const cyclesLoading = ref(true);

// Obtener catálogos
const getCatalogs = async () => {
  let endpoint = null;
  let response = null;

  try {
    endpoint = `${URL_API}/programs`;
    response = await axios.get(endpoint, {
      params: {
        is_active: 1,
        filter: 0,
        campus_id: store.getAuth?.campus_id,
      },
      ...getHdrs(store.getAuth?.token),
    });
    programs.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    programsLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/cycles`;
    response = await axios.get(endpoint, {
      params: {
        is_active: 1,
        filter: 0,
      },
      ...getHdrs(store.getAuth?.token),
    });
    cycles.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    cyclesLoading.value = false;
  }
};

// Obtener datos
const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      id: null,
      is_active: 1,
      student_id: studentId.value,
      program_id: null,
      cycle_entry_id: null,
      is_equivalency: false,
      equivalency_path: null,
      equivalency_doc: null,
      equivalency_dlt: false,
      cycle_dropout_id: null,
      cycle_reentry_id: null,
      cycle_graduated_id: null,
    };
    isLoading.value = false;
  } else {
    try {
      const endpoint = `${URL_API}/students/${routeName}/${itemId.value}`;
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
