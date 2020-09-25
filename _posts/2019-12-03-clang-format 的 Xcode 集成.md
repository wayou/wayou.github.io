---
layout: post
title: "clang-format 的 Xcode 集成"
date: 2019-12-03 23:12:00 +0800
tags: 
---
    
# clang-format 的 Xcode 集成

之前文章 [Xcode 中配置 clang-format 格式化 C++ 代码](https://github.com/wayou/wayou.github.io/issues/116) 中介绍的格式化方法有两个问题，

- 不能格式化整个文件，必需先选中文本
- 不支持项目中的 `.clang-format` 配置文件，只能读取全局的

利用 Xcode 自带的 Behaviors 可绑定快捷键执行一些任务，比如执行 shell 脚本。

而这里执行的 shell 脚本较 Automator 中的脚本区别在于，可以解决上面提到的两个问题。

- 脚本中通过执行 Apple Script 获取到当前正在编辑文件的路径，达到格式化整个文件的目的，无需进行文本选择。
- 因为执行上下文不在全局，所以项目中的 `.clang-format` 配置文件可以生效。这样格式配置可跟着项目走。

## 创建格式化脚本

首先创建一个 Behavior 中需要执行的脚本，在这个脚本中完成文件路径的获取，clang-format 的执行。

```sh
#!/bin/bash
# exec & >> ~/Desktop/test.log
export PATH=/usr/local/bin:$PATH
file=`osascript -e "tell application id \"com.apple.dt.Xcode\"
    set CurrentActiveDocument to document 1 whose name ends with (word -1 of (get name of   window 1))
    set WhatYouWant to path of CurrentActiveDocument
end tell"`
# echo $file >>  ~/Desktop/test.log
clang-format -i -style=file $file
```

将脚本保存到某个位置譬如 `x/y/z/foramt.sh`。

## 赋予脚本可执行权限

然后通过以下命令保证脚本有执行权限：

```sh
$ chmod +x x/y/z/foramt.sh
```

## 配置 Xcode behavior

- 打开 Xcode behavior

![打开 Xcode behavior](https://user-images.githubusercontent.com/3783096/70046680-7613aa00-1601-11ea-9e9e-c958123985c3.png)
<p align="center">Xcode behavior</p>

- 点击左下角的 `+` 添加新的 behavior，随便取个名称，再点击名称旁边的 ⌘ 为该项绑定一个快捷键，比如 `⌘+⇧+M`，


- 右边内容区域最下面勾选 `Run` 并选择前面步骤保存的 shell 文件。

最后完成后看起来是这样：

![配置 Xcode behavior](https://user-images.githubusercontent.com/3783096/70046663-701dc900-1601-11ea-957f-21662325a6a0.png)
<p align="center">配置 Xcode behavior</p>


## 使用

配置完成后，在编码过程中可通过前面配置的快捷键进行整个文件的格式化了。

![格式化效果](https://user-images.githubusercontent.com/3783096/70046649-6a27e800-1601-11ea-99bb-adf6d288582e.gif)
<p align="center">格式化效果</p>

如果项目根目录有放置 `.clang-format` 文件，则会正常读取到。同时这种方式还支持不同目录下放置不同的 `.clang-format` 配置文件，因为 clang-format 在格式化文件是，是会从文件所在目录向上逐级查找格式化配置文件的。

## gotchas

实际使用过程中发现该命令会有失效的情况，具体还不知道是 xcode behavior 没执行还是 clang-format 的问题。

## 相关资源

- [Xcode 4 : Can I get a path to the currently active file via AppleScript?](https://stackoverflow.com/questions/10341327/xcode-4-can-i-get-a-path-to-the-currently-active-file-via-applescript/14602063)
- [Path to Current Xcode Document](http://jeffreysambells.com/2012/07/26/path-to-current-xcode-document-in-bash)

    