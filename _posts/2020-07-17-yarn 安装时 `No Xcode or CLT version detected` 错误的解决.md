---
layout: post
title: "yarn 安装时 `No Xcode or CLT version detected` 错误的解决"
date: 2020-07-17 23:07:00 +0800
tags: 
---
    
# yarn 安装时 `No Xcode or CLT version detected` 错误的解决


## 查看 Xcode command line tools 的安装位置
```sh
$ xcode-select --print-path
```

## 将已安装的 Xcode command line tools 删除

```sh
$ sudo rm -r -f /Library/Developer/CommandLineTools
```

## 重新安装 Xcode command line tools


```sh
$ xcode-select --install
```

## 参考

- [gyp: No Xcode or CLT version detected macOS Catalina | Anansewaa](https://medium.com/flawless-app-stories/gyp-no-xcode-or-clt-version-detected-macos-catalina-anansewaa-38b536389e8d)

    