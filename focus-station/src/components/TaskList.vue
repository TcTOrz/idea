<template>
  <div class="tasks-container mt-6">
    <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
      <el-icon><List /></el-icon>
      {{ $t('app.tasks') }}
    </h3>

    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div class="flex gap-2 mb-4">
        <el-input 
          v-model="newTask" 
          :placeholder="$t('app.addTask')" 
          class="flex-1"
          @keyup.enter="addTask"
        />
        <el-button type="primary" @click="addTask" :icon="Plus" circle />
      </div>

      <div v-if="tasks.length === 0" class="text-gray-500 text-center py-8 flex flex-col items-center gap-2">
        <el-icon class="text-4xl text-gray-300"><Collection /></el-icon>
        <span>{{ $t('app.noTasks') }}</span>
      </div>

      <ul v-else class="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <li 
          v-for="task in tasks" 
          :key="task.id" 
          class="flex items-center justify-between p-3 rounded-lg group transition-colors duration-200"
          :class="[
            task.completed 
              ? 'bg-gray-50 dark:bg-gray-700/50' 
              : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-100 dark:border-gray-600'
          ]"
        >
          <div class="flex items-center gap-3 flex-1 overflow-hidden">
            <el-checkbox v-model="task.completed" size="large" />
            <span 
              class="truncate transition-all duration-300"
              :class="{ 'line-through text-gray-400': task.completed, 'text-gray-700 dark:text-gray-200': !task.completed }"
            >
              {{ task.content }}
            </span>
          </div>
          <el-button 
            type="danger" 
            link 
            :icon="Delete" 
            class="opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
            @click="removeTask(task.id)" 
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Delete, Collection } from '@element-plus/icons-vue'
import { useStorage } from '@vueuse/core'

interface Task {
  id: number
  content: string
  completed: boolean
}

const newTask = ref('')
const tasks = useStorage<Task[]>('focus-station-tasks', [])

const addTask = () => {
  if (!newTask.value.trim()) return
  
  tasks.value.push({
    id: Date.now(),
    content: newTask.value,
    completed: false
  })
  
  newTask.value = ''
}

const removeTask = (id: number) => {
  tasks.value = tasks.value.filter(t => t.id !== id)
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.8);
}
</style>
