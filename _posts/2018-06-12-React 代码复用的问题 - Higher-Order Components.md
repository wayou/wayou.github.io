---
layout: post
title: "React 代码复用的问题 - Higher-Order Components"
date: 2018-06-12 23:06:00 +0800
tags: 
---
    
React 代码复用的问题 - Higher-Order Components
===


代码复用，我们很容易想到组件。组件确实也是 React 中最主要的复用单元。大部分情况下是满足需求的，但有一些例外的情况。

### 问题/The problem
假如我们有个展示图表数据的 `Dashboard` 组件。它会做权限检查，只有登录后才能看到；它还会在组件初始化之后发请求获取数据。

_Dashboard.jsx_
```js
import React, { Component } from "react";
import isAuthenticated from "./auth";
import Login from "./Login";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  componentDidMount() {
    fetch("api/to/fetch/dashbaord/data")
      .then(res => res.json())
      .then(data => this.setState({ data }));
  }
  render() {
    return isAuthenticated ? (
      <div className="dashboard">
        <h1>dashbaord</h1>
        <table>
          {this.state.data.map(row => {
            return (
              <tr>
                <td>{row.name}</td>
              </tr>
            );
          })}
        </table>
      </div>
    ) : (
      <Login />
    );
  }
}
export default Dashboard;
```

然后有个展示用户列表的 `UserList` 组件，逻辑差不多，也需要验证是否登录，同时请求用户列表数据。

_UserList.jsx_
```js
import React, { Component } from "react";
import isAuthenticated from "./auth";
import Login from "./Login";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  componentDidMount() {
    fetch("api/to/fetch/userlist/data")
      .then(res => res.json())
      .then(data => this.setState({ data }));
  }
  render() {
    return isAuthenticated ? (
      <div className=“user-list”>
        <h1>user list</h1>
	{this.props.data.map(user => <p>{user.name}</p>)}
      </div>
    ) : (
      <Login />
    );
  }
}

export default UserList;
```

这两个页面，除了数据来源和对数据的展示方式不同外，在代码上有很大冗余。意味着可以进一步优化，将公共部分抽取出来。

但这里的情形不同于抽取公共组件。抽取成组件的部分一定是独立可拆分的，比如一个列表，其中的每个列表项和列表项中的头像，都可以抽取专门的组件而独立出去，外部只需要传递数据。这里的情形是需要把一些逻辑抽离出来，比如数据请求，比如登录的判断，而这些还没有具备一个完整组件形态，功能上有点像服务（services）。

