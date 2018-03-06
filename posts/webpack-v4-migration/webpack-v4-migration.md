## webpack v4 尝鲜

按照 webpack 其在 Github 上的[日程表](https://github.com/webpack/webpack/milestones)，不出意外地，本月迎来了 v4 正式版的发布，离发版狂魔的目标又近了一步。毕竟其发明者 [Tobias](https://medium.com/@sokra) 把正经工作辞掉全身心搞本工具，不多多发版也对不起观众不是。

然而，正如你在使用 v3 时可以看到官方文档的匮乏，遑论这新鲜出炉还热乎的 v4 呢，所以文档什么的就别想了。

但按奈不住猎奇，迅速装上进行了尝鲜升级。

### Changelog & 升级迁移

官方的 [Migration Guide](https://github.com/webpack/webpack.js.org/issues/1706) ，还在 WIP （work in progress），就是说，观望着社区的有志之士进行贡献，毕竟那么多受众嗷嗷待哺，相信不久会出炉。目前的升级，只能摸着石头过河了。所以老项目，先稳一稳，比较新的项目或者玩票性质的 side project，那必需用最新版啊，毕竟这样历史包袱最小。

还是有很多途径可以了解到新版的有用信息的，

- 关注 [webpack 的 Medium 主页](https://medium.com/webpack)，里面集中了核心贡献者写的文章，包含最新设计理念，功能介绍，使用指南等（是的，他们快把这里当成写文档的地方了）。
- webpack 源码。随源码自带的 [Examples](https://github.com/webpack/webpack/tree/master/examples) 更新是及时的，对于如何配置使用新版，有很大参考价值。即使是后面 v4 的文档到位了，源码依然是危急时刻的不二之选，如果你写过 webpack 插件，你会懂的。
- 最后，最直接的方式是迈开腿，get your hands dirty，装上新版亲自去探索。从 v3 切到 v4 后，报错一定是有的，逐个去排查，大部分应该都是插件在新的机制下不工作，或者 loader 报 warning。定位到对应组件，然后去其 github 项目页看其是否有针对 v4 适配的新版发布，以及 issues 页相关的升级适配讨论。

下面借着 [Changelog](https://github.com/webpack/webpack/releases/tag/v4.0.0) 说说升级点。


#### webpack CLI

更新成 v4 后，最先映入眼帘的是之前的 `npm scripts` run 不起来了。新版中将 webpack 命令行工具拆分到单独的仓库中，所以需要额外安装 `webpack-cli`。

> CLI has been move to webpack-cli, you need to install webpack-cli to use the CLI

```bash
npm i -D webpack-cli
```

#### 零配置，不折腾

webpack 常被诟病的一点是配置麻烦。对于小白用户或是想快速开始产品开发来说，它不让人省心。诚然，市面上有各种 Starter Kit/Boilerplate 集成了成套开发方案，总有一款大致满足需求，但难免也会根据业务自定义一些配置。

本次新版本中引入了 `mode` 配置项，开发者可在裸奔 `none`，开发 `development` 以及产品 `production` 三种模式间选择。该配置项缺省情况下默认使用 `production` 模式。

具体来说，

- `development` 模式给你极致的开发体验，包含浏览器调试相关工具，极快的增量编译，丰富全面的报错信息...
- `production` 模式则包含大量发版优化，代码压缩，丝般润滑的运行时优化，开发相关代码的排除，易用，etc.
- `none` 不使用预设，等于老版本中全部自己配置的原始状态。

注意这里裸奔模式并不推荐，正如 changelog 中据说：

> There is a hidden none mode which disables everything

它是隐藏起来的，没有正式介绍，将来文档中应该也不太提及。但通过 [webpack 源码中对于配置项的描述](https://github.com/webpack/webpack/blob/master/schemas/WebpackOptions.json#L1119)来看，确实是存在的。

```js
"mode": {
    "description": "Enable production optimizations or development hints.",
        "enum": [
        "development",
        "production",
        "none"
      ]
    },
```

其实就是将之前需要人肉重复进行的配置，优化及插件引入等工作，打包内置了，似乎0配置（#0CJS）就可以开车了，有点对标 [parcel](https://parceljs.org/) 的意思。无论如何，套餐的出炉可以让大部分人可以享受到「约定大于配置」的省心了。

所以，为原来的配置文件加上 `mode` 配置，然后可以删除很多冗余配置或插件了。

- 随着不同模式 webpack 会自动设置 `process.env.NODE_ENV` 为生产环境或产品环境，可以去掉项目中手动的设置。没有验证其设置的环境变量是否有跨平台兼容的问题，如果有的话，还需要借助 [cross-env](https://github.com/kentcdodds/cross-env) 自己搞。
- `json-loader` 可以功成身退了，新版 webpack 默认支持 json 文件的加载。
- NamedModulesPlugin 也隐退了，开发模式下自动开启。


#### 全新的插件引擎

[tapable](https://github.com/webpack/tapable) 整体更新带来 api 的变化。webpack 插件机制又是基于此库而生的。所以必然导致许多插件在新版 webpack 中会报错。其插件调用 api 变化了，同时好多 hook 也变了，有的已经不复存在。好在尝试后发现大部分重要的插件，尤其是官方 [webpack-contrib](https://github.com/webpack-contrib) 维护的，都第一时间进行了适配。

关于插件及 loader 的更新详见 [webpack 4: migration guide for plugins/loaders](https://medium.com/webpack/webpack-4-migration-guide-for-plugins-loaders-20a79b927202)。


#### R.I.P. CommonsChunkPlugin

CommonsChunkPlugin，该插件抽取共用代码，进行代码拆分，对于减少冗余及合理打包功不可没。但在新版中移除了。
别急，对应功能只是转移到了 `optimize.splitChunks` 与 `optimization.runtimeChunk` 配置项下，并且进行了加强与拓展。

在满足预设条件时，会进行自动的 trunk 拆分和抽取。详见 [RIP CommonsChunkPlugin](https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693)
或 [webpack 4: Code Splitting, chunk graph and the splitChunks optimization](https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366)。


#### HtmlWebpackPlugin

HtmlWebpackPlugin 的作者 Jan Nicklas 带着小婊子跑路了，以至于如此重要的插件没人进行 webpack v4 的更新适配。因为涉及到 html 的生成，对它的依赖度还挺高。无奈 webpack 官方 fork 了一分进行升级。
所以暂时可以安装这个 fork 的版本。

```bash
npm i -D html-webpack-plugin@webpack-contrib/html-webpack-plugin
```

前面 Jan 其实没跑路，按照 webpack 博客中的说法，人家只是劳务派遣出国了。等忙完这阵就回来更新！


#### ts-loader

非常给力的是 [ts-loader](https://github.com/TypeStrong/ts-loader) 在 webpack 新版发布后第一时间进行了更新适配。如果项目中在用 TypsScript，那可以将 ts-loader 升级到最新的 [v4.0.0](https://github.com/TypeStrong/ts-loader/releases/tag/v4.0.0) 就可以正常编译了。 

其实不止是 ts-loader， 官方 [webpack-contrib](https://github.com/webpack-contrib) 名下维护的库存不算，其他库的更新响应也很及时，给我的感觉是 webpack 凭借其积攒的实力做到现在的人气，能够振臂一呼，拥趸者众，也是实至名归。


#### cache-loader

[cache-loader](https://github.com/webpack-contrib/cache-loader)，我主要配合 [webpack-modernizr-loader](https://github.com/itgalaxy/webpack-modernizr-loader) 使用。后者可以读取 modernizr 配置文件，动态生成项目中需所依赖的 modernizr 库。因为 modernizr 配置文件不会经常变动，所以将生成的 modernizr 库存缓存起来就显得很有必要了。因为 cache-loader 的 peer dependencies 声明的是 webpack `^2.0.0 || ^3.0.0`，所以运行在 webpack v4 下会有 warning。问题倒不大，因为没有触碰 webpack 变更后的 api 所以能正常跑。将其升级到最新的 [v1.2.1](https://github.com/webpack-contrib/cache-loader/releases/tag/v1.2.1) 可以解决掉 warning。

loader 类的兼容一般都是这个原因，因为 peer dependency 报 warning。譬如 [file-loader](https://github.com/webpack-contrib/file-loader/releases/tag/v1.1.10)，webpack-modernizr-loader 等。所以 loader 部分升级较为轻松。


### 相关资源

- [webpack v4 changelog](https://github.com/webpack/webpack/releases/tag/v4.0.0)
- [webpack 4: released today!!](https://medium.com/webpack/webpack-4-released-today-6cdb994702d4)
- [webpack 4: mode and optimization](https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a)
- [webpack 4: Code Splitting, chunk graph and the splitChunks optimization](https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366)
- [RIP CommonsChunkPlugin](https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693)
- [webpack 4: migration guide for plugins/loaders](https://medium.com/webpack/webpack-4-migration-guide-for-plugins-loaders-20a79b927202)

