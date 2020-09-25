---
layout: post
title: "关于 JavaScript 中的继承"
date: 2019-04-22 23:04:00 +0800
tags: 
---
    
关于 JavaScript 中的继承
===

ES5 之前，继承是这样实现的

```js
function Parent() {
  this.foo = function() {
    console.log('foo');
  };
}
Parent.prototype.bar = function() {
  console.log('bar');
}
function Child() {
}
Child.prototype = p = new Parent();
Child.prototype.constructor = Child;
var c = new Child();
c instanceof Parent; // true
c instanceof Child; // true
c.__proto__ === p;  // true
c.__proto__.__proto__ === Parent.prototype;  // true
c.__proto__.__proto__.__proto__ === Object.prototype;  // true
c.__proto__.__proto__.__proto__.__proto__ === null;  // true
c.foo(); // foo
c.bar(); // bar
```

这种方式有个缺点，需要首先实例化父类。这表示，子类需要知道父类该如何初始化。

理想情况下，子类不关心父类的初始化细节，它只需要一个带有父类原型的对象用来继承即可。

```js
Child.prototype = anObjectWithParentPrototypeOnThePrototypeChain;
```

但是 js 中没有提供直接获取对象原型的能力，决定了我们不能像下面这样操作：

```js
Child.prototype = (function () { 
  var o = {}; 
  o.__proto__ = Parent.prototype; 
  return o; 
}());
```

注意：`__prototype__` 不等于 `prototype`，前者是通过 `new` 后者创建的，所以后者是存在于构造器上的，前者属性实例上的属性。方法及属性在原型链上进行查找时使用的便是 `__prototype__`，因为实例才有 `__prototype`。

```js
instance.__proto__ === constructor.prototype // true
```

所以，改进的方式是使用一个中间对象。


```js
// Parent defined as before.
function Child() {
  Parent.call(this); // Not always required.
}
var TempCtor, tempO;
TempCtor = function() {};
TempCtor.prototype = Parent.prototype;
Child.prototype = tempO = new TempCtor();
Child.prototype.constructor = Child;
var c = new Child();
c instanceof Parent; // true - Parent.prototype is on the p.-chain
c instanceof Child; // true
c.__proto__ === tempO;  // true
// ...and so on, as before
```

借助这个中间对象绕开了对父类的依赖。为了减少如上的重复轮子，ES5 中加入 `Object.create` 方法，作用与上面等效。

```js
// Parent defined as before.
function Child() {
  Parent.call(this); // Not always required.
}
Child.prototype = o = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
var c = new Child();
c instanceof Parent; // true - Parent.prototype is on the p.-chain
c instanceof Child; // true
c.__proto__ === o;  // true
// ...and so on, as before
```

### 参考 

- [Implementing Inheritance in JavaScript](https://medium.com/@benastontweet/implementing-inheritance-in-javascript-2c933d6a70e7)
- [__proto__ VS. prototype in JavaScript](https://stackoverflow.com/questions/9959727/proto-vs-prototype-in-javascript)

    