---
layout: post
title: "Xcode 中配置 clang-format 格式化 C++ 代码"
date: 2019-06-15 08:06:00 +0800
tags: 
---
    
# Xcode 中配置 clang-format 格式化 C++ 代码

Xcode 自带的代码格式化功能（<kbd>control</kbd> + <kbd>I</kbd>）很有限，其 “格式化” 仅限于设置缩进，代码里面的格式是不会处理的。所以需要借助额外的工具来完成代码的美化。

[clang-format](https://clang.llvm.org/docs/ClangFormat.html) 便是可选的工具之一，它可用来格式化 C/C++/Java/JavaScript/Objective-C/Protobuf/C# 等代码。

其内置了多种预设的代码风格，分别有 LLVM, Google, Chromium, Mozilla, WebKit。

可通过添加 `.clang-format` 文件来进行配置。优先使用项目中的 `.clang-format` 文件，然后会查找系统中存在的 `.clang-format` 文件。

一个配置文件的示例：

```sh
BasedOnStyle: LLVM
IndentWidth: 4  
```

所有可用的配置参数可在其[文档 Clang-Format Style Options](https://clang.llvm.org/docs/ClangFormatStyleOptions.html) 中查看。一般指定一个喜欢的预设风格即可。

## clang-format 的安装

```sh
$ brew install clang-format
```

检查安装：

```sh
$ clang-format --version
clang-format version 8.0.0 (tags/google/stable/2019-01-18)
```

虽然安装好了，但它是命令行工具，要在 Xcode 中使用，还需要借助 macOS 自带的 Automator 工具。

## 添加 Automator 服务

打开 Automator 选择 "Quick Action"。

![通过 Automator 创建 "Quick Action"](https://user-images.githubusercontent.com/3783096/59342707-dace0600-8d3c-11e9-82ec-383ff5e3a657.png)
<p align="center">通过 Automator 创建 "Quick Action"</p>


左侧 Library 中搜索 "Run Shell Script" 并拖动到右侧。在脚本编辑框中输入以下内容：


```sh
export PATH=/usr/local/bin:$PATH
clang-format
```


![通过执行脚本实现 clang-format 服务的添加](https://user-images.githubusercontent.com/3783096/59342864-35676200-8d3d-11e9-8800-a4e169007902.png)
<p align="center">通过执行脚本实现 clang-format 服务的添加</p>


同时记得勾选上 "Output replaces selected text"，然后保存并输入保存的名称，比如 `clang-format`。

至此一个服务便已添加好。


## 使用

在当前用户的根目录 `~` 放置一个 `.clang-format` 文件，

```sh
$ touch ~/.clang-format
```

在其中指定 C++ 格式化相关的配置，比如：

```sh
BasedOnStyle: Google
IndentWidth: 2
```

当然，除了配置文件，clang-format 的格式化参数也可通过 shell 的方式传递，比如上面在添加服务时输入的脚本中，带上格式化的参数：

```sh
export PATH=/usr/local/bin:$PATH
clang-format -style="{IndentWidth: 4, TabWidth: 4, UseTab: Never,   BreakBeforeBraces: Stroustrup}"
```

打开 Xcode，选中需要格式化的代码并右键唤出菜单。选择 `Services-> clang-format`，这里 Services 中的名称即为前面步骤中保存的 Services 名称。

![通过菜单进行格式化](https://user-images.githubusercontent.com/3783096/59343020-81b2a200-8d3d-11e9-9433-92da848e4549.gif)
<p align="center">通过菜单进行格式化</p>


## 添加快捷键

显然右键这种方式不够便捷，进一步添加快捷键来实现更加方便的代码格式化。因为 Xcode 中格式化代码默认的快捷键为 <kbd>control</kbd> + <kbd>I</kbd>，不防我们就设置 `clang-format` 这个服务的快捷键为这个按键组合。

打开系统的首选项设置（可通过在 SpotLight 中搜索 "system preference"），然后打开键盘设置 "Kyeboard" 并切换到 "Shortcuts" 标签。

选中左侧 "App Shortcuts" 然后为 "Xcode" 绑定 <kbd>control</kbd> + <kbd>I</kbd> 执行 `clang-format`。

![为 `clang-format` 添加系统快捷键](https://user-images.githubusercontent.com/3783096/59343056-98f18f80-8d3d-11e9-9780-20bf36e21eb5.png)
<p align="center">为 `clang-format` 添加系统快捷键</p>

然后便可通过快捷键方便地进行代码格式化了。

![通过快捷键进行格式化](https://user-images.githubusercontent.com/3783096/59343691-fc2ff180-8d3e-11e9-8919-c3e652923c44.gif)
<p align="center">通过快捷键进行格式化</p>

## 其他工具

存在一些其他以插件形式的工具，同样能达到使用 clang-format 格式化代码的目的，比如 [travisjeffery/ClangFormat-Xcode](https://github.com/travisjeffery/ClangFormat-Xcode)，但不支持 Xcode 9+，可安装其替代版 [V5zhou/ZZClang-format](https://github.com/V5zhou/ZZClang-format)

该插件安装好后，支持在文件保存时自动格式化，比较方便。

但因为是来自社区的插件，需要先将 Xcode 去掉签名 （unsign），参见 [inket/update_xcode_plugins](https://github.com/inket/update_xcode_plugins)。

## 既有项目中文件的格式化

对于项目中已经存在的大量老文件，可通过 shell 脚本一次性批量格式化。

示例：

```sh
find path1 path2 -iname "*.h" -o -iname "*.m" | xargs clang-format -i -style=file
```

以上脚本会在 `path1` 和 `path2` 目录下搜索 `*.h` 头文件和 `*.m` Objective-C 文件然后进行格式化。

## 相关资源

- [Clang 9 documentation](https://clang.llvm.org/docs/ClangFormat.html)
- [Code Beautifier in Xcode](http://blog.manbolo.com/2015/05/14/code-beautifier-in-xcode)
- [The Chromium Projects - Mac Development](https://www.chromium.org/developers/how-tos/mac-development)
- [travisjeffery/ClangFormat-Xcode](https://github.com/travisjeffery/ClangFormat-Xcode)


    