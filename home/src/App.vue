<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWindowScroll } from '@vueuse/core'

const searchTerm = ref('')
const showModal = ref(false)
const showSearch = ref(false)
const showQQ = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)
const { y: scrollY } = useWindowScroll()

const projects = [
  {
    href: '/focus-station/',
    icon: '⏱️',
    title: 'Focus Station',
    desc: '番茄钟与白噪音。极简番茄工作法计时器，内置白噪音混音台与任务清单。',
    tags: ['Focus', 'Sound']
  },
  {
    href: '/json-toolkit/',
    icon: '🔧',
    title: 'JSON Toolkit',
    desc: '一个强大的 JSON 在线编辑器、格式化和校验工具。支持压缩、主题切换和文件上传。',
    tags: ['JSON', 'Tool']
  },
  {
    href: '/color-wizard/',
    icon: '🎨',
    title: 'Color Wizard',
    desc: '高级色彩生成与调色板工具。支持多种色彩算法，实时预览，一键导出 CSS/JSON。',
    tags: ['Color', 'Design']
  },
  {
    href: '/regex-visualizer/',
    icon: '🔍',
    title: 'Regex Visualizer',
    desc: '正则表达式可视化与测试助手。支持实时匹配高亮、语法分析。',
    tags: ['Regex', 'Tool']
  },
  {
    href: '/diff-checker/',
    icon: '⚖️',
    title: 'Diff Checker',
    desc: '代码/文本差异比对工具。支持多种语言语法高亮，左右分屏与行内对比模式。',
    tags: ['Diff', 'Dev']
  },
  {
    href: '/css-effects-generator/',
    icon: '✨',
    title: 'CSS Effects',
    desc: 'CSS 高级效果生成器。包含毛玻璃、新拟态、多层阴影等效果，实时预览与代码生成。',
    tags: ['CSS', 'Design']
  }
]

const filteredProjects = computed(() => {
  const term = searchTerm.value.toLowerCase()
  if (!term) return projects
  
  return projects.filter(p => 
    p.title.toLowerCase().includes(term) || 
    p.desc.toLowerCase().includes(term) || 
    p.tags.some(t => t.toLowerCase().includes(term))
  )
})

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    setTimeout(() => {
      searchInputRef.value?.focus()
    }, 100)
  } else {
    searchTerm.value = ''
  }
}
</script>

