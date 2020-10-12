---
layout: post
title: "transform 缩放后的滚动问题"
date: 2019-01-29 21:01:00 +0800
tags: 
---
    
transform 缩放后的滚动问题
===

### 问题

考察下面的问题：

一个固定大小的容器中放置了另一个元素，现在想对该元素进行缩放处理，放大后可在容器范围内滚动显示。

很自然地，通过 `transform: scale` 可实现缩放。于是得到如下的示例代码。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>scroll with scaled element</title>
    <style>
      .container {
        width: 200px;
        height: 150px;
        background: grey;
        border: 1px solid brown;
        overflow: scroll;
      }
      #target {
        height: 100px;
        background: linear-gradient(45deg, red, blue);
        transform-origin: 0 0;
      }
    </style>
  </head>
  <body>
      <div class="container"><img id="target" src="./lenna.png"/></div>
      <button onclick="zoomin()">zoom in</button>
      <button onclick="zoomout()">zoom out</button>
    <script>
      var scale = 1;
      var delta = 0.5;
      function zoomin() {
        scale += delta;
        target.style.transform = "scale(" + scale + ")";
      }
      function zoomout() {
        scale -= delta;
        scale = scale < 0 ? 0.1 : scale;
        target.style.transform = "scale(" + scale + ")";
      }
    </script>
  </body>
</html>
```

[点击查看示例](https://wayou.github.io/posts/css-scale-scroll-problem/src/index.html)

*NOTE: Chrome (as of canaray 74.0.3684.0)，内部元素放大后并不能立即触发容器滚动。实际上在内部元素缩放过程中，容器并没有重新渲染导致滚动条没有即时出现。此时如果有其他任意 DOM 操作触发页面渲染，可修正该问题，比如缩放一下窗口。其他浏览器诸如 Safari，Firefox 没有这个问题。针对该问题已经提了个 [bug](https://bugs.chromium.org/p/chromium/issues/detail?id=926167) 给 Chromium。*

![chrome scroll problem](https://wayou.github.io/posts/css-scale-scroll-problem/src/chrome_scroll_problem.gif)
_chrome 中缩放元素后容器不能即时滚动问题的展示_

So far so good. 注意因为 `transform-origin` 默认值是 `50% 50%`，即默认从元素中间开始。上面示例中，我们故意设置了 `transform-origin: 0 0` 使其从左上角开始缩放。问题出现在当我们想从中间开始缩放的时候。

现在我们去掉 `transform-origin: 0 0 ` 或者将其改成 `transform-origin: 50% 50% ` 。

此时会发现，放大后的元素虽然可以通过滚动来查看超出的部分，但左边和上面始终会有一部分是无法查看的。


![partial view problem](https://wayou.github.io/posts/css-scale-scroll-problem/src/partial_view_problem.gif)
_缩放后的元素无法通过滚动查看全部内容问题的展示_


### 解决

#### 手动修正宽高

既然无法滚动，说明缩放后实际所占的空间不够。此时可以通过对元素设置一下宽高来解决。有了真实所占的宽高，可滚动的区域自然就完整了。

实际测试后发现，虽然手动设置宽高后可改变滚动条可滚动的区域，但元素仍然无法完整查看，通过滚动，我们看到的仍是元素的部分。

#### zoom

这里 `zoom` 可以很好地解决这个问题。只需要将 `transform:scale(value)` 换成 `zoom: value` 即可。

与 `transform` 相比，因为 `zoom` 不是浏览器标准中的，所以兼容性及支持情况没那么有保证。但查阅 caniuse 后会发现，除 Firefox 不支持外，其他浏览器对其的支持还是可以的。

它的具体表现是，在尺寸超出容器前，从中间开始缩放，超出后，从左上角开始缩放。


### 其他资源
- [Zoom Vs. Scale in CSS3](https://stackoverflow.com/questions/26488960/zoom-vs-scale-in-css3)

    