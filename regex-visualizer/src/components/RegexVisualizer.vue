<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDark, useToggle } from '@vueuse/core'
import { Moon, Sunny, Collection } from '@element-plus/icons-vue'
import RegexLibrary from './RegexLibrary.vue'
import type { RegexPattern } from '../data/regex-patterns'

const { t, locale } = useI18n()
const isDark = useDark()
const toggleDark = useToggle(isDark)

const showLibrary = ref(false)
const pattern = ref('([A-Z])\\w+')
const flags = ref(['g'])
const testString = ref('Hello World, this is a Regex Visualizer test.')
const error = ref('')

const allFlags = computed(() => [
  { label: t('flags.g'), value: 'g' },
  { label: t('flags.i'), value: 'i' },
  { label: t('flags.m'), value: 'm' },
  { label: t('flags.s'), value: 's' },
  { label: t('flags.u'), value: 'u' },
  { label: t('flags.y'), value: 'y' },
])

const toggleLocale = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}

const handlePatternSelect = (item: RegexPattern) => {
  pattern.value = item.pattern
  flags.value = item.flags.split('')
  if (item.examples && item.examples.length > 0) {
    testString.value = item.examples.join('\n')
  }
  showLibrary.value = false
}


interface MatchSegment {
  text: string
  isMatch: boolean
  index?: number
  groups?: Record<string, string>
}

const segments = computed(() => {
  error.value = ''
  if (!pattern.value) return [{ text: testString.value, isMatch: false }]

  try {
    const regex = new RegExp(pattern.value, flags.value.join(''))
    const text = testString.value
    const result: MatchSegment[] = []
    let lastIndex = 0

    // Handle global vs non-global
    if (!regex.flags.includes('g')) {
      const m = regex.exec(text)
      if (!m) {
        result.push({ text: text, isMatch: false })
        return result
      }

      if (m.index > 0) {
        result.push({ text: text.slice(0, m.index), isMatch: false })
      }
      result.push({ 
        text: m[0], 
        isMatch: true, 
        index: m.index,
        groups: m.groups 
      })
      if (m.index + m[0].length < text.length) {
        result.push({ text: text.slice(m.index + m[0].length), isMatch: false })
      }
      return result
    }

    // Global match
    const matches = [...text.matchAll(regex)]
    
    if (matches.length === 0) {
      return [{ text: text, isMatch: false }]
    }

    matches.forEach((m) => {
      if (m.index! > lastIndex) {
        result.push({ text: text.slice(lastIndex, m.index), isMatch: false })
      }
      result.push({ 
        text: m[0], 
        isMatch: true, 
        index: m.index,
        groups: m.groups
      })
      lastIndex = m.index! + m[0].length
    })

    if (lastIndex < text.length) {
      result.push({ text: text.slice(lastIndex), isMatch: false })
    }

    return result
  } catch (e: any) {
    error.value = e.message
    return [{ text: testString.value, isMatch: false }]
  }
})

const matchCount = computed(() => segments.value.filter(s => s.isMatch).length)

</script>

