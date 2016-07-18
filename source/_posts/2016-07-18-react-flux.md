title: 给自己的Flux普及读本
toc: true
cover: cover.jpg
date: 2016-07-18 14:11:48
categories:
- 技术
tags:
- reactjs
- flux
---

话说当时做 APP 时，三月不知肉味，再次将眼光投放前端，有种天上一天，地下一年的感觉。

<!-- more -->

## Flux 是一种思想

了解的最好方式当然是看[Flux官方文档](https://facebook.github.io/flux/docs/overview.html)了。React 中文站点也能找到对应的[翻译版本](http://reactjs.cn/react/docs/flux-overview.html)，但及时性可能无法保证。

老实说，Flux 不算框架，它算是一种编程思想，抑或是一种程序设计范式(Design Pattern)，与前端组件化的编程思想 react 相辅相成。

>It's more of a pattern rather than a formal framework,

既然只是一种范式，可以看作是程序编写过程中的一种指导，具体的实现就因人而异了。

现在世面上各种牌子的 Flux 实现都有，选择的空间很大，[Which Flux implementation should I use? ](https://github.com/kriasoft/react-starter-kit/issues/22)这个 issue 里倒是列出了一些并附上了 npm 的下载量。

我们注意到 [Redux](https://github.com/reactjs/redux) 在其中是比较瞩目的一个，之一。

虽然从最近更新的 [Redux 文档](http://redux.js.org/)来看，

> Can Redux be considered a Flux implementation?
> 
> Yes, and no.
> 
> --- [Redux Doc 1.3-Prior Art](http://redux.js.org/docs/introduction/PriorArt.html)

对于它是否是 Flux 的一种实现还有争论，但了解 Flux 对于我们搞清楚时下前沿技术，保持技术人员的先进性，使用 Redux，也是有帮助的。

## Flux 与 React

React 将界面组件化，并实现了由数据驱动的层叠式更新。这过程中数据成为了程序中最为关键的一环。在传统的 MVC 模式下，React 可以看作是 View 层面的东西，而其他方面，逻辑及状态管理，则需要 React 之外的东西来接管，Flux 应运而生。

**单向数据流**，这些一核心理念可以和 React 很好地补充。当然也有另一层意思，Flux 不一定与 React 搭配才能用。用户在 React 组件上进行交互，视图将操作通过 Action 的形式由 Dispatcher 进行分发，各个Store 注册并接收，处理自己所负责的 Action，然后将更新重新反映到视图上。

整个流程下来，负责程序某一组件的 Store 只需要发送更新，而不用关心视图怎样根据状态来变更。这种做法很符合 React 的声明式编程风格（Declarative programming style）。

>**强势插入科普环节**
>
>与声明式编程相对应的是命令式编程（Imperative programming），具体来说，
>- 声明式编程是告诉计算机你想要的结果，具体过程由计算机自动完成
>- 命令式编程则是事先告诉计算机操作步骤，你期待的输出则可能会在程序执行完后出现
>
>了解更多可以参见 StackOverflow 的这个提问[Difference between declarative and imperative in React.js?](http://stackoverflow.com/questions/33655534/difference-between-declarative-and-imperative-in-react-js)

但是为什么说 React 是声明式的编程风格呢？想想用 React 编程的时候，你通过掌控流程和状态，告诉程序此刻应该是什么样子，而根据当前状态各视图要怎样切换，你无需多管，反正最终组合后的结果，就是你想要的样子。

## Flux 的组成

是时候祭出这张图了。

![来自 Flux 官方文档里的示意图](1.png)

Flux 的理念里，包含三个重要组成部分。Actions，Dispatcher 和 Stores。如果有第四个的话，我想可能是 Controller Views。

各部分的关系可从上图看出一二。用户的操作触发 Action，由统一的 Dispatcher 来分发，Store 接收到 Action 后各自进行处理，更新自己的数据和所负责的 View。

### Actions

“我其实就一普通对象”，面对我们的镜头，Action 耸了耸肩。

是的，Action 就是一个普通的 JS 对象，里面包含了这次动作所携带的新数据。约定Action 对象里包含一个唯一标识该动作的字段（一般用常量表示），这样在 Store 接收到该 Action 时可以用来判断是否需要处理该 Action。

```js 代码来自官方 TODO 示例里面TodoActions.js https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/actions/TodoActions.js#L20-L25 TodoActions.js
...
/**
 * @param  {string} text
 */
create: function(text) {
  AppDispatcher.dispatch({
    actionType: TodoConstants.TODO_CREATE,
    text: text
  });
},
...
```

可以说，Actions 连接了视图与 Dispathcer，负责发起一个动作来触发数据更新。这个动作可以是来自界面用户的操作，也可以是异步请求的返回。

Action 只是个普通对象，只有将它发送到 Dispathcer 才会发光发热。像上面代码中，创建一个 ToDo Item 的`create`方法，便是一个封装我们的 Action，将它发送到 Dispathcer 的方法。我们称之为 Action creator。而 TodoActions.js 则是集合了很多 Action creator 的对象。这个 Action 会在用户点击「添加」按钮时调用。

我们当然可以在点击事件里直接调用 Dispather 来发送 Action，但当程序庞大的时候，这样做不利于维护。View 层面不应该直接与 Dispather 打交道，它只需要完成分内的事情：响应交互，从 Store 获取数据渲染自己。而且，这样包装的另一好处是代码更加语义化，一看便知道是创建操作，将 Actoin 的创建融合在一起，也方便管理。

### Dispatcher

“你一定学过计算机原理，所以你一定知道集成总线（bus）。” 面对我们的镜头，Dispather 侃侃而谈，没有 Action 的拘谨，“对，我就是那根总线。”

一个 Flux 程序中只有唯一一个 Dispatcher。 Store 会在它上面注册回调，它将 Action 分发给所有注册过回调的 Store。它充当中央调度员的角色，管理所有的 Action 分发。

按照官方的解释，之所以 Actions 需要经过一个统一的 Dispather 进行派发，是因为大型项目下，可以方便地管理 Action 之间的依赖。实际使用中，一些操作依赖于另一个操作的完成。当我们的 Action 都经过一个地方处理后，可以很容易实现这样的依赖，Dispather 则会提供`waitFor`方法供我们使用。

#### Dispatch 中的依赖管理示例

Store 在向 Dispatcher 注册回调时，会得到一个返回值，这个值是该回调在 Dispatcher 中的索引值，能够唯一标识该回调。

```js 代码来自 Flux 官方文档
PrependedTextStore.dispatchToken = Dispatcher.register(function (payload) {
  // ...
});
```

拿到这个索引值，我们便可以在`waitFor`方法中指定需要等待的操作了。

```js 代码来自 Flux 官方文档
case 'TODO_CREATE':
  Dispatcher.waitFor([
    PrependedTextStore.dispatchToken,
    YetAnotherStore.dispatchToken
  ]);

  TodoStore.create(PrependedTextStore.getText() + ' ' + action.text);
  break;
```

上面的示例中，会在`TODO_CREATE`的操作会在`PrependedTextStore`和`YetAnotherStore`执行完成后才开始执行。

### Stores

Store 中包含了程序的状态和逻辑。可以类比 MVC 模式中的 Model。但一如官方文档所解释的那样，MVC 中的 Model 更多的是一个单独ORM对象，是对现实世界个体的抽象，比如 Person，Cat。 而 Store 则是可以看成是多种对象的组合，每个对象又只取需要的部分，它负责的是程序中一个组件中状态的管理，所以它里面的状态数据是和所负责的程序区域相关的，而并不是以 ORM 对象为单位的。

如此说来我倒觉得有点像MVVM中的 View Model。

譬如聊天框，它可能包含联系人列表中的数据，用于在输入`@`的时候进行提示，也会包含富文本对象用于插入种类媒体信息，与此同时，它本身还有一个输入值的模型。总之，这个`InputStore`里组装了所需的状态。

Store 向 Dispatcher 注册回调，这个回调接收 Action 作为入参。前面说道，Dispatcher接收到 Action 后会分发给所有注册过回调的 Store，所以在 Store 里，一般会有`switch`语句去与 Action 中的类型进行比较，以判断是否是这个 Store 关心的 Action，Store 只对自己关心的 Action 作出反应，更新状态。

Store 更新自己后，向外派发 `change` 事件，controller-views 监听change 事件，从 store 获取到新数据，然后派发给所有 View 上的子节点。

关于 Store, 另一个重要的点是：Store 接收 Action 后自己处理内部的逻辑并更新相应的状态数据，一轮更新下来后所有 Store 各自井然有序，内部的状态没有对外暴露，改变的唯一方法就是通过 Action。

状态只在各自的 store 里管理，程序各组件状态的分离，可以达到高度解耦的目的。由单向数据流来驱动，一目了然。而双向绑定及不够细化的各状态，会导致一处变动，很多地方跟着变动，而这些变化都由开发者自己维护，程序复杂后便不太好掌控全局了。

### 关于 Controller-Views

视图很好理解，如果是用 React，视图便是组件调用形成的树上面的各个绿叶，它们是用户看到的视图。而Controller-Views,
可以结合 React 的[Controlled components](https://facebook.github.io/react/docs/tutorial.html#controlled-components)来理解。虽然是两样东西，但都可以理解为绑定了数据后被数据所控制，所以叫 'controller','controlled'。

严格来说，数据驱动的情况下，谁又不是被数据所绑定和控制的呢，这里 controll-views 更强调的是作为根结点，与数据源打交道的这么一个角色，这么一层视图。它监听来自 Store 的`change`事件，然后向 Store 获取最新的数据，接下来把数据沿着组件树向下派发，通知各个组件更新。这里就完全进入 React 了，组件内部通过调用 `setSate()`或者`forceUpdate()`来重新触发`render()`方法，以达到视图重新渲染的目的。

## Flux 学习资料

Awesome 系列! Github 上的 [awesome react](https://github.com/enaqx/awesome-react) 仓库里面，[flux 部分](https://github.com/enaqx/awesome-react#flux)。

顺便说一句，如果你要找资料，哪都不用去，直接在 github 上找该技术的 awesome 系列准没错。这个系列的特点是，内容多而全，大都还免费，缺点是在纷繁的世界里需要自己去甄别好与坏，awesome 的不一定都 awesome，适合的才是对味的。

Happy coding :)

## 参考

- [Overview from Flux Official Doc](https://facebook.github.io/flux/docs/overview.html)
- [Getting To Know Flux, the React.js Architecture](https://scotch.io/tutorials/getting-to-know-flux-the-react-js-architecture)



