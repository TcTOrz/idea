<script setup lang="ts">
import { ref, computed } from 'vue'
import JsonEditor from './components/JsonEditor.vue'
import { ElMessage } from 'element-plus'
import { Moon, Sunny, CopyDocument, Delete, Check, MagicStick, Rank, Setting, More, Upload } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const inputJson = ref('{\n  "name": "json-toolkit",\n  "version": "1.0.0",\n  "features": ["format", "compress", "validate"]\n}')
const outputJson = ref('')
const indent = ref(2)
const isDark = ref(true)
const primaryColor = ref('#10B981') // Emerald-500
const activeTab = ref<'input' | 'output'>('input')
const isMobileMenuOpen = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const themes = [
  { name: 'Emerald', color: '#10B981', class: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Blue', color: '#3B82F6', class: 'text-blue-600 dark:text-blue-400' },
  { name: 'Purple', color: '#8B5CF6', class: 'text-purple-600 dark:text-purple-400' },
  { name: 'Orange', color: '#F97316', class: 'text-orange-600 dark:text-orange-400' },
]

const currentThemeClass = computed(() => {
  const theme = themes.find(t => t.color === primaryColor.value)
  return theme ? theme.class : themes[0].class
})

const editorTheme = computed(() => isDark.value ? 'vs-dark' : 'vs')

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const toggleLocale = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}

const setPrimaryColor = (color: string) => {
  primaryColor.value = color
  document.documentElement.style.setProperty('--el-color-primary', color)
}

// Initialize theme
if (isDark.value) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}
document.documentElement.style.setProperty('--el-color-primary', primaryColor.value)

const formatJson = () => {
  try {
    const parsed = JSON.parse(inputJson.value)
    outputJson.value = JSON.stringify(parsed, null, indent.value)
    ElMessage.success(t('app.formatted'))
    if (window.innerWidth < 768) {
      activeTab.value = 'output'
    }
  } catch (e) {
    ElMessage.error(t('app.invalid'))
  }
}

const compressJson = () => {
  try {
    const parsed = JSON.parse(inputJson.value)
    outputJson.value = JSON.stringify(parsed)
    ElMessage.success(t('app.compressed'))
    if (window.innerWidth < 768) {
      activeTab.value = 'output'
    }
  } catch (e) {
    ElMessage.error(t('app.invalid'))
  }
}

const validateJson = () => {
  try {
    JSON.parse(inputJson.value)
    ElMessage.success(t('app.valid'))
  } catch (e: any) {
    ElMessage.error(`${t('app.invalid')}: ${e.message}`)
  }
}

const copyOutput = async () => {
  if (!outputJson.value) return
  try {
    await navigator.clipboard.writeText(outputJson.value)
    ElMessage.success(t('app.copied'))
  } catch (err) {
    ElMessage.error('Failed to copy')
  }
}

const clearInput = () => {
  inputJson.value = ''
  outputJson.value = ''
  ElMessage.success(t('app.cleared'))
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    if (content) {
      inputJson.value = content
      ElMessage.success(t('app.fileLoaded'))
      // Reset file input so the same file can be selected again
      target.value = ''
    }
  }
  reader.onerror = () => {
    ElMessage.error(t('app.fileLoadError'))
  }
  reader.readAsText(file)
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}
</script>

