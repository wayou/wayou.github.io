---
layout: post
title: "TypeScript 中 Optional Chaining 和 Nullish Coalescing"
date: 2020-05-27 00:05:00 +0800
tags: 
---
    
# TypeScript 中 Optional Chaining 和 Nullish Coalescing

Optional Chaining 解决的问题是重复且无意义的判空，之所以说无意义，是对业务来说它不是必需的，但不判空，程序直接就挂了，比如：

```ts
let x = foo.bar.baz();
```

这里的访问链路上 `foo` `bar` `baz` 任何一个为 `undefined`，程序就停止工作。

使用 Optional Chaining 修改后：

```ts
let x = foo?.bar.baz();
```

这里 `?.` 的句法就是 **Optional Chaining**，在 TypeScript 3.7 中实现，目前 tc39 提案中处于 [Stage 4](https://github.com/tc39/proposal-optional-chaining) 阶段。

Optional Chaining 在这里表示，如果 `foo` 是 `null` 或 `undefined`，整个语句不继续往后执行，直接返回 `undefined`。

### 作用范围

需要注意的是，这里只对 `foo` 进行了保障，如果后续的 `bar`，`baz` 为空的话，代码仍然报错。`?.` 只作用于左边的对象。

所以可以这样来修正：

```ts
let x = foo?.bar?.baz();
```

这样可以保障 `foo` `bar` 为空的情况下不报错。这体现了 `optional property accesses` 的功能。

### Opptoinal call

对于方法也同样适用。

```ts
async function makeRequest(url: string, log?: (msg: string) => void) {
  log?.(`Request started at ${new Date().toISOString()}`);
  // roughly equivalent to
  //   if (log != null) {
  //       log(`Request started at ${new Date().toISOString()}`);
  //   }

  const result = (await fetch(url)).json();

  log?.(`Request finished at at ${new Date().toISOString()}`);

  return result;
}
```

### Optional element access

数组也是对象，只不是特殊的对象，通过数字索引作为属性来访问。所以 Optional Chaining 也可作用于数组元素的访问，此时就体现了 `optional element access` 的功能，请看来自官方文档中的示例：

```ts
/**
 * Get the first element of the array if we have an array.
 * Otherwise return undefined.
 */
function tryGetFirstElement<T>(arr?: T[]) {
  return arr?.[0];
  // equivalent to
  //   return (arr === null || arr === undefined) ?
  //       undefined :
  //       arr[0];
}
```

### 和 `&&` 的差别

虽说 Optional Chaining 取代了如下通过 `&&` 来实现的判空操作：

```ts
// Before
if (foo && foo.bar && foo.bar.baz) {
  // ...
}
```

但 Optional Chaining 和 `&&` 还是有区别，后者利用 JavaScript 中的短路机制，遇到**假值**时中断执行。而前者只会在被判定对象为 **`null` 或 `undefined`** 时才会中断执行。

请看如下示例：

```ts
const a: any = 0;
console.log(a?.blah);
console.log(a && a.blah);

const b: any = false;
console.log(b?.blah);
console.log(b && b.blah);

const c: any = "";
console.log(c?.blah);
console.log(c && c.blah);
```

输出：

```
undefined
0
undefined
false
undefined

```

可以看到，通过 Optional Chaining 控制的部分全部输出 `undefined`，因为这里被判定对象并不是 `null` 或 `undefined`，所以语句会往后执行，尝试访问 `blah`，拿到的值是 `undefined`，最后输出。

而通过 `&&` 进行判定的语句，因为被判定对象是假值，中断执行并返回当前对象。

## Nullish Coalescing

Nullish Coalescing 通过 `??` 操作符，为 `null` 或 `undefined` 的值提供默认值。

比如：

```ts
let x = foo ?? bar();
```

上面的表达式等价于如果 `foo` 是 `null` 或 `undefined`，则调用 `bar()`。

同样地，他取代了之前通过 `||` 操作符达到的默认值效果，但后者同样是通过判断布尔真值达到的，而 Nullish Coalescing 只判断 `null` 或 `undefined`。

比如：

```ts
function initializeAudio() {
  let volume = localStorage.volume || 0.5;

  // ...
}
```

这里如果 `localStorage.volume` 被设置成 0，则最后 `volume` 得到的是 0.5，也就是说设置在 `localStorage.volume` 永远也不会生效。而 Nullish Coalescing 就可以避免这种问题。

## 相关资源

- [Optional Chaining](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html)
- [Nullish Coalescing](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing)

    