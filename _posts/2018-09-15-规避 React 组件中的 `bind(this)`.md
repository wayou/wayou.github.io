---
layout: post
title: "规避 React 组件中的 `bind(this)`"
date: 2018-09-15 16:09:00 +0800
tags: 
---
    
规避 React 组件中的 `bind(this)`
===

React 组件中处理 `onClick` 类似事件绑定的时候，是需要显式给处理器绑定上下文（context）的，这一度使代码变得冗余和难看。

请看如下的示例：

```js
class App extends Component {
  constructor() {
    super();
    this.state = {
      isChecked: false
    };
  }
  render() {
    return (


      <div className="App">
        <label >
          check me:
          <input
            type="checkbox"
            checked={this.state.isChecked}
            onChange={this.toggleCheck}
          />
        </label>
      </div>
    );
  }

  toggleCheck() {
    this.setState(currentState => {
      return {
        isChecked: !currentState.isChecked
      };
    });
  }
}
```

页面上放了一个 `checkbox` 元素，点击之后切换其选中状态。这是很直观的一段代码，但并不会像你想的那样正常工作。

![事件处理器上下文丢失的报错](https://user-images.githubusercontent.com/3783096/45584203-3a0ffe80-b902-11e8-883e-01733d7659d2.png)
*事件处理器上下文丢失的报错*


因为 `checkbox` 的 `onChange` 事件处理器中，找不到 React 组件的 `setState` 方法，这说明其执行时的上下文不是该组件，而是别的什么东西，具体我们来调试下。

![调试查看丢失上下文后 `this` 的值](https://user-images.githubusercontent.com/3783096/45584220-52801900-b902-11e8-90af-0c954ceb4285.png)
*调试查看丢失上下文后 `this` 的值*


出乎意料，是 `undefined`，这个方法在一个完全野生的环境下执行，没有任何上下文。

### WHY

当然这并不是 React 的锅，这是 JavaScript 中 `this` 的工作原理。具体可参见 [Chapter 2: this All Makes Sense Now!](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch2.md) 来追溯其底层原因，简单来讲 `this` 的值取决于函数调用的方式。

#### 默认的绑定

```js
function display(){
  console.log(this)
}

display() // 严格模式下为全局 `window`，非严格模式下为 `undefined`
```

#### 隐式绑定

通过对象来调用，该函数的上下文被隐式地指定为该对象。

```js
var obj = {
  name: 'Nobody',
  display: function(){
    console.log(this.name);
   }
 };
 obj.display(); // Nobody. 里面取的是 obj 身上的 `name` 属性 
```

但，如果把该对象上的方法赋值给其他变量，或通过参数传递的形式，再执行，那光景就又不一样了。

```js

var obj = {
  name: "Nobody",
  display: function() {
    console.log(this.name);
  }
};

var name = "global!";
var outerDisplay = obj.display;
outerDisplay(); // global! 这里取到的 `name` 是全局中的内个
```

这里赋值给 `outerDisplay` 后再调用，等同于调用一个普通函数，而不是对象中的那个，所以此时 `this` 为全局对象，刚好全局里面有定义一个 `name` 变量。同样地，如果是严格模式下，因为此时 `this` 为 `undefined`，所以访问不到所谓的 `undefiend.name`，于是会抛错。

```js
function invoker(fn) {
  fn();
}

setTimeout( obj.display, 1000 ); // global!
invoker(obj.display); // global!
```

这里 `setTimeout` 调用的时候，因为它的签名实际上是 `setTimeout(fn,delay)`，所以，可以理解为将 `obj.display` 赋值给了它的入参 `fn`，实际上执行的是 `fn` 而不再是对象上的方法了。对于 `invoker` 函数也是一样的道理。


#### 强制绑定

这个时候，`bind` 就成了那个拯救世界的英雄，任何时间我们都可以通过它来显式地指定函数的执行上下文。

```js
var name = “global!”;
obj.display = obj.display.bind(obj); 
var outerDisplay = obj.display;
outerDisplay(); // Nobody
```

`bind` 将指定的上下文与函数绑定后返回一个新的函数，这个新函数再拿去赋值或传参什么的都不会对其上下文产生影响了，执行时始终是我们指定的那个。


### 现场还原

有了上面的背景，就可以还原文章开头的问题了，即事件处理器的上下文 丢失的问题。

JSX 中的 HTML 标签本质上对应 React 中创建该标签的一个函数。比如你写的 `div` 编译会其实是 `React.createElement(‘div’)`。所以当你书写 `<Input>` 时其实是调用了 [React.createElement](https://reactjs.org/docs/react-api.html#createelement) 来创建一个 `<Input>` 标签。

```js
React.createElement(
  type,
  [props],
  [...children]
)
```

标签上的属性会作为 `props` 参数传递给 `createElement` 函数。

`<Input onChange={this.toggleCheck}>` 表示将组件中的 `toggleCheck`  方法赋值给 `createElement` 的入参 `props`（`props` 是个对象，接收所有书写在标签上的属性，），实际调用的时候一如上面所说的，调用的已经不是组件中的 `toggleCheck` 方法了。

```js
React.createElement(type, props){
  // 让我们创建一个 <type> 并在 <type> 的值发生变化的时候调用一下 `props.onChange`
  ...
  props.onChange() // 它已经不是原来的方法了，丢失了上下文
  ...
}
```

因为 ES6 的 Class 是在严格模式下执行的，所以事件处理器中如果使用了 `this` 那它就是 `undefined`。

所以你看到 React 官方的示例中，constructor 里有 `bind(this)` 的语句就不奇怪了，就是为了纠正这个事件处理器歪了的执行上下文。

```diff
  constructor() {
    super();
    this.state = {
      isChecked: false
    };
+   this.toggleCheck = this.toggleCheck.bind(this);
  }

```

这样是能正常工作了，但是，这句代码的存在真的很别扭，因为，
- 对于业务来说，毫无意义，徒增代码量
- 很丑陋，每加一个处理器就要加一条这样的绑定
- 冗余，这样重复的代码大量冗余在项目中，在搜索中混淆了原本的方法

避免的方式有很多，就看哪种最对味。下面来看看如何避免写这些绑定方法。


### #0行内的绑定

最简单的可以在行内进行绑定操作，这样不用单独写一句出来。

```diff
   <input
            type="checkbox"
            checked={this.state.isChecked}
-            onChange={this.toggleCheck}
+            onChange={this.toggleCheck.bind(this)}
      />

```

### #1箭头函数

因为箭头函数不会创建新的作用域，其上下文是语义上的（lexically）上下文。所以在绑定事件处理器时，直接使用剪头函数是很方便的一种规避方法。

```diff
          <input
            type="checkbox"
            checked={this.state.isChecked}
-            onChange={this.toggleCheck}
+            onChange={() => this.toggleCheck()}
          />

```


### #2将类的方法改成属性

如果将这个处理器作为该组件的一个属性，这个属性作为事件的处理器以箭头函数的形式存在，执行的时候也是能正常获取到上下文的。

```diff
-  toggleCheck() {
+  toggleCheck = () => {
    this.setState(currentState => {
      return {
        isChecked: !currentState.isChecked
      };
    });
  }
```

### 总结

React 组件中，其实跟 React 没多大关系，传递事件处理器，或方法作为回调时，其上下文会丢失。为了修复，我们需要显式地给这个方法绑定一下上下文。除了常用的在构造器中进行外，还可通过箭头函数，公有属性等方式来避免冗余的绑定语句。


### 相关资源

- [This is why we need to bind event handlers in Class Components in React](https://medium.freecodecamp.org/this-is-why-we-need-to-bind-event-handlers-in-class-components-in-react-f7ea1a6f93eb)
- [Chapter 2: this All Makes Sense Now!](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch2.md) 

    