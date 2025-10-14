<template>
  <div
    v-if="editor"
    class="mb-4 editor-container"
    :class="{
      'editor-error-border': isInvalid,
      'editor-default-border': !isInvalid,
    }"
  >
    <v-toolbar density="compact" rounded="t-md" border>
      <div class="d-flex ga-2 pa-2 flex-wrap toolbar-buttons">
        <v-btn
          rounded="lg"
          size="32"
          icon
          :class="{ 'is-active': editor.isActive('bold') }"
          @click="editor.chain().focus().toggleBold().run()"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
        >
          <v-icon>mdi-format-bold</v-icon>
        </v-btn>

        <v-btn
          rounded="lg"
          size="32"
          icon
          :class="{ 'is-active': editor.isActive('italic') }"
          @click="editor.chain().focus().toggleItalic().run()"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
        >
          <v-icon>mdi-format-italic</v-icon>
        </v-btn>

        <v-btn
          rounded="lg"
          size="32"
          icon
          :class="{ 'is-active': editor.isActive('strike') }"
          @click="editor.chain().focus().toggleStrike().run()"
          :disabled="!editor.can().chain().focus().toggleStrike().run()"
        >
          <v-icon>mdi-format-strikethrough</v-icon>
        </v-btn>

        <v-divider class="mx-1" vertical></v-divider>

        <v-btn
          v-for="level in 3"
          :key="level"
          rounded="lg"
          size="32"
          icon
          :class="{ 'is-active': editor.isActive('heading', { level }) }"
          @click="editor.chain().focus().toggleHeading({ level }).run()"
        >
          <v-icon>{{ `mdi-format-header-${level}` }}</v-icon>
        </v-btn>

        <v-divider class="mx-1" vertical></v-divider>

        <v-btn
          rounded="lg"
          size="32"
          icon
          :class="{ 'is-active': editor.isActive('bulletList') }"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-btn>

        <v-btn
          rounded="lg"
          size="32"
          icon
          :class="{ 'is-active': editor.isActive('orderedList') }"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <v-icon>mdi-format-list-numbered</v-icon>
        </v-btn>

        <v-btn
          rounded="lg"
          size="32"
          icon
          :class="{ 'is-active': editor.isActive('blockquote') }"
          @click="editor.chain().focus().toggleBlockquote().run()"
        >
          <v-icon>mdi-format-quote-close</v-icon>
        </v-btn>

        <v-divider class="mx-1" vertical></v-divider>

        <v-btn
          rounded="lg"
          size="32"
          icon
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().undo()"
        >
          <v-icon>mdi-undo</v-icon>
        </v-btn>
        <v-btn
          rounded="lg"
          size="32"
          icon
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().redo()"
        >
          <v-icon>mdi-redo</v-icon>
        </v-btn>
      </div>
    </v-toolbar>

    <editor-content
      :editor="editor"
      :class="[
        ['pa-4'],
        ['tiptap-content'],
        [store.conf.theme_dark ? 'bg-grey-darken-4' : ''],
        ['border border-grey-lighten-1']
      ]"
    />
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { onBeforeUnmount, watch } from "vue";

import { useStore } from "@/store";

const store = useStore();

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  // Prop para manejo manual de errores
  isInvalid: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const editor = useEditor({
  extensions: [StarterKit],
  content: props.modelValue || "",
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (!editor.value) return;

    const currentHtml = editor.value.getHTML();

    // Comprobar si el contenido es idéntico para evitar bucles o movimientos innecesarios
    if (newValue !== currentHtml) {
      // setContent para reemplazar el contenido con HTML, false para evitar un bucle de actualización
      editor.value.commands.setContent(newValue || "", false);
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<style scoped>
/* Botones activos de Vuetify */
.toolbar-buttons .v-btn.is-active {
  background-color: rgb(var(--v-theme-primary));
  color: white;
}

/* Estilos para el contenedor del editor (simula el borde del campo) */
.editor-container {
  width: 100%;
  border-radius: 5px;
}

/* Estilo del borde en estado de error (simula el borde rojo) */
.editor-error-border {
  border: 2px solid rgb(var(--v-theme-error)) !important;
}

.tiptap-content :deep(.ProseMirror) {
  min-height: 200px;
  outline: none;
  line-height: 1.5;
}

/* Estilo blockquote */
.tiptap-content :deep(blockquote) {
  border-left: 4px solid #007bff;
  padding-left: 1rem;
  margin: 1em 0;
  color: #6c757d;
}
</style>
