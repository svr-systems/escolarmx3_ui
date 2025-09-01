<template>
  <v-row align="center" justify="center">
    <v-icon :color="!isDark ? 'warning' : 'grey'"
      >mdi-white-balance-sunny</v-icon
    >

    <v-switch
      v-model="darkMode"
      hide-details
      inset
      class="mx-2"
      color="primary"
    />

    <v-icon :color="isDark ? 'info' : 'grey'">mdi-weather-night</v-icon>
  </v-row>
</template>

<script setup>
import { computed } from "vue";
import { useTheme } from "vuetify";
import { useStore } from "@/store";

const store = useStore();
const theme = useTheme();

const isDark = computed(() => store.conf.theme_dark);

const darkMode = computed({
  get: () => isDark.value,
  set: (val) => {
    store.themeDarkAction();
    theme.change(val ? "dark" : "light");
  },
});
</script>
