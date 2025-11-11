<template>
  <v-row v-if="!isLoading" class="ma-0">
    <v-col v-for="(item, i) in items" :key="i" cols="12" md="4">
      <v-card
        hover
        :to="{
          name: `student/${routeName}/show`,
          params: { id: getEncodeId(item.id) },
        }"
      >
        <v-card-title :class="['py-3', `bg-${colors[i]}-darken-2`]">
          <div class="font-weight-light">
            {{ item.course.name }}
          </div>
          <div class="text-caption font-weight-thin">
            <small>{{ item.uiid }} | Periodo {{ item.course.term }}</small>
          </div>
          <div class="text-caption">
            {{ item.teacher_name }}
          </div>
        </v-card-title>

        <v-card-text class="py-4">
          <div class="font-weight-thin">
            {{ item.program_name }}
          </div>
          <div class="text-caption font-weight-thin text-medium-emphasis">
            {{ item.course.code }}
          </div>
        </v-card-text>

        <v-avatar class="class-card-avatar" size="56">
          <v-img
            :src="item.teacher_avatar || defaultAvatar"
            alt="Profesor"
            cover
          />
        </v-avatar>
      </v-card>
    </v-col>
  </v-row>
  <v-row v-else class="ma-0">
    <v-col cols="12" class="text-center">
      <v-progress-circular :size="100" :width="7" indeterminate />
    </v-col>
  </v-row>
</template>

<script setup>
// Importaciones externas
import { ref, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

// Importaciones internas
import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getEncodeId } from "@/utils/coders";

// Constantes
const routeName = "groups";
const alert = inject("alert");
const store = useStore();
const route = useRoute();

// Estado
const isLoading = ref(true);
const items = ref([]);

const getItems = async () => {
  try {
    const endpoint = `${URL_API}/student/${routeName}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    items.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getItems();
});

const colors = [
  "pink",
  "purple",
  "purple",
  "deep-purple",
  "blue",
  "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deep-orange",
  "blue-grey",
];
const defaultAvatar =
  "https://imgs.search.brave.com/rwE-hC6ESt3hBJZhImPkb-KvU26bLDKVe-OKv1y50-M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzE0LzQz/LzU1LzE0NDM1NWQ3/YjM2YzVmNjQ2NDM1/NDIzNzk4MjgxY2U5/LmpwZw";
</script>

<style scoped>
.class-card-avatar {
  position: absolute;
  right: 16px;
  top: 60px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
}
</style>
