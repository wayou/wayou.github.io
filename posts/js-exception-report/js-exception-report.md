## 前端异常监控

如果说前端的异常监控有个救星的话，我想那就是 `window.onerror` 这个全局错误监听事件了。它给了我们统一处理前端全局错误的机会，使得错误上报有了一线生机。

```js
window.onerror = function(messageOrEvent, source, lineno, colno, error) { ... }
```

* message: 错误信息，在 HTML 中的 `onerror` 属性中设置的回调可以传递事件
* source: 出错文件的 url
* lineno: 出错位置的行数
* colno: 出错时的列数
* error: 出错时的 Error 对象。

实践中发现最后个参数 Error 对象中的值因浏览器的实现各有差异，比如 Chrome 中包含 `message` 和 `stack`，而 Safari 中则包含了前面四个参数的所有值。这在下面的示例代码的结果中可以看得出来。

### 牵出来溜一溜

*注意*
`window.onerror` 需要在有服务端的情况下才能正常工作，本地直接打开页面测试获取不到任何有用的错误信息。可以在命令行启动一个简单的服务端来进行测试。
因为 Mac 自带 Python，一般需要用到服务端的时候，我喜欢用 Python 自带的 `SimpleHTTPServer`：

```bash
python -m SimpleHTTPServer
or
python3 -m http.server
```

以下代码我们对全局错误进行监听，然后将错误打印到页面：

```js
window.onerror = function (msg, source, line, col, error) {
    printError.apply(null, arguments);
};

function printError(msg, source, line, col, error) {
    var detail =
        'msg:' +
        msg +
        '\ncourse:' +
        source +
        '\nline:' +
        line +
        '\ncol:' +
        col +
        '\nerror:' +
        JSON.stringify(error, Object.getOwnPropertyNames(error));
    var div = document.createElement('pre');
    div.innerHTML = detail
    document.body.appendChild(div);
}
```

然后在页面放上按钮以触发错误。这里测试了两种错误，一种运行时 JS 的抛错，另一种手动在代码中抛出的错误。

```html
<button onclick="excptionGenerate()">点我执行出错代码</button>
<button onclick="throwError()">点我手动抛出异常</button>
```

![Chrome 中异常的捕获与打印](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/js-exception-report/assets/chrome-error-print.png)

_Chrome 中异常的捕获与打印_


![Safari 中异常的捕获与打印](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/js-exception-report/assets/safari-error-print.png)

_Safari 中异常的捕获与打印_


### 浏览器兼容性

要知道，最初版本的全局错误监听事件是这样的：

```js
window.onerror = function(messageOrEvent, source, lineno) { ... }
```

后来才增加了 `colno` 和 `error`。而后来加的这两个参数其实是非常有用的。

因为线上代码一般为压缩过的代码，所有内容都在一行，假如没有提供发生问题的列数，这样的错误日志要追查起来很不方便。
错误对象则直接提供了错误堆栈信息（通过 `error.stack` 访问），就像我们在浏览器控制台看到的一样，对于定位问题十分有帮助。

主流浏览器中， Chrome， Safari 已经完成了5个参数的支持。

Firefox 从 31 开始支持了完整的5个参数。

