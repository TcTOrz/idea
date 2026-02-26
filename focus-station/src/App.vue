<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="container mx-auto px-4 py-6 max-w-6xl">
      <!-- Header -->
      <header class="flex justify-between items-center mb-10">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <el-icon class="text-primary-600 dark:text-primary-400"><Timer /></el-icon>
          {{ $t('app.title') }}
        </h1>
        <div class="flex items-center gap-4">
          <el-switch
            v-model="isDark"
            inline-prompt
            :active-icon="Moon"
            :inactive-icon="Sunny"
            style="--el-switch-on-color: #4b5563; --el-switch-off-color: #d1d5db"
            @change="toggleDark"
          />
          
          <el-dropdown @command="handleLanguageChange">
            <span class="el-dropdown-link cursor-pointer text-gray-600 dark:text-gray-300 flex items-center text-sm font-medium">
              {{ currentLang === 'zh' ? 'CN' : 'EN' }}
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh">中文</el-dropdown-item>
                <el-dropdown-item command="en">English</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- Main Content Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Column 1: Focus (Timer & Tasks) -->
        <div class="space-y-6">
          <PomodoroTimer 
            ref="timerRef"
            :pomodoro="settings.pomodoro"
            :short-break="settings.shortBreak"
            :long-break="settings.longBreak"
            @update:settings="updateSettings"
          />
          <TaskList />
        </div>

        <!-- Column 2: Ambience (Sound Mixer) -->
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 h-full flex flex-col">
          <WhiteNoiseMixer ref="mixerRef" />
        </div>

        <!-- Column 3: Wellness (Hydration, Sedentary, Breathing) -->
        <div class="space-y-6">
          <div class="grid grid-cols-1 gap-6">
            <HydrationTracker />
            <SedentaryReminder />
            <BreathingExercise />
          </div>
        </div>
      </div>

      <Settings 
        @update:settings="updateSettings" 
      />
      <BuyCoffee />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDown, Timer, Moon, Sunny } from '@element-plus/icons-vue'
import { useStorage } from '@vueuse/core'
import PomodoroTimer from './components/PomodoroTimer.vue'
import WhiteNoiseMixer from './components/WhiteNoiseMixer.vue'
import TaskList from './components/TaskList.vue'
import Settings from './components/Settings.vue'
import HydrationTracker from './components/HydrationTracker.vue'
import SedentaryReminder from './components/SedentaryReminder.vue'
import BreathingExercise from './components/BreathingExercise.vue'
import { BuyCoffee } from '@idea/shared/vue'

const { locale } = useI18n()
const currentLang = ref(locale.value)
const isDark = ref(false)
const mixerRef = ref<InstanceType<typeof WhiteNoiseMixer> | null>(null)

const settings = useStorage('focus-station-settings', {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15
})

const updateSettings = (newSettings: any) => {
  settings.value = newSettings
}

const handleLanguageChange = (lang: string) => {
  locale.value = lang
  currentLang.value = lang
}

const toggleDark = (val: boolean) => {
  const html = document.documentElement
  if (val) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}

// Global Shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  // Ignore shortcuts if user is typing in an input
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

  switch(e.code) {
    case 'Space':
      e.preventDefault()
      // Toggle Mixer Playback (or Timer? Mixer makes more sense for "Media")
      // But typically Space toggles the Timer in Pomodoro apps.
      // Let's stick to Mixer as requested by "mimic ppbzy" which says "Space Play/Pause" (likely sounds)
      // Actually ppbzy says "Space Play/Pause", likely for sounds.
      mixerRef.value?.togglePlayPause()
      break
    case 'KeyM':
      // Mute/Stop all sounds
      mixerRef.value?.stopAllSounds()
      break
    case 'KeyR':
      // Randomize
      mixerRef.value?.randomizeSounds()
      break
    case 'KeyX':
      // Clear/Stop
      mixerRef.value?.stopAllSounds()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Initialize dark mode based on system preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  isDark.value = true
  toggleDark(true)
}
</script>

<style>
/* Global overrides for cleaner look */
.el-button--primary {
  --el-button-bg-color: #4f46e5;
  --el-button-border-color: #4f46e5;
  --el-button-hover-bg-color: #4338ca;
  --el-button-hover-border-color: #4338ca;
}

.dark .el-button--primary {
  --el-button-bg-color: #6366f1;
  --el-button-border-color: #6366f1;
  --el-button-hover-bg-color: #818cf8;
  --el-button-hover-border-color: #818cf8;
}
</style>
