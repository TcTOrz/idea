<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useImageStore } from '@/stores/image'
import { RotateCw, FlipHorizontal, FlipVertical, Type, Settings2, Sparkles, BoxSelect, RotateCcw, Move } from 'lucide-vue-next'
import { ElCollapse, ElCollapseItem } from 'element-plus'
import { ref } from 'vue'
import type { ImageFormat, FilterOptions } from '@/utils/image-processor'

const { t } = useI18n()
const store = useImageStore()
const activeNames = ref(['1', '2', '3', '4'])

const formatOptions = [
  { value: 'image/jpeg', label: 'JPG' },
  { value: 'image/png', label: 'PNG' },
  { value: 'image/webp', label: 'WebP' },
  { value: 'image/avif', label: 'AVIF' },
  { value: 'image/x-icon', label: 'ICO' },
]

const presets = [
  { label: 'HD (1280x720)', width: 1280, height: 720 },
  { label: 'Full HD (1920x1080)', width: 1920, height: 1080 },
  { label: '2K (2560x1440)', width: 2560, height: 1440 },
  { label: '4K (3840x2160)', width: 3840, height: 2160 },
  { label: 'Instagram Square (1080x1080)', width: 1080, height: 1080 },
  { label: 'Instagram Portrait (1080x1350)', width: 1080, height: 1350 },
  { label: 'WeChat Avatar (200x200)', width: 200, height: 200 },
]

const applyPreset = (e: Event) => {
  const index = (e.target as HTMLSelectElement).value
  if (index === '') return
  const preset = presets[parseInt(index)]
  if (preset) {
    store.options.width = preset.width
    store.options.height = preset.height
    store.process()
  }
}

const resetBasic = () => {
  store.options.format = 'image/png'
  if (store.originalFile) {
     const type = store.originalFile.type as string
     if (['image/png', 'image/jpeg', 'image/webp', 'image/avif'].includes(type)) {
       store.options.format = type as any
     }
  }
  store.options.quality = 0.8
  store.options.width = undefined
  store.options.height = undefined
  store.process()
}

const updateQuality = (val: number) => {
  store.options.quality = val
  store.process()
}

const updateFormat = (val: string) => {
  store.options.format = val as ImageFormat
  store.process()
}

const updateResizeMode = (e: Event) => {
  store.options.resizeMode = (e.target as HTMLSelectElement).value as any
  store.process()
}

const updateWidth = (val: number) => {
  store.options.width = val
  store.process()
}

const updateHeight = (val: number) => {
  store.options.height = val
  store.process()
}

const updateFilter = (key: string, val: number) => {
  if (!store.options.filters) store.options.filters = {}
  store.options.filters[key as keyof FilterOptions] = val
  store.process()
}

const rotate = () => {
  if (!store.options.transforms) store.options.transforms = { rotate: 0, flipH: false, flipV: false }
  store.options.transforms.rotate = (store.options.transforms.rotate || 0) + 90
  if (store.options.transforms.rotate >= 360) store.options.transforms.rotate = 0
  store.process()
}

const flipH = () => {
  if (!store.options.transforms) store.options.transforms = { rotate: 0, flipH: false, flipV: false }
  store.options.transforms.flipH = !store.options.transforms.flipH
  store.process()
}

const flipV = () => {
  if (!store.options.transforms) store.options.transforms = { rotate: 0, flipH: false, flipV: false }
  store.options.transforms.flipV = !store.options.transforms.flipV
  store.process()
}

const resetOffset = () => {
  store.options.offset = { x: 0, y: 0 }
  store.process()
}

const updateWatermark = (key: string, val: any) => {
  if (!store.options.watermark) {
    store.options.watermark = {
      text: '',
      color: '#ffffff',
      size: 48,
      opacity: 0.5,
      position: 'center',
      margin: 20
    }
  }
  // @ts-ignore
  store.options.watermark[key] = val
  store.process()
}

const resetEffects = () => {
  store.options.filters = {}
  store.options.transforms = { rotate: 0, flipH: false, flipV: false }
  store.process()
}

const resetWatermark = () => {
  store.options.watermark = {
    text: '',
    color: '#ffffff',
    size: 48,
    opacity: 0.5,
    position: 'center',
    margin: 20
  }
  store.process()
}

const resetBorder = () => {
  store.options.border = {
    enabled: false,
    color: '#000000',
    width: 10,
    radius: 0
  }
  store.process()
}

