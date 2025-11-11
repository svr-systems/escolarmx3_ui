<template>
  <v-card :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack
            :route="{
              name: `teacher/${routeName}`,
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
          <div class="font-weight-light text-h6">
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
            <!-- <v-tab :value="2" disabled>Alumnos</v-tab> -->
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
                                <v-btn
                                  icon
                                  variant="text"
                                  size="x-small"
                                  @click.prevent="
                                    groupModuleHandleDlg(groupModule.id)
                                  "
                                >
                                  <v-icon>mdi-pencil</v-icon>
                                  <v-tooltip activator="parent" location="end">
                                    Editar
                                  </v-tooltip>
                                </v-btn>
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
                                <v-btn
                                  icon
                                  variant="text"
                                  size="x-small"
                                  @click="activityHandleDlg(groupModule.id, i)"
                                >
                                  <v-icon>mdi-plus</v-icon>
                                  <v-tooltip activator="parent" location="end">
                                    Agregar
                                  </v-tooltip>
                                </v-btn>
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
                                    <th>
                                      <small>Limite de atraso</small>
                                    </th>
                                    <th width="120" />
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
                                      {{ activity.late_until }}
                                    </td>
                                    <td class="text-right">
                                      <v-btn
                                        icon
                                        variant="text"
                                        size="x-small"
                                        @click.prevent="
                                          activityHandleDlg(
                                            groupModule.id,
                                            i,
                                            activity.id
                                          )
                                        "
                                      >
                                        <v-icon>mdi-pencil</v-icon>
                                        <v-tooltip
                                          activator="parent"
                                          location="start"
                                        >
                                          Editar
                                        </v-tooltip>
                                      </v-btn>
                                      <v-btn
                                        icon
                                        variant="text"
                                        size="x-small"
                                        @click.prevent="
                                          activityDetailHandleDlg(
                                            i,
                                            activity.id
                                          )
                                        "
                                      >
                                        <v-icon>mdi-eye</v-icon>
                                        <v-tooltip
                                          activator="parent"
                                          location="start"
                                        >
                                          Ver detalle
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

                  <v-col
                    v-if="!groupModulesLdg && !isGroupModuleFull"
                    cols="12"
                  >
                    <v-btn
                      icon
                      variant="outlined"
                      size="x-small"
                      color="success"
                      class="ms-3"
                      @click="groupModuleHandleDlg()"
                    >
                      <v-icon>mdi-plus</v-icon>
                      <v-tooltip activator="parent" location="end">
                        Agregar módulo
                      </v-tooltip>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- DIALOGS -->
    <v-dialog v-model="groupModuleDlg" persistent scrim="black" max-width="380">
      <v-card :loading="groupModuleLdg" :disabled="groupModuleLdg" flat>
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-btn
              v-if="groupModule?.id"
              icon
              variant="text"
              size="x-small"
              color="error"
              @click.prevent="groupModuleDelete(groupModule?.id)"
            >
              <v-icon>mdi-delete-outline</v-icon>
              <v-tooltip activator="parent" location="bottom">
                Eliminar
              </v-tooltip>
            </v-btn>
            <span class="font-weight-light text-subtitle-1">MÓDULO</span>
          </div>

          <v-btn
            icon
            variant="text"
            size="x-small"
            @click="groupModuleDlg = false"
          >
            <v-icon>mdi-close</v-icon>
            <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
          </v-btn>
        </v-card-title>

        <v-card-text v-if="groupModule">
          <v-form ref="groupModuleForm" @submit.prevent="groupModuleOnSubmit">
            <v-row dense>
              <v-col cols="12">
                <InpDate
                  label="Inicio"
                  v-model="groupModule.start_at"
                  :rules="rules.required"
                />
              </v-col>

              <v-col cols="12">
                <InpDate
                  label="Termino"
                  v-model="groupModule.end_at"
                  :rules="rules.required"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Porcentaje %"
                  v-model="groupModule.weight_percent"
                  type="number"
                  variant="outlined"
                  density="compact"
                  :rules="rules.required"
                  autocomplete="off"
                  min="0.01"
                  max="100"
                />
              </v-col>

              <v-col cols="12" class="text-right">
                <v-btn
                  type="submit"
                  icon
                  variant="outlined"
                  size="x-small"
                  :color="!groupModule.id ? 'success' : 'warning'"
                  :loading="groupModuleLdg"
                >
                  <v-icon>
                    mdi-{{ !groupModule.id ? "plus" : "pencil" }}
                  </v-icon>
                  <v-tooltip activator="parent" location="start">
                    {{ !groupModule.id ? "Agregar" : "Editar" }}
                  </v-tooltip>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="activityDlg" persistent scrim="black" max-width="1200">
      <v-card :loading="activityLdg" :disabled="activityLdg" flat>
        <v-card-title class="d-flex align-center justify-space-between">
          <div>
            <span class="font-weight-light ps-2">ACTIVIDAD</span>
            <v-btn
              v-if="activity?.id"
              icon
              variant="text"
              size="x-small"
              color="error"
              @click.prevent="activityRemove(activity?.id)"
            >
              <v-icon>mdi-delete-outline</v-icon>
              <v-tooltip activator="parent" location="end">
                Eliminar
              </v-tooltip>
            </v-btn>
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
          <v-form ref="activityForm" @submit.prevent>
            <v-row dense>
              <v-col cols="12">
                <v-divider class="pb-3" />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  label="Tipo"
                  v-model="activity.activity_type_id"
                  :items="activityTypes"
                  :loading="activityTypesLoading"
                  item-value="id"
                  item-title="name"
                  variant="outlined"
                  density="compact"
                  :rules="rules.required"
                  @update:modelValue="onActivityTypeChange"
                />
              </v-col>

              <v-col cols="12" md="8">
                <v-text-field
                  label="Título"
                  v-model="activity.title"
                  type="text"
                  variant="outlined"
                  density="compact"
                  maxlength="100"
                  counter
                  :rules="rules.textRequired"
                  autocomplete="off"
                />
              </v-col>

              <v-col cols="12">
                <InpEditor
                  ref="editorRef"
                  v-model="activity.instructions"
                  :rules="rules.textRequired"
                />
              </v-col>

              <v-col
                v-if="activity.is_deliverable && activity.is_gradable != null"
                cols="12"
                md="3"
              >
                <v-switch
                  label="¿Aporta calificación?"
                  v-model="activity.is_gradable"
                  color="info"
                  density="compact"
                  class="ml-1"
                  :true-value="1"
                  :false-value="0"
                  :disabled="[1].includes(activity.activity_type_id)"
                />
              </v-col>

              <v-col v-if="activity.is_gradable" cols="12" md="3">
                <v-text-field
                  label="Porcentaje %"
                  v-model="activity.weight_percent"
                  type="number"
                  variant="outlined"
                  density="compact"
                  max="100"
                  min="1"
                  :rules="rules.required"
                  autocomplete="off"
                />
              </v-col>

              <v-col v-if="activity.is_gradable" cols="12" md="3">
                <v-text-field
                  label="Calificación máxima"
                  v-model="activity.max_score"
                  type="number"
                  variant="outlined"
                  density="compact"
                  max="100"
                  min="1"
                  :rules="rules.required"
                  autocomplete="off"
                />
              </v-col>

              <v-col v-if="activity.is_gradable" cols="12" md="3">
                <InpDate
                  label="Fecha de entrega"
                  v-model="activity.scheduled_at"
                  :rules="rules.required"
                />
              </v-col>

              <v-col v-if="activity.is_gradable" cols="12" md="3">
                <v-switch
                  label="¿Aceptar atraso?"
                  v-model="activity.allow_late"
                  color="info"
                  density="compact"
                  class="ml-1"
                  :true-value="1"
                  :false-value="0"
                />
              </v-col>

              <v-col v-if="activity.allow_late" cols="12" md="3">
                <InpDate
                  label="Fecha limite de atraso"
                  v-model="activity.late_until"
                  :rules="rules.required"
                />
              </v-col>

              <v-col v-if="activity.activity_type_id" cols="12">
                <v-row dense>
                  <v-col cols="12">
                    <div
                      class="text-caption font-weight-light text-medium-emphasis"
                    >
                      Recursos
                      <v-btn
                        icon
                        variant="text"
                        size="x-small"
                        @click="activityResourcesAdd()"
                      >
                        <v-icon>mdi-plus</v-icon>
                        <v-tooltip activator="parent" location="end">
                          Agregar
                        </v-tooltip>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>

                <template
                  v-for="(activity_resources, i) of activity.activity_resources"
                  :key="i"
                >
                  <v-row dense v-if="activity_resources.is_active == 1">
                    <v-col cols="12" md="3">
                      <v-radio-group
                        v-model="activity_resources.is_storage"
                        inline
                      >
                        <v-radio label="Archivo" :value="true" />
                        <v-radio label="Vínculo" :value="false" />
                      </v-radio-group>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        label="Título"
                        v-model="activity_resources.name"
                        type="text"
                        variant="outlined"
                        density="compact"
                        maxlength="100"
                        counter
                        :rules="rules.textRequired"
                      />
                    </v-col>
                    <v-col
                      v-if="activity_resources.is_storage"
                      cols="12"
                      md="4"
                      class="d-flex"
                    >
                      <v-file-input
                        v-model="activity_resources.storage_doc"
                        variant="outlined"
                        density="compact"
                        prepend-icon=""
                        show-size
                        accept=".pdf"
                        :rules="rules.fileRequired"
                      />
                      <div
                        v-if="
                          activity.id &&
                          activity_resources.storage_path &&
                          !activity_resources.storage_doc
                        "
                      >
                        <v-row dense class="align-center">
                          <v-col cols="auto">
                            <VisDoc2
                              :value="activity_resources.storage_b64"
                              :disabled="activity_resources.storage_dlt"
                            />
                          </v-col>
                          <v-col cols="auto">
                            <v-btn
                              icon
                              variant="text"
                              size="small"
                              :color="
                                activity_resources.storage_dlt
                                  ? 'error'
                                  : undefined
                              "
                              @click.prevent="
                                activity_resources.storage_dlt =
                                  !activity_resources.storage_dlt
                              "
                            >
                              <v-icon size="small">
                                mdi-delete{{
                                  activity_resources.storage_dlt ? "-off" : ""
                                }}
                              </v-icon>
                              <v-tooltip activator="parent" location="bottom">
                                {{
                                  activity_resources.storage_dlt
                                    ? "Revertir eliminación"
                                    : "Eliminar"
                                }}
                              </v-tooltip>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </div>
                    </v-col>
                    <v-col v-else cols="12" md="4">
                      <v-text-field
                        v-model="activity_resources.url"
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
                        icon
                        variant="text"
                        size="x-small"
                        color="error"
                        @click.prevent="activityResourcesRemove(i)"
                      >
                        <v-icon>mdi-delete-outline</v-icon>
                        <v-tooltip activator="parent" location="start">
                          Eliminar
                        </v-tooltip>
                      </v-btn>
                    </v-col>
                  </v-row>
                </template>
              </v-col>

              <v-col cols="12" class="text-right">
                <v-btn
                  block
                  size="small"
                  :color="!activity.id ? 'success' : 'warning'"
                  @click.prevent="activityHandle()"
                  :loading="activityLdg"
                >
                  {{ !activity.id ? "Agregar" : "Editar" }}
                  <v-icon end>
                    mdi-{{ !activity.id ? "plus" : "pencil" }}
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="activityDetailDlg"
      persistent
      scrim="black"
      max-width="800"
    >
      <v-card :loading="activityDetailLdg" :disabled="activityDetailLdg" flat>
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
            @click="activityDetailDlg = false"
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
              v-if="activity.activity_submissions.length > 0"
              cols="12"
              class="text-body-2 py-0"
            >
              <v-table density="compact" striped="even">
                <thead>
                  <tr>
                    <th width="40"><small>#</small></th>
                    <th><small>Alumno</small></th>
                    <th><small>Entregado</small></th>
                    <th><small>Revisión</small></th>
                    <th><small>Calificación</small></th>
                    <th width="64" />
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(
                      activity_submission, i
                    ) in activity.activity_submissions"
                    :key="i"
                  >
                    <td>
                      {{ i + 1 }}
                    </td>
                    <td>
                      {{ activity_submission.full_name }}
                    </td>
                    <td>
                      {{ activity_submission.created_at }}
                    </td>
                    <td>
                      {{ activity_submission.graded_at }}
                    </td>
                    <td>
                      {{ activity_submission.score }}
                    </td>
                    <td class="text-right">
                      <v-btn
                        icon
                        variant="text"
                        size="x-small"
                        :color="!activity_submission.score ? 'warning' : ''"
                        @click.prevent="
                          activitySubmissionHandleDlg(activity_submission.id)
                        "
                      >
                        <v-icon>mdi-eye</v-icon>
                        <v-tooltip activator="parent" location="start">
                          Ver detalle
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
    </v-dialog>

    <v-dialog
      v-model="activitySubmissionDlg"
      persistent
      scrim="black"
      max-width="700"
    >
      <v-card
        :loading="activitySubmissionLdg"
        :disabled="activitySubmissionLdg"
        flat
      >
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <div class="font-weight-light ps-1"></div>
          </div>

          <v-btn
            icon
            variant="text"
            size="x-small"
            @click="activitySubmissionDlg = false"
          >
            <v-icon>mdi-close</v-icon>
            <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
          </v-btn>
        </v-card-title>

        <v-card-text v-if="activitySubmission" class="pt-0">
          <v-row>
            <v-col cols="12" md="9">
              <v-row dense>
                <v-col cols="12" md="4">
                  <VisVal
                    label="Alumno"
                    :value="activitySubmission.full_name"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <VisVal
                    label="Entregado"
                    :value="activitySubmission.created_at"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <VisVal
                    label="Revisión"
                    :value="activitySubmission.graded_at"
                  />
                </v-col>

                <v-col cols="12" class="py-2">
                  <v-divider />
                </v-col>

                <v-col cols="12">
                  <v-row dense>
                    <v-col
                      cols="12"
                      class="text-caption font-weight-light text-medium-emphasis pb-0"
                    >
                      Evidencia
                    </v-col>

                    <v-col
                      v-for="(
                        submission_resource, i
                      ) of activitySubmission.submission_resources"
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
                  <div
                    v-if="activitySubmission.score"
                    class="text-h2 font-weight-light pb-3"
                  >
                    {{
                      activitySubmission.score_temp
                        ? activitySubmission.score_temp
                        : "-"
                    }}
                  </div>
                  <div v-if="activitySubmission.score == null">
                    <v-text-field
                      v-model="activitySubmission.score_temp"
                      type="number"
                      variant="outlined"
                      density="compact"
                      autocomplete="off"
                      min="1"
                      max="100"
                      class="score-input-center"
                    />
                  </div>
                  <div v-if="activitySubmission.score == null" class="pt-2">
                    <v-btn
                      block
                      color="warning"
                      size="small"
                      :disabled="!activitySubmission.score_temp"
                      @click.prevent="activitySubmissionScore()"
                    >
                      Calificar
                      <v-icon end>mdi-send</v-icon>
                    </v-btn>
                  </div>
                  <div v-else>
                    <v-btn
                      block
                      size="small"
                      :disabled="!activitySubmission.score_temp"
                      @click.prevent="activitySubmissionScore(true)"
                    >
                      Borrar
                      <v-icon end>mdi-eraser</v-icon>
                    </v-btn>
                  </div>
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
import { ref, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
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
import InpDate from "@/components/InpDate.vue";
import InpEditor from "@/components/InpEditor.vue";
import VisDoc2 from "@/components/VisDoc2.vue";
import VisVal from "@/components/VisVal.vue";

const routeName = "groups";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

const itemId = ref(getDecodeId(route.params.id));
const isLoading = ref(true);
const item = ref(null);
const rules = getRules();

const activityTypes = ref([]);
const activityTypesLoading = ref(true);

const tab = ref(1);

const getCatalogs = async () => {
  let endpoint = null;
  let response = null;
  try {
    endpoint = `${URL_API}/teacher/activity_types`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    activityTypes.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    activityTypesLoading.value = false;
  }
};

const getItem = async () => {
  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/teacher/${routeName}/${itemId.value}`;
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
    const endpoint = `${URL_API}/teacher/group_modules`;
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

const groupModule = ref(null);
const groupModuleLdg = ref(false);
const groupModuleDlg = ref(false);
const groupModuleForm = ref(null);

const groupModuleHandleDlg = async (id = null) => {
  groupModule.value = null;

  if (!id) {
    let weight_percent = 100;
    for (const groupModule of groupModules.value) {
      weight_percent -= groupModule.weight_percent;
    }

    groupModule.value = {
      id: null,
      group_id: itemId.value,
      weight_percent: weight_percent,
      start_at: null,
      end_at: null,
    };
    groupModuleLdg.value = false;
    groupModuleDlg.value = true;
  } else {
    groupModuleLdg.value = true;
    groupModuleDlg.value = true;

    try {
      const endpoint = `${URL_API}/teacher/group_modules/${id}`;
      const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
      groupModule.value = getRsp(response).data.item;
    } catch (err) {
      alert?.show("red-darken-1", getErr(err));
    } finally {
      groupModuleLdg.value = false;
    }
  }
};

const groupModuleOnSubmit = async () => {
  const { valid } = await groupModuleForm.value.validate();
  if (!valid) return;

  const isStoreMode = !groupModule.value.id;

  const confirmed = await confirm?.show(
    `¿Confirma ${isStoreMode ? "agregar" : "editar"} el módulo?`
  );
  if (!confirmed) return;

  groupModuleLdg.value = true;

  let payload = getObj(groupModule.value, isStoreMode);

  try {
    const endpoint = `${URL_API}/teacher/group_modules${
      isStoreMode ? "" : `/${payload.id}`
    }`;
    const response = getRsp(
      await axios.post(endpoint, payload, getHdrs(store.getAuth?.token))
    );

    alert?.show("success", response.msg);
    groupModuleDlg.value = false;
    getGroupModules();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    groupModuleLdg.value = false;
  }
};

const groupModuleDelete = async (id) => {
  const confirmed = await confirm?.show("¿Confirma eliminar el módulo?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/teacher/group_modules/${id}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    );
    alert?.show("success", response.msg);
    groupModuleDlg.value = false;
    getGroupModules();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const isGroupModuleFull = computed(() => {
  const total = groupModules.value.reduce(
    (sum, gm) => sum + Number(gm.weight_percent || 0),
    0
  );
  return total >= 100;
});

// activitys
const activity = ref(null);
const activityLdg = ref(false);
const activityDlg = ref(false);
const activityForm = ref(null);

const editorRef = ref(null);

const activityHandleDlg = async (GroupModuleId, groupModuleIdx, id = null) => {
  activity.value = null;

  if (!id) {
    activity.value = {
      id: null,
      group_module_id: GroupModuleId,
      group_module_idx: groupModuleIdx,
      activity_type_id: null,
      title: null,
      instructions: null,
      is_exam: false,
      is_deliverable: null,
      is_gradable: null,
      weight_percent: null,
      max_score: null,
      scheduled_at: null,
      allow_late: null,
      late_until: null,
      posts_enabled: false,
      activity_resources: [],
    };
    activityLdg.value = false;
    activityDlg.value = true;
  } else {
    activityLdg.value = true;
    activityDlg.value = true;

    try {
      const endpoint = `${URL_API}/teacher/group_modules/activities/${id}`;
      const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
      activity.value = getRsp(response).data.item;
      activity.value.group_module_idx = groupModuleIdx;
    } catch (err) {
      alert?.show("red-darken-1", getErr(err));
    } finally {
      activityLdg.value = false;
    }
  }
};

const onActivityTypeChange = (id) => {
  const type = activityTypes.value.find((t) => t.id === id) || null;

  activity.value.is_exam = type.is_exam;
  activity.value.is_deliverable = null;
  activity.value.is_gradable = null;
  activity.value.weight_percent = null;
  activity.value.max_score = null;
  activity.value.scheduled_at = null;
  activity.value.allow_late = null;
  activity.value.late_until = null;

  if ([1, 2].includes(type.id)) {
    activity.value.is_deliverable = true;
  }
  if (type.is_gradable) {
    activity.value.is_gradable = false;

    if (type.is_exam) {
      activity.value.is_gradable = true;
    }
  }
  if (type.allow_late) {
    activity.value.allow_late = false;
  }
};

const activityHandle = async () => {
  const editorValid =
    editorRef.value && typeof editorRef.value.validate === "function"
      ? editorRef.value.validate()
      : true;
  const { valid } = await activityForm.value.validate();
  if (!editorValid || !valid) {
    return;
  }

  const isStoreMode = !activity.value.id;

  const confirmed = await confirm?.show(
    `¿Confirma ${isStoreMode ? "agregar" : "editar"}?`
  );
  if (!confirmed) return;

  activityLdg.value = true;

  // contenido HTML completo incluyendo cualquier formato
  let payload = getObj(activity.value, isStoreMode);
  payload = extractMultipleNestedProps(
    payload,
    "activity_resources",
    "storage_doc"
  );

  try {
    const endpoint = `${URL_API}/teacher/group_modules/activities${
      isStoreMode ? "" : `/${payload.id}`
    }`;
    const response = getRsp(
      await axios.post(
        endpoint,
        getFormData(payload),
        getHdrs(store.getAuth?.token, true)
      )
    );

    alert?.show("success", response.msg);

    // cargar el item de respuesta de la API en el estado para actualizar el editor y otros campos
    // if (response.data?.item) {
    //   activity.value = response.data.item;
    // }

    activityDlg.value = false;
    getGroupModules();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    activityLdg.value = false;
  }
};

const activityRemove = async (id) => {
  const confirmed = await confirm?.show("¿Confirma eliminar la actividad?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/teacher/group_modules/activities/${id}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    );
    alert?.show("success", response.msg);
    activityDlg.value = false;
    getGroupModules();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const activityResourcesAdd = async () => {
  activity.value.activity_resources.push({
    id: null,
    is_active: 1,
    name: null,
    is_storage: true,
    storage_path: null,
    storage_doc: null,
    storage_dlt: false,
    extension: null,
    url: null,
  });
};

const activityResourcesRemove = async (i) => {
  if (activity.value.activity_resources[i].id === null) {
    activity.value.activity_resources.splice(i, 1);
  } else {
    activity.value.activity_resources[i].is_active = 0;
  }
};

// Activity Detail
const activityDetailDlg = ref(false);
const activityDetailLdg = ref(false);

const activityDetailHandleDlg = async (groupModuleIdx, id) => {
  activity.value = null;
  activityDetailLdg.value = true;
  activityDetailDlg.value = true;

  try {
    const endpoint = `${URL_API}/teacher/group_modules/activity_details/${id}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    activity.value = getRsp(response).data.item;
    activity.value.group_module_idx = groupModuleIdx;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    activityDetailLdg.value = false;
  }
};

