---
layout: post
title: "git rebase 时 library not loaded 的错误"
date: 2020-05-23 09:05:00 +0800
tags: 
---
    
# git rebase 时 library not loaded 的错误

在进行 `git rebase` 操作时报如下错误：

```sh
$ git rebase upstream/master -i
dyld: Library not loaded: /usr/local/opt/ruby/lib/libruby.2.4.0.dylib
  Referenced from: /usr/local/bin/vim
  Reason: image not found
/usr/local/Cellar/git/2.9.0/libexec/git-core/git-rebase--interactive: line 255: 61806 Abort trap: 6           vim "$@"
Could not execute editor
```

从信息来看并不是 Git 的问题，而是打开 vim 时报错。

联想到最近的操作，应该是 `brew upgrade` 没成功导致本地的 ruby 坏了，后来果然找到了对应的支撑：[brew upgrade broke Vim on OS X (dyld: Library not loaded)](https://superuser.com/questions/1096438/brew-upgrade-broke-vim-on-os-x-dyld-library-not-loaded)。

解决办法就是重装下 ruby, vim。或成功一遍 `brew upgrade`，中途别取消。

```sh
$ brew reinstall ruby vim
```

    