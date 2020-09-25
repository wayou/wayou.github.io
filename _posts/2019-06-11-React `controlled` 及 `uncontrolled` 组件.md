---
layout: post
title: "React `controlled` 及 `uncontrolled` 组件"
date: 2019-06-11 23:06:00 +0800
tags: 
---
    
# React `controlled` 及 `uncontrolled` 组件

通过 `props` 来设置其 `value` 值的组件便是一种 `controlled` 组件。典型的 form 表单中，像 

- 输入框 `<input>`
- 下拉框 `<select>`
- 多选框 `<input type="checkbox">`
- 单选框 `<input type="radio">`
- 文本框 `<textarea>`

这些，都可通过 `props` 来设置初始值，同时通过监听其身上的 `onChanges` 事件来将最新的值回传到 React 中。这样，组件的值便始终与 React 中的状态是同步的。

```js
class Form extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
    };
  }

  handleNameChange = (event) => {
    this.setState({ name: event.target.value });
  };

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.name}
          onChange={this.handleNameChange}
        />
      </div>
    );
  }
}
```

如上， `controlled` 类型的组件需要在组件中有对应的 `state` 来保存相应的值。同时需要为组件编写值更新后的监听逻辑。

对应的 `uncontrolled` 类型，便方便得多，它其实就是普通的 HTML 标签。

对于 `uncontrolled` 类型的组件，通过 ref 来获取它身上的 `value` 值。

```js
class Form extends Component {
  handleSubmitClick = () => {
    const name = this._name.value;
    // do something with `name`
  }

  render() {
    return (
      <div>
        <input type="text" ref={input => this._name = input} />
        <button onClick={this.handleSubmitClick}>Sign up</button>
      </div>
    );
  }
}
```

可以看出，`uncontorlled` 类型的组件，其值是存储在 DOM 节点上的，在需要的时候，比如表单提交时，再通过 ref 获取到相应的 DOM 节点取出它的值。

对比之下，`controlled` 类型的组件是时实地将最新的值推送（push）到 React 中，而 `uncontrolled` 类型的组件是在需要的时候去拉取（pull）它身上的值。


## 对比与取舍

虽然 `ref` 在官方文档中是不推荐的，也不代表说 `uncontrolled` 类型的组件就不能使用；虽然 `controlled` 类型的组件这种，数据走 state 更新和维护的方式，更加 React 一点，也不是说在编写表单时就需要全部使用 `controlled` 类型的组件。两者在不同情况下可以自由取舍，完全看需要。

`controlled` 类型的组件虽然写起来会比较麻烦，其值与 React state 始终同步，所以有一些优点，

- 很方便地对用户输入的值进行校验，然后展示相应的错误信息。
- 可以时实地格式化用的输入，对于特定类型的值比如信用卡，手机等。
- 根据用户的填写情况时实将表单的提交按钮禁用或启用。

所以如果需要上述这些东西，可以考虑 `controlled` 类型来编写组件，而 `uncontrolled` 类型代码上写起来很简洁点，少了 state 及事件绑定，可用在功能简单，或者 React 快速上手，快速实现功能的场景。



## 相关资源

- [Forms](https://reactjs.org/docs/forms.html)
- [Uncontrolled Components](https://reactjs.org/docs/uncontrolled-components.html)
- [Controlled and uncontrolled form inputs in React don't have to be complicated](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)
    