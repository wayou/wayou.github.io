---
layout: post
title: "TypeScript 装饰器的执行原理"
date: 2019-06-13 23:06:00 +0800
tags: 
---
    
# TypeScript 装饰器的执行原理

装饰器本质上提供了对被装饰对象 [Property​ Descriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) 的操作，在运行时被调用。

因为对于同一对象来说，可同时运用多个装饰器，然后装饰器中又可对被装饰对象进行任意的修改甚至是替换掉实现，直观感觉会有一些主观认知上的错觉，需要通过代码来验证一下。

比如，假若每个装饰器都对被装饰对象的有替换，其结果会怎样？

## 多个装饰器的应用

通过编译运行以下示例代码并查看其结果可以得到一些直观感受：

```ts
function f() {
  console.log("f(): evaluated");
  return function(_target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function(...args: any[]) {
      console.log(`[f]before ${key} called`, args);
      const result = original.apply(this, args);
      console.log(`[f]after ${key} called`);
      return result;
    };
    console.log("f(): called");
    return descriptor;
  };
}

function g() {
  console.log("g(): evaluated");
  return function(_target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function(...args: any[]) {
      console.log(`[g]before ${key} called`, args);
      const result = original.apply(this, args);
      console.log(`[g]after ${key} called`);
      return result;
    };
    console.log("g(): called");
    return descriptor;
  };
}

class C {
  @f()
  @g()
  foo(count: number) {
    console.log(`foo called ${count}`);
  }
}

const c = new C();
c.foo(0);
c.foo(1);
``` 


先放出执行结果：

```sh
f(): evaluated
g(): evaluated
g(): called
f(): called
[f]before foo called [ 0 ]
[g]before foo called [ 0 ]
foo called 0
[g]after foo called [ 0 ]
[f]after foo called [ 0 ]
[f]before foo called [ 1 ]
[g]before foo called [ 1 ]
foo called 1
[g]after foo called [ 1 ]
[f]after foo called [ 1 ]
```

下面来详细分析。

## 编译后的装饰器代码

首页看看编译后变成 JavaScript 的代码，毕竟这是实际运行的代码：

<details>
<summary>
编译后的代码
</summary>

```js
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function f() {
    console.log("f(): evaluated");
    return function (_target, key, descriptor) {
        var original = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log("[f]before " + key + " called", args);
            var result = original.apply(this, args);
            console.log("[f]after " + key + " called", args);
            return result;
        };
        console.log("f(): called");
        return descriptor;
    };
}
function g() {
    console.log("g(): evaluated");
    return function (_target, key, descriptor) {
        var original = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log("[g]before " + key + " called", args);
            var result = original.apply(this, args);
            console.log("[g]after " + key + " called", args);
            return result;
        };
        console.log("g(): called");
        return descriptor;
    };
}
var C = /** @class */ (function () {
    function C() {
    }
    C.prototype.foo = function (count) {
        console.log("foo called " + count);
    };
    __decorate([
        f(),
        g(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", void 0)
    ], C.prototype, "foo", null);
    return C;
}());
var c = new C();
c.foo(0);
c.foo(1);
```

</details>


先看经过 TypeScript 编译后的代码，重点看这一部分：

```js
var C = /** @class */ (function () {
    function C() {
    }
    C.prototype.foo = function (count) {
        console.log("foo called " + count);
    };
    __decorate([
        f(),
        g(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", void 0)
    ], C.prototype, "foo", null);
    return C;
}());
```

## tslib 中装饰器的实现

