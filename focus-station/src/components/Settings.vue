<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('app.settings')"
    width="400px"
    destroy-on-close
  >
    <div class="space-y-4">
      <div class="flex flex-col gap-2">
        <label class="text-sm text-gray-700 dark:text-gray-300">{{ $t('app.workDuration') }} ({{ $t('app.minutes') }})</label>
        <el-input-number v-model="settings.pomodoro" :min="1" :max="60" />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm text-gray-700 dark:text-gray-300">{{ $t('app.shortBreakDuration') }} ({{ $t('app.minutes') }})</label>
        <el-input-number v-model="settings.shortBreak" :min="1" :max="30" />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm text-gray-700 dark:text-gray-300">{{ $t('app.longBreakDuration') }} ({{ $t('app.minutes') }})</label>
        <el-input-number v-model="settings.longBreak" :min="1" :max="60" />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveSettings">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'

const dialogVisible = ref(false)

const settings = useStorage('focus-station-settings', {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15
})

const emit = defineEmits(['update:settings'])

const saveSettings = () => {
  emit('update:settings', settings.value)
  dialogVisible.value = false
}

defineExpose({
  open: () => {
    dialogVisible.value = true
  }
})
</script>
