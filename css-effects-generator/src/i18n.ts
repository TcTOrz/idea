import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    app: {
      title: 'CSS Effects Generator',
      glassmorphism: 'Glassmorphism',
      neumorphism: 'Neumorphism',
      boxShadow: 'Box Shadow',
      copy: 'Copy CSS',
      copied: 'Copied!',
      preview: 'Preview',
      settings: 'Settings',
      blur: 'Blur',
      transparency: 'Transparency',
      color: 'Color',
      distance: 'Distance',
      intensity: 'Intensity',
      shape: 'Shape',
      flat: 'Flat',
      concave: 'Concave',
      convex: 'Convex',
      pressed: 'Pressed',
      lightSource: 'Light Source',
      topLeft: 'Top Left',
      topRight: 'Top Right',
      bottomLeft: 'Bottom Left',
      bottomRight: 'Bottom Right',
      coffee: {
        title: 'Buy me a coffee',
        desc: 'If you like this project, please consider buying me a coffee!'
      }
    }
  },
  zh: {
    app: {
      title: 'CSS 高级效果生成器',
      glassmorphism: '毛玻璃效果',
      neumorphism: '新拟态效果',
      boxShadow: '多层阴影',
      copy: '复制 CSS',
      copied: '已复制!',
      preview: '预览',
      settings: '设置',
      blur: '模糊度',
      transparency: '透明度',
      color: '颜色',
      distance: '距离',
      intensity: '强度',
      shape: '形状',
      flat: '平面',
      concave: '凹面',
      convex: '凸面',
      pressed: '按下',
      lightSource: '光源方向',
      topLeft: '左上',
      topRight: '右上',
      bottomLeft: '左下',
      bottomRight: '右下',
      coffee: {
        title: '请我喝咖啡',
        desc: '如果这些工具对你有帮助，欢迎请我喝杯咖啡！'
      }
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'zh', // Default to Chinese
  fallbackLocale: 'en',
  messages
})

export default i18n
