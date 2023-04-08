---
layout: post
title: "OpenWrt 安装 Alist"
date: 2023-04-08T02:21:05Z
---
# OpenWrt 安装 Alist

## 添加自定义源

从菜单「软件包」进入配置页面，到底部的「自定义软件源」部分，添加自定义的源

```
src/gz openwrt_kiddin9 https://op.supes.top/packages/x86_64
```

然后点击「提交」保存。


## 更新软件包

到软件包界面点击「刷新列表」更新软件包列表。也可通过命令行更新软件包列表：

```
$ opkg update
```

如果操作过程中出现如下错误

```
opkg_conf_load: Could not lock /var/lock/opkg.lock: Resource temporarily unavailable.
```

可尝试将 lock 文件删除后再更新

```
$ rm -f /var/lock/opkg.lock
$ opkg update
```

## 安装

到「软件包」页面，搜索「alist」，安装如下两个包：

- alist
- luci-app-alist

## 启用

在管理后台左侧菜单的「网络存储」中找到 「alist」 配置并启用。


## 相关资源

- [OpenWRT 安装 Alist 网盘浏览下载插件](https://www.imethanw.com/notes/openwrt-alist-installation.html)
