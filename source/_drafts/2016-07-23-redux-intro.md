title: 给自己的 Redux 普及读本
toc: true
cover: cover.jpg
date: 2016-07-24 15:49:43
categories:
- 技术
tags:
- raect
- redux
---

write a shopping system to demonstrate redux

统计示例展示中间件

注意是 redux，不是 durex 。(逃

这是接上篇「给自己的 Flux 普及读本」，可以算作学习笔记，亦可看作是加上了自己理解的简单教程。无论怎样，学习和回顾一下不无裨益。


**由 Array.prototype.reduce() 引入**

<!-- more -->

## 背景

- Predictable state container for JavaScript apps —repo description

- background：As the requirements for JavaScript single-page applications have become increasingly complicated, our code must manage more state than ever before. 
- 单页面应用的发展，使得前端需要管理的状态越来越多。新需求的不断叠加，使得原本就难以维护管理的前端状态雪上加霜。问题的根源是我们将更改与异步这两样东西杂糅，而这两样东西又是很难维护的。
- react 已经开始在视图层面解决这一问题，将异步和 直接操作DOM 从视图开发中剥离。但数据状态的维护仍亟待解决。这便是 Redux 产生的背景。

- Redux 借鉴了 Flux, CQRS, and Event Sourcing ，通过更加严格地控制状态何时以何种方式发生变更，来实现状态的可预测性。这些控制的举措组成了 Redux，可以总结为三大准则。

- site note: 纯函数

- Single source of truth: The state of your whole application is stored in an object tree within a single store.
- 极权下的统一，所有数据收敛到一个地方。这样的结构和苹果的生态有点像，苹果的封闭保证了它内部的整洁，系统的流畅。
- 好处：数据处理方便，一目了然；
- 单个数据源易调试
- 容易存放，状态的变化好记录，重复撤消等功能容易实现

```js
console.log(store.getState())

/* Prints
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
*/
```


- State is read-only. The only way to mutate the state is to emit an action, an object describing what happened.
- 改变状态的唯一方式是发起 action
- 视图层及异步返回都无法直接改变状态，只能发起 action。所有改变都集中在一起管理，可以严格控制他们的顺序，所以不存在各种地方对数据的争抢。action 作为普通js 对象，可以被记录下来，从而可以实现回放功能。

```js
store.dispatch({
  type: 'COMPLETE_TODO',
  index: 1
})

store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
})
```
 

- Changes are made with pure functions。To specify how the state tree is transformed by actions, you write pure reducers.
- reducers 本质上是纯函数，接收 state 和 action 作为入参，然后返回一个新的 state. reducer 可以有多个，分管整个 state 状态树的不同部分。

redux 所借鉴的一些特征

- flux 
- 两种架构里面都建议你将业务逻辑放在统一的一个地方（flux 是 store，redux 是 reducer）。避免直接在程序里操作状态而是用一个语义化的对象来描述这种操作

- 与flux 不同，redux 没有dispatcher 而是依赖于纯函数。在 redux 里面，始终是(state,action)=>state 的模式
- 另一个重要不同点是 redux 假设你永远不会去操作原始数据。你的状态里面可以包含对象，数组，但千万不要去改变内部的值。而是返回一个新的值。否则开发过程中的回退功能将不可用，因为你把之前的状态改变了，而不是把他们原封不动地保存了下来。

----------------

## basic
### Actions
- Actions are payloads of information that send data from your application to your store.

- action 是信息载体，由程序向 store 发送
- 是 store 数据的唯一来源
- 通过调用`store.dispatch()`来发送一个 action
- Action 必需包含一个`type`字段来标识他的类型，这个字段的值一般定义为字符串常量
- 除了规定的 type 字段，action 的其他部分任意发挥
- action 传递数据尽量精简，只传递必需的数据

Side Notes:
>- type 一般为动词，因为他标识的东西是一个action/动作,`ADD_TODO`,`TOGGLE_TODO`,`SET_VISIBILITY_FILTER`
- 关于 action 创建的最佳实践可以参考[Flux Standard Action](https://github.com/acdlite/flux-standard-action)
- 一般会将项目中所有 action 定义到一个单独的文件统一管理，再大型一点的项目可能需要考虑拆成多个文件，小型项目直接将字符串写到代码里不拆分单独文件来保存也是可行的，总之依项目而定

```js
import { ADD_TODO, REMOVE_TODO } from '../actionTypes'
```

一个 action 示例：

```js
const ADD_TODO = 'ADD_TODO'
{
  type: ADD_TODO,
  text: 'Build my first Redux app'
}
```

### Action Creator

Action creators are exactly that—functions that create actions.

用来生成 action 的函数，它只是简单地返回了一个普通 js 对象。

Side Notes:
> method->方法
> function->函数

一个 action creator 示例：
```js
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}
```

然后通过 dispatch() 来向外发送

```js
dispatch(addTodo(text))
```

Side Notes
> - Action creator 的名字一般也为动词，`addTodo(text)`,`completeTodo(index)`。因为，作为被 dispatch 调用时，语义上来说，dispatch 的是一个动作。
> -  dispatch 函数来自 store，如果是和 react 一起使用的话，一般是调用 redux-thunk 注入到组件里面的 dispatch 函数，而不是直接调用 store.dispatch()


### Reducers

Actions describe the fact that something happened, but don’t specify how the application’s state changes in response. This is the job of a reducer.

Action 描述一个事件发生了，但没有指明程序的状态如何随之更新。Reducer 便是处理这个的。

### state 的设计
Redux 架构中，程序的所有状态数据是被组合保存在一个State 对象里的。开始编码前，需要想好程序所需的所有状态，然后合理设计 state 的结构，这关系到模块的划分。

> redux 建义将状态设计得尽量扁平化，不要将模型嵌套，如果有模型引用或者交叉包含的情况，只保留所需要对象的 id。

### 处理 action

状态树确定后，就可以编写 Reducer 了。处理 Action 的工作就是由称作 Reducer 的 **纯函数** 完成的。

```js
(previousState, action) => newState //我看上去是不是很优雅
```

Reducer接收 state 和 action 作为入参，返回新的 state。

Side notes
> 之所以叫作 Reducer，就是因为它是用来遍历状态树逐一进行处理最后返回一个新的结果。这个过程其实就是我们我们平时使用过的数组身上的`reduce`函数。

```js
Array.prototype.reduce(reducer, ?initialValue)
```

因为 reducer 是纯函数，所以，会产生副作用的操作都需要避免。

- 改变入参
- 进行异步请求，路由跳转等会对程序状态产生影响的操作
- 调用非纯函数，譬如`Date.now()`,`Math.random()`

>note: 纯函数
纯函数的概念来自函数式编程。。。

reducer 一定要是纯函数，固定输入产生固定输出，不进行任何有副作用的操作，输出一定是可预见的（redux 状态的可预测性就由此而来，`Redux is a **predictable** state container for JavaScript apps.`）。

下面是一个 reducer 示例：

```js
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    default:
      return state
  }
}
```

Side notes
> reducer 一般为名词，因为他是负责程序状态树某部分逻辑的，与模块对应，而我们的模块，譬如「导航」，「页脚」，「侧边栏」，这些就是名词。


程序首次启动时，初始的 state 是 `undefined`，所以我们有必要给 reducer 的 state 入参一个默认值。这里使用了是 ES6 的语法来给函数入参指定默认值（[参见 ES6 默认参数](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Default_parameters)），感谢 ES6，让我们告别了使用`||` 或者操作符来设置默认值的年代。

上面示例中，根据 action 中的 type ，reducer 进行相应的处理，设置 TODO 列表的过滤条件，并返回带有新的过滤条件的 state。

注意这里使用的[`Object.assign()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)方法同样来自 ES6 ，用它来合并对象，类似 jQuery 的 `$.extend()`，上面的使用中指定了三个参数，`{}`空对象，`state`原来的程序状态树，以及我们希望设置的新值，后面两个参数合并后会赋给第一个参数，也就是那个空对象，最后我们得到一个完全新的独立状态并返回，并没有破坏掉原来的`state`变量。

这里指定一个空对象作为`Object.assign()`的第一个参数很重要。如果我们这样做：

```js
Object.assign(state, {
    visibilityFilter: action.filter
})
```

第二个参数的值会被合并到我们原始的`state`变量里，由于 js 里对象参数的传递是引用传递（自行思考参数的「引用传递」与「值传递」），这样我们就把原来的状态改变了，这在 Redux 架构下是不合理的。

值得注意的另外一点是，Reducer 作为 Action 的处理场所，它始终返回一个新的 state，假设有个 reducer 它什么也没做，或者对当前传入的 Action 不处理，这时候是需要将传递进来的 state 返回的，否则会导致其他地方获取状态的时候得到`undefined`。换句话说，`switch`语句里的`default`分支不能省，如果你用`switch`的话。

### Reducer 的拆分

在 TODO 示例中，除了过滤条目（显示已完成的待办事项，显示全部待办事项），还有添加条目，将某条标记为完成等 action，加上这些后，大致的代码看起来像这样：

```js
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
      })
    case TOGGLE_TODO:
      return Object.assign({}, state, {
        todos: state.todos.map((todo, index) => {
          if(index === action.index) {
            return Object.assign({}, todo, {
              completed: !todo.completed
            })
          }
          return todo
        })
      })
    default:
      return state
  }
}
```

不难看出，`TOGGLE_TODO`与`TOGGLE_TODO`所操作的数据是一样的，他们都只关心 TODO 列表这一数组。

更新后的代码大概是这样的：
```js
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        }
        return todo
      })
    default:
      return state
  }
}