截止到目前， 微软的 Edge 浏览器还没有实现对新增两个参数的支持。其实现情况可以在[这里](https://developer.microsoft.com/en-us/microsoft-edge/platform/status/runtimeerrorreportingerrorevent/?q=onerror)查阅得到。

* 小贴士 *
> 过程中顺便发现了微软Edge[这个API Catalog页面](https://developer.microsoft.com/en-us/microsoft-edge/platform/catalog/?page=1&q=queryselector)可以查到主流浏览器对名前端特性的实现情况，数据比 caniuse 全，譬如 `window.onerror` 在 caniuse 上则没有。

![MS Edge 浏览器对 `window.onerror` 第五个参数的实现情况](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/js-exception-report/assets/ms-edge-onerror-compatability.png)

_MS Edge 浏览器对 `window.onerror` 第五个参数的实现情况_

从这里也可以看到，其他主流浏览器都已经有了完整的支持。

IE，（逃~）

### 垫片

对于不提供第5个参数的环境，我们是拿不到错误堆栈信息的。这种情况下对错误的追查帮助不大。

但是，手动在代码中捕获并抛出的错误，是带了堆栈信息的。这就有了补救的希望。我们可以将可能出错的地方，或者我们期望进行监控的地方，使用 try catch。

```js
function tryCatchError() {
    try {
        a();
    } catch (error) {
        printError(error)
    }
}

function printError(error) {
    var detail = 'error:' +
            JSON.stringify(error, Object.getOwnPropertyNames(error)) +
            '\n\n';
    }

    var div = document.createElement('code');
    div.innerHTML = detail
    document.body.appendChild(div);
}

```

同时在页面中添加按钮来调用新的测试函数。

```html
<button onclick="tryCatchError()">利用 try catch 捕获异常并打印错误堆栈</button>
```

![try catch 中打印错误](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/js-exception-report/assets/try-catch-print.png)

_try catch 中打印错误_

我们看到，这种方式确实能得到详细的报错堆栈。


#### 这一段其实无关紧要

因为最后两个参数是后面加的，有理由相信，在很老很老很老的 Chrome 版本中，也是不支持全部5个参数的。来自Ben Vinegar的[这篇文章](https://blog.sentry.io/2016/01/04/client-javascript-reporting-window-onerror.html)指出 Chrome 46 开始支持全部5个参数的。

![](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/js-exception-report/assets/chrome-onerr-compatability.png)

为此我们不妨找一个老版本来验一下。我去 [Chrome 的历史仓库中](https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html) 下到了 [Chromium 15](https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Mac/100293/) （Chrome 正式发布前的开发版）。

![拥有历史厚重感的老版本 Chrome](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/js-exception-report/assets/chromium-15.png)

_拥有历史厚重感的老版本 Chrome_

打开它，仿佛打开了一个刚出土的文物，在 Retina 屏上，它的皮肤已经略出了清晰的锯齿，这是历史的厚重，这是岁月刻下的痕迹。

不过还好，它的功能依然完好，跑起来我们的示例代码来驾轻就熟。

![老版本的 Chrome 果然是没有后两位参数的](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/js-exception-report/assets/chrome-15-without-last-2-arguments.png)

_老版本的 Chrome 果然是没有后两位参数的_


### 全局无法捕获的情况

除了考虑上面的浏览器兼容性问题外，还有其他一些情况，也是无法通过这个全局的 onerror 获取到详细报错信息的。

#### 跨域情况的错误捕获(CDN)

`window.onerror` 有个限制，来自非同域的代码有报错，不会给出错误的详细信息，只能得到一个 `Script error.`。这是浏览器出于安全考虑，不向第三方泄露信息而做的一个措施。但往往线上代码大部分都部署在 CDN，所以这个限制的影响还挺常见。

不过还好，某些浏览器中可以通过配置来更改这一行为，让我们能正常拿到报错的详细信息。

还有一点，就是虽然在 `window.onerror` 中倒不到详细的报错信息，但在浏览器控制台是可以看到详细信息的。

*如果是跨域脚本，则提示去控制台查看报错信息*
```js
window.onerror = function (msg, url, lineNo, columnNo, error) {
    var string = msg.toLowerCase();
    var substring = "script error";
    if (string.indexOf(substring) > -1){
        alert('Script Error: See Browser Console for Detail');
    } else {
        var message = [
            'Message: ' + msg,
            'URL: ' + url,
            'Line: ' + lineNo,
            'Column: ' + columnNo,
            'Error object: ' + JSON.stringify(error)
        ].join(' - ');

        alert(message);
    }

    return false;
};
```

控制台能看到对于线上的错误监控来说没多大用，还是得解决上报的问题。我们来看看如何设置跨域脚本让我们可以捕获时拿到错误堆栈信息。

下面看跨域脚本的配置。

* CDN 上开启允许跨域  
```
Access-Control-Allow-Origin:*
或者
Access-Control-Allow-Origin: domain of your site
```

* 然后 script 标签上设置跨域标识为匿名

```html
<script crossorigin="anonymous" src="//url/for/your/cdn/scripts"></script>
```

唯一需要注意的是，一旦在前端设置了 `crossorigin`，要确保服务端相应设置了允许跨域的响应头，否则整个脚本文件会加载失败，影响页面正常功能。

目前来看，除了 Opera外，各主流浏览器都有支持此属性。

![跨域脚本加载浏览器兼容性](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/js-exception-report/assets/cors-loading-browser-compatability.png)

_跨域脚本加载浏览器兼容性_


#### iframe 中异常的捕获

iframe 中发生异常，外界的 `onerror` 是不会触发的。但如果 iframe 地址同域，那么我们就可以设置 iframe 的全局 `onerror` 进行监听。

```js
document.getElementById("myiframe").contentWindow.onerror=function() {
    alert('error!!');
    return false;
}
``` 
以上代码需要保证在 iframe 加载完成后进行。

非同域情况下，如果 ifame 内的内容不来自第三方，也就是你自己可以控制，那么可以通过与 iframe 内进行通信的方式，将异常信息抛出来。iframe 通信试有很多，譬如 `postMessage`。这里不展开了。

非同域且内容不受自己控制的情况下，除了在控制台查看错误详细信息，真的没其他办法可以捕获了。


#### 代码压缩在错误捕获中的还原

线上代码一般是压缩过的，如何更友好地展示还原事件发生地，对于错误上报也是个挑战。因为在错误监听的回调里面提供了列数，所以对于压缩后的代码，定位起位置来也不是难事，再结合错误对象里的报错堆栈信息，能够很好地定位代码的位置及原因。

关于压缩后的代码，有 sourse map 可以映射到源码，如果我们在异常捕获时通过与 soruce map 文件结合起来，那么就有可能在还原错误时分析出其在未压缩源码中的位置。目前来看，已经有相关的服务实现了这一功能，[sentry 的文档](https://docs.sentry.io/clients/javascript/sourcemaps/)中有提到。

前面讨论了一下错误详细信息的获取，最终我们是想在客户端收集到这些信息，再加上 ua, 发生错误的时间，设备相关信息等上报到服务端。总之，能够获取到信息越全越好，方便我们后期定位处理问题。当然，这套体系，市面上是有现成库已经做了的，来自 GitHub的这个代码仓库[cheeaun/javascript-error-logging](https://github.com/cheeaun/javascript-error-logging)收集了前端异常监控相关的资源，从 [GitHub 这个专题页面](https://github.com/topics/error-monitoring)也能找到许多。上面的坑库里面也都会覆盖到。 

Happy trouble shotting :)


### 相关资料

* [GlobalEventHandlers.onerror](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror)
* [How to catch JavaScript Errors with window.onerror (even on Chrome and Firefox)](https://danlimerick.wordpress.com/2014/01/18/how-to-catch-javascript-errors-with-window-onerror-even-on-chrome-and-firefox/)
* [Cryptic “Script Error.” reported in Javascript in Chrome and Firefox](https://stackoverflow.com/questions/5913978/cryptic-script-error-reported-in-javascript-in-chrome-and-firefox)
* [Capture and report JavaScript errors with window.onerror](https://blog.sentry.io/2016/01/04/client-javascript-reporting-window-onerror.html)
* [MS Edge API Catalog](https://developer.microsoft.com/en-us/microsoft-edge/platform/catalog/?page=1&q=queryselector)
* [Script Error: JavaScript Forensics](https://trackjs.com/blog/script-error-javascript-forensics/)
* [CORS settings attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes)
* [can I catch exception of Iframe in parent window of Iframe](https://stackoverflow.com/questions/6327128/can-i-catch-exception-of-iframe-in-parent-window-of-iframe)


**后记**

后续可以开垦的点：

- 本地模拟跨域
- 自己实现异常上报的库
