---
layout: post
title: "Shim 与 Polyfill"
date: 2019-04-17 23:04:00 +0800
tags: 
---
    
Shim 与 Polyfill
===

- Shim: 用来向后兼容。比如 `requestIdleCallback`，为了在旧的环境中不报错，可以加 [shim](https://gist.github.com/paullewis/55efe5d6f05434a96c36)。
    - 使用环境中现有的 api 来实现，不会引入额外的依赖或其他技术。
- Polyfill: 用来增强，添加新功能。比如 IE7 不支持 localStorage，能添加 polyfill 来支持。
    - 不限制实现，只要是能引入该新功能。通过 js 可 flash。记得很早以前 chrome 还为 ie 开发过插件来支持一些高级的浏览器特性。


### 参考

- [What is the difference between a shim and a polyfill?](https://stackoverflow.com/questions/6599815/what-is-the-difference-between-a-shim-and-a-polyfill)
- [shim vs polyfill?](http://2ality.com/2011/12/shim-vs-polyfill.html)

    