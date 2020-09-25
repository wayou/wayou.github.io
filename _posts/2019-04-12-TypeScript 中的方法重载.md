---
layout: post
title: "TypeScript 中的方法重载"
date: 2019-04-12 23:04:00 +0800
tags: 
---
    
TypeScript 中的方法重载
===

方法重载（overload）在传统的静态类型语言中是很常见的。JavaScript 作为动态语言， 是没有重载这一说的。一是它的参数没有类型的区分，二是对参数个数也没有检查。虽然语言层面无法自动进行重载，但借助其动态的特性，我们可以在代码中手动检查入参的类型，或者通过 `arguments` 获取到参数个数，从而实现根据不同的入参做不同的操作。

比如有一个获取聊天消息的方法，根据传入的参数从数组中查找数据。如果入参为数字，则认为是 id，然后从数据源中找对应 id 的数据并返回，否则当成类型，返回这一类型的消息。

```js
function getMessage(query) {
  if (typeof query === "nunber") {
    return data.find(message => message.id === query);
  } else {
    return data.filter(message => message.type === query);
  }
}
```

TypeScript 中，假如我们的消息数据为如下结构：

```ts
type MessageType = "string" | "image" | "audio";

type Message = {
  id: number;
  type: MessageType;
  content: string;
};
```

上面获取数据的方法等价于：

```ts
function getMessage(
  query: number | MessageType
): Message[] | Message | undefined {
  if (typeof query === "number") {
    return data.find(message => message.id === query);
  } else {
    return data.filter(message => message.type === query);
  }
}
```

这样做一是类型书写上比较丑陋，二是没有发挥出 TypeScript 类型检查的优势，这里我们是可以根据入参的类型明确知道返回的类型的，即如果传入的是 id，返回的是单个数据或`undefined`，如果是根据类型查找，返回的是数组。而现在调用方法后，得到的类型太过宽泛，这和使用 `any` 做为返回没多大差别。

![函数返回类型不够紧凑](https://user-images.githubusercontent.com/3783096/55962274-231c6980-5ca3-11e9-8381-33a767a0517b.png)
<p align="center">函数返回类型不够紧凑</p>

因为类型的不明朗，返回的结果都不能直接操作，需要进行类型转换后才能继续。

```ts
const result1 = getMessage("audio");
/** 不能直接对 result1 调用数组方法 */
console.log((result1 as Message[]).length);

const result2 = getMessage(1);
if (result2) {
  /** 不能对 result2 直接访问消息对象中的属性 */
  console.log((result2 as Message).content);
}
```

### 重载的实现

这时候可通过提供多个函数类型的声明来解决上面的问题，最后得到的结果就是间接实现了函数的重载。当然这个重载只是 TypeScript 编译时的。

```ts
function getMessage(id: number): Message | undefined;
function getMessage(type: MessageType): Message[];
function getMessage(query: any): any {
  if (typeof query === "number") {
    return data.find(message => message.id === query);
  } else {
    return data.filter(message => message.type === query);
  }
}
```

这样改造后，我们在调用的时候直接就会有重载的提示。

![实现 TypeScript 的重载后调用时的自动提示](https://user-images.githubusercontent.com/3783096/55962191-ff592380-5ca2-11e9-8df2-cfd7356c4dda.png)
<p align="center">实现 TypeScript 的重载后调用时的自动提示</p>



并且得到的结果类型是重载方法中指定的入参与返回的组合，在对结果进行使用时，无须再进行类型转换。

```ts
const result1 = getMessage("audio");
/** ✅ 无须类型转换 */
console.log(result1.length);

const result2 = getMessage(1);
if (result2) {
  /** ✅ 无须类型转换 */
  console.log(result2.content);
}
```

这里需要理解的是，上面添加的函数类型仅作为 TypeScript 在编译时使用的，它不是真的实现像传统静态类型语言那样的重载，也不会改变编译后代码的输出。实际运行时仍然是不带重载的 JavaScript 版本。

<details>
<summary>编译后的代码</summary>

```js
"use strict";
var data = [
    {
        id: 0,
        type: "string",
        content: "hello"
    },
    {
        id: 1,
        type: "image",
        content: "url_for_iamge"
    },
    {
        id: 2,
        type: "string",
        content: "world"
    }
];
function getMessage(query) {
    if (typeof query === "number") {
        return data.find(function (message) { return message.id === query; });
    }
    else {
        return data.filter(function (message) { return message.type === query; });
    }
}
var result1 = getMessage("audio");
/** ✅ 无须类型转换 */
console.log(result1.length);
var result2 = getMessage(1);
if (result2) {
    /** ✅ 无须类型转换 */
    console.log(result2.content);
}
```
</details>

但这一点也不影响我们在 TypeScript 中使用这种假的重载。


### 可选参数

另一个 TypeScript 重载的场景。还是上面获取消息数据的方法，因为根据类型查找消息时，会返回同类型消息的一个数组。此时我们想加一个参数实现只返回结果中前几个数据，那么可以很方便地进行如下的改造：

```diff
function getMessage(id: number): Message | undefined;
+function getMessage(type: MessageType, count?: number): Message[];
+function getMessage(query: any, count = 10): any {
  if (typeof query === "number") {
    return data.find(message => message.id === query);
  } else {
+    return data.filter(message => message.type === query).splice(0, count);
  }
}
```

通过重载，这个新增的参数很容易实现只针对入参 `MessageType` 时，这样如果我们有如下的调用，会得到编译时的报错：

```ts
/** 🚨 Argument of type '1' is not assignable to parameter of type 'MessageType' */
getMessage(1,10);
```

而非重载的版本是享受不到上面提到的类型优势的。

```ts
function getMessage(
  query: number | MessageType,
  count = 10
): Message[] | Message | undefined {
  if (typeof query === "number") {
    return data.find(message => message.id === query);
  } else {
    return data.filter(message => message.type === query).splice(0, count);
  }
}

/** ✅ ojbk, 不错报 */
getMessage(1, 10);
```

### 重载过程

TypeScript 重载的过程是，拿传入的参数和重载的方法签名列表中由上往下逐个匹配，直到找到一个完全匹配的函数签名，否则报错。所以推荐的做法是将签名更加具体的重载放上面，不那么具体的放后面。

```ts
/** ✅*/
function getMessage(type: MessageType, count?: number): Message[];
function getMessage(id: number): Message | undefined;

/** 🚨*/
function getMessage(id: number): Message | undefined;
function getMessage(type: MessageType, count?: number): Message[];
```

像上面示例中正确做法这样，如果说入参个数只有一个，那可以直接跳过第一个函数签名，无须做入参类型的判断。


### 相关资源

- [TypeScript Handbook - Functions - Overloads](https://www.typescriptlang.org/docs/handbook/functions.html)
- [Typescript method overloading](https://medium.com/@kevinkreuzer/typescript-method-overloading-c256dd63245a)

    