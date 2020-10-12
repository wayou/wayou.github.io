---
layout: post
title: "利用 CSS 的 `prefers-color-scheme` 适配 mac 黑色模式"
date: 2020-05-27 00:05:00 +0800
tags: 
---
    
# 利用 CSS 的 `prefers-color-scheme` 适配 mac 黑色模式

伴随 mac Mojave 发布的系统级别的黑色模式，已经存在很久了。CSS 随之推出了 [`prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) 的 media 选择器，使得网页能够适配黑色主题。

## 语法

```css
@media (prefers-color-scheme: <mode>) {
  /* your css goes here... */
}
```

其中 mode 有如下可能的取值：

- `no-preference`：类似于缺省
- `light`：亮色模式下命中
- `dark`：黑色模式下命中

## 示例

以下是来自 [MDN 的示例](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)：

```html
<style>
  .day {
    background: #eee;
    color: black;
  }
  .night {
    background: #333;
    color: white;
  }

  @media (prefers-color-scheme: dark) {
    .day.dark-scheme {
      background: #333;
      color: white;
    }
    .night.dark-scheme {
      background: black;
      color: #ddd;
    }
  }

  @media (prefers-color-scheme: light) {
    .day.light-scheme {
      background: white;
      color: #555;
    }
    .night.light-scheme {
      background: #eee;
      color: black;
    }
  }

  .day,
  .night {
    display: inline-block;
    padding: 1em;
    width: 7em;
    height: 2em;
    vertical-align: middle;
  }
</style>
<div class="day">Day (initial)</div>
<div class="day light-scheme">Day (changes in light scheme)</div>
<div class="day dark-scheme">Day (changes in dark scheme)</div>
<br />

<div class="night">Night (initial)</div>
<div class="night light-scheme">Night (changes in light scheme)</div>
<div class="night dark-scheme">Night (changes in dark scheme)</div>
```

实际运行效果：

![利用 prefers-color-scheme 适配黑色模式的运行效果](https://user-images.githubusercontent.com/3783096/82897171-cb65be00-9f89-11ea-8a2a-a0ebbd619faa.gif)
<p align="center">利用 prefers-color-scheme 适配黑色模式的运行效果</p>

## 相关资源

- [MDN - prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

    