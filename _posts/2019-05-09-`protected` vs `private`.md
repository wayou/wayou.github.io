---
layout: post
title: "`protected` vs `private`"
date: 2019-05-09 23:05:00 +0800
tags: 
---
    
`protected` vs `private`
===

## `private`

标识为 `private` 的属性为私有属性，不能在除自己外的地方进行访问。

## `protected`

标识为 `protected` 的属性为受保护的属性，与私有属性类似，但还可以在继承类中进行访问。

## 示例

以 TypeScript 为例，比如一个 `Base` 类，其中包含一个受保护的年龄属性 `age`，以及一个私有的工资 `_salary` 属性。

```ts
class Base {
  constructor(protected age: number, private _salary: number) {}
}
```

同时定义一个 `Derived` 类继承自 `Base` 类：

```ts
class Derived extends Base {
  constructor(public name: string, age, salary) {
    super(age, salary);
  }
  get Age() {
    // ✅ 保护的属性可以从继承类中获取到
    return this.age;
  }

  get Salary() {
      // 🚨 Property '_salary' is private and only accessible within class 'Base'.ts(2341)
    return this._salary;
  }
}
```

然后分别实例化这两个类：

```ts
const base = new Base(18, 999);
const derived = new Derived("derived", 20, 1000);
```

然后通过他们的实例尝试访问这些属性。

```ts
// 🚨Property '_salary' is private and only accessible within class 'Base'.ts(2341)
console.log(base._salary);

// 🚨Property 'age' is protected and only accessible within class 'Base' and its subclasses.ts(2445)
console.log(base.age);
```

对于 `base`，其两个属性都无法通过实例进行访问。

```ts
// ✅
console.log(derived.name);

// 🚨 虽然继承类中可以获取到父类的保护属性，但不能通过实例直接进行访问
console.log(derived.age);
// ✅ 只能在继承类的实例方法中访问，这里 `Age` 是继承类提供的获取器，该方法里访问并返回了父类的保护属性 `age`
console.log(derived.Age);
```

对于 `derived`，其中 `name` 因为是 `public` 公有的，所以可通过实例直接访问。

`age` 继承自父类 `Base`，只能在 `Derived` 类中的实例方法，比如这里定义的 `get Age` 获取器中进行访问。但无法通过 `Derived` 的实例直接访问。

`Age` 在这里为 `Derived` 类上面的一个获取器，其默认有 `public` 属性，通过访问它我们间接在类外面访问到了这个在父类中标识为受保护的属性 `age`。 


## 相关资源

- [Classes - Public, private, and protected modifiers](https://www.typescriptlang.org/docs/handbook/classes.html)
- [TypeScript - Difference between Private and Protected Variables](https://stackoverflow.com/questions/36843357/typescript-difference-between-private-and-protected-variables)
    