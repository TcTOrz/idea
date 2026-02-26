<template>
  <div class="perspective-1000 w-full h-[320px]">
    <div 
      class="relative w-full h-full transition-transform duration-500 transform-style-3d"
      :class="{ 'rotate-y-180': isFlipped }"
    >
      <!-- Front Face -->
      <div class="h-full absolute inset-0 backface-hidden bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <el-icon class="text-green-500"><Loading /></el-icon>
            {{ $t('app.breathing') }}
          </h3>
          <div class="flex items-center gap-2">
            <el-button 
              size="small" 
              :type="isActive ? 'danger' : 'success'" 
              circle 
              @click="toggleBreathing"
            >
              <el-icon><VideoPause v-if="isActive" /><VideoPlay v-else /></el-icon>
            </el-button>
            <button 
              class="w-6 h-6 rounded bg-green-100 dark:bg-green-800 flex items-center justify-center text-green-500 hover:text-green-600 transition-colors"
              @click="isFlipped = true"
            >
              <el-icon size="12"><Setting /></el-icon>
            </button>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center flex-1">
          <div v-if="!isActive" class="text-center text-gray-500 dark:text-gray-400">
            <p class="mb-2 text-sm">{{ $t('app.breathingIntro') }}</p>
            <span class="text-xs opacity-75">{{ currentTech.label }}</span>
          </div>

          <div v-else class="relative flex items-center justify-center">
            <!-- Expanding/Contracting Circle -->
            <div 
              class="w-32 h-32 rounded-full bg-green-400/30 dark:bg-green-500/30 absolute transition-all ease-in-out"
              :style="{ transitionDuration: `${duration}ms` }"
              :class="{ 
                'scale-150 opacity-80': phase === 'inhale', 
                'scale-100 opacity-60': phase === 'exhale',
                'scale-125 opacity-100': phase === 'hold'
              }"
            ></div>
            
            <div 
              class="w-24 h-24 rounded-full bg-green-500/50 dark:bg-green-600/50 absolute transition-all ease-in-out flex items-center justify-center"
              :style="{ transitionDuration: `${duration}ms` }"
              :class="{ 
                'scale-125': phase === 'inhale', 
                'scale-75': phase === 'exhale',
                'scale-100': phase === 'hold'
              }"
            >
            </div>

            <div class="z-10 text-center font-bold text-green-800 dark:text-green-100 drop-shadow-sm flex flex-col items-center">
              <span class="text-lg">{{ $t(`app.breath.${phase}`) }}</span>
              <span class="text-2xl">{{ timeLeft.toFixed(1) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Back Face (Settings) -->
      <div class="h-full absolute inset-0 backface-hidden rotate-y-180 bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 flex flex-col z-20">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <el-icon><Setting /></el-icon>
            {{ $t('app.settings') }}
          </h3>
          <button 
            class="w-6 h-6 rounded bg-green-100 dark:bg-green-800 flex items-center justify-center text-green-500 hover:text-green-600 transition-colors z-30 relative cursor-pointer"
            @click.stop="isFlipped = false"
          >
            <el-icon size="12"><Close /></el-icon>
          </button>
        </div>

        <div class="space-y-4 flex-1">
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ $t('app.technique') }}</span>
            </div>
            <div class="flex gap-2">
              <button 
                v-for="tech in techniques" 
                :key="tech.id"
                class="flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors border"
                :class="[
                  selectedTechnique === tech.id 
                    ? 'bg-green-100 dark:bg-green-800 border-green-300 dark:border-green-600 text-green-700 dark:text-green-200' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50'
                ]"
                @click="setTechnique(tech.id)"
              >
                {{ tech.label }}
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-2 text-center">{{ currentTech.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIntervalFn, useStorage } from '@vueuse/core'
import { Setting, Close, Loading, VideoPlay, VideoPause } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const isActive = ref(false)
const isFlipped = ref(false)
const phase = ref<'inhale' | 'hold' | 'exhale'>('inhale')
const selectedTechnique = useStorage('focus-station-breath-tech', '4-4-4')

const techniques = computed(() => [
  { id: '4-4-4', label: t('app.technique_4_4_4'), desc: 'Focus & Calm', inhale: 4000, hold: 4000, exhale: 4000 },
  { id: '4-7-8', label: t('app.technique_4_7_8'), desc: 'Sleep & Anxiety', inhale: 4000, hold: 7000, exhale: 8000 },
  { id: '6-0-6', label: t('app.technique_6_0_6'), desc: 'Balance & HRV', inhale: 6000, hold: 0, exhale: 6000 }
])

const currentTech = computed(() => techniques.value.find(t => t.id === selectedTechnique.value) || techniques.value[0]!)
const duration = ref(4000)
const timeLeft = ref(4)

const setTechnique = (id: string) => {
  selectedTechnique.value = id
  isActive.value = false
  phase.value = 'inhale'
  duration.value = currentTech.value.inhale // Update duration immediately
  pause()
}

// Watch for technique changes to update duration even if not active
import { watch } from 'vue'
watch(currentTech, (newVal) => {
  if (!isActive.value && newVal) {
    duration.value = newVal.inhale
  }
})

const { pause, resume } = useIntervalFn(() => {
  timeLeft.value = Math.max(0, parseFloat((timeLeft.value - 0.1).toFixed(1)))
  
  if (timeLeft.value <= 0) {
    if (phase.value === 'inhale') {
      if (currentTech.value.hold > 0) {
        phase.value = 'hold'
        duration.value = currentTech.value.hold
        timeLeft.value = currentTech.value.hold / 1000
      } else {
        phase.value = 'exhale'
        duration.value = currentTech.value.exhale
        timeLeft.value = currentTech.value.exhale / 1000
      }
    } else if (phase.value === 'hold') {
      phase.value = 'exhale'
      duration.value = currentTech.value.exhale
      timeLeft.value = currentTech.value.exhale / 1000
    } else {
      phase.value = 'inhale'
      duration.value = currentTech.value.inhale
      timeLeft.value = currentTech.value.inhale / 1000
    }
  }
}, 100, { immediate: false })

const toggleBreathing = () => {
  isActive.value = !isActive.value
  if (isActive.value) {
    phase.value = 'inhale'
    duration.value = currentTech.value.inhale
    timeLeft.value = currentTech.value.inhale / 1000
    resume()
  } else {
    pause()
  }
}
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
