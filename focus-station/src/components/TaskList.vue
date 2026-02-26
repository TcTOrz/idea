<template>
  <div class="tasks-container mt-0 h-[420px]">
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-6 h-full flex flex-col relative overflow-hidden">
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center">
            <el-icon class="text-lg"><List /></el-icon>
          </div>
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">
            {{ $t('app.tasks') }}
          </h3>
        </div>
        <button 
          v-if="hasCompletedTasks"
          class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          @click="clearCompleted"
        >
          {{ $t('app.clearCompleted') }}
        </button>
      </div>

      <!-- Progress Bar -->
      <div class="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
        <div 
          class="h-full bg-gray-800 dark:bg-blue-500 transition-all duration-500 ease-out rounded-full"
          :style="{ width: `${completionPercentage}%` }"
        ></div>
      </div>

      <!-- Task List -->
      <div class="flex-1 overflow-y-auto pr-1 -mr-1 custom-scrollbar">
        <div v-if="tasks.length === 0" class="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
          <el-icon class="text-4xl mb-2"><Collection /></el-icon>
          <span class="text-xs">{{ $t('app.noTasks') }}</span>
        </div>

        <ul v-else class="space-y-3 pb-2">
          <li 
            v-for="task in tasks" 
            :key="task.id" 
            class="group flex items-center justify-between"
          >
            <div 
              class="flex items-center flex-1 cursor-pointer select-none"
              @click="toggleTask(task)"
            >
              <!-- Custom Checkbox -->
              <div 
                class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0"
                :class="[
                  task.completed 
                    ? 'bg-gray-800 border-gray-800 dark:bg-blue-500 dark:border-blue-500' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-transparent'
                ]"
              >
                <el-icon v-if="task.completed" class="text-white text-xs"><Check /></el-icon>
              </div>
              
              <!-- Task Content -->
              <span 
                class="ml-3 text-sm font-medium transition-all duration-200 truncate"
                :class="[
                  task.completed 
                    ? 'line-through text-gray-300 dark:text-gray-600' 
                    : 'text-gray-700 dark:text-gray-200'
                ]"
              >
                {{ task.content }}
              </span>
            </div>

            <!-- Delete Button -->
            <button 
              class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500 p-1 rounded-md"
              @click.stop="removeTask(task.id)"
            >
              <el-icon><Delete /></el-icon>
            </button>
          </li>
        </ul>
      </div>

      <!-- Input Area -->
      <div class="mt-4 pt-4 border-t border-dashed border-gray-100 dark:border-gray-700/50">
        <div class="relative group">
          <input 
            v-model="newTask"
            type="text"
            :placeholder="$t('app.enterTask')"
            class="w-full bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 text-sm rounded-xl pl-4 pr-10 py-3 outline-none transition-all duration-200 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-600"
            @keyup.enter="addTask"
          />
          <button 
            class="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-white dark:bg-gray-600 shadow-sm flex items-center justify-center text-gray-400 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200 transform active:scale-95"
            @click="addTask"
          >
            <el-icon><Plus /></el-icon>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Delete, Collection, List, Check } from '@element-plus/icons-vue'
import { useStorage } from '@vueuse/core'

interface Task {
  id: number
  content: string
  completed: boolean
}

const newTask = ref('')
const tasks = useStorage<Task[]>('focus-station-tasks', [])

const hasCompletedTasks = computed(() => tasks.value.some(t => t.completed))

const completionPercentage = computed(() => {
  if (tasks.value.length === 0) return 0
  const completed = tasks.value.filter(t => t.completed).length
  return Math.round((completed / tasks.value.length) * 100)
})

const addTask = () => {
  if (!newTask.value.trim()) return
  
  tasks.value.push({
    id: Date.now(),
    content: newTask.value,
    completed: false
  })
  
  newTask.value = ''
}

const toggleTask = (task: Task) => {
  task.completed = !task.completed
}

const removeTask = (id: number) => {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

const clearCompleted = () => {
  tasks.value = tasks.value.filter(t => !t.completed)
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}
</style>
