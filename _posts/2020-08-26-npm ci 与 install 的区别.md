---
layout: post
title: "npm ci 与 install 的区别"
date: 2020-08-27 02:08:00 +0800
tags: 
---
    
# npm ci 与 install 的区别

- 要求必需有 `package-lock.json` 或 `npm-shrinkwrap.json` 文件存在
- 如果 lock 与 `package.json` 中版本不匹配，直接报错中断，而不是更新 lock 文件
- npm ci 不能用来安装单个依赖，只能用来安装整个项目的依赖
- npm ci 会检测如果 `node_modules` 已经存在，则先删除再进行安装操作
- npm ci 会安装 `dependencies` 和 `devDependencies，`
    - 和 npm install 一样，生产环境下，即通过 `-—production` 或通过 `NODE_ENV` 配置，则只会安装 dependencies
- 不会更新 `package.json` 或 `package-lock.json` 文件，整个安装过程是锁死的
- 缓存  `npm ci --cache .npm`
- npm ci 时建议加上 `--quiet --no-progress` 关闭进度和其他无用 log，否则产生的日志会很大。
- 所以 ci 时推荐完整的命令为 `npm ci --cache .npm  --quiet --no-progress`


## 相关资源

- [npm-ci](https://docs.npmjs.com/cli/ci.html)
- [What is the difference between “npm install” and “npm ci”?](https://stackoverflow.com/a/53325242/1553656)
- [Is there a way to speedup npm ci using cache?](https://stackoverflow.com/a/60355056/1553656)

    