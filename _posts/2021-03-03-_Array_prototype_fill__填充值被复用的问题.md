---
layout: post
title: "`Array.prototype.fill` 填充值被复用的问题"
date: 2021-03-03T15:11:47Z
---
# `Array.prototype.fill` 填充值被复用的问题

考察如下示例代码：

```js
// 创建二维数组
const arr = Array(2).fill([]);

// 操作第一个元素
arr[0].push(1);

// 结果是操作了所有数组
console.log(arr); // [ [ 1 ], [ 1 ] ]
```

和 new 不 new 关系，以下代码问题同样存在

```diff
- const arr= Array(12).fill([])
+ const arr= new Array(12).fill([])

arr[0].push(1)

console.log(arr); // [ [ 1 ], [ 1 ] ]
```

问题出在这个 `fill`，根据 MDN 的描述

> The fill() method changes all elements in an array to a static value
>  — [MDN Array.prototype.fill()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)

`arr.fill(value[, start[, end]])` 这里使用 `value` 替换数组中的元数，当 `value` 为对象字面量时，这个对象是被共用的，并没有为每个元素重新创建副本。所以当操作其中一个元素时，所有元素都被影响了。本例中，使用 `[]` 这个数组字面量填充数组，操作其中任意元数导致所有元素变更。

修正方式则是通过 `Array.prototype.map` 将每个元素重新赋值，解除这里的复用。

```js
const arr = Array(2)
  .fill(1)
  .map((item) => []);

arr[0].push(1);

// 结果是操作了所有数组
console.log(arr); // [ [ 1 ], [] ]
```

之所以在 `Array(number)` 创建好指定长度的空数组后还需要 `fill` 填充一下，是因为不填充的话，空数组不能被实际操作，即不能 `push` 或 `map` 等，打印出来如下：

```
[ <2 empty items> ]
```

## 相关资源

- [Array.prototype.fill()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)

