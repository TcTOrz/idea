<script setup lang="ts">
import { ref, watch } from 'vue'
import { useImageStore } from '@/stores/image'
import { Download, RefreshCw, X, Eye, EyeOff, Copy, Undo, Redo } from 'lucide-vue-next'
import { downloadBlob, renderToCanvas, loadImage } from '@/utils/image-processor'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useImageStore()
const zoom = ref(1)
const showOriginal = ref(false)

const reset = () => {
  store.reset()
  ElMessage.success(t('messages.resetSuccess'))
}

const download = () => {
  if (store.processedBlob) {
    const format = store.options.format || 'image/png'
    const ext = format.split('/')[1] || 'png'
    const name = store.originalFile?.name.split('.')[0] || 'image'
    downloadBlob(store.processedBlob, `${name}-optimized.${ext}`)
    ElMessage.success(t('messages.downloadStarted'))
  }
}

const copyToClipboard = async () => {
  if (!store.processedBlob) return
  
  try {
    const format = store.options.format || 'image/png'
    // Clipboard API only supports PNG in most browsers
    if (format !== 'image/png') {
       ElMessage.warning(t('messages.copyPngOnly'))
       return
    }
    
    await navigator.clipboard.write([
      new ClipboardItem({
        [format]: store.processedBlob
      })
    ])
    ElMessage.success(t('messages.copySuccess'))
  } catch (err) {
    console.error(err)
    ElMessage.error(t('messages.copyFailed'))
  }
}


const toggleZoom = () => {
  zoom.value = zoom.value === 1 ? 2 : 1
}

const toggleCompare = () => {
  showOriginal.value = !showOriginal.value
}

// Canvas Preview Logic
const canvasRef = ref<HTMLCanvasElement | null>(null)
const originalImage = ref<HTMLImageElement | null>(null)
// We need to keep track of temporary offset during drag
const tempOffset = ref({ x: 0, y: 0 })

// Hint logic
const showHint = ref(false)
const hintTimer = ref<number | null>(null)

const onMouseEnter = () => {
  if (!store.originalFile) return
  const hasSeenHint = localStorage.getItem('image-lab-hint-seen')
  if (!hasSeenHint) {
    showHint.value = true
    if (hintTimer.value) clearTimeout(hintTimer.value)
    hintTimer.value = window.setTimeout(() => {
      showHint.value = false
      localStorage.setItem('image-lab-hint-seen', 'true')
    }, 4000)
  }
}

const onWheel = (e: WheelEvent) => {
  if (!store.originalFile) return
  e.preventDefault()
  
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  const newZoom = Math.min(Math.max(zoom.value * delta, 0.1), 10)
  zoom.value = parseFloat(newZoom.toFixed(2))
}

// Load original image when file changes
watch(() => store.originalFile, async (file) => {
  if (file) {
    try {
      originalImage.value = await loadImage(file)
      drawPreview()
    } catch (e) {
      console.error('Failed to load original image for preview', e)
    }
  } else {
    originalImage.value = null
  }
}, { immediate: true })

// Redraw when options change (deep watch)
// But skip if we are dragging (we handle redraw manually for perf)
watch(() => store.options, () => {
  if (!isDragging.value) {
     drawPreview()
  }
}, { deep: true })

// Also redraw when window resizes (if needed? usually not for canvas content, but maybe for container size?)
// Actually canvas width/height is determined by store options.

const drawPreview = () => {
  if (!canvasRef.value || !originalImage.value) return
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Determine target dimensions based on store options
  // This logic must match processImage logic to ensure consistency
  const options = store.options
  const img = originalImage.value
  
  const sWidth = options.crop?.width ?? img.naturalWidth;
  const sHeight = options.crop?.height ?? img.naturalHeight;

  let targetWidth = options.width;
  let targetHeight = options.height;

  if (!targetWidth && !targetHeight) {
    targetWidth = sWidth;
    targetHeight = sHeight;
  } else if (targetWidth && !targetHeight) {
    targetHeight = (sHeight / sWidth) * targetWidth;
  } else if (!targetWidth && targetHeight) {
    targetWidth = (sWidth / sHeight) * targetHeight;
  }
  
  targetWidth = Math.round(targetWidth!);
  targetHeight = Math.round(targetHeight!);

  const rotate = options.transforms?.rotate || 0;
  const isRotated = rotate === 90 || rotate === 270;
  
  // Set canvas resolution
  canvas.width = isRotated ? targetHeight : targetWidth;
  canvas.height = isRotated ? targetWidth : targetHeight;
  
  // Merge store offset with temp offset (during drag)
  const currentOffset = {
      x: (options.offset?.x || 0) + tempOffset.value.x,
      y: (options.offset?.y || 0) + tempOffset.value.y
  }
  
  // Create a temporary options object with merged offset
  const renderOptions = {
      ...options,
      offset: currentOffset
  }
  
  renderToCanvas(ctx, img, renderOptions, canvas.width, canvas.height)
}

// Drag & Drop for Panning
const isDragging = ref(false)
const hasMoved = ref(false)
const dragStart = ref({ x: 0, y: 0 })

// Reset offset when processing is done
watch(() => store.processedUrl, () => {
  // We don't need to do anything here for canvas preview
  // The canvas is redrawn immediately on drag
  // And the store process updates the download blob in background
})

