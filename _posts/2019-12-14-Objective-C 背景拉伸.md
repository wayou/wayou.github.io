---
layout: post
title: "Objective-C 背景拉伸"
date: 2019-12-15 01:12:00 +0800
tags: 
---
    
# Objective-C 背景拉伸

## 背景拉伸的问题

考察如下添加按钮的代码：

```objc
- (void)loadView {
  [super loadView];
  UIButton *myBtn = [UIButton buttonWithType:UIButtonTypeCustom];
  [myBtn setContentEdgeInsets:UIEdgeInsetsMake(10, 50, 10, 50)];
  [myBtn setTitle:@"click me" forState:UIControlStateNormal];
  [myBtn setBackgroundImage:[UIImage imageNamed:@"purple_button"]
                   forState:UIControlStateNormal];
  [self.view addSubview:myBtn];
  // ...
}
```

得到的结果：

![圆角被拉伸的效果](https://user-images.githubusercontent.com/3783096/70847855-5b182400-1ea4-11ea-8fe6-061c21d93580.png)
<p align="center">圆角被拉伸的效果</p>

这里图片作为背景时，默认被拉伸，造成了图片圆角的变形。

## 背景平铺

也有不变形的情况，使用图片创建 UIColor 作为背景。但此时背景图片是按原大小平铺开的，代码及效果如下：

```objc
UIColor *bgColor =
    [UIColor colorWithPatternImage:[UIImage imageNamed:@"purple_button"]];
[myBtn setBackgroundColor:bgColor];
```

![平铺的背景](https://user-images.githubusercontent.com/3783096/70847894-ca8e1380-1ea4-11ea-9e66-1f099ebf38b6.png)
<p align="center">平铺的背景</p>

这种适用用来创建纯色背景，比如用一张 1X1 的图片。（为啥不直接使用 UIColor 的纯色？）

## 精准拉伸

像开头的那种情况，其实只需要拉伸图片的中间部分，保持四个角落即可。

原生 API 中确实也有相应的方法提供支持，那就是 [`resizableImageWithCapInsets:`](https://developer.apple.com/documentation/uikit/uiimage/1624102-resizableimagewithcapinsets?language=objc)。

通过它可以指定图片四个角落的区域，这四个指定出来的区域在拉伸时不受影响。

![保留四个角的示意图](https://user-images.githubusercontent.com/3783096/70847904-eb566900-1ea4-11ea-9316-9d7c84d3cd20.png)
<p align="center">保留四个角的示意图</p>

所以修正后的圆角可以这样来实现：

```objc
UIImage *bgImage = [UIImage imageNamed:@"purple_button"];
UIImage *resizedImage =
    [bgImage resizableImageWithCapInsets:UIEdgeInsetsMake(10, 10, 10, 10)];
[myBtn setBackgroundImage:resizedImage forState:UIControlStateNormal];
```
修正后的效果：

![修正后的圆角](https://user-images.githubusercontent.com/3783096/70847913-07f2a100-1ea5-11ea-8255-68906e91a998.png)
<p align="center">修正后的圆角</p>

该方法比较常用的地方还有就是聊天窗口的背景，将聊天气泡四个角保护起来，内部任意拉伸，就可以展示任意聊天文本了。

![聊天气泡背景](https://user-images.githubusercontent.com/3783096/70847917-1f318e80-1ea5-11ea-8352-c7b79eb996ba.png)
<p align="center">聊天气泡背景</p>

## 单个方向上的拉伸

虽然 [`resizableImageWithCapInsets:`](https://developer.apple.com/documentation/uikit/uiimage/1624102-resizableimagewithcapinsets?language=objc) 很有用，但也只解决了部分场景。

请看如下的 tab bar 展现：

![带弧形的 tab bar 背景](https://user-images.githubusercontent.com/3783096/70847921-37091280-1ea5-11ea-9b4a-745596e070ac.png)
<p align="center">带弧形的 tab bar 背景，图片来自 <a href="https://api.flutter.dev/flutter/material/Scaffold-class.html">flutter 文档</a></p>

因为横向宽度在不同屏幕下是不一样的，很自然地，这里的效果，我们只需要如下图片即可：

![tab bar 背景](https://user-images.githubusercontent.com/3783096/70847940-7fc0cb80-1ea5-11ea-869c-3c9172b3c354.png)
<p align="center">tab bar 背景</p>

仔细一想，这里的场景需要拉伸的是两边，而不是图片的中间。所以 `resizableImageWithCapInsets:` 在这里派不上用场，需要自行解决。

我们可以在 UIImage 上扩展一个方法，来解决这里只拉伸两边的需求。

以下实现来自 [StackOverflow Klass 的回答](https://stackoverflow.com/a/15443581/1553656)：

```objc
- (UIImage *)pbResizedImageWithWidth:(CGFloat)newWidth andTiledAreaFrom:(CGFloat)from1 to:(CGFloat)to1 andFrom:(CGFloat)from2 to:(CGFloat)to2  {
    NSAssert(self.size.width < newWidth, @"Cannot scale NewWidth %f > self.size.width %f", newWidth, self.size.width);

    CGFloat originalWidth = self.size.width;
    CGFloat tiledAreaWidth = (newWidth - originalWidth)/2;

    UIGraphicsBeginImageContextWithOptions(CGSizeMake(originalWidth + tiledAreaWidth, self.size.height), NO, self.scale);

    UIImage *firstResizable = [self resizableImageWithCapInsets:UIEdgeInsetsMake(0, from1, 0, originalWidth - to1) resizingMode:UIImageResizingModeTile];
    [firstResizable drawInRect:CGRectMake(0, 0, originalWidth + tiledAreaWidth, self.size.height)];

    UIImage *leftPart = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();

    UIGraphicsBeginImageContextWithOptions(CGSizeMake(newWidth, self.size.height), NO, self.scale);

    UIImage *secondResizable = [leftPart resizableImageWithCapInsets:UIEdgeInsetsMake(0, from2 + tiledAreaWidth, 0, originalWidth - to2) resizingMode:UIImageResizingModeTile];
    [secondResizable drawInRect:CGRectMake(0, 0, newWidth, self.size.height)];

    UIImage *fullImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();

    return fullImage;
}
```

类似 `resizableImageWithCapInsets:`，这里扩展的方法也会返回一张拉伸好的新图片。不同之处在于，指定好两边需要拉伸的部分后，得到的是只拉伸两边而保留了中间的图片。


## 相关资源

- [https://stackoverflow.com/questions/15427317/how-to-stretch-a-uiimageview-without-stretching-the-center](https://stackoverflow.com/questions/15427317/how-to-stretch-a-uiimageview-without-stretching-the-center)
- [resizableImageWithCapInsets:](https://developer.apple.com/documentation/uikit/uiimage/1624102-resizableimagewithcapinsets?language=objc)

    