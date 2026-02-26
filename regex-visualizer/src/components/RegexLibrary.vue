<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Search } from '@element-plus/icons-vue'
import { regexCategories, type RegexPattern } from '../data/regex-patterns'

const { t } = useI18n()
const searchQuery = ref('')

const emit = defineEmits<{
  (e: 'select', pattern: RegexPattern): void
}>()

const filteredCategories = computed(() => {
  if (!searchQuery.value) return regexCategories

  const query = searchQuery.value.toLowerCase()
  return regexCategories.map(category => {
    const filteredItems = category.items.filter(item => {
      const name = t(`library.patterns.${item.name}`).toLowerCase()
      const desc = t(`library.patterns.${item.description}`).toLowerCase()
      return name.includes(query) || desc.includes(query) || item.pattern.includes(query)
    })
    
    return {
      ...category,
      items: filteredItems
    }
  }).filter(cat => cat.items.length > 0)
})

const handleSelect = (pattern: RegexPattern) => {
  emit('select', pattern)
}
</script>

<template>
  <div class="library-container">
    <div class="library-header">
      <h3>{{ t('library.title') }}</h3>
      <el-input
        v-model="searchQuery"
        :placeholder="t('library.search')"
        :prefix-icon="Search"
        clearable
        class="search-input"
      />
    </div>

    <div class="library-content">
      <el-empty v-if="filteredCategories.length === 0" description="No patterns found" />
      
      <div v-for="category in filteredCategories" :key="category.label" class="category-section">
        <h4 class="category-title">{{ t(`library.categories.${category.label}`) }}</h4>
        
        <div class="pattern-list">
          <div 
            v-for="item in category.items" 
            :key="item.name" 
            class="pattern-item"
            @click="handleSelect(item)"
          >
            <div class="pattern-info">
              <span class="pattern-name">{{ t(`library.patterns.${item.name}`) }}</span>
              <span class="pattern-desc">{{ t(`library.patterns.${item.description}`) }}</span>
            </div>
            <div class="pattern-code">
              <code>/{{ item.pattern }}/{{ item.flags }}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.library-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
  border-left: 1px solid var(--el-border-color);
}

.library-header {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color);
}

.library-header h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: var(--el-text-color-primary);
}

.library-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.category-section {
  margin-bottom: 24px;
}

.category-title {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pattern-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pattern-item {
  padding: 12px;
  border-radius: 6px;
  background-color: var(--el-fill-color-light);
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.pattern-item:hover {
  background-color: var(--el-fill-color);
  border-color: var(--el-color-primary-light-7);
  transform: translateY(-1px);
}

.pattern-info {
  margin-bottom: 8px;
}

.pattern-name {
  display: block;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.pattern-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.4;
}

.pattern-code {
  background-color: var(--el-bg-color);
  padding: 6px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  color: var(--el-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid var(--el-border-color-lighter);
}
</style>
