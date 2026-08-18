# virtual list

渲染10万条数据时，浏览器要创建10万个DOM节点，导致：

- 首次渲染卡顿
- 内存占用高
- 滚动卡顿

## 原理

只渲染当前可见区域的数据，滚动时动态替换

```text
┌─────────────────────┐
│  滚动容器            │
│  ┌─────────────────┐│
│  │ 可视区域         ││ ← 只渲染这部分
│  │  [Item 5]       ││
│  │  [Item 6]       ││
│  │  [Item 7]       ││
│  │  [Item 8]       ││
│  └─────────────────┘│
│  ↑ 占位元素          │ ← 撑开滚动空间
└─────────────────────┘
```

## 手写

计算总高度：总高度=数据总量 \* 每个项的高度
计算可见范围：根据`scrollTop`计算起始索引
渲染可见项：只渲染`[startIndex，endIndex]`范围内的数据
占位元素：撑开容器高度，保存滚动条正常

```vue
<template>
  <div ref="listRef" class="virtual-list" @scroll="handleScroll">
    <!-- 占位容器：撑开滚动空间 -->
    <div
      class="virtual-list-phantom"
      :style="{ height: totalHeight + 'px' }"
    ></div>

    <!-- 实际渲染的列表项 -->
    <div
      class="virtual-list-content"
      :style="{ transform: `translateY(${offsetY}px)` }"
    >
      <div
        v-for="item in visibleData"
        :key="item.id"
        class="list-item"
        :style="{ height: itemHeight + 'px' }"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// ===== 配置 =====
const itemHeight = 50 // 每个项的高度（px）
const bufferSize = 5 // 缓冲数量（上下多渲染几个，防止滚动白屏）

// ===== 数据 =====
const allData = ref([])

// 模拟 10 万条数据
for (let i = 0; i < 100000; i++) {
  allData.value.push({
    id: i,
    text: `Item ${i + 1}`
  })
}

// ===== 状态 =====
const listRef = ref(null)
const scrollTop = ref(0)
const totalHeight = computed(() => allData.value.length * itemHeight)

// ===== 计算可见数据 =====
const visibleData = computed(() => {
  const startIndex = Math.floor(scrollTop.value / itemHeight)
  const endIndex = startIndex + visibleCount.value + bufferSize * 2

  return allData.value.slice(
    Math.max(0, startIndex - bufferSize),
    Math.min(allData.value.length, endIndex)
  )
})

// ===== 计算偏移量 =====
const offsetY = computed(() => {
  const startIndex = Math.floor(scrollTop.value / itemHeight)
  return Math.max(0, startIndex - bufferSize) * itemHeight
})

// ===== 计算可见数量 =====
const visibleCount = ref(0)

const updateVisibleCount = () => {
  if (listRef.value) {
    const height = listRef.value.clientHeight
    visibleCount.value = Math.ceil(height / itemHeight) + 1
  }
}

// ===== 滚动事件 =====
const handleScroll = (event) => {
  scrollTop.value = event.target.scrollTop
}

// ===== 监听尺寸变化 =====
onMounted(() => {
  updateVisibleCount()
  window.addEventListener('resize', updateVisibleCount)
})
</script>

<style scoped>
.virtual-list {
  height: 600px;
  overflow-y: auto;
  position: relative;
  border: 1px solid #ddd;
}

.virtual-list-phantom {
  pointer-events: none;
}

.virtual-list-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
  box-sizing: border-box;
}

.list-item:hover {
  background: #f5f5f5;
}
</style>
```

## 第三方库

[vue-virtual-scroller](https://vue-virtual-scroller.netlify.app/)

基础使用

```vue
<template>
  <div style="height: 600px;">
    <RecycleScroller
      :items="items"
      :item-size="50"
      key-field="id"
      v-slot="{ item }"
    >
      <div class="list-item">
        {{ item.text }}
      </div>
    </RecycleScroller>
  </div>
</template>

<script setup>
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const items = []
for (let i = 0; i < 100000; i++) {
  items.push({ id: i, text: `Item ${i + 1}` })
}
</script>

<style scoped>
.list-item {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
}
</style>
```

动态高度使用

```vue
<template>
  <DynamicScroller
    :items="items"
    :min-item-size="50"
    key-field="id"
    class="scroller"
  >
    <template #default="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[item.desc]"
        :data-index="index"
      >
        <div class="list-item">
          <div>{{ item.text }}</div>
          <div style="font-size: 12px; color: #999;">{{ item.desc }}</div>
        </div>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>

<script setup>
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const items = []
for (let i = 0; i < 100000; i++) {
  items.push({
    id: i,
    text: `Item ${i + 1}`,
    desc: '描述'.repeat(Math.floor(Math.random() * 10) + 1)
  })
}
</script>
```
