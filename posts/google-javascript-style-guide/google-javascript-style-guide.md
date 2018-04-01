## 一份有点过时的 JS 风格指南 - Google JavaScript Style Guide


GitHub 上有很多大厂的开源项目，是非常好的学习资源。无论是写码风格，还是设计思想，对于码农中的芸芸众生来说，都有很大借鉴意义。

特别地，如果你想要向这些优秀的开源项目贡献代码，学习并遵循其代码风格是必要的。譬如 Google 背景的项目 [angular/material2](https://github.com/angular/material2/blob/master/CONTRIBUTING.md#rules)，它要求遵循 [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)。

其规范中不少已经过时，大部分还与 Google 自身的产品及开发工具相关联，不一定适合大众，并且好些规则感觉已经不适合于现在的前端，但了解人怎么玩的也不无裨益。逐翻录如下，以飨诸君。

以下带 「注」的部分为笔记，联想《山海经注》中的「注」。

### 1 简介

> This document serves as the complete definition of Google’s coding standards for source code in the JavaScript programming language. A JavaScript source file is described as being in Google Style if and only if it adheres to the rules herein.
>
>Like other programming style guides, the issues covered span not only aesthetic issues of formatting, but other types of conventions or coding standards as well. However, this document focuses primarily on the hard-and-fast rules that we follow universally, and avoids giving advice that isn't clearly enforceable (whether by human or tool).

*注：这一段没必要看，食之无味弃之可惜就放这了。*


#### 1.1 术语介绍/Terminology notes

除非另有说明，本文档中：

注释始终指功能实现上的注释，包含在 ` /** … */` 中文档相关的注释叫 `JSDoc` 而不叫文档注释。

文档中使用的 *必须/must*，*禁止/must not*，*应该/should*，*不应该/should not* 和 *可以/may* 这些词汇，遵循 [RFC 2119](http://tools.ietf.org/html/rfc2119) 中的定义。*推荐/prefer* 和 *避免/avoid* 分别对应 *应该*，*不应该*。祈使及声明式的语句指规范性的，等同于*必须*。

此外，文档中还会穿插出现其他术语。

#### 1.2 说明

本文档中的示例代码并不是唯一 **规范**。换句话说，虽然示例代码符合 Google 风格，并不代表该代码只有这一种形式。示例中非强制的风格选项并不是必需遵循的。


### 2. 源文件

#### 2.1 文件名

文件名须全部小写，除下划线（_）和短横线（-）外，不能包含其他标点。在项目中保持一致即可。文件扩展名必须是 `.js`。

*注：这条感觉已经过时。React 的出现使得前端代码扩展名大量以 `.jsx` 或者 `tsx` 等形式出现。同时 ES6 中原生类的引入后，单个组件的文件名与类名保持一致也是惯用做法，而类名一般是大写开头的帕斯卡命名法（PascalCase）*

#### 2.2 文件编码: UTF-8

源文件采用 UTF-8 编码。

#### 2.3 特殊字符

##### 2.3.1 空格

除了换行，ASCII中的水平空格符（0x20）是代码中唯一合法的空格字符。也就是说，

- 其他类型的空格符会被忽略，并且
- Tab 是不能用来缩进的

*注：就用此条来终结缩进的争论吧*


##### 2.3.2 特殊转义字符

对于需要转义的字符 （`\'`, `\"`, `\\`, `\b`, `\f`, `\n`, `\r`, `\t`, `\v`）使用该形式的转义而不是数字形式的转义（比如 `\x0a`, `\u000a`, 或 `\u{a}`）。不再使用历史遗留的8进制转义。

*注：这条很必然啊，前者更直观。*


##### 2.3.3 非 ASCII 字符


对于非 ASCII 字符，使用 Unicode 字符本身（e.g. `∞`）或其转义形式 （e.g. `\u221e`）都可以， 视具体情况以**易用易读为准**。

**小贴士：即使使用 Unicode 原字符形式，加上并要的注释也是提倡的。**


示例 | 注释
---|---
`const units = 'μs';`	| 最佳: 无须注释也简洁明了
`const units = '\u03bcs'; // 'μs'`	| 允许，但没并要 
`const units = '\u03bcs'; // Greek letter mu, 's'`	| 允许，但看起来奇怪且容易出错
`const units = '\u03bcs';`	| 差：不方便阅读
`return '\ufeff' + content; // byte order mark`	| 良好： 对非打印字符使用转义，且加上必要注释

**小贴士：不要因为担心程序可能对非 ASCII 字符处理不当而让代码难懂。如果有这样的代码，则需要修正。**

### 3 源文件的结构

一个源文件由以下部分顺序组成：
1. 协议或版权（License or copyright ）相关信息，如果有的话
2. `@fileoverview` JSDoc，如果有的话
3. `goog.module` 声明
4. `goog.require` 声明
5. 源码正文

以上各部分用一个空行隔开，源码正文除外，源码中使用 1 到 2 个空行。


#### 3.1 协议或版权相关信息，如果有的话

如果单个文件有协议或版权信息的话，就放这儿。


#### 3.2 `@fileoverview` JSDoc，如果有的话

具体格式详见 [7.5 Top/file-level](https://google.github.io/styleguide/jsguide.html#jsdoc-top-file-level-comments)


#### 3.3 `goog.module` 声明

所有文件需要至少声明一个 `goog.module` 模块名称，该声明独占一行，不换行，且不受单行长度不超过 80 字符宽度的限制。 

`goog.module` 的全部参数决定其命名空间。由包名（能够揭示代码在项目中所在位置的标识）加上可选的该文件定义的类名/枚举名/接口名 (class/enum/interface) 拼接而成。

示例：

```js
goog.module('search.urlHistory.UrlHistoryService');
```


##### 3.3.1 层级/Hierarchy

模块的命名空间不可以命名成另一模块的直接子集。

错误的示例：

```js
goog.module('foo.bar');   // 'foo.bar.qux' would be fine, though
goog.module('foo.bar.baz');
```

目录层级揭示了命名空间的层级，所以下层一定是上层的子文件夹。所以父级模块的所有者是知道其下面的所有子模块的，因为所有子模块都在同一文件夹中。


##### 3.3.2 `goog.setTestOnly`

`goog.module` 后可跟一个 `goog.setTestOnly()` 调用。


##### 3.3.3 `goog.module.declareLegacyNamespace`

`goog.module`  声明后可跟一个 `goog.module.declareLegacyNamespace();` 调用。但应尽量譬如该调用。

示例：

```js
goog.module('my.test.helpers');
goog.module.declareLegacyNamespace();
goog.setTestOnly();
```

`goog.module.declareLegacyNamespace` 是为了从对象层级式的命名空间平缓过渡，同时加上了些命名的限制。由于子模块的创建需要在父模块后，所以模块名不能是其他 `goog.module`（譬如 `goog.module('parent');` 和 `goog.module('parent.child');` 不能安全地共存，`goog.module('parent');` 与 `goog.module('parent.child.grandchild');` 也不行） 的父子模块。

*注：Google 相关的，外部似乎用不到*


##### 3.3.4 ES6 模块

不要使用 ES6 模块系统（i.e. `export` 及 `import` 关键字），因为其还在草案阶段。待其完全稳定后本规则会相应更新。

*注：现在都 ES2018 了也不见你更新啊*


#### 3.4 `goog.require` 声明

 使用 `goog.require` 导入模块，根据模块的声明进行分组。每个 `goog.require` 导入语句会赋值给一个或拆分后的多个的别名（alias）。除了 `goog.require` 中会使用模块全称外，这些别名是代码或类型注释中引用模块的唯一的途径。别名应尽量与以点分隔的模块名中最后一部分相匹配，除非会引起歧义或能提高可读性，那么可以加上额外的修饰。`goog.require` 语句不能出现在文件中其他地方。

如果一个模块引入是为了其产生的副作用（即后续不需要调用或引用该模块），可以不生成别名，但该模块的全称不能出现在其他地方。同时添加相应注释说明其用途，关闭编译时的警告。

导入语句按如下规则进行排序：带别名的优化，然后是解析类型的导入，均以字母顺序排列。最后是无别名的导入。

**小贴士：此规则可依赖 IDE 来处理，省去人肉操作。**

如果别名或模块名过长导致导入语句超过80字符的长度限制，忽略即可，因为导入语句不受长度规则限制。

示例：

```js
const MyClass = goog.require('some.package.MyClass');
const NsMyClass = goog.require('other.ns.MyClass');
const googAsserts = goog.require('goog.asserts');
const testingAsserts = goog.require('goog.testing.asserts');
const than80columns = goog.require('pretend.this.is.longer.than80columns');
const {clear, forEach, map} = goog.require('goog.array');
/** @suppress {extraRequire} Initializes MyFramework. */
goog.require('my.framework.initialization');
```

一个错误的示例：

```js
const randomName = goog.require('something.else'); // 注：乱取名字

const {clear, forEach, map} = // 注：导入语句不要换行
    goog.require('goog.array');

function someFunction() {
  const alias = goog.require('my.long.name.alias'); // 注：导入语句不能出现在顶部之外的其他位置
  // …
}
```

##### 3.4.1 `goog.forwardDeclare`

`goog.forwardDeclare` 不常用，但在解决循环引用，实现延迟导入时很有用。这些分组呈现，语句紧随 `goog.require` 之后。良好的 `goog.forwardDeclare` 写法应与`goog.require` 保持一致。


#### 3.5 源码正文

源码正文跟随在所有依赖声明之后，用至少一个空行进行分隔。

正文可以由各种声明（常量，变量，类，函数等），以及需要导出的东西。


### 4 格式化

**术语解释**：代码块（block-like construct）_指类，函数，方法这些元素的正文部分，或花括号包裹的代码部分。参考 [5.2 Array literals](https://google.github.io/styleguide/jsguide.html#features-array-literals) [5.3 Object literals](https://google.github.io/styleguide/jsguide.html#features-object-literals) 的定义，数组或对象也可能被当作「代码块」。

**小贴士：使用 `clang-format`。社区已经做了大量努力以使得 `clang-format` 能够很好地处理 JavaScript 文件。同时一些流行的编辑器也已集成了 `clang-format`。**


#### 4.1 括号

##### 4.1.1 括号用于各种控结构（control structures）

括号用在各种控制结构中（譬如 `if`，`else`，`for`，`do`，`while` 等），即使结构中只包含一句代码。


错误的示例：

```js
if (someVeryLongCondition())
  doSomething();// 注：即使一行也需要花括号包裹

for (let i = 0; i < foo.length; i++) bar(foo[i]);// 注：控制块正文需要另起一行
```

**例外**：没有 `else` 拼盘且控制体中只有简单一句代码的 `if` 语句可以保留成一行并且略去花括号，如果这样可以提高可读性的话。这是唯一一种可以不换行不带花括号的控制结构写法。

```js
if (shortCondition()) return;
```

*注：开这样的例外不是好事，保持统一最好，这样不用犹豫，规则也简单。关键这个写法除了省去一行代码外并没有太提高可读性啊。*


##### 4.1.2 非空代码块：K&R 风格

非空代码块使用的花括号遵循 Kernighan and Ritchie 风格 (也即 [Egyptian brackets](http://www.codinghorror.com/blog/2012/07/new-programming-jargon.html))：
- 左花括号不另起新行
- 左花括号后紧跟换行
- 右花括号前需要换行
- 如果右花括号结束了语句，或者它是函数、类、类中的方法的结束括号，则其后面需要换行。如果后面紧跟的是 `else`，`catch` 或 `while`，或逗号，分号以及右括号，则不需要跟一个换行。


示例：

```js
class InnerClass {
  constructor() {}

  /** @param {number} foo */
  method(foo) {
    if (condition(foo)) {
      try {
        // Note: this might fail.
        something();
      } catch (err) {
        recover();
      }
    }
  }
}
```

*注：这就是正常的 code formatting，规则定好后格式化工具自动会做，无须人去干预。*


##### 4.1.3 空代码块：应紧凑

对于空代码块打开的时候就应立即闭合，中间不留空格，换行以及其他任何字符（i.e. `{}`），除非该代码块处于一个连续的声明语境中（譬如这些带有多个代码块的语句 `if/else`，`try/catch/finally`）。

示例：

```js
function doNothing() {}
```

错误的示例：

```js
if (condition) {
  // …
} else if (otherCondition) {} else { //注：因为处于一个连续的代码块语境，中间这个花括号应该包含换行的
  // …
}

try {
  // …
} catch (e) {} // 注：最后个花括号是需要有换行的
```


#### 4.2 代码块中的编进：+2 个空格

新开代码块中代码需要加 2 个空格的缩进。代码块结束时缩进恢复到上一级。这个增加的缩进应用于整个代码块，包括其中的注释 （示例见 [4.1.2 Nonempty blocks: K&R style](https://google.github.io/styleguide/jsguide.html#formatting-nonempty-blocks)）。

*注：这还用说？！*


##### 4.2.1 数组字面量：类代码块（block-like）

数组类型的字面量可以按照代码块的规则来格式化。以下的示例并没有例举所有情况。

```js
const a = [
  0,
  1,
  2,
];

const b =
    [0, 1, 2]; //注：这，有点奇怪吧
```

```js
const c = [0, 1, 2];

someMethod(foo, [
  0, 1, 2,
], bar);

// 注：这才是我更加倾向的做法，毕竟这种写法对于数组元素的兼容性要好一些，不管元素是啥有多长
// someMethod(foo, [
//   0,
//   1,
//   2,
// ], bar);
```

其他形式的组合格式也是允许的。


##### 4.2.2 对象字面量：类代码块

对象字面量也可以当作代码块处理，规则与上面数组字面量类似。以下示例都是合法的：

```js
const a = {
  a: 0,
  b: 1,
};

const b =
    {a: 0, b: 1}; // 注：是真的接受不了这种写法，除非同时声明多个变量或有多个赋值操作的情况下
```

```js
const c = {a: 0, b: 1};

someMethod(foo, {
  a: 0, b: 1,// 注：同样地，还是习惯将对象再竖向展开着书写
}, bar);

```

##### 4.2.3 类（Class）

类（声明或表达式）的缩进也是按照代码块来处理的。其中的方法及类本身结束的花括号后不加分号（但如果语句操作中有类，比如赋值语句，则整个语句是带分号的）。 除继承自 templatized type 时使用JSDoc 的 `@extends` 注释，其他情况都使用 `extends` 关键字。

示例：

```js
class Foo {
  constructor() {
    /** @type {number} */
    this.x = 42;
  }

  /** @return {number} */
  method() {
    return this.x;
  }
}
Foo.Empty = class {};
```

```js
/** @extends {Foo<string>} */
foo.Bar = class extends Foo {
  /** @override */
  method() {
    return super.method() / 2;
  }
};

/** @interface */
class Frobnicator {
  /** @param {string} message */
  frobnicate(message) {}
}
```

#### 4.2.4 函数表达式

使用匿名函数作为参数时，其缩进相比调用处进一层。

*注：这还用说*

示例：

```js
prefix.something.reallyLongFunctionName('whatever', (a1, a2) => {
  // Indent the function body +2 relative to indentation depth
  // of the 'prefix' statement one line above.
  if (a1.equals(a2)) {
    someOtherLongFunctionName(a1);
  } else {
    andNowForSomethingCompletelyDifferent(a2.parrot);
  }
});

some.reallyLongFunctionCall(arg1, arg2, arg3)
    .thatsWrapped()
    .then((result) => {
      // Indent the function body +2 relative to the indentation depth
      // of the '.then()' call.
      if (result) {
        result.use();
      }
    });
```

##### 4.2.5 Switch 语句

一如其他代码块一样，switch 语句中每个条件块也是增加 2 个空格的缩进。
每个 switch 标签后新起一行，加缩进，就像是创建了一个带花括号的代码块一样。每个标签开始时缩进又恢复，相当于只有 switch 标签中的内容是当作代码块来处理的。

`break` 关键字后面的空行是可选的。

示例：

```js
switch (animal) {
  case Animal.BANDERSNATCH:
    handleBandersnatch();
    break;

  case Animal.JABBERWOCK:
    handleJabberwock();
    break;

  default:
    throw new Error('Unknown animal');
}
```


#### 4.3 声明语句

##### 4.3.1 一个声明占一行

每个声明语句后都跟换行。


##### 4.3.2 分号是必需的

语句后需用分号结束。不能依赖于编辑器的自动分号插入功能。


#### 最大列宽：80

对于 JavaScript 源码，规定其单行长度不超过 80 字符。除以下列出的情形外，超出的时候需要根据 [4.5 Line-wrapping](https://google.github.io/styleguide/jsguide.html#formatting-line-wrapping) 来进行换行操作。

例外的情形：
- 根本无法满足限制的地方（譬如 JSDoc 中的一个超长链接，复制进来的 bash 脚本等）
- `goog.module` 和 `goog.require` 语句（详见  [3.3 goog.module statement](https://google.github.io/styleguide/jsguide.html#file-goog-module) and [3.4 goog.require statements](https://google.github.io/styleguide/jsguide.html#file-goog-require)）


#### 4.5 换行

**术语解释**：_换行_指将一个表达式拆分成多行展示。

并没有一个全面准确的的规则来指导每种场景下该如何换行，相反，对同一段代码往往存在多种合法的换行方式。

**注释：尽管换行大多时候是为了满足列宽限制，但在满足的情况下，编码过程中每个人做法也不尽相同，这是可以的。**

**小贴士：抽取方法或变量有可能会规避掉换行的问题。**


##### 4.5.1 何处该换行

换行的的准则是：尽量在优先级高的语法层面（higher syntactic level）进行。

推荐：

```js
currentEstimate =
    calc(currentEstimate + x * currentEstimate) /
        2.0f;
```

不推荐：

```js
currentEstimate = calc(currentEstimate + x *
    currentEstimate) / 2.0f;
```

上面示例中，语法优先级从高到低依次为：赋值，除法，函数调用，参数，数字常量。

操作符的规则：

1. 在操作符处换行时，换行发生在操作符后面（此条不适合于 Google 风格的 Java）。对于 `.` 点不适用，因为点不算作是一个操作符。
2. 方法或构造函数名与左括号保持在一行
3. 逗号（`,`）与换行在同一行

**注释：换行首要目的是保持代码整洁，当最小行数能满足需求时，换行是不需要的。**


##### 4.5.2 换行后后续行至少有 4 个空格的缩进

当发生换行时，第一行后面跟着的其他行至少缩进 4 个空格，除非满足代码块的缩进规则，另说。

换行后后续跟随多行时，缩进可适当大于 4 个空格。通常，语法中低优先级的后续行以 4 的倍数进行缩进，如果只有两行并且处于同一优先级，则保持一样的缩进即可。

[4.6.3 Horizontal alignment: discouraged](https://google.github.io/styleguide/jsguide.html#formatting-horizontal-alignment) 讨论了避免使用不定数目空格以保持缩进在各行间对齐的做法。


*注：这一条没提供示例，虽然大致能理解，还是有点不直观*。


#### 4.6 空格

##### 4.6.1 垂直方向的空格

以下场景需要有一个空行：

1. 类或对象中的方法间
  a. 例外的情形：对象中属性间的空行是可选的。如果有的话，一般是用来将属性进行分组。
2. 方法体中，尽量少地使用空行来进行代码的分隔。函数体开始和结束都不要加空行。
3.类或对象中首个方法前及最后一个方法后的空行，既不提倡也不反对。
4. 适用此风格中其他条目的规定（e.g.[3.4 goog.require statements](https://google.github.io/styleguide/jsguide.html#file-goog-require)）。

连续多个空行不是必需的，但了不鼓励这么做。


##### 4.6.2 水平方向的空格

水平方向的空格依位置为定，有三种大的分类：行首（一行的开始），行尾（一行的结束）以及行间（一行中除去行首及行尾的部分）。行首的空格（i.e. 缩进）无处不在。行尾的空格是禁止的。

除了 Javascript 本身及其他规则的要求，还有字面量，注释，JSDoc 等需要的空格外，单个的 ASCII 类型的空格在以下情形中也是需要的。

1. 将关键字（譬如 `if`，`for`，`catch`）与括号（`(`）分隔。
2. 将关键字（`else`，`catch`）与闭合括号（`}`） 分隔。
3. 对于左花括号有两种例外：
  a. 作为函数首个参数的对象之前，数组中首个对象元素 （e.g. `foo({a: [{c: d}]})`）
  b. 在模板表达式中，因为模板语法的限制不能加空格（e.g. `abc${1 + 2}def`）。
4. 二元，三元操作符的两边
5. 逗号或分号后。但其前面是不允许有空格的。
6. 对象字面量中冒号后面。
7. 双斜线（`//`）两边。这里可以使用多个空格，但也不是必需的。
8. JSDoc 注释及其两边
e.g. 简写的类型声明 `this.foo = /** @type {number} */ (bar);` 或类型转换（cast）` function(/** string */ foo) { `。

##### 4.6.3 水平对齐：不鼓励

**术语解释**： _水平对齐/Horizontal alignment_ 通过添加不定量的空格以使文本与上一条文本保持相同的缩进。

这种做法是允许的，但 Google 风格里面着实不推荐。甚至在已经存在的代码中也不鼓励继续使用这种方式进行维护。

下面的示例中展示了正常的代码及带水平对齐的代码，后者是不推荐的。

```js
{
  tiny: 42, // this is great
  longer: 435, // this too
};

{
  tiny:   42,  // permitted, but future edits
  longer: 435, // may leave it unaligned
};
```

**小贴士：对齐后提高了可读性，但后续维护不方便。设想你只改了一行代码，这个对齐就破坏掉了，但破坏掉之后的格式是允许的。为了好看，这要求修改者需要手动去调整空格，由此可能会引发其他行的格式问题。这些额外的工作是无意义的，但会影响提交记录，增加代码审阅成本和合并解决冲突时的成本。**

##### 4.6.4 函数参数 

推荐将函数的所有参数放在与函数名同一行的位置。如果这样会导致列宽超限，那参数应该以一种易读的方式进行换行。为了节省空间，尽量超过宽度限制时才进行换行，换行后每个参数一行以提高可读性。换行后缩进为 4 个空格。与括号对齐是可以的，但不推荐。以下是觉的参数换行示例：

```js
// Arguments start on a new line, indented four spaces. Preferred when the
// arguments don't fit on the same line with the function name (or the keyword
// "function") but fit entirely on the second line. Works with very long
// function names, survives renaming without reindenting, low on space.
doSomething(
    descriptiveArgumentOne, descriptiveArgumentTwo, descriptiveArgumentThree) {
  // …
}

// If the argument list is longer, wrap at 80. Uses less vertical space,
// but violates the rectangle rule and is thus not recommended.
doSomething(veryDescriptiveArgumentNumberOne, veryDescriptiveArgumentTwo,
    tableModelEventHandlerProxy, artichokeDescriptorAdapterIterator) {
  // …
}

// Four-space, one argument per line.  Works with long function names,
// survives renaming, and emphasizes each argument.
doSomething(
    veryDescriptiveArgumentNumberOne,
    veryDescriptiveArgumentTwo,
    tableModelEventHandlerProxy,
    artichokeDescriptorAdapterIterator) {
  // …
}
```


#### 4.7 用括号显式分组：推荐

只有代码作者和审阅者都觉得如果不分组不会引起歧义，并且加了分组也不会让代码变得更易读，那么分组可以省略。因为，不是每个人都将操作符优先级熟记于心。

对于这些关键字，不要添加额外的分组 `delete`，`typeof`，`void`，`return`，`throw`，`case`，`in`，`of` 以及 `yield`。

类型转换时需要使用括号强制分组：`/** @type {!Foo} */ (foo)`。


#### 4.8 注释

本规则讨论注释的写法。JSDoc 相关的注释单独在 [7 JSDoc](https://google.github.io/styleguide/jsguide.html#jsdoc) 讨论。


##### 块状注释

块状注释与被注释代码保持相同缩进。`/* ... */` 和 `//` 都是。对于多行的 `/* ... */` 注释，后续注释行以 `*` 开头且与上一行缩进保持一致。参数的注释紧随参数之后，用于在函数名或参数名无法完全表达其意思的情况。

```js
/*
 * This is
 * okay.
 */

// And so
// is this.

/* This is fine, too. */

someFunction(obviousParam, true /* shouldRender */, 'hello' /* name */);
```

注意区分 JSDoc（`/** ... */`），上面不注释不能写成这样。


### 5 语言特性

JavaScript 包含众多不确定性的功能 (dubious)，还有一些是很危险的。本小节讨论哪些该用，哪些不该用，或者用的时候有哪些限制。


#### 5.1 本地变量的声明

##### 5.1.1 使用 `const` 和 `let`

所有本地变量使用 `const` 或 `let` 来声明。默认使用 `const`，除非该变量需要重新赋值。杜绝使用 `var`。


##### 5.1.2 一次声明一个变量

一次只声明一个本地变量，`let a = 1, b = 2;` 这样的做法是禁止的。


##### 5.1.3 需要时才声明，声明后尽快初始化

本地变量不要全部一次性声明在代码块的开头。声明在该变量每一次需要被使用的地方，以减少其影响范围。

##### 5.1.4 尽量标明类型

JSDoc 类型注释可以添加在声明语句上面，或者内联到变量名前面。

示例：

```js
const /** !Array<number> */ data = [];

/** @type {!Array<number>} */
const data = [];
```

**小贴士：许多情况下编译器是可以分析出模板化类型（templatized type）的，对于参数则不然。当初始化一个类或者构造函数的调用没有包含参数类型时（e.g. 空数组，对象，`Map`，或 `Set`），或者参数在闭包中有修改这种情形。此刻本地变量的类型声明就很有用了，不然编译器分析出来的类型都是 unknown。**

*注：不太明白这里 templatized type*


#### 5.2 数组字面量

##### 5.2.1 尾部加逗号

始终在元素后面带上一个结束的逗号。

示例：

```js
const values = [
  'first value',
  'second value',
];
```

##### 5.2.2 不要使用 `Array` 构造函数

不要使用数组的构造函数来创建数组，因为容易出错。直接使用字面量。

错误的示例：

```js
const a1 = new Array(x1, x2, x3);
const a2 = new Array(x1, x2);
const a3 = new Array(x1);
const a4 = new Array();
```

上面示例看起来都没问题，除了第三个。如果 `x1` 是整数，那么 `a3` 会是一个长度为 `x1` 的数组，如果是其他数字，则会抛异常。如果是其他非数字类型，则 `a3` 是有一个元素的数组。

相反，应该使用如下语句：

```js
const a1 = [x1, x2, x3];
const a2 = [x1, x2];
const a3 = [x1];
const a4 = [];
```

当然，传递长度给数组构造器显式地创建一个期望长度的空数组也是可以的。

##### 5.2.3 非数字类型的属性

不要向数组身上添加或使用非数字类型的属性（除 `length`）。如果需要，使用 `Map` （或 `Object`）。

##### 5.2.4 解构

数组字面量可用于赋值语句左边以进行解构操作（将数组或可遍历对象中的值解析出来的情况）。记得指定一个接收剩余值的变量（注意 `...` 与这个剩余值变量间没有空格）。未初始化的数组无数会被忽略掉。

```js
const [a, b, c, ...rest] = generateResults();
let [, b,, d] = someArray;
```

解构也可用于函数参数（参数是必需的但被忽略了）。始终指定 `[]` 为默认解构对象以防止入参是可选的情况，并且在左侧接收解构值时指定好默认值：

```js
/** @param {!Array<number>=} param1 */
function optionalDestructuring([a = 4, b = 2] = []) { … };
```

错误的示例：

```js
function badDestructuring([a, b] = [4, 2]) { … };
```

**小贴士：无论是函数参数解构还是作为返回时的解构，推荐使用对象解构而不是数组解构。因为前者可为单个元素指定名称及类型。**


##### 5.2.5 展开操作符

数组字面量可包含展开操作符（`...`）将元素从一个或多个其他可遍历的对象（iterables）中提取出来。使用开展操作符而避免使用 `Array.prototype` 这种奇怪的方式。注意 `...` 后面不跟空格。

示例：

```js
[...foo]   // preferred over Array.prototype.slice.call(foo)
[...foo, ...bar]   // preferred over foo.concat(bar)
```


#### 5.3 对象字面量

##### 5.3.1 尾部加逗号

对象属性后加结束的逗号。


##### 5.3.2 不要使用对象构造器

虽然对象构造器没有数组构造器一样的问题，为了一致，也是禁止使用的。取而代之使用对象字面量（`{}` 或 `{a: 0, b: 1, c: 2}`）。


##### 5.3.3 属性引号保持一致

对象属性分为不包含引号或 Symbols 的 _structs_ 类型和包含引号或运算属性的 _dicts_ 类型。两种类型不要混合使用，应该保持一致。

错误的示例：

```js
{
  a: 42, // struct-style unquoted key
  'b': 43, // dict-style quoted key
}
```

##### 5.3.4 运算属性/Computed property names

运算属性（e.g. `{['key' + foo()]: 42}`）是合法的，它是一种 dict-style 类型的属性，除非运算结果为 symbol (e.g. `[Symbol.iterator]`)。枚举值也可用于计算属性，但需要与非枚举区分开。


##### 5.3.5 快捷方法

对象上的方法可通过方法简写（`{method() {… }}`） 方式来定义，以取代传统的变量名后跟分号，然后才是方法声明的方式。

示例：

```js
return {
  stuff: 'candy',
  method() {
    return this.stuff;  // Returns 'candy'
  },
};
```

在简写的方法中，`this` 指向的是所在对象，而对于使用箭头函数定义的方法，其指向的是对象所在的作用域。

示例：

```js
class {
  getObjectLiteral() {
    this.stuff = 'fruit';
    return {
      stuff: 'candy',
      method: () => this.stuff,  // Returns 'fruit'
    };
  }
}
```


##### 5.3.6 快捷属性


对象字面量中可以使用快捷属性。

示例：

```js
const foo = 1;
const bar = 2;
const obj = {
  foo,
  bar,
  method() { return this.foo + this.bar; },
};
assertEquals(3, obj.method());
```


##### 5.3.7 解构

对象解构可用于从一个对象中一次性导出多个值的情况。

对象解构也可用于函数参数，但尽量保持简单：限于属性是单个快捷属性的情况。如果属性是深层嵌套的或是计算属性，则不适合用于参数解构中。同样需要在左侧接收解构时指定默认值（`{str = 'some default'} = {}` 而不是 `{str} = {str: 'some default'}`）。如果解构对象是可选的，需要指定空对象 `{}`。JSDoc 中解析的参数可指定为任意名称（该名称没有实际用途只是编译需要）。

示例：

```js
/**
 * @param {string} ordinary
 * @param {{num: (number|undefined), str: (string|undefined)}=} param1
 *     num: The number of times to do something.
 *     str: A string to do stuff to.
 */
function destructured(ordinary, {num, str = 'some default'} = {})
```

错误的示例：

```js
/** @param {{x: {num: (number|undefined), str: (string|undefined)}}} param1 */
function nestedTooDeeply({x: {num, str}}) {};
/** @param {{num: (number|undefined), str: (string|undefined)}=} param1 */
function nonShorthandProperty({num: a, str: b} = {}) {};
/** @param {{a: number, b: number}} param1 */
function computedKey({a, b, [a + b]: c}) {};
/** @param {{a: number, b: string}=} param1 */
function nontrivialDefault({a, b} = {a: 2, b: 4}) {};
```

解构也可用于 `goog.require` 语句，此时，无论多长不需要换行，整个语句占一行（见[3.4 goog.require statements](https://google.github.io/styleguide/jsguide.html#file-goog-require)）。


##### 5.3.8 枚举

通过给对象字面量添加 `@enum` 注释来定义一个枚举类型。一旦定义后，就不能添加新的类型了。枚举是常量，其值也必需是不可变的。

```js
/**
 * Supported temperature scales.
 * @enum {string}
 */
const TemperatureScale = {
  CELSIUS: 'celsius',
  FAHRENHEIT: 'fahrenheit',
};

/**
 * An enum with two options.
 * @enum {number}
 */
const Option = {
  /** The option used shall have been the first. */
  FIRST_OPTION: 1,
  /** The second among two options. */
  SECOND_OPTION: 2,
};
```


#### 5.4 类

##### 5.4.1 构造器

对于紧凑型的类（concrete classes），其构造器是可选的。子类在设置字段或访问 `this` 前调用 `super()`。接口（Interfaces）没有构造器。


##### 5.4.2 字段

在构造器中设置对象的所有字段（i.e. 除方法外的所有字段）。使用 `@const` 修饰的字段代表常量，不能被重新赋值。私有字段需用 `@private` 修饰且命名以下划线结尾。不要将字段添加到类的原型 `prototype` 上去。

示例：

```js
class Foo {
  constructor() {
    /** @private @const {!Bar} */
    this.bar_ = computeBar();
  }
}
```

**小贴士：类在初始化之后，就不能再向其添加或删除属性了，因为这会影响虚拟机对其进行优化。如果必要，可以将之后才进行初始化的字段先赋值为 `undefined`，这样先占位之后，防止后面再添加新属性。对象身上的`@struct` 注释可以对不存在的字段的访问进行检查。类自带了这一功能。**

#### 5.4.3 计算属性

计算属性只能用于类的属性是 symbol 的情况。 Dict-style 类型的属性（带引号或非 symbol 的计算属性，详见[5.3.3 Do not mix quoted and unquoted keys](https://google.github.io/styleguide/jsguide.html#features-objects-mixing-keys)）是不被允许的。对于可遍历的类，需要定义其 `[Symbol.iterator]` 方法。其他情况下少用 `Symbol`。

**小贴士；使用其他内建的 symbol 时要格外小心（e.g. `Symbol.isConcatSpreadable`）,因为编译器没有对它进行垫片（向后兼容）处理，所以在旧版浏览器中会有问题。**


#### 5.4.4 静态方法

在不影响可读性的前提下，推荐使用模块内部的函数而不是静态方法。

静态方法应该只用于基类。静态方法不应该从一个保存了实例的变量身上调用，这个实例有可能是构造器或者子类的构造器初始化而来（静态方法应该使用 `@nocollapse` 来注释），而且如果子类没有定义该方法的话，不应该从子类直接调用。

错误的示例：

```js
class Base { /** @nocollapse */ static foo() {} }
class Sub extends Base {}
function callFoo(cls) { cls.foo(); }  // discouraged: don't call static methods dynamically
Sub.foo();  // illegal: don't call static methods on subclasses that don't define it themselves
```


#### 5.4.5 旧方式下类的声明

ES6 方式的类声明是首选，但有些情况下，ES6 的方式不能满足需求。譬如：

1. 如果存在或将要存在子类，包括框架创建的子类，还不能立即使用 ES6 风格的类声明。因为如果基类使用 ES6 方式的话，所有子类代码都需要更改。

2. 有些框架在调用子类构造器时需要时光显式提供 `this`，而 ES6 风格的类中在调用 `super` 前是获取不到 `this` 的。

此规则还应用于这些代码：`let`，`const`，默认参数，rest 和箭头函数。

通过 `goog.defineClass` 可以进行类 ES6 方式的类声明：

```js
let C = goog.defineClass(S, {
  /**
   * @param {string} value
   */
  constructor(value) {
    S.call(this, 2);
    /** @const */
    this.prop = value;
  },

  /**
   * @param {string} param
   * @return {number}
   */
  method(param) {
    return 0;
  },
});
```

或者，新代码中都使用 `goog.defineClass`，传统的语法也是兼容的。

```js
/**
  * @constructor @extends {S}
  * @param {string} value
  */
function C(value) {
  S.call(this, 2);
  /** @const */
  this.prop = value;
}
goog.inherits(C, S);

/**
 * @param {string} param
 * @return {number}
 */
C.prototype.method = function(param) {
  return 0;
};
```

如果有基类的话，实例中的属性需要在基类的构造器中定义。而方法则需要在构造器的原型上定义。

一开始正确地定义构造器的继承关系并不是件容易的事！所以，最好使用 [the Closure Library ](http://code.google.com/closure/library/ ) 提供的 `goog.inherits` 方法。


##### 5.4.6 不要直接操作 `prototype`

通过 `class` 关键字定义类比操作 `prototype` 更加简洁和直观。一般情况下的代码并没有必要操作原型，虽然在定义 `@record` 接口及 [5.4.5 Old-style class declarations](https://google.github.io/styleguide/jsguide.html#features-classes-old-style) 中描述的类时仍有用。Mixin 或修改原生类型的原型是被禁止的。

**例外**：加框的代码（譬如 Polymer 或 Angular）或许会使用 `prototype`，否则实现起来会更加丑陋。

**另一个例外**：定义接口中的字段（详见 [5.4.9 Interfaces](https://google.github.io/styleguide/jsguide.html#features-classes-interfaces)）。


##### 5.4.7 Getters and Setters

不要使用 [JavaScript getter 和 setter 属性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)。其行为不透明出问题难追查，编译器支持上也有局限。提供正常的方法来代替他们。

**例外**：使用数据绑定的框架时（Polymer 或 Angular），尽量少地使用 getter 和 setter。需要注意的是，编译器对其的支持是有限的。使用时，在类或对象字面量中通过 `get foo()` 以及 `set foo(value)` 类似的语法来定义，如果这种语法不可用，则使用 `Object.defineProperties`。不要使用 `Object.defineProperty`，这是用来重命名属性的。Getter 不能修改属性的值。

错误的示例：

```js
class Foo {
  get next() { return this.nextId++; }
}
```

##### 5.4.8 重写 `toString`

可以重写 `toString` 方法，但始终应该返回成功，并且不产生副作用（side effects）。

**小贴士：需要注意的是，特别是在 toString 中调用其他方法时，异常情况可能导致死循环。**


##### 5.4.9 接口

接口可以通过 `@interface` 或 `@record` 来声明。通过 `@record` 声明的接口能够被显式（i.e. 通过 `@implements`）或者隐式地被类或对象实现。

接口上所有非静态方法不能包含具体实现。字段通过 `prototype` 声明且紧跟在接口之后。

示例：

```js
/**
 * Something that can frobnicate.
 * @record
 */
class Frobnicator {
  /**
   * Performs the frobnication according to the given strategy.
   * @param {!FrobnicationStrategy} strategy
   */
  frobnicate(strategy) {}
}

/** @type {number} The number of attempts before giving up. */
Frobnicator.prototype.attempts;
```

#### 5.5 函数

##### 5.5.1 顶级函数

需要导出的函数可直接定义在 `exports` 上，或者在本地定义后通过变量单独导出。对于不用导出的函数不推荐定义成 `@pritate` 的。

示例：

```js
/** @return {number} */
function helperFunction() {
  return 42;
}
/** @return {number} */
function exportedFunction() {
  return helperFunction() * 2;
}
/**
 * @param {string} arg
 * @return {number}
 */
function anotherExportedFunction(arg) {
  return helperFunction() / arg.length;
}
/** @const */
exports = {exportedFunction, anotherExportedFunction};
```

```js
/** @param {string} arg */
exports.foo = (arg) => {
  // do some stuff ...
};
```

##### 5.5.2 嵌套函数及闭包

函数内可包含嵌套函数的定义。如果需要，可以赋值给一个 `const` 变量。


##### 5.5.3 箭头函数

箭头函数定义了一种简洁的函数语法，同时解决了恼人的 `this` 问题。推荐使用箭头函数而不是直接使用 `function` 关键字，特别是在函数嵌套的情况下。

推荐使用箭头函数代替 `f.bind(this)`，特别是代替 `goog.bind(f,this)`。 避免 `const self = this` 这样的写法。箭头函数特别适合用于回调，回调中往往会接收些意想不到的入参。

箭头右边可以是单个表达式或代码块。当入参只有一个时且不是解构类型的入参，括号是可以省略的。

**小贴士：始终都写括号是种好的做法，因为后面如果一旦新加了参数又忘记写括号则会有语法错误。**


##### 5.5.4 生成器/Generators

生成器带来许多有用的抽象概念，必要时可以使用。

通过在 `function` 关键字后面加 `*` 号来定义一个生成器，后面加空格与生成器名称隔开。使用代理的 yield 时，在 `yield` 关键字后加 `*` 号。

示例：

```js
/** @return {!Iterator<number>} */
function* gen1() {
  yield 42;
}

/** @return {!Iterator<number>} */
const gen2 = function*() {
  yield* gen1();
}

class SomeClass {
  /** @return {!Iterator<number>} */
  * gen() {
    yield 42;
  }
}
```


##### 5.5.5 参数

函数的入参需在 JSDoc 中标明类型。通过 `@override` 声明的函数除外，此时类型通常是省略的。

参数类型可在行内指定，置于参数名之前 (`/** number */ foo, /** string */ bar) => foo + bar`)。 对于同一个函数，行内方式与 `@param` 方式不能混着用。


###### 5.5.5.1 默认参数

参数列表中通过等号来指定可选参数。可选参数两边都留空格，命名上与正常参数一样（不使用 `opt_` 前缀），JSDoc 指定类型时使用 `=` 后缀，顺序上置于正常参数之后，并且初始化时不要有明显副作用。所有可选参数都需要指定默认值，哪怕他是 `undefined`。

示例：

```js
/**
 * @param {string} required This parameter is always needed.
 * @param {string=} optional This parameter can be omitted.
 * @param {!Node=} node Another optional parameter.
 */
function maybeDoSomething(required, optional = '', node = undefined) {}
```

尽量少地使用可选参数。参数不定的情况下推荐使用解构的方式（详见(5.3.7 Destructuring)[https://google.github.io/styleguide/jsguide.html#features-objects-destructuring]），这样所定义出来的 API 更加可读。

**注释：与 Python 不同，初始化可选参数时返回新的非可变对象（`[]` 或 `{}`）是可以的。因为每次可选参数被使用时，都是重新赋值，不会与上一次发生复用。**

**小贴士：任意表达式甚至函数调用都可用来初始化参数，但尽量使其保持简单。避免初始化时引用可变对象，这会使得函数多次调用间产生不可知的问题。**


###### 5.5.5.2 剩余参数/Rest parameters

使用_剩余参数_而不是 `arguments`。JSDoc 中使用 `...` 标识剩余参数。剩余参数必需位于参数列表末尾。注意 `...` 与参数名间没有空格。也不要给剩余参数命名。千万不要给变量或参数取名 `arguments`，这会覆盖内建的同名参数。

示例：

```js
/**
 * @param {!Array<string>} array This is an ordinary parameter.
 * @param {...number} numbers The remainder of arguments are all numbers.
 */
function variadic(array, ...numbers) {}
```


##### 5.5.6 返回值

除 `@override` 声明的函数外，函数的返回值应在头部的 JSDoc 文档中进行标注。


##### 5.5.7 泛型

必要的时候使用 JSDoc 的 `@template TYPE` 来定义函数或方法。


##### 5.5.8 展开操作符/Spread operator

可使用展示操作符（`...`）来调用函数。当使用数组或可遍历对象解析后作为函数入参时，推荐使用展开操作符来替代 `Function.prototype.apply`。注意 `...` 后面没有空格。

示例：

```js
function myFunction(...elements) {}
myFunction(...array, ...iterable, ...generator());
```


#### 5.6 字符串字面量

##### 5.6.1 使用单引号

常规字符串使用单引号而非双引号来定义。

**小贴士：如果字符串本身包含单引号，建议使用模板字符串语法以避免使用转义。**

常规字符串不可以跨越多行。


##### 5.6.2 模板字符串

使用模板字符串（`\``）替代复杂的字符串拼接，特别是参与拼接的变量很多时。模板字符串是可以跨越多行的。

模板字符串跨越多行时，可不受代码块缩进规则限制，如果加上缩进好看些的话也可以。

示例：

```js
function arithmetic(a, b) {
  return `Here is a table of arithmetic operations:
${a} + ${b} = ${a + b}
${a} - ${b} = ${a - b}
${a} * ${b} = ${a * b}
${a} / ${b} = ${a / b}`;
}
```


##### 5.6.3 不要使用多行接续/line continuations

无论是常规字符串还是模板字符串中都不要使用多行接续（即在行尾加反斜杠`\\`）。虽然 ES5 允许这么操作，但反斜杠后的空格会导致问题，并且这种形式也不易读。

错误的示例：

```js
const longString = 'This is a very long string that far exceeds the 80 \
    column limit. It unfortunately contains long stretches of spaces due \
    to how the continued lines are indented.';
```

正确的示例：

```js
const longString = 'This is a very long string that far exceeds the 80 ' +
    'column limit. It does not contain long stretches of spaces since ' +
    'the concatenated strings are cleaner.';
```


#### 5.7 数字字面量

数字可有多种呈现形式：十进制，十六进制，八进制或二进制。分别使用小写的 `0x`，`0o`，`0b` 前缀表示十六进制，八进制以及二进制数字。除此之外不应该出现以0开头的数字。


#### 5.8 控制结构

##### 5.8.1 for 循环

ES6 后一共有三种 for 循环，推荐使用 `for-of`。

`for-in` 适用于字典类型（dist-style，详见[5.3.3 Do not mix quoted and unquoted keys](https://google.github.io/styleguide/jsguide.html#features-objects-mixing-keys)）而不要用于遍历数组。配合 `Object.prototype.hasOwnProperty` 来过滤掉非直接的属性。推荐使用 `for-of` 和 `Object.keys`，其次才是 `for-in`。


#### 5.8.2 异常

异常是语言中重要的一部分，发生异常时应尽可能抛出。始终抛出 Error 对象可其子类型，而不是抛出字符串或其他对象作为异常。使用 Error 时始终通过 `new`来创建新实例。

自定义类型的错误提供了非常好的试展示函数中的异常。当原生错误类型不能满足需求时，应尽可能创建自定义的异常。

遇到错误后立即抛出，而不是将错误进行传递。


###### 5.8.2.1 空的 catch 块

难得的是捕获到异常后什么也不做就是正确的做法。在 catch 块中什么也不做是比较合理的，但记得加注释解释一下原因，见正文示例：

```js
try {
  return handleNumericResponse(response);
} catch (ok) {
  // it's not numeric; that's fine, just continue
}
return handleTextResponse(response);
```

错误的示例：

```js
   try {
    shouldFail();
    fail('expected an error');
  }
  catch (expected) {}
```

**小贴士：不像其他一些语言，上面示例行不通，因为会通过 `fail` 来捕获处理。所以使用 `assertThrows`。**


##### 5.8.3 switch 语句

术语解释：switch 语句体中其实是很多组的代码块。每一组又包含一个或多个 switch 标签（`case Foo:` 或 `default:`）以及标签后跟随的代码语句。


##### 5.8.3.1 Fall-through：要加注释

每个 switch 标签要么通过 `break`，`return`，`throw` 结束，要么通过注释直接跳过到下一标签。在发生跳过的情况时，随便加个注释都行。如果是最后一个标签可以不加。

示例：

```js
switch (input) {
  case 1:
  case 2:
    prepareOneOrTwo();
  // fall through
  case 3:
    handleOneTwoOrThree();
    break;
  default:
    handleLargeNumber(input);
}
```


###### 5.8.3.2 `default` 是不能省的

即使 `default` 标签中不包含逻辑，也不要省略。


#### 5.9 this

应该只在类的构造器或方法中使用 `this`，或类中的箭头函数。其他情况下使用 `this` 需要在函数的 JSDoc 结尾处添加 `@this` 注释。

不要使用 `this` 来引用全局对象，`eval` 的执行上下文，事件的触发元素，以及函数这种不必要的用法中 `call()` `apply()` 。


#### 5.10 禁止使用的特性

##### 5.10.1 with

杜绝使用 `with` 关键字。这样的代码不易读，而且 ES5 之后就禁止掉了。


##### 5.10.2 代码的动态求值

不要使用 `eval` 或 `Function(...string)` 构造器（代码加载器（code loader）中除外）。这些关键字很危险并且在 CSP 环境中是不工作的。

*注：CSP 指 [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)*


##### 5.10.3 自动分号添加

始终以分号结束语句（类与函数的声明除外）。


##### 5.10.4 非标准的特性

不要使用还不是标准的特性。包括已经被移除的特性（e.g. `WeakMap.clear`），还未纳入标准的新特性（e.g. TC39 目前的草稿，提议，通过提议但还未完成标准制定），或一些只被部分浏览器所实现的特性。只使用包含在 ECMA-262 或 WHATWG standards 标签中的特性。但一些有自己规范的项目是可以使用这些特性的，比如 Chrome 插件或 Node.js。三方转译器提供的特性也是被禁止的。


##### 5.10.5 原始类型的包装对象

对于原始值的包装对象（`Boolean`, `Number`, `String`, `Symbol`）不能用 `new` 调用，也不能用来作类型声明。

错误的示例：

```js
const /** Boolean */ x = new Boolean(false);
if (x) alert(typeof x);  // alerts 'object' - WAT?
```

这些包装器可在需要类型转换时当作函数来调用（而不是使用拼接空字符串的方式来转成字符串），或用于创建 symbol。

示例：

```js
const /** boolean */ x = Boolean(0);
if (!x) alert(typeof x);  // alerts 'boolean', as expected
```

##### 5.10.6 修改原生对象

千万不要修改原生对象，向其构造器或原型添加方法都是不行的。进行了这些操作的三方库也要避免使用。编译器在编译时会尽可能提供这些原生对象的原始版本；所以原生对象的任何东西都不要去动。

不到万不得已，不要向全局对象添加属性（e.g. 三方库需要这样做）。


### 6 命名

#### 6.1 适用于所有标识符的规则

可用于标识符的有 ASCII 字符，数字，还有下划线 `_` 以及不太常用的 `$` (一些框架里面比如 Angular 会用)。

*注：不得不说 `$` 并不是不常用，相反已经是各种命名的首选了。*

标识符取名尽量表意。不要怕名字太长，因为代码是给人看的，别人能看懂最重要。不要使用带歧义的缩写或者项目之外的人看不懂的缩写，也不要通过删除某个单词中的字符来发明缩写。

```
priceCountReader      // 全拼无缩写
numErrors             // "num" 是大家都知道的缩写
numDnsConnections     // 大部分人能看懂 DNS 代表的意思
```

错误的示例：

```
n                     // 毫无意义
nErr                  // 有歧义
nCompConns            // 有歧义
wgcConnections        // 只部分人知道前面这个缩写的意思
pcReader              // `pc` 可以代表很多东西
cstmrId               // 删除了单词中的某些字母创造的缩写
kSecondsPerDay        // 不使用匈牙利命名法
```


#### 6.2 标识符类型的命名规则 

##### 6.2.1 包名

包名使用小写开头的驼峰命名 `lowerCamelCase`。例如：`my.exampleCode.deepSpace`，而不要写成 `my.examplecode.deepspace` 或 `my.example_code.deep_space`。


##### 6.2.2 类名

类，接口，record (这是什么？) 以及 typedef names (类型定义符) 使用大写开头的驼峰 `UpperCamelCase`。

未被导出的类只本地使用，并没有用 `@private` 标识，所以命名上不需要以下划线结尾。

类型名称通常为名词或名词短语。比如，`Request`，`ImmutableList`，或者 `VisibilityMode`。此外，接口名有时会是一个形容词或形容短语（比如 `Readable`）。


##### 6.2.3 方法名

方法名使用小写开头的驼峰。私有方法需以下划线结尾。

方法名一般为动词或动词短语。比如 `sendMessage` 或者 `stop_`。属性的 Getter 或 Setter 不是必需的，如果有的话，也是小写驼峰命名且需要类似这样 `getFoo`(对于布尔值使用 `isFoo` 或 `hasFoo` 形式)， `setFoo(value)`。

*注：私有属性或方法以下划线开头才是主流吧*

单元测试代码中的方法名会出现用下划线来分隔组件形式。一种典型的形式是这样的 `test<MethodUnderTest>_<state>`，例如 `testPop_emptyStack`。对于这种测试代码中的方法，命名上没有统一的要求。


##### 6.2.4 枚举

枚举使用大写开头的驼峰，和类相似，一般一个单数形式的名词。枚举中的元素写成 `CONSTANT_CASE`。


##### 6.2.5 常量

常量写成 `CONSTANT_CASE`：所有字母使用大写，以下划线分隔单词。私有静态属性可以用内部变量代替，所以不会有使用私有枚举的情况，也就无需将常量以下划线结尾来命名。


###### 6.2.5.1 常量的定义

每个常量都是 `@const` 标识的静态属性或 模块内部通过 `const` 声明的变量，但并不是所有 `@const` 标识的静态属性或 `const` 声明的变量都是常理。需要常量时，先想清楚该对象是否真的不可变。例如，如果该对象中做生意状态可被改变，显然不适合作为常量。只是想着不去改变它的值是不够的，我们要求它需要从本质上来说应该一成不变。

示例：

```js
// Constants
const NUMBER = 5;
/** @const */ exports.NAMES = ImmutableList.of('Ed', 'Ann');
/** @enum */ exports.SomeEnum = { ENUM_CONSTANT: 'value' };

// Not constants
let letVariable = 'non-const';
class MyClass { constructor() { /** @const */ this.nonStatic = 'non-static'; } };
/** @type {string} */ MyClass.staticButMutable = 'not @const, can be reassigned';
const /** Set<String> */ mutableCollection = new Set();
const /** ImmutableSet<SomeMutableType> */ mutableElements = ImmutableSet.of(mutable);
const Foo = goog.require('my.Foo');  // mirrors imported name
const logger = log.getLogger('loggers.are.not.immutable');
```

常量一般为名词或名词短语。


###### 6.2.5.2 本地别名

给导入的变量起别名来提高可读性是可行的。规则见 `goog.require` ([3.4 goog.require statements](https://google.github.io/styleguide/jsguide.html#file-goog-require))。函数中也有使用别名的情况。别名必需是 `const`。

示例：

```js
const staticHelper = importedNamespace.staticHelper;
const CONSTANT_NAME = ImportedClass.CONSTANT_NAME;
const {assert, assertInstanceof} = asserts;
```

##### 6.2.6 非常量字段

非常量字段（静态或其他）使用小写开头的驼峰，如果是私有的私有的则以下划线结尾。

一般是名词或名词短语。例如 `computedValues`，`index_`。


##### 6.2.7 参数

参数使用小写开头的驼峰。即使参数需要一个构造器来初始化时，也是这一规则。

公有方法的参数名不能只使用一个字母。

**例外：**如果三方库需要，参数名可以用 `$` 开头。此例外不适用于其他标识符（e.g. 本地变量或属性）。


##### 6.2.8 本地变量

本地变量使用小写开头的驼峰，除非是上面介绍过的本地常量。函数中的常量命名仍然使用小写开头的驼峰 `lowerCamelCase`。即使该变量指向的是构造器也使用 lowerCamelCase。


##### 6.2.9 模板参数/Template parameter names

模板参数力求简洁，用一个单词，一个字母表示，全部使用大写，例如 `TYPE`，`THIS`。


#### 6.3 驼峰：定义

有时将一个英文短语转成驼峰有很多形式，例如首字母进行缩略，`IPv6` 以及 `iOS` 这种都有出现。为保证代码可控，本规范规定出如下规则。

1. 将短语移除撇号转成 ASCII 表示。例如 `Müller's algorithm` 表示成 `Muellers algorithm`。
2. 将上述结果拆分成单词，以空格或其他不发音符号（中横线）进行分隔。
  a. 推荐的做法：如果其中包含一个已经常用的驼峰翻译，直接提取出来（e.g. `AdWords` 会成为 `ad words`）。需要注意的是 `iOS` 本身并不是个驼峰形式，它不属性任何形式，所以它不适用本条规则。
3. 将所有字母转成小写，然后将以下情况中的首字母大写：
  a. 每个单词的首字母，这样便得到了大写开头的驼峰
  b. 除首个单词的其他所有单词的首字母，这样得到小写开头的驼峰
4. 将上述结果合并。

过程中原来名称中的大小写均被忽略。

示例：

Prose form |	Correct |	Incorrect
---|---|---
XML HTTP request |	XmlHttpRequest	| XMLHTTPRequest
new customer ID	| newCustomerId |	newCustomerID
inner stopwatch |	innerStopwatch |	innerStopWatch
supports IPv6 on iOS?	| supportsIpv6OnIos |	supportsIPv6OnIOS
ouTube importer |	YouTubeImporter |	YoutubeImporter*

*这种情况可接受，但不推荐。

**注释：一些英文词汇通过中横线连接的方式是有歧义的，比如 "nonempty" 和 "non-empty" 都是正确写法，所以方法名 `checkNonempty` `checkNonEmpty` 都算正确。**


### 7.1 JSDoc

[JSDoc](https://developers.google.com/closure/compiler/docs/js-for-compiler) 使用在了所有的类，字段以及方法上。


#### 7.1 通用形式

JSDoc 基本的形式如下：

```js
/**
 * Multiple lines of JSDoc text are written here,
 * wrapped normally.
 * @param {number} arg A number to do something to.
 */
function doSomething(arg) { … }
```

或者这种单行的形式：

```js
/** @const @private {!Foo} A short bit of JSDoc. */
this.foo_ = foo;
```

如果单行形式长到需要折行，则需要切换到多行模式而不是使用单行形式。

有许多工具会对 JSDoc 文档进行解析以提取出有效的信息对代码进行检查和优化。所以这些注释需要好好写。


#### 7.2 Markdown

JSDoc 支持 Markdown，所以必要时可包含 HTML。

工具会自动提取 JSDoc 的内容，其中自己书写的格式会被忽略。比如如果你写成下面这个样子：

```js
/**
 * Computes weight based on three factors:
 *   items sent
 *   items received
 *   last timestamp
 */
```

最终提取出来是这样的：

```js
Computes weight based on three factors: items sent items received last timestamp
```

取而代之，我们应该按 markdown 的语法来格式化：

```js
/**
 * Computes weight based on three factors:
 *  - items sent
 *  - items received
 *  - last timestamp
 */
```


#### 7.3 JSDoc tags

本规则可使用 JSDoc tags 的一个子集。详细列表见 [9.1 JSDoc tag reference](https://google.github.io/styleguide/jsguide.html#appendices-jsdoc-tag-reference)。大部分 tags 独占一行。

错误的示例：

```js
/**
 * The "param" tag must occupy its own line and may not be combined.
 * @param {number} left @param {number} right
 */
function add(left, right) { ... }
```

简单的 tag 无需额外数据（比如 `@private`，`@const`，`@final`，`@export`），可以合并到一行。

```js
/**
 * Place more complex annotations (like "implements" and "template")
 * on their own lines.  Multiple simple tags (like "export" and "final")
 * may be combined in one line.
 * @export @final
 * @implements {Iterable<TYPE>}
 * @template TYPE
 */
class MyClass {
  /**
   * @param {!ObjType} obj Some object.
   * @param {number=} num An optional number.
   */
  constructor(obj, num = 42) {
    /** @private @const {!Array<!ObjType|number>} */
    this.data_ = [obj, num];
  }
}
```

关于合并及合并后的顺序没有明确的规范，代码中保持一致即可。

详细的类型信息可参见 [Annotating JavaScript for the Closure Compiler](https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler) 和 [Types in the Closure Type System](https://github.com/google/closure-compiler/wiki/Types-in-the-Closure-Type-System)。


#### 7.4 换行

换行之后的 tag 块使用四个空格进行缩进。

```js
/**
 * Illustrates line wrapping for long param/return descriptions.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
exports.method = function(foo) {
  return 5;
};
```

`@fileoverview` 换行时不缩进。


#### 7.5 文件头部注释

一个文件可以在头部有个总览。包括版权信息，作者以及默认可选的[可见信息/visibility level](https://google.github.io/styleguide/jsguide.html#jsdoc-visibility-annotations)等。文件中包含多个类时，头部这个总览显得很有必要。它可以帮助别人快速了解该文件的内容。如果写了，则应该有一个描述字段简单介绍文件中的内容以及一些依赖，或者其他信息。换行后不缩进。

示例：

```js
/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 * @package
 */
```


#### 7.6 类的注释

类，接口以及 records 需要有描述，参数，实现的接口以及可见性或其他适当的 tags 注释。类的描述需要告诉读者类的作用及何时使用该类，以及其他一些可以帮助别人正确使用该类的有用信息。构造器上的文本描述可省略。`@constructor` 和 `@extends` 不与 `class` 一起使用，除非该类是用来声明接口 `@interface` 或者扩展一个泛型类。

```js
/**
 * A fancier event target that does cool things.
 * @implements {Iterable<string>}
 */
class MyFancyTarget extends EventTarget {
  /**
   * @param {string} arg1 An argument that makes this more interesting.
   * @param {!Array<number>} arg2 List of numbers to be processed.
   */
  constructor(arg1, arg2) {
    // ...
  }
};

/**
 * Records are also helpful.
 * @extends {Iterator<TYPE>}
 * @record
 * @template TYPE
 */
class Listable {
  /** @return {TYPE} The next item in line to be returned. */
  next() {}
}
```


#### 7.7 枚举和 typedef 注释

枚举和 typedef 需要写文档。仅有的枚举和 typedef 其文档的描述不能为空。枚举中单个元素的文档可直接写在元素的前面一行。

```js
/**
 * A useful type union, which is reused often.
 * @typedef {!Bandersnatch|!BandersnatchType}
 */
let CoolUnionType;


/**
 * Types of bandersnatches.
 * @enum {string}
 */
const BandersnatchType = {
  /** This kind is really frumious. */
  FRUMIOUS: 'frumious',
  /** The less-frumious kind. */
  MANXOME: 'manxome',
};
```

Typedefs 可方便地用于定义 records 类型，或 unions 的别名，复杂函数，或者 泛型类型。Typedefs 不适合用来定义字段很多的 records，因为其不支持对每个字段进行文档书写，也不适合用于模板或递归引用中。对于大型 records 使用 `@record`。


#### 7.8 方法与函数

参数和返回类型需要写文档。必要时 `this` 也需要在文档中说明。方法，参数及返回的描述在方法的其他 JSDoc 中或方法签名中有表述，那么也是可以省略的。方法的描述应使用第三人称。如果方法重载父类中的方法，需要使用 `@override` 标识。重载方法需要包含所有的参数 `@param` 以及 `@return` 如果类型有变的话，如果没变也可省略。

```js
/** This is a class. */
class SomeClass extends SomeBaseClass {
  /**
   * Operates on an instance of MyClass and returns something.
   * @param {!MyClass} obj An object that for some reason needs detailed
   *     explanation that spans multiple lines.
   * @param {!OtherClass} obviousOtherClass
   * @return {boolean} Whether something occurred.
   */
  someMethod(obj, obviousOtherClass) { ... }

  /** @override */
  overriddenMethod(param) { ... }
}

/**
 * Demonstrates how top-level functions follow the same rules.  This one
 * makes an array.
 * @param {TYPE} arg
 * @return {!Array<TYPE>}
 * @template TYPE
 */
function makeArray(arg) { ... }
```

匿名函数不需要写 JSDoc，但在自动推荐参数类型有困难时，也可手动指定一下类型。

```js
promise.then(
    (/** !Array<number|string> */ items) => {
      doSomethingWith(items);
      return /** @type {string} */ (items[0]);
    });
```


#### 7.9 属性

属性的类型需要加文档。对于私有属性如果其命名已经很好地提示了其类型，则描述可省略。

公有的常量与属性是一样的文档写法。当 `@const` 类型的属性从一个表达式初始化时，是能明显看出其类型的，此时其显式的类型指定可省略。

**小贴士：`@const` 属性的类型从构造器的参数进行初始化时，其类型是“显然”的，因为参数上面声明了类型，或者从一个函数调用进行初始化，因为函数返回值的类型也是声明了的。对于非常量或者它的值来源不是很明朗的情况下才需要指定其类型。**

```js
/** My class. */
class MyClass {
  /** @param {string=} someString */
  constructor(someString = 'default string') {
    /** @private @const */
    this.someString_ = someString;

    /** @private @const {!OtherType} */
    this.someOtherThing_ = functionThatReturnsAThing();

    /**
     * Maximum number of things per pane.
     * @type {number}
     */
    this.someProperty = 4;
  }
}

/**
 * The number of times we'll try before giving up.
 * @const
 */
MyClass.RETRY_COUNT = 33;
```


#### 7.10 类型标识/Type annotations

这些 tag 上可使用类型标识， `@param`，`@return`，`@this` 以及 `@type`，还有可选的 `@const`，`@export` 以及其他一些可见性 tag（visibility tags）。类型标识需使用花括号包裹。


##### 7.10.1 Nullability

类型系统中修饰符 `!` 表示不可为空 `?` 表示可空。原始类型 （`undefined`，`string`，`number`，`boolean`，`symbol`），函数 `function(...):...` 以及 record 字面量（`{foo:string,bar:number}`） 默认是不可空的，不需要加 `!`修饰符。对象类型(`Array`, `Element`, `MyClass` 等) 默认可空，但无法一眼就与通过 `@typedef` 定义的 non-null-by-default 区分开。所以，除了原始类型，record 字面量需要显式指定 `!` `?` 修饰符外，其他类型都不需要。


##### 7.10.2 类型转换

表达式的类型不太明确时，可显式地为其声明类型，通过使用 type 标识加上花括号包裹的类型来指定。花括号是必需的。

```js
/** @type {number} */ (x)
```

##### 7.10.3 模板参数类型

始终为模板指定参数。这样编译器能更好地工作，代码也更易读。

错误的示例：

```js
const /** !Object */ users = {};
const /** !Array */ books = [];
const /** !Promise */ response = ...;
```

正确的示例：

```js
const /** !Object<string, !User> */ users = {};
const /** !Array<string> */ books = [];
const /** !Promise<!Response> */ response = ...;

const /** !Promise<undefined> */ thisPromiseReturnsNothingButParameterIsStillUseful = ...;
const /** !Object<string, *> */ mapOfEverything = {};
```

以下情况不使用模板参数：
- `Object` 用来做类型继承而不是健值对。


#### 7.11 Visibility annotations

可见性标识（`@private`, `@package`, `@protected`）需在 `@fileoverview` 块中指定，或者在任何导出的符号或属性上指定。本地变量不指定可见性，无论是函数中或模块级的变量。所有 `@private` 类型的标识符需以下划线结尾。


### 8 政策

#### 8.1 本规范未指定的风格：保持一致！

对于本规范中未提及或不明确的，与现有代码保持一致即可。


#### 8.2 编译器警告

##### 8.2.1

项目中尽量使用 `--warning_level=VERBOSE`。


##### 8.2.2 如何处理警告

解决之前，先明白警告的意思。如果不清楚，可以询问。

一旦了解之后，可进行如下操作：

1. **首先，修复或找替代方案。** 尝试针对该警告进行修复，或者换种方式实现相同的功能同时规避掉警告。
2. **或者，检查看是否是一个误报。** 如果确认代码没问题，警告是误报，写下相应注释并添加 `@suppress` 标识。
3. **或者，留下 TODO 注释。** 这是最次的做法。这种做法相当于直接忽略警告，直到时机成熟再解决。


##### 8.2.3 将警告控制在最小范围

将警告控制在最小合理的作用域范围，通常一个本地变量或很小的方法范围内。然后可以将这个变量或方法单独提取出来。

示例：

```js
/** @suppress {uselessCode} Unrecognized 'use asm' declaration */
function fn() {
  'use asm';
  return 0;
}
```

一个类中大量的 `@suppress` 也好过编译时报大量的警告。


#### 8.3 废弃/Deprecation

将废弃不用的方法，类及接口用 `@deprecated` 标识标注。该标注需要说明使用者应该如何修复调用。


#### 8.4 未使用本规范的代码

你可能会零星地发现一些代码没有遵循本规范。这些代码可能从收购的公司而来，或者写于本规范之前，或者有其他原因。


##### 8.4.1 已有代码的重新格式化

更新已有代码时，遵循以下原则：

1. 没必要更新所有老代码以满足本规范。需要在成本与代码一致性之间找个平衡点。规范不断在演变，花大成本更新老代码需要折衷。然而，如果老文件大部分都被修改了的话，那可以顺便将其全部改为符合现在的规范。
2. 注意控制改动范围。如果你发现需要投入大量精力去更新代码而影响了当前需求的进展，考虑将将这些老代码的更新另起一个分支。

*注：不明白这里 CL 指什么* 


##### 8.4.2 新增代码：遵循本规范

全新创建的文件应该全部遵循本规范，某些包中其他类型文件有其他规范的另说。

向一个不是遵循本规范而写的文件添加新代码时，推荐先重新格式化当前文件，具体原则参考 [8.4.1 Reformatting existing code.](https://google.github.io/styleguide/jsguide.html#policies-reformatting-existing-code)。

如果重新格式化完不成，那么新加的代码应该与老代码尽量保持一致，但不要滥用规范。


#### 8.5 本地样式规范

各团队或项目可根据各自情况扩展本规范，但需要注意整体清理时可能不会兼容这些规则，并且这些扩展的规则不应该与清理相冲突。过于严苛的规则实际上反而没有意义。本规范没有追过将代码的方方面面都函盖，所以扩展的规则也是。


#### 8.6 生成的代码；豁免


编译产出的代码不要求其遵循本规范。但是有些生成之后的代码需要供开发时调用的，其导出的名称是需要遵循本规范的。有一点例外是，这样的名称可以包含下划线，这样可与源码中我们自己写的名称避免冲突。


### 9 附录

*注：以下几乎都是与 Google 强相关的，用处不大。*

#### 9.1 JSDoc tag 参考

在 JavaScript 中 JSDoc 起了诸多作用。除了生成文档，还用来控制工具。为人熟知的 Closure 编译器的类型判定便是与 JSDoc 紧密结合的。


##### 9.1.1 类型标识以及其他 Closure 编译标识

Closure 使用的 JSDoc 文档在 [Annotating JavaScript for the Closure Compiler ](https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler) 和 [Types in the Closure Type System](https://github.com/google/closure-compiler/wiki/Types-in-the-Closure-Type-System) 中有详细定义。



##### 9.1.2 文档标识

除 [Annotating JavaScript for the Closure Compiler](https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler) 中规定的 JSDoc 标识，下面还列出了主流文档生成工具支持的标识。

- `@author` 或 `@owner` `@author username@google.com (First Last)` 

示例：

```js
/**
 * @fileoverview Utilities for handling textareas.
 * @author kuth@google.com (Uthur Pendragon)
 */
```

- `@bug` `@bug bugnumber`

示例：

```js
/** @bug 1234567 */
function testSomething() {
  // …
}

/**
 * @bug 1234568
 * @bug 1234569
 */
function testTwoBugs() {
  // …
}
```

- `@code` {@code ...}

示例：

```js
/**
 * Moves to the next position in the selection.
 * Throws {@code goog.iter.StopIteration} when it
 * passes the end of the range.
 * @return {!Node} The node at the next position.
 */
goog.dom.RangeIterator.prototype.next = function() {
  // …
};
```

- `@see` `@see Link`

示例：

```js
/**
 * Adds a single item, recklessly.
 * @see #addSafely
 * @see goog.Collect
 * @see goog.RecklessAdder#add
 */
```

- `@supported` `@supported Description`

示例：

```js
/**
 * @fileoverview Event Manager
 * Provides an abstracted interface to the
 * browsers' event systems.
 * @supported IE10+, Chrome, Safari
 */
```

- `@desc` `@desc Message description`

示例：

```js
/** @desc Notifying a user that their account has been created. */
exports.MSG_ACCOUNT_CREATED = goog.getMsg(
    'Your account has been successfully created.');
```

其中三方代码中还会看到另外的 JSDoc 标识。上述这些标识出是现在[JSDoc Toolkit Tag Reference](http://code.google.com/p/jsdoc-toolkit/wiki/TagReference)中的但并不是本规范的一部分。


##### 9.1.3 框架特定的标识

下述标识与特定框架有关。

Framework | Tag | Documentation
--- | --- | ---
Angular1 | `@ngInject` | 
Polymer | `@polymerBehavior` | [https://github.com/google/closure-compiler/wiki/Polymer-Pass](https://github.com/google/closure-compiler/wiki/Polymer-Pass)


##### 9.1.4 关于 Closure 编译器中标识的解释

下述标识曾经在作为正规的标识使用，现已废弃。

Tag | Template & Examples | Description
--- | --- | ---
`@expose` | `@expose` | 已废弃不再使用。使用 `@export` 或 `@nocollapse` 代替。
`@inheritDoc` | `@inheritDoc` | 已废弃不再使用。使用 `@override` 代替。


#### 9.2 被普遍误解的规则

以下规则不太为人所知或者存在误解（下述规则都是澄清明确的，而不是一个神秘的列表）。

- 文件头部版权或 `@author` 并不是必需的。
- 除构造器需位于前面外（参考 [5.4.1 Constructors](https://google.github.io/styleguide/jsguide.html#features-classes-constructors)），类中属性并没有明确的顺序规定。
- 空代码块可简洁地使用 `{}` 表示，详见 [4.1.3 Empty blocks: may be concise](https://google.github.io/styleguide/jsguide.html#formatting-empty-blocks)。
- 折行的首要准则是：优先在高阶语法层面进行换行（[4.5.1 Where to break](https://google.github.io/styleguide/jsguide.html#formatting-where-to-break)）。
- 非 ASCII 字符可用于字符串，注释及 javadoc，并且当它相比其转义字符更加易理解时，使用 非 ASCII 字符是推荐的做法。


#### 9.3 风格相关的工具

下列工具将从各方面支持本规范的落实。


##### 9.3.1 Closure 编译器

本工具进行类型及其他相关检查工作，还有代码转换（例如 ES6 到 ES5的转换），优化等。


##### 9.3.2 `clang-format`

本工具将代码格式化为本规范要求的格式，还包含一些未要求但常用的一些格式化工作。

`clang-format` 不是强制的。使用者可改变及输出，代码审阅者也可要求做出某些变更，格式化这件事本来就不会有统一的结论。但大部分情况下应该选择默认的配置。


##### 9.3.3 Closure 编译器的 linter

本工具对一些错误和不好的代码风格进行检查。


##### 9.3.4 Conformance framework

Conformance framework 是 Closure 的一部分。通过当开发者可指定一些额外的检查工作。例如，禁止代码中使用某个属性，或调用某个方法，或对类型缺失的检查。

这些额外的规则通常用是一些严格的限制（比如全局变量的定义不被允许）以及安全相关的模式检查（比如 `eval` 的使用或对 `innerHTML` 的赋值操作），或者是些松散的配置以提高代码质量。

更多详情参见[JS Conformance Framework](https://github.com/google/closure-compiler/wiki/JS-Conformance-Framework)。


#### 9.4 历史平台中的例外

##### 9.4.1 总览

本节讨论一些新式ECMAScript 6语法不可用时所要补充的例外和额外规则。 ES6 不可用时，以下可视为本规范的例外情形：

- 可使用`var`声明变量
- 可使用 `arguments`
- 可选参数可不指定默认值


##### 9.4.2 `var` 的使用

##### 9.4.2.1 `var` 的作用域不是块级的

`var` 的作用域为包含它的函数体，所处的 script 或模块，此情形下容易产生未知的表现，特别是在有循环的情况下在函数中引用了 `var` 声明的变量。以下是一个示例：

```js
for (var i = 0; i < 3; ++i) {
  var iteration = i;
  setTimeout(function() { console.log(iteration); }, i*1000);
}

// logs 2, 2, 2 -- NOT 0, 1, 2
// because `iteration` is function-scoped, not local to the loop.
```


##### 9.4.2.2 尽量将变量声明在首次使用的地方

实际运行时变量的声明是会被提前的，尽管如何，我们还是应该将变量声名在首次使用的地方以提高代码可读性。如果 `var` 声明的变量需要在代码块之外被使用，则不要将其声明在块内。

```js
function sillyFunction() {
  var count = 0;
  for (var x in y) {
    // "count" could be declared here, but don't do that.
    count++;
  }
  console.log(count + ' items in y');
}
```


##### 9.4.2.3 使用 `@const` 声明常量

对于全局变量应该使用 `const`。如果该关键字不可用，可使用 `@const` 标识来声明（对于本地变量可省略）。


##### 9.4.3 不要将函数声明在代码控制块内

不要这样做：

```js
if (x) {
  function foo() {}
}
```

尽管大多数 JS 虚拟机都支持这么做，但这种做法是不标准的。和个环境对其的解释编译是不一样的，与 ES6 中已经成为标准的 块级作用域函数也不一样。ES5 及之前版本的 JS 只允许在顶级作用域中声明函数然后在严格模式下声明块级函数是被禁止的。

为了保持一致性，推荐使用 `var` 声明一个变量通过表达式来定义这样的函数。

```js
if (x) {
  var foo = function() {};
}
```


##### 9.4.4 `goog.provide`/`goog.require` 相关的依赖管理


`goog.provide` 已弃用。所有新文件应使用 `goog.module`，即使在一些老项目中 `goog.provide` 还可用的情况下。以下规则只对老代码中存在 `goog.provide` 的文件生效。

###### 9.4.4.1 总览

- `goog.provide` 语句放在前面，`goog.require` 放后面，两者用一行空行分隔。
- 所有引用按字母排序。
- 两种引用都不换行，即使超过列宽 80 的限制。
- 只提供顶级 symbol。

截止到 2016 年 10 月，`goog.provide`/`goog.require` 依赖管理已弃用。所有新文件，包括还在使用 `goog.provide` 老文件中，应该切换到 `goog.module`。

```js
goog.provide('namespace.MyClass');
goog.provide('namespace.helperFoo');

goog.require('an.extremelyLongNamespace.thatSomeoneThought.wouldBeNice.andNowItIsLonger.Than80Columns');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.dominoes');
```

类中定义的所有成员应位于同一文件，对外导出只提供这个顶级类的命名空间。

正确的示例：

```js
goog.provide('namespace.MyClass');
```

错误的示例：

```js
goog.provide('namespace.MyClass');
goog.provide('namespace.MyClass.CONSTANT');
goog.provide('namespace.MyClass.Enum');
goog.provide('namespace.MyClass.InnerClass');
goog.provide('namespace.MyClass.TypeDef');
goog.provide('namespace.MyClass.staticMethod');
```

导入时应指定具体成员名：

```js
goog.provide('foo.bar');
goog.provide('foo.bar.CONSTANT');
goog.provide('foo.bar.method');
```


##### 9.4.4.2 `goog.scope` 相关的别名

`goog.scope` 已弃用。新文件及存在 `goog.scope` 的老文件中应停止使用。

`goog.scope` 可用于 `goog.provide`/`goog.require` 依赖管理时创建导入时的缩写。

一个文件最多使用一次 `goog.scope`，且置于全局作用域中。

该语句的开头部分 `goog.scope(function() {` 前需要有一行空行，紧跟着是 `goog.provide` 语句，`goog.require` 语句，或顶级注释等。该语句需在文件结尾处进行闭合。闭合时添加 `// goog.scope` 注释。该注释与结束时的分号空两个空格。

与 C++ 命名空间类似，`goog.scope` 声明内不要进行缩进，而是从第0列开始。

只针对不能赋值给其他对象的名称进行别名操作（e.g. 大部分构造器，枚举 和 命名空间）。不要像如下代码那样操作（具体如何对构造器进行别名操作见后面）：

```js
goog.scope(function() {
var Button = goog.ui.Button;

Button = function() { ... };
...
```

别名需与导入时命名空间中最后个属性名一致。

```js
goog.provide('my.module.SomeType');

goog.require('goog.dom');
goog.require('goog.ui.Button');

goog.scope(function() {
var Button = goog.ui.Button;
var dom = goog.dom;

// Alias new types after the constructor declaration.
my.module.SomeType = function() { ... };
var SomeType = my.module.SomeType;

// Declare methods on the prototype as usual:
SomeType.prototype.findButton = function() {
  // Button as aliased above.
  this.button = new Button(dom.getElement('my-button'));
};
...
});  // goog.scope
```


### 相关资源

- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
