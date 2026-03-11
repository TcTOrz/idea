<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFullscreen } from '@vueuse/core'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import parser from 'cron-parser'
import { ElMessage } from 'element-plus'
import { 
  Timer, SwitchButton, Calendar, Clock, CopyDocument, RefreshRight, 
  Connection, Place, Plus, Stopwatch, List, Warning, FullScreen
} from '@element-plus/icons-vue'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(isLeapYear)
dayjs.extend(weekOfYear)
dayjs.extend(dayOfYear)

const { t } = useI18n()

// --- Current Time ---
const currentTimestamp = ref(Math.floor(Date.now() / 1000))
const currentTimestampMs = ref(Date.now())
const currentTimeFormatted = ref('')
const isRunning = ref(true)
let intervalId: any = null

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

// --- Fullscreen Themes ---
const themes = [
  {
    name: 'Hyper Modern',
    bg: 'bg-black',
    text: 'text-white font-black tracking-tighter',
    subText: 'text-gray-500 font-bold',
    overlayClass: 'backdrop-blur-none',
    specialEffect: 'glitch'
  },
  {
    name: 'Glass Morphism',
    bg: 'bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 animate-gradient-xy',
    text: 'text-white drop-shadow-lg font-bold',
    subText: 'text-white/80 font-medium',
    containerClass: 'bg-white/20 backdrop-blur-xl border border-white/30 rounded-[3rem] p-12 shadow-2xl',
    specialEffect: 'glass'
  },
  {
    name: 'Neon Outline',
    bg: 'bg-slate-950',
    text: 'text-transparent font-black tracking-widest stroke-text',
    subText: 'text-cyan-500/50 font-light',
    specialEffect: 'outline'
  },
  {
    name: 'Zen Minimal',
    bg: 'bg-[#f0f0f0]',
    text: 'text-slate-800 font-thin tracking-widest',
    subText: 'text-slate-400 font-extralight',
    specialEffect: 'breathing'
  },
  {
    name: 'Cyber Terminal',
    bg: 'bg-black',
    text: 'text-green-500 font-mono font-bold tracking-tight',
    subText: 'text-green-900 font-mono',
    specialEffect: 'matrix'
  }
]

const currentTheme = ref(themes[0])

const randomizeTheme = () => {
  const idx = Math.floor(Math.random() * themes.length)
  currentTheme.value = themes[idx]
}

watch(isFullscreen, (val) => {
  if (val) {
    randomizeTheme()
  }
})

// Extra Date Info
const currentWeek = ref(0)
const currentDayOfYear = ref(0)
const isLeap = ref(false)

const updateCurrentTime = () => {
  const now = Date.now()
  currentTimestampMs.value = now
  currentTimestamp.value = Math.floor(now / 1000)
  
  const d = dayjs(now)
  currentTimeFormatted.value = d.format('YYYY-MM-DD HH:mm:ss')
  currentWeek.value = d.week()
  currentDayOfYear.value = d.dayOfYear()
  isLeap.value = d.isLeapYear()
}

const toggleTimer = () => {
  if (isRunning.value) {
    clearInterval(intervalId)
    isRunning.value = false
  } else {
    updateCurrentTime()
    intervalId = setInterval(updateCurrentTime, 10)
    isRunning.value = true
  }
}

// --- Tab 1: Format Convert ---
const inputTimestamp = ref('')
const timestampUnit = ref('s')
const convertedDate = ref('')
const targetFormat = ref('YYYY-MM-DD HH:mm:ss')
const extraInfo = ref('')

const convertTimestampToDate = () => {
  if (!inputTimestamp.value) return
  let ts = Number(inputTimestamp.value)
  if (isNaN(ts)) {
    ElMessage.error(t('invalidTimestamp'))
    return
  }
  if (timestampUnit.value === 's') ts = ts * 1000
  
  const d = dayjs(ts)
  convertedDate.value = d.format(targetFormat.value)
  extraInfo.value = `UTC: ${d.utc().format()} | ISO: ${d.toISOString()}`
  ElMessage.success(t('converted'))
}

