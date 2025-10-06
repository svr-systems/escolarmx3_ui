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
                program_cycle_id: getEncodeId(programCycleId),
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
      <div class="text-caption text-center">
        <div v-if="programMeta && programCycleMeta">
          {{
            `${programMeta.campus.name} | ${programMeta.name} | ${programMeta.code} | ${programMeta.plan_year}`
          }}
          <br />
          <small>
            {{ `${programCycleMeta.cycle.code_full}` }}
          </small>
        </div>
        <v-progress-circular v-else indeterminate size="12" class="pt-10" />
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
                  <v-col cols="12">
                    <v-autocomplete
                      label="Asignatura"
                      v-model="item.course_id"
                      :items="courses"
                      :loading="coursesLoading"
                      item-value="id"
                      item-title="name_code"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                      autocomplete="off"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      label="Docente"
                      v-model="item.teacher_id"
                      :items="teachers"
                      :loading="teachersLoading"
                      item-value="id"
                      item-title="full_name_curp"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                      autocomplete="off"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Identificador*"
                      v-model="item.section"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="10"
                      counter
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Aula*"
                      v-model="item.room_name"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Capacidad*"
                      v-model="item.capacity_limit"
                      type="number"
                      variant="outlined"
                      density="compact"
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
                    <CardTitle text="HORARIOS" sub />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <template
                  v-for="(group_schedule, i) in item.group_schedules"
                  :key="i"
                >
                  <v-row dense v-if="group_schedule.is_active == 1">
                    <v-col cols="12" md="5">
                      <v-select
                        label="Día"
                        v-model="group_schedule.weekday_id"
                        :items="weekdays"
                        :loading="weekdaysLoading"
                        item-value="id"
                        item-title="name"
                        variant="outlined"
                        density="compact"
                        :rules="rules.required"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <InpTime
                        label="Inicia"
                        v-model="group_schedule.start_time"
                        :rules="rules.required"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <InpTime
                        label="Finaliza"
                        v-model="group_schedule.end_time"
                        :rules="rules.required"
                      />
                    </v-col>
                    <v-col cols="1" class="text-right pt-2">
                      <v-btn
                        icon
                        size="x-small"
                        color="error"
                        @click="groupSchedulesRemove(i)"
                      >
                        <v-icon size="x-small">mdi-minus</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="12" class="pb-4">
                      <v-divider />
                    </v-col>
                  </v-row>
                </template>
                <v-row dense>
                  <v-col cols="12">
                    <v-btn
                      size="x-small"
                      color="warning"
                      @click="groupSchedulesAdd()"
                    >
                      Agregar
                      <v-icon size="x-small" end>mdi-plus</v-icon>
                    </v-btn>
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
import { ref, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";
import { getObj } from "@/utils/helpers";

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import InpTime from "@/components/InpTime.vue";

const routeName = "groups";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

const programId = ref(getDecodeId(route.params.program_id));
const programMeta = ref(null);
const programCycleId = ref(getDecodeId(route.params.program_cycle_id));
const programCycleMeta = ref(null);
const itemId = ref(route.params.id ? getDecodeId(route.params.id) : null);
const isStoreMode = ref(!itemId.value);
const isLoading = ref(true);
const formRef = ref(null);
const item = ref(null);
const rules = getRules();
const courses = ref([]);
const coursesLoading = ref(true);
const teachers = ref([]);
const teachersLoading = ref(true);
const weekdays = ref([]);
const weekdaysLoading = ref(true);

const getCatalogs = async () => {
  let endpoint = null;
  let response = null;

  try {
    endpoint = `${URL_API}/programs/courses`;
    response = await axios.get(endpoint, {
      params: {
        is_active: 1,
        filter: 0,
        program_id: programId.value,
      },
      ...getHdrs(store.getAuth?.token),
    });
    courses.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    coursesLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/teachers/for_program`;
    response = await axios.get(endpoint, {
      params: {
        program_id: programId.value,
      },
      ...getHdrs(store.getAuth?.token),
    });
    teachers.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    teachersLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/weekdays`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    weekdays.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    weekdaysLoading.value = false;
  }
};

const getMeta = async () => {
  let endpoint = null;
  let response = null;

  try {
    endpoint = `${URL_API}/programs/${programId.value}`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    programMeta.value = getRsp(response).data.item;

    endpoint = `${URL_API}/program_cycles/${programCycleId.value}`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    programCycleMeta.value = getRsp(response).data.item;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  }
};

const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      id: null,
      is_active: 1,
      program_cycle_id: programCycleId.value,
      course_id: null,
      teacher_id: null,
      section: null,
      capacity_limit: 0,
      room_name: null,
      group_schedules: [],
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

const groupSchedulesAdd = async () => {
  item.value.group_schedules.push({
    id: null,
    is_active: 1,
    weekday_id: null,
    start_time: null,
    end_time: null,
  });
};

const groupSchedulesRemove = async (i) => {
  if (item.value.group_schedules[i].id === null) {
    item.value.group_schedules.splice(i, 1);
  } else {
    item.value.group_schedules[i].is_active = 0;
  }
};

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
    const endpoint = `${URL_API}/${routeName}${
      !isStoreMode.value ? `/${payload.id}` : ""
    }`;
    const response = getRsp(
      await axios.post(endpoint, payload, getHdrs(store.getAuth?.token))
    );

    alert?.show("success", response.msg);

    router.push({
      name: `${routeName}/show`,
      params: {
        program_id: getEncodeId(programId.value),
        program_cycle_id: getEncodeId(programCycleId.value),
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

onMounted(() => {
  getMeta();
  getCatalogs();
  getItem();
});
</script>
