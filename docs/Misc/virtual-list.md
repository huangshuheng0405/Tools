# 虚拟列表 (Virtual List)

虚拟列表（Virtual List），也叫“虚拟滚动”，是一种优化长列表性能的技术。

## 为什么需要虚拟列表？

当一个列表包含成千上万条数据时，如果直接渲染所有 DOM 节点，会产生以下问题：

1.  **DOM 节点过多**：导致浏览器内存占用过高。
2.  **渲染卡顿**：页面初次渲染和滚动时，由于需要计算和绘制大量节点，会导致掉帧或卡顿。

虚拟列表的核心思想是：**只渲染可视区域（Viewport）内的列表项**，非可视区域的数据不渲染或只渲染少量缓冲数据。

## 实现原理

![Virtual List Principle](https://user-images.githubusercontent.com/12554487/65506085-78363a00-dee4-11e9-906f-12c85b672776.png)
*(示意图)*

1.  **容器高度**：设置一个固定高度的容器，并允许纵向滚动。
2.  **总高度**：计算列表所有项的总高度，设置一个撑开内容的“占位层”，让滚动条能够正确反映列表长度。
3.  **可视区域**：监听容器的滚动事件 (`scroll`)。
4.  **计算渲染范围**：根据当前的滚动位置 (`scrollTop`)，计算出当前应该显示数据的起始索引 (`startIndex`) 和结束索引 (`endIndex`)。
5.  **偏移量**：通过 `transform: translateY` 将渲染的内容移动到对应的可视位置。

### 核心计算公式

假设每项高度固定为 `itemHeight`：

```javascript
// 列表总高度
const totalHeight = listData.length * itemHeight;

// 可视区域能显示的条数
const visibleCount = Math.ceil(containerHeight / itemHeight);

// 滚动触发时
const scrollTop = container.scrollTop;

// 起始索引
const startIndex = Math.floor(scrollTop / itemHeight);

// 结束索引 (多渲染几条作为缓冲)
const endIndex = startIndex + visibleCount + buffer;

// 当前渲染的数据
const visibleData = listData.slice(startIndex, endIndex);

// 内容偏移量 (为了让可视区内容一直处于可视范围内)
const offsetY = startIndex * itemHeight;
```

## 简易实现 (Vue 3)

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  itemHeight: { type: Number, default: 50 },
  containerHeight: { type: Number, default: 400 }
})

const scrollTop = ref(0)
const containerRef = ref(null)

// 总高度
const totalHeight = computed(() => props.items.length * props.itemHeight)

// 可视列表
const visibleItems = computed(() => {
  const start = Math.floor(scrollTop.value / props.itemHeight)
  const visibleCount = Math.ceil(props.containerHeight / props.itemHeight)
  const end = start + visibleCount + 2 // 缓冲2条
  
  return props.items.slice(start, end).map((item, index) => ({
    ...item,
    // 保持原来的索引，用于计算绝对定位
    originalIndex: start + index 
  }))
})

// 滚动偏移
const offsetY = computed(() => {
  const start = Math.floor(scrollTop.value / props.itemHeight)
  return start * props.itemHeight
})

const onScroll = (e) => {
  scrollTop.value = e.target.scrollTop
}
</script>

<template>
  <div 
    class="virtual-list-container" 
    ref="containerRef"
    @scroll="onScroll"
    :style="{ height: containerHeight + 'px' }"
  >
    <!-- 撑开高度的占位层 -->
    <div class="phantom" :style="{ height: totalHeight + 'px' }"></div>
    
    <!-- 实际渲染的内容列表 -->
    <div class="list-content" :style="{ transform: `translateY(${offsetY}px)` }">
      <div 
        v-for="item in visibleItems" 
        :key="item.id"
        class="list-item"
        :style="{ height: itemHeight + 'px', lineHeight: itemHeight + 'px' }"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.virtual-list-container {
  overflow-y: auto;
  position: relative;
  border: 1px solid #ccc;
}

.phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.list-content {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
}

.list-item {
  border-bottom: 1px solid #eee;
  padding: 0 10px;
  box-sizing: border-box;
}
</style>
```

## 常用库推荐

生产环境中，建议使用成熟的库，它们处理了不定高度、动态高度、横向滚动等复杂场景。

1.  **[vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)** (Vue)
    *   功能强大，支持定高、不定高。
2.  **[react-window](https://github.com/bvaughn/react-window)** (React)
    *   `react-virtualized` 的轻量级替代品，作者相同。
3.  **[TanStack Virtual](https://tanstack.com/virtual/latest)** (Framework Agnostic)
    *   支持 React, Vue, Svelte, Solid 等，无头 UI 库（Headless UI）。

## 总结

*   **场景**：长列表（1000+ 数据）。
*   **优点**：大幅减少 DOM 节点，提高渲染性能和内存利用率。
*   **缺点**：滚动过快可能出现白屏（渲染跟不上），搜索和页面内查找（Ctrl+F）功能失效（因为 DOM 不存在）。
