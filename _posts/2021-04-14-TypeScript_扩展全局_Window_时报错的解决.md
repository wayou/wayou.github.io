---
layout: post
title: "TypeScript 扩展全局 Window 时报错的解决"
date: 2021-04-14T04:06:21Z
---
# TypeScript 扩展全局 Window 时报错的解决


使用全局 `window` 上自定义的变更进，TypeScript 会报属性不存在，

```ts
console.log(window.foo) // ❌ Property ‘foo’ does not exist on type 'Window & typeof globalThis'.ts(2339)
```

需要将自定义变量扩展到全局 `window` 上，可通过在项目中添加类型文件或正常的 `.ts` 文件，只要在 `tsconfig.json` 配置范围内能找到即可。

_types.d.ts_

```ts
declare global {
  interface Window {
   	foo: string;
  }
}
```

此时再使用就正常了，

```ts
console.log(window.foo) // ✅
```

如果在进行类型扩展时报如下错误：

```
Augmentations for the global scope can only be directly nested in external modules or ambient module declarations.ts(2669)
```

可在类型文件中添加如下内容以指定文件为模板，报错消除。

```diff
+ export {};

declare global {
  interface Window {
    foo: string;
  }
}
```


## 相关资源

- [TypeScript error: Property 'X' does not exist on type 'Window'](https://stackoverflow.com/a/56458070/1553656)
- [Augmentations for the global scope can only be directly nested in external modules or ambient module declarations(2669)](https://stackoverflow.com/questions/57132428/augmentations-for-the-global-scope-can-only-be-directly-nested-in-external-modul)


