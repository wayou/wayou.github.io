---
layout: post
title: "Emscripten 安装"
date: 2020-05-09 21:05:00 +0800
tags: 
---
    
# Emscripten 安装

## 通过 Homebrew 安装

可以通过官方的 [Download and install](https://emscripten.org/docs/getting_started/downloads.html) 页面描述的步骤来进行，但也有更加便捷的方式，比如通过 Homebrew，只需执行如下命令即可：

```sh
$ brew install emscripten
```

## `.emscripten` 文件的配置

完成成功后， 会有个配置的提示：

```
==> Caveats
Manually set LLVM_ROOT to
  /usr/local/opt/emscripten/libexec/llvm/bin
and comment out BINARYEN_ROOT
in ~/.emscripten after running `emcc` for the first time.
```

即首次运行 `emcc` 后，会生成一个 `~/.emscripten` 配置文件，将其中的 `LLVM_ROOT` 设置成上面提示的路径，同时注释掉 `BINARYEN_ROOT`。

### 运行 `emcc` 检查安装

运行 `emcc` 检查是否安装成功：

```sh
$ emcc -v
==============================================================================
Welcome to Emscripten!

This is the first time any of the Emscripten tools has been run.

A settings file has been copied to ~/.emscripten, at absolute path: /Users/wayou/.emscripten

It contains our best guesses for the important paths, which are:

  LLVM_ROOT       = /usr/bin
  NODE_JS         = /Users/wayou/.nvm/versions/node/v12.1.0/bin/node
  EMSCRIPTEN_ROOT = /usr/local/Cellar/emscripten/1.39.8/libexec

Please edit the file if any of those are incorrect.

This command will now exit. When you are done editing those paths, re-run it.
==============================================================================
```

然后按照上面提示配置 `~/.emscripten`，再次运行 `emcc` 时，如果是 1.38.44 之后的版本，会发现报错：

```sh
$ emcc -v
shared:ERROR: BINARYEN_ROOT is not defined in /Users/wayou/.emscripten
```

### `BINARYEN_ROOT` 的设置

因为前面步骤注释掉了 `BINARYEN_ROOT`，所以这里提示该字段没有设置。查询后发现这里有对这个问题的讨论，具体原因来自 1.38.44 中的改动：

> v1.38.44: 09/11/2019
> --------------------
>  - Remove Binaryen from the ports system. This means that emscripten will
>    no longer automatically build Binaryen from source. Instead, either use
>    the emsdk (binaries are provided automatically, just like for LLVM), or
>    build it yourself and point `BINARYEN_ROOT` in .emscripten to it. See #9409
> -- _引用自 emscripten 的发版日志_

解决办法是安装 `binaryen` 并且设置 `BINARYEN_ROOT` 到 `/usr/local/opt/binaryen` 这个路径。

```sh
$ brew install binaryen
```

编辑 `~/.emscripten` 设置 `BINARYEN_ROOT`：

```
BINARYEN_ROOT = '/usr/local/opt/binaryen'
```

再次运行 `emcc` 检查是否一切正常：

```sh
$ emcc -v
cache:INFO: generating system asset: is_vanilla.txt... (this will be cached in "/Users/wayou/.emscripten_cache/is_vanilla.txt" for subsequent builds)
cache:INFO:  - ok
emcc (Emscripten gcc/clang-like replacement + linker emulating GNU ld) 1.39.8
clang version 6.0.1  (emscripten 1.39.8 : 1.39.8)
Target: x86_64-apple-darwin19.3.0
Thread model: posix
InstalledDir: /usr/local/opt/emscripten/libexec/llvm/bin
shared:INFO: (Emscripten: Running sanity checks)
```

至此，通过 Homebrew 方式成功安装 emscripten。

## 相关资源

- [Emscripten documentation - Download and install](https://emscripten.org/docs/getting_started/downloads.html)
- [Emscripten needs Binaryen while compiling to wasm #47869](https://github.com/Homebrew/homebrew-core/issues/47869#issue-537885207)
- [Homebrew Formulae - emscripten](https://formulae.brew.sh/formula/emscripten)


    