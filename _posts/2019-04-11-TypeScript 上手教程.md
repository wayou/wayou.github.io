---
layout: post
title: "TypeScript 上手教程"
date: 2019-04-11 23:04:00 +0800
tags: 
---
    
TypeScript 上手教程
===

无疑，对于大型项目来说，Vanilla Js 无法满足工程需求。早在 2016 年 Anuglar 在项目中引入 TypeScript 时，大概也是考虑到强类型约束对于大型工程的必要性，具体选型考虑可参考[这篇文章](https://vsavkin.com/writing-angular-2-in-typescript-1fa77c78d8e8)。然后可以看到 TypeScript 在社区中逐渐升温。但凡社区中举足轻重的库，如果不是原生使用 TypeScript 编写，那么也是通过声明文件的方式对 TypeScript 提供支持，比如 React（虽然不是包含在官方仓库中，而是通过 `@types/react`），同时官方脚手架工具（[v2.1.0](https://github.com/facebook/create-react-app/releases/tag/v2.1.0) 之后）也开始提供开箱即用的 TypeScript 支持，通过 `--typescript` 参数开启。

所以 TypeScript 绝对是趋势。它所带来的工程效率上的提升，是在使用 Vanilla Js 时无法体会到的。可能前期反而会因为类型约束而变得束手束脚影响效率，但这是个学习成本的问题，对于任何一门技术而言都会存在。

如果你有 Java 或 C# 的基础，那 TypeScript 学起来几乎没什么成本。

## 安装与配置

### 安装

```sh
$ npm install -g typescript
# or
$ yarn global add typescript
```

安装成功后，其 CLI 命令为 `tsc`，比如查看版本，

```sh
$ tsc --version
Version 3.3.3333
```

常用的命令：

#### 编译文件

```sh
$ tsc main.ts
```

编译时传递编译参数：

```sh
$ tsc --target es3 main.ts
```

完整的编译参数可在官网 [Compiler Options 文档](https://www.typescriptlang.org/docs/handbook/compiler-options.html)中查阅。

#### 初始化配置文件

除了通过 CLI 传递编译参数控制编译的行为，也可通过创建 `tsconfig.json` 文件指定编译参数。对于项目中使用来说，肯定是使用配置文件比较方便，而且，有些参数只支持通过配置文件来设置，比如 `path`，`rootDirs`。

```sh
$ tsc --init
message TS6071: Successfully created a tsconfig.json file.
```

该命令在当前目录创建一个 `tsconfig.json` 文件，每个配置都包含注释。完整的配置项也可在官网[Compiler Options 文档](https://www.typescriptlang.org/docs/handbook/compiler-options.html)中查阅，根据自己需要和项目需求进行合理配置。大部分情况下你只会因为有某个需求才会去刻意研究如何配置，比如要改变输出类型设置 `target`，写码过程中发现 `Object.assign` 不可用发现需要添加 `lib` 插件。所以不必被庞大的配置参数惊吓到，只用的时候再搜索即可。

<details>
<summary>
tsconfig.json
</summary>

```js
{
  "compilerOptions": {
    /* Basic Options */
    "target": "es5" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018' or 'ESNEXT'. */,
    "module": "commonjs" /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */,
    // "lib": [],                             /* Specify library files to be included in the compilation. */
    // "allowJs": true,                       /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    // "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    // "sourceMap": true,                     /* Generates corresponding '.map' file. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    // "outDir": "./",                        /* Redirect output structure to the directory. */
    // "rootDir": "./",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                     /* Enable project compilation */
    // "removeComments": true,                /* Do not emit comments to output. */
    // "noEmit": true,                        /* Do not emit outputs. */
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true /* Enable all strict type-checking options. */,
    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */

    /* Module Resolution Options */
    // "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. */
    // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */

    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */
  }
}
```

</details>

### VS Code 上手

TS 带来的一大好处是其静态类型检查能跟编辑器很好地结合，智能健全的自动提示自不必说。推荐 [VS Code](https://code.visualstudio.com) 作为编辑，其对 TypeScript 有原生的支持。

用好这几个快捷键，更是提升效率的关键。

#### 重命名

通过 <kbd>F2</kbd> 对标识符重重命名。这里标识符可以是变量名，方法函数名，类名或者其他字面量。如果写代码过程中发现命名不合理想重命名，一定使用这个快捷键来操作，它的好处是，只需改一处，其他与该标识符有关的地方，将自动被批量替换成新的，甚至该标识符使用的地方不在同一个文件中，也能被正确地自动应用上变更后的名称。省去了人工替换和检查代码的麻烦。关键人工容易出错，搜索加替换的方式只是根据字符串来进行的，而该命令是通过分析代码的语法树进行的。

![使用 <kbd>F2</kbd> 进行变量重命名的展示](https://user-images.githubusercontent.com/3783096/55686721-560ae880-5997-11e9-8d74-7dfe51482e3a.gif)

<p align="center">使用 <kbd>F2</kbd> 进行变量重命名的展示</p>

#### 快速跳转

- <kbd>F12</kbd> 跳转到定义。这应该是使用最为频繁的了。

![跳转到定义](https://user-images.githubusercontent.com/3783096/55686738-894d7780-5997-11e9-86b5-188661edce21.gif)

<p align="center">跳转到定义</p>

- <kbd>F7</kbd> 当前文件中相同的标识符间循环切换。

![标识符间的跳转切换](https://user-images.githubusercontent.com/3783096/55686747-a5511900-5997-11e9-8d88-0e5e31b4cf3a.gif)

<p align="center">标识符间的跳转切换</p>

- <kbd>F8</kbd> 在错误处循环切换。这个跳转可让你在修正代码中的错误时变得非常快捷。它直接将光标定位到错误处，修改好本处的错误后，继续 <kbd>F8</kbd> 跳转到下一处。一个很好的应用场景是对 js 代码的迁移，将文件扩展名由 `.js` 改为 `.ts`，大概率你会看到满屏飘红的错误提示，通过不断地 <kbd>F8</kbd> 来由上往下定位修改简直再顺畅不过了。

![在报错处循环切换](https://user-images.githubusercontent.com/3783096/55686754-bef26080-5997-11e9-9a83-ba658e949e26.gif)

<p align="center">在报错处循环切换</p>

- <kbd>control</kbd> + <kbd>-</kbd>/<kbd>=</kbd> 在鼠标历史位置间来回切换。

![光标位置的来回切换](https://user-images.githubusercontent.com/3783096/55686764-d7627b00-5997-11e9-8cc0-98619c3f8a4c.gif)

<p align="center">光标位置的来回切换</p>

#### 命令面板

通过 <kbd>command</kbd> + <kbd>shift</kbd> + <kbd>p</kbd> 打开命令面板。几乎所有功能可以通过这里的命令来完成。

比如，

- 代码折叠与展开

![代码折叠与展开](https://user-images.githubusercontent.com/3783096/55686777-f4974980-5997-11e9-9fe0-6e65db5e6910.gif)

<p align="center">代码折叠与展开</p>

- 主题的切换

![主题的切换](https://user-images.githubusercontent.com/3783096/55686786-1395db80-5998-11e9-902f-d793a71720b0.gif)

<p align="center">主题的切换</p>

最后，你始终可通过搜索 `keyboard shortcurt` 来查看所有的快捷键。

![快捷键列表](https://user-images.githubusercontent.com/3783096/55686796-3aeca880-5998-11e9-802c-5bf62345f291.gif)

<p align="center">快捷键列表</p>

### 在线工具

如果本地没有环境，可通过 [Playground ・ TypeScript](http://www.typescriptlang.org/play/) 这个在线的编辑器，编辑 TypeScript 和时实查看输出。

## 类型声明

TypeScript 中，通过在变量后面添加冒号指定其类型。

```js
let fruit: string;
// 🚨Variable 'fruit' is used before being assigned.
console.log(fruit);
```

当声明 `fruit` 为字符串之后，TypeScript 会保证该变量的类型始终是字符串。但在未赋值之前，其实它真实的类型是 undefined。这种情况下，TypeScript 会报错以阻止你在未初始化之前就使用。


函数的类型包含了入参的类型和返回值的类型。入参自不必说，像上面那样冒号后指定，而返回值的类型，则是通过在入参列表结束的括号后添加冒号来指定的。

```js
function addOne(num: number): number {
  return num + 1;
}
```

如果每次写个变量或函数都需要手动指定其类型，岂不是很麻烦。所以，在一切能够推断类型的情况下，是不必手动指定的。比如声明变量并初始化，会根据初始化的值来推断变量类型。函数会根据其 return 的值来推断其返回类型。

```js
/** 推断出的函数类型为：(num: number) => number */
function addOne(num: number) {
  return num + 1;
}

/** age:number */
const age = 18;
const virtualAge = addOne(age);

console.log(`在下虚岁 ${virtualAge}`);
```


## TypeScript 中的类型

JavaScript 中原生有 7 中数据类型，其中 Ojbect 为可看成数据集合，而其他 6 种（布尔，字符串，数字，`undefined`， `null`, `Symbol`），则是原始（primitive）数据类型。

虽然 JavaScript 中有数据类型的概念，但它是动态的，变量的类型根据所存储的值而变化。TypeScript 作为其超集，将上面的数据类型进行了扩充，在 TypeScript 里，可以通过各种组合创建出更加复杂的数据类型。同时，TypeScript 让数据类型固定，成为静态可分析的。

比如，如果一个函数的入参指定为数字，那么调用的时候传递了字符串，这个错误在写码过程中就直接可检查到并抛出。

```js
function addOne(num: number) {
  return num + 1;
}

/** 🚨Argument of type '"blah"' is not assignable to parameter of type 'number'. */
addOne("blah");
```

JavaScript 原始类型加上扩展的几个类型（Any, Never, Void, Enum）组成了 TypeScript 中基本的类型。更加详细的信息可参考 [Basic Types](https://www.typescriptlang.org/docs/handbook/basic-types.html)。

### Boolean

布尔值，其值只能是 `true` 或 `false`。

```js
let isEmployee: boolean = false;

function hasPermission(role: string): boolean {
  return role === "admin" ? true : false;
}
```

### Number

数字类型，不区分整形与浮点，所有数字均当作浮点数字对待。同时也支持二进制，八进制，十六进制数字。

```js
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
```

### String

字符串类型。TypeScript 中可使用 ES6 以之后这些还未实现的功能，所以模板字符串是可以放心使用的。

```js
let fruit: string = "Apple";
console.log(`My favourite fruit is ${fruit}`);
```

### Symbol

ES6 中新增，由 `Symbol()` 返回的类型。

```js
let sym = Symbol("foo");
typeof sym; // "symbol"
sym.toString(); // Symbol(foo)
```

注意，因为是新特性，需要在 `tsconfig.json` 中添加相应的库支持，否则编译会报错。

```js
{
      "lib": ["dom","es2015"] /* Specify library files to be included in the compilation. */
}
```

### Object

除了 JavaScript 中 6 个原始类型之外的类型。

```js
function create(source: Object) {
  return Object.create(source);
}

// ✅
create({});
// ✅
create(window);

// 🚨Argument of type 'undefined' is not assignable to parameter of type 'Object'
create(null);

// 🚨Argument of type 'undefined' is not assignable to parameter of type 'Object'.ts(2345)
create(undefined);
```

### Null 与 Undefined

两者其实是其他任意类型的子类型。比如，一个变量定义后没有初始化，此时其值自动为 `undefined`。这说明，`undefined` 是可以赋值给这个类型的。当我们想把变量的值取消，将其置空时，可将其设置为 `null`，`null` 也是可以赋值给其他类型变量的，前提是 `tsconfig.json` 中没有开启 `strict:true`。

```js
let age: number;
console.log(age); // undefined

age = 9;
console.log(age); // 9

age = null;
console.log(age); // null
```

当开启 `strict:true` 强制检查后，TypeScript 会对类型进行严格的检查。上面就不能在未初始化的情况下使用变量，同时也不能将 `null` 赋值给 `number` 类型。

对于这两种类型，在强制检查下，除非显式对变量进行声明其可空可未初始化。

```diff
+ let age: number | null | undefined;
console.log(age); // undefined

age = 9;
console.log(age); // 9

age = null;
console.log(age); // null
```

这里 `number | null | undefined` 是一个组合类型（union type），后面会有提到。

一般来说，建议开启强制检查，这样 TypeScript 能够最大化帮我们发现代码中的错误，在写码时就发现问题。

### Any

表示任意类型。此时等同于普通的 JavaScript 代码，因为标记为 `any` 后将会跳过 TypeScript 的类型检查。

```js
let someVar: any;
someVar = "饭后百步走，活到 99"; // ✅
someVar = 99; // ✅
someVar = undefined; // ✅
someVar = null; // ✅
```

即便在开启强制检查的情况下，上面的操作是没有任何问题的。一般情况下，只在一些特殊情况下使用 any，比如老代码的兼容，三方库代码的引入。

```js
declare var $: any;

$.extenfd({}, { foo: "foo" });
```

这里，因为 jQuery 是没有类型的三方库代码，但我们知道页面中引入后是可以调用它上面的方法的，只是 TypeScript 不识别，所以我们通过声明一个 `any` 类型的变量来**快速**解决这个问题。不快速的办法就是自己动手为其编写类型[声明文件](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)。

### Void

常见于函数没有返回值的情况。

```js
/** () => void */
function foo() {
  console.log("foo works");
}
```

如果将变量显式设置为 `void`，没有多大实际意义。因为变量始终是要用来承载有用的值的，如果你发现有这种需要，可使用 `null|undefiend` 代替。

### Never

这个类型就比较有意思了，正如其名，表示永远也不会发生的类型。

```js
function error(message: string): never {
  throw new Error(message);
}
```

关于 `never` 类型，印象中最巧妙的一个示例来自 TypeScript [Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html) 文档中关于 Discriminated Unions 的描述。既然是**高级类型**，下面的示例对于初学者来说如果看不懂就先跳过吧。

```js
interface Square {
  kind: "square";
  size: number;
}
interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}
interface Circle {
  kind: "circle";
  radius: number;
}

type Shape = Square | Rectangle | Circle;

function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

function area(s: Shape) {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
    case "rectangle":
      return s.height * s.width;
    case "circle":
      return Math.PI * s.radius ** 2;
    default:
      return assertNever(s); // error here if there are missing cases
  }
}
```

这里定义了三种基础的形状类型 `Square`，`Rectangle`，`Circle`。同时将三种类型进行组合创建了一个联合类型 （Union Type） `Shape`。 函数 `area` 接收一个 `Shape` 类型的数据并对其进行处理。因为 `Shape` 实际上有可能是三种类型中的其中一种，并不确定，所以需要对每个类型走不同的逻辑来处理。这里通过 `never` 实现了这样一个功能：假如后面我们又增加了一种新的形状类型，此时 `area` 函数能够自动抛错，告诉我们新增的类型没有相应的 `case` 分支来处理。

### 数组

数组本身是容器，需要上面的基本类型联合使用。

```js
/** 字符串数组 */
let names: Array<string>;

/** 存放数字的数组 */
let nums: Array<number>;

/** 数组中各元素类型不确定 */
let data: Array<any>;
```

还可通过下面的方式来表示：

```js
/** 字符串数组 */
let names: string[];

/** 存放数字的数组 */
let nums: number[];

/** 数组中各元素类型不确定 */
let data: any[];
```

当数组中元数个数有限且提前知晓每个位置的类型时，可将这种数据声明成元组（tuple，如果你用过 Python 应该不会陌生）。

```js
let point: [number, number] = [7, 5];
let formValidateResult: [booelan, string] = [false, "请输入用户名"];
```

### 枚举

枚举类型在强类型语言中是很常见的，用来标识变量可取的候选值。

```js
enum Gender {
    Male,
    Female
}

console.log(Gender.Female===1); // true
```

枚举实质上是通过更加语义化的符号来表示数字类型的值，比如上面 `Gender.Female` 代表的值是 `1`，因为枚举默认从 0 开始。

可通过手动指定的方式来改变默认的 0。

```diff
enum Gender {
+  Male = 1,
  Female
}

console.log(Gender.Female); // 2
```

当然，你也可以让枚举表示其他类型的值，而不是数字。只不过需要手动指定。如果手动指定非数字类型的值，那么枚举中的项是无法像数字那样自动自增以初始化自己，所以需要手动为每个项都显式指定一下它应该代表的值。

```js
enum Gender {
  Male = "male",
  Female // 🚨 Enum member must have initializer.
}
```

正确的做法：

```js
enum Gender {
  Male = "male",
  Female = "female" // ✅
}

console.log(Gender.Female); // female
```

枚举中的值也不一定都得是同一类型，所以下面这样也是可以的：

```js
enum Gender {
  Male = "male",
  Female = 2 // ✅also ojbk
}
console.log(Gender.Female); // 2
```

### 函数类型

函数的类型包含了入参及返回值两部分。

```js
(num: number) => string;
```

看起来像其他静态类型语言比如 Java 中的抽象方法，只有声明没有实现的样子。

```js
interface Calculator {
  name: string;
  calculate: (x: number, y: number) => number;
}

class Computer implements Calculator {
  constructor(public name: string) {}
  calculate(x: number, y: number) {
    return x + y;
  }
}

const counter: Calculator = {
  name: "counter",
  calculate: (x: number, y: number) => {
    return x - y;
  }
};
```


## `interface` 与 `type`

通过上面的基本类型，可以抽象并定义对象。通过 `interface` 或 `type` 关键词，均可定义组合的复杂类型。

```js
type Role = "manager" | "employee";

interface Person {
  name: string;
  age: number;
  role: Role;
}
```

通过 `type` 定义的类型，又叫 `type alias`，除了通过它创建类型，还可方便地为现有类型创建别名，体现了其 `alias` 的本意。

```js
type Name = string;
const myName: Name = "Tom";
```

上面的示例意义不大， type alias 在[高级类型](https://www.typescriptlang.org/docs/handbook/advanced-types.html)中的作用会非常明显，能够为复杂类型创建别名从而使用的时候只需要写别名即可。

```js
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
  if (typeof n === "string") {
    return n;
  } else {
    return n();
  }
}
```

两种类型在使用上，没多大差别，只是尽量在代码中保持风格统一。更加具体的差异分析可继续阅读 [TypeScript: type alias 与 interface](https://github.com/wayou/wayou.github.io/issues/42)。


## 交叉类型与联合类型

交叉类型（Intersection Types）与联合类型（Union Types）也是属性高级类型中的内容，前面示例中有涉及到所以这里简单介绍。

交叉类型是通过 `&` 操作符创建的类型，表示新的类型为参与操作的这些类型的并集。它实际上是将多个类型进行合并，而不是像其名称那样取交集。

```js
interface Student {
  id: string;
  age: number;
}

interface Employee {
  companyId: string;
}

type SocialMan = Student & Employee;

let tom: SocialMan;

tom.age = 5;
tom.companyId = "CID5241";
tom.id = "ID3241";
```

当一个学生加上工人的属性，他成了一个社会人，嗯。

联合类型（Union Types）正如创建这种类型所使用的操作符 `|` 一样，他表示或的关系。新类型是个叠加态，在实际运行前，你不知道它到底所属哪种类型。

```js
function addOne(num: number | string) {
  /** 🚨 Operator '+' cannot be applied to types 'string | number' and '1'. */
  return num + 1;
}
```

比如对入参加一的方法，JavaScript 中我们是可以这样干的，如果传入的是字符串，加号操作符会对其中一个做隐式转换。但结果可能不是你想要的数字加 1 而是变成了字符串相加。

而 TypeScript 在此时就体现了其静态类型的优点，因为入参在这里是不确定的类型，随着输入的不同得到的结果是不可预期的，这大概率会导致 bug。而这个 bug 在 TypeScript 里被提前找了出来。

```diff
function addOne(num: number | string) {
  // ✅ 
+  return Number(num) + 1;
}
```

除了像上面入参不确定的情形，像前面示例有用到过的，将多个字符串联合，也是很常见的用法。甚至最佳实践中，建议你用联合字符串来代替枚举类型。But why? [参见这里](https://medium.com/@martin_hotell/10-typescript-pro-tips-patterns-with-or-without-react-5799488d6680)

```js
type Role = "manager" | "employee";
```

## 类型断言

某些情况下，TypeScript 无法自动推断类型，此时可人工干预，对类型进行显式转换，我们称之为类型断言（Type assertions）。通过在值的前面放置尖括号，括号中指定需要的类型。

```js
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```

因为尖括号在写 React 组件时会有问题，**容易被错误地当成 JSX 标签**，所以 TypeScript 还支持另一种类型转换的操作，通过 `as` 关键字。

```js
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

下面看一个更加实际的情况：

```js
interface Person {
  name: string;
  gender: "male" | "female";
}

function sayName(person: Person) {
  console.log(person);
}

const tom = {
  name: "tom",
  gender: "male"
};

/** 🚨Type 'string' is not assignable to type '"male" | "female"' */
sayName(tom);
```

这里 `tom` 没有显式指定为 `Person` 类型，但其实因为 TypeScript 的类型约束的是数据的结构，只要是形状上兼容，就可以将 `tom` 赋值给接收 `Person` 类型的入参。 这种机制也类似于你声明了一个变量并赋值个数字，这个变量自动就被推断出类型为数字一样，然后可以在任何地方当作数字来用，即便你并没有显式指明。

所以这个示例中，我们需要修正一下初始化 `tom` 的对象中 `gender` 字段的类型，然后 TypeScript 就能正确推断出 `tom` 是个 `Person` 类型。

```js
interface Person {
  name: string;
  gender: "male" | "female";
}

function sayName(person: Person) {
  console.log(person);
}

const tom = {
  name: "tom",
  gender: "male" as "male" | "female"
};

/** ✅ ojbk */
sayName(tom);
```

结合前面提到的类型别名，这里可以用 `type` 为性别创建一个别名类型，减少冗余。

```diff
+ type Gender = "male" | "female";

interface Person {
  name: string;
+  gender: Gender;
}

function sayName(person: Person) {
  console.log(person);
}

const tom = {
  name: "tom",
+  gender: "male" as Gender
};


sayName(tom);
```

## 可选参数与可空字段

定义类型时，如果字段后跟随一个问号，表示该字段可空，此时效果相当于是该类型自动与  `undefined` 进行了联合操作。以下两个类型是等效的。

```js
type Person = {
  name: string,
  age?: number
};

type Person2 = {
  name: string,
  age: number | undefined
};
```

对于函数入参而言，入参加上问号后，可将入参标识为可选，调用时可不传递。

```js
function add(x: number, y?: number) {
  return x + (y || 1);
}
```

但此时可选的入参需要在参数列表中位于非可选的后面，像这样交换顺序后是不行的：

```js
/** 🚨 A required parameter cannot follow an optional parameter. */
function add(y?: number, x: number) {
  return x + (y || 1);
}
```

## 总结

了解了一些基本的类型知识和写法就可以进行简单的业务编写了。你可以从官方的这个[模板页面](https://www.typescriptlang.org/samples/)找到适合自己的技术栈作为练手的开始。

然后，可以系统地浏览一遍 [Handbook](https://www.typescriptlang.org/docs/handbook/basic-types.html)，对 TypeScript 整体有个健全的了解。

其中 [Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html) 章节里可以学习到进阶的类型定义和花式玩法，高级类型对于库的作者或写通用公共模块来说很有必要去了解。

## 相关资源

- [JavaScript data types and data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- [TypeScript in 5 minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [Understanding TypeScript’s type notation](http://2ality.com/2018/04/type-notation-typescript.html)

    