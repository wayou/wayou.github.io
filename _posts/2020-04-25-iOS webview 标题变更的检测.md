---
layout: post
title: "iOS webview 标题变更的检测"
date: 2020-04-25 11:04:00 +0800
tags: iOS
---
    
# iOS webview 标题变更的检测

## 问题

实测，iOS webview 中通过 js 设置 `document.title` 后不会触发 native 导航上标题的更新。安卓上是没问题的。

## iframe 方式

iOS 的 WKWebview 其标题是在页面 `pageload` 事件时设置的。于是有 hack 方式是说在想要变更页面标题时，通过在页面创建一个 iframe 来间接实现。

原理就像刚刚说的，因为 iframe 会触发文档的加载，于是会触发 `pageload` 从而更新 native 的标题。代码类似这样：

```js
function changeTitle(title) {
    document.title = title;
    let i = document.createElement('iframe');
    i.style.display = 'none';
    i.src = 'xxx'; // 加载当前页面下一个体积小的资源，比如favicon.ico
    i.onload = ()=>{
        setTimeout(()=>{
            i.remove()
        }, 0);
    }
    document.body.appendChild(i);
}

```

但，经验证无效。有可能之前是有效的哈，不细跟了。

## navite 添加对标题变更的监听

既然从页面本身来说，改变了 title 不生效，只能 native 部分来处理了。两种方式，

- 添加相应的通信，比如通过 jsbridge 让页面发送更新标题的指令给 native
- native 自动监听页面标题的变化

前者有点过，就为标题更新单独添加通信，徒增复杂度。后者是比较科学的方式。具体实施代码如下：

### Swift

```swift
webView.addObserver(self, forKeyPath: #keyPath(WKWebView.title), options: .new, context: nil)
```

```swift
override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
    if keyPath == "title" {
        if let title = webView.title {
            print(title)
        }
    }
}
```

### Objective-C 版本

```objc
[self.webView addObserver:self
                 forKeyPath:@"title"
                    options:NSKeyValueObservingOptionNew
                    context:NULL];
```

```objc
- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary *)change
                       context:(void *)context {
  if ([keyPath isEqualToString:@"title"]) {
    if (self.reactTitleChange) {
      self.navigationItem.title = self.webView.title;
    }
  }
}
```

## 后记

另外，别忘了页面销毁时清理掉该监听。

```objc
[_webView removeObserver:self forKeyPath:@"title"];
```

## 相关资源

- [The Ultimate Guide to WKWebView](https://www.hackingwithswift.com/articles/112/the-ultimate-guide-to-wkwebview)
- [iOS 下实现 webview 标题修改](https://juejin.im/post/5a241ac751882555cc41adac)
    