---
layout: post
title: "npm install 时 postinstall 脚本找不到的问题"
date: 2020-09-10 23:09:00 +0800
tags: 
---
    
# npm install 时 postinstall 脚本找不到的问题

一些 npm 包在安装时会报如下 postinstall 脚本找不到的问题，比如 ``

```sh
$ npm i protobufjs

> protobufjs@6.10.1 postinstall /data/home/wayongliu/test_registry/node_modules/protobufjs
> node scripts/postinstall

sh: node: command not found
npm WARN test_registry@1.0.0 No description
npm WARN test_registry@1.0.0 No repository field.

npm ERR! code ELIFECYCLE
npm ERR! syscall spawn
npm ERR! file sh
npm ERR! errno ENOENT
npm ERR! protobufjs@6.10.1 postinstall: `node scripts/postinstall`
npm ERR! spawn ENOENT
npm ERR!
npm ERR! Failed at the protobufjs@6.10.1 postinstall script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /root/.npm/_logs/2020-09-10T02_51_28_993Z-debug.log
```

该错误同样会出现在对该包有依赖的情况下，即，不直接安装该包，只要依赖链条中包含该包，就会出现上述错误。

解决办法有两种,

## `—ignore-scripts`

安装时指定 `—ignore-scripts` 参数可使得 npm 在完成安装后忽略 `scripts` 的执行，从而规避的该问题。

```sh
$ npm i —ignore-scripts
```

## `—unsafe-perm`

安装时指定 `—unsafe-perm` 参数，同样可以规避掉上述报错。

```sh
$ npm i —unsafe-perm
```


## 相关资源

- [npm install failed #877](https://github.com/protobufjs/protobuf.js/issues/877)
- [npm-install doc](https://docs.npmjs.com/cli/install)
- [npm install - `unsafe-perm`](https://docs.npmjs.com/misc/config#unsafe-perm)
- [What does unsafe-perm in npm actually do?](https://geedew.com/What-does-unsafe-perm-in-npm-actually-do/)

    