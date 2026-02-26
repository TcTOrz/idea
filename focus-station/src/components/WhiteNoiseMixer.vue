<template>
  <div class="mixer-container h-full flex flex-col">
    <!-- Header with Title and Tabs -->
    <div class="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-6 gap-4 shrink-0">
      <div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-1 tracking-tight">
          {{ $t('app.exploreSounds') }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400 text-xs font-medium max-w-xs">
          {{ $t('app.exploreSubtitle') }}
        </p>
      </div>
      
      <div class="flex flex-wrap gap-2">
        <button 
          class="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
          :class="[
            activeCategory === 'all' 
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-blue-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          ]"
          @click="activeCategory = 'all'"
        >
          {{ $t('app.all') }}
        </button>
        <button 
          class="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
          :class="[
            activeCategory === 'playing' 
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-blue-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          ]"
          @click="activeCategory = 'playing'"
        >
          {{ $t('app.playing') }}
        </button>
        <button 
          v-for="cat in categories" 
          :key="cat"
          class="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
          :class="[
            activeCategory === cat 
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-blue-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          ]"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Sound Grid -->
    <div class="grid grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1 content-start">
      <div 
        v-for="sound in displayedSounds" 
        :key="sound.id" 
        class="group relative bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 transition-all duration-300 border h-32 flex flex-col justify-between hover:shadow-md cursor-pointer"
        :class="[
          sound.enabled 
            ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 shadow-sm' 
            : 'border-transparent hover:border-gray-200 dark:hover:border-gray-600'
        ]"
        @click="toggleSound(sound)"
      >
        <!-- Top Row: Icon & Controls -->
        <div class="flex justify-between items-start">
          <!-- Icon -->
          <div 
            class="w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-colors duration-300"
            :class="[
              sound.enabled 
                ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300' 
                : 'text-gray-400 bg-white dark:bg-gray-600 dark:text-gray-400 group-hover:text-gray-600 group-hover:bg-gray-100'
            ]"
          >
            <component :is="sound.icon" />
          </div>

          <!-- Controls (Top Right) -->
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" :class="{ 'opacity-100': sound.enabled }" @click.stop>
             <!-- Variant Selector -->
             <el-dropdown 
               v-if="sound.files.length > 1" 
               trigger="click" 
               size="small"
               @command="(file: string) => changeSoundVariant(sound, file)"
             >
               <button class="w-6 h-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                 <el-icon class="text-xs"><Operation /></el-icon>
               </button>
               <template #dropdown>
                 <el-dropdown-menu>
                   <el-dropdown-item 
                     v-for="file in sound.files" 
                     :key="file" 
                     :command="file"
                     :class="{ 'text-blue-600 font-bold': sound.currentFile === file }"
                   >
                     {{ getFileName(file) }}
                   </el-dropdown-item>
                 </el-dropdown-menu>
               </template>
             </el-dropdown>
             
             <!-- Play/Pause Button -->
             <button 
               class="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-gray-600 transition-colors"
               @click.stop="toggleSound(sound)"
             >
               <el-icon class="text-sm">
                 <VideoPause v-if="sound.enabled" class="text-gray-800 dark:text-white" />
                 <VideoPlay v-else />
               </el-icon>
             </button>
          </div>
        </div>

        <!-- Middle Info -->
        <div class="mt-1 mb-0.5">
          <h4 class="font-bold text-gray-800 dark:text-white text-sm truncate" :class="{ 'text-blue-600 dark:text-blue-400': sound.enabled }">
            {{ sound.name }}
          </h4>
          <!-- <p class="text-[10px] text-gray-400">{{ sound.category }}</p> -->
        </div>

        <!-- Bottom Volume Slider -->
        <div class="h-4 flex items-center" @click.stop>
          <el-slider 
             v-model="sound.volume" 
             :show-tooltip="false" 
             size="small" 
             :disabled="!sound.enabled"
             @input="updateVolume(sound)"
             class="w-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted } from 'vue'
import { VideoPlay, VideoPause, Operation, Monitor, Pouring, CoffeeCup, Headset, Grape, Ship, HotWater, Sunny, Moon, Lightning, WindPower } from '@element-plus/icons-vue'
import soundConfig from '../assets/sounds.json'

interface Sound {
  id: string
  name: string
  icon: any
  enabled: boolean
  volume: number
  audio: HTMLAudioElement
  category: string
  files: string[]
  currentFile: string
}

const activeCategory = ref('all')

// Map category names to icons
const iconMap: Record<string, any> = {
  '雨声': Pouring,
  '键盘声': Monitor,
  '咖啡馆': CoffeeCup,
  '海浪': Ship,
  '白噪音': Headset,
  '森林': Grape,
  '篝火': HotWater,
  '风声': WindPower,
  '雷声': Lightning,
  '夜晚': Moon,
  '自然': Sunny
}

