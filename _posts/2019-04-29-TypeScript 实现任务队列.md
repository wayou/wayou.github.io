---
layout: post
title: "TypeScript 实现任务队列"
date: 2019-04-29 23:04:00 +0800
tags: 
---
    
## TypeScript 实现任务队列 

业务中经常会有一些批量操作的任务，比如使用 JavaScript 预加载一组图片，批量上传一些资源。如果这些任务一次性启动，势必会消耗很多资源和带宽。理想的做法应该对这些任务进行限制，比如一次只跑几个，当其中一些任务完成后，再添加新的任务到队列。

总的来说，我们需要这样一个服务，它提供一个添加任务的方法，内部将添加的方法维护在一个数组。然后根据设置的阈值，即同时可跑的任务数，来执行这些任务。

同时为了打日志方便，注册的任务可指定一个名称，所以一个任务的类型看起来应该像这样：

```ts
type Task<T> = {
  name?: string;
  fn: () => Promise<T>;
};
```
其中 `name` 方便调试，`fn` 便是需要执行的任务，它应该是一个比较耗时的异步任务，所以调用后返回 Promise。

运行任务的服务：

```ts
export class TaskRunner {
  private queue: Task<any>[] = [];
  private activeTaskNum: number = 0;

  constructor(private limit = 5, public debug = false) {
    if (limit < 1) {
      throw new Error("limit must be interger greater then 1");
    }
  }

  public addTask<T>(task: Task<T>) {
    task.name ? task.name : task.fn.name || this.queue.length || "";
    this.queue.push(task);
    this.runTask();
  }

  private execute<T>(task: Task<T>) {
    this.log(`running ${task.name}`);
    return task
      .fn()
      .then(ressult => {
        this.log(`task ${task.name} finished`);
        return ressult;
      })
      .catch(error => {
        this.log(`${task.name} failed`);
        throw error;
      })
      .finally(() => {
        this.activeTaskNum--;
        this.runTask();
      });
  }

  private runTask() {
    while (this.activeTaskNum < this.limit && this.queue.length > 0) {
      const task = this.queue.shift();
      this.activeTaskNum++;
      this.execute(task!);
    }
  }

  private log(msg: string) {
    if (this.debug) {
      console.info(`[TaskRunner] ${msg}`);
    }
  }
}
```

因为任务可以动态添加，所以在添加完任务的方法 `addTask()` 里就启动任务队列的执行 `runTask()`，无须外部显式触发。

测试上面的代码：


```ts
import { TaskRunner } from "./taskRunner";

const runner = new TaskRunner(3, true);

function taskGenerator(taskName: string, time: number) {
  return {
    name: taskName,
    fn: () =>
      new Promise<string>((resolve, _reject) => {
        setTimeout(() => {
          resolve(`result for task ${taskName}`);
        }, time);
      })
  };
}

const errorTask = {
  name: "errroTask",
  fn: () =>
    new Promise<string>((_resolve, reject) => {
      setTimeout(() => {
        reject("errorTask failed");
      }, 3000);
    })
};

[errorTask]
  .concat(
    [...new Array(5).keys()].map((_value, index) =>
      taskGenerator(String(index), Math.random() * 10000 + 1000)
    )
  )
  .forEach(task => runner.addTask(task));
```

这里生成了 5 个任务，每个任务的耗时是随机的 1s ~ 10s。同时添加一个了个直接 `reject` 的任务来模拟任务失败时，不会影响其他任务的执行。

![任务运行效果](https://user-images.githubusercontent.com/3783096/56847967-4ab33900-6915-11e9-8e05-806d85a1f473.gif)
<p align="center"></p>


完整的代码移步 GitHub 仓库 [wayou/task-runner](https://github.com/wayou/task-runner)


## 相关资源

- [Limiting concurrent operations in JavaScript](https://medium.freecodecamp.org/how-to-limit-concurrent-operations-in-javascript-b57d7b80d573)
    