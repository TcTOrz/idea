<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
    <div class="max-w-7xl mx-auto">
      <header class="mb-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
          {{ $t('app.title') }}
        </h1>
        <div class="flex items-center gap-4">
          <el-dropdown @command="handleLanguageChange">
            <span class="el-dropdown-link cursor-pointer text-gray-600 dark:text-gray-300">
              {{ currentLang === 'zh' ? '中文' : 'English' }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
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

      <el-card class="!bg-white/80 dark:!bg-gray-800/80 backdrop-blur-sm">
        <el-tabs v-model="activeTab">
          <el-tab-pane :label="$t('app.glassmorphism')" name="glassmorphism">
            <GlassmorphismGenerator />
          </el-tab-pane>
          <el-tab-pane :label="$t('app.neumorphism')" name="neumorphism">
            <NeumorphismGenerator />
          </el-tab-pane>
          <el-tab-pane :label="$t('app.boxShadow')" name="box-shadow">
            <BoxShadowGenerator />
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <BuyCoffee />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDown } from '@element-plus/icons-vue'
import GlassmorphismGenerator from './components/GlassmorphismGenerator.vue'
import NeumorphismGenerator from './components/NeumorphismGenerator.vue'
import BoxShadowGenerator from './components/BoxShadowGenerator.vue'
import { BuyCoffee } from '@idea/shared/vue'

const { locale } = useI18n()
const currentLang = ref(locale.value)
const activeTab = ref('glassmorphism')

const handleLanguageChange = (lang: string) => {
  locale.value = lang
  currentLang.value = lang
}
</script>

<style>
.el-tabs__nav-wrap::after {
  background-color: transparent !important;
}
</style>
