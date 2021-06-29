---
layout: post
title: "TypeScript 参数属性"
date: 2019-09-23T16:24:26Z
---
# TypeScript 参数属性

类中创建的 `readonly` 类型的属性，该类型的属性只能在声明处或构造器中进行初始化。

```ts
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
```

为了初始化 `name` 属性，不得不在构造器中声明另一个入参 `theName`。这显得冗余。

TypeScript 提供了在构造器上同时完成属性的声明和初始化的功能。

以下代码和上面的等效：

```ts
class Octopus {
    readonly numberOfLegs: number = 8;
    constructor(readonly name: string) {
    }
}
```

这种通过在构造器的入参中声明属性的方式叫作 [Parameter properties](https://www.typescriptlang.org/docs/handbook/classes.html#parameter-properties)。

**通过在构造器入参上添加访问限定符（accessibility modifier ），`readonly` 或两者结合，该参入便会成为类的属性。** 

一个比较综合的示例：

```ts
class Foo {
  a: string;
  public b: string;
  protected c: string;
  constructor(d: number, public e: string) {}
}

var foo = new Foo(1, "2");

console.log(foo.a); // ✅ `a` 没有修饰词，和 C++ struct 默认公有表现一样为 `public`，与 C++ class 默认私有刚好相反
console.log(foo.b); // ✅ `b` 是公有
console.log(foo.c); // 🚨 `a` `protected` 只能自己和继承类中访问
console.log(foo.d); // 🚨 `d` 没有修饰词，不是入参属性，类上面没有该属性
console.log(foo.e); // ✅ `a` 通过构造器创建的 `public` 属性
```


## 相关资源

- [TypeScript - Parameter properties](https://www.typescriptlang.org/docs/handbook/classes.html#parameter-properties)

