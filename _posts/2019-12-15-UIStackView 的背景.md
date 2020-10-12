---
layout: post
title: "UIStackView 的背景"
date: 2019-12-15 13:12:00 +0800
tags: 
---
    
## UIStackView 的背景

UIStackView 作为布局组件，本身的 `drawRect` 是不会被调用的，其 `backgroundColor` 属性会被忽略。

所以，虽然以下设置 `backgroundColor` 的代码是合法能够编译的，但其实并不起作用。

```objc
UIStackView *view = [UIStackView new];
view.backgroundColor = [UIColor redColor];
```

要设置 UIStackView 的背景，就只能变通来做，

- 将其添加到另一个 UIView 中，设置后者的背景色
- 或者添加一个子元素到其中专门用来设置背景色。

第一种方法好理解，既然 UIStackView 没有背景色，那自然它放哪就用的谁的背景。

第二种方式可通过扩展 UIStackView 来做：

Objecitve-C 版本：

```objc
- (void)addBackground:(UIColor *)color {
  UIView *subView = [[UIView alloc] initWithFrame:self.bounds];
  subView.backgroundColor = color;
  subView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  [self insertSubview:subView atIndex:0];
}
```

**NOETS**：其中 [`autoresizingMask`](https://developer.apple.com/documentation/uikit/uiview/1622559-autoresizingmask?language=objc) 指定视图在父级元素尺寸发生变化时自身如何重新适配。这里即背景层始终保持填充父级元素。

使用：

```objc
UIStackView *view = [UIStackView new];
[view addBackground:[UIColor redColor]];
```

Swift 版本：

```swift
extension UIStackView {
    func addBackground(color: UIColor) {
        let subView = UIView(frame: bounds)
        subView.backgroundColor = color
        subView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        insertSubview(subView, at: 0)
    }
}
```



## 相关资源

- [How to change the background color of UIStackView?](https://stackoverflow.com/a/34868367/1553656)

    