---
layout: post
title: "配置 ESLint 自动格式化自闭合标签（Self closing tag）"
date: 2020-09-17T15:04:14Z
---
# 配置 ESLint 自动格式化自闭合标签（Self closing tag）

对于没有子元素或不需要子元素的 HTML 标签，通常写成其自闭合的形式会显得简洁些，

```diff
- <SomeComponent></SomeComponent>
+ <SomeComponent/>
```

通过配置 ESLint 可在格式化的时候将标签自动变成自闭合形式。

## `create-react-app`

如果是使用 `create-react-app` 创建的项目，直接在 package.json 的 eslint 配置部分加上如下配置即可：

```diff
  "eslintConfig": {
    "extends": "react-app",
+   "rules": {
+     "react/self-closing-comp": [
+       "error"
+     ]
    }
```

## 安装依赖

安装 ESLint 相关依赖：

```sh
$ yarn add -D eslint eslint-plugin-react
```

如果是 TypeScript 项目，还需要安装如下插件：

```sh
$ yarn add -D @typescript-eslint/eslint-plugin  @typescript-eslint/parser
```

## 配置 ESLint

通过 `yarn eslint --init` 向导来完成创建，

或手动创建 `.eslintrc.json` 填入如下配置：

```json
{
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["react", "@typescript-eslint"],
  "rules": {
    "react/self-closing-comp": ["error"]
  }
}
```

## 安装 ESLint for Vscode

当然了，还需要安装 VSCode 插件 [dbaeumer.vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)。

然后配置 VSCode 在保存时自动进行修正动作：

```json
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
```

## 使用

完成上述配置后，如果发现保存时，格式并未生效，或者只 JavaScript 文件生效，需要补上如下的 VSCode 配置：

```
"eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
  ]
```

也可查看 VSCode 的状态栏，看是否有报错可确定是什么原因导致 ESLint 工作不正常，比如 mac BigSur 中细化了权限，需要点击警告图标然后点击允许。

![image](https://user-images.githubusercontent.com/3783096/96586624-d2fc7980-1313-11eb-9039-fc441277ca78.png)


## 相关资源

- [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)
- [ESLint in VSC not working for .ts and .tsx files](https://stackoverflow.com/a/56558518/1553656)