这个时候，[高阶组件 Higher-Order Components](https://reactjs.org/docs/higher-order-components.html) 就派得上用场了。


###  高阶组件/Higher-Order Components

先看其官方的精简定义：

> a higher-order component is a function that takes a component and returns a new component.

名称上叫 `component`，实质上是一个方法。本质上 react 组件就是一个个创建 dom 的方法，如果这样想的话，也解释得通。后面将 Higher-Order Components 简称为 HOC。HOC 将一个组件进行包装后返回一个新的组件。在这包装的过程中，可以加入任意的新功能。

不同于 Mixin 的覆盖做法，好多时候并不清楚哪些方法可以安全无副作用地被覆盖；也不像面向对象中单一的继承方式，在需要组合多个基类时显得捉襟见肘。

HOC 并不改变原组件，而是在组件之上包装一层组件，所有可公用的逻辑都放在这里，只通过属性与原来的组件通信。同时，包装后的组件会将原组件需要的属性透传，就像是在使用未包装过的原组件一样丝般顺滑。

以上述页面为例，我们可以定义一个 `loadDataAndCheckAuth` 方法来完成公共逻辑的抽象。

_loadDataAndCheckAuth.js_
```js
import React, { Component } from "react";
import isAuthenticated from "./auth";
import Login from "./Login";

// 它是一个方法，入参为一个 组件
const loadDataAndCheckAuth = WrappedComponent => {
  // 它返回的也是组件
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: []
      };
    }
    componentDidMount() {
      fetch(this.props.api)
        .then(res => res.json())
        .then(data => this.setState({ data }));
    }
    render() {
      return isAuthenticated ? (
        <WrappedComponent {...this.props} data={this.state.data} />
      ) : (
        <Login />
      );
    }
  };
};
export default loadDataAndCheckAuth;
```

然后修改原来的组件，将抽取出去的这些逻辑从原组件中去掉。数据获取的部分移除，增加 `data` 属性以接收外部传递的数据源；去掉登录的判断逻辑。

_Dashboard.jsx_
```js
import React, { Component } from "react";

class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard">
        <h1>dashbaord</h1>
        <table>
          {this.props.data.map(row => {
            return (
              <tr>
                <td>{row.name}</td>
              </tr>
            );
          })}
        </table>
      </div>
    );
  }
}

export default Dashboard;
```

_UserList.jsx_
```js
import React, { Component } from "react";

class UserList extends Component {
  render() {
    return (
      <div className="user-list">
        <h1>user list</h1>
        {this.props.data.map(user => <p>{user.name}</p>)}
      </div>
    );
  }
}

export default UserList;
```

精简之后的组件回到了它本该有的样子，只负责展示而不关心数据来源及是否该展示，做到了职责单一，易于维护。

最后是 HOC 的使用。

_App.jsx_
```js
import React, { Component } from "react";
import Dashboard from "./Dashboard";
import loadDataAndCheckAuth from "./loadDataAndCheckAuth";

const WrappedDashBoard = loadDataAndCheckAuth(Dashboard);

class App extends Component {
  render() {
    return (
      <div className="app">
        <WrappedDashBoard
          api={“api/to/fetch/dashboard/data”}
        />
      </div>
    );
  }
}

export default App;
```
`UserList` 组件的使用雷同。

### HOC 的组合/HOC Composition

从名字上来看， `loadDataAndCheckAuth` 很明显地体现出他干了两件事情，加载数据和判断权限。从职责单一的层面来说，完全可以抽成两个 HOC：`withData` 和 `withAuth`。这样拆分后，灵活性变大了，即有些组件可能并不需要加载数据，只需要检查权限，这样就可以只运用 `withAuth` 。

_withData.js_
```js
import React, { Component } from "react";

const withData = WrappedComponent => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: []
      };
    }
    componentDidMount() {
      fetch(this.props.api)
        .then(res => res.json())
        .then(data => this.setState({ data }));
    }
    render() {
      return <WrappedComponent {...this.props} data={this.state.data} />;
    }
  };
};
export default withData;
```

_withAuth.js_
```js
import React, { Component } from "react";
import isAuthenticated from "./auth";
import Login from "./Login";

const withAuth = WrappedComponent => {
  return class extends Component {
    render() {
      if (isAuthenticated) {
        return <WrappedComponent {...this.props} />;
      } else {
        return <Login />;
      }
    }
  };
};
export default withAuth;
```

回过头来看，因为 HOC 是这样的方法，它接收一个组件，返回的还是组件，所以完美地符合链式调用的条件。

于是，我们通过组合调用上面两个 HOC 便可得到既能加载数据，又能验证权限的新组件。

_App.jsx_
```js
import React, { Component } from "react";
import Dashboard from "./Dashboard";
import withAuth from "./withAuth";
import withData from "./withData";

const WrappedDashboard = withData(withAuth(Dashboard));

class App extends Component {
  render() {
    return (
      <div className="app">
        <WrappedDashboard
          api={"api/to/fetch/dashboard/data"}
        />
      </div>
    );
  }
}

export default App;
```

于是，如果还有一些打日志的需求，AB test 的需求...都可以通过 HOC 在组件外部进行扩展，而我们原来的组件无需任何变更。并且如果需求有变，哪天不需要 AB test 了，只需要将该 HOC 去掉即可，也不用去原组件删代码，非常地灵活与健壮。

```js
const WrappedDashboard = abTest(withLog(withData(withAuth(Dashboard))));
```

看着上面的嵌套形式，是不是和另一个东西很像？


```js
middlewareA(middlewareB(middlewareC(store.dispatch)))(action);
```

对，Redux，它便是最经典的 HOC。

### 示例代码

示例代码可前往[这里](https://github.com/wayou/wayou.github.io/blob/master/posts/react-hoc/src/README.md)查看。


### 相关资源/References

- [Higher-Order Components](https://reactjs.org/docs/higher-order-components.html)
- [TypeScript spec 3.5 Intersection Types](https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#35-intersection-types)
- [Mixins Considered Harmful](https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html)
- [Higher Order Components in React](https://www.sitepen.com/blog/2017/08/15/higher-order-components-in-react/)

    