<script setup lang="ts">
// 首页底部技术栈：按类别静态铺开，不滚动
// 图标直接放品牌色，尽量用各家官方素材
// （png 那几个是从官方素材里裁的方形标：uniapp / mybatis 官方只有横版 logo，
//   nutui 官方是白底图，抽掉白底才透明，vant 缩到 224 省体积）
const groups: { title: string; icons: string[] }[] = [
  {
    // 站内文章按篇数排：JavaScript 58、backend/java 31、react 38、vue 36、Engineering 21
    title: '语言基础',
    icons: [
      'javascript.svg',
      'typescript.svg',
      'python.svg',
      'java.svg',
      'html.svg',
      'css-3.svg',
      'markdown.svg',
      'c.svg',
      'c-plusplus.svg',
      'dart.svg',
      'lua.svg',
      'yaml.svg',
    ],
  },
  {
    title: '前端框架与库',
    icons: [
      'vue.svg',
      'react.svg',
      'nuxt.svg',
      'nextjs.svg',
      'uniapp.png',
      'redux.svg',
      'immer.svg',
      'pinia.svg',
      'vueuse.svg',
      'axios.svg',
      'lodash.svg',
      'promises.svg',
      'd3.svg',
      'socket-io.svg',
      'mdn.svg',
      'flutter.svg',
    ],
  },
  {
    title: 'UI 与可视化',
    icons: [
      'element.svg',
      'ant-design.svg',
      'vant.png',
      'nutui.png',
      'echarts.svg',
      'threejs.svg',
      'gsap.svg',
    ],
  },
  {
    title: '工程化',
    icons: [
      'vite.svg',
      'webpack.svg',
      'rolldown.svg',
      'oxc.svg',
      'rollup.svg',
      'esbuild.svg',
      'turborepo.svg',
      'babel.svg',
      'postcss.svg',
      'tailwind.svg',
      'unocss.svg',
      'eslint.svg',
      'sass.svg',
      'less.svg',
      'prettier.svg',
      'stylelint.svg',
      'vitest.svg',
      'npm.svg',
      'pnpm.svg',
      'yarn.svg',
      'bun.svg',
      'nvm.svg',
      'leaflet.svg',
    ],
  },
  {
    title: '后端与数据库',
    icons: [
      'node.svg',
      'express.svg',
      'koa.svg',
      'fastapi.svg',
      'sequelize.svg',
      'spring.svg',
      'springboot.svg',
      'mybatis.png',
      'maven.svg',
      'jwt.svg',
      'mysql.svg',
      'mongodb.svg',
      'postgresql.svg',
      'redis.svg',
      'kafka.svg',
      'rabbitmq.svg',
    ],
  },
  {
    title: '运维部署与工具',
    icons: [
      'linux.svg',
      'docker.svg',
      'kubernetes.svg',
      'nginx.svg',
      'jenkins.svg',
      'apache.svg',
      'jmeter.svg',
      'ubuntu.svg',
      'vercel.svg',
      'cloudflare.svg',
      'git.svg',
      'github.svg',
      'gitea.svg',
      'pm2.svg',
      'supabase.svg',
    ],
  },
  {
    title: 'Tools',
    icons: [
      'visual-studio-code.svg',
      'sublimetext.svg',
      'trae.svg',
      'jetbrains-icon.svg',
      'intellij-idea.svg',
      'clion.svg',
      'datagrip.svg',
      'webstorm.svg',
      'pycharm.svg',
      'chrome.svg',
      'apifox.svg',
    ],
  },
  {
    title: 'AI',
    icons: [
      'claude.svg',
      'chatgpt.svg',
      'deepseek.svg',
      'langchain.svg',
      'langgraph.svg',
      'langsmith.svg',
      'dify.svg',
      'gemini.svg',
      'mcp.svg',
      'harness.svg',
      'xiaomi-mimo.svg',
      'qwen.svg',
      'nvidia.svg',
    ],
  },

  {
    title: '其他',
    icons: ['luogu.svg', 'atcoder.svg', 'leetcode.svg'],
  },
]

