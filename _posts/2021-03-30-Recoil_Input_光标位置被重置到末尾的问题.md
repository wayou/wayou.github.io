---
layout: post
title: "Recoil Input 光标位置被重置到末尾的问题"
date: 2021-03-30T05:58:36Z
---
# Recoil Input 光标位置被重置到末尾的问题

考察如下代码，页面中有个输入框，通过 Recoil Atom 来存储输入的值。

_App.tsx_
```tsx
function NameInput() {
  const [name, setName] = useRecoilState(nameState);
  return (
    <>
      <input
        type="text"
        value={name}
        onChange={(event: React.FormEvent<HTMLInputElement>) => {
          setName(event.currentTarget.value);
        }}
      />
      <p>{name}</p>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <NameInput />
    </div>
  );
}
```

实际运行效果是，输入一定信息后，将光标移动到其他位置再输入，发现光标会被重置到已经输入内容的最后。


![Screen Recording 2021-03-29 at 7 09 38 PM mov](https://user-images.githubusercontent.com/3783096/112829775-2f827280-90c4-11eb-894a-5a0607dd843d.gif)

<p align=“center”>Recoil 输入框中光标位置被重置到了内容末尾</p>

相关 issue 参见 [Setter in selector forces the input cursor to jump to end of input field on change event #488](https://github.com/facebookexperimental/Recoil/issues/488)

实践中发现，该问题在 Recoil 搭配 React 16.8 才会有问题，而更新 React 后问题不复现，比如 16.9。

如果受限于平台或其他不可抗力无法升级 React，临时的解决办法可以是通过 `useState` 设置一个本地状态，在该状态变更后同步到 Reacoil 的状态上。

```diff
-  const [name, setName] = useRecoilState(nameState);
+  const setRecoilName = useSetRecoilState(nameState);
+  const [name, setName] = useState("");

+  useEffect(() => {
+    setRecoilName(name);
+  }, [name, setRecoilName]);

```



