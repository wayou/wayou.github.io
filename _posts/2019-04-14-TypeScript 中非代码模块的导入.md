---
layout: post
title: "TypeScript 中非代码模块的导入"
date: 2019-04-14 21:04:00 +0800
tags: 
---
    
TypeScript 中非代码模块的导入
===

需要理解的是，TypeScript 作为语言，他只处理代码模块。其他类型的文件这种非代码模块的导入，讲道理是通过另外的打包工具来完成的，比如 Web 应用中的图片，样式，JSON 还有 HTML 模板文件。只是我们需要在 TypeScript 层面解决模块解析报错的问题。

## 通配符模块声明

直接导入非代码模块，TypeScript 会报错。

```ts
/** 🚨 Cannot find module './index.html'. */
import * as html from "./index.html";
```

TypeScript 文档中关于这部分的描述是 [Wildcard module declarations](https://www.typescriptlang.org/docs/handbook/modules.html)，即通过定义通配符模块。与 [SystemJS](https://github.com/systemjs/systemjs/blob/master/docs/overview.md#plugin-syntax) 和 [AMD](https://github.com/amdjs/amdjs-api/blob/master/LoaderPlugins.md) 一致，在导入时路径上加上定义好的文件类型前后缀，这些路径上的额外信息在编译后可通过运行时实际的加载器中相应的插件来解析处理。

_typings.d.ts_
```ts
declare module "*!text" {
    const content: string;
    export default content;
}
// Some do it the other way around.
declare module "json!*" {
    const value: any;
    export default value;
}
```

_main.ts_
```ts
import fileContent from "./xyz.txt!text";
import data from "json!http://example.com/data.json";
console.log(data, fileContent);
```

使用定义类型前后缀的方式是可以解决代码中 TypeScript 报错的问题，但编译后因为模块地址中的类型前缀或后缀（`!text`,`json!`）没有去掉，这就需要对 `require` 定义相应的插件来处理。

```sh
$ node main.js
internal/modules/cjs/loader.js:670
    throw err;
    ^

Error: Cannot find module './xyz.txt!text'
```

如果你看过 [VSCode 的源码](https://github.com/Microsoft/vscode/blob/master/src/vs/editor/browser/viewParts/selections/selections.ts#L6)，会发现里面大量使用了有类似这样的方式导入样式文件：

```ts
import 'vs/css!./selections';
```

这里 `vs/css!` 便是上面提到的方式，但 VSCode 是使用了[自定义](https://github.com/Microsoft/vscode/blob/master/src/vs/loader.js#L1491)的一个模块加载器 [Microsoft/vscode-loader](https://github.com/Microsoft/vscode-loader) 来处理。

还可以像下面这样来进行文件类型的声明：

_typings.d.ts_
```ts
declare module "*.html" {
  const value: string;
  export default value;
}
```

然后写正常的路径来导入即可，编译后的产出中路径没有改变。

```ts
/** ✅ ojbk */
import * as html from "./index.html";
```

对于其他类型的后缀同理。

_typings.d.ts_
```ts
declare module "*.png" {
  const value: string;
  export default value;
}

declare module '*.scss' {
  const content: any;
  export default content;
}
```

需要注意的是，这只是解决了 TypeScript 的模块解析报错的问题，实际文件的导入并不是在 TypeScript 中做的，而需要额外的打包工具。Webpack 中则是相应的样式 loader 和 图片 loader 来负责这些文件的解析加载。


## JSON 文件的导入

因为 JSON 格式太过常见，TypeScript 确实在自己的编译器中提供了对其加载的支持，通过相应的编译参数 `--resolveJsonModul` 来开启。

创建 `tsconfig.json` 开启对 JSON 文件导入的支持。

_tsconfig.json_
```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "resolveJsonModule": true
  }
}
```

然后代码中导入 JSON 文件时指定正确的路径，像其他正常的 TypeScript 模块一样。无须前缀，也无须编写额外的声明文件。

_main.ts_
```ts
import * as data from "./bar.json";
console.log(data);
```

当尝试编译上面代码时，你会得到如下的报错：

```sh
$ tsc
error TS5055: Cannot write file '/Users/wayou/Documents/dev/github/ts-wildcard-module/bar.json' because it would overwrite input file.
```

因为编译后 JSON 文件也会有一份同名的产出，在没有指定编译输出目录的情况下， tsc 默认输出到当前目录，所以会有上面 JSON 文件会被覆盖的提示。所以解决办法就是添加输出目录的配置。

_tsconfig.json_
```diff
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "resolveJsonModule": true,
+    "outDir": "dist"
  }
}
```

再次编译后可正常运行。

```sh
$ tsc
$ node dist/main.js
{ data: 'blah' }
```

配合着 `esModuleInterop` 选项可以让导入更加简洁。

_tsconfig.json_
```diff
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
+    "esModuleInterop": true,
    "resolveJsonModule": true,
    "outDir": "dist"
  }
}
```

_main.ts_
```diff
- import * as data from "./bar.json";
+ import data from "./bar.json";
console.log(data);
```

## 总结

一般项目中都使用专门的打包工具比如 Webpack，Parcel 等，资源的解析加载都会被很好地处理。只是我们需要解决 TypeScipt 模块解析报错的问题，此时可通过对相应文件编写声明文件的方式。

## 相关资源

- [Wildcard module declarations](https://www.typescriptlang.org/docs/handbook/modules.html)


    