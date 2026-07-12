# Pinia

## 安装

用你喜欢的包管理器安装`pinia`

```bash [npm]
npm i pinia
```

创建一个`pinia`实例，并将其传递给应用

```ts [main.ts] {2,5,6,8}
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```