<template>
  <div class="flex flex-col h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept=".json,.txt"
      class="hidden"
      @change="handleFileUpload"
    />

    <!-- Toolbar -->
    <div class="h-14 md:h-16 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 md:px-6 gap-4 bg-white dark:bg-slate-900 shadow-sm z-20 transition-colors duration-300 relative">
      <!-- Logo & Title -->
      <div class="flex items-center mr-auto">
        <div class="w-8 h-8 rounded-lg mr-3 flex items-center justify-center text-white font-bold text-lg shadow-md" :style="{ backgroundColor: primaryColor }">
          {}
        </div>
        <h1 class="text-lg md:text-xl font-bold tracking-tight hidden md:block" :class="currentThemeClass">{{ t('app.title') }}</h1>
      </div>
      
      <!-- Desktop Actions -->
      <div class="hidden md:flex flex-wrap gap-2">
        <el-button-group class="!flex shadow-sm">
          <el-button type="primary" plain @click="formatJson">
            <el-icon class="mr-1.5"><MagicStick /></el-icon>{{ t('app.format') }}
          </el-button>
          <el-button type="primary" plain @click="compressJson">
            <el-icon class="mr-1.5"><Rank /></el-icon>{{ t('app.compress') }}
          </el-button>
          <el-button type="primary" plain @click="validateJson">
            <el-icon class="mr-1.5"><Check /></el-icon>{{ t('app.validate') }}
          </el-button>
        </el-button-group>
      </div>

      <!-- Mobile Actions (Compact) -->
      <div class="flex md:hidden gap-2">
        <el-button type="primary" size="small" circle @click="formatJson">
          <el-icon><MagicStick /></el-icon>
        </el-button>
        <el-button type="primary" size="small" circle @click="compressJson">
          <el-icon><Rank /></el-icon>
        </el-button>
        <el-button type="primary" size="small" circle @click="validateJson">
          <el-icon><Check /></el-icon>
        </el-button>
      </div>
      
      <!-- Desktop Settings -->
      <div class="hidden md:flex items-center gap-3 ml-4 bg-slate-100 dark:bg-slate-800 rounded-md px-3 py-1.5">
        <span class="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap uppercase tracking-wider">{{ t('app.indent') }}</span>
        <el-select v-model="indent" size="small" style="width: 100px" class="!bg-transparent">
          <el-option :label="`2 ${t('app.space')}`" :value="2" />
          <el-option :label="`4 ${t('app.space')}`" :value="4" />
        </el-select>
      </div>

      <!-- Desktop Right Controls -->
      <div class="hidden md:flex items-center gap-4 ml-auto">
        <!-- Color Picker -->
        <div class="flex gap-2 mr-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full">
           <div 
             v-for="theme in themes" 
             :key="theme.name"
             class="w-5 h-5 rounded-full cursor-pointer transition-all duration-200 ring-2 ring-offset-1 ring-offset-transparent dark:ring-offset-slate-900"
             :class="primaryColor === theme.color ? 'ring-slate-400 dark:ring-slate-500 scale-110' : 'ring-transparent hover:scale-110'"
             :style="{ backgroundColor: theme.color }"
             :title="theme.name"
             @click="setPrimaryColor(theme.color)"
           ></div>
        </div>

        <div class="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

        <el-button size="small" @click="toggleLocale" class="!font-mono !font-medium">
          {{ locale === 'zh' ? 'EN' : 'CN' }}
        </el-button>
        <el-button circle @click="toggleTheme" class="!border-slate-300 dark:!border-slate-600">
          <el-icon v-if="isDark"><Moon /></el-icon>
          <el-icon v-else class="text-amber-500"><Sunny /></el-icon>
        </el-button>
      </div>

      <!-- Mobile Menu Toggle -->
      <el-button class="md:hidden !ml-2" circle @click="isMobileMenuOpen = !isMobileMenuOpen">
        <el-icon><More /></el-icon>
      </el-button>

      <!-- Mobile Menu Dropdown -->
      <div v-if="isMobileMenuOpen" class="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shadow-lg md:hidden flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">{{ t('app.indent') }}</span>
          <el-select v-model="indent" size="small" style="width: 120px">
            <el-option :label="`2 ${t('app.space')}`" :value="2" />
            <el-option :label="`4 ${t('app.space')}`" :value="4" />
          </el-select>
        </div>
        
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">{{ t('app.theme') }}</span>
          <div class="flex gap-3">
             <div 
               v-for="theme in themes" 
               :key="theme.name"
               class="w-6 h-6 rounded-full cursor-pointer border-2 border-transparent"
               :class="{ '!border-slate-400 dark:!border-slate-500': primaryColor === theme.color }"
               :style="{ backgroundColor: theme.color }"
               @click="setPrimaryColor(theme.color)"
             ></div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <el-button size="small" @click="toggleLocale">
            {{ locale === 'zh' ? 'English' : '中文' }}
          </el-button>
          <el-button size="small" @click="toggleTheme">
            <el-icon v-if="isDark" class="mr-2"><Moon /></el-icon>
            <el-icon v-else class="mr-2 text-amber-500"><Sunny /></el-icon>
            {{ isDark ? 'Dark' : 'Light' }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- Mobile Tabs -->
    <div class="flex md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <button 
        class="flex-1 py-3 text-sm font-medium border-b-2 transition-colors relative"
        :class="activeTab === 'input' ? 'text-primary border-primary' : 'text-slate-500 border-transparent'"
        :style="{ color: activeTab === 'input' ? primaryColor : '', borderColor: activeTab === 'input' ? primaryColor : '' }"
        @click="activeTab = 'input'"
      >
        {{ t('app.input') }}
        <span v-if="inputJson" class="absolute top-2 right-4 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
      </button>
      <button 
        class="flex-1 py-3 text-sm font-medium border-b-2 transition-colors relative"
        :class="activeTab === 'output' ? 'text-primary border-primary' : 'text-slate-500 border-transparent'"
        :style="{ color: activeTab === 'output' ? primaryColor : '', borderColor: activeTab === 'output' ? primaryColor : '' }"
        @click="activeTab = 'output'"
      >
        {{ t('app.output') }}
        <span v-if="outputJson" class="absolute top-2 right-4 w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: primaryColor }"></span>
      </button>
    </div>

    <!-- Main Area -->
    <div class="flex-1 flex flex-col md:flex-row overflow-hidden p-0 md:p-4 gap-0 md:gap-4 bg-slate-50 dark:bg-slate-950 relative">
      <!-- Input -->
      <div 
        class="flex-1 flex flex-col min-w-0 transition-all duration-300 bg-white dark:bg-slate-900 md:rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden absolute inset-0 md:relative z-10"
        :class="{ 'hidden md:flex': activeTab !== 'input' }"
      >
        <div class="h-10 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700/50 backdrop-blur-sm">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-slate-400"></div>
            <span class="text-xs font-bold text-slate-600 dark:text-slate-300 font-mono tracking-wide">{{ t('app.input') }}</span>
          </div>
          
          <div class="flex items-center gap-2">
            <!-- Upload Button -->
            <el-button type="info" plain size="small" class="!hidden md:!flex !px-2 !h-7" @click="triggerFileUpload">
              <el-icon class="mr-1.5"><Upload /></el-icon>
              {{ t('app.upload') }}
            </el-button>
            <el-button type="info" plain size="small" class="md:!hidden !px-2 !h-7" @click="triggerFileUpload">
              <el-icon><Upload /></el-icon>
            </el-button>

            <!-- Clear Button -->
            <el-button type="danger" plain size="small" class="!hidden md:!flex !px-2 !h-7" @click="clearInput">
              <el-icon class="mr-1.5"><Delete /></el-icon>
              {{ t('app.clear') }}
            </el-button>
            <el-button type="danger" plain size="small" class="md:!hidden !px-2 !h-7" @click="clearInput">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
        <div class="flex-1 relative group">
           <JsonEditor v-model="inputJson" :theme="editorTheme" />
           <!-- Empty State Hint -->
           <div v-if="!inputJson" class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <span class="text-slate-400 dark:text-slate-600 text-sm">Paste your JSON here...</span>
           </div>
        </div>
      </div>

      <!-- Output -->
      <div 
        class="flex-1 flex flex-col min-w-0 transition-all duration-300 bg-white dark:bg-slate-900 md:rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden absolute inset-0 md:relative z-10"
        :class="{ 'hidden md:flex': activeTab !== 'output' }"
      >
        <div class="h-10 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700/50 backdrop-blur-sm">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: primaryColor }"></div>
            <span class="text-xs font-bold text-slate-600 dark:text-slate-300 font-mono tracking-wide">{{ t('app.output') }}</span>
          </div>
          
          <!-- Desktop Copy Button -->
          <el-button type="primary" plain size="small" class="!hidden md:!flex !px-2 !h-7" @click="copyOutput" :disabled="!outputJson">
            <el-icon class="mr-1.5"><CopyDocument /></el-icon>
            {{ t('app.copy') }}
          </el-button>
          
          <!-- Mobile Copy Button (Icon Only) -->
          <el-button type="primary" plain size="small" class="md:!hidden !px-2 !h-7" @click="copyOutput" :disabled="!outputJson">
            <el-icon><CopyDocument /></el-icon>
          </el-button>
        </div>
        <div class="flex-1 relative">
          <JsonEditor v-model="outputJson" :read-only="true" :theme="editorTheme" />
          <div v-if="!outputJson" class="absolute inset-0 flex items-center justify-center pointer-events-none bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-[1px] z-10">
             <span class="text-slate-400 dark:text-slate-600 text-sm">Formatted output will appear here</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Bar -->
    <div class="h-7 flex items-center justify-between px-4 md:px-6 text-[10px] md:text-[11px] text-white shrink-0 transition-colors duration-300 shadow-inner z-20" :style="{ backgroundColor: primaryColor }">
      <div class="flex gap-4 md:gap-6 font-mono opacity-90">
        <span>{{ t('app.length') }}: <strong>{{ inputJson.length }}</strong></span>
        <span>{{ t('app.lines') }}: <strong>{{ inputJson.split('\n').length }}</strong></span>
      </div>
      <div class="opacity-75 font-mono hidden md:block">
        JSON Toolkit v1.0.0
      </div>
    </div>
  </div>
</template>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

/* Custom Scrollbar for non-editor areas */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.dark ::-webkit-scrollbar-thumb {
  background: #334155;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.dark ::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