function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    case ADD_TODO:
    case TOGGLE_TODO:
      return Object.assign({}, state, {
        todos: todos(state.todos, action)
      })
    default:
      return state
  }
}
```

在`todos`方法里，它只接收一个数组作为入参，也就是 TODO 列表，外界传入也只取了`state.todos`进行传入，这样看来，`todos`方法里就只需要负责他负责的部分就好，他不需要关心整个状态树上其他的东西，分工明确。

同时, filter 部分也可以单独拿出来：
```js
function todoApp(state = {}, action) {
  return {
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    todos: todos(state.todos, action)
  }
}
```

redux 专门提供了一个`combineReducers()`函数来拼接 reducer,

```js
import { combineReducers } from 'redux'

const todoApp = combineReducers({
  visibilityFilter,
  todos
})

export default todoApp
```


### Store

The Store is the object that brings them (action,reducer) together

The store has the following responsibilities:
- Holds application state;
- Allows access to state via getState();
- Allows state to be updated via dispatch(action);
- Registers listeners via subscribe(listener);
- Handles unregistering of listeners via the function returned by subscribe(listener).

**have a single store in a Redux application**

有了 reducer 后，就可以通过`createStore()`创建store 了。

```js
import { createStore } from 'redux'
import todoApp from './reducers'
let store = createStore(todoApp)
```

### dispatching actions

此刻可以在 store 里测试我之前的代码了

```js
store.subscribe(()=>console.info(store.getState()))
store.dispatch(addTodo('item 1'));
```


## data flow in redux app

a strict unidirectional data flow

**predictable**

data lifecycle
1.store.dispatch(action)
2.The Redux store calls the reducer function you gave it
3.The root reducer may combine the output of multiple reducers into a single state tree.
4.The Redux store saves the complete state tree returned by the root reducer.


## using with react
know one term first

[** separating presentational and container components **](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.4y9axyybh)

**展示组件  Presentational Components**
功能：用户看到的界面，包含 html 标签和样式
与 redux 无关
数据从 props 获取
通过传进来的回调来改变数据
**容器组件**
功能：逻辑，获取数据及更新状态
与 redux 通信
数据从redux 获取
通过发送 action 来改变数据

一般我们不需要写容器型组件，因为涉及到调用`store.subscrible()`监听 state 的更新，做不好会有性能上的损耗。我们一般通过使用`connect()`来生成容器型组件

使用 `connect()` 可以避免不必要的组件渲染，不用自己调用react 的`shouldComponentUpdate` 来优化程序

**mapStateToProps**
>To use connect(), you need to define a special function called mapStateToProps that tells how to transform the current Redux store state into the props you want to pass to a presentational component you are wrapping. 

**mapDispatchToProps**

In addition to reading the state, container components can dispatch actions. In a similar fashion, you can define a function called mapDispatchToProps() that receives the dispatch() method and returns callback props that you want to inject into the presentational component. 

```js
const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)
```


TodoList -connect-> VisibleTodoList 计算当前可见的 todos 传递给 TodoList, 传递 onTodoClick
Link -connect-> FilterLink 计算出一个 active 传递给 Link, 传递 onClick

###Other components

```diff
import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../actions'

