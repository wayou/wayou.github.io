---
layout: post
title: "从 axios 源码中了解到的 Promise 链与请求的取消"
date: 2019-10-10 01:10:00 +0800
tags: 
---
    
# 从 axios 源码中了解到的 Promise 链与请求的取消

[axios](https://github.com/axios/axios) 中一个请求取消的示例：

<details>
<summary>
axios 取消请求的示例代码
</summary>

```ts
import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

export default function App() {
  const [index, setIndex] = useState(0);
  const [imgUrl, setImgUrl] = useState("");
  useEffect(() => {
    console.log(`loading ${index}`);
    const source = axios.CancelToken.source();
    axios
      .get("https://dog.ceo/api/breeds/image/random", {
        cancelToken: source.token
      })
      .then((res: AxiosResponse<{ message: string; status: string }>) => {
        console.log(`${index} done`);
        setImgUrl(res.data.message);
      })
      .catch(err => {
        if (axios.isCancel(source)) {
          console.log(err.message);
        }
      });

    return () => {
      console.log(`canceling ${index}`);
      source.cancel(`canceling ${index}`);
    };
  }, [index]);

  return (
    <div>
      <button
        onClick={() => {
          setIndex(index + 1);
        }}
      >
        click
      </button>
      <div>
        <img src={imgUrl} alt="" />
      </div>
    </div>
  );
}
```

</details>

![axios 中一个请求取消的示例](https://user-images.githubusercontent.com/3783096/66497032-6f2f5600-eaee-11e9-882a-d33b8c6e2c7d.gif)
<p align="center">axios 中一个请求取消的示例</p>

通过解读其源码不难实现出一个自己的版本。Here we go...

## Promise 链与拦截器

这个和请求的取消其实关系不大，但不妨先来了解一下，axios 中如何组织起来一个 Promise 链（Promise chain），从而实现在请求前后可执行一个拦截器（Interceptor）的。

简单来说，通过 axios 发起的请求，可在请求前后执行一些函数，来实现特定功能，比如请求前添加一些自定义的 header，请求后进行一些数据上的统一转换等。

### 用法

首先，通过 axios 实例配置需要执行的拦截器：

```ts
axios.interceptors.request.use(function (config) {
    console.log('before request')
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

axios.interceptors.response.use(function (response) {
    console.log('after response');
    return response;
  }, function (error) {
    return Promise.reject(error);
  });
```

然后每次请求前后都会打印出相应信息，拦截器生效了。

```ts
axios({
    url: "https://dog.ceo/api/breeds/image/random",
    method: "GET"
}).then(res => {
    console.log("load success");
});
```

下面编写一个页面，放置一个按钮，点击后发起请求，后续示例中将一直使用该页面来测试。

```tsx
import React from "react";
import axios from "axios";

export default function App() {
  const sendRequest = () => {
    axios.interceptors.request.use(
      config => {
        console.log("before request");
        return config;
      },
      function(error) {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      response => {
        console.log("after response");
        return response;
      },
      function(error) {
        return Promise.reject(error);
      }
    );

    axios({
      url: "https://dog.ceo/api/breeds/image/random",
      method: "GET"
    }).then(res => {
      console.log("load success");
    });
  };
  return (
    <div>
      <button onClick={sendRequest}>click me</button>
    </div>
  );
}

```

点击按钮后运行结果：

```
before request
after response
load success
```

### 拦截器机制的实现

实现分两步走，先看请求前的拦截器。

#### 请求前拦截器的实现

Promise 的常规用法如下：

```ts
new Promise(resolve,reject);
```

假如我们封装一个类似 axios 的请求库，可以这么写：

```ts

interface Config {
  url: string;
  method: "GET" | "POST";
}

function request(config: Config) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(config.method, config.url);
    xhr.onload = () => {
      resolve(xhr.responseText);
    };
    xhr.onerror = err => {
      reject(err);
    };
    xhr.send();
  });
}
```

除了像上面那个直接 `new` 一个 Promise 外，其实任意对象值都可以形成一个 Promise，方法是调用 `Promise.resolve`，

```ts
Promise.resolve(value).then(()=>{ /**... */ });
```

这种方式创建 Promise 的好处是，我们可以从 `config` 开始，创建一个 Promise 链，在真实的请求发出前，先执行一些函数，像这样：

```ts
function request(config: Config) {
  return Promise.resolve(config)
    .then(config => {
      console.log("interceptor 1");
      return config;
    })
    .then(config => {
      console.log("interceptor 2");
      return config;
    })
    .then(config => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(config.method, config.url);
        xhr.onload = () => {
          resolve(xhr.responseText);
        };
        xhr.onerror = err => {
          reject(err);
        };
        xhr.send();
      });
    });
}
```

将前面示例中 axios 替换为我们自己写的 `request` 函数，示例可以正常跑起来，输出如下：

```
interceptor 1
interceptor 2
load success
```

这里，已经实现了 axios 中请求前拦截器的功能。仔细观察，上面三个 `then` 当中的函数，形成了一个 Promise 链，在这个链中顺次执行，每一个都可以看成一个拦截器，即使是执行发送请求的那个 `then`。

于是我们可以将他们抽取成三个函数，每个函数就是一个**拦截器**。


```ts
function interceptor1(config: Config) {
  console.log("interceptor 1");
  return config;
}
function interceptor2(config: Config) {
  console.log("interceptor 2");
  return config;
}

function xmlHttpRequest<T>(config: Config) {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(config.method, config.url);
    xhr.onload = () => {
      resolve(xhr.responseText as any);
    };
    xhr.onerror = err => {
      reject(err);
    };
    xhr.send();
  });
}
```

接下来要做的，就是从 Promise 链的头部 `Promise.resolve(config)` 开始，将上面三个函数串起来。借助 [Monkey patch](https://en.wikipedia.org/wiki/Monkey_patch) 这不难实现：

```ts
function request<T = any>(config: Config) {
  let chain: Promise<any> = Promise.resolve(config);
  chain = chain.then(interceptor1);
  chain = chain.then(interceptor2);
  chain = chain.then(xmlHttpRequest);
  return chain as Promise<T>;
}
```

然后，将上面硬编码的写法程式化一下，就实现了任意个请求前拦截器的功能。

扩展配置，以接收拦截器：

```ts
interface Config {
  url: string;
  method: "GET" | "POST";
  interceptors?: Interceptor<Config>[];
}
```

创建一个数组，将执行请求的函数做为默认的元素放进去，然后将用户配置的拦截器压入数组前面，这样形成了一个拦截器的数组。最后再遍历这个数组形成 Promise 链。

```ts
function request<T = any>({ interceptors = [], ...config }: Config) {
  // 发送请求的拦截器为默认，用户配置的拦截器压入数组前面
  const tmpInterceptors: Interceptor<any>[] = [xmlHttpRequest];
  interceptors.forEach(interceptor => {
    tmpInterceptors.unshift(interceptor);
  });
  let chain: Promise<any> = Promise.resolve(config);
  tmpInterceptors.forEach(interceptor => (chain = chain.then(interceptor)));
  return chain as Promise<T>;
}
```

使用：

```ts
request({
    url: "https://dog.ceo/api/breeds/image/random",
    method: "GET",
    interceptors: [interceptor1, interceptor2]
}).then(res => {
    console.log("load success");
});
```

执行结果：

```
interceptor 2
interceptor 1
load success
```

_注意这里顺序为传入的拦截器的反序，不过这不重要，可通过传递的顺序来控制。_

#### 响应后拦截器

上面实现了在请求前执行一序列拦截函数，同理，如果将拦截器压入到数组后面，即执行请求那个函数的后面，便实现了响应后的拦截器。

继续扩展配置，将请求与响应的拦截器分开：

```ts
interface Config {
  url: string;
  method: "GET" | "POST";
  interceptors?: {
    request: Interceptor<Config>[];
    response: Interceptor<any>[];
  };
}
```

更新 `request` 方法，请求前拦截器的逻辑不变，将新增的响应拦截器通过 `push` 压入数组后面：

```ts

function request<T = any>({
  interceptors = { request: [], response: [] },
  ...config
}: Config) {
  const tmpInterceptors: Interceptor<any>[] = [xmlHttpRequest];
  interceptors.request.forEach(interceptor => {
    tmpInterceptors.unshift(interceptor);
  });

  interceptors.response.forEach(interceptor => {
    tmpInterceptors.push(interceptor);
  });

  let chain: Promise<any> = Promise.resolve(config);
  tmpInterceptors.forEach(interceptor => (chain = chain.then(interceptor)));
  return chain as Promise<T>;
}
```

类似 `interceptor1` `interceptor2`，新增两个拦截器用于响应后执行，

```ts
function interceptor3<T>(res: T) {
  console.log("interceptor 3");
  return res;
}

function interceptor4<T>(res: T) {
  console.log("interceptor 4");
  return res;
}
```

测试代码：

```ts
request({
    url: "https://dog.ceo/api/breeds/image/random",
    method: "GET",
    interceptors: {
    request: [interceptor1, interceptor2],
    response: [interceptor3, interceptor4]
    }
}).then(res => {
    console.log("load success");
});
```

运行结果：

```
interceptor 2
interceptor 1
interceptor 3
interceptor 4
load success
```

不难看出，当我们发起一次 axios 请求时，其实是发起了一次 Promise 链，链上的函数顺次执行。

```
request interceptor 1
request interceptor 2
...
request
response interceptor 1
response interceptor 2
...
```

因为拉弓没有回头箭，请求发出后，能够取消的是后续操作，而不是请求本身，所以上面的 Promise 链中，需要实现 `request` 之后的拦截器和后续回调的取消执行。

```
request interceptor 1
request interceptor 2
...
request
# 🚫 后续操作不再执行
response interceptor 1
response interceptor 2
...
```

## 请求的取消

### Promise 链的中断

中断 Promise 链的执行，可通过 throw 异常来实现。

添加一个中间函数，将执行请求的函数进行封装，无论其成功与否，都抛出异常将后续执行中断。

```ts
function adapter(config: Config) {
  return xmlHttpRequest(config).then(
    res => {
      throw "baddie!";
    },
    err => {
      throw "baddie!";
    }
  );
}
```

更新 `request` 函数使用 `adapter` 而不是直接使用 `xmlHttpRequest`：

```diff
function request<T = any>({
  interceptors = { request: [], response: [] },
  ...config
}: Config) {
-  const tmpInterceptors: Interceptor<any>[] = [xmlHttpRequest];
+  const tmpInterceptors: Interceptor<any>[] = [adapter];
  interceptors.request.forEach(interceptor => {
    tmpInterceptors.unshift(interceptor);
  });

  interceptors.response.forEach(interceptor => {
    tmpInterceptors.push(interceptor);
  });

  let chain: Promise<any> = Promise.resolve(config);
  tmpInterceptors.forEach(interceptor => (chain = chain.then(interceptor)));
  return chain as Promise<T>;
}
```

再次执行其输出结果为：

```
interceptor 2
interceptor 1
Uncaught (in promise) baddie!
```

### 请求取消的实现

按照 axios 的实现思路，要实现请求的取消，需要先创建一个 token，通过该 token 可调用一个 `cancel` 方法；通过将 token 传递到配置中，在发起请求时对 token 进行检查以判定该 token 是否执行过取消，如果是则利用上面的思路，将 Promise 链中断掉。

#### 构造 token

所以不难看出，这里的 token 对象至少：

- 有一个 `cancel` 方法
- 有一个字段记录 `cancel` 方法是否被调用过

额外地，

- 如果有一个字段记录取消的原因，那也不错。

由此我们得到这么一个类：

```ts
class CancelTokenSource {
  private _canceled = false;
  get canceled() {
    return this._canceled;
  }
  private _message = "unknown reason";
  get message() {
    return this._message;
  }

  cancel(reason?: string) {
    if (this.canceled) return;
    if (reason) {
      this._message = reason;
    }
    this._canceled = true;
  }
}
```

#### 添加 token 到配置

扩展配置，以接收一个用来取消的 token 对象：

```diff
interface Config {
  url: string;
  method: "GET" | "POST";
+  cancelToken?: CancelTokenSource;
  interceptors?: {
    request: Interceptor<Config>[];
    response: Interceptor<any>[];
  };
}
```

#### 请求逻辑中处理取消

同时更新 `xmlHttpRequest` 函数，判断 token 的状态是否调用过取消，如果是则调用 `xhr.abort()`，同时添加 `onabort` 回调以 reject 掉 Promise:

```diff

function xmlHttpRequest<T>(config: Config) {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(config.method, config.url);
    xhr.onload = () => {
      resolve(xhr.responseText as any);
    };
    xhr.onerror = err => {
      reject(err);
    };
+    xhr.onabort = () => {
+      reject();
+    };
+    if (config.cancelToken) {
+      xhr.abort();
+    }
    xhr.send();
  });
}
```

#### 取消的调用

将抛异常的代码抽取成方法以在多处调用，更新 `adapter` 的逻辑，在没有取消的情况下正常返回和 reject。

```ts
function throwIfCancelRequested(config: Config) {
  if (config.cancelToken && config.cancelToken.canceled) {
    throw config.cancelToken.message;
  }
}

function adapter(config: Config) {
  throwIfCancelRequested(config);
  return xmlHttpRequest(config).then(
    res => {
      throwIfCancelRequested(config);
      return res;
    },
    err => {
      throwIfCancelRequested(config);
      return Promise.reject(err);
    }
  );
}
```

#### 测试请求的取消

似乎一切 okay，接下来测试一波。以下代码期望每次点击按钮发起请求，请求前先取消掉之前的请求。为了区分每次不同的请求，添加 `index` 变量，按钮点击时自增。

```ts
import React, { useEffect, useState } from "react";

export default function App() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const token = new CancelTokenSource();
    request({
      url: "https://dog.ceo/api/breeds/image/random",
      method: "GET",
      cancelToken: token,
      interceptors: {
        request: [interceptor1, interceptor2],
        response: [interceptor3, interceptor4]
      }
    })
      .then(res => {
        console.log(`load ${index} success`);
      })
      .catch(err => {
        console.log("outer catch ", err);
      });

    return () => {
      token.cancel(`just cancel ${index}`);
    };
  }, [index]);

  return (
    <div>
      <button
        onClick={() => {
          setIndex(index + 1);
        }}
      >
        click me
      </button>
    </div>
  );
}
```

加载页面进行测试，`useEffect` 会在页面加载后首次运行，会触发一次完整的请求流程。然后连续点击两次按钮，以取消掉两次中的前一次。运行结果：

```ts
interceptor 2
interceptor 1
interceptor 3
interceptor 4
load 0 success

interceptor 2
interceptor 1

interceptor 2
interceptor 1
outer catch  just cancel 1
interceptor 3
interceptor 4
load 2 success
```

#### 现有实现中的问题

从输出来看，
- 第一部分为首次请求，是一次正常的请求。
- 第二部分为第一次点击的请求拦截器的执行。
- 第三部分为第二次点击，将第一次请求进行了取消，然后完成一次完整的请求。

从输出和网络请求来看，有两个问题：
- `xhr.abort()` 没有生效，连续的两次点击中，浏览器调试工具中会有两条状态为 200 的请求。
- 第一条请求后续的回调确实被取消掉了，但它是在等待请求成功后，在成功回调中取消的，这点可通过在取消函数中添加标志位来查看。

```ts
function throwIfCancelRequested(config: Config, flag?: number) {
  if (config.cancelToken && config.cancelToken.canceled) {
    console.log(flag);
    throw config.cancelToken.message;
  }
}

function adapter(config: Config) {
  throwIfCancelRequested(config, 1);
  return xmlHttpRequest(config).then(
    res => {
    //ℹ 后续输出证明，实际生效的是此处
      throwIfCancelRequested(config, 2);
      return res;
    },
    err => {
    //ℹ 而非此处，即使取消的动作是在请求进行过程中
      throwIfCancelRequested(config, 3);
      return Promise.reject(err);
    }
  );
}
```

输出：

```ts
interceptor 2
interceptor 1
interceptor 2
interceptor 1
2
outer catch  just cancel 1
interceptor 3
interceptor 4
load 2 success
```

#### 优化

下面的优化需要解决上面的问题。所用到的方法便是 [axios 中的逻辑](https://github.com/axios/axios/blob/master/lib/cancel/CancelToken.js#L17)，也是一开始看源码会不太理解的地方。

其实外部调用 `cancel()` 的时机并不确定，所以 token 对象上记录其是否被取消的字段，何时被置为 `true` 是不确定的，因此，我们取消请求的逻辑（`xhr.abort()`）应该是在一个 Promise 中来完成。

因此，在 `CancelTokenSource` 类中，创建一个 Promise 类型的字段，它会在 `cancel()` 方法被调用的时候 resolve 掉。

更新后的 `CancelTokenSource` 类：

```ts
class CancelTokenSource {
  public promise: Promise<unknown>;
  private resolvePromise!: (value?: any) => void;
  constructor() {
    this.promise = new Promise(resolve => {
      this.resolvePromise = resolve;
    });
  }
  private _canceled = false;
  get canceled() {
    return this._canceled;
  }
  private _message = "unknown reason";
  get message() {
    return this._message;
  }

  cancel(reason?: string) {
    if (reason) {
      this._message = reason;
    }
    this._canceled = true;
    this.resolvePromise();
  }
}
```

更新后访问 `canceled` 字段的逻辑：

```ts
function xmlHttpRequest<T>(config: Config) {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(config.method, config.url);
    xhr.onload = () => {
      resolve(xhr.responseText as any);
    };
    xhr.onerror = err => {
      reject(err);
    };
    xhr.onabort = () => {
      reject();
    };
    if (config.cancelToken) {
      config.cancelToken.promise.then(() => {
        xhr.abort();
      });
    }
    xhr.send();
  });
}
```

#### 测试优化后的版本

输出结果：

```
interceptor 2
interceptor 1
interceptor 3
interceptor 4
load 0 success

interceptor 2
interceptor 1

interceptor 2
3
interceptor 1
outer catch  just cancel 1
interceptor 3
interceptor 4
load 2 success
```

浏览器调试工具的网络会有一次飘红被 `abort` 掉的请求，同时上面的输出（生效的地方是 3 而非 2）显示被取消的请求正确地 reject 掉了。

## 完整代码

<details>
<summary>
自己实现的请求取消机制完整代码
</summary>

```tsx
import React, { useState, useEffect } from "react";

class CancelTokenSource {
  public promise: Promise<unknown>;
  private resolvePromise!: (value?: any) => void;
  constructor() {
    this.promise = new Promise(resolve => {
      this.resolvePromise = resolve;
    });
  }
  private _canceled = false;
  get canceled() {
    return this._canceled;
  }
  private _message = "unknown reason";
  get message() {
    return this._message;
  }

  cancel(reason?: string) {
    if (reason) {
      this._message = reason;
    }
    this._canceled = true;
    this.resolvePromise();
  }
}

type Interceptor<T> = (value: T) => T | Promise<T>;

interface Config {
  url: string;
  method: "GET" | "POST";
  cancelToken?: CancelTokenSource;
  interceptors?: {
    request: Interceptor<Config>[];
    response: Interceptor<any>[];
  };
}

function interceptor1(config: Config) {
  console.log("interceptor 1");
  return config;
}
function interceptor2(config: Config) {
  console.log("interceptor 2");
  return config;
}

function interceptor3<T>(res: T) {
  console.log("interceptor 3");
  return res;
}

function interceptor4<T>(res: T) {
  console.log("interceptor 4");
  return res;
}

function xmlHttpRequest<T>(config: Config) {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(config.method, config.url);
    xhr.onload = () => {
      resolve(xhr.responseText as any);
    };
    xhr.onerror = err => {
      reject(err);
    };
    xhr.onabort = () => {
      reject();
    };
    if (config.cancelToken) {
      config.cancelToken.promise.then(() => {
        xhr.abort();
      });
    }
    xhr.send();
  });
}

function throwIfCancelRequested(config: Config, flag?: number) {
  if (config.cancelToken && config.cancelToken.canceled) {
    console.log(flag);
    throw config.cancelToken.message;
  }
}

function adapter(config: Config) {
  throwIfCancelRequested(config, 1);
  return xmlHttpRequest(config).then(
    res => {
      throwIfCancelRequested(config, 2);
      return res;
    },
    err => {
      throwIfCancelRequested(config, 3);
      return Promise.reject(err);
    }
  );
}

function request<T = any>({
  interceptors = { request: [], response: [] },
  ...config
}: Config) {
  const tmpInterceptors: Interceptor<any>[] = [adapter];
  interceptors.request.forEach(interceptor => {
    tmpInterceptors.unshift(interceptor);
  });

  interceptors.response.forEach(interceptor => {
    tmpInterceptors.push(interceptor);
  });

  let chain: Promise<any> = Promise.resolve(config);
  tmpInterceptors.forEach(interceptor => (chain = chain.then(interceptor)));
  return chain as Promise<T>;
}

export default function App() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const token = new CancelTokenSource();
    request({
      url: "https://dog.ceo/api/breeds/image/random",
      method: "GET",
      cancelToken: token,
      interceptors: {
        request: [interceptor1, interceptor2],
        response: [interceptor3, interceptor4]
      }
    })
      .then(res => {
        console.log(`load ${index} success`);
      })
      .catch(err => {
        console.log("outer catch ", err);
      });

    return () => {
      token.cancel(`just cancel ${index}`);
    };
  }, [index]);

  return (
    <div>
      <button
        onClick={() => {
          setIndex(index + 1);
        }}
      >
        click me
      </button>
    </div>
  );
}
```

</details>

![运行效果](https://user-images.githubusercontent.com/3783096/66497136-99811380-eaee-11e9-963d-5d8fd664562f.gif)
<p align="center">运行效果</p>


## 相关资源

- [axios](https://github.com/axios/axios)

    