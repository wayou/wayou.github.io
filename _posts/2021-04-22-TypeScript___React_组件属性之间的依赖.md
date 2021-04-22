---
layout: post
title: "TypeScript + React 组件属性之间的依赖"
date: 2021-04-22T11:55:34Z
---
# TypeScript + React 组件属性之间的依赖

考察如下场景：

- 一个自定义的下拉选择框有个 `type` 属性包含两种可能的值 `"native" | "simulate"`
- 当 `type` 为 `simulate` 时还希望传递一个 `appearence`控制其样式
- 当 `type` 为 `native` 时则不希望传递 `appearence` 属性

即 `appearence` 属性是否通过 TypeScript 的类型检查依赖于 `type` 的值，请问组件的属性类型如何定义。


一开始会以为这里需要借助泛型等手段来构造一个复杂类型，其实大可不必。因为后来一想不防用 [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) 试试，实践后证实，事情其实没想的那么复杂。

类型定义：

```ts
type SelectProps =
  | {
      type: "native";
    }
  | {
      type: "simulate";
      appearance: "default" | "link" | "button";
    };
```

使用：

```tsx

function CustomSelect(props: SelectProps) {
  return <div>...</div>;
}

function App() {
  return (
    <>
    {/* ✅ */}
      <CustomSelect type="native" />
      {/* ❌ Type '{ type: "native"; appearance: string; }' is not assignable to type 'IntrinsicAttributes & SelectProps'.
  Property 'appearance' does not exist on type 'IntrinsicAttributes & { type: "native"; }'. */}
      <CustomSelect type="native" appearance="button" />
      {/* ❌ Type '{ type: "simulate"; }' is not assignable to type 'IntrinsicAttributes & SelectProps'.
  Property 'appearance' is missing in type '{ type: "simulate"; }' but required in type '{ type: "simulate"; appearance: "default" | "link" | "button"; }'. */}
      <CustomSelect type="simulate" />
    {/* ✅ */}
      <CustomSelect type="simulate" appearance="button" />
    </>
  );
}
```

