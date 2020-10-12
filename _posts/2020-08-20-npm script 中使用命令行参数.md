---
layout: post
title: "npm script 中使用命令行参数"
date: 2020-08-20 23:08:00 +0800
tags: 
---
    
# npm script 中使用命令行参数


假如 package.json 中有如下 script:

```json
{
  "scripts": {
	"serve": "node server.js"
  }
}
```

如果想启动的时候，指定服务启动的端口，可以这样传递：

```sh
$ npm run server -- --port=3001
```

其中 `--` 可以达到将其后跟随的文本附加到实际命令之后的效果。所以，实例运行的命令为 ：

```sh
node server.js "--port=3001"
```

这样在 server.js 中就可通过 `process.argv` 得到参数了。


## script 中任意位置插入参数

上述情形适用于将参数拼接在命令最后的情况，且不在 shell 层面处理参数，而是在具体的 node 代码中获取并处理参数。

考察这样的情形：实现 CI (持续集成) 时将 git 版本戳替换到代码中。

- 首先代码中提前需要被替换的字符比如 `__REVISION__`
- 首先 CI 过程会通过 git 命令拿到版本戳
- 调用 npm script 命令并传递前面获取到的版本戳
- npm script 执行相应的命令进行查找替换

其中，shell 查的替换的命令为：

```sh
sed -i -e 's/few/asd/g' hello.txt
```

npm script 可以这么写：

```sh
"revision": "sed -i -e \"s/__REVISION__/${npm_config_revision}/g\" ./test.js",
```

调用：

```sh
npm run revision --revision=xxx
```

其中 `--foo=bar` 形式的参数会生成现形如 `$npm_config_foo` 的变量。


## 相关资源

- [Sending command line arguments to npm script](https://stackoverflow.com/a/60458728/1553656)
- [Webpack 调教之参数的投喂](https://github.com/wayou/wayou.github.io/issues/14)
- [Using 'sed' to find and replace [duplicate]](https://unix.stackexchange.com/a/159369/209192)

    