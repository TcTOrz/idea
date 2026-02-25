import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    app: {
      title: 'JSON Toolkit',
      format: 'Format',
      compress: 'Compress',
      validate: 'Validate',
      copy: 'Copy',
      clear: 'Clear',
      indent: 'Indent',
      space: 'Space',
      theme: 'Theme',
      input: 'INPUT',
      output: 'OUTPUT',
      length: 'Length',
      lines: 'Lines',
      formatted: 'Formatted successfully',
      compressed: 'Compressed successfully',
      valid: 'Valid JSON',
      invalid: 'Invalid JSON',
      copied: 'Copied to clipboard',
      cleared: 'Cleared',
      readOnlyWarning: 'Cannot edit in read-only editor',
      font: 'Font',
      fontSize: 'Size',
      fontFamily: 'Family',
      upload: 'Upload',
      fileLoaded: 'File loaded successfully',
      fileLoadError: 'Failed to load file'
    }
  },
  zh: {
    app: {
      title: 'JSON 工具箱',
      format: '格式化',
      compress: '压缩',
      validate: '验证',
      copy: '复制',
      clear: '清空',
      indent: '缩进',
      space: '空格',
      theme: '主题',
      input: '输入',
      output: '输出',
      length: '字符数',
      lines: '行数',
      formatted: '格式化成功',
      compressed: '压缩成功',
      valid: 'JSON 格式正确',
      invalid: 'JSON 格式错误',
      copied: '已复制到剪贴板',
      cleared: '已清空',
      readOnlyWarning: '无法在只读编辑器中编辑',
      font: '字体',
      fontSize: '大小',
      fontFamily: '字体',
      upload: '上传',
      fileLoaded: '文件加载成功',
      fileLoadError: '文件加载失败'
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'zh', // default to Chinese as per user preference
  fallbackLocale: 'en',
  messages
})

export default i18n
