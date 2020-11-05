---
layout: post
title: mac 开机始终进入 Recovery Assistant 的解决
date: 2020-11-05T15:15:28Z
---
# mac 开机始终进入 Recovery Assistant 的解决

原因已经无法追溯了，可能是某次升级 beta 升级之后，也可能是安装来源不当的软件导致死机后出现的。

每次开机都会先进入 Recovery Assistant 工具界面，输入磁盘密码后连接 wifi 才能重新进入系统。

## 解决

先关闭磁盘加密(FileValt)：

<img width="780" alt="Screen Shot 2020-11-05 at 23 13 31" src="https://user-images.githubusercontent.com/3783096/98259021-89bb5380-1fbc-11eb-8de0-5338c6ecb0c2.png">


再根据[这个回答](https://apple.stackexchange.com/a/161682/123408)，重启时按住 <kbd>⌘</kbd> + <kbd>⌥</kbd> + <kbd>P</kbd> + <kbd>R</kbd>，会闪烁几次，之后就正常进入系统。后续开机也正常了。


## 相关资源

- [Macbook keeps booting OSX Utilities instead of Mac OS X](https://apple.stackexchange.com/a/161682/123408)

