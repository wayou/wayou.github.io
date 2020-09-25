---
layout: post
title: "iTerm2 Session 共享"
date: 2020-09-08 23:09:00 +0800
tags: 
---
    
# iTerm2 Session 共享

当前 session 登录远程机器后，新开窗口还需要重新输入密码登录，有点繁琐。

```sh
$ ssh username@remote
pin+password:
```

通过配置 `~/.ssh/config` 文件可达到 session 共享的目的，去掉重复的密码输入过程。

编辑或创建 `~/.ssh/config` 文件，输入如下内容：

```
Host *
  ControlMaster auto
  ControlPath ~/.ssh/%r@%h:%p
```

保存退出 。

此时登录机器后，新开窗口中执行 `ssh` 登录时，可以复用之前的登录状态，直接登入。


## 相关资源

- [How to reuse an ssh connection](https://stackoverflow.com/questions/20410252/how-to-reuse-an-ssh-connection)
    