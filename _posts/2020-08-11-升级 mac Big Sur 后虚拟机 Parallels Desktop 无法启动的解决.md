---
layout: post
title: "升级 mac Big Sur 后虚拟机 Parallels Desktop 无法启动的解决"
date: 2020-08-11 23:08:00 +0800
tags: 
---
    
# 升级 mac Big Sur 后虚拟机 Parallels Desktop 无法启动的解决

升级 mac Big Sur 后虚拟机 Parallels Desktop 无法启动。

![mac Big Sur Parallels Desktop 无法启动的报错](https://user-images.githubusercontent.com/3783096/89913779-b31b4c00-dc26-11ea-88f1-8a6273f03714.png)
<p align="center">mac Big Sur Parallels Desktop 无法启动的报错</p>

参考 [Error Parallels 15 macOS Big Sur Beta 3](https://developer.apple.com/forums/thread/655115) 里给出的方法，

```sh
$ export SYSTEM_VERSION_COMPAT=1  
```

如果想持久化，将该命令加入 bash profile。

然后通过如下方式打开应用：

```sh
open -a "Parallels Desktop.app"
```

## 相关资源

- [Error Parallels 15 macOS Big Sur Beta 3](https://developer.apple.com/forums/thread/655115)
    