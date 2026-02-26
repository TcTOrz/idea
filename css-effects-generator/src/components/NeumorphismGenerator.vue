<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div class="controls p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <h2 class="text-xl font-semibold mb-6 text-gray-800 dark:text-white">{{ $t('app.settings') }}</h2>
      
      <div class="mb-6">
        <div class="flex justify-between mb-2">
          <span class="text-gray-600 dark:text-gray-300">{{ $t('app.color') }}</span>
        </div>
        <el-color-picker v-model="color" />
      </div>

      <div class="mb-6">
        <div class="flex justify-between mb-2">
          <span class="text-gray-600 dark:text-gray-300">{{ $t('app.size') }}</span>
          <span class="text-gray-500">{{ size }}px</span>
        </div>
        <el-slider v-model="size" :min="10" :max="400" />
      </div>

      <div class="mb-6">
        <div class="flex justify-between mb-2">
          <span class="text-gray-600 dark:text-gray-300">{{ $t('app.radius') }}</span>
          <span class="text-gray-500">{{ radius }}px</span>
        </div>
        <el-slider v-model="radius" :min="0" :max="150" />
      </div>

      <div class="mb-6">
        <div class="flex justify-between mb-2">
          <span class="text-gray-600 dark:text-gray-300">{{ $t('app.distance') }}</span>
          <span class="text-gray-500">{{ distance }}px</span>
        </div>
        <el-slider v-model="distance" :min="5" :max="50" />
      </div>

      <div class="mb-6">
        <div class="flex justify-between mb-2">
          <span class="text-gray-600 dark:text-gray-300">{{ $t('app.intensity') }}</span>
          <span class="text-gray-500">{{ intensity }}</span>
        </div>
        <el-slider v-model="intensity" :min="0.01" :max="0.6" :step="0.01" />
      </div>

      <div class="mb-6">
        <div class="flex justify-between mb-2">
          <span class="text-gray-600 dark:text-gray-300">{{ $t('app.blur') }}</span>
          <span class="text-gray-500">{{ blur }}px</span>
        </div>
        <el-slider v-model="blur" :min="0" :max="100" />
      </div>

      <div class="mb-6">
        <div class="flex justify-between mb-2">
          <span class="text-gray-600 dark:text-gray-300">{{ $t('app.shape') }}</span>
        </div>
        <el-radio-group v-model="shape">
          <el-radio-button label="flat">{{ $t('app.flat') }}</el-radio-button>
          <el-radio-button label="concave">{{ $t('app.concave') }}</el-radio-button>
          <el-radio-button label="convex">{{ $t('app.convex') }}</el-radio-button>
          <el-radio-button label="pressed">{{ $t('app.pressed') }}</el-radio-button>
        </el-radio-group>
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

    <div class="preview flex items-center justify-center min-h-[400px] rounded-xl relative overflow-hidden transition-colors duration-300" :style="{ backgroundColor: color }">
      <div class="neumorphism-box transition-all duration-300" :style="boxStyle"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const color = ref('#e0e0e0')
const size = ref(200)
const radius = ref(50)
const distance = ref(20)
const intensity = ref(0.15)
const blur = ref(60)
const shape = ref('flat')

// Helper to manipulate color
const adjustColor = (col: string, amount: number) => {
    let usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
    let num = parseInt(col, 16);
    let r = (num >> 16) + amount;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amount;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amount;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}

const boxStyle = computed(() => {
  const d = distance.value
  const b = blur.value
  const s = shape.value
  const i = intensity.value
  
  // Calculate light and dark shadow colors
  const lightColor = `rgba(255, 255, 255, ${i})` // Simplification, usually lighter version of base
  const darkColor = `rgba(0, 0, 0, ${i})` // Darker version
  
  // Actually better to lighten/darken the base color
  // But using alpha on black/white is easier for dynamic colors
  // A better approach for neumorphism is:
  // Light shadow: lighter than base
  // Dark shadow: darker than base
  
  // Let's use simple lighten/darken logic or stick to alpha
  // Using alpha is robust for different background colors
  
  let shadow = ''
  let background = color.value
  
  if (s === 'flat') {
    shadow = `${d}px ${d}px ${b}px ${darkColor}, -${d}px -${d}px ${b}px ${lightColor}`
  } else if (s === 'pressed') {
    shadow = `inset ${d}px ${d}px ${b}px ${darkColor}, inset -${d}px -${d}px ${b}px ${lightColor}`
  } else if (s === 'concave') {
    shadow = `${d}px ${d}px ${b}px ${darkColor}, -${d}px -${d}px ${b}px ${lightColor}`
    background = `linear-gradient(145deg, ${adjustColor(color.value, -10)}, ${adjustColor(color.value, 10)})`
  } else if (s === 'convex') {
    shadow = `${d}px ${d}px ${b}px ${darkColor}, -${d}px -${d}px ${b}px ${lightColor}`
    background = `linear-gradient(145deg, ${adjustColor(color.value, 10)}, ${adjustColor(color.value, -10)})`
  }

  return {
    width: `${size.value}px`,
    height: `${size.value}px`,
    borderRadius: `${radius.value}px`,
    background: background,
    boxShadow: shadow
  }
})

const cssCode = computed(() => {
  return `border-radius: ${radius.value}px;
background: ${boxStyle.value.background};
box-shadow: ${boxStyle.value.boxShadow};`
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
