<script setup lang="ts">
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

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

const { t } = useI18n()

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
}

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
