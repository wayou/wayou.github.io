---
layout: post
title: "安装并切换到 fish shell"
date: 2020-04-24T12:37:36Z
---
# 安装并切换到 fish shell

## 安装

```sh
$ brew install fish
```

## 检查安装

```sh
$ fish -v
fish, version 3.1.0
```

## 设置 fish shell 为默认 shell

首先添加 fish 到 `/etc/shells`：

```sh
$ sudo echo /usr/local/bin/fish >> /etc/shells
```

如果报如下错误：

```
-bash: /etc/shells: Permission denied
```

尝试以下命令：

```sh
$ echo "/usr/local/bin/fish" | sudo tee -a /etc/shells
```

检查添加结果：

```sh
$ cat /etc/shells
# List of acceptable shells for chpass(1).
# Ftpd will not allow users to connect who are not using
# one of these shells.

/bin/bash
/bin/csh
/bin/dash
/bin/ksh
/bin/sh
/bin/tcsh
/bin/zsh
/usr/local/bin/fish
```

切换默认 shell 到 fish：

```sh
$ chsh -s /usr/local/bin/fish
```


## 安装 omf

```sh
$ curl -L https://get.oh-my.fish | fish
```

检查安装：

```sh
$ omf -v
Oh My Fish version 7
```

然后就可以通过 omf 安装相应的主题，插件了。

### 推荐的插件和主题

- [autojump](https://github.com/wting/autojump)
	- 先正常安装 autojump `brew install autojump`
	- 安装 fish autojump 插件 `omf install autojump`
	- 配置 fish，添加 `[ -f /usr/local/share/autojump/autojump.fish ]; and source /usr/local/share/autojump/autojump.fis` 到 `~/.config/fish/config.fish`
- nvm
	- 正常安装 nvm `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash`
	- 安装 nvm 插件 `omf install nvm`
	- 添加 `set -gx NVM_DIR (brew --prefix nvm)` 到 fish 配置文件


## fish 的配置

通过 `~/.config/fish/config.fish` 文件进行配置，如果没有的话，手动创建一个。

也可通过 `fish_config` 命令打开一个本地页面进行可视化的配置。

```sh
$ fish_config
```

<img width="1425" alt="Screen Shot 2020-04-22 at 17 02 46" src="https://user-images.githubusercontent.com/3783096/79962855-2c95ff80-84bb-11ea-87d8-2c07fd3315c9.png">
<p align="center">可视化配置 fish</p>

### 命令行的 vi 模式

通过 `fish_vi_key_bindings` 可开启 vi 模式，此模式下可通过 <kdb>i</kbd> 和 <kbd>ESC</kdb> 来切换 normal 和 insert 模式。
`fish_default_key_bindings` 恢复到正常模式。

将 `fish_vi_key_bindings` 添加到 fish 的配置文件中可默认开启 vi 模式。

另，该模式下会影响 fish 自动实例快捷键 <kdb>command</kdb> + <kdb>F</kdb>，添加如下脚本到 fish 配置文件以修正：

```sh
function fish_user_key_bindings
    for mode in insert default visual
        bind -M $mode \cf forward-char
    end
end

fish_user_key_bindings
```

以上。
 


