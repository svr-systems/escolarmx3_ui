<template>
  <v-card :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>
        <v-col v-if="item" cols="2" class="text-right">
          <!-- <v-btn
            v-if="item.is_active"
            icon
            variant="flat"
            size="x-small"
            color="info"
            class="me-1"
            :to="{
              name: 'campuses',
              params: { institution_id: getEncodeId(itemId) },
            }"
          >
            <v-icon>mdi-city-variant</v-icon>
            <v-tooltip activator="parent" location="left">Campus</v-tooltip>
          </v-btn> -->
          <v-btn
            v-if="item.is_active"
            icon
            variant="flat"
            size="x-small"
            color="warning"
            :to="{
              name: `${routeName}/update`,
            }"
          >
            <v-icon>mdi-pencil</v-icon>
            <v-tooltip activator="parent" location="left">Editar</v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text v-if="item">
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-row dense>
                <v-col cols="11">
                  <CardTitle text="INTITUCIÓN" sub />
                </v-col>
                <v-col cols="1" class="text-right">
                  <v-btn
                    icon
                    variant="flat"
                    size="x-small"
                    @click.prevent="regDialog = true"
                  >
                    <v-icon>mdi-clock-outline</v-icon>
                    <v-tooltip activator="parent" location="left">
                      Registro
                    </v-tooltip>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="6">
                  <VisVal label="Nombre" :value="item.name" />
                </v-col>
                <v-col cols="12" md="6">
                  <VisDoc label="Logo" :value="item.logo_b64" img />
                </v-col>
                <v-col cols="12" md="6">
                  <VisVal label="Clave" :value="item.code" />
                </v-col>
                <v-col cols="12" md="6">
                  <VisVal label="CCT" :value="item.cct" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <DlgReg v-model="regDialog" :item="item" />
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
import { getEncodeId } from "@/utils/coders";

// Componentes
import CardTitle from "@/components/CardTitle.vue";
import DlgReg from "@/components/DlgReg.vue";
import VisVal from "@/components/VisVal.vue";
import VisDoc from "@/components/VisDoc.vue";

// Constantes fijas
const routeName = "settings";

// Estado y referencias
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

// Estado reactivo
const itemId = ref(1);
const isLoading = ref(true);
const item = ref(null);
const regDialog = ref(false);

// Obtener registro
const getItem = async () => {
  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    item.value = getRsp(response).data.item;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Inicializar
onMounted(() => {
  getItem();
});
</script>
