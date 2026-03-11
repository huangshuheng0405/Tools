# 路由跳转

两种方式

- router-link 组件
- 拿到实例，进行跳转

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goAbout = () => {
  // 压栈跳转
  router.push('/about')
  // 路由栈替换
  //   router.replace('/about')
}
</script>

<template>
  <div>
    home
    <router-link to="/about">about</router-link>
    <button @click="goAbout">go about</button>
  </div>
</template>

<style scoped></style>
```