const activitySubmission = ref(null);
const activitySubmissionLdg = ref(false);
const activitySubmissionDlg = ref(false);

const activitySubmissionHandleDlg = async (id) => {
  activitySubmission.value = null;
  activitySubmissionLdg.value = true;
  activitySubmissionDlg.value = true;

  try {
    const endpoint = `${URL_API}/teacher/group_modules/activity_submissions/${id}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    activitySubmission.value = getRsp(response).data.item;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    activitySubmissionLdg.value = false;
  }
};
const activitySubmissionScore = async (erase = false) => {
  const confirmed = await confirm?.show(
    `¿Confirma actualizar la calificación?`
  );
  if (!confirmed) return;

  activitySubmissionLdg.value = true;
  let payload = { ...activitySubmission.value };
  payload.erase = erase;

  try {
    const endpoint = `${URL_API}/teacher/group_modules/activity_submissions_score`;
    const response = getRsp(
      await axios.post(endpoint, payload, getHdrs(store.getAuth?.token))
    );

    alert?.show("success", response.msg);
    activitySubmissionDlg.value = false;
    activityDetailHandleDlg(activity.value.group_module_idx, activity.value.id);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    activitySubmissionLdg.value = false;
  }
};

onMounted(() => {
  getCatalogs();
  getItem();
  getGroupModules();
});
</script>

<style scoped>
.score-input-center :deep(.v-field__input) {
  text-align: center !important;
}

.score-input-center :deep(.v-input__details) {
  height: 0 !important;
  min-height: 0 !important;
  padding: 0;
  margin: 0;
}
</style>