<template>
  <div class="page-wrapper">
    <!-- Parallax Background Elements -->
    <div class="bg-shape shape-1" :style="{ transform: `translateY(${scrollY * 0.2}px)` }"></div>
    <div class="bg-shape shape-2" :style="{ transform: `translateY(${scrollY * -0.15}px)` }"></div>
    <div class="bg-shape shape-3" :style="{ transform: `translateY(${scrollY * 0.1}px)` }"></div>

    <div class="top-nav">
      <!-- Search Bar -->
      <div class="search-section" :class="{ 'search-active': showSearch }">
        <div class="search-trigger" @click="toggleSearch" v-if="!showSearch">
          <span class="search-icon-static">🔍</span>
        </div>
        
        <div class="search-container" v-else>
          <span class="search-icon">🔍</span>
          <input 
            ref="searchInputRef"
            type="text" 
            class="search-input" 
            placeholder="输入关键词..." 
            v-model="searchTerm"
            @blur="!searchTerm && toggleSearch()"
            @keydown.esc="toggleSearch()"
          >
          <button class="search-close" @click="toggleSearch">&times;</button>
        </div>
      </div>

      <div class="avatar-wrapper">
        <div class="avatar">
          <img src="https://avatars.githubusercontent.com/u/10292863?v=4" alt="TcTOrz">
        </div>
      </div>
    </div>

    <div class="container">
      <header>
        <div class="header-content">
          <div class="hero-text">
            <h1 class="hero-title">Idea <span class="gradient-text">Projects</span></h1>
            <p class="bio">
              这里是 <strong>TcTOrz</strong> 的创意实验室。
              <br>
              探索前端技术，创造有趣的 Web 应用。
            </p>
            <div class="actions">
              <a href="https://tctorz.github.io/" class="social-link" target="_blank">
                <span>访问博客</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </a>
              <button id="sponsorBtn" class="sponsor-link" @click="openModal">
                <span>☕ 请我喝咖啡</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <TransitionGroup name="list" tag="div" class="grid" id="projectGrid">
        <a 
          v-for="project in filteredProjects" 
          :key="project.title"
          :href="project.href" 
          class="card group" 
          target="_blank"
        >
          <div class="card-bg"></div>
          <div class="icon-wrapper">
            <span class="icon">{{ project.icon }}</span>
          </div>
          <div class="content-wrapper">
            <div class="header-row">
              <h2>{{ project.title }}</h2>
              <span class="arrow-icon">&rarr;</span>
            </div>
            <p>{{ project.desc }}</p>
            <div class="tags">
              <span class="tag" v-for="tag in project.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </a>
      </TransitionGroup>
      
      <div v-if="filteredProjects.length === 0" class="empty-state">
        <p>没有找到匹配的项目 🧐</p>
      </div>

      <div class="disclaimer">
        <p><strong>免责声明：</strong>本站所有工具仅供学习与交流使用。工具主要运行于浏览器端，您的数据（如 JSON、代码等）通常仅在本地处理，但为了安全起见，请勿在任何在线工具中处理敏感或机密数据。开发者不对因使用本站工具导致的任何直接或间接损失承担责任。</p>
      </div>

      <div class="links-section">
        <a href="https://github.com/TcTOrz" target="_blank" class="link-item">GitHub</a>
        <span class="separator">|</span>
        <a href="https://tctorz.github.io/" target="_blank" class="link-item">博客</a>
        <span class="separator">|</span>
        <span class="link-item feedback" @click="showQQ = !showQQ">
          {{ showQQ ? 'QQ: 158760251' : '问题反馈' }}
        </span>
      </div>

      <footer>
        <p>&copy; 2024 TcTOrz. All rights reserved.</p>
      </footer>
    </div>

    <!-- Sponsor Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="modal show" @click.self="closeModal">
        <div class="modal-content">
          <button class="close-modal" @click="closeModal">&times;</button>
          <h2 class="modal-title">感谢支持 ❤️</h2>
          <p class="modal-desc">如果这些工具对你有帮助，欢迎请我喝杯咖啡！</p>
          <div class="qr-container">
            <div class="qr-item">
              <img src="/assets/wechatPay.png" alt="WeChat Pay">
              <p>微信支付</p>
            </div>
            <div class="qr-item">
              <img src="/assets/aliPay.jpg" alt="AliPay">
              <p>支付宝</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Reset & Base */
.page-wrapper {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden; /* Ensure content doesn't overflow */
  background-color: #f8fafc;
  background-image: 
    radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.1) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.1) 0px, transparent 50%);
}

/* Parallax Background Shapes */
.bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  opacity: 0.6;
  pointer-events: none;
}

.shape-1 {
  top: -10%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: rgba(99, 102, 241, 0.2); /* Indigo */
  animation: float 20s infinite ease-in-out;
}

.shape-2 {
  top: 40%;
  right: -5%;
  width: 400px;
  height: 400px;
  background: rgba(236, 72, 153, 0.15); /* Pink */
  animation: float 25s infinite ease-in-out reverse;
}

.shape-3 {
  bottom: -10%;
  left: 20%;
  width: 600px;
  height: 600px;
  background: rgba(59, 130, 246, 0.15); /* Blue */
  animation: float 22s infinite ease-in-out 2s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, 20px); }
}

.container {
  position: relative;
  max-width: 1100px;
  width: 90%;
  padding: 4rem 2rem 2rem;
  margin: 0 auto;
  text-align: center;
  z-index: 1;
}

/* Header Styles */
header {
  margin-bottom: 3rem;
  animation: fadeInDown 1s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
}

.top-nav {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 2rem 3rem;
    display: flex;
    justify-content: flex-end; /* Align right */
    align-items: center;
    gap: 1.5rem; /* Add gap between items */
    z-index: 50;
    pointer-events: none;
  }

.top-nav > * {
  pointer-events: auto; /* Re-enable clicks for children */
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 800px;
  margin: 4rem auto 0;
}

