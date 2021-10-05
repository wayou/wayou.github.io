---
layout: post
title: "[golang] go:generate"
date: 2021-10-05T09:32:18Z
---
# [golang] go:generate

考察如下的场景：

你写了个 Go 程序，使其能够打印出版本信息比如：

```bash
$ myapp -v
v1.0.0 
```

简单地可以在程序里写死，但问题也很明显，每次发版都需要手动更新，更致命地，任何依赖人工介入的操作都有可能被遗忘。

如果有工具可以自动化这个操作就好了，事实上，Go 自带的工具链中确实有对应机制来自动化这个场景。

### `-ldflags`

[link tool](https://golang.org/cmd/link/) 接收形如 `X importpath.name=value` 的入参，通过 `ldflags` 指定。效果是自动将模块 `importpath` 中 `name` 替换为指定的 `value` 值。推而广之，在编译时就可以通过命令行将版本替换到代码中了。

一般地，我们并不直接使用 link tool，还是正常使用 `go build` ，`go run`，`go install`，执行这些命令时会自动透传 `-ldflags` 参数给 link tool。

以下是一个简单示例：

```go
// main.go

package main

import (
	"fmt"
)

var VersionString = "unset"

func main() {
	fmt.Println("Version:", VersionString)
}
```

 

执行：

```bash
$ go run main.go
Version: unset

$ go run -ldflags '-X main.VersionString=1.0' main.go
Version: 1.0
```

当然，这里 `value` 可以是任意值，只要执行时进行正确的传递即可，即，如果值当中包含空格，引号这些，需要在组织命令时做好转义。

通过 `git rev-parse HEAD` 将 Git 版本戳作为入参：

```bash
$ git rev-parse HEAD
db5c7db9fe3b632407e9f0da5f7982180c438929

$ go run -ldflags "-X main.VersionString=`git rev-parse HEAD`" main.go
Version: db5c7db9fe3b632407e9f0da5f7982180c438929
```

将日期作为入参：

```bash
$ go run -ldflags "-X 'main.VersionString=1.0 (beta)'" main.go
Version: 1.0 (beta)
$ go run -ldflags "-X 'main.VersionString=`date`'" main.go
Version: Sun Nov 27 16:42:10 EST 2016
```

实现了入参的自由传递，自动化过程就是将上面的脚本放入 makefile 或 ci 流程中这么简单了，而我们的代码则无须人工修改。

## `go:generate`

进一步地，通过在需要的地方以注释的方式直接编写需要执行的操作，`go:generate` 解析代码中的这些注释并执行。这样不必在命令行中进行脚本的拼接。

一个示例：

```bash
// main.go

package main

//go:generate echo Hello, Go Generate!

func Add(x, y int) int {
	return x + y
}
```

运行结果：

```bash
$ go generate
Hello, Go Generate!
```

其中因为 `!` 叹号不是有效的 bash 命令，`go:generate` 会自动忽略而正确执行。

`go:generate` 的完整文档参见[这里](https://golang.org/cmd/go/#hdr-Generate_Go_files_by_processing_source)。

## 解决外部依赖问题

一般地，对于 `go:generate` 能够执行的语句，并没有严格限制，这可以是 bash 脚本，可以是三方工具，只要编译 Go 程序的环境中保证需要执行的工具已经被正确安装可执行即可，比如上面使用的 git, 获取日期的工具等。

这就涉及到外部不确定性的依赖，导致程序无法在任意环境正常编译。解决办法是始终让 `go:generate` 通过 `go run` 运行另外的 Go 程序。因为如果环境能够编译 Go 程序，那么肯定安装了 Golang，这样其他 Go 工具也是能够正常执行的。

## 相关资源

- [How to Use //go:generate](https://blog.carlmjohnson.net/post/2016-11-27-how-to-use-go-generate/)
