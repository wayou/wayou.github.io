---
layout: post
title: "TypeScript 项目 `rootDir` 设置及根目录之外资源的引用"
date: 2020-05-15 23:05:00 +0800
tags: 
---
    
# TypeScript 项目 `rootDir` 设置及根目录之外资源的引用

## 控制输出目录的层级

假设项目目录结构如下：

```
.
├── dest
├── node_modules
├── package.json
├── src
│   ├── index.ts
├── tsconfig.json
└── yarn.lock
```

在 `"outDir": "./dest"` 配置情况下，`src/index.ts` 编译后输出位置为 `dest/src/index.js`。

输出目录带上了的 `src` 这一层，显然不是那么合理。

解决办法是指定 `rootDir: “src”`。这样，根目录变成了 `src`，编译后输出则没有了 `src` 这一层。

## 根目录之外资源的引用

但，这样做存在局限性。因为根目录设置为 `src` 后，就限制了代码使用 `src` 之外资源的能力。

什么意思呢，假设我们想在 `src/index.ts` 中引用项目根目录的 `package.json` 文件，

src/index.ts

```ts
import * as pkg from "../package.json";
```

TypeScript 中导入 JSON 文件需要添加 `resolveJsonModule : true` 配置。好的。

加上后发现，会提示如下错误：

```
File ‘/myapp/package.json' is not under 'rootDir' ‘/myapp/src'. 'rootDir' is expected to contain all source files.ts(6059)
```

因为前面我们配置了 `src` 为根目录，而 `package.json` 并不在 `src` 下面，所以代码中引用就越界了，这就是前面说的局限性。

### 自定义声明文件

那为了解决这个问题，把刚刚添加的 `resolveJsonModule : true` 去掉或者改成 `resolveJsonModule : false`。

接下来在 `src` 下添加类型声明文件以支持 JSON 的导入，即，通过自定义声明的方式让 TypeScript 认识 JSON 文件而不用原生的配置。

src/typings.d.ts

```ts
declare module "*.json";
```

这样，完美解决。

最后的项目目录会长这样：

```
.
├── dest
│   ├── index.js
│   └── package.json
├── node_modules
├── package.json
├── src
│   ├── index.ts
│   └── typings.d.ts
├── tsconfig.json
└── yarn.lock
```

## 相关资源

- ['package.json' is not under 'rootDir'](https://stackoverflow.com/a/61426303/1553656)

    