.avatar-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  margin: 0;
  flex-shrink: 0;
}

.hero-text {
  flex: 1;
  width: 100%;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #fff;
  padding: 2px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.1);
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-glow {
  display: none; 
}

.hero-title {
  color: #1e293b;
  margin: 0 0 1rem;
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1.1;
}

.gradient-text {
  background: linear-gradient(135deg, #4f46e5 0%, #ec4899 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.bio {
  color: #64748b;
  margin: 0 auto 2rem;
  line-height: 1.6;
  font-size: 1.2rem;
  max-width: 600px;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.social-link, .sponsor-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  font-size: 1rem;
  border: none;
  cursor: pointer;
}

@media (max-width: 768px) {
  .top-nav {
    padding: 1.5rem;
    position: relative; /* On mobile, push content down */
    margin-bottom: 0;
    justify-content: flex-end; /* Keep aligned right on mobile too */
    gap: 1rem;
  }

  .header-content {
    margin-top: 1rem;
    gap: 1.5rem;
  }
  
  /* Make header more compact on mobile */
  header {
    margin-bottom: 2rem;
  }

  /* Move search section to top visually - handled by flex order/layout now */
  .search-section {
    order: 0; /* Reset order, let it flow naturally */
    margin-bottom: 0;
  }

  .container {
    display: flex;
    flex-direction: column;
    padding: 0 1rem 1.5rem; /* Reduce top padding since nav is relative */
  }

  .avatar-wrapper {
    width: 40px;
    height: 40px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .bio {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .search-input {
    padding: 0.6rem 2.5rem 0.6rem 1rem;
    font-size: 0.95rem;
  }

  .search-icon {
    left: 0.8rem;
    font-size: 1rem;
  }

  .search-container {
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 400px;
    margin-right: 0;
  }

  .grid {
    grid-template-columns: 1fr; /* Single column */
    justify-items: center; /* Center items */
    gap: 1rem;
  }

  .card {
    padding: 1.25rem;
    gap: 1rem;
    width: 100%; /* Full width */
    max-width: 400px; /* Limit max width */
  }

  .icon {
    width: 48px;
    height: 48px;
    font-size: 1.75rem;
  }

  .card h2 {
    font-size: 1.1rem;
  }

  .card p {
    font-size: 0.875rem;
    -webkit-line-clamp: 3;
  }
}

.social-link {
  background: white;
  color: #4f46e5;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.social-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  background: #4f46e5;
  color: white;
}

.sponsor-link {
  background: rgba(251, 191, 36, 0.1);
  color: #d97706;
}

.sponsor-link:hover {
  background: #d97706;
  color: white;
  transform: translateY(-2px);
}

/* Search Bar */
.search-section {
  z-index: 50;
  display: flex;
  align-items: center;
}

.search-trigger {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: #64748b;
}

.search-trigger:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  background: white;
  color: #4f46e5;
}

.search-icon-static {
  font-size: 1.2rem;
}

.search-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  max-width: 90%;
  animation: expandSearchCenter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: center;
  margin-right: 0;
}

@keyframes expandSearchCenter {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.search-input {
  width: 100%;
  padding: 0.8rem 2.5rem 0.8rem 1rem; /* Adjust padding for close button */
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  font-size: 1rem;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  outline: none;
  box-sizing: border-box;
  color: #334155;
}

.search-icon {
  display: none; /* Hide inside input since we use it as trigger */
}

.search-close {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.2rem;
  line-height: 1;
  transition: color 0.2s;
}

/* Grid & Cards */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  padding-bottom: 2rem;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1.25rem;
  text-align: left;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.card:hover {
  transform: translateY(-5px) scale(1.01);
  box-shadow: 0 20px 40px -10px rgba(79, 70, 229, 0.15);
  border-color: rgba(79, 70, 229, 0.3);
}

.card:hover .card-bg {
  opacity: 1;
}

.icon-wrapper {
  flex-shrink: 0;
  z-index: 1;
}

.icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  background: #fff;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.card:hover .icon {
  background: #4f46e5;
  color: white;
  transform: rotate(10deg) scale(1.1);
  box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2);
}