// 悬停提示和 alt 用的显示名。默认取文件名去掉后缀，只有下面这些有讲究的单独写
const NAME: Record<string, string> = {
  'javascript.svg': 'JavaScript',
  'typescript.svg': 'TypeScript',
  'html.svg': 'HTML',
  'css.svg': 'CSS',
  'css-3.svg': 'CSS3',
  'c-plusplus.svg': 'C++',
  'nextjs.svg': 'Next.js',
  'uniapp.png': 'uni-app',
  'vueuse.svg': 'VueUse',
  'd3.svg': 'D3.js',
  'threejs.svg': 'Three.js',
  'echarts.svg': 'ECharts',
  'element.svg': 'Element Plus',
  'ant-design.svg': 'Ant Design',
  'nutui.png': 'NutUI',
  'tailwind.svg': 'Tailwind CSS',
  'unocss.svg': 'UnoCSS',
  'esbuild.svg': 'esbuild',
  'eslint.svg': 'ESLint',
  'postcss.svg': 'PostCSS',
  'node.svg': 'Node.js',
  'npm.svg': 'npm',
  'pnpm.svg': 'pnpm',
  'nvm.svg': 'nvm',
  'jwt.svg': 'JWT',
  'mybatis.png': 'MyBatis',
  'springboot.svg': 'Spring Boot',
  'intellij-idea.svg': 'IntelliJ IDEA',
  'mongodb.svg': 'MongoDB',
  'mysql.svg': 'MySQL',
  'postgresql.svg': 'PostgreSQL',
  'rabbitmq.svg': 'RabbitMQ',
  'jmeter.svg': 'JMeter',
  'github.svg': 'GitHub',
  'visual-studio-code.svg': 'VS Code',
  'sublimetext.svg': 'Sublime Text',
  'mdn.svg': 'MDN',
}

const label = (file: string) =>
  NAME[file] ??
  file.replace(/\.(svg|png)$/, '').replace(/^./, (c) => c.toUpperCase())

// 这几个是纯黑单色图形，暗色主题下会糊进背景，反色处理。
// 带彩色的（mybatis 那只鸟、nutui 的橙红橡果、jwt 的四色字）不能反，会把配色翻掉
const invert = new Set([
  'express.svg',
  'github.svg',
  'vercel.svg',
  'nextjs.svg',
  'unocss.svg',
  'threejs.svg',
  'koa.svg',
  'markdown.svg',
  'kafka.svg',
])
</script>

<template>
  <section class="tech-stack">
    <div class="container">
      <h2 class="tech-stack__heading">技术栈</h2>

      <div v-for="group in groups" :key="group.title" class="group">
        <div class="group__title">{{ group.title }}</div>
        <ul class="group__icons">
          <li v-for="file in group.icons" :key="file">
            <img
              class="icon"
              :class="{ 'icon--invert': invert.has(file) }"
              :src="`/icons/${file}`"
              :alt="label(file)"
              :title="label(file)"
              width="44"
              height="44"
              loading="lazy"
              decoding="async"
              draggable="false"
            />
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 跟上面 VPFeatures 的容器约定保持一致，好让两块的左右边缘对齐 */
.tech-stack {
  padding: 0 24px;
  margin-top: 64px;
}

@media (min-width: 640px) {
  .tech-stack {
    padding: 0 48px;
  }
}

@media (min-width: 960px) {
  .tech-stack {
    padding: 0 64px;
  }
}

.container {
  margin: 0 auto;
  max-width: 1152px;
}

.tech-stack__heading {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
}

.group {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 14px 0;
  border-top: 1px solid var(--vp-c-divider);
}

.group__title {
  flex: none;
  width: 96px;
  padding-top: 13px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--vp-c-text-2);
}

.group__icons {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.icon {
  display: block;
  width: 44px;
  height: 44px;
  /* 各家 logo 画布比例不一样（pinia 是竖的菠萝），contain 保证只缩不放、不拉变形 */
  object-fit: contain;
  /* 稍微压一点，一屏几十个品牌色一起看太吵；悬停时提到全色 */
  opacity: 0.85;
  transition: opacity 0.2s ease;
}

.icon:hover {
  opacity: 1;
}

/* 纯黑 logo 在暗色主题下反色，不然就看不见了
   （不要写成 :global(.dark)，scoped 编译器会把它拆坏，只剩一个 .dark 选择器） */
.dark .icon--invert {
  filter: invert(1);
}

@media (max-width: 640px) {
  .group {
    display: block;
    padding: 12px 0;
  }

  .group__title {
    width: auto;
    padding-top: 0;
    margin-bottom: 10px;
  }

  .group__icons {
    gap: 12px;
  }

  .icon {
    width: 36px;
    height: 36px;
  }
}
</style>
