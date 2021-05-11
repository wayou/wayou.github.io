---
layout: post
title: "JavaScript 中正则匹配时结果不一致的问题"
date: 2021-05-11T08:14:38Z
---
# JavaScript 中正则匹配时 lastIndex 的问题

## 创建示例项目

考察如下场景，我们有个输入框组件，输入时同时进行校验。

```tsx
interface IInputProps {
  label: string;
}

function Input({ label }: IInputProps) {
  const [err, setErr] = useState<string | undefined>();

  return (
    <section>
      {label}：
      <input
        type="text"
        onChange={(event) => {
          setErr(rulePassword(event.currentTarget.value));
        }}
      />
      <p>validate result:{err}</p>
    </section>
  );
}
```

进行校验的逻辑使用了正则来测试：

```ts
const passwrodReg = new RegExp(
  // eslint-disable-next-line no-useless-escape
  /(?!^(\d+|[a-zA-Z]+|[_\+\-=!@#\$%\^\*\(\)]+)$)^[\w_\+\-=!@#\$%\^\*\(\)]{8,64}$/,
  "gm"
);

export const rulePassword = (value: string) => {
  const result = passwrodReg.test(value);
  console.log(`input:${value} result:${result}`);
  return result ? "✅" : "❌";
};
```

通常，如果是密码输入框，很自然地我们会放置两个这样的输入框以让用户确保密码的一致性：

```tsx
function App() {
  return (
    <div className="App">
      <Input label="密码" />
      <Input label="确认密码" />
    </div>
  );
}
```

## 对于相同的输入正则测试结果出现偏差

到此，示例写完了，运行后发现个诡谲的问题，如下图 GIF 中所展示：


![validate resut](https://user-images.githubusercontent.com/3783096/117782046-da657f00-b273-11eb-958e-0db5e4855a9c.gif)
￼

- 当我们在第一个输入框输入合法值时，显示校验结果为通过，这符合预期
- 当我们在第二个输入框输入相同的合法值时，居然显示校验未通过
- 进一步，当删除后再次输入时，又展示校验通过

同时，从控制台打印的日志也可重现上面的现象：

```
input:test123123 result:true
input:test123123 result:false
input: result:false
input:test123123 result:true
```

即，对于同样的输入 `test123123`，正则测试的结果居然会有偏差。


## 修正

当我们对校验部分的逻辑做如下变更后这个问题得以解决。

```diff
- const passwrodReg = new RegExp(
-   // eslint-disable-next-line no-useless-escape
-   /(?!^(\d+|[a-zA-Z]+|[_\+\-=!@#\$%\^\*\(\)]+)$)^[\w_\+\-=!@#\$%\^\*\(\)]{8,64}$/,
-   "gm"
- );

export const rulePassword = (value: string) => {
+  const passwrodReg = new RegExp(
+    // eslint-disable-next-line no-useless-escape
+    /(?!^(\d+|[a-zA-Z]+|[_\+\-=!@#\$%\^\*\(\)]+)$)^[\w_\+\-=!@#\$%\^\*\(\)]{8,64}$/,
+    "gm"
+  );
  const result = passwrodReg.test(value);
  console.log(`input:${value} result:${result}`);
  return result ? "✅" : "❌";
};
```

￼
![validate resut](https://user-images.githubusercontent.com/3783096/117782090-e2252380-b273-11eb-9b81-21f2ee0266bc.gif)


所以，一定是 `RegExp` 缓存了什么东西，上一次的匹配结果影响了下一次。

## 原因

通过查看 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test#using_test_on_a_regex_with_the_global_flag)发现，`RegExp` 通过 `test()` 匹配成功时，会记录当前的位置信息然后存储到 `RegExp` 的 [`lastIndex`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex)，每成功匹配一次则更新一次该字段。

并且，

> Note: As long as test() returns true, lastIndex will not reset—even when testing a different string!

当配合 `g` 进行全局匹配时，`lastIndex` 是不会重置的，即使是在匹配一个全新的字符串时。

这就解释了为什么对于相同的输入，第一次匹配成功后，后面则失败了。

而当我们每次匹配都重新调用 `RegExp` 构造器生成正则时，就不会有这个问题了。

还有种解决方式是去掉 `g` 标识，每次匹配也不会复用之前的 `lastIndex`。


## 相关资源

- [Javascript Regex test same string but got different result [duplicate]](https://stackoverflow.com/questions/58022525/javascript-regex-test-same-string-but-got-different-result)
- [MDN - Using test() on a regex with the "global" flag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test#using_test_on_a_regex_with_the_global_flag)

