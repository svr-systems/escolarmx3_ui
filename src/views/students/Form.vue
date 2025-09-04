<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack
            :route="{
              name: routeName + (!isStoreMode ? '/show' : ''),
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
                    <v-text-field
                      label="Nombre"
                      v-model="item.user.name"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Apellido paterno"
                      v-model="item.user.surname_p"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="25"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Apellido materno*"
                      v-model="item.user.surname_m"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="25"
                      counter
                      :rules="rules.textOptional"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select
                      label="Estado civil"
                      v-model="item.user.marital_status_id"
                      :items="maritalStatuses"
                      :loading="maritalStatusesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="CURP"
                      v-model="item.user.curp"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="18"
                      counter
                      :rules="rules.curpRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3" class="d-flex">
                    <v-file-input
                      label="CURP (PDF)*"
                      v-model="item.user.curp_doc"
                      variant="outlined"
                      density="compact"
                      prepend-icon=""
                      show-size
                      accept=".pdf"
                      :rules="rules.imageOptional"
                      :disabled="item.user.curp_dlt"
                    />
                    <div
                      v-if="
                        !isStoreMode &&
                        item.user.curp_path &&
                        !item.user.curp_doc
                      "
                    >
                      <BtnDwd
                        :value="item.user.curp_b64"
                        :disabled="item.user.curp_dlt"
                      />
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        :color="item.user.curp_dlt ? 'error' : undefined"
                        @click.prevent="
                          item.user.curp_dlt = !item.user.curp_dlt
                        "
                      >
                        <v-icon size="small">
                          mdi-delete{{ item.user.curp_dlt ? "-off" : "" }}
                        </v-icon>
                        <v-tooltip activator="parent" location="bottom">
                          {{
                            item.user.curp_dlt
                              ? "Revertir eliminación"
                              : "Eliminar"
                          }}
                        </v-tooltip>
                      </v-btn>
                    </div>
                  </v-col>
                  <v-col cols="12" md="3" class="d-flex">
                    <v-file-input
                      label="Fotografía*"
                      v-model="item.user.avatar_doc"
                      variant="outlined"
                      density="compact"
                      prepend-icon=""
                      show-size
                      accept=".jpg,.jpeg,.png"
                      :rules="rules.imageOptional"
                      :disabled="item.user.avatar_dlt"
                    />
                    <div
                      v-if="
                        !isStoreMode &&
                        item.user.avatar_path &&
                        !item.user.avatar_doc
                      "
                    >
                      <BtnDwd
                        :value="item.user.avatar_b64"
                        :disabled="item.user.avatar_dlt"
                      />
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        :color="item.user.avatar_dlt ? 'error' : undefined"
                        @click.prevent="
                          item.user.avatar_dlt = !item.user.avatar_dlt
                        "
                      >
                        <v-icon size="small">
                          mdi-delete{{ item.user.avatar_dlt ? "-off" : "" }}
                        </v-icon>
                        <v-tooltip activator="parent" location="bottom">
                          {{
                            item.user.avatar_dlt
                              ? "Revertir eliminación"
                              : "Eliminar"
                          }}
                        </v-tooltip>
                      </v-btn>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="E-mail"
                      v-model="item.user.email"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="65"
                      counter
                      :rules="rules.emailRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Teléfono"
                      v-model="item.user.phone"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="10"
                      counter
                      :rules="rules.phoneRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3" class="d-flex">
                    <v-file-input
                      label="Acta de nacimiento (PDF)*"
                      v-model="item.birth_certificate_doc"
                      variant="outlined"
                      density="compact"
                      prepend-icon=""
                      show-size
                      accept=".pdf"
                      :rules="rules.imageOptional"
                      :disabled="item.birth_certificate_dlt"
                    />
                    <div
                      v-if="
                        !isStoreMode &&
                        item.birth_certificate_path &&
                        !item.birth_certificate_doc
                      "
                    >
                      <BtnDwd
                        :value="item.birth_certificate_b64"
                        :disabled="item.birth_certificate_dlt"
                      />
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        :color="
                          item.birth_certificate_dlt ? 'error' : undefined
                        "
                        @click.prevent="
                          item.birth_certificate_dlt =
                            !item.birth_certificate_dlt
                        "
                      >
                        <v-icon size="small">
                          mdi-delete{{
                            item.birth_certificate_dlt ? "-off" : ""
                          }}
                        </v-icon>
                        <v-tooltip activator="parent" location="bottom">
                          {{
                            item.birth_certificate_dlt
                              ? "Revertir eliminación"
                              : "Eliminar"
                          }}
                        </v-tooltip>
                      </v-btn>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Núm. de matrícula (No necesaria para el sistema)*"
                      v-model="item.student_number"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="15"
                      counter
                      :rules="rules.textOptional"
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
                    <CardTitle text="TUTOR" sub />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="3">
                    <v-select
                      label="Parentesco*"
                      v-model="item.guardian_kinship_id"
                      :items="kinships"
                      :loading="kinshipsLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Nombre*"
                      v-model="item.guardian_name"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="100"
                      counter
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Teléfono*"
                      v-model="item.guardian_phone"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="10"
                      counter
                      :rules="rules.phoneOptional"
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
import { getObj, extractNestedProp, getFormData } from "@/utils/helpers";
import { getUserObj } from "@/utils/objects";

// Componentes
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import BtnDwd from "@/components/BtnDwd.vue";

// Constantes fijas
const routeName = "students";

// Estado y referencias
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

// Estado reactivo
const itemId = ref(route.params.id ? getDecodeId(route.params.id) : null);
const isStoreMode = ref(!itemId.value);
const isLoading = ref(true);
const formRef = ref(null);
const item = ref(null);
const rules = getRules();
const maritalStatuses = ref([]);
const maritalStatusesLoading = ref(true);
const kinships = ref([]);
const kinshipsLoading = ref(true);

// Obtener catálogos
const getCatalogs = async () => {
  let endpoint = null;
  let response = null;

  try {
    endpoint = `${URL_API}/marital_statuses`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    maritalStatuses.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    maritalStatusesLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/kinships`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    kinships.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    kinshipsLoading.value = false;
  }
};

// Obtener datos
const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      id: null,
      user: getUserObj(),
      student_number: null,
      guardian_kinship_id: null,
      guardian_name: null,
      guardian_phone: null,
      birth_certificate_path: null,
      birth_certificate_doc: null,
      birth_certificate_dlt: false,
    };

    item.value.user.user_campuses[0].campus_id = store.getAuth?.campus_id;
    isLoading.value = false;
  } else {
    try {
      const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
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
  let payload = getObj(item.value, isStoreMode.value);
  payload = extractNestedProp(payload, "user", "curp_doc");
  payload = extractNestedProp(payload, "user", "avatar_doc");

  try {
    const endpoint = `${URL_API}/${routeName}${
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
