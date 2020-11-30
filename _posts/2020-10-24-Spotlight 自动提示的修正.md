---
layout: post
title: Spotlight 自动提示的修正
date: 2020-10-24T03:05:10Z
---
# Spotlight 自动提示的修正

有时重启后，Mac 自带的 Spotlight 不能自动提示了，可通过如下命令来修正：

```sh
$ sudo mdutil -E /
```

其中 `mdutil` 是管理 Spotlight 元数据的命令行工具，

>      mdutil -- manage the metadata stores used by Spotlight

而 `-E` 参数表示重新建立索引。

> -E  This flag will cause each local store for the volumes indicated to be erased.  The stores will be
         rebuilt if appropriate.


## 相关资源

- [Spotlight not working in macOS Catalina on Macbook Pro 15 Late 2017 despite several reindexing](https://discussions.apple.com/thread/250743288)