const onMouseDown = (e: MouseEvent) => {
  if (showOriginal.value || !originalImage.value) return
  e.preventDefault() 
  isDragging.value = true
  hasMoved.value = false
  dragStart.value = { x: e.clientX, y: e.clientY }
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !canvasRef.value) return
  
  const deltaX = e.clientX - dragStart.value.x
  const deltaY = e.clientY - dragStart.value.y
  
  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
     hasMoved.value = true
  }

  // Calculate canvas delta
  // Canvas is displayed with object-contain.
  // We need to map screen pixels to canvas pixels.
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  
  // If canvas is larger than rect, scale > 1 (we see a shrunk version)
  // If canvas is smaller than rect, scale < 1 (we see a zoomed version? No, max-width 100%)
  // Actually logic is:
  // displayed width = rect.width
  // actual width = canvas.width
  // ratio = canvas.width / rect.width
  
  // Note: zoom ref affects the CSS transform scale, so rect.width includes zoom.
  // BUT, we want to move the content inside the canvas.
  // If we zoom in 2x, the canvas looks 2x bigger.
  // Dragging 100px on screen -> 50px on unzoomed screen (if zoom 2).
  // Then map unzoomed screen to canvas.
  
  // Actually getBoundingClientRect returns the size *after* transform.
  // So rect.width is the visual width.
  // canvas.width is the pixel width.
  // ratio = canvas.width / rect.width
  
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  
  // Update temp offset
  tempOffset.value = { 
      x: deltaX * scaleX, 
      y: deltaY * scaleY 
  }
  
  // Redraw canvas immediately
  requestAnimationFrame(() => {
      drawPreview()
  })
}

const onMouseUp = () => {
  if (!isDragging.value) return
  isDragging.value = false
  
  if (!hasMoved.value) {
     toggleZoom()
     tempOffset.value = { x: 0, y: 0 }
     drawPreview() // Clear any small movement
     return
  }
  
  // Commit offset to store
  if (store.options.offset) {
      store.options.offset.x += tempOffset.value.x
      store.options.offset.y += tempOffset.value.y
  } else {
      store.options.offset = { ...tempOffset.value }
  }
  
  tempOffset.value = { x: 0, y: 0 }
  
  // Trigger final process (this will eventually update processedBlob, but we don't use it for preview anymore)
  // Wait, if we use canvas for preview, we don't rely on store.processedUrl for display!
  // This solves the flicker issue completely.
  store.process()
}

const onMouseLeave = () => {
  if (isDragging.value) {
    onMouseUp()
  }
}

</script>

<template>
  <div class="relative w-full h-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-700">
    
    <div class="absolute top-4 right-4 z-10 flex gap-2 items-center flex-wrap justify-end pointer-events-none">
      <!-- Undo/Redo -->
      <div class="flex mr-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden pointer-events-auto">
        <button 
          @click="store.undo()"
          class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-r border-gray-100 dark:border-gray-700"
          :title="t('actions.undo')"
          :disabled="!store.canUndo"
        >
          <Undo class="w-4 h-4" />
        </button>
        <button 
          @click="store.redo()"
          class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          :title="t('actions.redo')"
          :disabled="!store.canRedo"
        >
          <Redo class="w-4 h-4" />
        </button>
      </div>

      <div class="flex gap-2 pointer-events-auto">
        <button 
          @click="toggleCompare"
          class="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95"
          :title="showOriginal ? 'Show Processed' : 'Show Original'"
          @mousedown="showOriginal = true"
          @mouseup="showOriginal = false"
          @mouseleave="showOriginal = false"
        >
          <Eye v-if="!showOriginal" class="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <EyeOff v-else class="w-5 h-5 text-blue-600" />
        </button>

        <button 
          @click="copyToClipboard"
          class="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Copy to Clipboard"
          :disabled="!store.processedBlob || store.options.format !== 'image/png'"
        >
          <Copy class="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <button 
          @click="reset"
          class="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-95 group"
          title="Reset"
        >
          <X class="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-red-500" />
        </button>
        <button 
          @click="download"
          class="p-2 bg-blue-600 rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          title="Download"
          :disabled="!store.processedBlob"
        >
          <Download class="w-5 h-5 text-white" />
        </button>
      </div>
    </div>

    <!-- Image Display -->
    <div 
      class="relative w-full h-full overflow-hidden p-4 flex items-center justify-center bg-dots"
      @mouseenter="onMouseEnter"
      @wheel="onWheel"
    >
      <div v-if="store.isProcessing" class="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <RefreshCw class="w-8 h-8 text-white animate-spin" />
      </div>

      <!-- Hint Overlay -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div v-if="showHint" class="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-black/70 text-white text-sm rounded-full backdrop-blur-md shadow-lg pointer-events-none whitespace-nowrap">
          {{ t('messages.zoomHint') }}
        </div>
      </transition>
      
      <!-- Compare Label -->
      <div v-if="store.processedUrl" class="absolute top-4 left-4 z-10 px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-md pointer-events-none">
        {{ showOriginal ? 'Original' : 'Processed' }}
      </div>

      <!-- Original Image -->
      <img
        v-if="showOriginal && store.originalUrl"
        :src="store.originalUrl"
        class="max-w-none transition-transform duration-200 origin-center object-contain shadow-lg select-none"
        :style="{ transform: `scale(${zoom})`, maxHeight: '100%', maxWidth: '100%' }"
        @click="toggleZoom"
      />

      <!-- Processed Canvas -->
      <canvas
        v-show="!showOriginal && store.originalFile"
        ref="canvasRef"
        class="max-w-none transition-transform duration-200 origin-center object-contain shadow-lg select-none"
        :style="{ 
          transform: `scale(${zoom})`, 
          maxHeight: '100%', 
          maxWidth: '100%',
          cursor: isDragging ? 'grabbing' : 'grab'
        }"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseLeave"
      />
      
      <div v-if="!store.originalFile" class="text-gray-400">
        No preview available
      </div>
    </div>
    
  </div>
</template>
