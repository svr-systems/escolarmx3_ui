<template>
  <div>
    <div v-if="value" class="d-inline-flex align-center ga-1">
      <v-btn icon variant="text" size="x-small" @click.prevent="docPreview">
        <v-icon>{{ getIcon(props.ext) }}</v-icon>
        <v-tooltip activator="parent" location="right">Vista previa</v-tooltip>
      </v-btn>

      <v-btn icon variant="text" size="x-small" @click.prevent="docDwd" :disabled="disabled">
        <v-icon>mdi-download</v-icon>
        <v-tooltip activator="parent" location="right">Descargar</v-tooltip>
      </v-btn>

      <v-btn
        icon
        variant="text"
        size="small"
        :color="disabled ? 'error' : undefined"
        @click.prevent="toggleDelete"
      >
        <v-icon size="small">mdi-delete{{ disabled ? "-off" : "" }}</v-icon>
        <v-tooltip activator="parent" location="bottom">
          {{ disabled ? "Revertir eliminación" : "Eliminar" }}
        </v-tooltip>
      </v-btn>
    </div>

    <v-tooltip v-else location="right">
      <template #activator="{ props: activatorProps }">
        <v-icon v-bind="activatorProps" size="small">mdi-alert</v-icon>
      </template>
      <span>Pendiente</span>
    </v-tooltip>
  </div>
</template>

<script setup>
// Importaciones
import { ref, onMounted } from "vue";
import { getBlob } from "@/utils/coders";
import { getDateTime } from "@/utils/formatters";

// Props
const props = defineProps({
  value: String,
  ext: String,
  disabled: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(['toggle-delete']);

// Estado
const docUrl = ref(null);

// Métodos
const docPreview = () => {
  const link = document.createElement("a");
  link.href = docUrl.value;
  link.target = "_blank";
  link.click();
};

const docDwd = () => {
  const link = document.createElement("a");
  link.href = docUrl.value;
  link.setAttribute("target", "_blank");
  link.download = `doc_${getDateTime("", "", "")}.${props.ext || "bin"}`;
  link.click();
};

const toggleDelete = () => {
  emit('toggle-delete');
};

const getIcon = (ext) => {
  const icons = {
    pdf: 'mdi-file-pdf',
    png: 'mdi-file-image',
    jpg: 'mdi-file-image',
    jpeg: 'mdi-file-image',
    xml: 'mdi-file-xml',
    gif: 'mdi-file-image',
    txt: 'mdi-file-text',
  };
  return icons[ext?.toLowerCase()] || 'mdi-file';
};

// Inicialización
onMounted(() => {
  if (props.value && props.ext) {
    docUrl.value = URL.createObjectURL(getBlob(props.value, props.ext));
  }
});
</script>