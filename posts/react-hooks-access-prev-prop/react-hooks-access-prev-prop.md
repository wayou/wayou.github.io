React Hooks 方式下 props 到 state 的值同步 
===

考虑如下的问题：
页面有两个计时器 A，B，两个计时器都能自由计数。但 B 的初始值由 A 提供，且一旦 A 的值变化后，立即同步给 B。

这里涉及到将 props 值变化的检测和将变化后的值同步到 state 的问题。

### Class 组件的实现

传统 Class 方式下，很容易想到即将废弃的生命周期函数 `UNSAFE_componentWillReceiveProps`，将 `nextProps` 与当前的 `props` 比较便可知道 A 计数器的值是否发生了变化。

```js

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.initialCount !== this.props.initialCount) {
      this.setState({
        count: nextProps.initialCount
      })
    }
  }

```

检测到变化后通过 `setState` 立即将最新的值同步到了 state 上，完成了功能。一套流程下来是很熟悉的操作。但既然已经不提倡使用 `UNSAFE_componentWillReceiveProps`，肯定有其他官方推荐的方式。

 React 官方文档确实有相应[描述](https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops)：

> If you used componentWillReceiveProps to “reset” some state when a prop changes, consider either making a component fully controlled or fully uncontrolled with a key instead.

针对这里需要将 props 值同步到 State 的情况，这里不讨论了。


### Hooks 方式的实现

使用 Hooks 方式时，因为是函数类型的组件，是没有相应生命周期来做这个事情的。如果单单只是检测 props 的变化，可以这样写：

```js
useEffect(() => {
    console.log('initialCount changed', props.initialCount);
}, [props.initialCount])
```

`useEffect(fn, option)` 会在每次 render 后执行，第二个参数 `[props.initialCount]` 则限定其只在 `props.initialCount` 变化时才执行，完美符合文章开头的要求。

因为是在 render 后执行，所以此时拿到的是最新的 props 值。如果想要获取旧数据，则需要借助 `useRef`。

Class 组件下，`ref` 用来绑定对 DOM 的引用，hooks 方式下，根据[官网文档的描述](https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables)，它的作用就灵活些了，并不限定于引用 DOM。通过 `useRef` 创建的对象其 `current` 属性可存储任意值，作用等同于 Class 上的静态属性。

联想到 `useEffect` 是在 render 后执行，所以可在 `useEffect` 中将新的 props 同步到 ref 上，而每次 render 使用的 ref 是同步之前的旧值，这样能够在组件中同时获取到新旧 props。下面看代码比较直观：

_以下示例代码来自 [React 官方文档](https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state)_
```diff
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef();
  useEffect(() => {
+    prevCountRef.current = count;
  });
+  const prevCount = prevCountRef.current;

  return <h1>Now: {count}, before: {prevCount}</h1>;
}
```

至此，解决了技术的问题，结合开头的需求，计数器可以这么写：

```js
import React, { useState, useRef, useEffect } from 'react';

function Counter({ initialCount }) {
  const [count, setCount] = useState(initialCount)
  const prevCountRef = useRef(initialCount);
  useEffect(() => {
    prevCountRef.current = initialCount;
  })

  if (initialCount !== prevCountRef.current && count !== initialCount) {
    setCount(initialCount)
  }
  
  return <div>
    <p>counter2:{count}</p>
    <div>
      <button onClick={() => { setCount(count + 1) }}>+</button>
    </div >
  </div >
}

function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="App">
      <h3>hook ver</h3>
      <p>counter1:{count}</p>
      <div>
        <button onClick={() => { setCount(count + 1) }}>+</button>
      </div>
      <Counter initialCount={count}></Counter>
    </div>
  );
}

export default App;
```

完整的代码可查看[这里](https://github.com/wayou/wayou.github.io/blob/master/posts/react-hooks-access-prev-prop/src/src/App.js)

### 总结

针对在函数组件中需要获取旧数据的问题，目前是使用 `useRef` 间接实现，但从文档上的描述来看，不排除 React 未来的版本中会自带类似 `usePrevious` 这样命名的 hook 开箱即用，就没有那么麻烦了。毕竟，获取上一次的值也是比较常见的操作。


### 相关资源

- [Hooks FAQ - How to get the previous props or state?](https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state)
- [useRef](https://reactjs.org/docs/hooks-reference.html#useref)
- [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect)
- [Is there something like instance variables?](https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables)
- [REACT CLASS FEATURES VS. HOOKS EQUIVALENTS](https://blog.solutotlv.com/react-class-to-hooks/)
