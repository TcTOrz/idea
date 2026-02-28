import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import pinia from './stores'
import i18n from './i18n'
import ElementPlus from 'element-plus'

const app = createApp(App)

app.use(pinia)
app.use(i18n)
app.use(ElementPlus)
app.mount('#app')
