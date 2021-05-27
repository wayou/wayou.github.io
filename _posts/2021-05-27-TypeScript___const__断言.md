---
layout: post
title: "TypeScript  `const` 断言"
date: 2021-05-27T09:29:32Z
---
# TypeScript  `const` 断言

当对字面量使用 [`const` 断言/`const` assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) 时，

- 字面量中类型不会再宽泛，比如 `hello` 不再会认为是 `string` 类型，就是 `hello` 类型
- 对象属性变成 `readonly`
- 数组变成 `readonly` 的元组（tuple） 类型

示例：

```ts
// Type '"hello"'
let x = "hello" as const;

// Type 'readonly [10, 20]'
let y = [10, 20] as const;

// Type '{ readonly text: "hello" }'
let z = { text: "hello" } as const;
```

相对 `const` 声明的字面量具体有什么区别，考察如下代码：

```ts
function getShapes() {
  const result = [
    { kind: "circle", radius: 100 },
    { kind: "square", sideLength: 50 },
  ];
  return result;
}
```

此时如果我们观察上述函数的返回类型可得到：

```ts
({
  kind: string;
  radius: number;
  sideLength?: undefined;
} | {
  kind: string;
  sideLength: number;
  radius?: undefined;
})[]
```

即，函数返回的为一个 union 类型的数组，元素中都出现的 `kind` 字段没影响，而另外两个字段因为只分别在一个对象中出现过，所以会形成一个 `undefined` 类型。

这样严格模式 `strict:true` 下使用的时候就会报错：

```ts
let num=0;

for (const shape of getShapes()) {
  if (shape.kind === "circle") {
// ❌Type 'number | undefined' is not assignable to type 'number'.
    num = shape.radius
  } else {
// ❌Type 'number | undefined' is not assignable to type 'number'.
    num = shape.sideLength
  }
}
```

![image](https://user-images.githubusercontent.com/3783096/119802532-32a5ad80-bf11-11eb-91b4-ea1f46b42223.png)



如果改成 `const` 断言，返回的则是字面量原有未经过转换过的类型：

```diff
function getShapes() {
  const result = [
    { kind: "circle", radius: 100 },
    { kind: "square", sideLength: 50 },
- ];
+ ] as const;
  return result;
}
```

观察此时返回的类型为：

```ts
 readonly [{
    readonly kind: "circle";
    readonly radius: 100;
}, {
    readonly kind: "square";
    readonly sideLength: 50;
}]
```

此时通过 `shape.kind` 进行类型区分后，原先两个对象就被成功分离开了，使用时自动提示也只会提供对应对象上有的字段：

```ts
for (const shape of getShapes()) {
  if (shape.kind === "circle") {
// ✅
    num = shape.radius
  } else {
// ✅
    num = shape.sideLength
  }
}
```

<img width="588" alt="for const" src="https://user-images.githubusercontent.com/3783096/119802309-068a2c80-bf11-11eb-95ff-332228ac1abb.png">


## 相关资源

- [const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)
- [What's the difference between TypeScript const assertions and declarations?](https://stackoverflow.com/a/55230945/1553656)

