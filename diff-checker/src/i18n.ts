import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    title: 'Diff Checker',
    toolbar: {
      language: 'Select Language',
      splitView: 'Split View',
      inlineView: 'Inline View',
      theme: {
        light: 'Light',
        dark: 'Dark'
      }
    },
    languages: {
      json: 'JSON',
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      html: 'HTML',
      css: 'CSS',
      markdown: 'Markdown',
      plaintext: 'Plain Text'
    },
    menu: {
      copy: 'Copy',
      paste: 'Paste',
      cut: 'Cut',
      selectAll: 'Select All',
      format: 'Format Document'
    }
  },
  zh: {
    title: '代码比对工具',
    toolbar: {
      language: '选择语言',
      splitView: '左右分屏',
      inlineView: '行内对比',
      theme: {
        light: '浅色',
        dark: '深色'
      }
    },
    languages: {
      json: 'JSON',
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      html: 'HTML',
      css: 'CSS',
      markdown: 'Markdown',
      plaintext: '纯文本'
    },
    menu: {
      copy: '复制',
      paste: '粘贴',
      cut: '剪切',
      selectAll: '全选',
      format: '格式化文档'
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: navigator.language.startsWith('zh') ? 'zh' : 'en',
  fallbackLocale: 'en',
  messages
})

export default i18n
