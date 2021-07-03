---
layout: post
title: "[Golang] GOROOT 及 GOPATH﻿"
date: 2021-07-03T09:39:34Z
---
# [Golang] GOROOT 及 GOPATH﻿

- GOROOT: 标识 Go SDK 的位置，一般情况下不用改，除非要切换到其他 Go 版本
- GOPATH: 定义工作区（workspace）的位置。 默认情况下为 `~/go` 目录。其中包含
    - bin： go 编译后的可执行文件
    - pkg：包含编译后的包代码，即 `.a` 文件
    - src： 源码目录，包含诸如 `.go`，`.c`，`.g` 及 `.s` 等类型文件

`GOPATH` 也是 `go install` 等命令依赖的目录。 可以使用默认目录，也可以通过设置 `$GOPATH` 来自定义。


但推荐显式地设置一下 `$GOPATH`，这样能明确自己所处的工作空间位置，同时将 `$GOPATH/bin` 添加到系统的 `$PATH` 中这样通过 `go install` 安装的三方工具就可直接运行了。

fish shell 中设置 `$GOPATH`：


```sh
# ~/.config/fish/config.fish

set -x GOPATH $HOME/go # 或其他位置
set -x PATH $PATH $GOPATH/bin
```

除了以上两个环境变量，还有很多可配置的 Go tool 环境变量，可通过 `go env` 查看到：

```sh
$ go env
GO111MODULE=""
GOARCH="amd64"
GOBIN=""
GOCACHE="/Users/wayongliu/Library/Caches/go-build"
GOENV="/Users/wayongliu/Library/Application Support/go/env"
GOEXE=""
GOFLAGS=""
GOHOSTARCH="amd64"
GOHOSTOS="darwin"
GOINSECURE=""
GOMODCACHE="/Users/wayongliu/go/pkg/mod"
GONOPROXY=""
GONOSUMDB=""
GOOS="darwin"
…
```


## 相关资源

- [GOROOT and GOPATH﻿](https://www.jetbrains.com/help/go/configuring-goroot-and-gopath.html)

