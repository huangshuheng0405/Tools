<script setup lang="ts">
// 包一层默认主题的 Layout，把技术栈塞到首页最底部（feature 卡片下面）
// markdown 里的 layout: home 没法传插槽，只能这样接
import DefaultTheme from 'vitepress/theme'
import TechStack from './components/TechStack.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #home-features-after>
      <TechStack />
    </template>
  </Layout>
</template>
