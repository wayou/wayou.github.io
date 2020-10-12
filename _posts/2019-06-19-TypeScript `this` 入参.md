---
layout: post
title: "TypeScript `this` 入参"
date: 2019-06-19 23:06:00 +0800
tags: 
---
    
# TypeScript `this` 入参

考察下面的示例代码：

```ts
class MyClass {
  constructor(protected foo: string) {}

  @MyDecorator
  bar() {
    console.log("bar");
  }
}

function MyDecorator(
  _target: any,
  _key: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;
  descriptor.value = function(...args: any[]) {
    // 🚨Property 'foo' does not exist on type 'PropertyDescriptor'.ts(2339)
    console.log(this.foo);
    return original.apply(this, args);
  };
  return descriptor;
}

const myClass = new MyClass("erm");
myClass.bar();

```

上面代码定义了一个类 `MyClass`，包含一个 `protected` 类型的 `foo` 属性。

同时定义了一个 `MyDecorator` 装饰器，在被装饰方法调用前访问上面的 `protected foo` 属性并且打印出来。

可以看到上面示例中，已经将 TypeScript 报错标识了出来，可以看到此时 `this` 所指的对象其实不对，指向了 `PropertyDescriptor`，所以在装饰器中试图访问 `protected foo` 时提示没有 `foo` 属性。

首先我们需要修正一下 `this` 的类型，因为该装饰器修饰的是类的方法，所以 `descriptor.value` 中 `this` 应该是被修饰方法所在的类才对。

```diff
function MyDecorator(
  _target: any,
  _key: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;
  descriptor.value = function(...args: any[]) {
    // 🚨Property 'foo' does not exist on type 'PropertyDescriptor'.ts(2339)
    console.log((this as MyClass).foo);
    return original.apply(this, args);
  };
  return descriptor;
}
```

当我们试图通过强制类型转换修正 `this` 的类型时，发现新的错误出现了。因为 `foo` 被声明成了 `protected` 类型，它提示只能在 `MyClass` 中或其继承类中访问该属性。但我们明确知道，运行时 `descriptor.value` 确实是在这个类当中的。同时 Hover 到强制类型转换后的 `this` 上发现其类型还是 `PropertyDescriptor`，说明强制类型转换其实没生效。

![强制类型转换失败](https://user-images.githubusercontent.com/3783096/59554334-0a4a7000-8fd4-11e9-8c18-24493f082544.png)
<p align="center">强制类型转换失败</p>


## `this` 入参

对于这种需要修正函数中 `this` 所指的场景，TypeScript 提供了一种机制，可以在函数入参列表中第一个位置处，手动写入 `this` 标识其类型。但这个 `this` 入参只作为一个形式上的参数，供 TypeScript 做静态检查时使用，编译后是不会存在于真实代码中的。

```ts
function f(this: void) {
    // make sure `this` is unusable in this standalone function
}
```

像上面这样，`f` 被指定了 `this` 类型为 `void`，即 `f` 这个函数的函数体内，不允许使用 `this`。这有什么用呢，请看以下示例：

```ts
interface UIElement {
  addClickListener(onclick: (this: void, e: Event) => void): void;
}
class Handler {
  constructor(public info: string) {}
  onClickBad(this: Handler, e: Event) {
    this.info = e.type;
  }
}
let h = new Handler('foo');
// 🚨error
uiElement.addClickListener(h.onClickBad); 
```

上面 `uiElement.addClickListener` 声明了只接收一个不依赖于 `this` 上下文的函数做为回调，但我们传入的 `h.onClickBad` 声明为它执行时依赖于 `Handler` 这个上下文。因此显式地修正函数的执行上下文可让 TypeScript 检查出相关的错误。


回到文章开头的示例，我们就知道如何修正它了。

只需要将设置 `descriptor.value` 地方，为其添加上 `this` 入参即可保证正确的上下文了。

```diff
function MyDecorator(
  _target: any,
  _key: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;
-  descriptor.value = function(..args: any[]) {
+  descriptor.value = function(this: MyClass, ...args: any[]) {
    console.log((this as MyClass).foo);
    return original.apply(this, args);
  };
  return descriptor;
}
```

## 相关资源

- [TypeScript Handbook  - Functions#this parameters](https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters)
    