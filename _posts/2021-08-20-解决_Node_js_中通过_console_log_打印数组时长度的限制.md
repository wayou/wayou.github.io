---
layout: post
title: "解决 Node.js 中通过 console.log 打印数组时长度的限制"
date: 2021-08-20T15:47:35Z
---
# 解决 Node.js 中通过 console.log 打印数组时长度的限制

Node.js 中通过 `console.log` 打印组数到命令时，会有数量限制，超出部分会隐藏而展示成如下形式：

```bash
[ 'item',
  'item',
  'item',
  <...cut...>
  'item',
  'item',
  'item',
  ... 400 more items ]
```

解决办法还蛮多的，参考[这个 StackOverflow 上的回答](https://stackoverflow.com/a/48231698/1553656)，这里给出最便捷的：

```jsx
const util = require('util')
console.log(util.inspect(array, { maxArrayLength: null }))
```

我为什么会发现这么个问题呢，因为老早之前写了个 [Webpack 插件](https://github.com/wayou/print-chunks-plugin)打印些调试信息，有人提 issues 报了这个问题。

## 相关资源

- [Dumping whole array: console.log and console.dir output “… NUM more items\]”](https://stackoverflow.com/questions/41669039/dumping-whole-array-console-log-and-console-dir-output-num-more-items)
- [Node.js: Log over 100 Array elements](https://zaiste.net/posts/nodejs-log-over-100-array-items/)
