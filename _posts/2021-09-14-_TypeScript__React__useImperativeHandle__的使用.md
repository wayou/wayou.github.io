---
layout: post
title: "[TypeScript] React `useImperativeHandle` 的使用"
date: 2021-09-14T13:11:00Z
---
# [TypeScript] React `useImperativeHandle` 的使用

React 是数据驱动的，组件接收数据然后渲染。极少数情况下，仍然需要走方法调用的方式，比如播放器组件，会提供如下方法供外界调用：

```tsx
interface IPlayer {
  play(): void;
  pause(): void;
  seek(): void;
}
```

有人会 argue 可以通过传入状态，组件内通过检测状态变更来触发对应事件。但实践中的确会比主动的方法调用会更麻烦，并且也不够直观。

再比如，来看一个完整的示例。

## 组件抽取

我们有个填写数据库信息的表单，其中包含一个测试连通性的按钮。

![image](https://user-images.githubusercontent.com/3783096/133263291-95811693-e27b-4ff3-808d-e8178a763cd6.png)

因为会包含加载态，

![image](https://user-images.githubusercontent.com/3783096/133263363-01fdff14-918e-4d34-be49-271f9a2c4225.png)


错误及成功信息的展示，

![image](https://user-images.githubusercontent.com/3783096/133263422-3c2a5097-0134-4f27-9c5e-77577be2bd0e.png)


将这个按钮抽取成单独的组件这很合理，做到了功能内聚，一个组件完成一件小事情。

```tsx
// TestConnection.tsx

export function TestConnection() {
  const { getValues } = useFormContext();
  const [err, setErr] = useState<string>('');
  const [isLoading, setLoading] = useState(false);

  /**
   * 测试连通性，返回错误信息或空字符串
   */
  const doTestConnection = useCallback(async () => {
    const values = getValues();
    setLoading(true);
    setErr(null);
    try {
     // post(values)
    } catch (error) {
      // error handling
    } finally {
      setLoading(false);
    }
  }, [getValues]);

  return (
    <section>
      {isLoading ? (
        <LoadingTip loadingText={t('测试中...')} />
      ) : (
        <Button onClick={doTestConnection}>{t('测试连通性')}</Button>
      )}
      <div>
        {err && !isLoading ? <Text theme="danger">{err}</Text> : null}
        {err === null && !isLoading ? <Text theme="success">{t('连通性正常')}</Text> : null}
      </div>
    </section>
  );
}
```

## 调用组件方法

但问题来了，在点击「提交」进行表单提交时，想先触发一下连通性的测试，

![image](https://user-images.githubusercontent.com/3783096/133263509-88c7ba22-0d74-438c-a838-7cbbac436d19.png)


此时如果组件提供了对应的方法，那就再方便不过了。

### 定义对外暴露的对象类型

首先我们定义组件对外暴露哪些字段或方法：

```tsx
// TestConnection.tsx

export interface ITestConnectionHandler {
  /** 测试连通性，如果失败则返回错误信息 */
  doTestConnection(): Promise<string>;
}
```

### 接收外部传递的 ref

通过 `forwardRef` 改造组件，接收外部传入的 `ref` 属性。因为外部会通过这个 `ref` 来调用我们提供的方法或者获取我们暴露的其他字段。

改造后的组件：

```tsx
// TestConnection.tsx

const _TestConnection: ForwardRefRenderFunction<ITestConnectionHandler, {}> = (_props, ref) => {
  const { getValues } = useFormContext();
  const [err, setErr] = useState<string>('');
  const [isLoading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    doTestConnection,
  }));

  /**
   * 测试连通性，返回错误信息或空字符串
   */
  const doTestConnection = useCallback(async () => {
    const values = getValues();
    setLoading(true);
    setErr(null);
    try {
      // post(values)
    } catch (error) {
      // error handling
    } finally {
      setLoading(false);
    }
  }, [getValues]);

  return (
    <section>
      {isLoading ? (
        <LoadingTip loadingText={t('测试中...')} />
      ) : (
        <Button htmlType="button" type="link" onClick={doTestConnection}>
          {t('测试连通性')}
        </Button>
      )}
      <div>
        {err && !isLoading ? <Text theme="danger">{err}</Text> : null}
        {err === null && !isLoading ? <Text theme="success">{t('连通性正常')}</Text> : null}
      </div>
    </section>
  );
};
```

最后使用 `forwardRef` 导出组件：

```tsx
// TestConnection.tsx

/**
 * 测试连通性
 * @param param0
 * @returns
 */
export const TestConnection = forwardRef(_TestConnection);
```

## 方法的调用

首先使用时，通过 `useRef` 创建 `ref` 对象并传递给组件，这里会用到前面定义的 `ITestConnectionHandler` 类型。

```tsx
// Form.tsx

const connectionTesterRef = useRef<ITestConnectionHandler>(null);

// ...

<TestConnection ref={connectionTesterRef} />

// ...
```

然后就可以在表单提交的逻辑中手动调用需要的方法了：

```tsx
// Form.tsx

 /**
  * 表单提交
  */
  const onSubmit: SubmitHandler<IFormData> = async (values) => {
    const err = await connectionTesterRef.current.doTestConnection();
    if (err) {
      // show error msg      
    } else {
      return doSubmit(values);
    }
  };
```

以上。

## 相关资源

- [React Hooks](https://reactjs.org/docs/hooks-reference.html#useimperativehandle)
