---
layout: post
title: "Chrome Tab Group 的自动创建"
date: 2020-09-23 23:09:00 +0800
tags:
---

# Chrome Tab Group 的自动创建

新版 Chrome 引入了 Tab Group 的概念，可以将标签页进行分组，并且可以为分组设置不同的颜色，方便在标签页多的情况下进行查看和管理。

但手动去分组未免还是太过麻烦，索性通过配置，可以让 Chrom 将标签自动分组，从一个页面新开的子页面，会自动归到同一组，这在进行搜索。

## 配置

- 打开 [chrome://flags](chrome://flags)
- 搜索 group
- 开启 #tab-groups 和 #tab-groups-auto-create
- 重启 Chrome

## 使用

之后在打开新链接时，将会自动创建分组。

![auto_tab_group mov](https://user-images.githubusercontent.com/3783096/93730137-e96ec280-fbf9-11ea-8206-099e9e44de20.gif)
