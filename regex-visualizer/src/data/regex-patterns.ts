export interface RegexPattern {
  name: string
  pattern: string
  flags: string
  description: string
  examples: string[]
}

export interface RegexCategory {
  label: string
  items: RegexPattern[]
}

export const regexCategories: RegexCategory[] = [
  {
    label: 'common', // key for i18n
    items: [
      {
        name: 'email',
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        flags: 'g',
        description: 'email_desc',
        examples: ['test@example.com', 'user.name@domain.co.uk']
      },
      {
        name: 'url',
        pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
        flags: 'g',
        description: 'url_desc',
        examples: ['https://www.google.com', 'http://example.org/path?q=1']
      },
      {
        name: 'ipv4',
        pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
        flags: 'g',
        description: 'ipv4_desc',
        examples: ['192.168.1.1', '127.0.0.1']
      },
      {
        name: 'date_iso',
        pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        flags: '',
        description: 'date_iso_desc',
        examples: ['2024-03-21', '1999-12-31']
      }
    ]
  },
  {
    label: 'dev',
    items: [
      {
        name: 'hex_color',
        pattern: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$',
        flags: '',
        description: 'hex_color_desc',
        examples: ['#FFF', '#000000', 'f0f0f0']
      },
      {
        name: 'html_tag',
        pattern: '<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)',
        flags: 'g',
        description: 'html_tag_desc',
        examples: ['<div class="test">Hello</div>', '<br />']
      },
      {
        name: 'slug',
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
        flags: '',
        description: 'slug_desc',
        examples: ['hello-world', 'regex-visualizer']
      }
    ]
  },
  {
    label: 'validation',
    items: [
      {
        name: 'password_complex',
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
        flags: '',
        description: 'password_complex_desc',
        examples: ['Password123!', 'SecureP@ss8']
      },
      {
        name: 'username',
        pattern: '^[a-zA-Z0-9_-]{3,16}$',
        flags: '',
        description: 'username_desc',
        examples: ['my_user-name', 'admin123']
      },
       {
        name: 'phone_cn',
        pattern: '^(?:(?:\\+|00)86)?1[3-9]\\d{9}$',
        flags: '',
        description: 'phone_cn_desc',
        examples: ['13800138000', '+8613912345678']
      },
      {
        name: 'id_card_cn',
        pattern: '^[1-9]\\d{5}(?:18|19|20)\\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\\d|30|31)\\d{3}[0-9Xx]$',
        flags: '',
        description: 'id_card_cn_desc',
        examples: ['11010519491231002X']
      }
    ]
  }
]
