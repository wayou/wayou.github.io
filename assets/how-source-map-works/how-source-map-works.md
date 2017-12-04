## js srouce map 的原理

线上产品代码一般是编译过的，前端的编辑过程包括不限于

* 从其他语言转到 JavaScript，譬如 CoffeScript, ES6/7，TypeScript
* 代码压缩，譬如使用 UglifyJS 减小文件大小
* 代码合并，譬如分散在多个模块中的代码将其合并打包输出成一个文件

经过这一系列骚气的操作后，发布到线上的代码已经面目全非，对带宽友好了，但对开发者调试并不友好。于是就有了 source map。顾名思义，他是源码的映射，可以将压缩后的代码再对应回未压缩的源码。使得我们在调试线上产品时，就好像在调试开发环境的代码。

### 来看一个工作的示例

准备两个测试文件，一个 `log.js` 里包含一个输出内容到控制台的函数：

log.js
```js
function sayHello(name) {
    if (name.length > 2) {
        name = name.substr(0, 1) + '...'
    }
    console.log('hello,', name)
}
```

一个`main.js` 文件里面对这个方法进行了调用：
main.js
```js
sayHello('世界')
sayHello('第三世界的人们')
```

我们使用 `uglify-js` 将两者合并打包并且压缩。

```bash
npm install uglify-js -g
uglifyjs log.js main.js -o output.js --source-map "url='/output.js.map'"
```

安装并执行后，我们得到了一个输出文件 `output.js`，同时生成了一个 source map 文件 `output.js.map`。

output.js
```js
function sayHello(name){if(name.length>2){name=name.substr(0,1)+"..."}console.log("hello,",name)}sayHello("世界");sayHello("第三世界的人们");
//# sourceMappingURL=/output.js.map
```

output.js.map
```json
{"version":3,"sources":["log.js","main.js"],"names":["sayHello","name","length","substr","console","log"],"mappings":"AAAA,SAASA,SAASC,MACd,GAAIA,KAAKC,OAAS,EAAG,CACjBD,KAAOA,KAAKE,OAAO,EAAG,GAAK,MAE/BC,QAAQC,IAAI,SAAUJ,MCJ1BD,SAAS,MACTA,SAAS"}
```

为了能够让 source map 能够被浏览器加载和解析，

* 再添加一个 `index.html` 来加载我们生成的这个`output.js` 文件。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>source map demo</title>
</head>
<body>
    source map demo
    <script src="output.js"></script>
</body>
</html>
```

* 然后开启一个本地服务器，这里我使用 python 自带的server 工具：

```bash
python3 -m http.server
```

* 在浏览器中开启 source map 
`source map` 在浏览器中默认是关闭的，这样就不会影响正常用户。当我们开启后，浏览器就根据压缩代码中指定的 source map 地址去请求 map 资源。

![在浏览器中开启 source map](enable-source-map-in-chrome-devtool.png)

_在浏览器中开启 source map_


最后，就可以访问 `http://localhost:8000/` 来测试我们的代码了。

![在压缩过的代码中打断点](debugger-in-output.png)

_在压缩过的代码中打断点_

从截图中可以看到，开启 source map 后，除了页面中引用的 `output.js` 文件，浏览器还加载了生成它的两个源文件，以方便我们在调试浏览器会自动映射回未压缩合并的源文件。

为了测试，我们将 output.js 在调试工具中进行格式化，然后在 `sayHello` 函数中打一个断点，看它是否能将这个断点的位置还原到这段代码真实所在的文件及位置。

刷新页面后，我们发现，断点正确定位到了 `log.js` 中正确的位置。

![](source-retrive.png)

会否觉得很赞啊！

下面我们来了解它的工作原理。


### source map 的格式

source map 并不在一个权威的规范中，它存在于一个普通的 Google 文档中，这你敢信？！[Source Map Revision 3 Proposal](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?hl=en_US&pli=1&pli=1)，即便如此，作为一个野鸡规范，它已经被各主流浏览器实现，因为实在太好用了。

```js
{
    "version": 3,
    "file": "out.js",
    "sourceRoot": "",
    "sources": ["foo.js", "bar.js"],
    "sourcesContent": [null, null],
    "names": ["src", "maps", "are", "fun"],
    "mappings": "A,AAAB;;ABCDE;"
}
```

* `version`: 版本，目前最新的规范为版本3
* `file`: 可选，与这个 map 文件绑定的生成文件
* `sourceRoot`: 可选，
* `sources`: 可选，`mappings` 中需要映射回的源文件，也是生成压缩文件的那些源文件
* `sourcesContent`: 可选，与 `srouces` 指定的文件一一对应的文件内容，在源文件获取不到的情况下很有用（比如没有将生成发版代码的源代码发布到服务器）。未指定则使用 `null` 表示。
* `names`: 源码中所有符号化的字符，`mappings` 中会使用到 
* `mappings`: 用一个字符串表示的编码过后的映射数据

其中，mappings 使用叫作 Base 64 VLQ 的格式来进行编码的，该字段可以被拆成如下部分：

* 用`;`分号分隔的每一组表示压缩后文件中的每一行
* 每一组又是由 `,`逗号分隔的片段
* 每一个小的片段是由长度为1,4或者5的 [VLQ/Variable-length quantity](https://en.wikipedia.org/wiki/Variable-length_quantity)

也就是说，每个小片段是长为5位，其中，每一位所代表的意思为：

1. 生成文件中的列号
2. `sources` 数组中的序号
3. 源文件中的行号
4. 源文件中的列号
5. `names` 数组中的序号

其中，所有的值都是相对于上一组中相应位置的值。

之所以采用 VLQ 并且使用相对计数，因为可以大大节省空间。

要进一步了解其中原理，我们需要搞清楚 VLQ 是怎样的存在。

### VLQ (Variable-length quantity)

下图展示了如何使用 Base 64 VLQ 进行计数。

![Base 64 VLQ 计数规则](vlq-counting-chart.png)

_Base 64 VLQ 计数规则_

由此可知，mappings 中每一片段也就是那些字母，代表了一串数字。

拿我们上面示例代码生成的 map 文件为例，方便查看，我们格式化了一下：

```json
{
  "version": 3,
  "sources": [
    "log.js",
    "main.js"
  ],
  "names": [
    "sayHello",
    "name",
    "length",
    "substr",
    "console",
    "log"
  ],
  "mappings": "AAAA,SAASA,SAASC,MACd,GAAIA,KAAKC,OAAS,EAAG,CACjBD,KAAOA,KAAKE,OAAO,EAAG,GAAK,MAE/BC,QAAQC,IAAI,SAAUJ,MCJ1BD,SAAS,MACTA,SAAS"
}
```

这里，`AAAA` 表示 `[0,0,0,0]`, `SAASA` 表示 `[90090]`。

现在，我们来尝试看是否能够读懂我们示例代码生成的 map 文件。

首页我们注意到，这些


### 相关资料

* [Source Map Revision 3 Proposal](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?hl=en_US&pli=1&pli=1)
* [Variable-length quantity](https://en.wikipedia.org/wiki/Variable-length_quantity)
* [Base64](https://en.wikipedia.org/wiki/Base64)
* [Map Preprocessed Code to Source Code](https://developers.google.com/web/tools/chrome-devtools/javascript/source-maps)
* [Source map visualizer tool](http://sourcemapper.qfox.nl/)
