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

  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="custom-modal" @click.self="visible = false">
        <div class="custom-modal-content">
          <button class="close-modal" @click="visible = false">&times;</button>
          <h2 class="modal-title">{{ displayTitle }}</h2>
          <p class="modal-desc">
            {{ displayDesc }}
          </p>
          <div class="qr-container">
            <div class="qr-item">
              <img :src="wechatPayImg" alt="WeChat Pay" />
              <p>WeChat Pay</p>
            </div>
            <div class="qr-item">
              <img :src="aliPayImg" alt="AliPay" />
              <p>AliPay</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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

.custom-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 2001;
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1.5rem;
  max-width: 600px;
  width: 90%;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  /* Dark mode support if needed by parent apps, but index.html didn't have it explicitly besides vars. 
     We'll stick to index.html styles which were white bg. */
}

.close-modal {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s;
  line-height: 1;
}

.close-modal:hover {
  color: #111827;
}

.modal-title {
  text-align: center;
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #111827;
  font-size: 1.5rem;
  font-weight: 700;
}

.modal-desc {
  text-align: center;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.qr-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.qr-item {
  text-align: center;
}

.qr-item img {
  width: 200px;
  height: 280px;
  object-fit: contain;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
  border: 1px solid #e5e7eb;
}

@media (max-width: 600px) {
  .qr-item img {
    width: 150px;
    height: 210px;
  }
  .custom-modal-content {
    padding: 1.5rem;
    width: 95%;
  }
  .qr-container {
    gap: 1rem;
  }
}

.qr-item p {
  color: #6b7280;
  font-weight: 500;
  margin: 0.5rem 0 0;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .custom-modal-content,
.modal-fade-leave-active .custom-modal-content {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-fade-enter-from .custom-modal-content,
.modal-fade-leave-to .custom-modal-content {
  transform: translateY(20px);
}
</style>
