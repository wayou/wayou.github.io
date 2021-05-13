---
layout: post
title: "React17 使用 JSX 的情况下无须再显式导入 React"
date: 2021-05-13T12:24:21Z
---
# React17 使用 JSX 的情况下无须再显式导入 React


React 17 引入了新的 JSX 编译方式，无须在组件中显式地 import React。注意需要配合 TypeScript 4.1+ 版本。

亦即，使用 React 17+ 的项目中 TypeScript 会有如下对应的提示：

```
'React' is declared but its value is never read.ts(6133)
```


<img width="945" alt="Screen Shot 2021-05-12 at 7 46 34 PM" src="https://user-images.githubusercontent.com/3783096/118067539-5c1fee80-b3d3-11eb-9351-e99128bac7ce.png">
￼


但移除 React 的导入后，又会报如下的 ESLint 错误：

￼
<img width="909" alt="Screen Shot 2021-05-12 at 9 38 27 PM" src="https://user-images.githubusercontent.com/3783096/118067551-60e4a280-b3d3-11eb-9d58-ab204ea137ff.png">


根据 [React 文档](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint) 的描述，可关闭对应的 ESLint 规则，因为是不必要的了。


```
{
  // ...
  "rules": {
    // ...
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```


## 相关资源

- [Introducing the New JSX Transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint)

