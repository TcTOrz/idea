<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useImageStore } from '@/stores/image'
import ImageUploader from '@/components/ImageUploader.vue'
import ImagePreview from '@/components/ImagePreview.vue'
import Controls from '@/components/Controls.vue'
import { Languages } from 'lucide-vue-next'
import { useTitle } from '@vueuse/core'
import { watchEffect } from 'vue'

const { t, locale } = useI18n()
const store = useImageStore()

watchEffect(() => {
  useTitle(t('title') + ' - ' + t('desc'))
})

const toggleLocale = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            I
          </div>
          <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            {{ t('title') }}
          </h1>
        </div>
        
        <button 
          @click="toggleLocale"
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <Languages class="w-5 h-5" />
          <span>{{ locale === 'en' ? 'English' : '中文' }}</span>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 container mx-auto px-4 py-8">
      <div v-if="!store.originalFile" class="max-w-2xl mx-auto mt-20">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-extrabold mb-4 tracking-tight">{{ t('title') }}</h2>
          <p class="text-xl text-gray-500 dark:text-gray-400">{{ t('desc') }}</p>
        </div>
        
        <ImageUploader @file-selected="store.setFile" />
      </div>

      <div v-else class="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
        <!-- Preview Area -->
        <div class="flex-1 min-h-0">
          <ImagePreview />
        </div>

        <!-- Sidebar Controls -->
        <div class="w-full lg:w-80 flex-shrink-0">
          <Controls />
        </div>
      </div>
    </main>
  </div>
</template>
