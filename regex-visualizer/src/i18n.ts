import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    title: 'Regex Visualizer',
    input: {
      label: 'Regular Expression',
      placeholder: 'Enter regex pattern...',
      testString: 'Test String',
      testPlaceholder: 'Enter text to test...',
      flags: 'Flags'
    },
    output: {
      matchResult: 'Match Result',
      matches: 'matches',
      matchDetails: 'Match Details',
      index: 'Index',
      match: 'Match',
      groups: 'Groups'
    },
    flags: {
      g: 'Global (g)',
      i: 'Case Insensitive (i)',
      m: 'Multiline (m)',
      s: 'Dot All (s)',
      u: 'Unicode (u)',
      y: 'Sticky (y)'
    },
    theme: {
      light: 'Light',
      dark: 'Dark'
    },
    library: {
      title: 'Regex Library',
      search: 'Search patterns...',
      use: 'Use',
      categories: {
        common: 'Common',
        dev: 'Development',
        validation: 'Validation'
      },
      patterns: {
        email: 'Email Address',
        email_desc: 'Matches standard email addresses.',
        url: 'URL',
        url_desc: 'Matches http/https URLs.',
        ipv4: 'IPv4 Address',
        ipv4_desc: 'Matches standard IPv4 addresses.',
        date_iso: 'ISO Date',
        date_iso_desc: 'Matches YYYY-MM-DD format.',
        hex_color: 'Hex Color',
        hex_color_desc: 'Matches hex color codes (3 or 6 digits).',
        html_tag: 'HTML Tag',
        html_tag_desc: 'Matches HTML tags and captures attributes.',
        slug: 'Slug',
        slug_desc: 'Matches URL slugs (lowercase, hyphens).',
        password_complex: 'Complex Password',
        password_complex_desc: 'Requires 8+ chars, uppercase, lowercase, digit, special char.',
        username: 'Username',
        username_desc: 'Alphanumeric, underscores, hyphens, 3-16 chars.',
        phone_cn: 'CN Phone Number',
        phone_cn_desc: 'Matches Chinese mobile phone numbers.',
        id_card_cn: 'CN ID Card',
        id_card_cn_desc: 'Matches 18-digit Chinese ID card numbers.'
      }
    },
    coffee: {
      title: 'Buy me a coffee',
      desc: 'If you like this project, please consider buying me a coffee!'
    }
  },
  zh: {
    title: '正则表达式可视化',
    input: {
      label: '正则表达式',
      placeholder: '输入正则表达式...',
      testString: '测试文本',
      testPlaceholder: '输入要测试的文本...',
      flags: '修饰符'
    },
    output: {
      matchResult: '匹配结果',
      matches: '个匹配',
      matchDetails: '匹配详情',
      index: '索引',
      match: '内容',
      groups: '分组'
    },
    flags: {
      g: '全局匹配 (g)',
      i: '忽略大小写 (i)',
      m: '多行匹配 (m)',
      s: '点号匹配换行 (s)',
      u: 'Unicode (u)',
      y: '粘性匹配 (y)'
    },
    theme: {
      light: '浅色',
      dark: '深色'
    },
    library: {
      title: '正则大全',
      search: '搜索正则...',
      use: '使用',
      categories: {
        common: '常用',
        dev: '开发',
        validation: '校验'
      },
      patterns: {
        email: '电子邮箱',
        email_desc: '匹配标准电子邮箱地址。',
        url: 'URL 链接',
        url_desc: '匹配 http/https 网址。',
        ipv4: 'IPv4 地址',
        ipv4_desc: '匹配标准 IPv4 地址格式。',
        date_iso: '日期 (ISO)',
        date_iso_desc: '匹配 YYYY-MM-DD 格式。',
        hex_color: '十六进制颜色',
        hex_color_desc: '匹配 3 或 6 位颜色代码。',
        html_tag: 'HTML 标签',
        html_tag_desc: '匹配 HTML 标签并捕获属性。',
        slug: 'Slug',
        slug_desc: '匹配 URL Slug（小写字母、连字符）。',
        password_complex: '复杂密码',
        password_complex_desc: '需包含大小写字母、数字及特殊字符，8位以上。',
        username: '用户名',
        username_desc: '字母数字下划线，3-16位。',
        phone_cn: '手机号 (CN)',
        phone_cn_desc: '匹配中国大陆手机号码。',
        id_card_cn: '身份证 (CN)',
        id_card_cn_desc: '匹配 18 位中国居民身份证号码。'
      }
    },
    coffee: {
      title: '请我喝咖啡',
      desc: '如果这些工具对你有帮助，欢迎请我喝杯咖啡！'
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
