<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div class="controls p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">{{ $t('app.settings') }}</h2>
        <el-button type="primary" @click="addLayer">Add Layer</el-button>
      </div>

      <div class="space-y-6 max-h-[500px] overflow-y-auto pr-2">
        <div v-for="(layer, index) in layers" :key="index" class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative">
          <div class="absolute top-2 right-2">
            <el-button type="danger" link @click="removeLayer(index)" v-if="layers.length > 1">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span class="text-xs text-gray-500 block mb-1">X Offset ({{ layer.x }}px)</span>
              <el-slider v-model="layer.x" :min="-100" :max="100" size="small" />
            </div>
            <div>
              <span class="text-xs text-gray-500 block mb-1">Y Offset ({{ layer.y }}px)</span>
              <el-slider v-model="layer.y" :min="-100" :max="100" size="small" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span class="text-xs text-gray-500 block mb-1">Blur ({{ layer.blur }}px)</span>
              <el-slider v-model="layer.blur" :min="0" :max="100" size="small" />
            </div>
            <div>
              <span class="text-xs text-gray-500 block mb-1">Spread ({{ layer.spread }}px)</span>
              <el-slider v-model="layer.spread" :min="-50" :max="50" size="small" />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 dark:text-gray-300">Color</span>
              <el-color-picker v-model="layer.color" show-alpha size="small" />
            </div>
            <el-checkbox v-model="layer.inset" label="Inset" size="small" />
          </div>
        </div>
      </div>

      <div class="mt-8">
        <h3 class="text-lg font-medium mb-4 text-gray-800 dark:text-white">CSS</h3>
        <div class="relative group">
          <pre class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm font-mono overflow-x-auto text-gray-800 dark:text-gray-300">{{ cssCode }}</pre>
          <el-button 
            type="primary" 
            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            size="small"
            @click="copyCode"
          >
            {{ $t('app.copy') }}
          </el-button>
        </div>
      </div>
    </div>

    <div class="preview flex items-center justify-center min-h-[400px] bg-white dark:bg-gray-900 rounded-xl relative overflow-hidden border border-gray-200 dark:border-gray-700">
      <div class="w-48 h-48 bg-blue-500 rounded-xl transition-all duration-300" :style="{ boxShadow: boxShadowString }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

const { t } = useI18n()

interface ShadowLayer {
  x: number
  y: number
  blur: number
  spread: number
  color: string
  inset: boolean
}

const layers = ref<ShadowLayer[]>([
  { x: 0, y: 10, blur: 15, spread: -3, color: 'rgba(0, 0, 0, 0.1)', inset: false },
  { x: 0, y: 4, blur: 6, spread: -2, color: 'rgba(0, 0, 0, 0.05)', inset: false }
])

const addLayer = () => {
  layers.value.push({ x: 0, y: 0, blur: 10, spread: 0, color: 'rgba(0, 0, 0, 0.2)', inset: false })
}

const removeLayer = (index: number) => {
  layers.value.splice(index, 1)
}

const boxShadowString = computed(() => {
  return layers.value.map(l => {
    return `${l.inset ? 'inset ' : ''}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`
  }).join(', ')
})

const cssCode = computed(() => {
  return `box-shadow: ${boxShadowString.value};`
})

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(cssCode.value)
    ElMessage.success(t('app.copied'))
  } catch (e) {
    ElMessage.error('Failed to copy')
  }
}
</script>