let AddTodo = ({ dispatch }) => {
  let input

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        dispatch(addTodo(input.value))
        input.value = ''
      }}>
+        <input ref={node => {
+          input = node
+        }} />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  )
}
AddTodo = connect()(AddTodo)

export default AddTodo
```

**问题** 上面 input 为何需要使用 ref 回调，不能直接指定 ref="input" 然后直接用么？
[ref doc](https://facebook.github.io/react/docs/more-about-refs.html#the-ref-string-attribute)

** The Connect API**
`connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])` 

Connects a React component to a Redux store.

It does not modify the component class passed to it.
Instead, it returns a new, connected component class, for you to use.

Returns:
A React component class that **injects state and action creators**  into your component according to the specified options.

### Passing the Store

<Provider>

>All container components need access to the Redux store so they can subscribe to it.

疑问：既然容器型组件需要调用 connet 进行封装，我们得到的就是已经注入了 state 和 dispatch，那为何还需要<Provider> 来传递 store?

```js
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(todoApp)

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
)
```

----------------------

### async actions/middleware

[Redux Thunk middleware](https://github.com/gaearon/redux-thunk)

**middleware**

Without middleware, Redux store only supports synchronous data flow

为啥不用中间件就只支持同步 action?
why?
[Why do we need middleware for async flow in Redux?](http://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux)
- the component doesn’t care that the action creator is async
- it is just easier from the maintenance point of view to extract action creators into separate functions

Why do I need to pass in dispatch and getState? If the premise of redux is that there is a single global store, why don't I just use that, i.e., call store.dispatch whenever I need to dispatch an action? 

If your app is client side only that would work. If it's rendered on the server, you'll want to have a different store instance for every request so you can't define it beforehand.

Asynchronous middleware like redux-thunk or redux-promise wraps the store’s dispatch() method and allows you to dispatch something other than actions, for example, functions or Promises. 

好好理解下
```js
export default function applyMiddleware(...middlewares) {
  return (next) => 
    (reducer, initialState) => {
      var store = next(reducer, initialState);
      var dispatch = store.dispatch;
      var chain = [];
      var middlewareAPI = {
        getState: store.getState,
        dispatch: (action) => dispatch(action)
      };
      chain = middlewares.map(middleware =>
                       middleware(middlewareAPI));
      dispatch = compose(...chain, store.dispatch);
      return {
        ...store,
        dispatch
      };
   };
}
```

// **Must point to the function returned by the previous middleware:**
这一句点醒了我
```js
function logger(store) {
  // **Must point to the function returned by the previous middleware:**
  let next = store.dispatch

  return function dispatchAndLog(action) {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
  }
}
```

middleware 演化史
monkeypatching->return middleware and hide monkeypatching within redux-> let the middleware accept next as parameter instead of reading it directly from store.

```js
function logger(store) {
  // Must point to the function returned by the previous middleware:
  let next = store.dispatch

  return function dispatchAndLog(action) {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
  }
}
```

```js
function logger(store) {
  return function wrapDispatchToAddLogging(next) {
    return function dispatchAndLog(action) {
      console.log('dispatching', action)
      let result = next(action)
      console.log('next state', store.getState())
      return result
    }
  }
}
```

## 总结

- 对于新技术，第一次看有点丈二和尚摸不着头脑，第二次看能够理解，第三次看则了然于心，这是我的经验。所以我们不该对新技术感到恐惧，我们只是没有花够时间。


好了，朋友，至此你已经完成了对 redux 的零距离接触，是时候出山了。那，看你骨骼精奇，一定是学习前端的奇才，这里有一个 repo  [xgrommx/awesome-redux](https://github.com/xgrommx/awesome-redux) 里面罗列了许多 redux 精华及周边资源，免费赐予，去知识的海洋徜徉。只是海上浪太大，注意安全，取适合自己的，不要被淹没。



- http://blog.krawaller.se/posts/a-redux-app-tutorial/