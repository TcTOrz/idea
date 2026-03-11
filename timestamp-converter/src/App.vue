<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDark, useToggle } from '@vueuse/core'
import { Moon, Sunny } from '@element-plus/icons-vue'
import TimestampConverter from './components/TimestampConverter.vue'

const { locale } = useI18n()
const isDark = useDark()
const toggleDark = useToggle(isDark)

const toggleLanguage = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
    <!-- Navbar -->
    <nav class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex-shrink-0 flex items-center gap-2">
            <span class="text-2xl">⏰</span>
            <span class="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
              Timestamp Converter
            </span>
          </div>
          <div class="flex items-center gap-3">
            <el-button @click="toggleDark()" circle plain>
              <el-icon :size="16">
                <Moon v-if="isDark" />
                <Sunny v-else />
              </el-icon>
            </el-button>
            <el-button @click="toggleLanguage" circle plain class="font-bold font-mono">
              {{ locale === 'zh' ? 'EN' : '中' }}
            </el-button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow py-8 px-4 sm:px-6 lg:px-8">
      <TimestampConverter />
    </main>

    <!-- Footer -->
    <footer class="py-6 text-center text-gray-500 text-sm dark:text-gray-400">
      <p>&copy; {{ new Date().getFullYear() }} TcTOrz. All rights reserved.</p>
    </footer>
  </div>
</template>

<style>
html.dark {
  color-scheme: dark;
}
</style>
