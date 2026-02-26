<template>
  <div class="perspective-1000 w-full aspect-square">
    <div 
      class="relative w-full h-full transition-transform duration-500 transform-style-3d"
      :class="{ 'rotate-y-180': isFlipped }"
    >
      <!-- Front Face (Timer) -->
      <div class="absolute inset-0 backface-hidden p-6 bg-[#1a1a1a] text-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col justify-between">
        <!-- Top Bar: Tabs & Settings -->
        <div class="flex justify-between items-start z-10">
          <!-- Mode Tabs (Capsule style) -->
          <div class="bg-[#2a2a2a] p-1 rounded-full inline-flex">
            <button 
              v-for="m in ['pomodoro', 'shortBreak', 'longBreak'] as const"
              :key="m"
              class="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300"
              :class="[
                mode === m 
                  ? 'bg-[#3a3a3a] text-white shadow-sm' 
                  : 'text-gray-400 hover:text-gray-200'
              ]"
              @click="setMode(m)"
            >
              {{ $t(`app.${m}`) }}
            </button>
          </div>

          <!-- Settings Button -->
          <button 
            class="w-8 h-8 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            @click="isFlipped = true"
          >
            <el-icon><Setting /></el-icon>
          </button>
        </div>

        <!-- Timer Display (Center) -->
        <div class="flex-1 flex flex-col items-center justify-center -mt-4">
          <!-- Dots Indicator (Visual decoration) -->
          <div class="flex gap-1.5 mb-4 opacity-30">
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>

          <div class="timer-display text-7xl font-bold font-mono tracking-wider text-[#4a4a4a]">
            {{ formattedTime }}
          </div>
          
          <!-- Status Text -->
          <div class="mt-4 flex items-center gap-2 text-sm font-medium">
            <el-icon class="text-red-400"><Lightning /></el-icon>
            <span class="text-red-400">{{ $t(`app.${mode}`) }}</span>
            <span class="text-gray-500">•</span>
            <span class="text-red-400">{{ isRunning ? $t('app.running') : $t('app.paused') }}</span>
          </div>
        </div>

        <!-- Bottom Controls -->
        <div class="flex items-center gap-4 z-10">
          <!-- Play/Pause (Big Bar) -->
          <button 
            class="flex-1 h-14 bg-white hover:bg-gray-100 text-black rounded-2xl flex items-center justify-center gap-2 font-bold text-lg transition-all active:scale-[0.98]"
            @click="toggleTimer"
          >
            <el-icon class="text-xl">
              <VideoPause v-if="isRunning" />
              <VideoPlay v-else />
            </el-icon>
            {{ isRunning ? $t('app.pause') : $t('app.start') }}
          </button>
          
          <!-- Reset (Square) -->
          <button 
            class="w-14 h-14 rounded-2xl bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            @click="resetTimer"
            title="Reset"
          >
            <el-icon class="text-xl"><Refresh /></el-icon>
          </button>
        </div>
      </div>

      <!-- Back Face (Settings) -->
      <div class="absolute inset-0 backface-hidden rotate-y-180 p-6 bg-[#1a1a1a] text-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col z-20">
        <div class="flex justify-between items-center mb-4 shrink-0">
          <h3 class="text-lg font-bold flex items-center gap-2">
            <el-icon><Setting /></el-icon>
            {{ $t('app.settings') }}
          </h3>
          <button 
            class="w-8 h-8 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer z-30 relative"
            @click.stop="isFlipped = false"
          >
            <el-icon><Close /></el-icon>
          </button>
        </div>

        <div class="space-y-3 flex-1 overflow-y-auto no-scrollbar">
          <!-- Durations -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider">{{ $t('app.workDuration') }}</h4>
            <div class="bg-[#2a2a2a] rounded-xl px-4 py-3">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm text-gray-300">{{ $t('app.pomodoro') }}</span>
                <span class="text-sm font-mono text-primary-400">{{ localSettings.pomodoro }} min</span>
              </div>
              <el-slider v-model="localSettings.pomodoro" :min="1" :max="60" :show-tooltip="false" @change="saveSettings" size="small" />
            </div>
            
            <div class="bg-[#2a2a2a] rounded-xl px-4 py-3">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm text-gray-300">{{ $t('app.shortBreak') }}</span>
                <span class="text-sm font-mono text-primary-400">{{ localSettings.shortBreak }} min</span>
              </div>
              <el-slider v-model="localSettings.shortBreak" :min="1" :max="30" :show-tooltip="false" @change="saveSettings" size="small" />
            </div>

            <div class="bg-[#2a2a2a] rounded-xl px-4 py-3">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm text-gray-300">{{ $t('app.longBreak') }}</span>
                <span class="text-sm font-mono text-primary-400">{{ localSettings.longBreak }} min</span>
              </div>
              <el-slider v-model="localSettings.longBreak" :min="1" :max="60" :show-tooltip="false" @change="saveSettings" size="small" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, reactive, watch } from 'vue'
