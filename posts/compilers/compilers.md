## 编译了解一下

踏步编程领域，你或多或少会听到「编译器」，「解释器」这类词汇。特别地，如果你是前端，一定是知道解释器的，因为像 JavaScript 脚本类语言一般都是解释执行的嘛，同是解释执行的还有前端同学经常会会写的 php。

一般认为编译器输出优化后的代码运行较快，解释器边解释边运行代码速度较慢。但，世界总不那么简单，生活也不那么容易。

![人生总是那么痛苦吗？还是只有小时候是这样](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/compilers/assets/always_compilcate.jpeg)

JIT ([Just-in-time compilation](https://en.wikipedia.org/wiki/Just-in-time_compilation))，一种结合了传统译编译 AOT（Ahead-of-time compilation
(https://en.wikipedia.org/wiki/Ahead-of-time_compilation)）和解释器方式的编译，就不能简单归类为某种类型。
实际运用中更是会将融合多种技术，以达到最佳的效果，着实让编译的工作复杂了起来，就像它从未简单过一样的复杂。比如 Chrome 及 Node 使用的 JS  引擎 V8。了解 V8 的工作流程前，还是需要将前面提到的编译概念了解一下先。


### 为什么需要编译

讲道理，处理器（CPU）只认[机器码](https://en.wikipedia.org/wiki/Machine_code)。所谓机器码，即处理器能直接运行的二进制代码。所以高级语言出现前，要和处理器打交道，或者说让电脑做事情，就需要写[汇编](https://en.wikipedia.org/wiki/Assembly_language)（一种人类能看懂的机器码，这么理解）。

__一个汇编的 hello world 示例__
```asm
section .text                   ;section declaration

                                ;we must export the entry point to the ELF linker or
    global  _start              ;loader. They conventionally recognize _start as their
			                          ;entry point. Use ld -e foo to override the default.

_start:

                                ;write our string to stdout

    mov     edx,len             ;third argument: message length
    mov     ecx,msg             ;second argument: pointer to message to write
    mov     ebx,1               ;first argument: file handle (stdout)
    mov     eax,4               ;system call number (sys_write)
    int     0x80                ;call kernel

                                ;and exit

  	mov     ebx,0               ;first syscall argument: exit code
    mov     eax,1               ;system call number (sys_exit)
    int     0x80                ;call kernel

section .data                   ;section declaration

msg db      "Hello, world!",0xa ;our dear string
len equ     $ - msg             ;length of our dear string
```

是，机器能读懂了。但对人来说，不太友好。人有一点好，就是想尽办法让环境适合自己以使自己变得舒服。写这样的程序，显然不是很舒服。于是出现了[高级语言](https://en.wikipedia.org/wiki/High-level_programming_language)（相比汇编确实很高级，这样理解）。

__javascript hello world 示例__
```js
console.log(`hello world!`)
```

程序简单了，但脏活并没有少。要让处理器执行上面的代码，需要一个转换过程，即高级语言到机器码的转换。成功甩锅给编译器。

### QuipScript

为了理解各概念，借用 [Interpreters, JITS, & Compilers (Oh My!)](https://medium.com/fullstack-academy/interpreters-jits-compilers-oh-my-1bec4702995a) 中提供的示例，用 JavaScript 创建一种新语言 QuipScript，它的功能很简单，打印信息。如此简单的功能决定了该语言不会有太复杂的语法。事实也确实如此。我们就在为其写编译器的过程中，来理解这些编译相关的概念。

我们准备用 JavaScript 实现对它的编译执行。这样的场景下，QS 便是一种高级语言，而 JS 则是对应需要被转换成的目标机器码。这个转换过程便是需要我们去实现的。

因为只是展示目的，定义的语法规则很简单，共包含四种：

- `#` 代表注释
- `+` 表示添加文本
- `-N` 表示删除 N 个字符
- `print` 打印文本

每个语法各占一行。

下面是一段 QuipScript 示例代码，假如它被保存在一个叫 `hello-world.qs` 的文件中。

```js
+hello
+ you

print

-3
+them
-4
+world!
-1

print
```

按照定义，可分析出该段代码会先打印出 `hello you`，再打印出 `hello world`。

为了能够让它跑起来，我们需要先将它转成合法的 JS 代码。首先看解释器的方式。


### 解释器

将其解释执行需要如下的步骤：

- 读取源文件
- 将源码划分成行
- 解析出每一行的语法
- 执行相应的动作

对于一个熟稔 JS 的老司机来说，写出这样的程序来并不难。

__interpreter.js__
```js
'use strict';

const SOURCE_CODE_FILENAME = './hello-world.qs'

/**
 * QuipScript 解释器!
 * 本程序读取 QS 文件并解释执行
 * 解释源码过程中程序的结果是实时输出的
 */

const { readFileSync } = require('fs')
const sourceCode = readFileSync(SOURCE_CODE_FILENAME, 'utf8')

let string = ''

sourceCode
.split('\n') // 拆分成行
.forEach(line => {
	switch (line[0]) {
		case undefined: break; // 空行，什么也不做
		case '#': break; // 注释，什么也不做
		case '+': string += line.slice(1); break; // + 添加文本
		case '-': string = string.slice(0, +line); break; // - 删除文本
		case 'p': console.log(string); break; // 打印文本
		default: throw Error('unexpected token: ' + line);
	}
})
```

然后用 node 启动这个「解释器」，运行后得到 QS 程序的结果。

```bash
$ node interpreter.js
hello you
hello world
```

如上，解释器对源码中的每一行进行解析，遇到相应的指令就进行相应的动作。源码中的程序是一边被解释一边被执行的。

下面开始有意思的部分。假若源码中有错误会如何。譬如我们在第一个 `print` 后加入一个 QS 规则之外的语句，解释器就无法识别该代码的意图。

```js
...
+ you

print

ERROR I AM AN INVALID LINE OF GSCRIPT CODE

-3
+them
...
```

```bash
$ node interpreter.js
hello you
/Users/glebec/dev/compilers-article/interpreter.js:25
  default: throw Error('unexpected token: ' + line);
           ^
Error: unexpected token: ERROR I AM AN INVALID LINE OF GSCRIPT CODE
    at sourceCode.split.forEach.line (/Users/glebec/dev/compilers-article/interpreter.js:25:18)
```

虽然程序有错误，但因为错误在第一个 `print` 语句后面，所以错误之前的代码被正常执行了，打印出了 `hello you`。

在这个简单的示例下，因为程序中需要解析的语法并不太多，所以我们的解释器看起来是很简单直观的。真实情况下所面临的语言是非常复杂的，譬如 JavaScript 在浏览器中运行，则需要先将 JS 转成一个中间状态（语法树 AST）再进行进一步的解析。


### 及时编译器（JIT Compiler）

上面展示的解释器，其工作方式是边解释边执行。进一步地，完全可以不用一行一行地执行，可以将整个源码解释完之后再统一执行。

对上面的解释器稍加修改，我们得到了如下的代码：

```js
'use strict';

const SOURCE_CODE_FILENAME = './hello-world.qs'

/**
 * QuipScript JIT 编译器!
 * 本程序读取 QS 源码，编译并运行
 * 编译过程输出目标代码（JavaScript）
 */

const { readFileSync } = require('fs')
const sourceCode = readFileSync(SOURCE_CODE_FILENAME, 'utf8')

let program = `let string = '';\n`

sourceCode
.split('\n') // 划分成行
.forEach(line => {
	switch (line[0]) {
		case undefined: break; // 空行，什么也不做
		case '#': break; //  注释，什么也不做
		case '+': // + 添加文本
			program += `string += '${ line.slice(1) }';\n`;
			break;
		case '-': // 移除文本
			program += `string = string.slice(0, ${ line });\n`;
			break;
		case 'p': //  打印文本
			program += 'console.log(string);\n';
			break;
		default: throw Error('unexpected token: ' + line);
	}
})

// 到此我们将 QS 代码转换成了目标代码，即 JS 代码,
// 然后即时（Just In Time）地运行它

eval(program) // eslint-disable-line no-eval

// 调试用:

console.log('\n\nFYI, here is the compiled program:\n\n' + program)
```

这便是即时编译器（JIT/Just-In-Time Compiler）。我们将源码完整解析，最后形成目标代码（Object code）后再运行。这里已经不是一行一行地解释执行了，最后执行的是目标代码，所以它不再是解释器，可以算是编译器了，因为是即时运行输出结果的，所以是即时编译器。

使用这个即时编译器来编译示例代码，会得到与前面解释器相同的输出。

```bash
$ node jit.js
hello you
hello world
FYI, here is the compiled program:
let string = '';
string += 'hello';
string += ' you';
console.log(string);
string = string.slice(0, -3);
string += 'them';
string = string.slice(0, -4);
string += 'world!';
string = string.slice(0, -1);
console.log(string);
```

为了方便查看，在这个即时编译器中，我们将最后得到的目标代码完整打印了出来。

与解释器的区别在于，程序的结果是在最后 `eval` 执行的时候输出的，也就是说，如果源码中有未识别的语句，会在编译阶段抛错，以至于无法生成合法的目标代码，当然也就不会输出任何结果。就不会像前面解释器一样，虽然后续代码解释失败，但之前的代码会正常执行并输出结果。

```bash
/Users/glebec/dev/compilers-article/jit.js:31
  default: throw Error('unexpected token: ' + line);
           ^
Error: unexpected token: ERROR I AM AN INVALID LINE OF GSCRIPT CODE
    at sourceCode.split.forEach.line (/Users/glebec/dev/compilers-article/jit.js:31:18)
```


### 预编译器（AOT Compiler）

相比上面的 JIT 编译，AOT（Ahead of Time）指预先将源码编译成目标程序并保存下来，以供后续使用时直接运行。最常见的，手机上安装的 APP 便是针对各平台（安卓或 iOS）预先编译好的程序，安装后每次运行的便是编译后的对应平台的机器码。这样，不用每次需要运行程序的时候都需要走一次编译，像上面 JIT 那样。

所以，只需要将上面 JIT 编译器的代码最后一处逻辑修改一下。我们将编译生成的目标代码保存到一个文件中，而不是立即执行。

```diff
...
+ var fs = require('fs');
...
- eval(program); // eslint-disable-line no-eval

+ fs.writeFile('hello-world.js', program, function(err) {
+     if (err) {
+         return console.log(err);
+     }
+ 
+     console.log('成功编译成 hello-world.js');
+ });
```

得到编译后的 `hello-world.js` 后，这便是我们所需要的目标程序。运行后得到预期的结果。

```bash
$ node hello-world.js
hello you
hello world
```

与前面解释器及 JIT 编译器不同的是，这次我们真正运行的，是编译后的产出，不再是源码。可以看出，优点是很明显的，即运行编译后的目标代码省去了每次都从头编译的工作，非常高效，但这也正是其缺点，即首次运行前需要事先编译保存好。


### 调优 AOT 编译器（Optimizing AOT Compiler）

回顾前面 JIT 编译，曾将编译好的目标代码打印了出来：

```js
let string = '';
string += 'hello';
string += ' you';
console.log(string);
string = string.slice(0, -3);
string += 'them';
string = string.slice(0, -4);
string += 'world!';
string = string.slice(0, -1);
console.log(string);
```

不难看出，这样一段段落有很大的优化空间，我们完全可以在编译后生成如下更加优化的代码以达到相同的执行结果嘛：

```js
console.log('hello you')
console.log('hello world')
```

这，便体现了AOT编译器在编译过程中可以大范围施展拳脚的地方。因为需要事先组装好整个目标程序，所以在最终编译完成时，编译器是知道整个程序长什么样的，所以能从全局对其进行优化。于是从 AOT 编译器上面，可以进化出调优的 AOT 编译器（Optimizing AOT Compiler）。

__opt-compiler.js__
```js
...
let program = ''
let string = ''

sourceCode
.split('\n') // split into lines
.filter(line => line && line[0] !== '#') // 移除空行和注释
.forEach(line => {
	switch (line[0]) {
		case '+': // + 添加文本
			string += line.slice(1);
			break;
		case '-': // 移除文本
			string = string.slice(0, +line);
			break;
		case 'p': // 打印文本
			program += `console.log('${ string }');\n`;
			break;
		default: throw Error(`unexpected token: ${ line }`);
	}
})
...
```

产出的目标程序达到最优了，代价便是更长的编译时间，因为编译过程中需要进行的分析及优化。当然，这里的简单示例是看不出来这样的开销的。调优编译器的目标总结起来有如下几点：

- 深度分析源码以尽量调优。
- 生成运行快，体积小，轻便（指占用内存少）目标代码。有时这些特征之间是互斥的。

上面这个优化产出的示例已经很直观，但编译过程中的优化还包含许多其他方面：

- 无用代码的剔除（Dead code elimination）。分析出源码中永远不会执行的代码，譬如有段代码是写在 `if(false)` 中的，那么可以将其在编译时完全删掉。现今众多前端打包工具所支持的 Tree Shaking 特性便是这种类型的优化，虽然打包工具的编译和本文中所说的编译不是一回事。
- 寄存器分配。最常用的值应该被存放在离 CPU 最近的地方(e.g. 显式寄存器/explicit registers)，这样在频繁使用中无须去更远的地方读取以减少开销。
- 循环展开。如果一个循环语句执行的次数可以被预知，那这段循环代码可以展开成一段过程式的正常代码，这样会减少生成的机器码中进行流程控制的语句。要知道，进行流程控制的 `jump` 指令是开销很大的。
- 内联。如果一些变量只是存储了常量值被用在程序中各个地方，那么编译时可以将这些变量替换回它代表的常量值，这样程序在跑的时候使用直接的值而不是去进行一些变量值的计算。


### V8 了解一下

V8，这个 Chrome 及 Node 背后的神器。是它，让即使写得像屎一样的 Javascript 代码也跑得飞起来。成就了 Chrome 及 Node 的辉煌，并且继续代表着 Javascript 最先进的生产力。是它解析并运行你写的 Javascript 代码。那么它，是解释器，是 JIT 编译器还是 AOT 编译器，抑或是全部。

总之不能一概而论。得分时期来看。还是跟着 [Interpreters, JITS, & Compilers (Oh My!)](https://medium.com/fullstack-academy/interpreters-jits-compilers-oh-my-1bec4702995a) 这篇文章，来探访一下 V8 的神秘。

#### 早期：JIT + 调优编译器

早期的 V8 采用了两个编译器：一个叫作 Full-Codegen 的延时 JIT （Lazy JIT）和一个调优编译器（早期代号 Crankshaft，随后改名 Turbofan）。

- JIT 负责将代码转成对应平台能运行的机器码，比解释器稍慢，但可能因为此间浏览器还在加载其他资源，几乎感觉不出来慢。同时，其代码转换并不是一口气进行完的，而是按需进行（lazily）。
- 得到机器码后便立即运行，此时，运行机器码比解释执行要快了。但为了机器码能够尽量快地被执行，过程中对生成的代码并无任何优化。所以这里，代码的运行效率是还有空间提升的。
- 代码运行过程中，V8会跟踪执行情况，定位出 Hotspots，即那些频繁被调用可能导致性能瓶颈的函数。
- 随后调优编译器介入，将这些函数重新转换成更加高效的机器码，此过程比 JIT 还慢，但得到的机器码跑起来会快很多。
- 重新得到的高效机器码会在程序运行过程中无缝替换进去。所以你的代码会边跑边优化。


### 现在：编译器+解释器+调优编译器

根据这篇名为 [Launching Ignition and TurboFan](https://v8project.blogspot.tw/2017/05/launching-ignition-and-turbofan.html) 的官博介绍，
2017 V8 引入了新的流程，回归到解释器，但引入点火器 Ignition 的概念。

点火装置（Ignition）本身不解释执行 js，而是作用于一种介于 js 与机器码间的中间代码 bytecode，其与平台无关。本质上 bytecode 是标准的伪代码（pseudocode），可以看成是某种虚拟处理器的低级指令集。因为已经和汇编很像了，所以只需要花很小力气就可以转成对应平台的机器码。

总结起来，v8 新的实现中，包含一个 js 到 bytecode 的编译器，一个解释运行 bytecode 解释器，以及一个叫 Turbofan 的调优编译器。

当拿到一个 js 文件时，将会发生以下流程：

- 将 js 源码编译成 bytecode，编译后的代码与具体平台处理器无关。此过程会进行一些轻量的优化，所以生成的代码算得上比较高效了。
- 然后 Ignition 解释执行 bytecode。相比直接运行机器码，是慢了点，但依然很快。
- 期间，Hotspots 被分析出来然后用 Turbofan 优化。与老方式不同，这里进行的优化是在 bytecode 基础上，而不是从 js 开始重新进行优化编译。

乍一看，新方式的优势看起来没有多明显。与直接使用 JIT 编译器转成机器码相比，新方式真的更好么？

事实上，Ignition 解释执行的速度非常接近于 Full-Codegen，同时还带来以下的好处：

- 更快的启动速度。因为编译成 bytecode 比一步到位地编译成机器码要省时省事。
- 极少的内存占用。因为转成 bytecode 后，大部分 js 源码可以丢弃掉了。特别是移动端内存紧张的环境下，收益会非常明显，这也是开发 Ignition 背后最大的动力。
- 与 Turbofan 调优编译器的衔接更容易，两者都将编译速度进行了提升，也更容易实现来自 ECMAScript 新的语法功能。

在这样的设计下，解释器运行时慢，编译器生成的代码运行快的准则正在变得模糊，至少存在微妙的差别，特别是在更多的混合编译方式加入的情况下。


### WebAssembly

对比 JIT 与 AOT 后，不禁会问，为何不使用使用 AOT 方式将 JS 提前编译成机器码在浏览器中跑，岂不是更优么。毕竟原生 APP 就是这么干的。

但对于 Web 环境来说，不太现实。因为浏览器间存在差异，服务端不可能为每种浏览器都保存一分定制的编译版本，然后动态下发。而且直接让浏览器运行预编译的原生代码会有诸多安全问题，读写电脑上的敏感信息有隐患，或者悄悄进行其他恶意操作。

但原生代码的高效并没有被忽视，所以 W3C 制定了 [WebAssembly](http://webassembly.org/)，一种适用所有浏览器的二进制代码格式，其目标是性能几乎与 native code 相近，同时一些功能上的限制使其能在浏览器中安全运行。

一些新进浏览器已经对其支持，但操作 DOM 的部分还是需要借助 JS。开发者直接编写 C 或者 Rust 代码然后编译为 WASM 模块，然后被 JS 调用。一些计算量大的工作由此可以得到很大性能提升，这种组合的运行方式让 Web 更加高效。


### 总结

上述各编译方式对比：

条目 | 动作 | 结果 | 编译速度 | 输出结果的时机 | 产出代码的运行速度
------|----|----|---|----|---
解释器/Interpreter | 解析源码的过程中执行代码 | 立即运行任务 | Zero (N/A) | 即时 | 慢
JIT 编译器/JIT Compiler | 将源码编译成目标语言，运行目标语言 | 运行产出的程序 | 快 | 顷刻间 | 良好
预编译器/AOT Compiler | 将源码编译成目标程序，然后保存下来待之后运行 | 保存产出的程序 | （可以）很快 | 运行时即时输出结果 | 良好
优化的预编译器/Optimizing AOT Compiler | 读取源码，翻译到目标代码，优化产出，最后再保存 | 保存产出的程序 | 慢 | 运行时即时输出结果 | 最佳

需要指出的是，编译过程中对代码进行优化并不只是 AOT 编译器独有的，JIT 同样可以做少量优化，前提是不太影响编译速度的情况下。区别就是 AOT 可以花足够多的时间来进行优化，以使输出达到最优。


### 相关资源
- [Assembly code vs Machine code vs Object code?](https://stackoverflow.com/questions/466790/assembly-code-vs-machine-code-vs-object-code)
- [Machine code](https://en.wikipedia.org/wiki/Machine_code)
- [Assembly hello world](http://asm.sourceforge.net/intro/hello.html)
- [Interpreters, JITS, & Compilers (Oh My!)](https://medium.com/fullstack-academy/interpreters-jits-compilers-oh-my-1bec4702995a)


