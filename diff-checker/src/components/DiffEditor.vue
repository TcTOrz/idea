<script setup lang="ts">
import { ref, computed, shallowRef } from 'vue'
import { VueMonacoDiffEditor } from '@guolao/vue-monaco-editor'
import { Switch, Moon, Sunny } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useDark, useToggle, useWindowSize } from '@vueuse/core'

const { t, locale } = useI18n()
const isDark = useDark()
const toggleDark = useToggle(isDark)
const { width } = useWindowSize()

const diffEditorRef = shallowRef()

const language = ref('json')
const languages = computed(() => [
  { label: t('languages.json'), value: 'json' },
  { label: t('languages.javascript'), value: 'javascript' },
  { label: t('languages.typescript'), value: 'typescript' },
  { label: t('languages.html'), value: 'html' },
  { label: t('languages.css'), value: 'css' },
  { label: t('languages.markdown'), value: 'markdown' },
  { label: t('languages.plaintext'), value: 'plaintext' }
])

const originalText = ref(`{
  "name": "Project A",
  "version": "1.0.0",
  "features": [
    "login",
    "dashboard"
  ]
}`)

const modifiedText = ref(`{
  "name": "Project B",
  "version": "1.1.0",
  "features": [
    "login",
    "dashboard",
    "analytics"
  ]
}`)

const inlineDiff = ref(false)
const isMobile = computed(() => width.value < 768)

const OPTIONS = computed(() => ({
  originalEditable: true,
  automaticLayout: true,
  renderSideBySide: !isMobile.value && !inlineDiff.value,
  minimap: { enabled: false }
}))

const toggleInlineDiff = () => {
  inlineDiff.value = !inlineDiff.value
}

const toggleLocale = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
  // Note: Changing locale dynamically requires reloading the page or editor, 
  // which is not natively supported by Monaco without page refresh in this setup.
  // The UI will update, but the context menu will remain in the initial language.
  window.location.reload()
}

const handleMount = (editor: any) => {
  diffEditorRef.value = editor
}
</script>

<template>
  <div class="diff-checker-container">
    <el-container style="height: 100vh;">
      <el-header class="app-header">
        <div class="logo">
          <el-icon :size="24"><Switch /></el-icon>
          <h1>{{ t('title') }}</h1>
        </div>
        <div class="toolbar">
          <el-select v-model="language" :placeholder="t('toolbar.language')" class="lang-select">
            <el-option
              v-for="lang in languages"
              :key="lang.value"
              :label="lang.label"
              :value="lang.value"
            />
          </el-select>
          <el-button @click="toggleInlineDiff" class="view-btn" :disabled="isMobile">
            {{ inlineDiff || isMobile ? t('toolbar.inlineView') : t('toolbar.splitView') }}
          </el-button>
          
          <el-button circle @click="toggleLocale">
            {{ locale === 'en' ? '中' : 'En' }}
          </el-button>
          <el-button circle @click="toggleDark()">
            <el-icon>
              <Moon v-if="isDark" />
              <Sunny v-else />
            </el-icon>
          </el-button>
        </div>
      </el-header>

      <el-main class="main-content">
        <VueMonacoDiffEditor
          :original="originalText"
          :modified="modifiedText"
          :language="language"
          :theme="isDark ? 'vs-dark' : 'vs'"
          :options="OPTIONS"
          @mount="handleMount"
          class="editor-wrapper"
        />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.diff-checker-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
}

.app-header {
  height: 60px;
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: var(--el-bg-color);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--el-color-primary);
}

.logo h1 {
  font-size: 1.5rem;
  margin: 0;
  color: var(--el-text-color-primary);
}

.toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
}

.lang-select {
  width: 150px;
}

.main-content {
  flex: 1;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.editor-wrapper {
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .app-header {
    height: auto;
    flex-direction: column;
    padding: 10px;
    gap: 10px;
  }

  .logo h1 {
    font-size: 1.2rem;
  }

  .toolbar {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .lang-select {
    width: 120px;
  }
  
  .view-btn {
    padding: 8px 10px;
  }
}
</style>
