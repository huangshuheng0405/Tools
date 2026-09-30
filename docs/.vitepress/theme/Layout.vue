<script setup lang="ts">
// 包一层默认主题的 Layout。技术栈已迁移到独立页面 /zh/tech-stack，
// 首页底部不再渲染 TechStack 区块。
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout />
</template>
