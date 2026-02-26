<template>
  <div class="perspective-1000 w-full h-[320px]">
    <div 
      class="relative w-full h-full transition-transform duration-500 transform-style-3d"
      :class="{ 'rotate-y-180': isFlipped }"
    >
      <!-- Front Face -->
      <div class="h-full absolute inset-0 backface-hidden bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <el-icon class="text-blue-500"><Mug /></el-icon>
            {{ $t('app.hydration') }}
          </h3>
          <div class="flex items-center gap-2">
            <div class="text-sm font-medium text-blue-600 dark:text-blue-300">
              {{ cups }} / {{ target }} {{ $t('app.cups') }}
            </div>
            <button 
              class="w-6 h-6 rounded bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-500 hover:text-blue-600 transition-colors"
              @click="isFlipped = true"
            >
              <el-icon size="12"><Setting /></el-icon>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-center gap-4 my-2">
          <button 
            class="w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-gray-500 hover:text-blue-500 shadow-sm flex items-center justify-center transition-colors"
            @click="decrement"
            :disabled="cups <= 0"
          >
            <el-icon><Minus /></el-icon>
          </button>
          
          <div class="relative w-28 h-28 flex items-center justify-center">
            <!-- Water Wave Animation Background -->
            <div class="absolute inset-0 rounded-full bg-blue-100 dark:bg-blue-900/40 overflow-hidden">
              <div 
                class="absolute bottom-0 left-0 right-0 bg-blue-400/50 dark:bg-blue-500/50 transition-all duration-500 ease-out"
                :style="{ height: `${(cups / target) * 100}%` }"
              ></div>
            </div>
            
            <span class="text-3xl font-bold text-blue-600 dark:text-blue-300 relative z-10 font-mono">
              {{ cups }}
            </span>
          </div>

          <button 
            class="w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-blue-500 shadow-sm flex items-center justify-center hover:bg-blue-50 transition-colors"
            @click="increment"
          >
            <el-icon><Plus /></el-icon>
          </button>
        </div>

        <div class="text-center mt-auto">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {{ $t('app.nextReminder') }}: {{ nextReminderTime }}
          </p>
          <el-button size="small" text bg @click="reset">
            {{ $t('app.reset') }}
          </el-button>
        </div>
      </div>

      <!-- Back Face (Settings) -->
      <div class="h-full absolute inset-0 backface-hidden rotate-y-180 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 flex flex-col z-20">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <el-icon><Setting /></el-icon>
            {{ $t('app.settings') }}
          </h3>
          <button 
            class="w-6 h-6 rounded bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-500 hover:text-blue-600 transition-colors z-30 relative cursor-pointer"
            @click.stop="isFlipped = false"
          >
            <el-icon size="12"><Close /></el-icon>
          </button>
        </div>

        <div class="space-y-4 flex-1">
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ $t('app.dailyGoal') }}</span>
              <span class="text-sm font-mono text-blue-600 dark:text-blue-400">{{ target }} {{ $t('app.cups') }}</span>
            </div>
            <el-slider v-model="target" :min="1" :max="20" :show-tooltip="false" size="small" />
          </div>

          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ $t('app.reminderInterval') }}</span>
              <span class="text-sm font-mono text-blue-600 dark:text-blue-400">{{ reminderIntervalMinutes }} min</span>
            </div>
            <el-slider v-model="reminderIntervalMinutes" :min="15" :max="120" :step="15" :show-tooltip="false" size="small" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStorage, useIntervalFn } from '@vueuse/core'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Setting, Close, Mug, Minus, Plus } from '@element-plus/icons-vue'

const { t } = useI18n()
const isFlipped = ref(false)

const cups = useStorage('focus-station-hydration-cups', 0)
const target = useStorage('focus-station-hydration-target', 8)
const reminderIntervalMinutes = useStorage('focus-station-hydration-interval', 45)
const lastDrinkTime = useStorage('focus-station-last-drink', Date.now())

const reminderInterval = computed(() => reminderIntervalMinutes.value * 60 * 1000)

const nextReminderTime = computed(() => {
  const next = new Date(lastDrinkTime.value + reminderInterval.value)
  return next.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})

const increment = () => {
  cups.value++
  lastDrinkTime.value = Date.now()
  checkGoal()
}

const decrement = () => {
  if (cups.value > 0) cups.value--
}

const reset = () => {
  cups.value = 0
  lastDrinkTime.value = Date.now()
}

const checkGoal = () => {
  if (cups.value === target.value) {
    ElNotification({
      title: t('app.greatJob'),
      message: t('app.hydrationGoalReached'),
      type: 'success',
    })
  }
}

// Check for reminder
useIntervalFn(() => {
  const now = Date.now()
  if (now - lastDrinkTime.value > reminderInterval.value) {
    ElNotification({
      title: t('app.hydration'),
      message: t('app.drinkWaterReminder'),
      type: 'warning',
    })
  }
}, 60000) // Check every minute
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
