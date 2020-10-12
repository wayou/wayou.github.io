---
layout: post
title: "Content Security Policy (CSP) 介绍"
date: 2018-08-13 01:08:00 +0800
tags: security
---
    
Content Security Policy (CSP) 介绍
===


当我不经意间在 Twitter 页面 `view source` 后，发现了惊喜。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Twitter</title>
  <style>
  body {
    background-color: #ffffff;
    font-family: sans-serif;
  }
  a {
    color: #1da1f2;
  }
  svg {
    color: #1da1f2;
    display: block;
    fill: currentcolor;
    height: 21px;
    margin: 13px auto;
    width: 24px;
  }
  </style>
</head>
<body>
    <noscript>
      
      <center>If you’re not redirected soon, please <a href="/">use this link</a>.</center>
    </noscript>
    <script nonce="SG0bV9rOanQfzG0ccU8WQw==">
      
      document.cookie = "app_shell_visited=1;path=/;max-age=5";
      
      location.replace(location.href.split("#")[0]);
    </script>
</body>
</html>
```


相比平时看到的其他站点的源码，可以说是很清爽了。没有乱七八糟的标签，功能却一样不少。特别有迷惑性，以为这便是页面所有的源码，但查看 DevTools 的 Source 面板后很容易知道这并不是真实的 HTML 代码。但为何页面源码给出的是如此清爽的版本，这里先不研究。

把目光移向 script 标签时，发现一个不认识的 `nonce` 属性。它以及它后面的神秘字符串成功引起了我的好奇。再去看 Google 首页的源码，也有好些 `nonce` 的运用。是时候去了解一下这里的 `nonce` 是什么了。

```diff
! <script nonce="SG0bV9rOanQfzG0ccU8WQw==">
      
      document.cookie = "app_shell_visited=1;path=/;max-age=5";
      
      location.replace(location.href.split("#")[0]);
    </script>
```



### Content Security Policy (CSP)

要了解  `nonce`， 先了解 [Content-Security-Policy(CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)。

我们都知道浏览器有同源策略（[same-origin policy](https://en.wikipedia.org/wiki/Same-origin_policy)）的安全限制，即每个站点只允许加载来自和自身同域（origin）的数据，`https://a.com` 是无法从 `https://b.com` 加载到资源的。每个站点被严格限制在了自已的孤岛上，自己就是一个沙盒，这样很安全，整个网络不会杂乱无章。主要地，它能解决大部分安全问题。假若没有同源策略，恶意代码能够轻松在浏览器端执行然后获取各种隐私信息：银行帐号，社交数据等。

> 那网站间如何进行数据共享，当然是有办法的，了解下 [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)。

现实中，问题是同源策略也并不是万无一失，跨域攻击 [Cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) 便包含五花八门绕开限制的手段，形式上通过向页面注入恶意代码完成信息的窃取或攻击。比如 UGC 类型的站点，因为内容依赖用户创建，这就开了很大一个口子，允许用户输入的内容运行在页面上。当然，因为我们都知道会有注入攻击，所以对用户输入的内容进行防 XSS 过滤也成了标配。

Content-Security-Policy 从另一方面给浏览器加了层防护，能极大地减少这种攻击的发生。


### 原理

CSP 通过告诉浏览器一系列规则，严格规定页面中哪些资源允许有哪些来源， 不在指定范围内的统统拒绝。相比同源策略，CSP 可以说是很严格了。

其实施有两种途径：
- 服务器添加  `Content-Security-Policy` 响应头来指定规则 
- HTML 中添加 `<meta>` 标签来指定  `Content-Security-Policy` 规则

