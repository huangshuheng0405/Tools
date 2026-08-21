# 修饰符

## .lazy

在默认情况下, `v-model` 会在每次 `input` 事件触发后更新数据, 你可以添加 `.lazy` 修饰符, 从而在每次 `change` 事件触发后更新数据

```html
<input v-model.lazy="msg" type="text" />
```

## .number

在默认情况下, `v-model` 会将用户输入的值作为字符串处理, 你可以添加 `.number` 修饰符, 从而将用户输入的值转换为数字

```html
<input v-model.number="age" type="number" />
```

## .trim

自动过滤用户输入的首位空格,可以给`v-model`添加`.trim`修饰符

```html
<input v-model.trim="msg" type="text" />
```

## .stop

阻止单击事件继续传播,即停止事件的冒泡

```vue
<script setup>
const divClick = () => {
  console.log('divClick') // 不会触发
}

const aclick = () => {
  console.log('a click')
}
</script>

<template>
  <div @click="divClick"><a @click.stop="aclick">click me</a></div>
</template>
```

## .prevent

阻止默认事件, 例如: 点击链接时, 阻止跳转到新页面

```js
<div @click="divClick"><a href="" @click.prevent="aclick">click me</a></div>
```

## .capture

事件先在有`.capture`修饰符的元素上触发, 然后才会在子元素上触发

```html
<!-- 先执行divClick 再执行aClick -->
<div @click.capture="divClick"><a @click="aclick">click me</a></div>
```

## .self

只有在event.target是当前元素时触发处理函数,即事件不是从内部元素触发的

```html
<!-- 在a标签点击时,只会触发aClick事件 只有点击phrase的时候才会触发divClick事件 -->
<div @click.self="divClick"><a @click="aclick">click me</a></div>
```

## .once

只触发一次处理函数, 后续事件不会触发

```html
<!-- 只触发一次divClick事件 -->
<div @click.once="divClick"><a @click="aclick">click me</a></div>
```

## .passive
