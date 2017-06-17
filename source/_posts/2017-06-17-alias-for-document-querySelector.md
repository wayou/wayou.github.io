title: 正确地缩写 document.querySelector
toc: false
date: 2017-06-17 17:04:39
categories: JavaScript
tags:
- javascript
- jquery
- document
- querySelector
---

北京的夕阳，伴随淡淡的霾殇。从写字楼望去，光线是那么昏黄。没有孤雁，也没有霞光，遥想当年，还是 jQuery 独霸一方。那时的我们，写程序都习惯了使用 `$`，至少在对美元符号的喜爱上，与 PHP 达成了一致。

<!-- more -->

当然，我并不讨论语言，我只说前端。

在 React 大行其道的如今，很少再看到 jQuery 的身影，是它离开了我们吗，还是我们选择了不挽留。总之，我们返璞归真，重新写起了原生的 JavaScript，这无疑是原教主义者们的胜利并且值得庆祝的时代。

使用 jQuery，对于 DOM 操作毫不费力。没了 jQuery，好多小伙伴像断臂杨过，生活只能靠姑姑处理。倒不是说原生不能处理，只是方法很繁琐：

- `document.getElementById`
- `document.getElementsByClass`
- `document.getElementsByName`
- `document.getElementsByTagName`

方法都很全，像牙科医生的工具包。
好在后来又加上了类 jQuery 的选择方式，

- `document.querySelector`
- `document.querySelectorAll`

那这样呢我们又能愉快地使用单一的方法进行多种类型的 DOM 选择了。

即使这样，还是给我们留下了一些不爽，那就是名字太长。大家应该都知道电影里反派的统一死法吧————死于话多。所以本着能省则省，能少敲几个字母就绝不多敲的原则，我们很是需要对这些方法进行一次包装，或者说取个别名。对，最好就用熟悉的 `$` 。

于是我们说干就干，在不到四分之一柱香的时间，我们撸出了如下代码：

```js
var $ = document.querySelectorAll;
```

以及测试代码：

```js
console.debug($('body'));
```

通过只有少数人才知道的快捷键组合 <kbd>⌘</kbd>+<kbd>⌥</kbd>+<kbd>j</kbd>，我们娴熟地唤出了浏览器控制台进行测试。

![没有按照程序员设想方式执行的代码](1.png)

但是测试之后，我们开始怀疑人生。这便是本文存在的意义。它帮妳拨开云雾见日升，拥有不再怀疑的人生。

这里报错的原因是 `querySelectorAll` 所需的执行上下文必需是 `document`，而我们赋值到 `$` 调用后上下文变成了全局 `window`。

明白了这个道理后，我们再花不到四分之一柱香的时间，就改写了之前的版本，释出了正确的版本，这个版本里面，我们用正确的姿势去 alias。

```js
var $ = document.querySelectorAll.bind(document);
```
然后我们再测试，本来这次测试是没有必要的，至少应该像一个信心满满的程序员那样去喝杯咖啡了。

![不出意外的正常执行](2.png)

对于 `querSelector` 同理，它的上下文也是 `document`。

为了使用方便，我们可以将其他一系列的 DOM 选择方法都给上简写。

```js
var query = document.querySelector.bind(document);
var queryAll = document.querySelectorAll.bind(document);
var fromId = document.getElementById.bind(document);
var fromClass = document.getElementsByClassName.bind(document);
var fromTag = document.getElementsByTagName.bind(document);
```

需要注意的地方是，这些方法返回的要么是单个 [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) 节点，要么是 [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList) 而 NodeLis 是类数组的对象，但并不是真正的数组，所以拿到之后不能直接使用 `map`,`forEach` 等方法。

正确的操作姿势应该是：

```js
Array.prototype.map.call(document.querySelectorAll('button'),function(element,index){
    element.onclick = function(){
    }
})
```
## 相关链接

- https://stackoverflow.com/questions/13383886/making-a-short-alias-for-document-queryselectorall
