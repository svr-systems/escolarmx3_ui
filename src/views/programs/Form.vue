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
                  <v-col cols="12" md="8">
                    <v-text-field
                      label="Nombre"
                      v-model="item.name"
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
                      label="RVOE"
                      v-model="item.code"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="10"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <InpDate
                      label="Fecha de expedición"
                      v-model="item.issued_at"
                      :rules="rules.required"
                      :before="true"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      label="Autorización"
                      v-model="item.accreditation_id"
                      :items="accreditations"
                      :loading="accreditationsLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      label="Modalidad"
                      v-model="item.modality_id"
                      :items="modalities"
                      :loading="modalitiesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      label="Turno"
                      v-model="item.shift_id"
                      :items="shifts"
                      :loading="shiftsLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="CURP del responsable*"
                      v-model="item.responsible_curp"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="18"
                      counter
                      :rules="rules.curpOptional"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <InpYear
                      label="Año del plan"
                      v-model="item.plan_year"
                      :rules="rules.required"
                      :maxYear="currentYear"
                      :minYear="currentYear - 40"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
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
                    <v-select
                      label="Tipo de periodo"
                      v-model="item.term_id"
                      :items="terms"
                      :loading="termsLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Número de periodos"
                      v-model="item.terms_count"
                      type="number"
                      variant="outlined"
                      density="compact"
                      min="1"
                      max="99"
                      :rules="rules.required"
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
                    <CardTitle text="CALIFICACIONES" sub />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Mínima"
                      v-model="item.grade_min"
                      type="number"
                      variant="outlined"
                      density="compact"
                      max="999"
                      min="0.1"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Máxima"
                      v-model="item.grade_max"
                      type="number"
                      variant="outlined"
                      density="compact"
                      max="999"
                      min="0.1"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Minima aprobatoria"
                      v-model="item.grade_pass"
                      type="number"
                      variant="outlined"
                      density="compact"
                      max="999"
                      min="0.1"
                      :rules="rules.required"
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
import { getObj, getFormData, getCurrentYear } from "@/utils/helpers";
import { getDateTime } from "@/utils/formatters";

// Componentes
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import InpDate from "@/components/InpDate.vue";
import InpYear from "@/components/InpYear.vue";

// Constantes fijas
const routeName = "programs";
const currentDate = ref(getDateTime("-", "", "", false));
const currentYear = ref(getCurrentYear());

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
const accreditations = ref([]);
const accreditationsLoading = ref(true);
const modalities = ref([]);
const modalitiesLoading = ref(true);
const shifts = ref([]);
const shiftsLoading = ref(true);
const levels = ref([]);
const levelsLoading = ref(true);
const terms = ref([]);
const termsLoading = ref(true);

// Obtener catálogos
const getCatalogs = async () => {
  let endpoint = null;
  let response = null;

  try {
    endpoint = `${URL_API}/accreditations`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    accreditations.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    accreditationsLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/modalities`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    modalities.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    modalitiesLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/shifts`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    shifts.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    shiftsLoading.value = false;
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
  
  try {
    endpoint = `${URL_API}/terms`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    terms.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    termsLoading.value = false;
  }
};

// Obtener datos
const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      id: null,
      is_active: 1,
      campus_id: store.getAuth?.campus_id,
      name: null,
      code: null,
      issued_at: currentDate.value,
      accreditation_id: null,
      modality_id: null,
      shift_id: null,
      responsible_curp: null,
      plan_year: currentYear.value,
      level_id: null,
      term_id: null,
      terms_count: null,
      grade_min: null,
      grade_max: null,
      grade_pass: null,
    };
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
  const payload = getObj(item.value, isStoreMode.value);

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
