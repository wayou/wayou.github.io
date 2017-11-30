## apply vs call vs bind

### `apply` 与 `call`

js 有三个方法可以改变函数的执行上下文，`apply`，`call`和`bind`，三者都系 `Function` 对象上的原型方法。

```js
var name = 'foo',
    obj = {
        name: 'bar',
        sayHello: function() {
            console.log(this.name);
        }
    };

obj.sayHello();//bar
obj.sayHello.apply(this);//foo
obj.sayHello.call(this);//foo
obj.sayHello.bind(this)();//foo
```

其中 `apply` 与 `call` 其实相当于调用函数，只不过调用时可以传递一个指定的上下文。而 `bind` 则不是立即调用，而是生成一个新的函数，新函数的上下文被指定为了传入的上下文。

前两者，如果你纠结于它们的区别，那就是参数。

`apply`方法的签名：

```js
func.apply(thisArg, [argsArray])
```
其中，`argsArray` 是个类数组对象，并非真正的数据。
什么意思？联想一下，在函数体中，我们可以通过一个隐藏的 `arguments` 变量来获取入参。

```js
function f(){console.log(arguments)}
f(1)
f('hello','world')
```

![函数体中类数组的 `arguments` 变量](https://raw.githubusercontent.com/wayou/wayou.github.io/master/js-apply-call-and-bind/assets/array-like-arguments.png)

_函数体中类数组的 `arguments` 变量_

我们看到，函数体中的 `arguments` 变量中用从0开始的索引记录了函数调用时的入参，可以通过索引访依次访问到每个入参。

有没有一点感觉了？是吧，意味着，我们可以将一个函数的入参，直接通过 `arguments` 作为 `apply` 时的参数。

请看示例：假如我们想改写原生的 `console.log`，让它在每次 log 的时候带上时间

```js
var obj={
    name:'susan',
    say:function(){
        console.log.apply(obj, arguments);
    }
}

obj.say(', how old are you?');
obj.say(', how beautiful are you?','by the way, got time tonight?');
```

上面一大段在讨论什么？
其实我想说，虽然平时我们介绍 `apply` 会说第一个参数指定上下文，后面跟参数数组，并且也是这么用的，我们会构造数组传递给它，

```js
Math.min.apply(null, [1,2,3]);
```

但我在想，是不是人们在设计它的时候，其实是期望用在直接传递 `arguments` 的场景下，不然用类数组作为参数序列真的有点别扭不是。这样说来，不止 `arguments`，同样作为类数组，`document.querySelectorAll` 类似这样的选择器返回的 DOM 节点集合，也是正统的 `apply` 第二参数候选人。


`call`方法的签名：

```js
func.call(thisArg, arg1, arg2, ...)
```

如果你苦恼于记不住，容易将两者搞混，到底谁在调用时传正常逗号分隔的入参，谁又接收类数组的入参。有个方法，`call` 本身英文意思就与 `invoke` 相近，有「调用」的意思，所以，我们在使用 `call`的时候，传参就像正常调用一个函数一个传递就行了。反之，既然记住了 `call` 是正常类型的传参，那剩下 `apply` 就是传递类数组参数喽。


### `bind`

它的方法签名：

```js
fun.bind(thisArg[, arg1[, arg2[, ...]]])
```

你可能会问，既然已经有两个这样牛逼的方法了，还要 `bind` 何用。`bind` 在异步及事件中很有用，这里举另一种场景下的例子。原生方法作为工具方法调用的时候，为了确保正常调用，是需要带上原生上下文的。

```js
var $ = document.querSelector.bind(document);//现在可以愉快地使用 `$` 来选择 DOM 啦，假装在使用 jQuery
$('body');
```

![alias 原生方法](https://raw.githubusercontent.com/wayou/wayou.github.io/master/js-apply-call-and-bind/assets/alias-native-method.png)

_alias 原生方法_


### 相关资料

* [Function.prototype.apply()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
* [Function.prototype.call()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
* [Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind)
* [Javascript call() & apply() vs bind()?](https://stackoverflow.com/questions/15455009/javascript-call-apply-vs-bind)

