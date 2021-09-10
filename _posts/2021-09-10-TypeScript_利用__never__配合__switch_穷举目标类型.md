---
layout: post
title: "TypeScript 利用 `never` 配合 `switch`穷举目标类型"
date: 2021-09-10T14:42:01Z
---
# TypeScript 利用 `never` 配合 `switch`穷举目标类型

`never` 类型可赋值给任意类型，反之不然，除非是 `never` 本身。复用该特性可对类型进行收窄（narrowing）操作。常见的使用场景是和 `switch` 语句搭配，达到保证 switch 穷举了目标所有可能值的目的。这个被 switch 的目标可以是 union 联合类型，也可以是 enum 枚举类型等。

考察如下示例代码，其中 `Shape` 类型包含一个形状种类的字段，该字段为一个枚举可包含多个可能的值：

```tsx
enum ShapeKind {
  Circle,
  Square,
}

interface Shape {
  kind: ShapeKind;
  radius?: number;
  sideLength?: number;
}
```

那么在计算对象面积时，需要根据不同类型来决定如何计算：

```tsx
function getArea(shape: Shape) {
  switch (shape.kind) {
    case ShapeKind.Circle:
      return Math.PI * shape.radius ** 2;
    case ShapeKind.Square:
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape.kind; // (property) Shape.kind: never
      return _exhaustiveCheck;
  }
}
```

通过前面 `switch` 语句，每条 `case` 都会将类型收窄，最后到 `default` 时 `kind` 就是 `never` 类型了。我们将它赋值给一个 `never` 类型的变量 `_exhaustiveCheck`备用。

此时如果前面 `case` 少写了，或者后续有人将枚举进行扩充，添加了新的类型，

```diff
enum ShapeKind {
  Circle,
  Square,
+ Triangle,
}
```

此时 `default` 处 `kind` 就不是 `never` 类型了。由于文章开头提到的原因，任意类型（除了 `never` 自身）无法赋值给 `never` 类型，所以此处会报错：

```tsx
const _exhaustiveCheck: never = shape.kind; // ❌ Type 'ShapeKind' is not assignable to type 'never'.ts(2322)
```

从而达到了保护作用，提示我们把新增的类型在 `switch` 语句中补上。

## 相关资源

- [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
