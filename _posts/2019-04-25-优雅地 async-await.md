---
layout: post
title: "优雅地 async/await"
date: 2019-04-25 23:04:00 +0800
tags: 
---
    
优雅地 `async/await`
===

`async/await` 虽然取代了回调，使用类似同步的代码组织方式让代码更加简洁美观，但错误处理时需要加 `try/catch`。


比如下面这样，一个简单的 Node.js 中使用 `async/await` 的场景：

```js
const fetch = require("node-fetch");

async function getData() {
  const url = "https://api.github.com/users/wayou";
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    throw error;
  }
}

getData();
```

像这样的异步场景，Node.js 中会有很多。如果都通过 `try/catch` 来错误处理，数量多了之后也是不太美观的。

## 将异步进行一层封装

因为本质上 `async/await` 是 [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)，我们可以封装一个简单的方法，将错误处理变得更优雅。

比如下面这样：

```js
function await2js(promise) {
  return promise.then(result => [undefined, result]).catch(error => [error, undefined]);
}
```

该方法始终返回两个结果，第一个是错误，第二个是数据，这和 Node.js 中回调的入参 `(err,data)=>void` 是一致的，使得这层包装很 Node.js，一点也不会感到奇怪。

所以改造后的使用示例：

```js

async function getData() {
  const url = "https://api.github.com/users/wayou";
  const [error, response] = await await2js(fetch(url));
  if (error) {
    throw error;
  }

  const [error2, data] = await await2js(response.json());
  if (error2) {
    throw error2;
  }

  console.log(data);
}
```

这层封装针对单个 `await`，不像 `try/catch` 那么粗犷一下子包含再次 `await`。也不是说 `try/catch` 不能精细地处理错误，但脑补一下把上面两次 `await` 都用 `try/catch` 的模样。 

当然，如果嫌麻烦，也可通过 `Promise.all()` 或 Promise 的链式调用将多次 `await` 操作合并，只处理一次错误。

### TypeScript 版本


```ts
function await2js<T, K = Error>(promise: Promise<T>) {
  return promise
    .then<[undefined, T]>((response: T) => [undefined, response])
    .catch<[K, undefined]>((error: K) => [error, undefined]);
}
```

这里有个相应的 npm 包便是做这事情的 [await-to-js](https://github.com/scopsy/await-to-js)。


## 相关资源

- [来自 @markdalgleish 关于本主题的推文](https://twitter.com/markdalgleish/status/1120224474291294208)
- [npm - await-to-js](https://www.npmjs.com/package/await-to-js)


    