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
      <div cols="12" class="text-caption text-center">
        <span v-if="studentMeta">
          {{ `${studentMeta.user.full_name} | ${studentMeta.user.curp}` }}
        </span>
        <v-progress-circular v-else indeterminate size="12" />
      </div>
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
                  <v-col cols="12" md="3">
                    <InpDate
                      label="Fecha de recepción"
                      v-model="item.received_at"
                      :rules="rules.required"
                      :before="true"
                      :disabled="store.getAuth?.user?.role_id !== 2"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      label="Tipo"
                      v-model="item.document_type_id"
                      :items="documentTypes"
                      :loading="documentTypesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3" class="d-flex">
                    <v-file-input
                      label="Archivo (PDF)"
                      v-model="item.document_doc"
                      variant="outlined"
                      density="compact"
                      prepend-icon=""
                      show-size
                      accept=".pdf"
                      :rules="rules.fileRequired"
                      :disabled="item.document_dlt"
                    />
                    <div
                      v-if="
                        !isStoreMode && item.document_path && !item.document_doc
                      "
                    >
                      <BtnDwd
                        :value="item.document_b64"
                        :disabled="item.document_dlt"
                      />
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        :color="item.document_dlt ? 'error' : undefined"
                        @click.prevent="item.document_dlt = !item.document_dlt"
                      >
                        <v-icon size="small">
                          mdi-delete{{ item.document_dlt ? "-off" : "" }}
                        </v-icon>
                        <v-tooltip activator="parent" location="bottom">
                          {{
                            item.document_dlt
                              ? "Revertir eliminación"
                              : "Eliminar"
                          }}
                        </v-tooltip>
                      </v-btn>
                    </div>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Número de copias"
                      v-model="item.copies_count"
                      type="number"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-switch
                      label="¿Deja original?"
                      v-model="item.is_original_left"
                      color="info"
                      density="compact"
                      class="ml-1"
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
import { getObj, getFormData } from "@/utils/helpers";
import { getDateTime } from "@/utils/formatters";

// Componentes
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import InpDate from "@/components/InpDate.vue";
import BtnDwd from "@/components/BtnDwd.vue";

// Constantes fijas
const routeName = "student_documents";

// Estado y referencias
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

// Estado reactivo
const studentId = ref(getDecodeId(route.params.student_id));
const studentMeta = ref(null);
const itemId = ref(route.params.id ? getDecodeId(route.params.id) : null);
const isStoreMode = ref(!itemId.value);
const isLoading = ref(true);
const formRef = ref(null);
const item = ref(null);
const rules = getRules();
const documentTypes = ref([]);
const documentTypesLoading = ref(true);

// Obtener catálogos
const getCatalogs = async () => {
  let endpoint = null;
  let response = null;

  try {
    endpoint = `${URL_API}/document_types`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    documentTypes.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    documentTypesLoading.value = false;
  }
};

const getMeta = async () => {
  try {
    const endpoint = `${URL_API}/students/${studentId.value}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    studentMeta.value = getRsp(response).data.item;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Obtener datos
const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      id: null,
      is_active: 1,
      student_id: studentId.value,
      received_at: getDateTime("-", "", "", false),
      document_type_id: null,
      is_original_left: false,
      copies_count: 0,
      document_path: null,
      document_doc: null,
      document_dlt: false,
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
  getMeta();
  getCatalogs();
  getItem();
});
</script>