const updateBorder = (key: string, val: any) => {
  if (!store.options.border) {
    store.options.border = {
      enabled: false,
      color: '#000000',
      width: 10,
      radius: 0
    }
  }
  // @ts-ignore
  store.options.border[key] = val
  store.process()
}

</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow h-full flex flex-col">
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <el-collapse v-model="activeNames" class="border-none">
        <!-- Basic Settings -->
        <el-collapse-item name="1">
          <template #title>
            <div class="flex items-center justify-between w-full pl-4 pr-8 select-none relative group/header">
              <div class="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
                <Settings2 class="w-4 h-4 text-blue-500" />
                {{ t('settings.basic') }}
              </div>
              <button 
                @click.stop="resetBasic" 
                class="absolute right-8 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all opacity-0 group-hover/header:opacity-100 focus:opacity-100" 
                :title="t('actions.reset')"
              >
                <RotateCcw class="w-3.5 h-3.5 text-gray-400 hover:text-blue-500" />
              </button>
            </div>
          </template>
          <div class="px-4 pb-4 space-y-4">
            <!-- Format Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('settings.format') }}
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="opt in formatOptions"
                  :key="opt.value"
                  @click="updateFormat(opt.value)"
                  class="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 border"
                  :class="store.options.format === opt.value 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <!-- Quality Slider -->
            <div v-if="store.options.format !== 'image/png' && store.options.format !== 'image/x-icon'">
              <div class="flex justify-between mb-1">
                <label class="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {{ t('settings.quality') }}
                </label>
                <span class="text-xs font-mono text-blue-600 dark:text-blue-400">{{ Math.round((store.options.quality || 0.8) * 100) }}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                :value="store.options.quality"
                @input="(e) => updateQuality(parseFloat((e.target as HTMLInputElement).value))"
                class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
              />
            </div>

            <!-- Resize Controls -->
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {{ t('settings.presets') }}
                </label>
                <select
                  @change="applyPreset"
                  class="w-full px-2 py-1.5 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                >
                  <option value="">{{ t('settings.presets') }}...</option>
                  <option v-for="(p, i) in presets" :key="i" :value="i">{{ p.label }}</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {{ t('settings.resizeMode') }}
                </label>
                <select
                  :value="store.options.resizeMode || 'contain'"
                  @change="updateResizeMode"
                  class="w-full px-2 py-1.5 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                >
                  <option value="contain">Contain (保持比例)</option>
                  <option value="cover">Cover (填满裁剪)</option>
                  <option value="fill">Fill (拉伸)</option>
                  <option value="none">None (原始大小)</option>
                  <option value="scale-down">Scale Down (缩小)</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {{ t('settings.width') }}
                  </label>
                  <input
                    type="number"
                    :value="store.options.width"
                    @input="(e) => updateWidth(parseInt((e.target as HTMLInputElement).value))"
                    placeholder="Auto"
                    class="w-full px-2 py-1.5 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {{ t('settings.height') }}
                  </label>
                  <input
                    type="number"
                    :value="store.options.height"
                    @input="(e) => updateHeight(parseInt((e.target as HTMLInputElement).value))"
                    placeholder="Auto"
                    class="w-full px-2 py-1.5 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>

        <!-- Effects (Filters & Transforms) -->
        <el-collapse-item name="2">
          <template #title>
            <div class="flex items-center justify-between w-full pl-4 pr-8 select-none relative group/header">
              <div class="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
                <Sparkles class="w-4 h-4 text-purple-500" />
                {{ t('settings.effects') }}
              </div>
              <button 
                @click.stop="resetEffects" 
                class="absolute right-8 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all opacity-0 group-hover/header:opacity-100 focus:opacity-100" 
                :title="t('actions.reset')"
              >
                <RotateCcw class="w-3.5 h-3.5 text-gray-400 hover:text-purple-500" />
              </button>
            </div>
          </template>
          <div class="px-4 pb-4 space-y-4">
            <!-- Transforms -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                {{ t('settings.transforms') }}
              </label>
              <div class="flex gap-2">
                <button 
                  @click="rotate"
                  class="flex-1 p-2 rounded-md bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600 flex justify-center"
                  :title="t('settings.rotate')"
                >
                  <RotateCw class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
                <button 
                  @click="flipH"
                  class="flex-1 p-2 rounded-md transition-colors border border-gray-200 dark:border-gray-600 flex justify-center"
                  :class="store.options.transforms?.flipH ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'"
                  :title="t('settings.flipH')"
                >
                  <FlipHorizontal class="w-4 h-4" :class="store.options.transforms?.flipH ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'" />
                </button>
                <button 
                  @click="flipV"
                  class="flex-1 p-2 rounded-md transition-colors border border-gray-200 dark:border-gray-600 flex justify-center"
                  :class="store.options.transforms?.flipV ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'"
                  :title="t('settings.flipV')"
                >
                  <FlipVertical class="w-4 h-4" :class="store.options.transforms?.flipV ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'" />
                </button>
                <button 
                  @click="resetOffset"
                  class="flex-1 p-2 rounded-md transition-colors border border-gray-200 dark:border-gray-600 flex justify-center"
                  :class="(store.options.offset?.x || store.options.offset?.y) ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50'"
                  :title="t('settings.resetOffset')"
                  :disabled="!store.options.offset?.x && !store.options.offset?.y"
                >
                  <Move class="w-4 h-4" :class="(store.options.offset?.x || store.options.offset?.y) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'" />
                </button>
              </div>
            </div>

            <!-- Filters -->
            <div class="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">
                {{ t('settings.filters') }}
              </label>
              
              <div v-for="filter in ['brightness', 'contrast', 'saturation', 'grayscale', 'sepia', 'blur', 'hueRotate']" :key="filter">
                <div class="flex justify-between mb-1">
                  <label class="text-[10px] uppercase tracking-wider text-gray-500">{{ t(`settings.${filter}`) }}</label>
                  <span class="text-[10px] text-gray-400">
                    {{ store.options.filters?.[filter as keyof FilterOptions] ?? (['grayscale', 'sepia', 'blur', 'hueRotate'].includes(filter) ? 0 : 100) }}
                    {{ filter === 'hueRotate' ? 'deg' : filter === 'blur' ? 'px' : '%' }}
                  </span>
                </div>
                <input
                  type="range"
                  :min="0"
                  :max="filter === 'blur' ? 20 : filter === 'hueRotate' ? 360 : (['grayscale', 'sepia'].includes(filter) ? 100 : 200)"
                  :value="store.options.filters?.[filter as keyof FilterOptions] ?? (['grayscale', 'sepia', 'blur', 'hueRotate'].includes(filter) ? 0 : 100)"
                  @input="(e) => updateFilter(filter, parseInt((e.target as HTMLInputElement).value))"
                  class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-500"
                />
              </div>
            </div>
          </div>
        </el-collapse-item>

        <!-- Watermark -->
        <el-collapse-item name="3">
          <template #title>
            <div class="flex items-center justify-between w-full pl-4 pr-8 select-none relative group/header">
              <div class="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
                <Type class="w-4 h-4 text-green-500" />
                {{ t('settings.watermark') }}
              </div>
              <button 
                @click.stop="resetWatermark" 
                class="absolute right-8 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all opacity-0 group-hover/header:opacity-100 focus:opacity-100" 
                :title="t('actions.reset')"
              >
                <RotateCcw class="w-3.5 h-3.5 text-gray-400 hover:text-green-500" />
              </button>
            </div>
          </template>
          <div class="px-4 pb-4 space-y-3">
            <!-- Text -->
            <div>
              <label class="text-xs text-gray-500 mb-1 block">{{ t('settings.wmText') }}</label>
              <input
                type="text"
                :value="store.options.watermark?.text || ''"
                @input="(e) => updateWatermark('text', (e.target as HTMLInputElement).value)"
                class="w-full px-3 py-1.5 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
                :placeholder="t('settings.wmPlaceholder')"
              />
            </div>

            <div v-if="store.options.watermark?.text" class="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div class="grid grid-cols-2 gap-3">
                <!-- Color -->
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">{{ t('settings.wmColor') }}</label>
                  <div class="flex items-center gap-2">
                    <div class="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600 shadow-sm">
                       <input
                        type="color"
                        :value="store.options.watermark?.color || '#ffffff'"
                        @input="(e) => updateWatermark('color', (e.target as HTMLInputElement).value)"
                        class="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0"
                      />
                    </div>
                    <span class="text-xs font-mono text-gray-500">{{ store.options.watermark?.color }}</span>
                  </div>
                </div>
                
                <!-- Position -->
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">{{ t('settings.wmPosition') }}</label>
                  <select
                    :value="store.options.watermark?.position || 'center'"
                    @change="(e) => updateWatermark('position', (e.target as HTMLSelectElement).value)"
                    class="w-full px-2 py-1.5 text-xs border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-1 focus:ring-green-500"
                  >
                    <option value="center">Center</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>
              </div>

              <!-- Size -->
              <div>
                <div class="flex justify-between mb-1">
                  <label class="text-xs text-gray-500">{{ t('settings.wmSize') }}</label>
                  <span class="text-xs text-gray-400">{{ store.options.watermark?.size }}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="200"
                  :value="store.options.watermark?.size || 48"
                  @input="(e) => updateWatermark('size', parseInt((e.target as HTMLInputElement).value))"
                  class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-green-500"
                />
              </div>

              <!-- Opacity -->
              <div>
                <div class="flex justify-between mb-1">
                   <label class="text-xs text-gray-500">{{ t('settings.wmOpacity') }}</label>
                   <span class="text-xs text-gray-400">{{ Math.round((store.options.watermark?.opacity || 0.5) * 100) }}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  :value="store.options.watermark?.opacity ?? 0.5"
                  @input="(e) => updateWatermark('opacity', parseFloat((e.target as HTMLInputElement).value))"
                  class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-green-500"
                />
              </div>
            </div>
          </div>
        </el-collapse-item>

        <!-- Border & Radius -->
        <el-collapse-item name="4">
          <template #title>
            <div class="flex items-center justify-between w-full pl-4 pr-8 select-none relative group/header">
              <div class="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
                <BoxSelect class="w-4 h-4 text-orange-500" />
                {{ t('settings.border') }}
              </div>
              <button 
                @click.stop="resetBorder" 
                class="absolute right-8 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all opacity-0 group-hover/header:opacity-100 focus:opacity-100" 
                :title="t('actions.reset')"
              >
                <RotateCcw class="w-3.5 h-3.5 text-gray-400 hover:text-orange-500" />
              </button>
            </div>
          </template>
          <div class="px-4 pb-4 space-y-4">
             <!-- Radius -->
             <div>
                <div class="flex justify-between mb-1">
                  <label class="text-xs text-gray-500">{{ t('settings.borderRadius') }}</label>
                  <span class="text-xs text-gray-400">{{ store.options.border?.radius || 0 }}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  :value="store.options.border?.radius || 0"
                  @input="(e) => updateBorder('radius', parseInt((e.target as HTMLInputElement).value))"
                  class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-orange-500"
                />
             </div>

             <!-- Border Width -->
             <div>
                <div class="flex justify-between mb-1">
                  <label class="text-xs text-gray-500">{{ t('settings.borderWidth') }}</label>
                  <span class="text-xs text-gray-400">{{ store.options.border?.width || 0 }}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  :value="store.options.border?.width || 0"
                  @input="(e) => {
                     const val = parseInt((e.target as HTMLInputElement).value);
                     updateBorder('width', val);
                     if (val > 0) updateBorder('enabled', true);
                     else updateBorder('enabled', false);
                  }"
                  class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-orange-500"
                />
             </div>

             <!-- Border Color -->
             <div v-if="store.options.border?.width && store.options.border.width > 0">
                <label class="text-xs text-gray-500 mb-1 block">{{ t('settings.borderColor') }}</label>
                <div class="flex items-center gap-2">
                  <div class="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600 shadow-sm">
                      <input
                      type="color"
                      :value="store.options.border?.color || '#000000'"
                      @input="(e) => updateBorder('color', (e.target as HTMLInputElement).value)"
                      class="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0"
                    />
                  </div>
                  <span class="text-xs font-mono text-gray-500">{{ store.options.border?.color }}</span>
                </div>
             </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- Stats Footer -->
    <div class="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
      <div class="space-y-2 text-sm">
        <div class="flex justify-between items-center">
          <span class="text-gray-500 dark:text-gray-400">{{ t('stats.original') }}:</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ store.originalSize }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-500 dark:text-gray-400">{{ t('stats.processed') }}:</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ store.processedSize }}</span>
        </div>
        <div class="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <span class="text-gray-500 dark:text-gray-400">{{ t('stats.reduction') }}:</span>
          <span 
            class="font-bold"
            :class="store.reduction > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
          >
            {{ store.reduction }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-collapse-item__header) {
  height: 48px;
  line-height: 48px;
  background-color: transparent;
  border-bottom: 1px solid var(--el-collapse-border-color);
}
:deep(.el-collapse-item__content) {
  padding-bottom: 0;
}
/* Custom scrollbar for webkit */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}
</style>
