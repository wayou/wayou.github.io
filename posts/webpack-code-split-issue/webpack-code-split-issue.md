# Webpack SplitChunksPlugin 的三种模式

自 Webpack 4 开始，自带的 `SplitChunksPlugin` 替代了之前的 `CommonsChunkPlugin` 插件，对代码自动进行拆分（Code Split）的优化，并伴随一个默认的配置能满足大部分情况下的代码优化。

### sync 与 asycn 脚本

继续之前先讨论一下 sync 与 async 类型的脚本。

- sync 类型的脚本需要同步加载到页面，bundle 中正常 import/require 的代码。这种 sync 类型的代码生成的 bundle 脚本是通过在页面写 `<script>` 标签进行加载的。如果有多个这样的脚本，需要按顺序写标签进行加载。
- async 类型的脚本是通过异步拉取，按需加载到页面中的，比如代码中使用 `import()` 加载的脚本。

**小贴士：这里顺便区分一下 `bundle` 与 `chunk`。前者是个更大的单位，可理解成根据 `entry` 配置生成的一个输出，而 chunk 可理解成从 bundle 中拆分出来的更小粒度代码形成的文件。本质上这个界定也没那么严格，或者解释也没有那么统一，只是可以这先么理解。**

### 默认配置

`SplitChunksPlugin` 的默认配置：

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "~",
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

默认配置下，会根据如下条件进行代码优化：

- 优化只针对动态引入的模块，即 async 类型脚本，因为对原始（initial） sync 类型的 bundle 进行拆分会产生新的 bundle，这个新产生的 bundle 需要被正确地在页面引入才能工作，这超出了 Webpack 作为脚本编译的范畴（将脚本插入页面是 [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) 干的事情）。
- 新产生的 chunk 来自 `node_modules` 或可被多个地方复用。
- 新 chunk 需要大于 30kb
- 对 chunks 的最大同时请求数小于等于 5。换句话说，如果拆分后导致 bundle 需要同时异步加载的 chunk 数量大于 5 个或更多时，则不会进行拆分，因为增加了请求数，得不偿失。
- 拆分后需要尽量做到对于入口文件中最大同时请求数控制在 3 个以内。

在满足最后两个条件时，决定了 chunks 应越大越好，而不是越多。

### chunks 配置项

这里主要讨论配置中的 `chunks` 配置项。它的可选值有

- `async`: 只优化动态加载的代码，其他类型的代码正常打包。
- `all`:
- `initial`:
- `function(chunk)` 自定义拆分函数，不讨论

#### 示例

下面通过示例看看三者在对正常与动态加载的代码效果上有什么区别。示例借用自 [Webpack 4 — Mysterious SplitChunks Plugin](https://medium.com/dailyjs/webpack-4-splitchunks-plugin-d9fbbe091fd0)，有调整。通过 [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) 查看编译输出的组成情况。

_a.js_

```js
import "react";
import("lodash");
import "jquery";

console.log("a");
```

_b.js_

```js
import("react");
import("lodash");
import "jquery";

console.log("b");
```

_webpack.config.js_

```diff
module.exports = {
  entry: {
    a: "./a.js",
    b: "./b.js"
  },
  output: {
    filename: "[name].bundle.js"
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
+          chunks: "async",
          priority: 1
        }
      }
    }
  },
  plugins: [new BundleAnalyzerPlugin()]
};
```

准备了两个入口文件，都引入了三个 npm 库，jquery,react,lodash。

- jquery 均同步引入
- 其中 react 在 a 文件同步引入而 b 中动态加载，
- lodash 在两者中均动态引入

#### async

根据上面的配置，执行 `npx webpack` 先看 async 模式下的输出。

![async 模式下的输出](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/webpack-code-split-issue/assets/async.png)

_async 模式下的输出_

- 在 a,b 中均同步引入的 jquery 被打包进了各自的 bundle 中没有拆分出来共用，因为这种模式下只会优化动态加载的代码。
- react 打了两份
  - 一份在 a 自己的 bundle 中，因为它同步引入了 react，而我们只优化动态加载的代码，所以这里的 react 不会被优化拆分出去。
  - 一份在单独的文件中，它是从 b 里面拆出来的，因为 b 中动态加载了 react。
- lodash 因为在 a,b 中都是动态加载，形成了单独的 chunk 被 a, b 共用。

#### initial

![`initial` 模式下的输出](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/webpack-code-split-issue/assets/initial.png)

_`initial` 模式下的输出_

`initial` 即原始的拆分，原则就是有共用的情况即发生拆分。动态引入的代码不受影响，它是无论如何都会走拆分逻辑的（毕竟你要动态引入嘛，不拆分成单独的文件怎么动态引入？！）。而对于同步引入的代码，如果有多处都在使用，则拆分出来共用。

- jquery 在这种模式下发生了变化。形成了单独的 chunk 供 a,b 共用。
- react 没有变，因为它在 a,b 中引用的方式不同，所以不会被当成同一个模块拆分出来共用，而是走各自的打包逻辑。在 a 中同步引用，被打入了 a 的 bundle。在 b 中动态引入所以拆分成了单独的文件供 b 使用。
- lodash 没变，形成单独一份两者共用。

#### all

从上面 `initial` 模式下我们似乎看出了问题，即 在 a 中同步引入在 b 中动态引入的 react，它其实可以被抽成文件供两者共用的，只是因为引入方式不同而没有这样做。

所以 `all` 这种模式下，就会智能地进行判断以解决这个问题。此时不关心引入的模块是动态方式还是同步方式，只要能正确判断这段代码确实可以安全地进行拆分共用，那就干吧。

*需要注意的是这里需要设置 `minSize` 以使 `react` 能够正确被拆分，因为它小于 30k，在同步方式下，默认不会被拆分出来（联想文章开头提到的那些条件）。*

```diff
cacheGroups: {
 vendor: {
    chunks: "all",
    test: /[\\/]node_modules[\\/]/,
+    minSize: 0,
 }
}
```

![`all` 模式下的输出](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/webpack-code-split-issue/assets/all.png)

_`all` 模式下的输出_


### 结论

看起来似乎 `all` 是最好的模式，因为它最大限度地生成了复用的代码，Webpack 默认就走这个模式打包不就得了。

在开头的时候提到过一个原因为何默认情况下只优化 `async` 代码。所以，除了 `all` 之外的另外两个选项是有存在意义的。并且，具体的优化场景需要根据具体的需求而定，`all` 所产生的效果并非所有情况下都需要。


### 相关资源

- [Webpack SplitChunksPlugin 官方文档](https://webpack.js.org/plugins/split-chunks-plugin/)
- [Webpack 4 — Mysterious SplitChunks Plugin](https://medium.com/dailyjs/webpack-4-splitchunks-plugin-d9fbbe091fd0)
