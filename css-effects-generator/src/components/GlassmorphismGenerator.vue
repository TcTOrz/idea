<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div class="controls p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <h2 class="text-xl font-semibold mb-6 text-gray-800 dark:text-white">{{ $t('app.settings') }}</h2>
      
      <div class="mb-6">
        <div class="flex justify-between mb-2">
          <span class="text-gray-600 dark:text-gray-300">{{ $t('app.blur') }}</span>
          <span class="text-gray-500">{{ blur }}px</span>
        </div>
        <el-slider v-model="blur" :min="0" :max="40" />
      </div>

      <div class="mb-6">
        <div class="flex justify-between mb-2">
          <span class="text-gray-600 dark:text-gray-300">{{ $t('app.transparency') }}</span>
          <span class="text-gray-500">{{ transparency }}%</span>
        </div>
        <el-slider v-model="transparency" :min="0" :max="100" />
      </div>

      <div class="mb-6">
        <div class="flex justify-between mb-2">
          <span class="text-gray-600 dark:text-gray-300">{{ $t('app.color') }}</span>
        </div>
        <el-color-picker v-model="color" show-alpha />
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

    <div class="preview flex items-center justify-center min-h-[400px] rounded-xl relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
      <!-- Decorative circles -->
      <div class="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute top-10 right-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-20 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <!-- Glass Card -->
      <div class="glass-card p-8 rounded-xl w-64 h-64 flex items-center justify-center text-white" :style="cardStyle">
        <div class="text-center">
          <h3 class="text-xl font-bold mb-2">Glassmorphism</h3>
          <p class="opacity-80">CSS Generator</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const blur = ref(10)
const transparency = ref(25)
const color = ref('rgba(255, 255, 255, 0.25)')

const cardStyle = computed(() => {
  const alpha = transparency.value / 100
  
  let r = 255, g = 255, b = 255
  if (color.value.startsWith('#')) {
    const hex = color.value.substring(1)
    if (hex.length === 3) {
      r = parseInt(hex.charAt(0) + hex.charAt(0), 16)
      g = parseInt(hex.charAt(1) + hex.charAt(1), 16)
      b = parseInt(hex.charAt(2) + hex.charAt(2), 16)
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16)
      g = parseInt(hex.substring(2, 4), 16)
      b = parseInt(hex.substring(4, 6), 16)
    }
  } else if (color.value.startsWith('rgba') || color.value.startsWith('rgb')) {
     const match = color.value.match(/\d+/g)
     if (match && match.length >= 3) {
       r = parseInt(match[0]!)
       g = parseInt(match[1]!)
       b = parseInt(match[2]!)
     }
  }

  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha})`,
    backdropFilter: `blur(${blur.value}px)`,
    WebkitBackdropFilter: `blur(${blur.value}px)`,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
  }
})

const cssCode = computed(() => {
  const style = cardStyle.value
  return `background: ${style.backgroundColor};
backdrop-filter: ${style.backdropFilter};
-webkit-backdrop-filter: ${style.WebkitBackdropFilter};
border: ${style.border};
box-shadow: ${style.boxShadow};`
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

<style scoped>
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
</style>
