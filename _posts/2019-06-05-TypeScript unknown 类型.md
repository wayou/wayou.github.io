---
layout: post
title: "TypeScript unknown 类型"
date: 2019-06-05 23:06:00 +0800
tags: 
---
    
# TypeScript  `unknown` 类型

`unknown` 字面理解和 `any` 其实没差，任何类型都可赋值给它，但有一点，

> Anything is assignable to unknown, but unknown isn’t assignable to anything but itself and any without a type assertion or a control flow based narrowing
>
> _--[TypeScript 3.0 Release notes - New unknown top type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html)_

`unknown` 类型不能赋值给除了 `unknown` 或 `any` 的其他任何类型，使用前必需显式进行指定类型，或是在有条件判断情况下能够隐式地进行类型推断的情况。

下面代码是合法的：

```ts
let a: unknown;
const b: unknown = a;
const c: any = a;
```

因为 `unknown` 是可以赋值给 `unknown` 的，而下面的代码则不行，

```ts
let a: unknown;
// 🚨Type 'unknown' is not assignable to type 'number'.ts(2322)
const b: number = a;
```

但是如果使用时，明确知道了类型，则可以这样来修正：

```ts
let a: unknown;
// 🚨Type 'unknown' is not assignable to type 'number'.ts(2322)
const b: number = a;
```

或者在条件语句中，已经可以明确推断出类型：

```ts
let a: unknown;
let b: number = <number>a;

function isNumber(val: any): val is number {
  return typeof val === "number";
}

if (isNumber(a)) {
  b = a;
}
```

所以在使用时，`unknown` 类型会比 `any` 更加安全。这个安全体现在，虽然它和 `any` 一样存储了任意类型的值，但是具体使用的时候，这个类型需要显式确定，由使用者进行指定将 `unknown` 转换成某一确定类型。

## 优先级

### 与正交类型的搭配

正交类型（intersection type）中，`unknown` 不起作用：

```ts
type T00 = unknown & null;  // null
type T01 = unknown & undefined;  // undefined
type T02 = unknown & null & undefined;  // null & undefined (which becomes never)
type T03 = unknown & string;  // string
type T04 = unknown & string[];  // string[]
type T05 = unknown & unknown;  // unknown
type T06 = unknown & any;  // any
```

### 与联合类型的搭配

联合类型（union type）中 `unknown` 起绝对作用：

```ts
type T10 = unknown | null;  // unknown
type T11 = unknown | undefined;  // unknown
type T12 = unknown | null | undefined;  // unknown
type T13 = unknown | string;  // unknown
type T14 = unknown | string[];  // unknown
type T15 = unknown | unknown;  // unknown
type T16 = unknown | any;  // any
```

上面仅一个例外，及和 `any` 组成的联合类型，最终结果是 `any`。

### 使用在条件类型中

条件类型（conditional type）中，

```ts
type T30<T> = unknown extends T ? true : false;  // Deferred
type T31<T> = T extends unknown ? true : false;  // Deferred (so it distributes)
```

对于上面的条件类型，进行以下测试：

```ts
// `unknown` 不能赋值给 `number`
type foo = T30<number>; // false
// `unknown` 可以赋值给 `any`
type bar = T30<any>; // true

// 任何类型都可赋值给 `unknown`，所以都为 true
type a = T31<number>; // true
type b = T31<any>; // true
```

## 可进行的操作

只能进行等于的判断，其他操作则会报错。

```ts
function f10(x: unknown) {
    x == 5;
    x !== 10;
    x >= 0;  // Error
    x + 1;  // Error
    x * 2;  // Error
    -x;  // Error
    +x;  // Error
}
```

属性字段获取，方法调用等，也是不允许的：

```ts
function f11(x: unknown) {
    x.foo;  // Error
    x[5];  // Error
    x();  // Error
    new x();  // Error
}
```

当解构中有 `unknown` 类型时，会导致解构出来的结果也是 `unknown`。

```ts
function f26(x: {}, y: unknown, z: any) {
    let o1 = { a: 42, ...x };  // { a: number }
    let o2 = { a: 42, ...x, ...y };  // unknown
    let o3 = { a: 42, ...x, ...y, ...z };  // any
}
```

## 具体使用场景

`unknown` 用于变量类型不确定，但肯定可以确定的情形下，比如下面这个示例中，入参总归会有个值，根据这个值的类型进行不同的处理，这里使用 `unknown` 替代 `any` 则会更加类型安全。

```ts
function prettyPrint(x: unknown): string {
  if (Array.isArray(x)) {
    return "[" + x.map(prettyPrint).join(", ") + "]"
  }
  if (typeof x === "string") {
    return `"${x}"`
  }
  if (typeof x === "number") {
    return String(x)
  } 
  return "etc."
}
```


## 相关资源

- [TypeScript 3.0 Release notes - New unknown top type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html)
- [When to use `never` and `unknown` in TypeScript](https://blog.logrocket.com/when-to-use-never-and-unknown-in-typescript-5e4d6c5799ad/)

    