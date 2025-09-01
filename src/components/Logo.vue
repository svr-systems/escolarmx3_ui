<template>
  <img
    :src="store.conf.theme_dark ? logo_b : logo"
    alt="Logo"
    v-bind="imgAttrs"
  />
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "@/store";
import logo from "@/assets/logo.png";
import logo_b from "@/assets/logo_b.png";

const store = useStore();

const props = defineProps({
  width: [String, Number],
  height: [String, Number],
});

const imgAttrs = computed(() => {
  if (props.width) {
    return {
      width: typeof props.width === "number" ? `${props.width}px` : props.width,
    };
  }

  if (props.height) {
    return {
      height:
        typeof props.height === "number" ? `${props.height}px` : props.height,
    };
  }

  return { width: "48px" };
});
</script>
