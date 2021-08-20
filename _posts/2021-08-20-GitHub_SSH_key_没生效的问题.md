---
layout: post
title: "GitHub SSH key 没生效的问题"
date: 2021-08-20T15:42:55Z
---
# GitHub SSH key 没生效的问题

通过[官方文档](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)进行 SSH key 的配置，完了发现提交代码时还弹出用户名密码输入的提示，那必然是 SSH key 没生效。

通过如下命令看了下输出：

```bash
$ ssh -T git@github.com
Hi wayou! You've successfully authenticated, but GitHub does not provide shell access.
```

于是就有眉目了，Google 了下对应原因，通过[这个 StackOverflow 的回答](https://stackoverflow.com/a/26955444/1553656)找到了答案，原因是仓库通过 `http` clone，而 ssh key 需要使用 git 方式 clone。

修正方式是将仓库的远端地址切换到 git 即可：

```bash
$ git remote set-url origin git@github.com:foo/bar.git
```

以上。

## 相关资源

- [Github Authentication Failed - … GitHub does not provide shell access](https://stackoverflow.com/questions/26953071/github-authentication-failed-github-does-not-provide-shell-access/26955444#26955444)
