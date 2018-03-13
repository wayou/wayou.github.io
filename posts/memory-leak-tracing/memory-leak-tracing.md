## Chrome DevTools 中的内存溢出调试，让相宜也不再皱眉

![相宜皱眉](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/memory-leak-tracing/assets/xy.jpg)

V8 发了条推文展示在最新 Chrome 66 中如何方便地定位内存溢出的问题，[Chrome 66 memory leak detect became much easier](https://twitter.com/v8js/status/969184997545562112)。

![v8 twitter](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/memory-leak-tracing/assets/v8-twitter.png)

看完推文视频里的这一波操作后，成功引起了我的注意。赶紧装了最新的 Canary 版本试了下，此时版本号已经来到了 67。

打开其提供的[示例](https://ulan.github.io/misc/leak.html)。示例页面包含垃圾回收无法回收释放的对象引用，因此有内存溢出的风险。

其页面代码如下：

```js
// Main window:
const iframe = document.createElement('iframe');
iframe.src = 'iframe.html';
document.body.appendChild(iframe);
iframe.addEventListener('load', function() {
  const local_variable = iframe.contentWindow;
  function leakingListener() {
    // Do something with `local_variable`.
    if (local_variable) {}
  }
  document.body.addEventListener('my-debug-event', leakingListener);
  document.body.removeChild(iframe);
  // BUG: forgot to unregister `leakingListener`.
});
```

上面的示例代码向我们展示了如下的风骚操作：

- 创建了 iframe 并添加到页面
- 为这个 iframe 绑定 `load` 事件
- 在事件回调中
    - 创建了一个本地变量 `local_variable` 保存了该 [iframe 的 window](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/contentWindow) 对象
    - 在 body 上注册了一个事件监听并绑定了回调，回调中使用了上面创建的本地变量 `local_variable`。也即这个 body 身上的事件回调中引用了 iframe 的 window 对象。
    - 将 iframe 从页面移除

问题出在了最后一步。虽然 iframe 从页面移除，但其内容还在 body 身上的事件监听器 `leakingListener ` 中有引用 。

所以，在写码的时候你以为销毁了 iframe，但其实并没有，并没有。

Chrome 66 中，这样的情况可以被检测并详细追踪到代码的源头。

如何操作？

- 打开 DevTools 切换到 Memory 面板
- 点击 「Take snapshot」抓取页面的堆快照信息

![devtools memory panel](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/memory-leak-tracing/assets/devtools-memory-panel.png)

- 在生成的快照中搜索 `Leak` 定位溢出

![search heap for memory leak](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/memory-leak-tracing/assets/search-for-leak.png)

内存溢出的定位从未如此简单，对吧？！

其实能够定位内存溢出的功能在较早版本的 Chrome 中就实现了，只是这次 Chrome 66 中，可以展示出更加详细的信息使得调试内存溢出变得异常方便了。这得益于 V8 中新的 C++ 跟踪机制，Chrome Devtools 可以跟踪并记录下 JS 中有引用的 C++ DOM 对象。

下面看看 V8 官博 [Tracing from JS to the DOM and back again](https://v8project.blogspot.tw/2018/03/tracing-js-dom.html) 中对其机理的详细介绍。


### 背景

垃圾回收时，有些不再使用的对象因为在其它地方存在不正常的引用始终无法释放，导致内存溢出。通常发生在 JS 与 DOM 交叉引用的情况下。

首先，搞清楚「引用路径」(retaining paths）这一概念，对于找到引起溢出的源头至关重要。

引用路径是一串链式的对象，展示了溢出对象在垃圾回收中的引用情况。这条链式引用路径从一个根对象开始，譬如全局 Window 对象。链的终端则是溢出的对象本身。链中的每个中间节点都保留（retaining）了下一节点的引用。

下图展示了上面示例中，iframe 中导致溢出的对象的引用路径。

![图1：iframe 中导出溢出的对象的引用路径](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/memory-leak-tracing/assets/retaining-path.png)￼
_图1：iframe 中导出溢出的对象的引用路径_

上图中，红色为 DOM 对象，在 C++ 代码中，绿色为 JS 对象，存在于 V8 的堆（Heap）中。整个路径中，JS 与 DOM 间的引用交叉进行了两次。


### DevTools 的堆快照功能

通过在 DevTools 中抓取堆的快照，可以方便地查看任意对象的引用路径。生成的快照能够展示 V8 堆中的所有对象，但对于引用路径中的 C++ DOM 对象则定位得很粗糙，只能展示个大概。譬如，Chrome 65 中对于上面示例引用路径的展示则不太完整。
￼
![图 3: Chrome 65 中的引用路径](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/memory-leak-tracing/assets/chrome-65.png)￼
_图 2: Chrome 65 的引用路径._

只有第一行对于溢出对象的展示是精确的，标明该对象为 iframe 全局 window 中的 global_variable 变量。而后续相关的 DOM 节点则不那么精确，对于定位问题帮助不大。

Chrome 66 中这一情况有所改善。 DevTools 跟踪 C++ DOM 对象并且记录其引用关系。这一功能的实现基于一个强大的 C++ 对象追踪机制，该机制是之前为了做跨组件垃圾回收（cross-component garbage collection）而引入的。

![图 3: Chrome 66 中的引用路径](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/memory-leak-tracing/assets/retaining-path-and-heap.jpg)￼
_图 3: Chrome 66 中的引用路径._


### 幕后原理：跨组件追踪

DOM 对象由 Chrome 的渲染引擎 Blink 管理，其负责将 DOM 转换成屏幕上我们能看到的文本及图片等。而 Blink 及其管理的 DOM 对象由 C++ 写就，意味着 DOM 其实无法直接暴露给 JavaScript。实际操作中，DOM 中的对象以两种形式存在：V8 中 JavaScript 可操作的包装对象和代表每个 DOM 节点的 C++ 对象。这两种对象可互相引用。跨组件分析某个对象的存活性（liveness）及引用关系是很难的，比如 Blink 和 V8中，对同一对象是否还在使用及是否可回收，需要在两处都保持一致。

Chrome 65 及之前的版本，使用对象分组（object grouping）这一机制来决定对象的活性。根据对象在文档中所在的容器，被划分到不同的组。分组中只要有一个对象在引用路径中被发现为使用中，那么这个分组中的所有对象都标记为在使用中。这一机制在 DOM 树中是成立的，因为元素始终依赖其容器而存在。然而，这种笼统的划分将单个对象真实的引用路径给抛弃掉了，于是出现上面图2中无法精确展示完整引用路径的问题。对于不满足 DOM 树结构而产生的引用的情况，譬如 Javascript 中事件回调中的闭包，这一机制则显得捉襟见肘，甚至导致一些 bug。此种情况下 JavaScript 包装的对象会被提前回收，取而代之的是空对象，原包装对象中的属性则丢失了。

Chrome 57 开始，使用跨平台追踪机制（cross-component tracing
）替代对象分组，新的机制下会来回追踪对象在 C++ DOM 及 V8 JavaScript 中的存活情况。在C++端实现了增量跟踪，并且加了写的限制以防止追踪过程开销过大而卡死。跨组件追踪不仅提供更好的细节，也使得对象在跨组件追踪时更精确，同时还解决了某些场景下导致内存溢出的问题。基于这个机制，使得 DevTools 可以在抓取的堆快照中真实地展现 DOM引用，如上面图3所示。


### 相关资源

- [Tracing from JS to the DOM and back again](https://v8project.blogspot.tw/2018/03/tracing-js-dom.html)
- [DevTools Leak Detect Example](https://ulan.github.io/misc/leak.html)
- [Debugging memory leaks using @ChromeDevTools just became much easier!](https://twitter.com/v8js/status/969184997545562112)