![mobile.twitter.com header 中的 CSP 规则](https://user-images.githubusercontent.com/3783096/44004494-f3c9bdf2-9e95-11e8-8793-e2966d79ecae.png)￼
*mobile.twitter.com header 中的 CSP 规则*

为了测试方便，以下示例均使用 `<meta>` 标签来开启 CSP 规则。但 `<meta>` 中有些指令是不能使用的，后面会了解到。只有响应头中才能使用全部的限制指令。


#### 一个简单示例

创建一个 HTML 文件放入以下内容：

*csp_test.html*
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' https://unpkg.com">
    <title>CSP Test</title>
</head>
<body>
    <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
</body>
</html>
```

在该测试文件所在目录开启一个本地 server 以访问，这里使用 Python 自带的 server:

```bash
$ python -m SimpleHTTPServer 8000
```

然后访问 [localhost:8000](localhost:8000) 以观察结果：

![符合 CSP 规则情况下的正常访问](https://user-images.githubusercontent.com/3783096/44004498-fdd37004-9e95-11e8-895d-53797ae105c1.png)￼
*符合 CSP 规则情况下的正常访问*

然后我们将  `Content-Security-Policy` 改成不允许任何资源再试一下：

*csp_test.html*
```diff
<!DOCTYPE html>
<html lang="en">
<head>
-     <meta http-equiv="Content-Security-Policy" content="script-src 'self' https://unpkg.com">
+     <meta http-equiv="Content-Security-Policy" content="script-src ‘none’">
    <title>CSP Test</title>
</head>
<body>
    <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
</body>
</html>
```

![触发 CSP 规则资源被 block 的情况](https://user-images.githubusercontent.com/3783096/44004501-0fac3a18-9e96-11e8-98bf-01e77f4a5e6a.png)
*触发 CSP 规则资源被 block 的情况*

下面我们来解释这里设置的 CSP 规则及理解为何资源加载失败。


#### CSP 规则 

无论是 header 中还是 `<meta>` 标签中指定，其值的格式都是统一的，由一系列 CSP 指令（directive）组合而成。

示例：

```
Content-Security-Policy: <policy-directive>; <policy-directive>…
```

这里 directive，即指令，是 CSP 规范中规定用以详细详述某种资源的来源，比如前面示例中使用的 `script-src`，指定脚本可以有哪些合法来源，`img-src` 则指定图片，以下是常用指令：

* `base-uri` 限制可出现在页面 `<base>` 标签中的链接。
* `child-src` 列出可用于 worker 及以 frame 形式嵌入的链接。 譬如: `child-src https://youtube.com` 表示只能从 Youtube 嵌入视频资源。
* `connect-src` 可发起连接的地址 (通过 XHR, WebSockets 或 EventSource)。
* `font-src` 字体来源。譬如，要使用 Google web fonts 则需要添加 `font-src https://themes.googleusercontent.com` 规则。
* `form-action` `<form>` 标签可提交的地址。
* `frame-ancestors` 当前页面可被哪些来源所嵌入（与 `child-src` 正好相反）。作用于 `<frame>`, `<iframe>`, `<embed>` 及 `<applet>`。 该指令不能通过 `<meta>` 指定且只对非 HTML文档类型的资源生效。
* `frame-src` 该指令已在 level 2 中废弃但会在 level 3 中恢复使用。未指定的情况下回退到 `tochild-src` 指令。
* `img-src` 指定图片来源。
* `media-src` 限制音视频资源的来源。
* `object-src` Flash 及其他插件的来源。
* `plugin-types` 限制页面中可加载的插件类型。
* `report-uri` 指定一个可接收 CSP 报告的地址，浏览器会在相应指令不通过时发送报告。不能通过 `<meta>` 标签来指定。
* `style-src` 限制样式文件的来源。
* `upgrade-insecure-requests` 指导客户端将页面地址重写，HTTP 转 HTTPS。用于站点中有大量旧地址需要重定向的情形。
* `worker-src` CSP Level 3 中的指令，规定可用于 worker, shared worker, 或 service worker 中的地址。

> `child-src`  与 `frame-ancestors`  看起来比较像。前者规定的是页面中可加载哪些 iframe，后者规定谁可以以 iframe 加载本页。 比如来自不同站点的两个网页 A 与 B，B 中有 iframe 加载了 A。那么
> - A 的 `frame-ancestors` 需要包含 B
> - B 的 `child-src` 需要包含 A 


默认情况下，这些指令都是最大条件开放的，可以理解为其默认值为 `*`。比如 `img-src`，如果不明确指定，则可以从所有地方加载图片资源。

还有种特殊的指令 `default-src`，如果指定了它的值，则相当于改变了这些未指定的指令的默认值。可以理解为，上面 `img-src` 如果没指定，本来其默认值是 `*`，可以加载所有来源的图片，但设置 `default-src` 后，默认值就成了 `default-src` 指定的值。

常见的做法会设置 `default-src ‘self’`，这样所有资源都被限制在了和页面同域下。如果此时想要加载从 CDN 来的图片，将图片来源单独添加上即可。

```
Content-Security-Policy: default-src ‘self’; img-src https://cdn.example.com
```

现在来看开头那个示例，也许现在就能看明白了。因为页面中需要从 CDN 加载 React 库，所以我们`<meta>` 标签指定了如下 CSP 规则：

```
script-src 'self' https://unpkg.com
```

这里的 `self` 及后来改成的 `none` 是预设值，需用引号包裹，否则会当成 URI 来解析。这里的 CSP 规则表示页面中脚本只能从同域及 `https://unpkg.com` 加载。假如我们把后者去掉，同样会像上图截图那样 React 库会加载失败，同时控制台中会有加载失败的日志及被触发的规则列出来。

改成 `none` 之后表示页面不加载任何脚本，即使自己站点上的脚本都无法被加载执行。这里不妨试一下在 `csp_test.html` 旁边创建一个脚本文件 `test.js`:

*test.js*
```js
alert(‘来自 test.js 的问候！’)
```

同时在页面中引用它：

*csp_test.html*
```diff
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Security-Policy" content="script-src 'none'">
    <title>CSP Test</title>
</head>
<body>
    <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
+    <script src="./test.js"></script>
</body>
</html>
```

页面执行结果：

![script-src none 时页面将不加载任何脚本](https://user-images.githubusercontent.com/3783096/44004512-262c4df0-9e96-11e8-88e9-df4e08cb98f1.png)
*script-src none 时页面将不加载任何脚本*

是的，哪怕是自己的脚本也无法被加载执行。CSP 就是这样严格和明确，不存在模棱两可的情况。所以在指定来源时，我们需要确认 URI 是否正确。


### 指令可接受的值

指令后面跟的来源，有两种写法
- 预设值 
- URI 通配符


#### 预设值

其中预设值有以下这些：

* `none` 不匹配任何东西。
* `self` 匹配当前域，但不包括子域。比如 `example.com` 可以，`api.example.com` 则会匹配失败。
* `unsafe-inline` 允许内嵌的脚本及样式。是的，没看错，对于页面中内嵌的内容也是有相应限制规则的。
* `unsafe-eval` 允许通过字符串动态创建的脚本执行，比如 `eval`，`setTimeout` 等。

特别地，在 CSP 的严格控制下，页面中内联脚本及样式也会受影响，在没有明确指定的情况下，其不能被浏览器执行。

考虑下面的代码：

*csp_test.html*
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>CSP Test</title>
    <style>
        body{
            color:red;
        }
    </style>
</head>
<body>
    <h1>Hello, World!</h1>
    <script>
        window.onload=function(){
            alert('hi jack!')
        }
    </script>
</body>
</html>
```
￼
![未指定 CSP 的情况](https://user-images.githubusercontent.com/3783096/44004521-427e59bc-9e96-11e8-9608-743f4e3bfefe.png)
*未指定 CSP 的情况*

根据 MDN 上的描述，如果站点未指定 CSP 无则，浏览器默认不会开启相应检查，所以上面一切运行正常，只受正常的同域限制 。

> If the site doesn't offer the CSP header, browsers likewise use the standard same-origin policy.
*— 来自 [ MDN 关于 Content Security Policy (CSP) 的描述](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)*

我们加上 CSP 限制：


*csp_test.html*
```diff
<!DOCTYPE html>
<html lang="en">
<head>
+    <meta http-equiv="Content-Security-Policy" content="default-src 'self'">
    <title>CSP Test</title>
    <style>
        body{
            color:red;
        }
    </style>
</head>
<body>
    <h1>Hello, World!</h1>
    <script>
        window.onload=function(){
            alert('hi jack!')
        }
    </script>
</body>
</html>
```

配置站点默认只信息同域的资源，但注意，这个设置并不包含内联的情况，所以结果会如下图。

![内联代码被禁止](https://user-images.githubusercontent.com/3783096/44004526-54cf1a5c-9e96-11e8-8bca-c980e51a82ae.png)
*内联代码被禁止*

如何修复它呢。如果我们想要允许页面内的内联脚本或样式，则需要明确地通过 `script-src` 和 `style-src` 指出来。

*csp_test.html*
```diff
<!DOCTYPE html>
<html lang="en">
<head>
!    <meta http-equiv="Content-Security-Policy" content="default-src 'self' ‘unsafe-inline’”>
    <title>CSP Test</title>
    <style>
        body{
            color:red;
        }
    </style>
</head>
<body>
    <h1>Hello, World!</h1>
    <script>
        window.onload=function(){
            alert('hi jack!')
        }
    </script>
</body>
</html>
```

这里 `default-src 'self' ‘unsave-inline’` 配置默认可信的来源有这些： 和页面同域的，以及内联的。

刷新页面，样式及脚本又可以正常执行了。

通常是不建议使用 `unsafe-inline` 的（同样也不推荐使用 `unsafe-eval`），因为内联的脚本和样式维护不便，也不利用良好地组织代码。最佳实践是样式抽离到样式文件，脚本放到单独的 js 文件中加载，让 HTML 文件纯粹一点才是好的做法。即使是 `onclick=“myHandler”` 或 `href=“javascript:;”` 这种平时常见的写法，也属于内联的脚本，是需要改造的。

如果页面中非得用内联的写法，还有种方式。即页面中这些内联的脚本或样式标签，赋值一个加密串，这个加密串由服务器生成，同时这个加密串被添加到页面的响应头里面。

```html
<script nonce=EDNnf03nceIOfn39fn3e9h3sdfa>
  // 这里放置内联在 HTML 中的代码
</script>
```

页面 HTTP 响应头的 `Content-Security-Policy` 配置中包含相同的加密串：

```
Content-Security-Policy: script-src 'nonce-EDNnf03nceIOfn39fn3e9h3sdfa'
```

注意这里的 `nonce-` 前缀。

这也就是文章开头看到的方式，到这里明白了。 

`<style>` 标签也是类似的处理。

这里的加密串一定是随机不可预测的，否则达不到安全效果，且每次页面被访问时重新生成。

除了使用 `noce` 指定加密串，还可以通过混淆的 hash 值来达到目的。这种做法不需要在标签上加 `nonce` 而是将需要内嵌的代码本身使用加密算法生成 hash 后放入 CSP 指令中作为值使用，这里的加密算法支持 sha256, sha384 和 sha512。此时 CSP 中使用的前缀为相应的算法名。

hash 方式的示例：

```html
<script>alert('Hello, world.');</script>
```

```
Content-Security-Policy: script-src 'sha256-qznLcsROx4GACP2dm0UCKCzCG-HiZ1guq6ZZDob_Tng='
```


### eval

js 中好些地方是可以以字符串方式动态创建代码并执行，这被认为是不安全的，所以不推荐使用，一般最佳实践里都会提。

- `setTimeout/setInterval` 可接收一段字符串作为代码执行。`setTimout(‘alert(1)’,1000)`。
- `eval` 。`eval(‘alert(1)’)`。
- `Function` 构造函数。 `new Function(‘alert(1)’)`。

和内联一样，有专门的指令 `unsafe-eval ` 以允许类似代码的执行。但建议的做法是对于 `eval` 和 `Function` 构造器，杜绝使用，而 `setTimeout/setInterval` 可改造为非字符串形式。

```js
setTimout(function(){
  alert(1);
}, 1000)
```

### URI 

除了上面的预设值，还可通过提供完整的 URI 或带通配符 `*` 的地址来匹配，以指定资源的合法来源。这里 URI 的规则和配置服务器的跨域响应头是一样的，参考 [Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)。

- `*://*.example.com:*` 会匹配所有 `example.com` 的子域名，但不包括 `example.com`。
- `http://example.com` 和 `http://www.example.com` 是两个不同的 URI。
- `http://example.com:80` 和 `http://example.com` 也是是两个不同的 URI，虽然网站默认端口就是 80

> 根据维基百科 [Uniform Resource Identifier 页面](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier) 给出的解释，一个完整的 URI 由以下部分组成：
> `URI = scheme:[//authority]path[?query][#fragment]`
>
> 其中 `authority` 又包含：
> `authority = [userinfo@]host[:port]`
>
> 所以你可以认为其中某一项不同，那都是两个 URI。了解这点很重要，一如上面列出的第一条例子 `*.example.com`， 我们很容易先入为主地认为既然已经允许了该域名的所有子域名，那必然 `example.com` 也是合法的。

因为 URI 是进行动态匹配的，所以解释了上面提到的预设值缘何要加引号。因为如果不加引号的话， `self` 会表示 host 是 `self` 的资源地址，而不会表示原有的意思。


#### 优先级

CSP 的配置是很灵活的。每条指令可指定多个来源，空格分开。而一条 CSP 规则可由多条指令组成，指令间用分号隔开。各指令间没有顺序的要求，因为每条指令都是各司其职。甚至一次响应中， `Content-Security-Policy` 响应头都可以重复设置。

我们来看这些情形下 CSP 的表现。

- 对于设置了多次响应头的情况，最严格的规则会生效。比如下面两条响应头中，虽然 第二条中设置 `connect-src` 允许 `http://example.com/`，但第一条里面设置了 `connect-src` 为 `none`，所以更加严格的 `none` 会生效。参见 [Multiple content security policies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#Multiple_content_security_policies)。

```
Content-Security-Policy: default-src 'self' http://example.com;
                         connect-src 'none';
Content-Security-Policy: connect-src http://example.com/;
                         script-src http://example.com/
```


- 同一指令多次指定，以第一个为准，后续的会被忽略。

*csp_test.html*
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Security-Policy" content="default-src 'self';default-src 'unsafe-inline';">
    <title>CSP Test</title>
    <style>
        body{
            color:red;
        }
    </style>
</head>
<body>
    <h1>Hello, World!</h1>
    <script>
        window.onload=function(){
            alert('hi jack!')
        }
    </script>
</body>
</html>
```

![重复配置同一指令时效果展示](https://user-images.githubusercontent.com/3783096/44004528-6a4a9f5a-9e96-11e8-88b6-6aee3342ed08.png)
*重复配置同一指令时效果展示*

很智能地， 浏览器不仅会将检测不过的资源及指令打印出来，重复配置时被忽略的指令也会提示出来。

- 指定 `default-src` 的情况下，它会充当 [Fetch 类指令](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#Fetch_directives) 的默认值。即  `default-src` 并不对所有指令生效，其他指令默认值仍是 `*`。


### 发送报告

当检测到非法资源时，除了控制台看到的报错信息，也可以让浏览器将日志发送到服务器以供后续分析使用。接收报告的地址可在 `Content-Security-Policy` 响应头中通过 `report-uri` 指令来配置。当然，服务端需要编写相应的服务来接收该数据。

```
Content-Security-Policy: default-src 'self'; ...; report-uri /my_amazing_csp_report_parser;
```

服务端拿到的是以 JSON 形式传来的数据。

```js
{
  "csp-report": {
    "document-uri": "http://example.org/page.html",
    "referrer": "http://evil.example.com/",
    "blocked-uri": "http://evil.example.com/evil.js",
    "violated-directive": "script-src 'self' https://apis.google.com",
    "original-policy": "script-src 'self' https://apis.google.com; report-uri http://example.org/my_amazing_csp_report_parser"
  }
}
```


### 报告模式

CSP 提供了一种报告模式，该模式下资源不会真的被限制加载，只会对检测到的问题进行上报 ，以 JSON 数据的形式发送到 `report-uri` 指定的地方。

通过指定 `Content-Security-Policy-Report-Only` 而不是 `Content-Security-Policy`，则开启了报告模式。

```
Content-Security-Policy-Report-Only: default-src 'self'; ...; report-uri /my_amazing_csp_report_parser;
```

当然，你也可以同时指定两种响应头，各自里的规则还会正常执行，不会互相影响。比如：

```
Content-Security-Policy: img-src *;
Content-Security-Policy-Report-Only: img-src ‘none’; report-uri http://reportcollector.example.com/collector.cgi
```

这里图片还是会正常加载，但是 `img-src ‘none’` 也会检测到并且发送报告。

报告模式对于测试非常有用。在开启 CSP 之前肯定需要对整站做全面的测试，将发现的问题及时修复后再真正开启，比如上面提到的对内联代码的改造。


### 推荐的做法

这样的安全措施当然是能尽快启用就尽快。以下是推荐的做法：
- 先只开启报告模式，看影响范围，修改问题。
- 添加指令时从 default-src ‘none’ 开始，查看报错，逐步添加规则直至满足要求。
- 上线后观察一段时间，稳定后再由报告模式转到强制执行。


### 浏览器兼容性

目前发布的[ Level 3 规范](https://www.w3.org/TR/CSP3/) 中大部分还未被浏览器实现，通过  [Can I Use 的数据](https://caniuse.com/#search=CSP) 来看，除 IE 外，Level 2 的功能已经得到了很好的支持。这里还有一分来自 W3C 跟踪的各浏览器实现情况的统计：[Implementation Report for Content Security Policy Level 2](https://w3c.github.io/webappsec/implementation_reports/CSP2_implementation_report.html)。

对于浏览器不支持的情况，也不必担心，会回退到同源策略的限制上。


### 相关资源

- [Why is the same origin policy so important?](https://security.stackexchange.com/questions/8264/why-is-the-same-origin-policy-so-important)
- [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Content Security Policy from Web Fundamentals](https://developers.google.com/web/fundamentals/security/csp/)
- [Improving Browser Security with CSP](https://blog.twitter.com/engineering/en_us/a/2011/improving-browser-security-with-csp.html)



    