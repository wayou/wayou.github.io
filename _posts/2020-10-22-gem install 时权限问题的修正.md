---
layout: post
title: gem install 时权限问题的修正
date: 2020-10-22T13:44:43Z
---
# gem install 时权限问题的修正

进行 `gem install` 时，如果报如下权限错误：

```sh
$ gem install jekyll bundler
gem install jekyll bundler
ERROR:  While executing gem ... (Gem::FilePermissionError)
    You don't have write permissions for the /Library/Ruby/Gems/2.6.0 directory.
```

可尝试下面这些解决方式。


## `--user-install`

根据[这个回答](https://stackoverflow.com/a/58878367/1553656)，似乎加上 `--user-install` 参数就可以修正：

```
gem install name_of_gem --user-install
```

## 修正 PATH

如果实测发现仍然不行：

```sh
$ gem install jekyll bundler --user-install
WARNING:  You don't have /Users/wayongliu/.gem/ruby/2.6.0/bin in your PATH,
	  gem executables will not run.
Building native extensions. This could take a while...
ERROR:  Error installing jekyll:
	ERROR: Failed to build gem native extension.
…
```

不过这里的错误信息提示变了，和 PATH 有关，于是根据[这个回答](https://askubuntu.com/a/438822/368322)，修正一个 PATH：

```sh
$ PATH="`ruby -e 'puts Gem.user_dir'`/bin:$PATH"
```

fish 环境使用如下命令：

```sh
$ set PATH "`ruby -e 'puts Gem.user_dir'`/bin:$PATH"
```

或者添加如下命令到 shell 配置文件中：

```sh
set -gx PATH ~/.gem/ruby/2.6.0/bin $PATH
```

## 重装 Ruby

如果仍然不行，可以尝试使用 brew 重装 Ruby，抛弃 mac 自带的版本。安装过程输出的信息会有如下提示：

```
By default, binaries installed by gem will be placed into:
  /usr/local/lib/ruby/gems/2.7.0/bin

You may want to add this to your PATH.

ruby is keg-only, which means it was not symlinked into /usr/local,
because macOS already provides this software and installing another version in
parallel can cause all kinds of trouble.

If you need to have ruby first in your PATH run:
  echo 'set -g fish_user_paths "/usr/local/opt/ruby/bin" $fish_user_paths' >> ~/.config/fish/config.fish

For compilers to find ruby you may need to set:
  set -gx LDFLAGS "-L/usr/local/opt/ruby/lib"
  set -gx CPPFLAGS "-I/usr/local/opt/ruby/include"

For pkg-config to find ruby you may need to set:
  set -gx PKG_CONFIG_PATH "/usr/local/opt/ruby/lib/pkgconfig"
```

根据提示，添加相应脚本的 shell 的配置中。

```sh
echo 'set -g fish_user_paths "/usr/local/opt/ruby/bin" $fish_user_paths' >> ~/.config/fish/config.fish
```

刷新配置：

```sh
$ source ~/.config/fish/fish.config
```

然后再执行 gem 安装相关的命令，应该就解决了。

```sh
$ gem install --user-install bundler jekyll
Fetching public_suffix-4.0.6.gem
Fetching i18n-1.8.5.gem
Fetching eventmachine-1.2.7.gem
Fetching http_parser.rb-0.6.0.gem
Fetching colorator-1.1.0.gem
Fetching addressable-2.7.0.gem
Fetching concurrent-ruby-1.1.7.gem
Fetching em-websocket-0.5.2.gem
…
```

检查安装：

```sh
$ jekyll -v                                                                                                  
jekyll 4.1.1
```

如果报 jekyll 命令找不到，检查 shell 配置中是 PATH 是否配置正确，见上面步骤。







