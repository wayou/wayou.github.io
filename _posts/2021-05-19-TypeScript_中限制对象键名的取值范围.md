---
layout: post
title: "TypeScript 中限制对象键名的取值范围"
date: 2021-05-19T12:27:22Z
---
# TypeScript 中限制对象键名的取值范围

当我们使用 TypeScript 时，我们想利用它提供的类型系统限制代码的方方面面，对象的键值，也不例外。

譬如我们有个对象存储每个年级的人名，类型大概长这样：

```ts
type Students = Record<string, string[]>;
```

理所当然地，数据就是长这样：

```ts
const students: Students = {
  Freshman: ["David", "John"],
  sophomore: [],
  Junior: ["Lily"],
  Senior: ["Tom"],
};
```

## 限制对象键名为枚举

上面数据类型的问题是，年级是有限的几种可值取，而该对象上可任意添加属性，这样显得数据不够纯粹。

所以我们新增枚举，列出可取的值：

```ts
export enum Grade {
  Freshman,
  sophomore,
  Junior,
  Senior,
}
```

现在，把对象的键名限制为上面枚举就行了。

```diff
- type Students = Record<string, string[]>;
+ type Students = Record<Grade, string[]>;
```

这样我们的数据可写成这样：

```ts
const students: Students = {
  [Grade.Freshman]: ["David", "John"],
  [Grade.sophomore]: [],
  [Grade.Junior]: ["Lily"],
  [Grade.Senior]: ["Tom"],
  // ❌ Object literal may only specify known properties, and 'blah' does not exist in type 'Students'.ts(2322)
  blah: ["some one"],
};
```

这样，限制住了对象身上键名的范围，可以看到如果添加一个枚举之外的键会报错。

## 更加语义化的枚举值

但上面的做法还是有不妥之处，因为枚举值默认是从 0 开始的数字，这样，作为键值就不够语义了，这点从访问对象的属性时体现了出来：

<img width="899" alt="1" src="https://user-images.githubusercontent.com/3783096/118772844-c85c8f80-b8b6-11eb-87b3-0a77485c95f4.png">

修正我们的枚举，用更加语义的文本作为其值：

```ts
export enum Grade {
  Freshman = "Freshman",
  sophomore = "sophomore",
  Junior = "Junior",
  Senior = "Senior",
}
```

此时再使用该枚举时，得到的就不是无意义的数字了。

<img width="899" alt="2" src="https://user-images.githubusercontent.com/3783096/118772877-d1e5f780-b8b6-11eb-9745-b6a46cffed72.png">

如果你愿意，枚举值也可以是中文，

```ts
export enum Grade {
  Freshman = "大一萌新",
  sophomore = "大二学弟",
  Junior = "大三学妹",
  Senior = "大四老司机",
}
```

使用时也是没任何问题的：

<img width="899" alt="3" src="https://user-images.githubusercontent.com/3783096/118772905-d90d0580-b8b6-11eb-9dac-a1eb0db7e24a.png">


## 键值可选

上面的类型定义还有个问题，即，它要求使用时对象包含枚举中所有值，比如 `sophomore` 这个年级中并没有人，可以不写，但会报错。

```ts
// ❌ Property 'sophomore' is missing in type '{ Freshman: string[]; Junior: string[]; Senior: string[]; }' but required in type 'Students'.ts(2741)
const students: Students = {
  [Grade.Freshman]: ["David", "John"],
  // [Grade.sophomore]: [],
  [Grade.Junior]: ["Lily"],
  [Grade.Senior]: ["Tom"],
};
```

所以，优化类型为可选：

```ts
type Students = Partial<Record<Grade, string[]>>;
```

## 限制对象的键名为数组中的值

假若可选的值不是通过枚举定义，而是来自一个数组，

```ts
const grades = ["Freshman", "sophomore", "Junior", "Senior"];
```

这意味着我们需要提取数组中的值形成一个联合类型。

首先利用[const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) 把数组转元组（Tuple）类型，

```ts
const grades = <const>["Freshman", "sophomore", "Junior", "Senior"];
```

再利用 `typeof` 和 [Lookup Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#keyof-and-lookup-types) 得到最终的联合类型：

```ts
// 实际为 type Keys = "Freshman" | "sophomore" | "Junior" | "Senior"
type Keys = typeof grades[number];
```

最后数据类型和数据可写成：

```ts
type Students = Partial<Record<Keys, string[]>>;

const students: Students = {
  Freshman: ["David", "John"],
  Junior: ["Lily"],
  Senior: ["Tom"],
};
```

须知这种形式下，对象的 key 与原数组中元素其实没有语法层面的关联，即，编辑器的「跳转定义」是不可用的。

<img width="899" alt="Screen Shot 2021-05-19 at 3 29 27 PM" src="https://user-images.githubusercontent.com/3783096/118773106-0f4a8500-b8b7-11eb-859d-e9e6a357deb8.png">

尽量还是保持代码之间的关联才能体现出 TypeScript 的作用，所以像这种只有类型约束而无法建立关联的操作是不建议的。

# 相关资源

- [const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)
- [`keyof` and Lookup Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#keyof-and-lookup-types)

