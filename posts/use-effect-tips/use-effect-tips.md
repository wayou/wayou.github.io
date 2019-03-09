# React useEffect 相关问题

根据 [`useEffect` 官方文档](https://reactjs.org/docs/hooks-effect.html) 的介绍，`useEffect` 会在每次渲染后执行，包括组件首次渲染完成后，相当于 class 组件下 `componentDidMount`, `componentDidUpdate` 及 `componentWillUnmount` 三个生命周期的组合。

主要用于需要产生副作用的场景，比如数据请求，设置事件监听，DOM 操作，一切产生 **效果/Effect** 的操作。

### 只在组件初始化后执行一次

像事件绑定，只需要在组件初始化完成后执行一次即可。这种场景，就相当于 class 组件下的 `componentDidMount`，hooks 下的 `useEffect` 可以通过它的第二个参数来实现。

```js
useEffect(() => {
  window.addEventListener("resize", handler);
}, []);
```

第二个参数接收一个数组，数组里面指定 `useEffect` 里依赖了哪些变量。只有任意变量的值发生变化时才会执行。

但是如果传递的是空数组，表示它不依赖任何外部变量，所以只会在组件首次渲染完成后执行一次。

默认情况下，没有传递这个第二参数时，则不会有节流效果，只要组件重新渲染，便会执行。

### 跳过首次执行

有些情况下是需要排除掉第一次的，比如一个列表，首屏幕数据来自服务器渲染，下拉后再继续请求第二页的数据。

```js
function List({ data }) {
  const [listData, setListData] = useState(data);

  useEffect(() => {
    loadNextPage();
  });
}
```

这种情况没有特别 native 的做法，需要借助 `useRef` 间接实现。

`useRef` 并不是之前认识的那个只用来引用 DOM 的 ref，hook 方式中它是可存储任意值的。

```js
function List({ data }) {
  const isMount = useRef(false);
  const [listData, setListData] = useState(data);

  useEffect(() => {
    if (!isMount.current) {
      isMount.current = true;
      return;
    }
    loadNextPage();
  });
}
```

### 事件处理器中获取 state

考虑如下代码：

```js
const [num, setNum] = useState(0);

function handler() {
  console.log(num);
}

useEffect(() => {
  window.addEventListener("resize", handler);
  return () => {
    window.removeEventListener("resize", handler);
  };
}, []);
```

页面上有两个按钮，点击后分别对 num 进行增减。
同时根据前面的分析，通过传递空数组让事件绑定只执行一次。在窗体 resize 时输出当前的 num。

实测后发现，改变 num 后拖动窗体触发回调，其输出始终为原始值 0 而不会获取到 num 的最新值。

因为事件绑定时，处理器中得到的是 num 的初始状态即值为 0 的时候，此后的执行都是获取到的当时的执行上下文中的这个 num 变量。

解决的办法有两种，有人提了相关 issue，根据 [Dan 的回复](https://github.com/facebook/react/issues/14699#issuecomment-457653146)，大可把这里绑定事件的方式改一下，去掉空数组，即每次渲染时重新绑定事件处理器，这肯定能解决问题，因为重新绑定的时候，获取到的的确是最新的 state。考虑到事件绑定与销毁的开销并不大，同时 `useEffect` 是不阻塞 UI 渲染的，所以大可不必担心这样的做法性能会很差。

或者，将 num 写进数组，表示这个 `useEffect` 里的代码会依赖于 num 这个变量，同样能达到效果。因为只要 num 一变，事件会重新绑定。

还有就是前面提到过的 `useRef`。将最新的值存入 ref 中，这样事件处理器中直接获取 ref 里的值即可。

```js
  const [num, setNum] = useState(0);
  const numRef = useRef();

  useEffect(() => {
    numRef.current = num;
  });

  function handler() {
    console.log(numRef.current);
  }

  useEffect(() => {
    window.addEventListener("resize", handler);
  }, []);
```

### 相关资料

- [`useEffect` 官方文档](https://reactjs.org/docs/hooks-effect.html)
- [Is there something like instance variables?](https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables)
- [Event handler in addEventListener doesn't have access to the latest state #14699](https://github.com/facebook/react/issues/14699)
