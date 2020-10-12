---
layout: post
title: "React + TypeScript：元素引用的传递"
date: 2019-04-16 23:04:00 +0800
tags: 
---
    
# React + TypeScript：元素引用的传递

React 中需要操作元素时，可通过 `findDOMNode()` 或通过 `createRef()` 创建对元素的引用来实现。前者官方不推荐，所以这里讨论后者及其与 TypeScript 结合时如何工作。

## React 中的元素引用

正常的组件中，可通过创建对元素的引用来获取到某元素然后进行相应操作。比如元素加载后将焦点定位到输入框。

```js
class App extends Component {
  constructor(props){
    super(props);
    this.inputRef = React.createRef();
  }

  componentDidMount(){
    this.inputRef.current.focus()
  }

  render() {
    return (
      <div className="App">
        <input type="text" ref={this.inputRef}/>
      </div>
    );
  }
}
```

创建对元素的引用是通过 `React.createRef()` 方法完成的。使用的时候，通过其返回对象身上的 `current` 属性可访问到绑定引用的元素。

React 内部对引用的 `current` 赋值更新发生在 `componentDidMount` 或 `componentDidUpdate` 生命周期之前，即存在使用的时候引用未初始化完成的情况，所以 `current` 不一定有值。好的做法是使用前先判空。

```js
if(this.inputRef.current){
    this.inputRef.current.focus()
}
```

在上面的示例中，之所以不用判空是因为我们在 `componentDidMount` 生命周期中使用，此时元素已经加载到页面，所以可以放心使用。

## 组件中引用的传递

对于原生 DOM 元素可以像上面那样创建引用，但对于自己写的组件，则需要使用 `forwardRef()` 来实现。

假如你写了个按钮组件，想要实现像上面那样，让使用者可通过传递一个 `ref` 属性来获取到组件中原生的这个 `<button>` 元素以进行相应的操作。

_button.jsx_
```js
const FancyInput = props => <input type="text" className="fancy-input" />;
```

添加 ref 支持后的按钮组件：

_button.jsx_

```js
const FancyInput = React.forwardRef((props, ref) => {
  return <input type="text" ref={ref} className="fancy-input" />;
});
```

`forwardRef` 接收一个函数，函数的入参中第一个是组件的 props，第二个便是外部传递进来的 ref 引用。通过将这个引用在组件中绑定到相应的原生 DOM 元素上，实现了外部直接引用到组件内部元素的目的，所以叫 `forwardRef`（传递引用）。

使用上面创建的 `FancyInput`，在组件加载后使其获得焦点：

```diff
class App extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  render() {
    return (
      <div className="App">
-        <input type="text" ref={this.inputRef}/>
+        <FancyInput ref={this.inputRef} />
      </div>
    );
  }
}
```

## TypeScript 中传递引用

先看正常情况下，对原生 DOM 元素的引用。还是上面的示例：

```ts
class App extends Component<{}, {}> {
  private inputRef = React.createRef();

  componentDidMount() {
    /** 🚨 Object is possibly 'null' */
    this.inputRef.current.focus();
  }

  render() {
    return (
      <div className="App">
        {/* 🚨 Type '{}' is missing the following properties from type 'HTMLInputElement':... */}
        <input type="text" ref={this.inputRef} />
      </div>
    );
  }
}
```

像上面那样创建并使用存在两个问题。

一个是提示我们的引用无法赋值到 `<input>` 的 `ref` 属性上，类型不兼容。引用需要与它真实所指代的元素类型相符，这正是 TypeScript 类型检查为我们添加的约束。这个约束的好处是，我们在使用引用的时候，就知道这个引用真实的元素类型，TypeScript 会自动提示可用的方法和属性，同时防止调用该元素身上没有的属性和方法。这里修正的方法很简单，如果 hover 或 <kbd>F12</kbd> 查看 `React.createRef()` 的方法签名，会发现它是个泛型方法，支持传递类型参数。

```ts
function createRef<T>(): RefObject<T>;
```
所以上面创建引用时，显式指定它的类型。

```diff
- private inputRef = React.createRef();
+ private inputRef = React.createRef<HTMLInputElement>();
```

第二个问题是即使在 `componentDidMount` 生命周期中使用，TypeScript 仍然提示 `current` 的值有可能为空。上面讨论过，其实此时我们知道它不可能为空的。但因为 TypeScript 无法理解 `componentDidMount`，所以它不知道此时引用其实是可以安全使用的。解决办法当然是加上判空的逻辑。

```diff
  componentDidMount() {
+    if(this.inputRef.current){
      this.inputRef.current.focus();
+    }
  }
```

还可通过变量后添加 `!` 操作符告诉 TypeScript 该变量此时非空。

```diff
  componentDidMount() {
-      this.inputRef.current.focus();
+      this.inputRef.current!.focus();
  }
```

修复后完整的代码如下：

```ts
class App extends Component<{}, {}> {
  private inputRef = React.createRef<HTMLInputElement>();

  componentDidMount() {
    this.inputRef.current!.focus();
  }

  render() {
    return (
      <div className="App">
        <input type="text" ref={this.inputRef} />
      </div>
    );
  }
}
```

## React + TypeScript 组件引用的传递

继续到组件的情况，当需要引用的元素在另一个组件内部时，还是通过 `React.forwardRef()`。

这是该方法的签名：

```ts
function forwardRef<T, P = {}>(Component: RefForwardingComponent<T, P>): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;
```

可以看到，方法接收两个类型参数，`T` 为需要引用的元素类型，我们示例中是 `HTMLInputElement`，`P` 为组件的 props 类型。

所以添加引用传递后，`FancyInput` 组件在 TypeScript 中的版本应该长这样：

```ts
const FancyInput = React.forwardRef<HTMLInputElement, {}>((props, ref) => {
  return <input type="text" ref={ref} className="fancy-input" />;
});
```

使用组件：

```ts
class App extends Component<{}, {}> {
  private inputRef = React.createRef<HTMLInputElement>();

  componentDidMount() {
    this.inputRef.current!.focus();
  }

  render() {
    return (
      <div className="App">
        <FancyInput ref={this.inputRef} />
      </div>
    );
  }
}
```

## 相关资源

- [Refs and the DOM](https://reactjs.org/docs/refs-and-the-dom.html)
- [Forwarding Refs](https://reactjs.org/docs/forwarding-refs.html)
- [findDOMNode()](https://reactjs.org/docs/react-dom.html#finddomnode)
- [React Refs with TypeScript](https://medium.com/@martin_hotell/react-refs-with-typescript-a32d56c4d315)

    