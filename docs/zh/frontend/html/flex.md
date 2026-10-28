# flex

flex布局主要用于处理一行或一列内元素的排列、对齐、伸缩和分配空间。适合导航栏、居中、卡片列表、表单行、自适应布局等

## 基本概念

给父元素设置

```css
.container {
	display: flex;
}
```

父元素叫flex容器，子元素叫flex项目

flex布局有两个轴

- 主轴：默认水平向右
- 交叉轴：默认垂直向下

通过`flex-direction`可以改变主轴方向

```css
flex-direction: row;            /* 水平，左到右 */
flex-direction: row-reverse;    /* 水平，右到左 */
flex-direction: column;         /* 垂直，上到下 */
flex-direction: column-reverse; /* 垂直，下到上 */
```

### flex-wrap

是否换行。默认不换行，项目会被压缩

```css
.container {
  flex-wrap: nowrap;       /* 默认，不换行 */
  flex-wrap: wrap;         /* 换行 */
  flex-wrap: wrap-reverse; /* 反向换行 */
}
```

### justify-content

主轴对齐方式。控制项目在主轴上的排列

```css
.container {
  justify-content: flex-start;    /* 默认，起点对齐 */
  justify-content: flex-end;      /* 终点对齐 */
  justify-content: center;        /* 居中 */
  justify-content: space-between; /* 两端对齐，中间均分 */
  justify-content: space-around;  /* 每个项目两侧间距相等 */
  justify-content: space-evenly;  /* 所有间距完全相等 */
}
```

图示理解

```
flex-start:    [1][2][3]------
flex-end:      ------ [1][2][3]
center:        ---[1][2][3]---
space-between: [1]---[2]---[3]
space-around:  -[1]--[2]--[3]-
space-evenly:  --[1]--[2]--[3]--
```

### align-items

交叉轴对齐方式。控制单行项目在交叉轴上的对齐

```css
.container {
  align-items: stretch;    /* 默认，拉伸填满 */
  align-items: flex-start; /* 交叉轴起点对齐 */
  align-items: flex-end;   /* 交叉轴终点对齐 */
  align-items: center;     /* 交叉轴居中 */
  align-items: baseline;   /* 基线对齐 */
}
```

### gap

推荐用`gap`控制项目间距，比给项目加`margin`清晰

```css
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 20px; /* 行间距 列间距 */
}
```

### flex-grow

容器有剩余空间，项目如何放大

```css
.item {
  flex-grow: 1;
}
```

如果所有项目都是`flex-grow: 1`，则均分剩余空间

### flex-shrink

收缩比例。空间不足时，项目如何收缩，默认：1

```css
.item {
	flex-shrink: 1;
}
```

不想被压缩：`flex-shrink: 0`

### flex-basic

基础尺寸。项目在主轴方向上的初始大小

```css
.item {
  flex-basis: 200px;
}
```

也可以用百分比`flex-basic: 30%;`

### flex

简写。`flex: 1;`等价于：

```css
flex-grow: 1;
flex-shrink: 1;
flex-basis: 0%;
```

常见写法

```css
flex: 1;        /* 平分剩余空间，且基础为 0，常用于自适应列 */
flex: auto;     /* 1 1 auto */
flex: none;     /* 0 0 auto，不放大不收缩 */
flex: 0 0 200px;/* 固定 200px，不放大不收缩 */
```

### margin-left: auto

在flex中，`margin-left: auto`会自动吸附剩余空间，把某个项目推到右边，常用于局部对齐

## 子元素不收缩

flex项目默认`min-width: auto`，内容太长可能撑开，不按预期收缩，解决：

```css
.item {
  min-width: 0;
}
```

文本溢出省略也要处理：

```css
.item {
  min-width: 0;
}

.text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

## 多行对齐

多行对齐用`align-content`，只有`flex-wrap: wrap`且发生换行时，`align-content`控制多行整体分布
