---
layout: post
title: "React + TypeScript 实现泛型组件"
date: 2019-09-29 10:09:00 +0800
tags: 
---
    
# React + TypeScript 实现泛型组件

## 泛型类型

TypeScript 中，类型（interface, type）是可以声明成泛型的，这很常见。

```ts
interface Props<T> {
  content: T;
}
```

这表明 `Props` 接口定义了这么一种类型：

- 它是包含一个 `content` 字段的对象
- 该 `content` 字段的类型由使用时的泛型 `T` 决定

```ts
type StringProps = Props<string>;

let props: StringProps;

props = {
  // 🚨 Type 'number' is not assignable to type 'string'.ts(2322)
  content: 42
};

props = {
  // ✅
  content: "hello"
};
```

或者，TypeScript 能够跟使用时候提供的值自动推断出类型 `T`，无需显式指定：

```ts
interface Props<T> {
  content: T;
}

function Foo<T>(props: Props<T>) {
  console.log(props);
}

/** 此时 Foo 的完整签名为： function Foo<number>(props: Props<number>): void */
Foo({ content: 42 });

/** 此时 Foo 的完整签名为： function Foo<string>(props: Props<string>): void */
Foo({ content: "hello" });
```

上面因为 `Foo` 函数接收 `Props<T>` 作为入参，意味着我们在调用 `Foo` 的时候需要传递类型 `T` 以确定 `Props<T>`，所以 `Foo` 函数也变成了泛型。

当调用 `Foo({ content: 42 })` 的时候，TypeScript 自动解析出 `T` 为 `number`，此时对应的函数签名为：

```ts
function Foo<number>(props: Props<number>): void;
```

而我们并没有显式地指定其中的类型 `T`，像这样 `Foo<number>({ content: 42 });`。

## 泛型组件

将上面的 `Foo` 函数返回 JSX 元素，就成了一个 React 组件。因为它是泛型函数，它所形成的组件也就成了 **泛型组件/Generic Components**。

```tsx
function Foo<T>(props: Props<T>) {
  return <div> {props.content}</div>;
}

const App = () => {
  return (
    <div className="App">
      <Foo content={42}></Foo>
      <Foo<string> content={"hello"}></Foo>
    </div>
  );
};
```

一如上面的讨论，因为 TypeScript 可根据传入的实际值解析泛型类型，所以 `<Foo<string> content={"hello"}></Foo>` 中 `string` 是可选的，这里只为展示，让你看到其实 React 组件还可以这么玩。

为了进一步理解泛型组件，再看下非泛型情况下上面的组件是长怎样的。

```tsx
interface Props {
  content: string;
}

function Foo(props: Props) {
  return <div>{props.content}</div>;
}

const App = () => {
  return (
    <div className="App">
      {/* 🚨 Type 'number' is not assignable to type 'string'.ts(2322) */}
      <Foo content={42}></Foo>
      <Foo content={"hello"}></Foo>
    </div>
  );
};
```

以上，便是一个 React 组件常规的写法。它定义的入参 `Props` 只接收 `string` 类型。由此也看出泛型的优势，即大部分代码可复用的情况下，将参数变成泛型后，不同类型的入参可复用同一组件，不用为新类型新写一个组件。

除了函数组件，对于类类型的组件来说，也是一样可泛型化的。

```tsx
interface Props<T> {
  content: T;
}

class Bar<T> extends React.Component<Props<T>> {
  render() {
    return <div>{this.props.content}</div>;
  }
}

const App = () => {
  return (
    <div className="App">
      <Bar content={42}></Bar>
      <Bar<string> content={"hello"}></Bar>
    </div>
  );
};
```

## 一个更加真实的示例

一个更加实用的示例是列表组件。列表中的分页加载，滚动刷新逻辑等，对于所有列表数据都是通用的，将这个列表组件书写成泛型便可和任意类型列表数据结合，而无须通过其他方式来达到复用的目的，将列表元素声明成 `any` 或 `Record<string,any>` 等类型。

先看不使用泛型情况下，如何实现这么一个列表组件。此处只看列表元素的展示以阐述泛型的作用，其他逻辑比如数据加载等先忽略。

_列表组件 List.tsx_
```tsx
interface Item {
  [prop: string]: any;
}

interface Props {
  list: Item[];
  children: (item: Item, index: number) => React.ReactNode;
}

function List({ list, children }: Props) {
  // 列表中其他逻辑...
  return <div>{list.map(children)}</div>;
}
```

上面，为了尽可能满足大部分数据类型，将列表的元素类型定义成了 `[prop: string]: any;` 的形式，其实和 `Record<string,any>` 没差。在这里已经可以看到类型的丢失了，因为出现了 `any`，而我们使用 TypeScript 的首要准则是尽量避免 `any`。


然后是使用上面所定义的列表组件：

```tsx
interface User {
  id: number;
  name: string;
}
const data: User[] = [
  {
    id: 1,
    name: "wayou"
  },
  {
    id: 1,
    name: "niuwayong"
  }
];

const App = () => {
  return (
    <div className="App">
      <List list={data}>
        {item => {
          // 😭 此处 `item.name` 类型为 `any`
          return <div key={item.name}>{item.name}</div>;
        }}
      </List>
    </div>
  );
};
```

这里使用时，`item.name` 的类型已经成了 `any`。对于简单数据来说，还可以接收这样类型的丢失，但对于复杂类型，类型的丢失就完全享受不到 TypeScript 所带来的类型便利了。

上面的实现还有个问题是它规定了列表元素必需是对象，理所应当地就不能处理元始类型数组了，比如无法渲染 `['wayou','niuwayong']` 这样的输入。

下面使用泛型改造上面的列表组件，让它支持外部传入类型。

```tsx
interface Props<T> {
  list: T[];
  children: (item: T, index: number) => React.ReactNode;
}

function List<T>({ list, children }: Props<T>) {
  // 列表中其他逻辑...
  return <div>{list.map(children)}</div>;
}
```

改造后，列表元素的类型完全由使用的地方决定，作为列表组件，内部它无须关心，同时对于外部传递的 `children` 回调中 `item` 入参，类型也没有丢失。

使用改造后的泛型列表：

```tsx
interface User {
  id: number;
  name: string;
}
const data: User[] = [
  {
    id: 1,
    name: "wayou"
  },
  {
    id: 1,
    name: "niuwayong"
  }
];

const App = () => {
  return (
    <div className="App">
      <List list={data}>
        {item => {
          // 😁 此处 `item` 类型为 `User`
          return <div key={item.name}>{item.name}</div>;
        }}
      </List>
      <List list={["wayou", "niuwayong"]}>
        {item => {
          // 😁 此处 `item` 类型为 `string`
          return <div key={item}>{item}</div>;
        }}
      </List>
    </div>
  );
};
```





    