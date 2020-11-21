---
layout: post
title: Parallels Desktop 16 在 Mac Big Sur 下无网络访问的解决
date: 2020-11-21T12:08:36Z
---
# Parallels Desktop 16 在 Mac Big Sur 下无网络访问的解决

旧版 Parallels Desktop 在最新的 Big Sur 版 macOS 上会有很多兼容性问题，所以建议安装最新的 Parallels Desktop 16。

尽管最新的 16 也存在一些兼容性问题，但相比老版本需要通过 `open -a 'Parallels Desktop'` 命令行方式打开已经好很多了。16 比较大的一个问题是安装完成后会显示网络初始化失败：

<img width="592" alt="Screen Shot 2020-11-21 at 19 48 25" src="https://user-images.githubusercontent.com/3783096/99876675-3a6b5900-2c33-11eb-8f24-e306c016c588.png">


参见官网[Parallels Desktop for Mac 与 macOS 11 Big Sur 的兼容性 – 已知和已解决的问题](https://kb.parallels.com/en/125039)中列出的第四点，通过以下步骤进行修复。


如果上述方法仍不生效，尝试来自[这里](https://forums.macrumors.com/threads/parallels-16-network-initialization-failed.2268159/)提供的一个方法：

```sh
$ sudo -b /Applications/Parallels\ Desktop.app/Contents/MacOS/prl_client_app
```

不过每次启动都要以上面的命令来启动。

## 相关资源

- [Parallels Desktop for Mac 与 macOS 11 Big Sur 的兼容性 – 已知和已解决的问题](https://kb.parallels.com/en/125039)
- [TNT Team - Parallels Desktop 16](https://www.appstorrent.ru/61-parallels-desktop.html)
- [Big Sur Beta 6/7/8 - Network Initalization Failed](https://forum.parallels.com/threads/big-sur-beta-6-7-8-network-initalization-failed.351025/)
