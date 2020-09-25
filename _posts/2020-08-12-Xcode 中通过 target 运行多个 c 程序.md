---
layout: post
title: "Xcode 中通过 target 运行多个 c 程序"
date: 2020-08-12 23:08:00 +0800
tags: 
---
    
# Xcode 中通过 target 运行多个 c 程序


讲道理，一个 Xcode 项目只有一个程序入口，即 main.c 文件。但做 c 练习的时候会创建多个 main 入口以运行不同程序。

## 问题展示

当已经有一个正常运行的程序时，再新增一个 c 文件并编写 main 入口，会报错如下：

![Xcode 中多个 main 入口时的报错](https://user-images.githubusercontent.com/3783096/90034180-e3302100-dcf2-11ea-80eb-a95a021abacb.png)
<p align="center">Xcode 中多个 main 入口时的报错</p>

为了实现多个入口并存，需要让 Xcode 知道你想编译哪个程序。大致有以下两种方式。

## 指定需要编译的源文件

点击 navigator 中的项目名打开项目设置，选中 target，在 `Build Phases` 的 `Compile Sources` 中设置参与编译的源文件。

![指定参与编译的源文件](https://user-images.githubusercontent.com/3783096/90034549-5d60a580-dcf3-11ea-899a-7fdb577f455a.png)
<p align="center">指定参与编译的源文件</p>

这种方式，很精确，缺点也很明显，步长有点长。

## 为每个程序单独创建 target

通过为每个小的程序创建单独的 target，可将它们隔离互不影响又同时存在于一个大的 project 下。

方式是 `File -> New -> Target...`

![选择不同的 target](https://user-images.githubusercontent.com/3783096/90035809-d7ddf500-dcf4-11ea-9f3a-db9b64ffc254.png)
<p align="center">选择不同的 target</p>

通过选中不同的 target 来运行不同的程序，相比前面种做法要方便许多。

创建 target 的操作可绑定一个快捷键，进一步减少点选操作。



    