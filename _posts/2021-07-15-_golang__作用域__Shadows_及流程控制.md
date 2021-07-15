---
layout: post
title: "[golang] 作用域, Shadows 及流程控制"
date: 2021-07-15T13:21:22Z
---
# [golang] 作用域, Shadows 及流程控制

## 作用域及 shadowing

和大多数语言一样，通过花括号声明语句块(block)，变量的作用域限制在其声明的语句块中。内层可访问外层的变量，内层同名变量会取代(shadowing)外层变量。

```go
func main() {
	x := 10
	if x > 5 {
		fmt.Println(x)
		x := 5
		fmt.Println(x)
	}
	fmt.Println(x)
	// 结果
	// 10
	// 5
	// 10
}
```

当使用 `:=` 语法声明变量时，很容易覆盖外层同名变量，因为该语法只在当前作用域有对应变量时，才复用，否则创建新的变量。

```go
func main() {
	x := 10
	if x > 5 {
		x, y := 5, 10
		fmt.Println(x, y)
	}
	fmt.Println(x)
	// 结果
	// 5 10
	// 10
}
```

## Shadowing 的检查

鉴于无意的覆盖会造成隐藏的 bug，编码过程中避免同名覆盖是有必要的。

`go vet` 及 `golint` 都没有针对  shadowing 的检查，不过可通过另一工具来进行，

```bash
$ go install golang.org/x/tools/go/analysis/passes/shadow/cmd/shadow@latest
```

安装完成后可将脚本加入到 makefile 的任务中，

```makefile
vet:fmt
	go vet ./...
	shadow ./...
.PHONY:vet
```

复用用前面的示例代码来测试：

```go
func main() {
	x := 10
	if x > 5 {
		x, y := 5, 10
		fmt.Println(x, y)
	}
	fmt.Println(x)
}
```

尝试运行：

```bash
$ make                                                                            10:08:35
go fmt ./...
go vet ./...
shadow ./...
/Users/wayou/work/dev/github/golang/chp1/main.go:8:3: declaration of "x" shadows declaration at line 6
make: *** [vet] Error 3
```

## Universal Block

Go 是门简洁的语言，保留的关键字仅 25 个。常用的原始类型诸如 `int`，`string` 以及 `true`，`false`，`function`，`nil` 等均不属于保留关键字，Go 的做法是将他们声明在了一个作用域 universal block 中。这个全局作用域包含程序中所有其他作用域。因此，程序中是可以覆盖这些关键字的，应尽量避免发生这种情况。

```go
func main() {
	fmt.Println(true) // true
	true := 10
	fmt.Println(true) // 10
}
```

## if 语句

和其他大多数语言一样，区别在于条件语句部分不使用括号包裹：

```go
func main() {
	n := rand.Intn(10)
	if n == 0 {
		fmt.Println(n)
	} else if n > 5 {
		fmt.Println(">5", n)
	} else {
		fmt.Println("other", n)
	}
}
```

还有个区别是允许创建只在 if 语句中使用的变量，比如下面的示例代码中，`n` 只在 if 语句内有效，其后若访问会报找不到的错误。

```go
func main() {
	if n := rand.Intn(10); n == 0 {
		fmt.Println(n)
	} else if n > 5 {
		fmt.Println(">5", n)
	} else {
		fmt.Println("other", n)
	}

	fmt.Println(n) // 🚨 undeclared name: ncompilerUndeclaredName
}
```

## for 循环

相比其他语言有 `while`，Go 中只有 `for` 形式的循环语句，但包含四种形式：

- 正常和 C 一样的形式
- 只包含条件判断的 for
- 无限循环的形式
- 以及 `for-range`

### c-like for

```go
func main() {
	for i := 0; i < 5; i++ {
		fmt.Println(i)
	}
}
```

同 `if` 语句一样，条件体部分不用括号包裹，其中声明的循环变量 `i` 也只能在 `for` 循环体这个作用域中使用。

### 只包含条件判断

可将循环中初始和自增的部分省略，只留条件判断部分：

```go
func main() {
	i := 0
	for i < 5 {
		fmt.Println(i)
		i++
	}
}
```

这和其中语言中的 `while` 就比较接近了。

### 无限循环形式

甚至，条件判断部分也可省略，此时形成一个无限执行的循环逻辑，通过 <kbd>control</kbd> + <kbd>c</kbd> 来结束程序。

```go
func main() {
	for {
		fmt.Println("hello")
	}
}
```

### break and continue

`break` 跳出循环，可用于上述任意类型的 `for` 形式。

`continue` 跳过本次循环进入下次循环，有时能达到简化代码的目的：

