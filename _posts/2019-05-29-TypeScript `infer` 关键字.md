---
layout: post
title: "TypeScript `infer` 关键字"
date: 2019-05-30 01:05:00 +0800
tags: 
---
    
# TypeScript `infer` 关键字

考察如下类型：

```ts
type PromiseType<T> = (args: any[]) => Promise<T>;
```

那么对于符合上面类型的一个方法，如何得知其 Promise 返回的类型？

譬如对于这么一个返回 `string` 类型的 Promise:

```ts
async function stringPromise() {
  return "string promise";
}
```

## `RetrunType`

如果你对 TypeScript 不是那么陌生，可能知道官方类型库中提供了 `RetrunType` 可获取方法的返回类型，其用法如下：

```ts
type stringPromiseReturnType = ReturnType<typeof stringPromise>; // Promise<string>
```

确实拿到了方法的返回类型，不过是 `Promise<string>`。但其实是想要返回里面的 `string`，所以和我们想要的还差点意思。

既然都能从一个方法反解其返回类型，肯定还能从 `Promsie<T>` 中反解出 `T`。所以不不妨看看 `ReturnType` 的定义：

```ts
/**
 * Obtain the return type of a function type
 */
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

<kbd>F12</kbd> 一看，果然发现了点什么，这里使用了 `infer` 关键字。

## 条件类型及 `infer`

上面 `T extends U ? X : Y` 的形式为条件类型（Conditional Types），即，如果类型 `T` 能够赋值给类型 `U`，那么该表达式返回类型 `X`，否则返回类型 `Y`。

所以，考察 `ReturnType`的定义，

```ts
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

如果传入的类型 `T` 能够赋值给 `(...args: any) => R` 则返回类型 `R`。

但是这里类型 `R` 从何而来？讲道理，泛型中的变量需要外部指定，即 `RetrunType<T,R>`，但我们不是要得到 R 么，所以不能声明在这其中。这里 `infer` 便解决了这个问题。表达式右边的类型中，加上 `infer` 前缀我们便得到了反解出的类型变量 `R`，配合 `extends` 条件类型，可得到这个反解出的类型 `R`。这里 `R` 即为函数 `(...args: any) => R` 的返回类型。

## 反解 Promise<T>

有了上面的基础，推而广之就很好反解 `Promise<T>` 中的 `T` 了。

```ts
type PromiseType<T> = (args: any[]) => Promise<T>;

type UnPromisify<T> = T extends PromiseType<infer U> ? U : never;
```

测试 `UnPromisify<T>`：

```ts
async function stringPromise() {
  return "string promise";
}

async function numberPromise() {
  return 1;
}

interface Person {
  name: string;
  age: number;
}

async function personPromise() {
  return { name: "Wayou", age: 999 } as Person;
}

type extractStringPromise = UnPromisify<typeof stringPromise>; // string

type extractNumberPromise = UnPromisify<typeof numberPromise>; // number

type extractPersonPromise = UnPromisify<typeof personPromise>; // Person
```

## 解析参数数组的类型

反解还可用在其他很多场景，比如解析函数入参的类型。

```ts
type VariadicFn<A extends any[]> = (...args: A) => any;
type ArgsType<T> = T extends VariadicFn<infer A> ? A : never;
 
type Fn = (a: number, b: string) => string;
type Fn2Args = ArgsType<Fn>; // [number, string]
```

## 另一个示例

假设我们编写了两个按钮组件，底层渲染的是 HTML 原生的 `button` 和 `a` 标签。为了组件最大化可定制，原生元素支持的属性该组件也需要支持，因此可这样来写组件的 props:

```tsx
type ButtonProps = {
  color: string;
  children: React.ReactChildren;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type AnchorButtonProps = {
  color: string;
  disabled: boolean;
  children: React.ReactChildren;
} & React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export function Button({ children, ...props }: ButtonProps) {
  //...
  return <button {...props}>{children}</button>;
}

export function AnchorButton({ children, ...props }: AnchorButtonProps) {
  //...
  return <a {...props}>{children}</a>;
}
```

单看 `Button` 和 `AnchorButton` 的属性，

```ts
type ButtonProps = {
  color: string;
  children: React.ReactChildren;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type AnchorButtonProps = {
  color: string;
  disabled: boolean;
  children: React.ReactChildren;
} & React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;
```

不难看出两者是有共性的，即可抽取成如下的形式：

```ts
type ExtendHTMLAttributes<P, T, K> = P & React.DetailedHTMLProps<T, K>;
```

其中 `T` 呢又是 `T<K>` 形式，即 `T` 中包含或有使用了 K。因此对使用者来说，如果传递了 `T<K>` 形式，就没必要单独再传递一次 `K`，我们应该是能利用 `infer` 从 `T<K>` 解析出 `K` 的。

```ts
T extends React.HtmlHTMLAttributes<infer K> ? K : HTMLElement
```

所以抽取出来两种组件 Props 可公用的一个类型如下：

```ts
export type ExtendHTMLAttributes<
  /** 组件自定义属性 */
  P,
  /** 原生 HTML 标签自有属性 */
  T extends React.HtmlHTMLAttributes<HTMLElement>
> = P &
  React.DetailedHTMLProps<
    T,
    T extends React.HtmlHTMLAttributes<infer K> ? K : HTMLElement
  >;
```

利用抽取的 `ExtendHTMLAttributes`，两种按钮的 Props 可重新书写成如下形式：

```ts

type ButtonProps = ExtendHTMLAttributes<
  {
    color: string;
    children: React.ReactChildren;
  },
  React.ButtonHTMLAttributes<HTMLButtonElement>
>;

type AnchorButtonProps = ExtendHTMLAttributes<
  {
    color: string;
    disabled: boolean;
    children: React.ReactChildren;
  },
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>;
```

去掉了两者重叠的部分，看起来简洁了一些。关键后续编写其他组件时，如果想支持原生 HTML 属性，直接复用这里的 `ExtendHTMLAttributes` 类型即可。



## 相关资源

- [TypeScript 2.8 - Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html)
- [Unwrapping composite types in Typescript](https://lorefnon.tech/2018/07/18/unwrapping-composite-types-in-typescript/)
    