const categories = computed(() => soundConfig.map(c => c.category))

const sounds = ref<Sound[]>([])

const displayedSounds = computed(() => {
  if (activeCategory.value === 'all') {
    return sounds.value
  }
  if (activeCategory.value === 'playing') {
    return sounds.value.filter(s => s.enabled)
  }
  return sounds.value.filter(s => s.category === activeCategory.value)
})

onMounted(() => {
  // Initialize sounds from dynamic config
  soundConfig.forEach(cat => {
    cat.sounds.forEach((s, index) => {
      const firstFile = s.files[0]
      if (!firstFile) return
      
      sounds.value.push({
        id: `${cat.category}-${s.name}-${index}`,
        name: s.name,
        icon: iconMap[s.name] || iconMap[cat.category] || Headset,
        enabled: false,
        volume: 50,
        audio: new Audio(encodeAudioPath(firstFile)),
        category: cat.category,
        files: s.files,
        currentFile: firstFile
      })
    })
  })

  // Set default audio properties
  sounds.value.forEach(s => {
    s.audio.loop = true
    s.audio.volume = 0.5
  })
})

const getFileName = (path: string) => {
  if (!path) return ''
  const parts = path.split('/')
  const fileWithExt = parts[parts.length - 1]
  return fileWithExt ? fileWithExt.replace(/\.[^/.]+$/, "") : "" // Remove extension
}

const encodeAudioPath = (path: string) => {
  // Split path into segments and encode each part to handle non-ASCII characters
  return path.split('/').map(segment => encodeURIComponent(segment)).join('/')
}

const changeSoundVariant = (sound: Sound, file: string) => {
  if (sound.currentFile === file) return
  
  sound.audio.pause()
  sound.currentFile = file
  // Use encoded path for Audio constructor
  sound.audio = new Audio(encodeAudioPath(file))
  sound.audio.loop = true
  sound.audio.volume = sound.volume / 100
  
  if (sound.enabled) {
    sound.audio.play().catch(e => console.error("Audio play failed:", e))
  }
}

const toggleSound = (sound: Sound) => {
  sound.enabled = !sound.enabled
  if (sound.enabled) {
    sound.audio.play().catch((e: Error) => console.error("Audio play failed:", e))
  } else {
    sound.audio.pause()
  }
}

const updateVolume = (sound: Sound) => {
  sound.audio.volume = sound.volume / 100
}

const stopAllSounds = () => {
  sounds.value.forEach(s => {
    s.enabled = false
    s.audio.pause()
  })
}

const randomizeSounds = () => {
  stopAllSounds()
  // Pick 1-3 random sounds
  const count = Math.floor(Math.random() * 3) + 1
  const shuffled = [...sounds.value].sort(() => 0.5 - Math.random())
  shuffled.slice(0, count).forEach(s => {
    s.enabled = true
    s.volume = Math.floor(Math.random() * 40) + 30 // 30-70 volume
    s.audio.volume = s.volume / 100
    s.audio.play().catch(e => console.error(e))
  })
}

// Global controls exposed for parent
defineExpose({
  stopAllSounds,
  randomizeSounds,
  togglePlayPause: () => {
    const anyPlaying = sounds.value.some(s => s.enabled && !s.audio.paused)
    
    if (anyPlaying) {
      sounds.value.forEach(s => { if(s.enabled) s.audio.pause() })
    } else {
      sounds.value.forEach(s => { if(s.enabled) s.audio.play() })
    }
  }
})

onUnmounted(() => {
  sounds.value.forEach(s => {
    s.audio.pause()
    s.audio.currentTime = 0
  })
})
</script>

<style scoped>
/* Custom Slider Styles to match the clean look */
:deep(.el-slider__runway) {
  height: 4px;
  background-color: rgba(0,0,0,0.1);
  margin: 0;
}
.dark :deep(.el-slider__runway) {
  background-color: rgba(255,255,255,0.1);
}
:deep(.el-slider__bar) {
  height: 4px;
  background-color: #3b82f6;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}
:deep(.el-slider__button) {
  width: 12px;
  height: 12px;
  border: 2px solid #3b82f6;
  background-color: white;
  transition: transform 0.2s;
}
:deep(.el-slider__button:hover) {
  transform: scale(1.2);
}
:deep(.el-dropdown-menu__item:not(.is-disabled):focus) {
  background-color: #eff6ff;
  color: #3b82f6;
}
.dark :deep(.el-dropdown-menu__item:not(.is-disabled):focus) {
  background-color: #1e3a8a;
  color: #60a5fa;
}
</style>