其中 `__decorate` 为 TypeScript 经 [tslib](https://github.com/microsoft/tslib) 提供的 Decorator 实现，其源码为：

[tslib/tslib.js(经过格式化)](https://github.com/microsoft/tslib/blob/e1aae12c74c57200f72a7f9cfb53321e0c43b616/tslib.js#L90)
```js
var __decorate =
  (this && this.__decorate) ||
  function(decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
```

## 装饰器的执行顺序

配合编译后代码和这里装饰器的实现来看，进一步[之前了解到的](https://github.com/wayou/wayou.github.io/issues/103)关于装饰器被求值和执行的顺序，

源码中应用装饰器的地方：

```ts
  @f()
  @g()
  foo(count: number) {
    console.log(`foo called ${count}`);
  }
```

然后这里的 `@f() @g()` 按照该顺序传递给了 `__decorate` 函数，

```diff
  __decorate(
    [
+      f(),
+      g(),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Number]),
      __metadata("design:returntype", void 0)
    ],
    C.prototype,
    "foo",
    null
  );
```

然后在 `__decorate` 函数体中，对传入的 `decorators` 从数据最后开始，取出装饰器函数顺次执行，

```diff
var __decorate =
  (this && this.__decorate) ||
  function(decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
+      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
```

其中 `r` 便是装成器的返回，会被当作被装饰对象的新的属性描述器（Property Descriptor）来重新定义被装饰的对象：

```js
Object.defineProperty(target, key, r)
```

所以，像示例代码中多个装饰器均对被装饰对象有修改，原则上和多次调用 `Object.defineProperty()` 相当。


## `Object.defineProperty()`

而调用 `Object.defineProperty()` 的结果是后面的会覆盖前面的，比如来看这里一个简单的示例：

```js
const obj = {};

Object.defineProperty(obj, "foo", {
  configurable: true,
  value: function() {
    console.log("1");
  }
});

Object.defineProperty(obj, "foo", {
  value: function() {
    console.log("2");
  }
});

obj.foo(); // 2
```

**注意：** 根据 [MDN 对 `defineProperty` 的描述](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Description)，`configurable` 在缺省时为 `false`，所以如果要重复定义同一个 `key`，需要显式将其置为 `true`。

> `configurable`
>
> `true` if and only if the type of this property descriptor may be changed and if the > property may be deleted from the corresponding object.
> Defaults to `false`.

回到本文开头的示例，为了进一步验证，可通过将运用装饰之后的属性描述器打印出来：

```js
console.log(Object.getOwnPropertyDescriptor(C.prototype, "foo").value.toString());
```

输出结果为：

```sh
function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log("[f]before " + key + " called", args);
            var result = original.apply(this, args);
            console.log("[f]after " + key + " called", args);
            return result;
        }
```

那么这里引出另一个问题，通过装饰器重复定义同一属性时，并没有显式返回一个 `configurable:true` 的对象，那为何在运用多个装饰器重复定义时没报错。

## 装饰器入参中的 `descriptor`

答案就只有一个，那就是装饰器传入的 `descriptor` 已经是 `configurable` 为 `true` 的状态。

为了验证，只需要在 `@f()` 或 `@g()` 任意一个装饰器中将 `descriptor` 打印出来即可。

```diff
function g() {
  console.log("g(): evaluated");
  return function(_target: any, key: string, descriptor: PropertyDescriptor) {
+      console.log(descriptor)
    const original = descriptor.value;
    descriptor.value = function(...args: any[]) {
      console.log(`[g]before ${key} called`, args);
      const result = original.apply(this, args);
      console.log(`[g]after ${key} called`, args);
      return result;
    };
    console.log("g(): called");
    return descriptor;
  };
}
```

输出的 `descriptor`：

```sh
{
  value: [Function],
  writable: true,
  enumerable: true,
  configurable: true
}
```

这便是最终运行时会执行的 `foo` 方法真身。

可以看到确实是最后生效的装饰器确实是后运用的 `@f()`。因此你确实可以这么理解多个装饰器的重叠应用为，那一切都还说得通，就是 后运用的装饰器中 对被装饰对象的替换 会覆盖掉 先运用的装饰器 对被装饰对象的替换。

But,

这解释不了它的输出结果：

```sh
f(): evaluated
g(): evaluated
g(): called
f(): called
[f]before foo called [ 0 ]
[g]before foo called [ 0 ]
foo called 0
[g]after foo called
[f]after foo called
[f]before foo called [ 1 ]
[g]before foo called [ 1 ]
foo called 1
[g]after foo called
[f]after foo called
```

## 装饰器嵌套

原因就在于这句代码：

```ts
var result = original.apply(this, args);
```

因为这句，`@f()` 和 `@g()` 便不是简单的覆盖关系，而是形成了嵌套关系。

这里 `original` 为 `descriptor.value`，即装饰器传入的 `descriptor` 的一个副本。我们在进行覆盖前保存了一下原方法的副本，

```ts
// 保存原始的被装饰对象
const original = descriptor.value;

// 替换被装饰对象
descriptor.value = function(...args: any[]) {
    // ...
}
```

因为装饰器的目的只是**对已有的对象进行修饰加强**，所以你不能粗暴地将原始的对象直接替换成新的实现（当然你确实可以那样粗暴的），那样并不符合大多数应用场景。所以在进行替换时，先保存原始对象（这里原始对象是 `foo` 方法），然后在新的实现中对原始对象再进行调用，这样来实现了对原始对象进行修饰，添加新的特性。

```diff
descriptor.value = function(...args: any[]) {
    console.log(`[g]before ${key} called`, args);
+    const result = original.apply(this, args);
    console.log(`[g]after ${key} called`, args);
    return result;
};
```

通过这种方式，多个装饰器对被装饰对象的修改可以层层传递下去，而不至于丢失。

下面把每个装饰器接收到的属性描述器打印出来：

```diff
function f() {
  console.log("f(): evaluated");
  return function(_target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
+    console.log("[f] receive descriptor:", original.toString());
    descriptor.value = function(...args: any[]) {
      console.log(`[f]before ${key} called`, args);
      const result = original.apply(this, args);
      console.log(`[f]after ${key} called`, args);
      return result;
    };
    console.log("f(): called");
    return descriptor;
  };
}

function g() {
  console.log("g(): evaluated");
  return function(_target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
+    console.log("[g] receive descriptor:", original.toString());
    descriptor.value = function(...args: any[]) {
      console.log(`[g]before ${key} called`, args);
      const result = original.apply(this, args);
      console.log(`[g]after ${key} called`, args);
      return result;
    };
    console.log("g(): called");
    return descriptor;
  };
}
```

输出结果：

```sh
[g] receive descriptor:
 function (count) {
        console.log("foo called " + count);
    }

[f] receive descriptor:
 function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log("[g]before " + key + " called", args);
            var result = original.apply(this, args);
            console.log("[g]after " + key + " called", args);
            return result;
        }
```

这里的示例中，先是 `@g()` 被调用，它接收到的 `descriptor` 就是原始的 `foo` 方法的属性描述器，打印出其值便是原始的 `foo` 方法的方法体，

```js
function (count) {
        console.log("foo called " + count);
    }
```

经过 `@g()` 处理后的属性描述器传递给了下一个装饰器 `@f()`，所以后者接收到的是经过处理后新的属性描述器，即 `@g()` 返回的那个：

```js
 function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log("[g]before " + key + " called", args);
            var result = original.apply(this, args);
            console.log("[g]after " + key + " called", args);
            return result;
        }
```

然后将 `@f()` 中 `original` 替换成上述代码便是最终 `@f()` 返回的最终 `foo` 的样子，大致是这样的：

```js
descriptor.value = function(...args: any[]) {
  console.log(`[f]before ${key} called`, args);

  // g 开始
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  console.log("[g]before " + key + " called", args);

  // foo 开始
  console.log(`foo called ${count}`);
  // foo 结束

  console.log("[g]after " + key + " called", args);
  // g 结束
  
  console.log(`[f]after ${key} called`, args);
  return result;
};
```



所以最终的 `foo` 方法其实是 `f(g(x))` 两者嵌套组合的结果，像数学上的函数调用一样。

## 总结 

多个装饰器运用于同一对象时，其求值和执行顺序是相反的，

对于类似这样的调用：

```ts
@f
@g
x
```

- 求值顺序是由上往下
- 执行顺序是由下往上

通常情况下我们只关心执行顺序，除非是在编写复杂的装饰器工厂方法时。同时需要注意到，这里所指的装饰器**执行顺序** 是装饰器本身被调用的顺序，如果是装饰方法，这和 `descriptor.value` 被执行的顺序是两码事，后者的执行是层层嵌套的方式，联想 Koa 中间件的**洋葱圈**模型。

如果多个装饰器中都对被装饰对象有所修改，注意嵌套过程中修改被覆盖的问题，如果不想要产生覆盖，装饰器中应该有对被装饰对象保存副本并且调用，方法通过 `fn.apply()`，类则可通过返回一个新的但继承自被装饰对象的新类来实现，比如：

```ts
function classDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
    return class extends constructor {
        newProperty = "new property";
        hello = "override";
    }
}

@classDecorator
class Greeter {
    property = "property";
    hello: string;
    constructor(m: string) {
        this.hello = m;
    }
}

console.log(new Greeter("world"));
```

这里覆盖了被装饰类的构造器，但其他未修改的部分仍是原来类中的样子，因为这里返回的是一个 `extends` 后的新类。



    