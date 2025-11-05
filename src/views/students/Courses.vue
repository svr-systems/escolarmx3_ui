<template>
  <v-card elevation="24" :disabled="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack
            :route="{
              name: `${routeName}/show`,
              params: {
                id: getEncodeId(itemId),
              },
            }"
          />
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>
        <v-col cols="2" class="text-right"> </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col cols="12" class="text-caption text-center">
          <div v-if="meta">
            <div class="font-weight-light text-h6">
              {{ meta.full_name }}
            </div>
            <div class="text-caption font-weight-thin text-medium-emphasis">
              <small>{{ meta.curp }}</small>
            </div>
            <div class="text-caption font-weight-thin text-medium-emphasis">
              {{
                `${meta.program.campus.name} | ${meta.program.name} | ${meta.program.code} | ${meta.program.plan_year}`
              }}
            </div>
          </div>
          <v-progress-circular v-else indeterminate size="12" />
        </v-col>
        <v-col cols="12" md="9" class="pb-0"> </v-col>

        <v-col cols="12" md="3" class="pb-0">
          <v-text-field
            v-model="search"
            label="Buscar"
            type="text"
            variant="outlined"
            density="compact"
            append-inner-icon="mdi-magnify"
            :disabled="isCoursesEmpty"
            @click="groupStudentAdd()"
          />
        </v-col>

        <v-col cols="12">
          <v-data-table
            density="compact"
            :items="courses"
            :headers="headers"
            :search="search"
            :items-per-page="15"
            :loading="isLoading"
            class="text-caption"
          >
            <template #item.key="{ item }">
              <b>{{ item.key + 1 }}</b>
            </template>

            <template #item.group_student.cycle.code="{ item }">
              {{ item.group_student?.cycle?.code ?? "-" }}
            </template>

            <template #item.group_student.enroll_type.name="{ item }">
              {{ item.group_student?.enroll_type?.name ?? "-" }}
            </template>

            <template #item.group_student.enroll_status.name="{ item }">
              {{ item.group_student?.enroll_status?.name ?? "-" }}
            </template>

            <template #item.group_student.final_grade="{ item }">
              {{ item.group_student?.final_grade ?? "-" }}
            </template>

            <template #item.action="{ item }">
              <div class="text-right">
                <v-btn
                  v-if="!item.group_student"
                  icon
                  variant="text"
                  size="x-small"
                  color="success"
                  @click.prevent="groupStudentHandleDlg(item)"
                >
                  <v-icon>mdi-plus</v-icon>
                  <v-tooltip activator="parent" location="left">
                    Agregar
                  </v-tooltip>
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- DIALOGS -->
    <v-dialog
      v-model="groupStudentDlg"
      persistent
      scrim="black"
      max-width="800"
    >
      <v-card :loading="groupStudentLdg" :disabled="groupStudentLdg" flat>
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <span class="font-weight-light text-subtitle-1">ASIGNATURA</span>
          </div>

          <v-btn
            icon
            variant="text"
            size="x-small"
            @click="groupStudentDlg = false"
          >
            <v-icon>mdi-close</v-icon>
            <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
          </v-btn>
        </v-card-title>

        <v-card-text v-if="groupStudent">
          <v-form ref="groupStudentForm" @submit.prevent="groupStudentOnSubmit">
            <v-row dense>
              <v-col cols="12" md="9">
                <VisVal label="Nombre" :value="groupStudent.course.name" />
              </v-col>

              <v-col cols="12" md="3">
                <VisVal
                  label="Tipo"
                  :value="groupStudent.course.course_type.name"
                />
              </v-col>

              <v-col cols="12" md="3">
                <VisVal label="Clave" :value="groupStudent.course.code" />
              </v-col>

              <v-col cols="12" md="3">
                <VisVal
                  label="Clave interna"
                  :value="groupStudent.course.alt_code"
                />
              </v-col>

              <v-col cols="12" md="3">
                <VisVal label="Créditos" :value="groupStudent.course.credits" />
              </v-col>

              <v-col cols="12" md="3">
                <VisVal label="Periodo" :value="groupStudent.course.term" />
              </v-col>

              <v-col cols="12" class="pt-4">
                <v-divider />
              </v-col>

              <v-col cols="12" class="pt-4">
                <v-select
                  label="Grupo"
                  v-model="groupStudent.group_id"
                  :items="groups"
                  :loading="groupsLoading"
                  item-value="id"
                  :item-title="
                    (i) =>
                      `${i.uiid} | ${i.cycle_code} | ${i.teacher_full_name}`
                  "
                  variant="outlined"
                  density="compact"
                  :rules="rules.required"
                />
              </v-col>

              <v-col cols="12">
                <v-select
                  label="Inscripción"
                  v-model="groupStudent.enroll_type_id"
                  :items="enrollTypes"
                  :loading="enrollTypesLoading"
                  item-value="id"
                  item-title="name"
                  variant="outlined"
                  density="compact"
                  :rules="rules.required"
                />
              </v-col>

              <v-col cols="12" class="text-right">
                <v-btn
                  type="submit"
                  icon
                  variant="outlined"
                  size="x-small"
                  color="success"
                  :loading="groupStudentLdg"
                >
                  <v-icon> mdi-plus </v-icon>
                  <v-tooltip activator="parent" location="start">
                    Agregar
                  </v-tooltip>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";