const inputDate = ref('')
const convertedTimestamp = ref('')
const convertedTimestampMs = ref('')

const convertDateToTimestamp = () => {
  if (!inputDate.value) return
  const d = dayjs(inputDate.value)
  convertedTimestampMs.value = d.valueOf().toString()
  convertedTimestamp.value = Math.floor(d.valueOf() / 1000).toString()
  ElMessage.success(t('converted'))
}

const setNowToInput = () => {
  inputDate.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
  convertDateToTimestamp()
}

const setNowToTimestampInput = () => {
  inputTimestamp.value = Math.floor(Date.now() / 1000).toString()
  timestampUnit.value = 's'
  convertTimestampToDate()
}

// --- Tab 2: Calculation ---
// Diff
const calcStart = ref('')
const calcEnd = ref('')
const diffResult = ref('')
const diffTotalMs = ref('')

const calculateDiff = () => {
  if (!calcStart.value || !calcEnd.value) return
  const start = dayjs(calcStart.value)
  const end = dayjs(calcEnd.value)
  const diffMs = end.diff(start)
  const dur = dayjs.duration(diffMs)
  
  diffTotalMs.value = diffMs.toString()
  diffResult.value = t('calc.diffResult', {
    d: Math.floor(dur.asDays()),
    h: dur.hours(),
    m: dur.minutes(),
    s: dur.seconds()
  })
}

// Add/Sub
const baseTime = ref('')
const calcOp = ref('add') // add, sub
const calcVal = ref(1)
const calcUnit = ref('d') // y, M, w, d, h, m, s
const calcResultDate = ref('')
const calcResultTs = ref('')

const unitOptions = [
  { value: 'y', label: 'calc.units.y' },
  { value: 'M', label: 'calc.units.M' },
  { value: 'w', label: 'calc.units.w' },
  { value: 'd', label: 'calc.units.d' },
  { value: 'h', label: 'calc.units.h' },
  { value: 'm', label: 'calc.units.m' },
  { value: 's', label: 'calc.units.s' },
]

const calculateAddSub = () => {
  if (!baseTime.value) return
  const base = dayjs(baseTime.value)
  let res = base
  if (calcOp.value === 'add') {
    res = base.add(calcVal.value, calcUnit.value as any)
  } else {
    res = base.subtract(calcVal.value, calcUnit.value as any)
  }
  calcResultDate.value = res.format('YYYY-MM-DD HH:mm:ss')
  calcResultTs.value = Math.floor(res.valueOf() / 1000).toString()
}

// --- Tab 3: Timezone ---
const tzSourceTime = ref('')
const tzSourceZone = ref(dayjs.tz.guess())
const tzTargetZone = ref('UTC')
const tzResult = ref('')

const commonTimezones = [
  'UTC',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Australia/Sydney',
  'Asia/Singapore',
  'Asia/Dubai'
]

const convertTimezone = () => {
  if (!tzSourceTime.value) return
  const d = dayjs.tz(tzSourceTime.value, tzSourceZone.value)
  tzResult.value = d.tz(tzTargetZone.value).format('YYYY-MM-DD HH:mm:ss')
}

// --- Tab 4: Cron ---
const cronExpression = ref('*/5 * * * *')
const nextRuns = ref<string[]>([])
const cronError = ref('')

const parseCron = () => {
  try {
    cronError.value = ''
    nextRuns.value = []
    
    // Handle potential import discrepancies (CJS/ESM/Vite)
    // In v5+, it exports a class with static parse method
    const cronParser: any = (parser as any).default || parser
    const parseFn = cronParser.parse || cronParser.parseExpression
    
    if (typeof parseFn !== 'function') {
      throw new Error('Cron parser initialization failed')
    }

    const interval = parseFn(cronExpression.value)
    for (let i = 0; i < 5; i++) {
      nextRuns.value.push(dayjs(interval.next().toDate()).format('YYYY-MM-DD HH:mm:ss'))
    }
  } catch (err: any) {
    console.error('Cron Parse Error:', err)
    cronError.value = `${t('cron.invalid')}: ${err.message}`
  }
}

