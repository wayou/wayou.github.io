---
layout: post
title: "CSS `ellipsis` 与 `padding` 结合时的问题"
date: 2019-10-15 23:10:00 +0800
tags: 
---
    
# CSS `ellipsis` 与 `padding` 结合时的问题

## CSS 实现的文本截断

考察如下代码实现文本超出自动截断的样式代码：

```css
.truncate-text-4 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
```

使用如下的 HTML 片段进行测试：

```html
<style>
  .my-div {
    width: 300px;
    margin: 10px auto;
    background: #ddd;
  }
</style>
<div class="my-div truncate-text-4">
  How Not To Shuffle - The Knuth Fisher-Yates Algorithm. Written by Mike James.
  Thursday, 16 February 2017. Sometimes simple algorithms are just wrong. In
  this case shuffling an .... In other words as the array is scanned the element
  under
</div>
```

运行效果：

![通过 CSS `ellipsis` 实现的文本截断效果](https://user-images.githubusercontent.com/3783096/66835691-92488280-ef92-11e9-8ab9-68f27863f119.png)
<p align="center">通过 CSS <code>ellipsis</code> 实现的文本截断效果</p>

## `padding` 的问题

一切都很完美，直到给文本容器加上 `padding` 样式后。

```diff
  .my-div {
    width: 300px;
    margin: 10px auto;
    background: #ddd;
+    padding: 30px;
  }
```

现在的效果是这样的：

![`padding` 破坏了文本截断](https://user-images.githubusercontent.com/3783096/66835765-af7d5100-ef92-11e9-96ff-78ab6778e06a.png)
<p align="center"><code>padding</code> 破坏了文本截断</p>

因为 `padding` 占了元素内部空间，但这部分区域却是在元素内部的，所以不会受 `overflow: hidden` 影响。

## 解决办法

### `line-height`

当设置的 `line-height` 适当时，或足够大时，可以将 `padding` 的部分抵消掉以实现将多余部分挤出可见范围的目标。

```diff
.my-div {
  width: 300px;
  margin: 10px auto;
  background: #ddd;
  padding: 30px;
+  line-height: 75px;
}
```

![通过 `line-height` 修复](https://user-images.githubusercontent.com/3783096/66835792-bc01a980-ef92-11e9-8855-d9c0aef47619.png)
<p align="center">通过 <code>line-height</code> 修复</p>

这种方式并不适用所有场景，因为不是所有地方都需要那么大的行高。

## 替换掉 padding

`padding` 无非是要给元素的内容与边框间添加间隔，或是与别的元素间添加间隔。这里可以考虑其实方式来替换。

比如 `margin`。但如果元素有背景，比如本例中，那 `margin` 的试就不适用了，因为元素 `margin` 部分是不带背景的。

还可用 `border` 代替。

```diff
.my-div {
  width: 300px;
  margin: 10px auto;
  background: #ddd;
-  padding: 30px;
+  border: 30px solid transparent;
}
```

![使用 `border` 替换 `padding`](https://user-images.githubusercontent.com/3783096/66835839-ccb21f80-ef92-11e9-862e-6826c99aadb8.png)
<p align="center">使用 <code>border</code> 替换 <code>padding</code></p>

毫不意外，它仍然有它的局限性。就是在元素本身有自己的 `border` 样式要求的时候，就会冲突了。

## 将边距与内容容器分开

比较普适的方法可能就是它了，即将内容与边距分开到两个元素上，一个元素专门用来实现边距，一个元素用来实现文本的截断。这个好理解，直接看代码：

```html
<div className="my-div">
  <div className="truncate-text-4">
    How Not To Shuffle - The Knuth Fisher-Yates Algorithm. Written by Mike
    James. Thursday, 16 February 2017. Sometimes simple algorithms are just
    wrong. In this case shuffling an .... In other words as the array is scanned
    the element under
  </div>
</div>
```

而我们的样式可以保持不动。

![将边距与内容容器分开](https://user-images.githubusercontent.com/3783096/66835866-dc316880-ef92-11e9-93f9-fe832fb3b4c0.png)
<p align="center">将边距与内容容器分开</p>


## 相关资源

- [overflow:hidden ignoring bottom padding](https://stackoverflow.com/questions/8981811/overflowhidden-ignoring-bottom-padding/14360994)
- [How can I force overflow: hidden to not use up my padding-right space](https://stackoverflow.com/questions/1071927/how-can-i-force-overflow-hidden-to-not-use-up-my-padding-right-space)

    