import { getObj } from "@/utils/helpers";

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import VisVal from "@/components/VisVal.vue";

const routeName = "students";
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const route = useRoute();

const itemId = ref(getDecodeId(route.params.id));
const studentProgramId = ref(getDecodeId(route.params.student_program_id));
const meta = ref(null);
const isLoading = ref(false);
const courses = ref([]);
const search = ref("");
const rules = getRules();

const isCoursesEmpty = computed(() => courses.value.length === 0);

const headers = [
  { title: "#", key: "key", filterable: false, sortable: false, width: 40 },
  { title: "Nombre", key: "name" },
  { title: "Tipo", key: "course_type.name" },
  { title: "Clave", key: "code" },
  { title: "Clave interna", key: "alt_code" },
  { title: "Créditos", key: "credits" },
  { title: "Periodo", key: "term" },
  { title: "Ciclo", key: "group_student.cycle.code" },
  { title: "Inscripción", key: "group_student.enroll_type.name" },
  { title: "Estado", key: "group_student.enroll_status.name" },
  { title: "Calificación", key: "group_student.final_grade" },
  { title: "", key: "action", filterable: false, sortable: false, width: 80 },
];

const enrollTypes = ref([]);
const enrollTypesLoading = ref(true);

const getCatalogs = async () => {
  let endpoint = null;
  let response = null;

  try {
    endpoint = `${URL_API}/enroll_types`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    enrollTypes.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    enrollTypesLoading.value = false;
  }
};

const getMeta = async () => {
  try {
    const endpoint = `${URL_API}/${routeName}/student_programs/${studentProgramId.value}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    meta.value = getRsp(response).data.item;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  }
};

const getCourses = async () => {
  isLoading.value = true;
  courses.value = [];

  try {
    const endpoint = `${URL_API}/${routeName}/courses`;
    const response = await axios.get(endpoint, {
      params: {
        student_program_id: studentProgramId.value,
      },
      ...getHdrs(store.getAuth?.token),
    });

    courses.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// groupStudent
const groupStudent = ref(null);
const groupStudentLdg = ref(false);
const groupStudentDlg = ref(false);
const groupStudentForm = ref(null);

const groups = ref([]);
const groupsLoading = ref(false);

const groupStudentHandleDlg = async (course) => {
  groupStudent.value = {
    id: null,
    student_program_id: studentProgramId.value,
    group_id: null,
    enroll_type_id: 1,
    course: course,
  };
  groupStudentLdg.value = false;
  groupStudentDlg.value = true;

  groupStudent.groups = [];
  groupStudent.groupsLoading = true;
  try {
    const endpoint = `${URL_API}/groups/for_course`;
    const response = await axios.get(endpoint, {
      params: { course_id: course.id },
      ...getHdrs(store.getAuth?.token),
    });
    groups.value = getRsp(response).data.items;
  } catch (err) {
    groupStudentDlg.value = false;
    alert?.show("red-darken-1", getErr(err));
  } finally {
    groupsLoading.value = false;
  }
};

const groupStudentOnSubmit = async () => {
  const { valid } = await groupStudentForm.value.validate();
  if (!valid) return;

  const confirmed = await confirm?.show(`¿Confirma agregar?`);
  if (!confirmed) return;

  groupStudentLdg.value = true;

  let payload = getObj(groupStudent.value, true);

  try {
    const endpoint = `${URL_API}/${routeName}/group_students`;
    const response = getRsp(
      await axios.post(endpoint, payload, getHdrs(store.getAuth?.token))
    );

    alert?.show("success", response.msg);
    groupStudentDlg.value = false;

    courses.value[groupStudent.value.course.key].group_student =
      response.data.item;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    groupStudentLdg.value = false;
  }
};

// const groupStudentDelete = async (id) => {
//   const confirmed = await confirm?.show("¿Confirma eliminar el asignación?");
//   if (!confirmed) return;

//   isLoading.value = true;
//   try {
//     const endpoint = `${URL_API}/teacher/group_modules/${id}`;
//     const response = getRsp(
//       await axios.delete(endpoint, getHdrs(store.getAuth?.token))
//     );
//     alert?.show("success", response.msg);
//     groupStudentDlg.value = false;
//     getGroupStudents();
//   } catch (err) {
//     alert?.show("red-darken-1", getErr(err));
//   } finally {
//     isLoading.value = false;
//   }
// };

onMounted(() => {
  getCatalogs();
  getMeta();
  getCourses();
});
</script>
