## Webpack 调教之参数的投喂


假设这样的问题场景：站点支持多国语言（i18n），编译时想支持指定语言来编译。这便涉及到传参了。

一般，项目中会配置 npm scripts 来跑一些任务，常规的线下开发编译任务，线上发版打包任务。所以 package.json 中的脚本配置大概会像这样子：

_package.json_
```js
{
    "scripts": {
        "build": " webpack",
        "start": "webpack --watch"
    }
}
```

现在需要在调用 webpack 时传递一个额外的语言参数，幸而通过 `--env` 这种句法可以轻松实现。

_package.json_
```js
{
    "scripts": {
        "start": "webpack --env.lang=cn"
    }
}
```

同时需要将 webpack 配置文件改成导出函数以接收相应参数。

是的，webpack 配置文件通常是导出一个配置对象。但同时也支持[导出为函数/Exporting a Function](https://webpack.js.org/configuration/configuration-types/#exporting-a-function)，导出为函数时会接收两个入参：

- `env` 用以接收上面那种方式传递的自定义参数
- `argv` 里面包含 webpack 的配置信息，即 webpack 的各种[命令行配置项/CLI Option](https://webpack.js.org/api/cli/#common-options)


于是，我们的 webpack 配置文件需要由导出对象改成导出函数：

_webpack.config.js_
```js
module.exports = (env, argv) => {
    console.log(`${env}`); // {lang: 'cn'}
    return {
        ...
    };
};
```

我们能在 webpack 配置文本中接收到语言参数了，但这个参数是在 npm script 中写死的 `cn`，而我们需要编译不同的语言。


### 多个 script 入口

好说嘛，最简单的方式，为每种语言写一句脚本入口不就行了。于是我们得到了第一种解决方案。

_package.json_
```js
{
    "scripts": {
        "dev:cn": "webpack --env.lang=cn",
        "dev:en": "webpack --env.lang=en",
        "dev:jp": "webpack --env.lang=jp",
        ...
    }
}
```

开发时想编哪个语言就 run 哪个命令，简直不能更简单粗暴了：

```bash
npm run dev:jp
```

但问题是，这根本是一个不算办法的办法。全世界195个国家6909种语言，这样不得写吐。

所以我们需要一种更加走心的方式，得让语言参数支持动态指定。


理想中的样子应该长这样：

_package.json_
```js
{
    "scripts": {
        "dev": "webpack --env.lang=$lang",
    }
}
```

然后我们在 run 的时候指定。

其实到这一步，似乎和 webpack 没多大关系了，问题成了如何在 npm script 中支持变量。而让 script 中支持变量也并不是不可能，先来看最直接的一种，我们让 `scripts` 属性中的 `$lang` 真的活起来。


### 使用 npm config

当你 `man npm-config` 一下时会发现：

> npm gets its config settings from the command line, environment variables, npmrc files, and in some cases, the package.json file.

是的， npm 运行时会从四个地方获取配置信息，命令行中的输入，环境变量，`npmrc` 配置文件以及，某些情况下会从 package.json 中获取。这里的某些情况就是指 package.json 中定义了 `config` 字段时。

所以，我们可以考虑将变量放这里面（其实这里面的叫作配置项更确切，而不是变量）。

_package.json_
```js
{
    "name": "myApp",
    "config":{
        "lang": "cn"
    },
    "scripts": {
        "dev": "webpack --env.lang=$lang",
    }
}
```

当使用 npm 运行脚本时，其会提供很多环境变量供程序使用，我们定义在 package.json `config` 字段中的变量，当然也会加入到其中。可以通过 `npm run env` 来查看当前可使用的所有环境变量。

```bash
$ npm run env

> myApp@1.0.0 env /Users/username/path/to/myApp
> env

...
npm_package_name=myApp
npm_package_config_lang=cn
npm_package_version=1.0.0
...
```

可以看到，我们定义在变量 `lang` 在环境变量中以 `npm_package_config_lang` 的名称存在。讲道理，如果还定义了其他变量比如 `foo`，则会以 `npm_package_config_foo` 的名称而存在。即，npm 会在自定义配置项前面加上 `npm_package_config_` 前缀。

那么，如何获取及使用？

有两种方式。

* 在 js 代码中可以通过 `process.env` 来获取。这里注意区分 `process.env` 中的 `env` 与前面 webpack 导出函数时的入参 `env`，它们不是一回事。 

这里我们得到了第二种解决方案：

_webpack.config.js_
```js

console.log(process.env.npm_package_config_lang) // cn

module.exports = {
    // webpack config goes here...
    ...
}
```

* 在 package.json 的 scripts 脚本中则可以通过 bash 变量的形式来获取，于是很快我们解锁了第三种方案。

_package.json_
```js
{
    "name": "myApp",
    "config":{
        "lang": "cn"
    },
    "scripts": {
        "dev": "webpack --env.lang=$npm_package_config_lang",
    }
}
```

_webpack.config.js_
```js
module.exports = (env, argv) => {
    console.log(`${env}`); // {lang: 'cn'}
    return {
        ...
    };
};
```

#### npm scripts 中使用变量的平台兼容性问题

这里需要注意一下，`webpack --env.lang=$npm_package_config_lang` 中这个 bash 变量的形式只支持 Mac OS X/Linux，而 Windows 平台需要变成 `webpack --env.lang=%npm_package_config_lang%`。所以你要我怎么办，我也很无奈。

针对  Windows 平台单独写一条脚本入口倒也是种解决方案。

_package.json_
```js
{
    "scripts": {
        "dev": "webpack --env.lang=$npm_package_config_lang",
        "dev:win": "webpack --env.lang=%npm_package_config_lang%",
    }
}
```

但实在不优雅，所以 [cross-var](https://www.npmjs.com/package/cross-var) 就可以开始它的表演了。这种差异的处理就交给它吧。

_package.json_
```js
{
    "scripts": {
        "dev": "cross-var webpack --env.lang=$npm_package_config_lang",
    }
}
```

注意区别另一个类似的插件 [cross-env](https://github.com/kentcdodds/cross-env)，正如 cross-var README 中所说，cross-env 用来设置所需环境变量，而 cross-var 解决 scripts 中变量使用的兼容性问题。


#### npm config 的动态设置

上面引入了 package.json 的 `config` 字段，我们也知道怎么使用它了。现在问题是，它也是写死在 package.json 中的啊，相当于我们将之前写死在 `scripts` 中的问题转移到了 `config` 中嘛。

`config` 字段中写死的值可以看作默认值，通过 `npm config` 命令来设置它，以达到动态指定编译参数的目的。

```bash
npm config set myApp:lang en && npm run dev
```


### 自定义 npm 命令行参数

通过 npm 的这个 PR [Passing args into run-scripts #5518](https://github.com/npm/npm/pull/5518)，也就是自 npm 2.0 开始，我们确实可以给 package.json 中的 scripts 传参。

是通过下面这样的语句办到的：

```bash
npm run <command> [-- <args>...]
```

其中 `args` 部分会被拼接到 scripts 命令后面。估计没听懂，来看实操。

前面分析时得到了这样的脚本：

_package.json_
```js
{
    "scripts": {
        "dev": "webpack --env.lang=$lang",
    }
}
```

既然呆会儿会拼接一部分东西到这个命令后面，那么我们把变动的语言参数部分抠掉，把位置留出来，于是成了：

_package.json_
```js
{
    "scripts": {
        "dev": "webpack --env.lang=",
    }
}
```

于是我们运行 `npm run dev -- cn`。从命令行输出的 Log 来看，实际运行的命令成了 `webpack --env.lang= "cn"`。注意这里 `=` 号后面多了个空格，这样的话，我们是拿不到 `cn` 这个值的，拿到的会是 `undefined`。

所以我们改变一下策略，既然拼接到 scripts 后面的参数会被加一个空格，那好，我们将 `--env.lang=$lang` 这一部分整个拿出来。

_package.json_
```js
{
    "scripts": {
        "dev": "webpack",
    }
}
```

然后执行命令时再加上即可，所以应该执行的命令是：

```bash
npm run dev -- --env.lang=cn
```

这样我们得到了第四种方案。


#### 多个参数的情况

有时，你需要定义的参数并不只有一个。下面的示例展示了多个参数传递的用法。

```bash
npm run dev -- --env.lang=cn --env.production
```

这里，如果指定的参数没有用 `=` 号赋值，那么该参数的值为 `true`。

所以你在 webpack 中获取到的参数为：

```js
{
    lang: 'cn',
    production: true
}
```

### 一些问题

#### webpack 配置文件拆分情况下的参数获取

前面的方案中，通过 `--env` 方式设置的参数，需要 webpack 配置文件导出函数以接收。正常情况下没问题，但遇到 webpack 配置文件是拆分的情况，就不行了。

比如按照 webpack 官方的引导，如果配置项复杂的话，可以将 `webpack.config.js` 拆分成不同用途的配置文件。例如：

_`webpack.common.js` 公用的配置：_

```js
module.exports = {
    ...
}
```

_`webpack.dev.js` 开发配置：_

```js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = env => {
    console.log(env.lang);

    return merge(common, {
        devtool: 'inline-source-map',
        ...
    });
}
```

_`webpack.prod.js` 上线配置：_

```js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = env => {
    console.log(env.lang);

    return merge(common, {
        devtool: 'source-map',
        ...
    });
}
```

这种情况下， `webpack.common.js` 只能导出对象，供不同的配置文件中进行合并。所以 `webpack.common.js` 中便无法通过获取到 `--env` 设置给 webpack 的参数，只能另辟蹊径。

但如果你将 npm 环境变量 `process.env` 打印出来的话，发现 `process.env.npm_config_argv` 中包含了命令行参数，但，不建议这么去解析获取。

稍微变通一下，其实我们可以让 common 导出函数返回配置对象，然后在基本配置中使用时调用一下就可以了嘛！

_`webpack.common.js` 公用的配置：_

```js
module.exports = env => {
    console.log('看！我拿到了变量', env.lang);

    return {
        ...
    };
}
```

_`webpack.dev.js`_

```js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = env => {

    const commonConfig = common(env);

    return merge(commonConfig, {
        devtool: 'source-map',
        ...
    });
}
```

#### alias

最后还剩一个问题。上面的命令行似乎有点太长，开发过程中你不会想要每次都记忆和输入那么一长串命令的。

- `npm config set myApp:lang en && npm run dev`
- `npm run dev -- --env.lang=cn`

何况这还只是一个参数的时候，参数多了那就更冗长了。

所以，我们需要一种方式来将它缩短。借助 shell 或者配置 alias，能够一定程度达到目的。让这些复杂的参数组合在 shell 中去处理，执行时只输入必要的命令和变化的参数。这里就看具体业务具体参数情况来具体处理了。

将常用的命令放入 `npm start` 中，同时在 webpack 配置文件中设置默认值，这样简单的 `npm start` 命令就可以满足平时大部分时间的开发所需，不用经常输入很多命令行参数。

_package.json_
```js
{
    "scripts": {
        "start": "webpack --config webpack.dev.js",
    }
}
```

_`webpack.dev.js` 上线配置：_

```js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = env => {

    const lang = (env && env.lang) || 'cn';// 设置好默认值

    return merge(common(env), {
        devtool: 'source-map',
        ...
    });
}
```


### 总结

前面总结了四种向 webpack 中传递参数的方式，真正意义上能够动态传参的有三种，其中方式二与方式三都是通过 npm config 实现，只是使用上有区别。最后一种社区里见得多，也与 webpack 比较搭，算是更加倾向的方案吧。


### 相关资料

- [webpack 配置导出为函数](https://webpack.js.org/configuration/configuration-types/#exporting-a-function)
- [命令行配置信息/CLI Option](https://webpack.js.org/api/cli/#common-options)
- [npm config](https://docs.npmjs.com/misc/config)
- [cross-var](https://www.npmjs.com/package/cross-var)
- [cross-env](https://github.com/kentcdodds/cross-env)
- [Passing args into run-scripts #5518](https://github.com/npm/npm/pull/5518)
- [npm config 中参数跨平台的问题](https://stackoverflow.com/questions/42166632/how-to-use-npm-config-variables-cross-platform-win-linux)
- [Externally-located 'npm run' scripts in package.json on Windows?](https://stackoverflow.com/questions/23201024/externally-located-npm-run-scripts-in-package-json-on-windows)
- [npm scripting: configs and arguments... and some more tricks](http://www.marcusoft.net/2015/08/npm-scripting-configs-and-arguments.html)
- [How to Pass Arguments to a Bash-Script](https://www.lifewire.com/pass-arguments-to-bash-script-2200571)
 