.content-wrapper {
  flex: 1;
  min-width: 0;
  z-index: 1;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.card h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: #1e293b;
  line-height: 1.3;
}

.arrow-icon {
  color: #4f46e5;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  font-size: 1.25rem;
}

.card:hover .arrow-icon {
  opacity: 1;
  transform: translateX(0);
}

.card p {
  font-size: 0.925rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  background: rgba(241, 245, 249, 0.8);
  color: #64748b;
  border-radius: 9999px;
  font-weight: 600;
  transition: all 0.3s;
}

.card:hover .tag {
  background: white;
  color: #4f46e5;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

/* Empty State */
.empty-state {
  padding: 4rem 2rem;
  color: #64748b;
  font-size: 1.125rem;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
  border-radius: 1rem;
  margin: 2rem 0;
  border: 1px dashed rgba(148, 163, 184, 0.3);
}

/* List Transitions */
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* Ensure leave items are taken out of layout flow so others can move in */
.list-leave-active {
  position: absolute;
  /* Grid items need to maintain their size when absolute */
  width: calc((100% - 2rem) / 2); /* Approximate for 2 cols */
}

@media (min-width: 1024px) {
  .list-leave-active {
    width: calc((100% - 4rem) / 3); /* Approximate for 3 cols */
  }
}

@media (max-width: 767px) {
  .list-leave-active {
    width: 100%;
  }
}

/* Footer */
footer {
  margin-top: 1.5rem;
  color: #94a3b8;
  font-size: 0.875rem;
}

/* Links Section */
.links-section {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 0.95rem;
}

.link-item {
  color: #64748b;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  font-weight: 500;
  user-select: none;
}

.link-item:hover {
  color: #4f46e5;
  transform: translateY(-1px);
}

.separator {
  color: #cbd5e1;
  font-size: 0.8rem;
}

.feedback {
  min-width: 80px;
  text-align: center;
}

/* Disclaimer */
.disclaimer {
  margin-top: 4rem;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
  border-radius: 1rem;
  border: 1px dashed rgba(148, 163, 184, 0.3);
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  transition: all 0.3s ease;
}

.disclaimer:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(148, 163, 184, 0.5);
}

.disclaimer p {
  color: #94a3b8;
  font-size: 0.8rem;
  line-height: 1.6;
  margin: 0;
}

.disclaimer strong {
  color: #64748b;
  font-weight: 600;
}

/* Modal Styles */
.modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  z-index: 1000;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2.5rem;
  border-radius: 1.5rem;
  max-width: 600px;
  width: 90%;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes modalUp {
  from { opacity: 0; transform: translateY(40px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.close-modal {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}

.close-modal:hover {
  background: #e2e8f0;
  color: #1e293b;
  transform: rotate(90deg);
}

.modal-title {
  text-align: center; 
  margin-top: 0; 
  color: #1e293b;
  font-size: 1.75rem;
  font-weight: 700;
}

.modal-desc {
  text-align: center; 
  color: #64748b;
  margin-bottom: 2rem;
}

.qr-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.qr-item {
  text-align: center;
}

.qr-item img {
  width: 200px;
  height: 280px;
  object-fit: contain;
  background: #f8fafc;
  border-radius: 1rem;
  padding: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
  transition: transform 0.3s;
}

.qr-item:hover img {
  transform: scale(1.02);
}

.qr-item p {
  color: #475569;
  font-weight: 600;
  margin: 0;
}

@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem 1rem;
    width: 90%;
    max-width: 360px;
  }

  .qr-container {
    gap: 0.8rem;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
  }

  .qr-item {
    flex: 1;
    min-width: 0;
  }

  .qr-item img {
    width: 100%;
    max-width: 140px;
    height: auto;
    padding: 0.25rem;
  }

  .qr-item p {
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }

  .modal-title {
    font-size: 1.35rem;
    margin-bottom: 0.5rem;
  }

  .modal-desc {
    font-size: 0.9rem;
    margin-bottom: 1.2rem;
  }

  .close-modal {
    top: 0.5rem;
    right: 0.5rem;
    width: 32px;
    height: 32px;
    font-size: 1.2rem;
  }
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
