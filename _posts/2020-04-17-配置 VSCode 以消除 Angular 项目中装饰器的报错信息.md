---
layout: post
title: "配置 VSCode 以消除 Angular 项目中装饰器的报错信息"
date: 2020-04-18 00:04:00 +0800
tags: 
---
    
# 配置 VSCode 以消除 Angular 项目中装饰器的报错信息

Angular 项目中大量使用装饰器，但装饰器是个实验阶段的特性，所以 VSCode 会报错：

```
Experimental support for decorators is a feature that is subject to change in a future release. Set the 'experimentalDecorators' option in your 'tsconfig' or 'jsconfig' to remove this warning.ts(1219)
```

<img width="919" alt="Screen Shot 2020-04-11 at 15 29 07" src="https://user-images.githubusercontent.com/3783096/79038095-3f7e1980-7c09-11ea-816d-ad2a752c6d86.png">

<p align="center">VSCode 中 TypeScript 装饰器错误信息</p>

一般来说，TypeScript 项目可通过配置 tsconfig.json 开启装饰器功能，但这里需要配置 VSCode 以使编辑器知道以消除报错，添加以下配置到 VSCode 的配置文件：

```json
 "javascript.implicitProjectConfig.experimentalDecorators": true 
```


## 相关资源

- [Error warning message: "Experimental support for decorators is a feature that is subject to change in a future release" #45071](https://github.com/Microsoft/vscode/issues/45071#issuecomment-371335725)
    