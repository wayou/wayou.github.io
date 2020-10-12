---
layout: post
title: "CSS 利用 `padding-bottom` 实现固定比例的容器"
date: 2019-07-08 23:07:00 +0800
tags: 
---
    
# CSS 利用 `padding-bottom` 实现固定比例的容器

复用 `padding-bottom` 可实现一块区域在窗口尺寸变化使始终保持自适应。对于响应式布局中的图片或视频来说比较有用。

```html
<div style="width: 100%; position: relative; padding-bottom: 56.25%;">
    <div style="position: absolute; left: 0; top: 0; right: 0; bottom: 0;background-color:yellow;">
        this content will have a constant aspect ratio that varies based on the width.
    </div>
</div>
```

![16:9 容器的效果](https://user-images.githubusercontent.com/3783096/60386863-83b28a00-9acd-11e9-98e1-d31a1b08948a.gif)
<p align="center">16:9 容器的效果</p>

其中 `padding-bottom` 的值与对应所形成容器的比例关系为容器宽除以高。

> The percentage is calculated with respect to the width of the generated box's containing block 
>
> _-- 来自 [w3.org](https://www.w3.org/TR/2011/REC-CSS2-20110607/box.html#padding-properties) 的描述_


以下是常用比例与对应的百分比值：

```sh
aspect ratio  | padding-bottom value
--------------|----------------------
    16:9      |       56.25%
    4:3       |       75%
    3:2       |       66.66%
    8:5       |       62.5%
```


## 相关资源

- [Maintain the aspect ratio of a div with CSS](https://stackoverflow.com/questions/1495407/maintain-the-aspect-ratio-of-a-div-with-css)
    