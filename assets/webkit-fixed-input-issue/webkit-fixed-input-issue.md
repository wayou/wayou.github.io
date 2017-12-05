## iOS 11 中 fixed 容器中 输入框光标错位的问题

iPhone 升级到 iOS11 后，发现个前端页面上的问题。

固定式浮层内的输入框光标会发生偏移。即 `fixed` 定位的容器中输入框光标的位置显示不正确，没有正常地显示在输入框中，而是偏移到了输入框外面。

点击查看复现 [demo](https://wayou.github.io/assets/webkit-fixed-input-issue/src/index.html) 

示例录屏：[ScreenRecording.MP4](https://raw.githubusercontent.com/wayou/wayou.github.io/master/assets/webkit-fixed-input-issue/assets/ScreenRecording.MP4)

这个问题很容易复现，特别是在产品中运用了大量弹窗式交互的情况下，会很普遍。

只要满足以下条件即可触发此问题：
- 页面 body 高度超过视窗高度，即页面有简直的滚动条
- 点击页面中 `fixed` 定位的容器中的输入框，键盘弹起如果发生页面滚动
- 或者键盘弹起后手动滚动页面

则会出现如上面视频中光标偏移的问题。偏移量为页面滚动的距离。

惊不惊喜？意不意外？

进一步，我们用 Safari 调试工具对页面进行审查发现，键盘弹起视图向上调整了，但页面中元素所占的位置，其实并没有向上进行调整！

输入框所占的位置还是原来键盘未弹起时的位置。

![](https://raw.githubusercontent.com/wayou/wayou.github.io/master/assets/webkit-fixed-input-issue/assets/dom-element-position.png)

![](https://raw.githubusercontent.com/wayou/wayou.github.io/master/assets/webkit-fixed-input-issue/assets/safari-inspect-element.png)

这就尴尬了。页面：我也很无奈啊~ 一般键盘相关的问题都很坑，安卓上也会有各种键盘相关的坑。

Google 了一下，确实有相关问题。譬如这篇 medium 文章[How to fix the iOS 11 input element in fixed modals bug](https://hackernoon.com/how-to-fix-the-ios-11-input-element-in-fixed-modals-bug-aaf66c7ba3f8) 有相关吐槽，并且已经给 Apple 报了 bug [Wrong caret position for input field inside a fixed position parent on iOS 11](https://bugs.webkit.org/show_bug.cgi?id=176896).

目测确实是 iOS 11 新版 WebKit 引入 的 bug。目前弹窗内放表单的交互还是蛮多的。如果需要快速修复，只能从前端来做文章。

- 因为是 `fixed` 定位才会有的问题，所以可以考虑将元素去掉固定定位，这一般就需要重新考虑页面的实现了，发动较大
- 测试中发现，如果在输入过程中页面发生滚动会引起该问题，譬如，我们可以在弹窗显示时，通过给 `body` 设置相关样式，使`body`不可滚动。
```css
overflow: hidden;
```

方式二是比较快且感动较少的，需要注意弹窗关闭时记得取恢复 `body`的滚动。

- the reported webkit bug: https://bugs.webkit.org/show_bug.cgi?id=176896

- related article https://hackernoon.com/how-to-fix-the-ios-11-input-element-in-fixed-modals-bug-aaf66c7ba3f8


