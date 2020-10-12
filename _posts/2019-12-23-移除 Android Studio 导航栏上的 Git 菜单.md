---
layout: post
title: "移除 Android Studio 导航栏上的 Git 菜单"
date: 2019-12-24 01:12:00 +0800
tags: 
---
    
## 移除 Android Studio 导航栏上的 Git 菜单

平时 Git 操作都在命令行里进行的话，导航栏上的 Git 菜单便没必要，还占位置。可通过配置将其移除。

先看 Android Studio 主界面各部分的名称，方便定位具体的设置项。

![Android Studio 主窗口](https://user-images.githubusercontent.com/3783096/71348996-cfd81600-25a8-11ea-82c9-8e706c3f8ba3.png)
<p align="center">Android Studio 主窗口 -- 图片来自 <a href="https://developer.android.com/studio/intro/?utm_source=android-studio">Android Studio 文档页</a></p>

1. 工具栏供您执行各种操作，其中包括运行应用和启动 Android 工具。
2. 导航栏助您在项目中导航，以及打开文件进行修改。此区域提供 Project 窗口中所示结构的精简视图。
3. 编辑器窗口供您创建和修改代码。编辑器可能因当前文件类型而异。例如，查看布局文件时，该编辑器会显示布局编辑器。
4. 工具窗口栏在 IDE 窗口外部运行，并包含可用于展开或折叠各个工具窗口的按钮。
5. 工具窗口可让您访问特定任务，例如项目管理、搜索和版本控制等。您可以展开和折叠这些窗口。
6. 状态栏显示项目和 IDE 本身的状态以及任何警告或消息。

本来会有一行 **工具栏**，如果隐藏了工具栏，Git 菜单会自动下移至 **导航栏**。

定位到其所在的区域后，打开设置搜索，搜索 `toolbar` 打开 `Menus and Toolbars` 后，再次搜索 `navigation bar toolbar`，可以看到其具体位于 `NavBarVcsGroup` 这个工具分组下，选中后将其移除即可。

![设置界面](https://user-images.githubusercontent.com/3783096/71349018-e54d4000-25a8-11ea-93c2-a4c9893fea36.png)
<p align="center">设置界面</p>

    