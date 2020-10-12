---
layout: post
title: "CSS background 的简写"
date: 2019-12-14 22:12:00 +0800
tags: 
---
    
# CSS background 的简写

CSS `background` 包含如下属性：

- `background-attachment`：控制背景是否跟随页面的滚动
- `background-clip`：背景生效的区域
- `background-color`：背景色，当背景图片为 png 或图片未铺满时可见
- `background-image`：	背景图片
- `background-origin`：	背景起始的位置，比如从 border，padding 还是元素内容区域开始
- `background-position`：背景位置
- `background-repeat`：	背景的重复规则
- `background-size`：背景尺寸


## 简写合并的形式/Shorthand properties

背景其实可以由多层组成，每一层依次包含如下内容：

```css
background: [background-image] [background-position] / [background-size] [background-repeat] [background-attachment] [background-origin] [background-clip] [background-color];
```

其中，

- `<bg-size>` 必需紧跟 `<position>` 后且以 `/` 分隔，开如 `center/80%`。
- `<background-color>` 只在最后一层中进行书写和使用。

比如如下包含全部 8 种属性的背景样式：

```css
body {
  background-image: url(photo.jpg);
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-origin: padding-box;
  background-clip: border-box;
  background-color: #ccc;
}
```

可简写成：

```css
body {
  background: url(photo.jpg) center center/cover no-repeat fixed padding-box border-box #ccc;
}
```

进一步，因为：

- `padding-box` 是 `background-origin` 的默认值
- `border-box` 是 `background-clip` 的默认值

上述背景可进一步简写成：

```css
body {
  background: url(photo.jpg) center center/cover no-repeat fixed #ccc;
}
```

TODO: 进一步阅读参考中第一个文章

## 相关资源

- [CSS Background Shorthand Property](https://www.webfx.com/blog/web-design/background-css-shorthand/)
- [MDN - background](https://developer.mozilla.org/en-US/docs/Web/CSS/background)
- [MDN - Shorthand properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties)

    