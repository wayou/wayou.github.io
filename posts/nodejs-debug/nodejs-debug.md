node 调试相关
===

##0 node 正确的书写方式

为了防止后面出现混乱的各种书写，先来了解一下如何正确书写 node 的名称。

下面使用来自[@bitandbang 推文](https://twitter.com/bitandbang/status/1087359646367731719)中的图片展示如何正确书写 node 名称。

![node 名称的正确书写方式](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/nodejs-debug/assets/node_the_right_way.jpg)
_node 名称的正确书写方式_


### node 调试

### `--inspect` 参数

本地开发，无论是 web 应用还是命令行工具，使用 `--inspect-brk` 参数启动程序，然后结合 Chrome DevTools 调试恐怕能满足大多数场景了。

具体步骤：

通过 `--inspect-brk` 参数启动程序，会进入调试模式。

```sh
$ `node --inspect-brk index.js`
```

这里使用 `--inspect-brk` 而非 `--inspect` 可保证代码第一时间断开程序开头。如果使用后者，有可能无法进行后续操作。

打开 Chrome 新开标签页访问 [`chrome://inspect`](chrome://inspect)。不出意外会看到刚刚创建的一个调试实例，直接点击 `inspect` 即可启动调试。因为是 `--inspect-brk` 启动的，调试界面打开后会断在程序开头。后面在哪里加断点就有很大自主权了。

![`chrome://inspect` 界面](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/nodejs-debug/assets/chrome_inspect_panel.png)
_`chrome://inspect` 界面_

需要注意的是，因为此时断在了程序开始，程序中其他文件可能没加载。所以无法看到。这种情况下，可事先在需要加断点的地方写上 `debugger`。

另一个需要注意的地方是，对于 **子进程** 中的代码，是无法断点的，这是调试大多数框架及复杂程序时的痛点。

一个简单的子子进程示例，

_index.js_
```js
var cp = require('child_process');
var child = cp.fork('./child');

child.on('message', function(m) {
  console.log('received: ' + m);
});

child.send('Please up-case this string');
```
_child.js_
```js
process.on('message', function(m) {
  debugger;
  // Do work  (in this case just up-case the string
  m = m.toUpperCase();

  // Pass results back to parent process
  process.send(m.toUpperCase(m));
});
```

这里，`node --inspect-brk index.js` 启动调试后，`child.js` 中的 `debugger` 并不会生效，因为它的代码在子进程中。

这也就是为什么，当你想调试 webpack 编译，恰好又用了有类似 [happypack](https://github.com/amireh/happypack) 这种多进程加速编译的工具时，发现 loader 及 插件中无法断点的原因。

又比如，调试 eggjs，它也是多进程的模型，业务代码是运行在 worker 进程中的，直接通过 node 的这个参数肯定是不行的。当然框架一般会有自身配套的调试方案，你可以安装 egg 的 vscode 插件，或者使用 egg-scripts 来启动调试。


### 善用 npx

调试 node 模块时，特别是 npm 包，你可能需要手动拼出该模板的入口文件的路径，类似 `node —inspect node_modules/webpack/bin/webpack.js`, 但通过 `npx` 则不用，因为 npx 会自动在项目的 `node_modules` 或系统全局中寻找模块的入口文件，甚至如果本机没有安装，它还会自动搜索 registry 自动安装后执行。

以至于你在初始化一个项目时，可使用如下命令：

```sh
$ npx license mit > LICENSE
$ npx gitignore node
$ npx covgen YOUR_EMAIL_ADDRESS
$ npm init -y
```
即使你本地并没有安装 `mit`，`gitignore`，`covgen` 等 npm 包。

使用 npx 时可通过 `—node-arg` 来传递参数给 node。因为本质上 npx 也是执行 js 文件，与 直接使用 `node` 命令来启动文件没什么差异。`—node-arg` 指定的参数会透传给 node，所以，可以这样来启动一个 npm 包的调试：

```sh
$ npx —node-arg=—inspect-brk webpack
```

### node 内建的 debugger

node 自带的 v8 调试工具，是个命令行工具。操作起来是难用，但在远端服务器上这种不能使用 Chrome Devtools 进行可视化调试的场景下，就显得很有用了，比如调试由重定向次数过多这种瞬间发生的问题，它能将代码及时在服务器上断下来，让我们慢慢分析现场。

```sh
$ node inspect index.js
```

![node 自带的 debugger](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/nodejs-debug/assets/node_builtin_debugger.png)
_node 自带的 debugger_

进入调试模式后，代码会断在开始处。可通过以下常用命令进行 debug:
- `c/cont`：断续执行，类似于 Chrome DevTools 中的 <kbd>F8</kbd>
- `n/next`：步进，类似于 Chrome DevTools 中的 <kbd>F10</kbd>
- `step/s`: 进入，类似于 Chrome DevTools 中的 <kbd>F11</kbd>
- `setBreakpoint()/sb()`: 设置断点。
    - 通过调用该函数可对代码设置断点。
    - 直接调用则在当前所处的行设置断点。
    - `sb(line_number)` 传递一个行数，对相应行设置上断点。
    - `sb(file_name,line_number)` 传递文件名及行数，可对非当前文件进行断点的设置。
- `clearBreakpoint`: 参数与 `setBreakpoint` 类似，作用是清除断点。
- `breakpoints`，查看设置的断点。

观察变量的值。在这种调试模式下，可通过输入 `repl` 进入 REPL（Read-Eval-Print-Loop） 模式来查看变量的值。

![通过进入 `REPL` 模式查看断点处的变量值](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/nodejs-debug/assets/repl_in_node_debugger.png)
_通过进入 `REPL` 模式查看断点处的变量值_

实际使用中发现个弊端，就是打印出来的对象是不完整的，如上图。如果想查看没展示出来的属性，那就得记住属性名，然后手动点出来。你当然可以通过 `JSON.stringify(variable)` 将变量转字符后打出来。但 JSON 序列化可并不是处处都管用，比如 koa 中的 response, request 对象，如果尝试进行 JSON 序列化，会报 JSON 循环引用的错误。而且在这里的 REPL 环境下，不能调用 node 模板，不然就可以通过自带的 `require('util').inspect(variable)` 来打印了。

如果每次断在某处时，都需要查看某个变量的值，可通过设置 watcher 来更加方便地查看。

```js
> watch('my_expression')
```

### 日志加 `tail -f`

服务器上面更加常用的应该还是日志加 `tail`，配合 `-f` 参数，可时实将最新的 log 输出到命令行。

```sh
$ tail -f /your/logs/log
```

### Remote Debug

[Remote Debug](https://nodejs.org/en/docs/guides/debugging-getting-started/#enabling-remote-debugging-scenarios) 这个就有点厉害了，没配置过，获取相应服务器权限设置好之后，估计没有比这个更便捷的调试服务器上代码的方式了。在有些资源或服务只在服务器环境才有的情况下，本地又不好还原场景。


### 相关资源

- [@bitandbang 关于如何正确书写 node 的推文](https://twitter.com/bitandbang/status/1087359646367731719)
- [Learn Node.js, Unit 13: Debugging and profiling Node.js applications](https://developer.ibm.com/tutorials/learn-nodejs-debugging-and-profiling-node-applications/)
- [node 官方 debug 上手文档](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [node 自带 debugger 文档](https://nodejs.org/api/debugger.html)

