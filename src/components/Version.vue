<template>
  <div class="text-caption font-weight-thin text-medium-emphasis">
    Desarrollado por EscolarMX © {{ getCurrentYear() }}
    <br />
    <small>{{ getApi(BASE_URL) }} | v{{ APP_VERSION }}</small>
  </div>
</template>

<script setup>
// Constantes y funciones
import { APP_VERSION, BASE_URL } from "@/utils/config";
import { getApi } from "@/utils/http";
import { getCurrentYear } from "@/utils/helpers";
</script>
