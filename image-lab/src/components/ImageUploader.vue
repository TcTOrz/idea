<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { UploadCloud } from 'lucide-vue-next'

const { t } = useI18n()
const emit = defineEmits(['file-selected'])
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    emit('file-selected', file)
  }
}

const onFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    emit('file-selected', file)
  }
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors"
    :class="isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
    @click="fileInput?.click()"
  >
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      accept="image/*"
      @change="onFileSelect"
    />
    <UploadCloud class="w-12 h-12 text-gray-400 mb-4" />
    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold">
      {{ t('upload.drop') }}
    </p>
    <p class="text-xs text-gray-500 dark:text-gray-400">
      {{ t('upload.support') }}
    </p>
  </div>
</template>