```go
func main() {
	for i := 0; i < 10; i++ {
		if i%5 == 0 {
			if i%3 == 0 {
				fmt.Println("foo")
			} else {
				fmt.Println("bar`")
			}
		} else {
			fmt.Println(i)
		}
	}

	// 上述代码使用 `continue` 改写后没有了嵌套的 if 逻辑
	for i := 0; i < 10; i++ {
		if i%5 == 0 && i%3 == 0 {
			fmt.Println("foo")
			continue
		}
		if i%5 == 0 {
			fmt.Println("bar")
			continue
		}
		fmt.Println(i)
	}
}
```

### label

通过添加标签，可使得 `continue` 跳转到指定位置，而不只是在当前循环中进行跳转。这在有多层循环嵌套的情况下很有用。

```go
func main() {
	s := [][]int{
		{1, 2, 3, 4, 5},
		{1, 2, 3},
		{1, 2, 3, 10},
	}
outer:
	for i, m := range s {
		for j := range m {
			if j > 2 {
				continue outer
			}
		}
		fmt.Println(i, m)
	}
}
```

### `for-range` 语法

`for-range` 可用来遍历字符串，数组，slice，map 及 channel 等。

```go
func main() {
	weeks := []string{
		"mon",
		"tue",
		"wen",
		"thu",
		"fri",
		"sat",
		"sun",
	}
	for i, v := range weeks {
		fmt.Println(i, v)
	}
}
```

输出：

```go
0 mon
1 tue
2 wen
3 thu
4 fri
5 sat
6 sun
```

Go 允许未使用的变量存在，如果不需要使用索引值，可使用 `_` 代替：

```diff
-	for i, v := range weeks {
+	for _, v := range weeks {
		fmt.Println(v)
	}
```

其他情况下，不使用函数返回的变量都可通过使用 `_` 形式来忽略。

如果只想使用索引而忽略值，则可直接省略掉 `for-range` 第二个返回值即可，

```diff
-	for i, v := range weeks {
+	for i := range weeks {
		fmt.Println(i)
	}
```

### 使用 `for-range` 遍历 map

```go
func main() {
	m := map[string]int{
		"foo": 1,
		"bar": 2,
		"baz": 3,
	}
	for k, v := range m {
		fmt.Println(k, v)
	}
}
```

map 中 `key` 的顺序是不能保证的，代码中要避免依赖 map 输出 key 顺序的逻辑。

### 遍历字符串

```go
func main() {
	s := "hello😵!"
	for i, v := range s {
		fmt.Println(i, v, string(v))
	}
}

// 输出结果：
// 0 104 h
// 1 101 e
// 2 108 l
// 3 108 l
// 4 111 o
// 5 128565 😵
// 9 33 !
```

可以看到，`for-range` 遍历字符串时，是按 rune 为单位遍历的，不是按 byte。

### 遍历是个复制操作

遍历过程中的值是原始值的副本，所以对其进行的操作不会影响原来的值。

```go
func main() {
	a := []int{
		1, 2, 3,
	}

	type person struct {
		name string
		age  int
	}

	m := map[string]person{
		"foo": {
			name: "foo",
			age:  1,
		},
		"bar": {
			name: "bar",
			age:  2,
		},
	}
	for _, v := range a {
		v *= 2
	}
	for _, p := range m {
		p.age = 99
	}
	fmt.Println(a, m) // [1 2 3] map[bar:{bar 2} foo:{foo 1}]
}
```

以上所有循环语句中，大部分情况下直接用 `for-range` 即可，在需要精确控制起始和结束位置，以及和 `break` ，`continue` 结合时，可使用原始的 `for` 语句。

## switch 语句

- 同 `if` 语句一样，条件部分不用括号包裹
- 可在条件及 `case` 部分进行变量声明，变量会限定在声明处的作用域
- 无需 `break` 因为 Go 中的 `switch` 是不会下穿到其他 `case` 语句的
- 当然也可以使用 `break` 来提前结束
- 与其他语言限定成整形不同，Go 中能 `switch` 所有可与 `==` 操作符使用的数据类型

```go
func main() {

	s := []string{
		"foo",
		"bar",
		"hello",
		"foobar",
	}
loop:
	for _, v := range s {
		switch l := len(v); l {
		case 1, 2, 3:
			fmt.Print("short\n")
		case 4:
		case 5:
			break loop
		default:
			fmt.Println("nothing here")
		}
	}

}
```

输出结果 ：

```bash
short
short
```

1. `case 1,2,3` 因为没有下穿的逻辑，如果多个条件共用一个分支，则使用逗号将各条件放一起
2. `case 4` 处为空语句，什么也不发生
3. `case 5` 使用 `break` 加标签的形式，提前结束了 `for` 循环，如果不加标签的话，结束的只是当前的 `switch`
4. 因为循环到 `hello` 时满足 `case 5` 分支，循环被提前结束，所以 `default` 分支没有被执行

下面把上述标签去掉再看其输出：

```diff
	case 5:
-				break loop
+				break
```

输出结果：

```bash
short
short
nothing here
```

### blank switch

与其他语言不再跟，Go 中的 `case` 部分还可以是个布尔值，而在 `switch` 处则无需指定用来进行对比的值，留空即可，所以叫 `blank switch`：

```bash
func main() {
	s := []string{
		"foo",
		"bar",
		"hello",
		"foobar",
	}
	for _, v := range s {
		switch l := len(v); {
		case l < 3:
			fmt.Print(">3\n")
		case l > 5:
			fmt.Print("<5\n")
		default:
			fmt.Println("3<x<5")
		}
	}
}
```

以上。

