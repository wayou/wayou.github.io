title: Safari Private 模式下 localStorage 的问题
toc: true
date: 2017-06-17 00:28:42
categories:
tags:
- safari
- localStorage
---

现如今好多浏览器都有「隐身模式」，Safari 管这叫「Private Browing」，国内各种牌子的套壳浏览器叫「无痕浏览」。私以为从命名上来说，倒是国内更中文一些。
![虽然标题暗标要讨论的是 Safari，但配图我喜欢这个 Chrome ](chrome-incognito.jpg)
<!-- more -->

这种模式下浏览网页踏雪无痕，雁过不留声。具体来说，与正常模式的区别是浏览器不会保存历史记录，没有页面缓存，所有本地数据也都是临时的，页面关闭后无法还原。譬如本文下面要讲到的 `localStorage`。

<aside class="caution">
并不是说这种模式下绝对安全，服务器仍然对用户的浏览是有感知的。所以 IP 什么的依然可以追踪。
这世界并不如我们天真设想般烂漫。
</aside>  

```bash
--------- LOG ---------
00:00:01 - 一位不具名用户在零点零一分进行了访问
00:00:02 - 一位不愿透露姓名的用户在零点零二分打开了你丢弃在服务器 `社会科学/东方艺术鉴赏/东瀛国浮世绘` 中的资源 `ae2bx86.jpg`
```

从功能上来说，普通用户大概鲜有人知道这一功能（产品情怀就这样被用户无视，PM 们默默泪目），而开发者则利用其干净的特点来开发调试，排除程序之外的因素导致 bug 的可能。

因为所有本地数据都是临时的，那么问题来了，如果网页代码中还使用了诸如 `localStorage` 的本地存储，还能生效吗？

答案是肯定的，但只针对本次访问。这个肯定只限于桌面浏览器。 而手机端则不然。

iOS 上 Safari private 模式下浏览器假装支持 `localStorage`，并在全局 `window` 上暴露了该方法。但是当你在调用 `localStorage.setItem` 进行保存的时候就会报 `QUOTA_EXCEEDED_ERR` 错。

```js
QUOTA_EXCEEDED_ERR:DOM Exception 22:An attempt was made to add something to storage...
```

考察下面的测试代码：

```js
<button class="setValue">SET</button>
<hr>
<button class="getValue">GET</button>
<script>
    var q = document.querySelector;
    document.querySelector('.setValue').onclick = function () {
        try {
            var time = new Date().getTime();
            localStorage.setItem('time', time);
            alert('set '+time);
        } catch (error) {
            alert(JSON.stringify(error));
        }
    }
    document.querySelector('.getValue').onclick = function () {
        var content = localStorage.getItem('time', new Date().getTime());
        alert('got '+content);
    }
</script>
```

我在页面放了两个按钮，一个用于向浏览器保存值，一个用于获取。

下面是测试结果：

- iOS Safari 隐私模式设置值
![iOS Safari 隐私模式设置值](ios-safari-set.png)

- iOS Safari 隐私模式获取值
![iOS Safari 隐私模式获取值](ios-safari-get.png)

- iOS Chrome 隐私模式设置值
![iOS Chrome 隐私模式设置值](ios-chrome-get.png)

- iOS Chrome 隐私模式获取值
![iOS Chrome 隐私模式获取值](ios-chrome-get.png)

这表明在 iOS 上，不仅是 Safari 在隐私模式中不能使用 localStorage, Chrome 也不行也不行。这不禁让人怀疑跟系统平台的策略有关。

博主是谷粉，很早就入手了 Nexus。本着严谨的做事态度，那肯定也得拿来测试一下丫。而安卓机上的测试则让人无法接受。

- 安卓 Chrome 隐私模式下设置值
![安卓 Chrome 隐私模式下设置值](android-chrome-get.png)

- 安卓 Chrome 隐私模式下获取值
![安卓 Chrome 隐私模式下获取值](android-chrome-get.png)

是的，安卓上面并没有表现出假装支持 `localStorage`，而是真正的支持，能存能取，能取能用！两次证实了上面的怀疑，这种假装的支持应该是 iOS 的设计哲学。

回过头来想，隐私模式主要的功能不就是让用户的数据不被追踪吗，如果能够存取数据的话，反而没那么隐私了。从这点来说，`localStorage` 设置不成功倒也考量了些许人文情怀在里面。

问题想当于回到了开发者手中，我们在开发过程中使用 `loaclStorage` 就需要对这种情况进行兼容，以譬如 js 报错后影响整个页面的功能。

下面是兼容代码示例：

```js
function isLocalStorageSupport(){
    try {
        var isSupport = 'localStorage' in window && window['localStorage'] !== null;
        if (isSupport) {
            localStorage.setItem('__test', '1');
            localStorage.removeItem('__test');
        }
        return isSupport;
    } catch (e) {
        return false;
    }
}
```

为此，我们可以考虑提取一个辅助类来封装 `localStorage`，这样就可以随时随地放心使用。
