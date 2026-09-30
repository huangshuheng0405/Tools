# CSS

## flex 布局

`display: flex` 让一个容器变成弹性容器，它的直接子元素会自动成为「弹性项目」，沿主轴排列。主轴方向由 `flex-direction` 决定，默认是水平方向（从左到右）。

```css
.container {
  display: flex;
  /* 主轴方向，默认 row */
  flex-direction: row;
}
```

### 容器上的常用属性

**`justify-content`** —— 控制子元素在**主轴**上的对齐方式：

| 值 | 效果 |
| --- | --- |
| `flex-start` | 默认，靠主轴起点排列 |
| `flex-end` | 靠主轴终点排列 |
| `center` | 居中 |
| `space-between` | 两端对齐，中间等分 |
| `space-around` | 每个子项两侧留相等的空间 |
| `space-evenly` | 所有间隙完全相等 |

**`align-items`** —— 控制子元素在**交叉轴**（垂直于主轴）上的对齐方式：

| 值 | 效果 |
| --- | --- |
| `stretch` | 默认，拉伸填满交叉轴 |
| `flex-start` | 靠交叉轴起点 |
| `flex-end` | 靠交叉轴终点 |
| `center` | 垂直居中 |

> 最常见的「水平垂直居中」套路就是 `justify-content: center` + `align-items: center`。

**`flex-wrap`** —— 子元素超出容器时是否换行：

- `nowrap`：默认，不换行（子元素会被压缩）
- `wrap`：换行

**`gap`** —— 子元素之间的间距，比用 `margin` 更简洁：

```css
.container {
  display: flex;
  gap: 12px; /* 所有子元素之间统一间距 */
}
```

### 子元素上的常用属性

**`flex-grow`** —— 有剩余空间时，子元素按比例瓜分：

```css
.item {
  flex-grow: 1; /* 有剩余空间就平均瓜分 */
}
```

- `flex-grow: 0`：默认，不瓜分
- 两个子元素分别设 `flex-grow: 1` 和 `flex-grow: 2`，剩余空间按 1:2 分配

**`flex: 1`** —— 常用简写，等价于 `flex: 1 1 0%`（即 `flex-grow: 1; flex-shrink: 1; flex-basis: 0%`），让子元素等分剩余空间：

```css
.item {
  flex: 1; /* 等分父容器 */
}
```

### 一个经典例子

```html
<div class="nav">
  <span class="logo">Logo</span>
  <nav class="menu">
    <a href="#">首页</a>
    <a href="#">关于</a>
    <a href="#">联系</a>
  </nav>
</div>
```

```css
.nav {
  display: flex;
  justify-content: space-between; /* logo 靠左，菜单靠右 */
  align-items: center; /* 垂直居中 */
  gap: 16px;
}
.menu {
  display: flex;
  gap: 12px;
}
```

> 更进阶的坑（子元素默认 `min-width: auto` 导致文字不省略、`flex-shrink` 收缩规则）见下方两节。

## min-width

在flexBox中，默认情况下，子元素（flexitem）的`min-width`属性值并不是0，而是`auto`

`min-width:auto`的含义：’

比如

```html
<div class="flex w-200px">
  <!-- 父容器：flex，固定宽200px -->
  <div class="flex-shrink-0">批次号：</div>
  <!-- 左侧：不收缩 -->
  <div class="overflow-hidden whitespace-nowrap text-ellipsis">
    <!-- 右侧：要显示省略号 -->
    {{ productInfo.batchNo }}
    <!-- 假设这串字符超长，如 "ABC123456789..." -->
  </div>
</div>
```

按理说：右侧元素设置了`overflow:hidden`和`text-overflow:ellipsis`，所以应该显示省略号。

但实际情况：因为右侧元素作为flex子项，默认`min-width:auto`，所以浏览器会死死抱住那串长字符（`ABC123...`），不让它被截断，为了满足不被截断的要求，只能把父容器撑破，或者把
左侧的“批次号“挤出换行

当你给右侧元素加上`min-width:0`时，就覆盖了浏览器的默认保护机制。

不管这个元素内容本身有多长，我允许你收缩到宽度为0，只要父容器需要你收缩

有了这个属性，`overflow:hidden`才能正常生效

## flex-shrink

当父容器空间不够时，`flex-shrink`决定子元素是否要缩水，以及缩多少

- `flex-shrink:0`：不收缩，宁可撑破父容器，也保持自己原始的宽度
- `flex-shrink:1`：默认值，自动收缩，根据父容器空间不足的比例，大家一起**平均分摊**缺少的空间，一起变窄
- `flex-shrink:2`：收缩，根据父容器空间不足的比例，收缩自己，但是收缩的量是2倍
