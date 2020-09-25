---
layout: post
title: "TypeScript: type alias 与 interface"
date: 2019-03-28 23:03:00 +0800
tags: 
---
    
TypeScript:  type alias 与 interface
===

官方文档中有关于两者对比的信息，隐藏在 TypeScript Handbook 中，见 [`Interfaces vs. Type Aliases`](https://www.typescriptlang.org/docs/handbook/advanced-types.html) 部分。

但因为这一部分很久没更新了，所以其中描述的内容不一定全对。

比如，

### 区别点之一：type alias 不会创建新的类型，体现在错误信息上。

> One difference is, that interfaces create a new name that is used everywhere. Type aliases don’t create a new name — for instance, error messages won’t use the alias name.

不完全正确。直接通过 type 定义的初始类型，是会创建相应的类型名称的。

什么意思呢。就是说，不是使用 `&`, `|` 等操作符创建的 union type 及 intersection type。

```js
type Person = {
  name: string;
  age: number;
};

// [x] Property 'age' is missing in type '{ name: string; }' but required in type 'Person'.ts(2741)
const bob: Person = { 
  name: "bob"
};
```

注意这里错误信息使用的是类型 `Person` 而不是对应的 plain object 对象。


### 区别点之二：type alias 不能被 `extends` 和 `implements`。

实际上在扩展和实现上二者已经没有区别，甚至可以混用，比如让一个 class 同时实现 interface 和 type alias 定义的类型。

```js
type PointType = {
  x: number;
  y: number;
};

interface PointInterface {
  a: number;
  b: number;
}

class Shape implements PointType, PointInterface {
  constructor(public a = 1, public b = 2, public x = 3, public y = 4) {}
}
```

### 区别点之三：type alias 不能扩展和实现其他类型

不完全正确。因为通过正交操作符（intersection type） `&` 可以达到 `extends` 的目的。


```js
interface Person {
  name: string;
}

interface Job {
  title: string;
}

type EmployeeType = Person & Job;

class Employee implements EmployeeType {
  constructor(public name = "Nobody", public title = "Noone") {}
}
```

上面可以看到，两者大部分情况下不用过多区分。

在使用了 union type 的时候，一些区别才开始显现。其实也算不得区别，因为只有 type alias 可通过 union type 定义。

### 当 type 包含 union type 时，该类型是不能被实现和扩展的。

```js
interface Triangle {
  area: number;
}

interface Square {
  width: number;
  height: number;
}

type ShapeType = Triangle | Square;

// [x] An interface can only extend an object type or intersection of object types with statically known members.ts(2312)
interface MyShape extends ShapeType; 


class Shape implements ShapeType{
// [x] A class can only implement an object type or intersection of object types with statically known members.ts(2422)
}
```

因为 union type 描述的是一个**或者**的状态，一个类不可能即是此类型也是另外种类型。interface 也不可能继承一个类型还不确定的类型。


### 类型合并

最明显的一点区别，是在进行类型合并（[Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)）的时候，type alias 是不会被合并的，而同名的多个 interface 会合并成一个。

```js
interface Person {
  name: string;
}
interface Person {
  age: number;
}

const person: Person = {
  name: "Bob",
  age: 9
};
```

对于 type alias，存在同名时直接报错。

```js
type Person {  // [x] Duplicate identifier 'Person'.ts(2300)
  name: string;
}
type Person { // [x] Duplicate identifier 'Person'.ts(2300)
  age: number;
}
```

明白这点对于三方库的作者来说很重要。假如你写了个 npm 包，导出的是 type，则使用者无法通过简单定义同名类型来进行扩充。

所以，写库的时候，尽量使用 interface。


### 结论

官方推荐用 interface，其他无法满足需求的情况下用 type alias。

但其实，因为 union type 和 intersection type 是很常用的，所以避免不了大量使用 type alias 的场景，一些复杂类型也需要通过组装后形成 type alias 来使用。所以，如果想保持代码统一，可尽量选择使用 type alias。通过上面的对比，type alias 其实可函盖 interface 的大部分场景。

对于 React 组件中 props 及 state，使用 type alias，这样能够保证使用组件的地方不能随意在上面添加属性。如果有自定义需求，可通过 HOC （Higher-Order Components）二次封装。

编写三方库时使用 interface，其更加灵活自动的类型合并可应对未知的复杂使用场景。


### 相关资料

- [Interface vs Type alias in TypeScript 2.7](https://medium.com/@martin_hotell/interface-vs-type-alias-in-typescript-2-7-2a8f1777af4c)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/advanced-types.html)
- [TypeScript Constructor Assignment: public and private Keywords](https://kendaleiv.com/typescript-constructor-assignment-public-and-private-keywords/)

    