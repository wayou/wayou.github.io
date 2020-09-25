---
layout: post
title: "JavaScript Map 和 Set"
date: 2019-09-26 23:09:00 +0800
tags: 
---
    
# JavaScript Map 和 Set

## 结论

- `Map`：存放键值对，区别于 `Object`，键可以是任何值。
- `Set`：存放不重复的值

## Map

存储键值对，读取时与插入顺序一致。

```js

var map = new Map([[1, "1"], [3, "3"], [2, "2"]]);
map.set("foo", "bar");

for (const [key, val] of map) {
  console.log(key, val);
}
```

输出：

```
1 '1'
3 '3'
2 '2'
foo bar
```

任何值，对象或原始值，都可作为 `Map` 的键。

```js
var myMap = new Map();

var keyString = 'a string',
    keyObj = {},
    keyFunc = function() {};

// setting the values
myMap.set(keyString, "value associated with 'a string'");
myMap.set(keyObj, 'value associated with keyObj');
myMap.set(keyFunc, 'value associated with keyFunc');

myMap.size; // 3

// getting the values
myMap.get(keyString);    // "value associated with 'a string'"
myMap.get(keyObj);       // "value associated with keyObj"
myMap.get(keyFunc);      // "value associated with keyFunc"

myMap.get('a string');   // "value associated with 'a string'"
                         // because keyString === 'a string'
myMap.get({});           // undefined, because keyObj !== {}
myMap.get(function() {}); // undefined, because keyFunc !== function () {}
```

相比 `Object`，除了对可作为键的值没要求外，`Map` 自带遍历器（iterator），可对其使用 `for of` 语句。

同时还自带一些便捷的属性和方法，比如 `size`，`clear()`。

## Set

存储唯一的值，对于重复的值会被忽略。

示例：

```js
var obj = { a: 1, b: 2 };
var set = new Set([1, 2, 2, "foo"]);
set.add(obj);
set.add(obj);

console.log("size:", set.size);
console.log(set.has(2));
console.log(set.has(obj));

for (const val of set) {
  console.log(val);
}
```

输出：

```
4
true
true
1
2
foo
{ a: 1, b: 2 }
```


## 相关资源

- [MDN - Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN - Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [javascript Map object vs Set object](https://stackoverflow.com/questions/24085708/javascript-map-object-vs-set-object)




    