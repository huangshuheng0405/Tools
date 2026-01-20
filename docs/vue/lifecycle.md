# Vue 生命周期

Vue 实例从创建到销毁的过程，就是生命周期。

## 生命周期图示

![Lifecycle Diagram](https://cn.vuejs.org/assets/lifecycle_zh-CN.W0MNXI0C.png)

## 主要钩子函数

### 创建阶段 (Creation)

在组件被创建时执行。

- **beforeCreate**: 实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。
- **created**: 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，`$el` 属性目前不可见。

### 挂载阶段 (Mounting)

在组件被挂载到 DOM 时执行。

- **beforeMount**: 在挂载开始之前被调用：相关的 `render` 函数首次被调用。
- **mounted**: 实例被挂载后调用，这时 `el` 被新创建的 `vm.$el` 替换了。如果根实例挂载到了一个文档内的元素上，当 `mounted` 被调用时 `vm.$el` 也在文档内。

### 更新阶段 (Updating)

当响应式数据更新时执行。

- **beforeUpdate**: 数据更新时调用（视图更新之前），发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。
- **updated**: 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。

### 销毁阶段 (Destruction) - Vue 2

在组件被销毁时执行。

- **beforeDestroy**: 实例销毁之前调用。在这一步，实例仍然完全可用。
- **destroyed**: 实例销毁后调用。该钩子被调用后，对应 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁。

### 卸载阶段 (Unmounting) - Vue 3

Vue 3 使用 `unmount` 代替了 `destroy`。

- **beforeUnmount**: 组件卸载之前调用。
- **unmounted**: 组件卸载之后调用。

## 组合式 API (Composition API) 中的生命周期

在 `setup()` 中使用生命周期钩子时，需要添加 `on` 前缀：

| 选项式 API    | 组合式 API      |
| ------------- | --------------- |
| beforeCreate  | Not needed\*    |
| created       | Not needed\*    |
| beforeMount   | onBeforeMount   |
| mounted       | onMounted       |
| beforeUpdate  | onBeforeUpdate  |
| updated       | onUpdated       |
| beforeUnmount | onBeforeUnmount |
| unmounted     | onUnmounted     |

\*注意：`setup()` 自身就是在 `beforeCreate` 和 `created` 之间执行的，所以不需要显式调用这两个钩子。

```vue
<script setup>
import { onMounted, onUpdated, onUnmounted } from "vue";

onMounted(() => {
  console.log("组件已挂载");
});

onUpdated(() => {
  console.log("组件已更新");
});

onUnmounted(() => {
  console.log("组件已卸载");
});
</script>
```
