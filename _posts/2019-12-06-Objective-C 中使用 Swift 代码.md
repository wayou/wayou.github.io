---
layout: post
title: "Objective-C 中使用 Swift 代码"
date: 2019-12-07 00:12:00 +0800
tags: 
---
    
# Objective-C 中使用 Swift 代码

因为 Apple 强推 Swift，后者势头不减，社区各种优秀的配套也都跟上来，比如做动画的 [Spring](https://github.com/MengTo/Spring)，是用 Swfit 写的。

所以，就会有需求是 Objective-C 中使用这些优秀的库。

## 创建桥接声明文件

默认情况下，当你在一个 Objective-C 项目中创建 Swfit 文件时，Xcode 会自动创建两种语言间的桥接声明文件（Bridging Header），通过这个桥接文件使得两者可互调。

这里只看 Objective-C 中调用 Swift 的情况。

有文章指将需要使用的 Swift 代码挺入打开 Objective-C 项目的 Xocde 时，这个互相调用的环境就会自动创建，实测无效。还是要手动来。

- 为了使 Xcode 自动配置互调的环境，在 Objective-C 项目中新建一个 Swfit 文件，名称随便，内容随便。点击完成时，会得到一个是否创建桥接声明文件的提示，当然选择创建了。

![创建桥接声明文件](https://user-images.githubusercontent.com/3783096/70340258-69a28200-188b-11ea-8b08-00b84bbe5ebe.png)
<p align="center">创建桥接声明文件</p>

顺利的话，就不用折腾额外的配置了。

后面在需要使用 Swift 代码的地方，引入 `<项目名>-Swift.h` 声明文件即可。

```objc
#import "ProductModuleName-Swift.h"
```

这里的项目名实际上是工程的 `Product Module Name`，默认情况下即创建工程时输入的那个名称，可在工程的 "Build Settings" - "Packaging" 中找到。

![项目的 Product Module Name](https://user-images.githubusercontent.com/3783096/70340256-6909eb80-188b-11ea-94eb-55eef2c964da.png)
<p align="center">项目的 Product Module Name</p>

## 测试

在刚刚创建的 Swift 文件中添加示例代码，以在 Objective-C 中调用：

```swift

import Foundation

public class Foo: NSObject {
    @objc public func greeting(){
        NSLog("hello %@", "world!");
    }
}

```

**注意**：在完成 Swfit 代码编写后，执行一次清理重新编译一遍，这是为了更新桥接声明文件，以便 Objective-C 中能够正常使用，否则会报找不到的错误。

调用：

```objc
@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    Foo *foo = [[Foo alloc]init];
    [foo greeting];
}

@end
```

运行效果：

![Objective-C 中调用 Swift](https://user-images.githubusercontent.com/3783096/70340254-6909eb80-188b-11ea-8046-a77c7339de03.png)
<p align="center">Objective-C 中调用 Swift</p>



## 引入 Spring 动画库并使用

- Clone [Spring](https://github.com/MengTo/Spring) 到本地并在 finder 中打开。

- 将 "Spring" 这个文件夹整个拖进项目。

![添加 Swfit 库到 Objective-C 项目中](https://user-images.githubusercontent.com/3783096/70340250-68715500-188b-11ea-9c15-4915c7b13ec7.png)
<p align="center">添加 Swfit 库到 Objective-C 项目中</p>


- 同样，因为添加了新的 Swift 文件，在使用前，先走一遍编译。但需要先删掉刚刚拖进来文件夹中的 info.plist 文件，否则会报错

<details>
<summary>添加 Spring 的 Swift 文件后编译报错信息</summary>

```
Multiple commands produce '/some/path/Library/Developer/Xcode/DerivedData/AnimationDemo-fhnpmfdgpuonqdevdvdysbcfjivn/Build/Products/Debug-iphonesimulator/AnimationDemo.app/Info.plist':
1) Target 'AnimationDemo' (project 'AnimationDemo') has copy command from '/some/path/work/dev/github/AnimationDemo/AnimationDemo/Spring/Info.plist' to '/some/path/Library/Developer/Xcode/DerivedData/AnimationDemo-fhnpmfdgpuonqdevdvdysbcfjivn/Build/Products/Debug-iphonesimulator/AnimationDemo.app/Info.plist'
2) Target 'AnimationDemo' (project 'AnimationDemo') has process command with output '/some/path/Library/Developer/Xcode/DerivedData/AnimationDemo-fhnpmfdgpuonqdevdvdysbcfjivn/Build/Products/Debug-iphonesimulator/AnimationDemo.app/Info.plist'
```
</details>

- 创建动画

```objc
@implementation ViewController

- (void)viewDidLoad {
  [super viewDidLoad];

  CGSize screenSize = self.view.frame.size;
  CGFloat cubeSize = 50.0f;
  SpringView *springView = [[SpringView alloc]
      initWithFrame:CGRectMake((screenSize.width - cubeSize) / 2,
                               (screenSize.height - cubeSize) / 2, cubeSize, cubeSize)];
  springView.backgroundColor = [UIColor redColor];
  springView.animation = @"flipX";
  springView.autostart = YES;
  springView.duration = 3.0f;
  springView.repeatCount = INFINITY;
  [springView animate];
  [self.view addSubview:springView];
}

@end
```

动画效果：

![Spring 动画运行效果](https://user-images.githubusercontent.com/3783096/70340252-6909eb80-188b-11ea-9d54-98ade26f3105.gif)
<p align="center">Spring 动画运行效果</p>

## 代码

一个可工作的项目代码可在 [wayou/AnimationDemo](https://github.com/wayou/AnimationDemo) 找到。

## 相关资源

- [Importing Swift into Objective-C](https://developer.apple.com/documentation/swift/imported_c_and_objective-c_apis/importing_swift_into_objective-c)
    