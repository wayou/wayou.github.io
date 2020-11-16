---
layout: post
title: 配置 GitHub SSH
date: 2020-11-16T16:09:26Z
---
# 配置 GitHub SSH

制作 GitHub Actions 并发布到市场需要开启 GitHub 的两步验证。开启两验证后就需要配置 SSH 方式进行仓库的提交，因为不能使用密码了，要么使用 personal token。

根据[官方文档](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/connecting-to-github-with-ssh)进行 SSH 配置。

## 检查本地 SSH keys

通过命令 `ls -al ~/.ssh` 查看本地是否已经存在 SSH key。

```sh
$ ls -al ~/.ssh
...
id_rsa.pub
id_ecdsa.pub
id_ed25519.pub
...
```

如果已经存在，则会出现上述三个文件。

如果不存在，则需要进行生成。

## 生成 SSH key

```sh
$ ssh-keygen -t ed25519 -C "your_email@example.com"
```

执行上述命令一路回车即可。

## 添加 SSH key 到 ssh-agent

首先是启动 ssh-agent：

```sh
$ eval "$(ssh-agent -s)"
```

讲道理，这个 agent 需要常驻后台，新开 terminal 或重启时，都需要开启该服务。fish shell 可添加如下脚本到配置文件（`~/.config/fish/config.fish`）以达到自动启动的目的：

<details>
<summary>
fish shell 自动启动 ssh-agent 的脚本
</summary>

```sh
# content has to be in .config/fish/config.fish
# if it does not exist, create the file
setenv SSH_ENV $HOME/.ssh/environment

function start_agent
    echo "Initializing new SSH agent ..."
    ssh-agent -c | sed 's/^echo/#echo/' > $SSH_ENV
    echo "succeeded"
    chmod 600 $SSH_ENV
    . $SSH_ENV > /dev/null
    ssh-add
end

function test_identities
    ssh-add -l | grep "The agent has no identities" > /dev/null
    if [ $status -eq 0 ]
        ssh-add
        if [ $status -eq 2 ]
            start_agent
        end
    end
end

if [ -n "$SSH_AGENT_PID" ]
    ps -ef | grep $SSH_AGENT_PID | grep ssh-agent > /dev/null
    if [ $status -eq 0 ]
        test_identities
    end
else
    if [ -f $SSH_ENV ]
        . $SSH_ENV > /dev/null
    end
    ps -ef | grep $SSH_AGENT_PID | grep -v grep | grep ssh-agent > /dev/null
    if [ $status -eq 0 ]
        test_identities
    else
        start_agent
    end
end
```

</details>

上述来自 [ssh_agent_start.fish](https://gist.github.com/gerbsen/5fd8aa0fde87ac7a2cae)。

## 配置 SSH 自动添加 key 到 agent

编辑文件 `~/.ssh/config` 输入如下内容，如果文件不存在则创建一个：

```
Host *
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519
```

## 添加本地私钥到 agent

```sh
$ ssh-add -K ~/.ssh/id_ed25519
```

至此本地 SSH 配置完成。接下来配置 GitHub。

## 添加 SSH key 到 GitHub

首先复制本地公钥：

```sh
$ pbcopy < ~/.ssh/id_rsa.pub
```

打开 GitHub 设置页定位到 [`SSH and GPG keys` 页面](https://github.com/settings/keys)，选择 `New SSH Key` 然后输入上面复制的内容，取个标题后保存。

由此完成了 SSH 的配置。

大概需要重启一下 terminal 以生效。

## 切换仓库到 SSH 方式

将之前通过 HTTPS 克隆的仓库切到 SSH 方式：

```sh
git remote set-url origin git@github.com:USERNAME/REPOSITORY.git
```

## 相关资源

- [Connecting to GitHub with SSH - GitHub Docs](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/connecting-to-github-with-ssh)
- [ssh_agent_start.fish](https://gist.github.com/gerbsen/5fd8aa0fde87ac7a2cae)
- [Changing a remote's URL](https://docs.github.com/en/free-pro-team@latest/github/using-git/changing-a-remotes-url)

