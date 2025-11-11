<template>
  <v-card :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack
            :route="{
              name: `student/${routeName}`,
            }"
          />
          <CardTitle
            :text="`${route.meta.title} ${
              item
                ? ` | ${item.uiid} ${item.section ? ` (${item.section})` : ''}`
                : ''
            }`"
            :icon="route.meta.icon"
          />
        </v-col>
        <v-col v-if="item" cols="2" class="text-right" />
      </v-row>
    </v-card-title>

    <v-card-text v-if="item">
      <v-row dense>
        <v-col cols="12" class="text-center">
          <div class="font-weight-light">
            {{ item.course.name }}
          </div>
          <div class="text-caption font-weight-thin text-medium-emphasis">
            {{ item.course.program.name }}
          </div>
          <div class="text-caption font-weight-thin text-medium-emphasis">
            <small>
              {{ item.program_cycle.cycle.term_start_at }} |
              {{ item.program_cycle.cycle.term_end_at }}
            </small>
          </div>
        </v-col>

        <v-col cols="12">
          <v-tabs v-model="tab" density="compact" align-tabs="center">
            <v-tab :value="1">Tablero</v-tab>
          </v-tabs>

          <v-tabs-window v-model="tab">
            <v-tabs-window-item :value="1">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-divider />
                  </v-col>
                  <template v-if="!groupModulesLdg">
                    <v-col
                      v-for="(groupModule, i) in groupModules"
                      :key="i"
                      cols="12"
                    >
                      <v-card variant="flat" hover>
                        <v-card-title>
                          <v-row dense>
                            <v-col cols="10">
                              <div class="font-weight-light">
                                MÓDULO {{ i + 1 }}
                              </div>
                              <div
                                cols="6"
                                class="text-caption font-weight-thin text-medium-emphasis"
                              >
                                <small>
                                  {{ groupModule.start_at }} |
                                  {{ groupModule.end_at }}
                                </small>
                              </div>
                            </v-col>
                            <v-col
                              cols="2"
                              class="text-right text-subtitle-1 font-weight-light"
                            >
                              {{ getPercentFormat(groupModule.weight_percent) }}
                            </v-col>
                          </v-row>
                        </v-card-title>
                        <v-card-text>
                          <v-row dense>
                            <v-col cols="12">
                              <div class="text-caption font-weight-light">
                                ACTIVIDADES
                              </div>
                            </v-col>

                            <v-col cols="12">
                              <v-table density="compact" striped="even">
                                <thead>
                                  <tr>
                                    <th width="40"><small>#</small></th>
                                    <th><small>Título</small></th>
                                    <th><small>Tipo</small></th>
                                    <th><small>Porcentaje</small></th>
                                    <th><small>Entrega</small></th>
                                    <th><small>Entregada</small></th>
                                    <th><small>Calificación</small></th>
                                    <th width="64" />
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    v-for="(
                                      activity, j
                                    ) in groupModule.activities"
                                    :key="j"
                                  >
                                    <td>
                                      {{
                                        groupModule.activities.length -
                                        activity.key
                                      }}
                                    </td>
                                    <td>
                                      {{ activity.title }}
                                    </td>
                                    <td>
                                      {{ activity.activity_type.name }}
                                    </td>
                                    <td>
                                      {{
                                        activity.weight_percent
                                          ? getPercentFormat(
                                              activity.weight_percent
                                            )
                                          : null
                                      }}
                                    </td>
                                    <td>
                                      {{ activity.scheduled_at }}
                                    </td>
                                    <td>
                                      {{
                                        activity.activity_submission?.created_at
                                      }}
                                    </td>
                                    <td>
                                      {{ activity.activity_submission?.score }}
                                    </td>
                                    <td class="text-right">
                                      <v-btn
                                        icon
                                        variant="text"
                                        size="x-small"
                                        :color="
                                          !activity.activity_submission &&
                                          activity.activity_type_id != 3
                                            ? 'warning'
                                            : ''
                                        "
                                        @click.prevent="
                                          activityHandleDlg(i, activity.id)
                                        "
                                      >
                                        <v-icon>mdi-eye</v-icon>
                                        <v-tooltip
                                          activator="parent"
                                          location="start"
                                        >
                                          Ver
                                        </v-tooltip>
                                      </v-btn>
                                    </td>
                                  </tr>
                                </tbody>
                              </v-table>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </template>

                  <v-col v-else cols="12" class="text-center">
                    <v-progress-circular :size="50" indeterminate />
                  </v-col>
                </v-row>
              </v-container>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- DIALOGS -->
    <v-dialog v-model="activityDlg" persistent scrim="black" max-width="900">
      <v-card :loading="activityLdg" :disabled="activityLdg" flat>
        <v-card-title class="d-flex align-center justify-space-between">
          <div>
            <div class="font-weight-light ps-2">
              {{ activity?.title }}
            </div>
            <div
              class="text-caption font-weight-light text-medium-emphasis ps-2"
            >
              <small>
                {{ activity ? `Módulo ${activity.group_module_idx + 1}` : "" }}
              </small>
            </div>
          </div>

          <v-btn
            icon
            variant="text"
            size="x-small"
            @click="activityDlg = false"
          >
            <v-icon>mdi-close</v-icon>
            <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
          </v-btn>
        </v-card-title>

        <v-card-text v-if="activity" class="pt-0">
          <v-row dense>
            <v-col cols="12" class="py-3">
              <v-divider />
            </v-col>

            <v-col v-if="activity.is_gradable" cols="12" md="3">
              <VisVal label="Tipo" :value="activity?.activity_type?.name" />
            </v-col>

            <v-col v-if="activity.is_gradable" cols="12" md="3">
              <VisVal label="Porcentaje %" :value="activity.weight_percent" />
            </v-col>

            <v-col v-if="activity.is_gradable" cols="12" md="3">
              <VisVal label="Entrega" :value="activity.scheduled_at" />
            </v-col>

            <v-col v-if="activity.is_gradable" cols="12" md="3">
              <VisVal label="Calificación máx." :value="activity.max_score" />
            </v-col>

            <v-col cols="12">
              <VisVal label="Indicaciones" :value="activity.instructions" />
            </v-col>

            <v-col
              cols="12"
              class="text-caption font-weight-light text-medium-emphasis pb-0"
            >
              Recursos
            </v-col>

            <v-col
              v-for="(activity_resources, i) of activity.activity_resources"
              :key="i"
              cols="12"
              class="text-body-2 py-0"
            >
              {{ activity_resources.name }}
              <VisDoc2
                v-if="activity_resources.is_storage"
                :value="activity_resources.storage_b64"
              />
              <v-btn
                v-else
                icon
                variant="text"
                size="x-small"
                :href="activity_resources.url"
                target="_blank"
              >
                <v-icon>mdi-open-in-new</v-icon>
                <v-tooltip activator="parent" location="right">
                  Abrir URL
                </v-tooltip>
              </v-btn>
            </v-col>

            <v-col cols="12" class="py-3">
              <v-divider />
            </v-col>

            <v-col
              v-if="
                activity.activity_submission && !activity.activity_submission.id
              "
              cols="12"
            >
              <v-form ref="activitySubmissionForm" @submit.prevent>
                <v-row dense>
                  <v-col
                    cols="12"
                    class="text-caption font-weight-light text-medium-emphasis pb-0"
                  >
                    Evidencia
                    <v-btn
                      icon
                      variant="text"
                      size="x-small"
                      @click="submissionResourceAdd()"
                    >
                      <v-icon>mdi-plus</v-icon>
                      <v-tooltip activator="parent" location="end">
                        Agregar
                      </v-tooltip>
                    </v-btn>
                  </v-col>

                  <v-col
                    v-if="activity.activity_submission.submission_resources"
                    cols="12"
                  >
                    <v-row
                      dense
                      v-for="(submission_resource, i) of activity
                        .activity_submission.submission_resources"
                      :key="i"
                    >
                      <v-col
                        cols="12"
                        md="4"
                        class="d-flex justify-space-between"
                      >
                        <span class="text-body-2 pt-3"> {{ i + 1 }}. </span>
                        <v-radio-group
                          v-model="submission_resource.is_storage"
                          inline
                        >
                          <v-radio label="Archivo" :value="true" />
                          <v-radio label="Vínculo" :value="false" />
                        </v-radio-group>
                      </v-col>
                      <v-col cols="12" md="7">
                        <v-file-input
                          v-if="submission_resource.is_storage"
                          v-model="submission_resource.storage_doc"
                          variant="outlined"
                          density="compact"
                          prepend-icon=""
                          show-size
                          accept=".pdf"
                          :rules="rules.fileRequired"
                        />
                        <v-text-field
                          v-else
                          v-model="submission_resource.url"
                          type="text"
                          variant="outlined"
                          density="compact"
                          maxlength="255"
                          counter
                          :rules="rules.textRequired"
                        />
                      </v-col>
                      <v-col cols="12" md="1" class="text-right pt-2">
                        <v-btn
                          v-if="i != 0"
                          icon
                          variant="text"
                          size="x-small"
                          color="error"
                          @click.prevent="submissionResourceRemove(i)"
                        >
                          <v-icon>mdi-delete-outline</v-icon>
                          <v-tooltip activator="parent" location="start">
                            Eliminar
                          </v-tooltip>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="12" class="text-right">
                    <v-btn
                      block
                      size="small"
                      color="success"
                      @click.prevent="activitySubmissionStore()"
                      :loading="activityLdg"
                    >
                      Cargar
                      <v-icon end> mdi-upload </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>

            <v-col
              v-if="
                activity.activity_submission && activity.activity_submission.id
              "
              cols="12"
            >
              <v-row dense>
                <v-col cols="12" md="9">
                  <v-row dense>
                    <v-col
                      cols="12"
                      class="text-caption font-weight-light text-medium-emphasis pb-0"
                    >
                      Evidencia | {{ activity.activity_submission.created_at }}
                    </v-col>

                    <v-col
                      v-for="(submission_resource, i) of activity
                        .activity_submission.submission_resources"
                      :key="i"
                      cols="12"
                      class="text-body-2 py-0"
                    >
                      <span class="text-body-2 pt-3">
                        {{ i + 1 }}.
                        {{
                          submission_resource.is_storage ? "Archivo" : "Vínculo"
                        }}
                      </span>
                      <VisDoc2
                        v-if="submission_resource.is_storage"
                        :value="submission_resource.storage_b64"
                      />
                      <v-btn
                        v-else
                        icon
                        variant="text"
                        size="x-small"
                        :href="submission_resource.url"
                        target="_blank"
                      >
                        <v-icon>mdi-open-in-new</v-icon>
                        <v-tooltip activator="parent" location="right">
                          Abrir URL
                        </v-tooltip>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12" md="3">
                  <v-row dense class="text-center">
                    <v-col
                      cols="12"
                      class="text-caption font-weight-light text-medium-emphasis pb-0"
                    >
                      Calificación
                    </v-col>
                    <v-col cols="12">
                      <div class="text-h2 font-weight-light pb-0">
                        {{
                          activity.activity_submission.score
                            ? activity.activity_submission.score
                            : "-"
                        }}
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";
import { getPercentFormat } from "@/utils/formatters";
import {
  getObj,
  extractMultipleNestedProps,
  getFormData,
} from "@/utils/helpers";

// Importaciones
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import VisVal from "@/components/VisVal.vue";
import VisDoc2 from "@/components/VisDoc2.vue";

const routeName = "groups";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const route = useRoute();

const itemId = ref(getDecodeId(route.params.id));
const isLoading = ref(true);
const item = ref(null);
const rules = getRules();

const tab = ref(1);

const getCatalogs = async () => {
  // let endpoint = null;
  // let response = null;
  // try {
  //   endpoint = `${URL_API}/teacher/activity_types`;
  //   response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
  //   activityTypes.value = getRsp(response).data.items;
  // } catch (err) {
  //   alert?.show("red-darken-1", getErr(err));
  // } finally {
  //   activityTypesLoading.value = false;
  // }
};

const getItem = async () => {
  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/student/${routeName}/${itemId.value}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    item.value = getRsp(response).data.item;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// groupModules
const groupModules = ref([]);
const groupModulesLdg = ref(false);

const getGroupModules = async () => {
  groupModulesLdg.value = true;
  try {
    const endpoint = `${URL_API}/student/group_modules`;
    const response = await axios.get(endpoint, {
      params: { group_id: itemId.value },
      ...getHdrs(store.getAuth?.token),
    });
    groupModules.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    groupModulesLdg.value = false;
  }
};

// activitys
const activity = ref(null);
const activityLdg = ref(false);
const activityDlg = ref(false);

const activityHandleDlg = async (groupModuleIdx, id = null) => {
  activity.value = null;
  activityLdg.value = true;
  activityDlg.value = true;

  try {
    const endpoint = `${URL_API}/student/group_modules/activities/${id}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    activity.value = getRsp(response).data.item;
    activity.value.group_module_idx = groupModuleIdx;

    if (
      !activity.value.activity_submission &&
      activity.value.activity_type_id != 3
    ) {
      activity.value.activity_submission = {
        id: null,
        activity_id: id,
        group_student_id: item.value.group_student_id,
        submission_resources: [
          {
            id: null,
            is_storage: true,
            storage_doc: null,
            url: null,
          },
        ],
      };
    }
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    activityLdg.value = false;
  }
};