const cronExamples = [
  { label: 'cron.desc.everyMinute', val: '* * * * *' },
  { label: 'cron.desc.every5Minutes', val: '*/5 * * * *' },
  { label: 'cron.desc.everyHour', val: '0 * * * *' },
  { label: 'cron.desc.daily', val: '0 0 * * *' },
  { label: 'cron.desc.weekly', val: '0 0 * * 0' },
  { label: 'cron.desc.monthly', val: '0 0 1 * *' },
]

const applyCronExample = (val: string) => {
  cronExpression.value = val
  parseCron()
}

// --- Common ---
const copyToClipboard = (text: string) => {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success(t('copied'))
  })
}

onMounted(() => {
  updateCurrentTime()
  intervalId = setInterval(updateCurrentTime, 10)
  
  // Init inputs
  const nowStr = dayjs().format('YYYY-MM-DD HH:mm:ss')
  inputTimestamp.value = currentTimestamp.value.toString()
  inputDate.value = nowStr
  calcStart.value = nowStr
  calcEnd.value = dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
  baseTime.value = nowStr
  tzSourceTime.value = nowStr
  
  // Initial runs
  convertTimestampToDate()
  convertDateToTimestamp()
  calculateDiff()
  calculateAddSub()
  convertTimezone()
  parseCron()
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    
    <!-- Hero / Current Time Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-3">
        <el-card class="!rounded-xl !border-0 shadow-lg dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300 overflow-hidden relative">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>
          <div class="p-2">
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center gap-2">
                <el-icon :size="24" class="text-blue-500"><Timer /></el-icon>
                <h2 class="text-xl font-bold text-gray-800 dark:text-white m-0">{{ t('current') }}</h2>
              </div>
              <div class="flex gap-2">
                <el-tooltip :content="t('clickToFullscreen')" placement="top">
                  <el-button circle plain @click="toggleFullscreen">
                    <el-icon><FullScreen /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-button 
                  :type="isRunning ? 'danger' : 'success'" 
                  circle
                  plain
                  @click="toggleTimer"
                >
                  <el-icon><SwitchButton /></el-icon>
                </el-button>
              </div>
            </div>
            
            <!-- Current Formatted Time Display -->
            <div class="text-center mb-8 group cursor-pointer relative overflow-hidden" @click="toggleFullscreen">
               <div class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300 tracking-wider tabular-nums group-hover:scale-105 transition-transform duration-300 drop-shadow-sm px-2">
                 {{ currentTimeFormatted }}
               </div>
               <div class="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-sm text-gray-400 flex justify-center items-center gap-1 absolute w-full -bottom-6 left-0">
                  <el-icon><FullScreen /></el-icon> {{ t('clickToFullscreen') }}
               </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 py-4 border-t border-gray-100 dark:border-gray-700 mt-8 pt-8">
              <div class="text-center group cursor-pointer" @click="copyToClipboard(currentTimestamp.toString())">
                <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{{ t('second') }} (Unix)</div>
                <div class="text-5xl font-mono font-bold text-blue-500 group-hover:scale-105 transition-transform duration-200 tabular-nums">
                  {{ currentTimestamp }}
                </div>
                <div class="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-blue-400 flex justify-center items-center gap-1">
                  <el-icon><CopyDocument /></el-icon> {{ t('clickToCopy') }}
                </div>
              </div>
              
              <div class="text-center group cursor-pointer" @click="copyToClipboard(currentTimestampMs.toString())">
                <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{{ t('millisecond') }}</div>
                <div class="text-5xl font-mono font-bold text-teal-500 group-hover:scale-105 transition-transform duration-200 tabular-nums">
                  {{ currentTimestampMs }}
                </div>
                <div class="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-teal-400 flex justify-center items-center gap-1">
                  <el-icon><CopyDocument /></el-icon> {{ t('clickToCopy') }}
                </div>
              </div>
            </div>

            <!-- Extra Info -->
            <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
               <span class="flex items-center gap-1"><el-icon><Calendar /></el-icon> {{ t('dateInfo.week', { n: currentWeek }) }}</span>
               <span class="flex items-center gap-1"><el-icon><Stopwatch /></el-icon> {{ t('dateInfo.dayOfYear', { n: currentDayOfYear }) }}</span>
               <span class="flex items-center gap-1">
                 <el-icon><Warning /></el-icon> 
                 {{ isLeap ? t('dateInfo.isLeap') : t('dateInfo.notLeap') }}
               </span>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- Main Features Tabs -->
    <el-tabs type="border-card" class="custom-tabs !rounded-xl !border-0 shadow-md">
      
      <!-- Tab 1: Format Convert -->
      <el-tab-pane>
        <template #label>
          <span class="flex items-center gap-2">
            <el-icon><Connection /></el-icon> {{ t('tabs.format') }}
          </span>
        </template>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
          <!-- Timestamp to Date -->
          <div class="flex flex-col gap-5">
            <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <div class="flex items-center gap-2">
                <el-icon :size="18" class="text-purple-500"><Calendar /></el-icon>
                <span class="font-bold text-gray-800 dark:text-white">{{ t('timestampToDate') }}</span>
              </div>
              <el-tooltip :content="t('useCurrentTime')" placement="top">
                <el-button circle size="small" @click="setNowToTimestampInput">
                  <el-icon><RefreshRight /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
            
            <div class="space-y-4">
              <el-input 
                v-model="inputTimestamp" 
                :placeholder="t('timestamp')" 
                size="large"
                clearable
                @keyup.enter="convertTimestampToDate"
              >
                <template #append>
                  <el-select v-model="timestampUnit" style="width: 80px" class="unit-select">
                    <el-option :label="t('second')" value="s" />
                    <el-option :label="t('millisecond')" value="ms" />
                  </el-select>
                </template>
              </el-input>

               <el-input v-model="targetFormat" placeholder="YYYY-MM-DD HH:mm:ss" size="default">
                 <template #prefix><span class="text-gray-400 text-xs">Fmt:</span></template>
               </el-input>

              <el-button type="primary" class="w-full !rounded-lg" @click="convertTimestampToDate">
                {{ t('convert') }}
              </el-button>

              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                <div v-if="convertedDate">
                   <div class="text-xl font-mono text-gray-800 dark:text-gray-100 mb-2 cursor-pointer hover:text-blue-500" @click="copyToClipboard(convertedDate)">
                     {{ convertedDate }}
                   </div>
                   <div class="text-xs text-gray-400 font-mono">{{ extraInfo }}</div>
                </div>
                <div v-else class="text-gray-300 dark:text-gray-500 text-sm">{{ t('waitingInput') }}</div>
              </div>
            </div>
          </div>

          <!-- Date to Timestamp -->
          <div class="flex flex-col gap-5 border-l-0 lg:border-l border-gray-100 dark:border-gray-700 pl-0 lg:pl-8">
            <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <div class="flex items-center gap-2">
                <el-icon :size="18" class="text-orange-500"><Clock /></el-icon>
                <span class="font-bold text-gray-800 dark:text-white">{{ t('dateToTimestamp') }}</span>
              </div>
              <el-tooltip :content="t('useCurrentTime')" placement="top">
                <el-button circle size="small" @click="setNowToInput">
                  <el-icon><RefreshRight /></el-icon>
                </el-button>
              </el-tooltip>
            </div>

            <div class="space-y-4">
              <el-date-picker
                v-model="inputDate"
                type="datetime"
                :placeholder="t('datetime')"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                class="!w-full"
                size="large"
                @change="convertDateToTimestamp"
              />
              
              <div class="h-[32px]"></div> <!-- Spacer -->

              <el-button type="primary" class="w-full !rounded-lg" @click="convertDateToTimestamp">
                {{ t('convert') }}
              </el-button>

              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 grid grid-cols-2 gap-4">
                <div class="text-center cursor-pointer hover:text-orange-500" @click="copyToClipboard(convertedTimestamp)">
                  <div class="text-xs text-gray-400 mb-1">Seconds</div>
                  <div class="font-mono font-bold">{{ convertedTimestamp || '-' }}</div>
                </div>
                <div class="text-center cursor-pointer hover:text-orange-500" @click="copyToClipboard(convertedTimestampMs)">
                  <div class="text-xs text-gray-400 mb-1">Milliseconds</div>
                  <div class="font-mono font-bold">{{ convertedTimestampMs || '-' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- Tab 2: Calculation -->
      <el-tab-pane>
        <template #label>
          <span class="flex items-center gap-2">
            <el-icon><Stopwatch /></el-icon> {{ t('tabs.calculation') }}
          </span>
        </template>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
          <!-- Time Difference -->
          <div class="flex flex-col gap-5">
             <div class="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                <el-icon :size="18" class="text-green-500"><SwitchButton class="rotate-90" /></el-icon>
                <span class="font-bold text-gray-800 dark:text-white">{{ t('calc.diff') }}</span>
             </div>

             <div class="space-y-4">
               <div>
                 <label class="text-xs text-gray-500 mb-1 block">{{ t('calc.startTime') }}</label>
                 <el-date-picker v-model="calcStart" type="datetime" class="!w-full" size="default" />
               </div>
               <div>
                 <label class="text-xs text-gray-500 mb-1 block">{{ t('calc.endTime') }}</label>
                 <el-date-picker v-model="calcEnd" type="datetime" class="!w-full" size="default" />
               </div>

               <el-button type="success" class="w-full !rounded-lg" @click="calculateDiff">
                 {{ t('calc.result') }}
               </el-button>

               <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                 <div v-if="diffResult" class="space-y-2">
                    <div class="text-lg font-bold text-green-600 dark:text-green-400">{{ diffResult }}</div>
                    <div class="text-sm text-gray-400">{{ t('calc.totalMs', { ms: diffTotalMs }) }}</div>
                 </div>
                 <div v-else class="text-gray-300 dark:text-gray-500 text-sm">{{ t('waitingInput') }}</div>
               </div>
             </div>
          </div>

          <!-- Add/Subtract -->
          <div class="flex flex-col gap-5 border-l-0 lg:border-l border-gray-100 dark:border-gray-700 pl-0 lg:pl-8">
             <div class="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                <el-icon :size="18" class="text-blue-500"><Plus /></el-icon>
                <span class="font-bold text-gray-800 dark:text-white">{{ t('calc.addSub') }}</span>
             </div>

             <div class="space-y-4">
               <div>
                 <label class="text-xs text-gray-500 mb-1 block">{{ t('calc.baseTime') }}</label>
                 <el-date-picker v-model="baseTime" type="datetime" class="!w-full" size="default" />
               </div>
               
               <div class="flex gap-2">
                  <el-select v-model="calcOp" class="!w-32">
                    <el-option :label="t('calc.add')" value="add" />
                    <el-option :label="t('calc.sub')" value="sub" />
                  </el-select>
                  <el-input-number v-model="calcVal" :min="0" class="flex-1" />
                  <el-select v-model="calcUnit" class="!w-28">
                    <el-option v-for="u in unitOptions" :key="u.value" :label="t(u.label)" :value="u.value" />
                  </el-select>
               </div>

               <el-button type="primary" class="w-full !rounded-lg" @click="calculateAddSub">
                 {{ t('calc.result') }}
               </el-button>

               <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                 <div v-if="calcResultDate">
                    <div class="text-lg font-mono font-bold text-blue-600 dark:text-blue-400 cursor-pointer" @click="copyToClipboard(calcResultDate)">
                      {{ calcResultDate }}
                    </div>
                    <div class="text-sm text-gray-400 mt-1 cursor-pointer" @click="copyToClipboard(calcResultTs)">
                      TS: {{ calcResultTs }}
                    </div>
                 </div>
                 <div v-else class="text-gray-300 dark:text-gray-500 text-sm">{{ t('waitingInput') }}</div>
               </div>
             </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- Tab 3: Timezone -->
      <el-tab-pane>
        <template #label>
          <span class="flex items-center gap-2">
            <el-icon><Place /></el-icon> {{ t('tabs.timezone') }}
          </span>
        </template>

        <div class="max-w-2xl mx-auto p-4 space-y-6">
           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="space-y-2">
               <label class="text-sm font-bold text-gray-700 dark:text-gray-300">{{ t('tz.source') }}</label>
               <el-select v-model="tzSourceZone" filterable allow-create class="w-full">
                 <el-option v-for="tz in commonTimezones" :key="tz" :label="tz" :value="tz" />
               </el-select>
               <el-date-picker v-model="tzSourceTime" type="datetime" class="!w-full" :placeholder="t('tz.sourceTime')" />
             </div>

             <div class="space-y-2">
               <label class="text-sm font-bold text-gray-700 dark:text-gray-300">{{ t('tz.target') }}</label>
               <el-select v-model="tzTargetZone" filterable allow-create class="w-full">
                 <el-option v-for="tz in commonTimezones" :key="tz" :label="tz" :value="tz" />
               </el-select>
             </div>
           </div>

           <div class="flex justify-center">
             <el-button type="primary" size="large" circle @click="convertTimezone">
               <el-icon><RefreshRight /></el-icon>
             </el-button>
           </div>

           <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 text-center">
              <div class="text-sm text-gray-500 mb-2">{{ t('tz.targetTime') }}</div>
              <div v-if="tzResult" class="text-3xl font-mono font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer" @click="copyToClipboard(tzResult)">
                {{ tzResult }}
              </div>
              <div v-else class="text-gray-300 dark:text-gray-500 text-lg">{{ t('waitingInput') }}</div>
           </div>
        </div>
      </el-tab-pane>

      <!-- Tab 4: Cron Expression -->
      <el-tab-pane>
        <template #label>
          <span class="flex items-center gap-2">
            <el-icon><List /></el-icon> {{ t('tabs.cron') }}
          </span>
        </template>

        <div class="p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
           <!-- Main Cron Input -->
           <div class="lg:col-span-2 space-y-6">
              <div class="space-y-2">
                <label class="font-bold text-gray-700 dark:text-gray-300">{{ t('cron.expression') }}</label>
                <div class="flex gap-2">
                  <el-input 
                    v-model="cronExpression" 
                    placeholder="* * * * *" 
                    size="large" 
                    @input="parseCron"
                  />
                  <el-button type="primary" size="large" @click="parseCron">{{ t('cron.parse') }}</el-button>
                </div>
              </div>

              <div v-if="cronError" class="p-4 bg-red-50 text-red-500 rounded-lg">
                {{ cronError }}
              </div>

              <div v-else class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                 <div class="font-bold text-gray-700 dark:text-gray-300 mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
                   {{ t('cron.nextRuns', { n: 5 }) }}
                 </div>
                 <ul class="space-y-2">
                   <li v-for="(run, idx) in nextRuns" :key="idx" class="font-mono text-gray-600 dark:text-gray-400 flex items-center gap-3">
                     <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">{{ idx + 1 }}</span>
                     {{ run }}
                   </li>
                 </ul>
              </div>
           </div>

           <!-- Examples Sidebar -->
           <div class="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
             <div class="font-bold text-blue-700 dark:text-blue-400 mb-4 flex items-center gap-2">
               <el-icon><List /></el-icon> {{ t('cron.examples') }}
             </div>
             <div class="space-y-2">
               <div 
                 v-for="ex in cronExamples" 
                 :key="ex.val"
                 class="p-2 hover:bg-white dark:hover:bg-gray-700 rounded cursor-pointer transition-colors text-sm"
                 @click="applyCronExample(ex.val)"
               >
                 <div class="font-mono text-gray-800 dark:text-gray-200 font-bold">{{ ex.val }}</div>
                 <div class="text-gray-500">{{ t(ex.label) }}</div>
               </div>
             </div>
           </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- Footer Cheatsheet -->
    <div class="text-center text-xs text-gray-400 pt-8 border-t border-gray-200 dark:border-gray-800">
       <div class="mb-2 font-bold">Common Formats</div>
       <div class="flex flex-wrap justify-center gap-4 font-mono">
         <span>ISO 8601: YYYY-MM-DDTHH:mm:ss.sssZ</span>
         <span>RFC 2822: ddd, DD MMM YYYY HH:mm:ss ZZ</span>
         <span>Unix: Seconds since Jan 01 1970</span>
       </div>
    </div>
    <!-- Fullscreen Overlay -->
    <div v-if="isFullscreen" 
         class="fixed inset-0 z-[9999] flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-1000 ease-in-out overflow-hidden"
         :class="currentTheme.bg"
         @click="toggleFullscreen">
      
      <!-- Background Effects -->
      <div v-if="currentTheme.specialEffect === 'matrix'" class="absolute inset-0 bg-[url('https://fontmeme.com/permalink/240101/matrix-font.png')] opacity-10 animate-pulse"></div>
      
      <!-- Content Container -->
      <div class="relative z-10 flex flex-col items-center justify-center transition-all duration-700"
           :class="currentTheme.containerClass || ''">
        
        <!-- Time Display -->
        <div class="flex items-baseline gap-2 md:gap-4 tabular-nums transition-all duration-700 animate-float drop-shadow-2xl">
           <div class="text-[18vw] md:text-[15vw] font-bold leading-none tracking-tighter select-none" :class="currentTheme.text">
             {{ currentTimeFormatted.split(' ')[1].split(':').slice(0, 2).join(':') }}
           </div>
           <div class="text-[8vw] md:text-[6vw] font-medium opacity-80 select-none" :class="currentTheme.text">
             {{ currentTimeFormatted.split(' ')[1].split(':')[2] }}
           </div>
        </div>

        <!-- Date Display -->
        <div class="text-[5vw] md:text-[3vw] mt-6 md:mt-8 transition-all duration-700 uppercase select-none"
             :class="currentTheme.subText">
          {{ dayjs(currentTimestampMs).format('YYYY / MM / DD dddd') }}
        </div>
      </div>
      
      <!-- Hint -->
      <div class="absolute bottom-10 text-sm animate-pulse opacity-40 font-light select-none"
           :class="currentTheme.subText">
        {{ t('exitFullscreen') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-tabs {
  background: white;
}
.dark .custom-tabs {
  background: #1f2937;
  border-color: #374151;
}
:deep(.el-tabs__header) {
  background: transparent;
  border-bottom: 1px solid var(--el-border-color-light);
}
:deep(.el-tabs__content) {
  padding: 0;
}
:deep(.el-tabs__item.is-active) {
  background: transparent;
  border-bottom-color: transparent;
}

/* Animations */
@keyframes gradient-xy {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient-xy {
  background-size: 400% 400%;
  animation: gradient-xy 15s ease infinite;
}

@keyframes gradient-slow {
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}
.animate-gradient-slow {
  background-size: 200% 200%;
  animation: gradient-slow 20s ease-in-out infinite;
}

@keyframes text-shimmer {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
.animate-text-shimmer {
  background-size: 200% auto;
  animation: text-shimmer 5s linear infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}

.stroke-text {
  -webkit-text-stroke: 4px cyan;
  color: transparent;
  filter: drop-shadow(0 0 10px cyan);
}

@keyframes breathing {
  0% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.02); opacity: 1; }
  100% { transform: scale(1); opacity: 0.9; }
}
.animate-breathing {
  animation: breathing 4s ease-in-out infinite;
}
</style>