<template>
  <div class="layout">
    <el-container>
      <el-header class="app-header">
        <div class="logo">
          <el-icon :size="24"><View /></el-icon>
          <h1>{{ t('title') }}</h1>
        </div>
        <div class="actions">
          <el-button @click="showLibrary = true" class="library-btn">
            <el-icon><Collection /></el-icon>
            {{ t('library.title') }}
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

      <el-drawer
        v-model="showLibrary"
        :title="t('library.title')"
        direction="rtl"
        size="400px"
        :with-header="false"
      >
        <RegexLibrary @select="handlePatternSelect" />
      </el-drawer>

      <el-main class="main-content">
        <el-row :gutter="20">
          <!-- Left Column: Input -->
          <el-col :xs="24" :sm="24" :md="10" :lg="8" class="mb-4">
            <el-card class="input-card">
              <template #header>
                <div class="card-header">
                  <span>{{ t('input.label') }}</span>
                </div>
              </template>
              
              <div class="regex-input-container">
                <span class="slash">/</span>
                <el-input 
                  v-model="pattern" 
                  :placeholder="t('input.placeholder')"
                  :class="{ 'is-error': error }"
                  class="pattern-input"
                />
                <span class="slash">/</span>
                <div class="flags-display">{{ flags.join('') }}</div>
              </div>

              <div v-if="error" class="error-msg">{{ error }}</div>

              <el-divider content-position="left">{{ t('input.flags') }}</el-divider>
              
              <el-checkbox-group v-model="flags" class="flags-group">
                <el-checkbox 
                  v-for="flag in allFlags" 
                  :key="flag.value" 
                  :label="flag.value"
                  :value="flag.value"
                  border
                  size="small"
                >
                  {{ flag.label }}
                </el-checkbox>
              </el-checkbox-group>

              <el-divider content-position="left">{{ t('input.testString') }}</el-divider>
              
              <el-input
                v-model="testString"
                type="textarea"
                :rows="10"
                :placeholder="t('input.testPlaceholder')"
                resize="none"
              />
            </el-card>
          </el-col>

          <!-- Right Column: Output -->
          <el-col :xs="24" :sm="24" :md="14" :lg="16">
            <el-card class="output-card">
              <template #header>
                <div class="card-header">
                  <span>{{ t('output.matchResult') }}</span>
                  <el-tag type="success" effect="dark" round>
                    {{ matchCount }} {{ t('output.matches') }}
                  </el-tag>
                </div>
              </template>

              <div class="highlight-container">
                <template v-for="(seg, idx) in segments" :key="idx">
                  <span 
                    v-if="seg.isMatch" 
                    class="highlight-match"
                    :title="`${t('output.index')}: ${seg.index}`"
                  >{{ seg.text }}</span>
                  <span v-else>{{ seg.text }}</span>
                </template>
              </div>
            </el-card>

            <!-- Match Details -->
            <el-card class="details-card" v-if="matchCount > 0">
               <template #header>
                <div class="card-header">
                  <span>{{ t('output.matchDetails') }}</span>
                </div>
              </template>
              <el-table :data="segments.filter(s => s.isMatch)" style="width: 100%" height="250">
                <el-table-column prop="index" :label="t('output.index')" width="80" />
                <el-table-column prop="text" :label="t('output.match')" />
                <el-table-column :label="t('output.groups')">
                   <template #default="scope">
                     <span v-if="scope.row.groups">{{ scope.row.groups }}</span>
                     <span v-else class="text-gray">-</span>
                   </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  background-color: var(--el-bg-color-page);
  padding: 20px;
  transition: background-color 0.3s;
}

.app-header {
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--el-color-primary);
}

.actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.library-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

:deep(.el-drawer__body) {
  padding: 0;
}

.regex-input-container {
  display: flex;
  align-items: center;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 0 10px;
  transition: border-color 0.2s;
}

.regex-input-container:focus-within {
  border-color: var(--el-color-primary);
}

.pattern-input :deep(.el-input__wrapper) {
  box-shadow: none !important;
  padding: 0;
  background-color: transparent;
}

.pattern-input :deep(.el-input__inner) {
  color: var(--el-text-color-primary);
}

.slash {
  font-size: 1.2em;
  color: var(--el-text-color-secondary);
  font-weight: bold;
  user-select: none;
}

.flags-display {
  color: var(--el-color-success);
  font-weight: bold;
  margin-left: 5px;
}

.error-msg {
  color: var(--el-color-danger);
  font-size: 12px;
  margin-top: 5px;
}

.flags-group {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
}

.flags-group .el-checkbox {
  margin-right: 0;
  margin-bottom: 8px;
}

.highlight-container {
  font-family: monospace;
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-wrap;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
  padding: 15px;
  border-radius: 4px;
  border: 1px solid var(--el-border-color-lighter);
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}

.highlight-match {
  background-color: var(--el-color-success-light-8);
  border-radius: 2px;
  box-shadow: 0 0 0 1px var(--el-color-success-light-5);
  color: var(--el-text-color-primary);
  cursor: help;
}

html.dark .highlight-match {
  background-color: rgba(103, 194, 58, 0.2);
  box-shadow: 0 0 0 1px rgba(103, 194, 58, 0.4);
  color: #e1f3d8;
}

.highlight-match:hover {
  background-color: var(--el-color-success-light-5);
}

html.dark .highlight-match:hover {
  background-color: rgba(103, 194, 58, 0.4);
}

.output-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-gray {
  color: #909399;
}

/* Mobile Adjustments */
@media (max-width: 768px) {
  .layout {
    padding: 10px;
  }

  .main-content {
    padding: 0;
  }

  .app-header {
    margin-bottom: 10px;
    padding: 0 10px;
  }

  .logo h1 {
    font-size: 1.2rem;
  }

  .mb-4 {
    margin-bottom: 16px;
  }

  .regex-input-container {
    padding: 0 5px;
  }
  
  .pattern-input :deep(.el-input__inner) {
    font-size: 14px;
  }
  
  .slash {
    font-size: 1em;
  }

  .highlight-container {
    font-size: 14px;
    padding: 10px;
  }
}
</style>
