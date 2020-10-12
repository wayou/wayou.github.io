---
layout: post
title: "pip install 安装 Python 依赖时权限问题的解决"
date: 2020-06-14 12:06:00 +0800
tags: 
---
    
# pip install 安装 Python 依赖时权限问题的解决

从 Github clone Python 项目，安装依赖时报如下错误：

```sh
$ pip install -r requirements.txt
...
ERROR: Could not install packages due to an EnvironmentError: [Errno 13] Permission denied: 'RECORD'
Consider using the `--user` option or check the permissions.
```

原因是尝试安装包到系统目录，而当前用户没有该目录的权限。

解决办法有三种：

- 设置 Python 的虚拟环境（推荐）：

```sh
python3 -m venv env
source ./env/bin/activate 
# 如果是 fish
source ./env/bin/activate.fish
```

然后再次尝试安装即可成功。

- 将包安装到用户目录：

```sh
python -m pip install --user google-assistant-sdk[samples]
```

- 使用系统管理员身份安装：

```sh
sudo python -m pip install google-assistant-sdk[samples]
```


## 相关资源

- [[Errno 13] Permission denied How i solve this problem #236](https://github.com/googlesamples/assistant-sdk-python/issues/236)
- [Virtualenv activation error #853](https://github.com/pypa/virtualenv/issues/853#issuecomment-174852441)

    