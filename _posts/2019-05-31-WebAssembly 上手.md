---
layout: post
title: "WebAssembly 上手"
date: 2019-05-31 23:05:00 +0800
tags: 
---
    
# WebAssembly 上手


## 安装

Mac 上最便捷的安装方式当然是通过 Homebrew:

```sh
$ brew install emscripten
```

安装好之后讲道理就已经自动配置好一切，然后 `emcc` 命令便可用了。

下面看非 Homebrew 安装的方式。

通过官方 [WebAssembly - Developer’s Guide](https://webassembly.org/getting-started/developers-guide/) 提供的安装配置步骤进行环境相关设置。这里以 macOS 为例。

### 下载工具链

通过 clone emscripten 仓库到本地进行工具链（toolchain）的下载安装。

```sh
$ git clone https://github.com/emscripten-core/emsdk.git
$ cd emsdk
```

### 安装及配置

执行安装：

```
$ ./emsdk install latest
```

激活工具链，生成相应环境配置：

```sh
$ ./emsdk activate latest
```

<details>
<summary>
`./emsdk activate latest` 命令的输出
</summary>

```
$ ./emsdk activate latest
Writing .emscripten configuration file to user home directory /Users/wayou/
The Emscripten configuration file /Users/wayou/.emscripten has been rewritten with the following contents:

import os
LLVM_ROOT = '/Users/wayou/dev/emsdk/fastcomp/fastcomp/bin'
BINARYEN_ROOT = '/Users/wayou/dev/emsdk/fastcomp'
NODE_JS = '/Users/wayou/dev/emsdk/node/8.9.1_64bit/bin/node'
SPIDERMONKEY_ENGINE = ''
V8_ENGINE = ''
TEMP_DIR = '/var/folders/qr/dlqjq3zj10xgf2xfx3mybn500000gn/T'
COMPILER_ENGINE = NODE_JS
JS_ENGINES = [NODE_JS]

To conveniently access the selected set of tools from the command line, consider adding the following directories to PATH, or call 'source ./emsdk_env.sh' to do this for you.

   /Users/wayou/dev/emsdk:/Users/wayou/dev/emsdk/fastcomp/emscripten:/Users/wayou/dev/emsdk/node/8.9.1_64bit/bin
Set the following tools as active:
   releases-fastcomp-3b8cff670e9233a6623563add831647e8689a86b-64bit
   node-8.9.1-64bit
```

</details>

**小贴士**：其中 install 过程会从 `https://chromium.googlesource.com`，`https://storage.googleapis.com` 及 `https://s3.amazonaws.com` 域下载东西，所以最好在命令行配置科学上网，否则安装会失败。

### 环境变量

通过执行以下命令添加相应命令及目录到环境变量以方便调用：

```sh
$ source ./emsdk_env.sh --build=Release
```

如果进行到这一步发生如下错误：

```sh
$ source ./emsdk_env.sh --build=Release
./emsdk_env.sh (line 19): Missing end to balance this if statement
if [ "$SRC" = "" ]; then
^
from sourcing file ./emsdk_env.sh
	called on standard input

source: Error while reading file './emsdk_env.sh'
```

这多半是因为你用的 shell 是 [fish](https://fishshell.com) 语法不兼容的原因。

两个解决办法：

- 可通过来自[emscripten-core/emsdk issue#111](https://github.com/emscripten-core/emsdk/issues/111) 中提供的方法，执行下面的命令来绕开：

```sh
$ bash ./emsdk_env.sh
```

- 因为其也提供了对应的 `.fish` 脚本，所以，也可以直接选择运行该 fish 脚本来解决上面语法报错的问题：

```sh
$ source ./emsdk_env.fish
```

执行成功的输出：

```sh
$ source ./emsdk_env.fish
Adding directories to PATH:
PATH += /Users/wayou/dev/emsdk

Setting environment variables:
EMSDK = /Users/wayou/dev/emsdk
EM_CONFIG = /Users/wayou/.emscripten
```

### 检查安装

完成上面步骤后，可通过运行 `emcc --version` 命令查看是否安装成功：

```sh
$ emcc --version
```

<details>
<summary>
`emcc --version` 命令的输出
</summary>

```sh
$ emcc --version
cache:INFO: generating system asset: is_vanilla.txt... (this will be cached in "/Users/wayou/.emscripten_cache/is_vanilla.txt" for subsequent builds)
cache:INFO:  - ok
emcc (Emscripten gcc/clang-like replacement) 1.38.33 (commit 0490c5f7aaf0e61aafd3b4cfe22cc56b803026b1)
Copyright (C) 2014 the Emscripten authors (see AUTHORS.txt)
This is free and open source software under the MIT license.
There is NO warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```

</details>

如果执行 `emcc` 时报如下错误：

```sh
$ emcc --version
emscripten requires python 2.7.12 or above
```

大概率是 macOS 自带的是老版本的 Python2，而 `emcc` 需要 Python3。解决办法有很多，这里说一个。

尝试过在命令的配置文件中添加 `alias` 配置 `aliast python=python3`，是不生效的，但可以将 `emcc` 命令配置 `alias` 显式指定使用 `python3` 来启动。将如下配置添加到相应 shell 的配置文件中，以 fish 为例其配置文件为 `~/.config/fish/config.fish`:

```bash
alias emcc="python3 /Users/wayou/Documents/dev/github/emsdk/fastcomp/emscripten/emcc"
alias em++="python3 /Users/wayou/Documents/dev/github/emsdk/fastcomp/emscripten/em++"
alias emrun="python3 /Users/wayou/Documents/dev/github/emsdk/fastcomp/emscripten/emrun"
```

根据官方文档的描述：

> use em++ to force compilation as C++
> _--[Emscripten Tutorial](https://emscripten.org/docs/getting_started/Tutorial.html)_

`em++` 用于编译 c++ 代码，所以这里将 `em++` 也添加上了。

这里同时也将 `emrun` 添加上了别名，方便后面使用它来启动本地服务以调试。


**小贴士**：新开命令行窗口或重启命令行后，需要重新执行 `source` 命令，可将其添加到你所使用的命令行的配置文件中，`.bash_profile`，`.zshrc`，或 `.`

以 fish 为例：

**~/.config/fish/config.fish.fish**

```sh
source "/Users/wayou/dev/emsdk/emsdk_env.fish";
```

这样每次启动命令行后 `emcc` 都是可用状态。

## 编译及运行

安装配置完成后，便可以尝试编译并运行一个简单的 demo 程序了。

一些注意点：

- 运行 `emcc` 时需要指定 `-s WASM=1` 参数，否则默认情况下其输出为 `asm.js`。
- 除了生成 Wasm 二进制文件及对应的 JavaScript 封装，如果还想要生成一个可直接查看的 HTML 页面，可在输出时指定一个后缀为 `.html` 的文件。
- 实际运行时不能直接打开这个生成的 HTML 文件，因为 `file:///` 协议不支持跨域，所以需要本地启一个服务器来查看。

### 编写 Hello World

创建 `hello.c` 文件并输出以下内容：

_hello.c_

```c
#include <stdio.h>
int main(int argc, char ** argv) {
  printf("Hello, world!\n");
}
```

### 编译

执行以下命令进行编译：

```sh
$ emcc hello.c -s WASM=1 -o hello.html
```

### 运行

通过工具链中提供的 `smrun` 来开启一个本地服务器以查看刚刚生成的程序：

```sh
$ emrun --no_browser --port 8080 .
```

当然，使用其他任意 server 也是可以的，比如 Python 的：

```sh
$ python -m http.server 8080
```

启动成功后浏览器访问 [http://localhost:8080/hello.html](http://localhost:8080/hello.html)。不出意外你会看到页面中 Emscripten 的控制台展示了 `Hello, world!`。

![WebAssembly Hello Wrold 运行效果](https://user-images.githubusercontent.com/3783096/58644777-8e45fc00-8334-11e9-81cb-b4d27945df56.png)

<p align="center">WebAssembly Hello Wrold 运行效果</p>

但用 `emrun` 的好处在于它已经处理好了 `.wasm` 文件的返回类型为 `Content-type: application/wasm`，而其他 server 可能需要额外的配置，否则默认情况下 `.wasm` 文件返回到浏览器时其 `Content-Type` 不对会报错。

## 调用 C++ 中的方法

下面来看如何在 JavaScript 中调用 C++ 定义的方法。

默认情况下，Emscripten 编译后的代码只包含 `main` 方法相关的调用，其他无关的代码将会在编译时去掉。可通过在方法名前加 `EMSCRIPTEN_KEEPALIVE` 来防止需要导出的方法被去掉。

将以下代码放入 `hello.c` 并保存。

```cpp
#include <stdio.h>
#include <emscripten/emscripten.h>

int main(int argc, char ** argv) {
    printf("Hello World\n");
}

#ifdef __cplusplus
extern "C" {
#endif

void EMSCRIPTEN_KEEPALIVE myFunction(int argc, char ** argv) {
    printf("MyFunction Called\n");
}

#ifdef __cplusplus
}
#endif
```

此时编译需要加上 `NO_EXIT_RUNTIME` 参数，否则默认情况下 C++ 模块中 `main` 方法返回后程序就结束了。

执行以下命令编译代码：

```sh
$ emcc -o hello3.html hello3.c -O3 -s WASM=1 -s NO_EXIT_RUNTIME=1  -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall']"
```

打开在发生的 `hello.html`，在第一个 `<script>` 标签开始前加上一个按钮：

```html
<button class="mybutton">Run myFunction</button>
```

添加以下点击调用逻辑到第一个 `<script>` 代码块的末尾：

```js
document.querySelector(".mybutton").addEventListener("click", function() {
  alert("check console");
  var result = Module.ccall(
    "myFunction", // name of C function
    null, // return type
    null, // argument types
    null // arguments
  );
});
```

再次启动服务器运行后，点击页面中按钮在控制台观察输出。

![JavaScript 中调用 C++ 方法的示例](https://user-images.githubusercontent.com/3783096/58781578-e28bfd00-860e-11e9-9cf2-3e26b7030a03.gif)
<p align="center">JavaScript 中调用 C++ 方法的示例</p>


## 相关资源

- [WebAssembly - Developer’s Guide](https://webassembly.org/getting-started/developers-guide/)
- [Compiling a New C/C++ Module to WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly/C_to_wasm)

    