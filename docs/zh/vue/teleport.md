# Teleport

`Teleport`是一个内置组件，它可以将一个组件内部的一部分模板传送到该组件的DOM结构外层的位置

## 基本用法

在实际开发，深层组件中写一个Modal弹窗，父容器设置了`overflow: hidden`或`z-index`层级冲突，导致弹窗不全或被遮住

如果不用 Teleport，你只能把弹窗放到 `App.vue` 根节点，然后通过繁琐的 EventBus 或 Pinia 状态来控制显隐。有了 Teleport，你可以直接在组件内部写逻辑，让 Vue 帮你把 DOM 挪出去。

```vue
<template>
  <!-- 点击按钮，在组件内部控制弹窗 -->
  <button @click="open = true">打开弹窗</button>

  <!-- Teleport：将弹窗传送到 body 标签下 -->
  <Teleport to="body">
    <div v-if="open" class="modal-overlay">
      <div class="modal-content">
        <p>我是被传送出去的弹窗！</p>
        <button @click="open = false">关闭</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<style scoped>
/* 这里的样式依然生效，且因为挂载到 body，不易被父级干扰 */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* 现在它脱离了父级层叠上下文，生效更可靠 */
}
</style>
```

`to`的值可以是一个**CSS选择器字符串**（如`"body"`、`"#app"`），也可以是一个**DOM元素对象**

::: danger

传送的目标元素（如 `body`）**必须在 `Teleport` 挂载时已经存在于 DOM 中**。如果目标是 Vue 动态渲染的元素，请确保它已渲染完成，或者配合 `disabled` 属性使用。

:::

## 禁用Teleport

可以动态传入一个`disable`prop来处理

```vue
<Teleport :disabled="isMobile">
  ...
</Teleport>
```

然后我们可以动态的更新`isMobile`

## 多个Teleport共享目标

一个可重用的 `<Modal>` 组件可能同时存在多个实例。对于此类场景，多个 `<Teleport>` 组件可以将其内容挂载在同一个目标元素上，而顺序就是简单的顺次追加，后挂载的将排在目标元素下更后面的位置上，但都在目标元素中。

```vue
<Teleport to="#modals">
  <div>A</div>
</Teleport>
<Teleport to="#modals">
  <div>B</div>
</Teleport>
```

渲染的结果为：

```vue
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

