<template>
  <div class="perspective-1000 w-full h-[320px]">
    <div 
      class="relative w-full h-full transition-transform duration-500 transform-style-3d"
      :class="{ 'rotate-y-180': isFlipped }"
    >
      <!-- Front Face -->
      <div class="h-full absolute inset-0 backface-hidden bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 relative flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <el-icon class="text-orange-500"><Monitor /></el-icon>
            {{ $t('app.sedentary') }}
          </h3>
          <div class="flex items-center gap-2">
            <el-switch v-model="isEnabled" size="small" />
            <button 
              class="w-6 h-6 rounded bg-orange-100 dark:bg-orange-800 flex items-center justify-center text-orange-500 hover:text-orange-600 transition-colors"
              @click="isFlipped = true"
            >
              <el-icon size="12"><Setting /></el-icon>
            </button>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center flex-1">
          <div class="relative w-32 h-32 flex items-center justify-center">
            <!-- Circular Progress -->
            <svg class="w-full h-full transform -rotate-90">
              <circle 
                class="text-orange-100 dark:text-orange-900/40"
                stroke-width="8"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
              <circle 
                class="text-orange-500 transition-all duration-1000 ease-linear"
                stroke-width="8"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="dashOffset"
                stroke-linecap="round"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-2xl font-bold text-orange-600 dark:text-orange-300 font-mono">
                {{ formatTime(elapsed) }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ isEnabled ? $t('app.sitting') : $t('app.paused') }}
              </span>
            </div>
          </div>

          <div class="mt-4 flex gap-4">
            <el-button size="small" @click="reset">
              {{ $t('app.moved') }}
            </el-button>
            <el-button size="small" text bg @click="toggleEnabled">
              {{ isEnabled ? $t('app.pause') : $t('app.resume') }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- Back Face (Settings) -->
      <div class="h-full absolute inset-0 backface-hidden rotate-y-180 bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 flex flex-col z-20">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <el-icon><Setting /></el-icon>
            {{ $t('app.settings') }}
          </h3>
          <button 
            class="w-6 h-6 rounded bg-orange-100 dark:bg-orange-800 flex items-center justify-center text-orange-500 hover:text-orange-600 transition-colors z-30 relative cursor-pointer"
            @click.stop="isFlipped = false"
          >
            <el-icon size="12"><Close /></el-icon>
          </button>
        </div>

        <div class="space-y-4 flex-1">
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ $t('app.reminderInterval') }}</span>
              <span class="text-sm font-mono text-orange-600 dark:text-orange-400">{{ maxTimeMinutes }} min</span>
            </div>
            <el-slider v-model="maxTimeMinutes" :min="15" :max="120" :step="15" :show-tooltip="false" size="small" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useStorage, useIntervalFn } from '@vueuse/core'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Setting, Close, Monitor } from '@element-plus/icons-vue'

const { t } = useI18n()
const isFlipped = ref(false)

const isEnabled = useStorage('focus-station-sedentary-enabled', true)
const lastMoveTime = useStorage('focus-station-last-move', Date.now())
const maxTimeMinutes = useStorage('focus-station-sedentary-duration', 60)
const elapsed = ref(0)
const hasNotified = ref(false)

const maxTime = computed(() => maxTimeMinutes.value * 60 * 1000)
const circumference = 2 * Math.PI * 58

const dashOffset = computed(() => {
  const progress = Math.min(elapsed.value / maxTime.value, 1)
  return circumference * (1 - progress)
})

// Need to update lastMoveTime when pausing to avoid "jump" on resume
watch(isEnabled, (newVal) => {
  if (newVal) {
    lastMoveTime.value = Date.now() - elapsed.value
  }
})

const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const reset = () => {
  lastMoveTime.value = Date.now()
  elapsed.value = 0
  hasNotified.value = false
}

const toggleEnabled = () => {
  isEnabled.value = !isEnabled.value
  if (isEnabled.value) {
    lastMoveTime.value = Date.now() - elapsed.value // Resume from where we left off (roughly)
  }
}

useIntervalFn(() => {
  if (isEnabled.value) {
    elapsed.value = Date.now() - lastMoveTime.value
    
    if (elapsed.value >= maxTime.value) {
      if (!hasNotified.value) {
        // Trigger alarm/notification
        ElNotification({
          title: t('app.sedentaryWarning'),
          message: t('app.timeToMove'),
          type: 'warning',
          duration: 0 // Sticky
        })
        hasNotified.value = true
      }
    } else {
      hasNotified.value = false
    }
  }
}, 1000)
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.transform-style-3d {
  transform-style: preserve-3d;
}
.backface-hidden {
  backface-visibility: hidden;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
