---
layout: post
title: "Intersection Observer API"
date: 2019-11-30 22:11:00 +0800
tags: 
---
    
# Intersection Observer API

随着 Web 应用的丰富和成熟，检测元素是否可见的需求增多。之前一般是通过三方库来实现，各自有各自的实现方式，性能也有差异。[Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) 便是这种功能的一个原生支持。


## 适用场景

- 页面滚动过程中的懒加载。
- 长页面无限内容加载。
- 页面中广告查看量的计算。
- 以及其他需要用户可见才进行的操作，动画等。

## 用法及参数

### 初始化监视器

```js
let options = {
  root: document.querySelector('#scrollArea'),
  rootMargin: '0px',
  threshold: 1.0
}

let observer = new IntersectionObserver(callback, options);
```

使用该 API，有两个角色会参与进来，
- **容器（root or root element）**：缺省或传递 `null` 时为文档视窗 viewport，否则是指定的元素。 
- **目标元素（target）**：需要监视（observe）的目标元素。

API 会在目标元素可见，即出现在容器中时执行指定的回调。

但回调也不是都执行，它受参数 `threshold` 的控制。

所以还需要理解一个概念，**Intersection Ratio**，可理解成目标元素的身体出现在容器中多少时，才触发回调，进一步理解请看下图：

![Intersection Ratio 示例](https://user-images.githubusercontent.com/3783096/69900141-f2608000-13aa-11ea-8ab5-27508bf08417.png)
<p align="center">Intersection Ratio 示例 -- <i>图片来自 Arnelle Balane
的文章 <a href="https://blog.arnellebalane.com/the-intersection-observer-api-d441be0b088d">The Intersection Observer API
</a></i></p>

上面 `threshold` 就是指定 Intersection Ratio 的。它是一个介于 0~1 的小数，默认为 0 ，即一旦可见就执行，1 则表示元素全部可见才执行。

除了将 `threshold` 指定为数字，还可指定为一个数字的数组，比如 `[0, 0.25, 0.5, 0.75, 1]`，这样在元素出现过程中，其可见范围分别为 0, 25%，50%，75%, 100% 时都会触发一次回调。

而 `rootMargin` 则用于指定容器的边距，接收的值和 CSS margin 一样。这个边距会在计算目标可见范围时被考虑进去，即在容器原有的内容范围内，减去 margin 的这部分。

### 执行监视

利用构造器 `IntersectionObserver` 创建好一个监视器后，便可以对容器内的元素进行监视了。

```js
let target = document.querySelector('#listItem');
observer.observe(target);
```

### 回调

回调的结构如下：

```js
let callback = (entries, observer) => { 
  entries.forEach(entry => {
    // Each entry describes an intersection change for one observed
    // target element:
    //   entry.boundingClientRect
    //   entry.intersectionRatio
    //   entry.intersectionRect
    //   entry.isIntersecting
    //   entry.rootBounds
    //   entry.target
    //   entry.time
  });
};
```

回调的入参为一个 [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) 数组，同时还有监视器本身 `observer`。

**注意**：虽然监测器的监听是异步的，但回调的执行是在主线程，所以回调中不宜进行耗时任务，如果确实需要应该使用 [`Window.requestIdleCallback()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) 来执行。

## 一个完整的示例

实现一个页面无限滚动及图片懒加载。完整代码可在 [wayou/intersection-observer-api](https://github.com/wayou/intersection-observer-api) 查看。

<details>
<summary>
App.tsx
</summary>

```js
import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const IMAGE_API = "https://picsum.photos/200";
const PAGE_SIZE = 10;
const IMAGES_PAGED = new Array(PAGE_SIZE).fill(IMAGE_API);

let loaderObserver: IntersectionObserver;
let lazyLoadObserver: IntersectionObserver;
let options = {
  rootMargin: "0px",
  threshold: 0
};
let page = 0;

const App = () => {
  const [images, setImages] = useState<string[]>(IMAGES_PAGED);

  const infiniteCallback = useCallback<IntersectionObserverCallback>(
    (_entries, _observer) => {
      console.info(`loading page ${++page}`);
      setImages(prev => [...prev, ...IMAGES_PAGED]);
    },
    []
  );

  const lazyLoadCallback = useCallback<IntersectionObserverCallback>(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // stop observer and load the image
          const lazyImage = entry.target as HTMLImageElement;
          console.log("lazy loading ", lazyImage);
          lazyImage.classList.remove("empty");
          lazyImage.src = lazyImage.dataset.src!;
          observer.unobserve(entry.target);
        }
      });
    },
    []
  );

  //setup  infinite loading
  useEffect(() => {
    if (!loaderObserver) {
      loaderObserver = new IntersectionObserver(infiniteCallback, options);
    }
    const target = document.querySelector("footer");
    if (target) {
      loaderObserver.observe(target);
    }
    return () => {
      if (target) {
        loaderObserver.unobserve(target);
      }
    };
  }, [infiniteCallback]);

  // setup lazy loading
  useEffect(() => {
    if (!lazyLoadObserver) {
      lazyLoadObserver = new IntersectionObserver(lazyLoadCallback, options);
    }
    const imgs = document.querySelectorAll("img.empty");
    if (imgs) {
      imgs.forEach(img => {
        console.count("setup img observer");
        lazyLoadObserver.observe(img);
      });
    }
    return () => {
      if (imgs) {
        imgs.forEach(img => {
          lazyLoadObserver.unobserve(img);
        });
      }
    };
  }, [lazyLoadCallback, images]);

  return (
    <div className="App">
      <div className="content-wrap">
        {images.map((image, index) => (
          <img className="empty" key={index} data-src={image + `?f=${index}`} />
        ))}
      </div>
      <footer>loading more ....</footer>
    </div>
  );
};

export default App;

```

</details>


运行效果：

<p align="center">
<img align="center" alt="利用 Intersection Observer API 实现的无限图片懒加载运行效果" src="https://user-images.githubusercontent.com/3783096/69900832-496a5300-13b3-11ea-9a27-101717229e11.gif" />
</p>
<p align="center">利用 Intersection Observer API 实现的无限图片懒加载运行效果</p>


## 兼容性

虽然是实验性 API，但支持情况还可以。根据 [Can I Use #intersectionobserver](https://caniuse.com/#search=intersectionobserver) 的数据，PC 端除 IE 外主流浏览器均已支持，移动端 UC 部分支持，其余浏览器支持良好。

## 相关资源

- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

    