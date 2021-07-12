---
layout: post
title: "[golang] Map"
date: 2021-07-12T23:36:47Z
---
# [golang] Map

`map[keyType]valueType` 用于存放键值对。

```go
var nilMap map[string]int
```

像上面这样声明后未初始化的 map 自动赋成了零值  `nil`。长度为 0，尝试读取它身上的值时，始终返回 valueType 类型的零值，而尝试设置值为 `nil` 的 map 则会抛错。

声明并使用空对象字面量来初始化：

```go
m := map[string]int{}
```

与 `nil` 的区别在于它并不是无值 ，可安全地进行读写操作。

声明并初始化一个非空 map：

```go
func main() {
	names := map[string][]string{
		"class1": {"Tom", "David"},
		"class2": {"Lily"},
	}
	fmt.Println(names)
	// map[class1:[Tom David] class2:[Lily]]
}
```

如果知道数量但不知道具体存哪些值，可使用 `make` 声明，长度仍然为 0 ,并且后续添加超过 `make` 中指定的大小的数据：

```go
ages := make(map[int][]string, 10)
```

map 的一些特征：

- 向其添加值时，尺寸会自增
- 零值为 `nil`
- 不能做比较，但可以和 `nil` 做比较
- 使用 `len` 可得到其中键值对的数量
- 通过  `make` 可提前声明指定尺寸大小的 map

## Map 的读写

访问不存在的 key 时得到与类型对应的零值；可以获取到值后进行自增等操作。

```go
func main() {
	m := map[string]int{}
	m["foo"] = 1
	m["bar"] = 2
	fmt.Println(m)
	fmt.Println(m["baz"]) // 打印不存在的 key 得到默认的零值

	m["foo"]++
	m["baz"]++
	fmt.Println(m["foo"], m["baz"])
}
```

因为访问不存在的 key 也能正常返回 ，那么问题来了，如何确定一个 key 是否真实存在只是被设置成了零值，还是不存在。答案是使用 Go 提供的 comma ok Idiom 语法：

```go
func main() {
	m := map[string]int{}
	m["foo"] = 0

	v, ok := m["foo"]
	fmt.Println(v, ok) // 0 true

	v2, ok2 := m["bar"]
	fmt.Println(v2, ok2) // 0 false
}
```

将读取的值放入两个变量中，第一个是 key 对应的值，第二个 bool 值标识该 key 是否存在。

## 字段的删除

通过 `delete` 来删除 map 中的 key:

```go
func main() {
	m := map[string]string{
		"foo": "bar",
	}
	fmt.Println(m) // map[foo:bar]
	delete(m, "foo")
	fmt.Println(m) // map[]
}
```

以上。

