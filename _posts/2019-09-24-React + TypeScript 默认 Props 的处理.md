---
layout: post
title: "React + TypeScript 默认 Props 的处理"
date: 2019-09-24 23:09:00 +0800
tags: 
---
    
# React + TypeScript 默认 Props 的处理

## React 中的默认 Props

通过组件的 `defaultProps` 属性可为其 `Props` 指定默认值。

以下示例来自 [React 官方文档 - Default Prop Values](https://reactjs.org/docs/typechecking-with-proptypes.html#default-prop-values)：

```js
class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

// Specifies the default values for props:
Greeting.defaultProps = {
  name: 'Stranger'
};

// Renders "Hello, Stranger":
ReactDOM.render(
  <Greeting />,
  document.getElementById('example')
);
```

如果编译过程使用了 Babel 的 [transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/) 插件，还可以这么写：

```js
class Greeting extends React.Component {
  static defaultProps = {
    name: 'stranger'
  }

  render() {
    return (
      <div>Hello, {this.props.name}</div>
    )
  }
}
```

## 加入 TypeScript

加入 TypeScript 后

```tsx
interface Props {
  name?: string;
}

class Greeting extends React.Component<Props, {}> {
  static defaultProps = {
    name: "stranger",
  };

  render() {
    return <div>Hello, {this.props.name}</div>;
  }
}
```

此时不支持直接通过类访问 `defaultProps` 来赋值以设置默认属性，因为 `React.Component` 类型上并没有该属性。

```ts
// 🚨Property 'defualtProps' does not exist on type 'typeof Greeting'.ts(2339)
Greeting.defualtProps = {
  name: "stranger",
};
```

### 默认属性的类型

上面虽然实现了通过 `defaultProps` 来指定属性的默认值，但 `defaultProps` 的类型是不受约束的，和 `Props` 没有关联上。以至于我们可以在 `defaultProps` 里面放任何值，显然这是不科学的。

```diff
class Greeting extends React.Component<Props, {}> {
  static defaultProps = {
    name: "stranger",
    // 并不会报错
+    foo: 1,
+    bar: {},
  };
 // ...
}
```

同时对于同一字段，我们不得不书写两次代码。一次是定义组件的 `Props`，另一次是在 `defaultProps` 里。如果属性有增删或名称有变更，两个地方都需要改。

为了后面演示方便，现在给组件新增一个必填属性 `age:number`。

```ts
interface Props {
  age: number;
  name?: string;
}

class Greeting extends React.Component<Props, {}> {
  static defaultProps = {
    name: "stranger",
  };

  render() {
    const { name, age } = this.props;
    return (
      <div>
        Hello, {name}, my age is {age}
      </div>
    );
  }
}
```

通过可选属性抽取出来，利用 `typeof` 获取其类型和必传属性结合来形成组件的 `Props` 可解决上面提到的两个问题。

所以优化后的代码成了：

```tsx
const defaultProps = {
  name: "stranger",
};

type Props = {
  age: number;
} & Partial<typeof defaultProps>;

class Greeting extends React.Component<Props, {}> {
  static defaultProps = defaultProps;

  render() {
    const { name, age } = this.props;
    return (
      <div>
        Hello, {name}, my age is {age}
      </div>
    );
  }
}
```

注意我们的 `Props` 是通过和 `typeof defaultProps` 组合而形成的，可选属性中的 `name` 字段在整个代码中只书写了一次。

当我们更新了 `defaultProps` 时整个组件的 `Props` 也同步更新，所以 `defaultProps` 中的字段一定是组件所需要的字段。


## 默认值的判空检查优化

讲道理，如果属性提供了默认值，在使用时，可不再需要判空，因为其一定是有值的。但 TypeScript 在编译时并不知道，因为有默认值的属性是被定义成可选的 `?`。

比如我们尝试访问 `name` 属性的长度，

```tsx
class Greeting extends React.Component<Props, {}> {
  static defaultProps = defaultProps;

  render() {
    const { name } = this.props;
    return (
      <div>
        {/* 🚨Object is possibly 'undefined'.ts(2532) */}
        name length is {name.length}
      </div>
    );
  }
}
```

因为此时我们的 `Props` 实际上是：

```ts
type Props = {
  age: number;
} & Partial<typeof defaultProps>;
// 相当于：
type Props = {
  age: number;
  name?: string;
};
```

修正方法有多个，最简单的是使用[非空判定符/Non-null assertion operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator)。

### 非空判定符

```diff
- name length is {name.length}
+ name length is {name!.length}
```

这意味着每一处使用的地方都需要做类似的操作，当程序复杂起来时不太可控。但多数情况下应付日常使用，这样已经够了。

### 类型转换

因为组件内部有默认值的保证，所以字段不可能为空，因此，可对组件内部使用非空的属性类型来定义组件，而对外仍暴露原来的版本。

```diff
const Greeting = class extends React.Component<
-  Props,
+  Props & typeof defaultProps,
  {}
> {
  static defaultProps = defaultProps;

  render() {
    const { name } = this.props;
    return (
      <div>
-        name length is {name!.length}
+        name length is {name.length}
      </div>
    );
  }
-};
+} as React.ComponentClass<Props>;
```

通过 `as React.ComponentClass<Props>` 的类型转换，对外使用 `Greeting` 时属性中 `name` 还是可选的，但组件内部实际使用的是 `Props & typeof defaultProps`，而不是 `Partial<T>` 版本的，所以规避了字段可能为空的报错。

### 通过高阶组件的方式封装默认属性的处理

通过定义一个高阶组件比如 `withDefaultProps` 将需要默认属性的组件包裹，将默认值的处理放到高阶组件中，同样可解决上述问题。

```tsx
function withDefaultProps<P extends object, DP extends Partial<P>>(
  dp: DP,
  component: React.ComponentType<P>,
) {
  component.defaultProps = dp;
  type RequiredProps = Omit<P, keyof DP>;
  return (component as React.ComponentType<any>) as React.ComponentType<
    RequiredProps & DP
  >;
}
```

然后我们的组件则可以这样来写：

```tsx
const defaultProps = {
  name: "stranger",
};

interface Props {
  name: string;
  age: number;
}

const _Greeting = class extends React.Component<Props, {}> {
  public render() {
    const { name } = this.props;
    return <div>name length is {name.length}</div>;
  }
};

export const Greeting = withDefaultProps(defaultProps, _Greeting);
```

这种方式就比较通用一些，将 `withDefaultProps` 抽取成一个公共组件，后续其他组件都可使用。但此种情况下就没有很好地利用已经定义好的默认值 `defaultProps` 中的字段，书写 `Props` 时还需要重复写一遍字段名。


## 相关资源

- [React docs - Default Prop Values](https://reactjs.org/docs/typechecking-with-proptypes.html#default-prop-values)
- [Default property value in React component using TypeScript](https://stackoverflow.com/questions/37282159/default-property-value-in-react-component-using-typescript/37282264#37282264)
- [React, TypeScript and defaultProps dilemma](https://medium.com/@martin_hotell/react-typescript-and-defaultprops-dilemma-ca7f81c661c7)


    