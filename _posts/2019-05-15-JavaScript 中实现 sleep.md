---
layout: post
title: "JavaScript 中实现 sleep"
date: 2019-05-16 00:05:00 +0800
tags: 
---
    
# JavaScript 中实现 sleep

<p align="center"><img alt="来自推特上 Windows 故障分析的笑话" src="https://user-images.githubusercontent.com/3783096/57644343-807f3f80-75ee-11e9-98a4-23123a250d9d.png" /></p>
<p align="center">来自推特上 Windows 故障分析的笑话 <small>图片来源：<a href="https://me.me/i/the-source-code-of-windows-troubleshooting-program-has-leaked-1-010536dbd83247a4894a495e4bc33656">me.me</a></small></p>


推上看到的笑话，Windows 故障分析的实现。

然后想起来 JavaScript 中如何实现这个 `sleep()` 函数让代码暂停指定时间。

## 异步版本

借助 [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) 这事很好实现。

```js
function sleep(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
```

创建一个 `Promise`，等待指定时间后 resolve 掉即可。

但，`Promise` 是异步的，它要求后续代码要么包含在 `then` 里面，要么通过 `async/await` 来调用。

所以使用起来应该像这样子，

```js
function testSleep() {
  console.log("will sleep for 1s");
  sleep(1000).then(() => {
    console.log("will sleep for another 5s");
    sleep(5000).then(() => {
      console.log("waked up");
    });
  });
}
testSleep();
```

或者这样子：

```js
async function testSleep() {
  console.log("will sleep for 1s");
  await sleep(1000);
  console.log("will sleep for another 5s");
  await sleep(5000);
  console.log("waked up");
}
testSleep();
```

![测试 sleep](https://user-images.githubusercontent.com/3783096/57644026-c7b90080-75ed-11e9-86f9-08972d5ef3cb.gif)
<p align="center">测试 sleep</p>

当然后者会更加优雅些，但本质上都是需要保证后续代码在 Promise 回调中执行。如何有回调之外的代码，则不会被阻断，这便是其缺点。

```js
async function testSleep() {
  console.log("will sleep for 1s");
  await sleep(1000);
  console.log("will sleep for another 5s");
  await sleep(5000);
  console.log("waked up");
}
testSleep();

// 🚨不会按预期那样最后执行，而是立即被执行
console.log("我在等上面的代码执行完...");
```

![代码未阻断的情况](https://user-images.githubusercontent.com/3783096/57644059-e0c1b180-75ed-11e9-8b1a-f511319f2d7c.gif)
<p align="center">代码未阻断的情况</p>

## 同步版本

不借助异步异步代码想阻断代码执行，那其实可以让代码原地跑，通过 `while`。

```js
function syncSleep(time) {
  const start = new Date().getTime();
  while (new Date().getTime() - start < time) {}
}
```

使用起来就和正常函数没区别了，对周围代码也没有要求必需得在回调什么的：

```js
console.log("start test sync sleep...");
syncSleep(3000);
console.log("sync sleep after 3s");
```

![测试同步版本的 sleep](https://user-images.githubusercontent.com/3783096/57644100-f9ca6280-75ed-11e9-9291-4ddd0181932a.gif)
<p align="center">测试同步版本的 sleep</p>

方便是方便，但不建议使用这种方式，毕竟代码在空跑。如果需要这样的场景，你需要考虑是否可以修改下代码或换个设计，异步能满足大部分需求。


## 相关资源

- [MDN - Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Synchronous and asynchronous requests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests)
- [What is the JavaScript version of sleep()?](https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep)
    