const submissionResourceAdd = async () => {
  activity.value.activity_submission.submission_resources.push({
    id: null,
    is_storage: true,
    storage_doc: null,
    url: null,
  });
};

const submissionResourceRemove = async (i) => {
  activity.value.activity_submission.submission_resources.splice(i, 1);
};

const activitySubmissionForm = ref(null);

const activitySubmissionStore = async () => {
  const { valid } = await activitySubmissionForm.value.validate();
  if (!valid) {
    return;
  }

  const confirmed = await confirm?.show(`¿Confirma agregar evidencia?`);
  if (!confirmed) return;

  activityLdg.value = true;

  let payload = getObj(activity.value.activity_submission, true);
  payload = extractMultipleNestedProps(
    payload,
    "submission_resources",
    "storage_doc"
  );

  try {
    const endpoint = `${URL_API}/student/group_modules/activity_submissions`;
    const response = getRsp(
      await axios.post(
        endpoint,
        getFormData(payload),
        getHdrs(store.getAuth?.token, true)
      )
    );

    alert?.show("success", response.msg);

    if (response.data?.item) {
      activity.value.activity_submission = response.data.item;
    }
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    activityLdg.value = false;
  }
};

onMounted(() => {
  getCatalogs();
  getItem();
  getGroupModules();
});
</script>
