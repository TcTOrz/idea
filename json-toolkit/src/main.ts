import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import i18n from './i18n'
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'

const app = createApp(App)

app.use(ElementPlus)
app.use(i18n)
app.use(VueMonacoEditorPlugin, {
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs'
  },
  "vs/nls": {
    availableLanguages: {
      "*": i18n.global.locale.value === 'zh' ? 'zh-cn' : 'en'
    }
  }
})

app.mount('#app')
