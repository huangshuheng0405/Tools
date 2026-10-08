<script setup lang="ts">
// 独立「技术栈」页面：按类别静态铺开全部 logo
// 与首页底部的 TechStack.vue 共用同一套图标数据与分组逻辑
// 关键差异：这里每个 logo 都套一层浅灰描边卡片底，解决「白色 logo 融入白背景」的问题
const groups: { title: string; icons: string[] }[] = [
  {
    // 站内文章按篇数排：JavaScript 58、backend/java 31、react 38、vue 36、Engineering 21
    title: 'language',
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
      'promises.svg',
      'go.svg',
      'rust.svg',
    ],
  },
  {
    title: 'framework',
    icons: [
      'vue.svg',
      'react.svg',
      'angular.svg',
      'nuxt.svg',
      'nextjs.svg',
      'electron.svg',
      'uniapp.png',
      'redux.svg',
      'immer.svg',
      'pinia.svg',
      'vueuse.svg',
      'axios.svg',
      'lodash.svg',
      'd3.svg',
      'socket-io.svg',
      'flutter.svg',
      'nestjs.svg',
      'spring.svg',
      'springboot.svg',
      'express.svg',
      'koa.svg',
      'fastapi.svg',
      'mybatis.png',
      'sequelize.svg',
      'volar.svg',
      'docusaurus.svg',
      'gin.svg',
      'minio.svg',
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
      'figma.svg',
    ],
  },
  {
    title: 'Engineering',
    icons: [
      'turborepo.svg',
      'tailwind.svg',
      'windicss.svg',
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
      'jest.svg',
      'deno.svg',
    ],
  },
  {
    title: 'end',
    icons: [
      'node.svg',
      'maven.svg',
      'jwt.svg',
      'kafka.svg',
      'rabbitmq.svg',
      'zookeeper.svg',
      'elasticsearch.svg',
    ],
  },
  {
    title: 'devtools',
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
      'railway.svg',
      'playwright.svg',
      'gitlab.svg',
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
      'apifox.svg',
      'obs.svg',
      'obsidian.svg',
      'typora.svg',
      'vmware.svg',
    ],
  },
  {
    title: 'AI',
    icons: [
      'claude.svg',
      'claude-code.svg',
      'codex.svg',
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
      'cursor.svg',
      'nvidia.svg',
      'copilot.svg',
      'ollama.svg',
      'minimax.svg',
      'manus.svg',
      'grok.svg',
      'bytedance.svg',
      'antigravity.svg',
    ],
  },
  {
    title: 'browser',
    icons: [
      'chrome.svg',
      'firefox.svg',
      'edge.svg',
      'safari.svg',
      'chromium.svg',
      'bing.svg',
    ],
  },
  {
    title: 'complier',
    icons: [
      'babel.svg',
      'esbuild.svg',
      'swc.svg',
      'rollup.svg',
      'webpack.svg',
      'turbopack.svg',
      'rspack.svg',
      'rsbuild.svg',
      'postcss.svg',
      'rolldown.svg',
      'oxc.svg',
      'vite.svg',

      'webassembly.svg',
    ],
  },
  {
    title: 'database',
    icons: [
      'redis.svg',
      'mysql.svg',
      'mongodb.svg',
      'postgresql.svg',
      'sqlite.svg',
      'prisma.svg',
    ],
  },
  {
    title: '其他',

    icons: [
      'luogu.svg',
      'atcoder.svg',
      'leetcode.svg',
      'mdn.svg',
      'duolingo.svg',
      'codeforces.svg',
      'rog.svg',
      'steam.svg',
      'bilibili.svg',
    ],
  },
  {
    title: 'Phone',
    icons: [
      'vivo.svg',
      'huawei.svg',
      'oneplus.svg',
      'xiaomi.svg',
      'oppo.svg',
      'samsung.svg',
      'apple.svg',
    ],
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

// 纯黑单色图形，暗色主题下会糊进背景，反色处理。
// 带彩色的不能反，会把配色翻掉
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
  <section class="tech-stack-page">
    <div class="container">
      <h1 class="tech-stack-page__title">Logo</h1>

      <div v-for="group in groups" :key="group.title" class="group">
        <div class="group__title">{{ group.title }}</div>
        <ul class="group__icons">
          <li v-for="file in group.icons" :key="file" class="icon-wrap">
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
            <span class="icon__name">{{ label(file) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tech-stack-page {
  padding: 24px 24px 48px;
}

@media (min-width: 640px) {
  .tech-stack-page {
    padding: 32px 48px 64px;
  }
}

@media (min-width: 960px) {
  .tech-stack-page {
    padding: 40px 64px 80px;
  }
}

.container {
  margin: 0 auto;
  max-width: 1152px;
}

.tech-stack-page__title {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}

.tech-stack-page__desc {
  margin: 0 0 24px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.group {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 18px 0;
  border-top: 1px solid var(--vp-c-divider);
}

.group__title {
  flex: none;
  width: 96px;
  padding-top: 15px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--vp-c-text-2);
}

.group__icons {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.icon-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.icon {
  display: block;
  width: 48px;
  height: 48px;
  padding: 8px;
  /* 关键：每个 logo 都套一层浅灰描边卡片底，白色 logo 在浅色主题下也有衬底 */
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  box-sizing: border-box;
  /* 各家 logo 画布比例不一样，contain 保证只缩不放、不拉变形 */
  object-fit: contain;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
  opacity: 0.9;
}

.icon:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--vp-c-divider);
  opacity: 1;
}

/* 纯黑 logo 在暗色主题下反色，不然就看不见了
   （不要写成 :global(.dark)，scoped 编译器会把它拆坏，只剩一个 .dark 选择器） */
.dark .icon--invert {
  filter: invert(1);
}

.icon__name {
  max-width: 72px;
  font-size: 11px;
  line-height: 1.3;
  text-align: center;
  color: var(--vp-c-text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .group {
    display: block;
    padding: 14px 0;
  }

  .group__title {
    width: auto;
    padding-top: 0;
    margin-bottom: 12px;
  }

  .group__icons {
    gap: 12px;
  }

  .icon {
    width: 44px;
    height: 44px;
    padding: 7px;
  }

  .icon__name {
    max-width: 56px;
    font-size: 10px;
  }
}
</style>
