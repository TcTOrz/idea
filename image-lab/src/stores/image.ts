import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { processImage, type ProcessOptions, type ImageFormat, formatBytes } from '@/utils/image-processor'
import { useRefHistory } from '@vueuse/core'

export const useImageStore = defineStore('image', () => {
  const originalFile = ref<File | null>(null)
  const originalUrl = ref<string | null>(null)
  
  const processedBlob = ref<Blob | null>(null)
  const processedUrl = ref<string | null>(null)
  
  const isProcessing = ref(false)
  const error = ref<string | null>(null)

  const options = ref<ProcessOptions>({
    quality: 0.8,
    format: 'image/png',
    maintainAspectRatio: true,
    resizeMode: 'contain',
    offset: { x: 0, y: 0 },
    watermark: {
      text: '',
      color: '#ffffff',
      size: 48,
      opacity: 0.5,
      position: 'center',
      margin: 20
    },
    border: {
      enabled: false,
      color: '#000000',
      width: 10,
      radius: 0
    }
  })

  // History
  const { undo, redo, canUndo, canRedo, clear: clearHistory } = useRefHistory(options, {
    deep: true,
    capacity: 20,
  })

  // File stats
  const originalSize = computed(() => originalFile.value ? formatBytes(originalFile.value.size) : '0 B')
  const processedSize = computed(() => processedBlob.value ? formatBytes(processedBlob.value.size) : '0 B')
  const reduction = computed(() => {
    if (!originalFile.value || !processedBlob.value) return 0
    const diff = originalFile.value.size - processedBlob.value.size
    return Math.round((diff / originalFile.value.size) * 100)
  })

  const setFile = (file: File) => {
    // Cleanup previous
    if (originalUrl.value) URL.revokeObjectURL(originalUrl.value)
    if (processedUrl.value) URL.revokeObjectURL(processedUrl.value)
    
    originalFile.value = file
    originalUrl.value = URL.createObjectURL(file)
    processedBlob.value = null
    processedUrl.value = null
    error.value = null

    // Set default format based on file type if supported, else png
    const type = file.type as ImageFormat
    if (['image/png', 'image/jpeg', 'image/webp', 'image/avif'].includes(type)) {
      options.value.format = type
    } else {
      options.value.format = 'image/png'
    }
    
    // Reset other options
    options.value.quality = 0.8
    options.value.width = undefined
    options.value.height = undefined
    options.value.resizeMode = 'contain'
    options.value.offset = { x: 0, y: 0 }
    options.value.crop = undefined
    options.value.filters = {}
    options.value.transforms = { rotate: 0, flipH: false, flipV: false }
    options.value.watermark = {
      text: '',
      color: '#ffffff',
      size: 48,
      opacity: 0.5,
      position: 'center',
      margin: 20
    }
    options.value.border = {
      enabled: false,
      color: '#000000',
      width: 10,
      radius: 0
    }

    // Trigger initial process
    process()
    clearHistory()
  }

  const reset = () => {
    if (originalUrl.value) URL.revokeObjectURL(originalUrl.value)
    if (processedUrl.value) URL.revokeObjectURL(processedUrl.value)
    
    originalFile.value = null
    originalUrl.value = null
    processedBlob.value = null
    processedUrl.value = null
    error.value = null
    
    options.value = {
      quality: 0.8,
      format: 'image/png',
      maintainAspectRatio: true,
      resizeMode: 'contain',
      offset: { x: 0, y: 0 },
      filters: {},
      transforms: { rotate: 0, flipH: false, flipV: false },
      watermark: {
        text: '',
        color: '#ffffff',
        size: 48,
        opacity: 0.5,
        position: 'center',
        margin: 20
      },
      border: {
        enabled: false,
        color: '#000000',
        width: 10,
        radius: 0
      },
    }
  }

  const process = async () => {
    if (!originalFile.value) return
    
    isProcessing.value = true
    error.value = null
    
    try {
      // Small delay to allow UI to update
      await new Promise(resolve => setTimeout(resolve, 10))
      
      const blob = await processImage(originalFile.value, options.value)
      
      if (processedUrl.value) URL.revokeObjectURL(processedUrl.value)
      processedBlob.value = blob
      processedUrl.value = URL.createObjectURL(blob)
    } catch (e: any) {
      console.error(e)
      error.value = e.message || 'Error processing image'
    } finally {
      isProcessing.value = false
    }
  }

  // Watch options to auto-process
  // We might want to debounce this in the component or here
  watch(options, () => {
    process()
  }, { deep: true })

  return {
    originalFile,
    originalUrl,
    processedBlob,
    processedUrl,
    isProcessing,
    error,
    options,
    originalSize,
    processedSize,
    reduction,
    setFile,
    reset,
    process,
    undo,
    redo,
    canUndo,
    canRedo,
  }
})
