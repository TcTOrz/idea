<script setup lang="ts">
import { VueMonacoEditor, useMonaco } from '@guolao/vue-monaco-editor'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { watch } from 'vue'

const props = defineProps<{
  modelValue: string
  readOnly?: boolean
  theme?: string
  fontSize?: number
  fontFamily?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const { t, locale } = useI18n()
const { monaco } = useMonaco()

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  contextmenu: true, // Enable context menu
}

// Function to update context menu actions
const updateContextMenu = (editor: any) => {
  if (!editor || !monaco) return

  // We can't easily translate built-in Monaco items (like "Command Palette", "Copy", "Paste") 
  // without using a localized build of Monaco or nls configuration at loader level.
  // However, we can add custom actions or try to modify existing ones if the API allows.
  
  // A common workaround for Vue/React wrappers is to hide the default context menu and roll your own,
  // OR to configure the loader to use a specific locale.
  
  // Since @guolao/vue-monaco-editor loads monaco from CDN by default, we can try to set the locale in the loader config.
  // But that usually requires a page reload.
}

watch(locale, () => {
   // Locale changed
   // Ideally we would reload the editor with new locale config, but Monaco doesn't support dynamic locale switching easily.
})

const handleUpdateValue = (val: string | undefined) => {
  emit('update:modelValue', val || '')
}

const handleMount = (editor: any) => {
  editor.onDidAttemptReadOnlyEdit(() => {
    ElMessage.warning(t('app.readOnlyWarning'))
  })
}
</script>

<template>
  <div class="h-full w-full">
    <VueMonacoEditor
      :value="modelValue"
      @update:value="handleUpdateValue"
      language="json"
      :theme="theme || 'vs-dark'"
      :options="{ ...MONACO_EDITOR_OPTIONS, readOnly, fontSize: fontSize || 14, fontFamily: fontFamily || 'Consolas, \'Courier New\', monospace' }"
      class="h-full"
      @mount="handleMount"
    />
  </div>
</template>
