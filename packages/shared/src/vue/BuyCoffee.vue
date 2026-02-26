<template>
  <el-button 
    class="buy-coffee-btn" 
    type="warning" 
    circle 
    size="large"
    @click="visible = true"
    :title="displayTitle"
  >
    <el-icon><Coffee /></el-icon>
  </el-button>

  <el-dialog
    v-model="visible"
    :title="displayTitle"
    width="500px"
    center
    align-center
    class="coffee-dialog"
    append-to-body
  >
    <div class="text-center">
      <p class="mb-4 text-gray-600 dark:text-gray-300">
        {{ displayDesc }}
      </p>
      <div class="flex justify-center gap-6 mt-6">
        <div class="text-center">
          <img :src="wechatPayImg" alt="WeChat Pay" class="w-40 h-52 object-contain border rounded-lg shadow-sm bg-white" />
          <p class="mt-2 text-sm text-gray-500">WeChat Pay</p>
        </div>
        <div class="text-center">
          <img :src="aliPayImg" alt="AliPay" class="w-40 h-52 object-contain border rounded-lg shadow-sm bg-white" />
          <p class="mt-2 text-sm text-gray-500">AliPay</p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Coffee } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import aliPayImg from '../assets/aliPay.jpg'
import wechatPayImg from '../assets/wechatPay.png'

const props = defineProps<{
  title?: string
  desc?: string
}>()

const { t, te } = useI18n()
const visible = ref(false)

const displayTitle = computed(() => {
  if (props.title) return props.title
  if (te('app.coffee.title')) return t('app.coffee.title')
  if (te('coffee.title')) return t('coffee.title')
  return 'Buy me a coffee'
})

const displayDesc = computed(() => {
  if (props.desc) return props.desc
  if (te('app.coffee.desc')) return t('app.coffee.desc')
  if (te('coffee.desc')) return t('coffee.desc')
  return 'If you like this project, please consider buying me a coffee!'
})
</script>

<style scoped>
.buy-coffee-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 2000;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s;
  width: 50px;
  height: 50px;
  font-size: 24px;
}

.buy-coffee-btn:hover {
  transform: scale(1.1);
}

:global(.coffee-dialog .el-dialog__body) {
  padding-top: 10px;
}
</style>