import { useTitle } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { ElNotification } from 'element-plus'
import { Setting, VideoPlay, VideoPause, Refresh, Lightning, Close } from '@element-plus/icons-vue'

const { t } = useI18n()
const title = useTitle()

const emit = defineEmits(['update:settings'])

const props = defineProps<{
  pomodoro?: number
  shortBreak?: number
  longBreak?: number
}>()

const isFlipped = ref(false)
const localSettings = reactive({
  pomodoro: props.pomodoro || 25,
  shortBreak: props.shortBreak || 5,
  longBreak: props.longBreak || 15
})

const saveSettings = () => {
  emit('update:settings', { ...localSettings })
}

// Watch props to update local state if parent changes (though unlikely with this flow)
watch(() => props.pomodoro, (val) => val && (localSettings.pomodoro = val))
watch(() => props.shortBreak, (val) => val && (localSettings.shortBreak = val))
watch(() => props.longBreak, (val) => val && (localSettings.longBreak = val))

const mode = ref<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro')
const isRunning = ref(false)
const timeLeft = ref((props.pomodoro || 25) * 60)
let timerInterval: number | null = null

const durations = computed(() => ({
  pomodoro: (props.pomodoro || 25) * 60,
  shortBreak: (props.shortBreak || 5) * 60,
  longBreak: (props.longBreak || 15) * 60
}))

// Watch for prop changes to update timer
watch(() => props.pomodoro, (newVal) => {
  if (mode.value === 'pomodoro' && !isRunning.value) {
    timeLeft.value = (newVal || 25) * 60
  }
})

watch(() => props.shortBreak, (newVal) => {
  if (mode.value === 'shortBreak' && !isRunning.value) {
    timeLeft.value = (newVal || 5) * 60
  }
})

watch(() => props.longBreak, (newVal) => {
  if (mode.value === 'longBreak' && !isRunning.value) {
    timeLeft.value = (newVal || 15) * 60
  }
})

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const setMode = (newMode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
  mode.value = newMode
  pauseTimer()
  timeLeft.value = durations.value[newMode]
}

const startTimer = () => {
  if (isRunning.value) return
  isRunning.value = true
  timerInterval = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
      title.value = `${formattedTime.value} - ${t('app.title')}`
    } else {
      pauseTimer()
      playAlarm()
      
      if (Notification.permission === 'granted') {
        new Notification("Time's up!", { body: t(`app.${mode.value}`) + " finished!" })
      }
      
      ElNotification({
        title: t('app.title'),
        message: t(`app.${mode.value}`) + " finished!",
        type: 'success',
        duration: 0
      })
    }
  }, 1000)
}

const playAlarm = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return
    
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5)
    
    gain.gain.setValueAtTime(0.5, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
    
    osc.start()
    osc.stop(ctx.currentTime + 0.5)
  } catch (e) {
    console.error('Audio play failed', e)
  }
}

const pauseTimer = () => {
  isRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const toggleTimer = () => {
  if (isRunning.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

const resetTimer = () => {
  pauseTimer()
  timeLeft.value = durations.value[mode.value]
}

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

// Request notification permission
if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission()
}
</script>

<style scoped>
.timer-display {
  font-variant-numeric: tabular-nums;
}

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

/* Hide Scrollbar */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
