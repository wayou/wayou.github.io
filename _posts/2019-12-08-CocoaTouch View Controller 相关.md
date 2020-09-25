---
layout: post
title: "CocoaTouch View Controller 相关"
date: 2019-12-08 13:12:00 +0800
tags: 
---
    
# CocoaTouch View Controller 相关

应用的内容呈现在一个 window 中，一个 window 需要包含一个 rootViewController 来管理应用中数据，视图的展现及跳转。所以 View Controller  会扮演很重要的角色。

## 视图控制器/View Controller

View Controller 用来管理视图，比如视图创建，跳转到其他视图，同时充当界面与数据的中间人，管理数据变更及数据在视图中的展现。

所以可分为两类，
- 容器类，比如 [UINavigationController](https://developer.apple.com/documentation/uikit/uinavigationcontroller)，[UISplitViewController](https://developer.apple.com/documentation/uikit/uisplitviewcontroller) 及 [UIPageViewController](https://developer.apple.com/documentation/uikit/uipageviewcontroller) ...
- 内容类。[UITableViewController](https://developer.apple.com/documentation/uikit/uitableviewcontroller)，[UICollectionViewController](https://developer.apple.com/documentation/uikit/uicollectionviewcontroller) 等，还包括用户通过继承 UIViewContrller 方式创建用来展示内容的 View Controller。

一般容器类的会作为 [UIWindow](https://developer.apple.com/documentation/uikit/uiwindow) 的 [rootViewController](https://developer.apple.com/documentation/uikit/uiwindow/1621581-rootviewcontroller)。

使用 Storyboard 或 XIB 开发视图时， rootViewController 是自动设置的，以下是手动设置的示例：

_AppDelegate.m_
```objc
- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.rootViewController = [NavigatorController new];
  [self.window makeKeyAndVisible];
  return YES;
}
```

## 命名

View Controller 基类是   [UIViewController](https://developer.apple.com/documentation/uikit/uiviewcontroller?language=objc)，讲道理其子类都命名成 XYZViewController 是比较符合逻辑的，UIKit 自带的大部分组件确实如此，也有略去 View 直接叫 XYZController 的，比如容器类型 [UINavigationController](https://developer.apple.com/documentation/uikit/uinavigationcontroller)，如果搜索 UIKit 的话，两种名称都挺多的，

_UIKit/UIKitCore.h_

```objc
#import <UIKit/UICollectionViewController.h>
#import <UIKit/UIDocumentMenuViewController.h>
#import <UIKit/UIDocumentPickerExtensionViewController.h>
#import <UIKit/UIDocumentPickerViewController.h>
#import <UIKit/UIFontPickerViewController.h>
#import <UIKit/UIInputViewController.h>
#import <UIKit/UIPageViewController.h>
#import <UIKit/UIReferenceLibraryViewController.h>
#import <UIKit/UISearchContainerViewController.h>
#import <UIKit/UISplitViewController.h>
#import <UIKit/UITableViewController.h>
#import <UIKit/UIViewController.h>

#import <UIKit/UIAlertController.h>
#import <UIKit/UICloudSharingController.h>
#import <UIKit/UIImagePickerController.h>
#import <UIKit/UIMenuController.h>
#import <UIKit/UINavigationController.h>
#import <UIKit/UIPopoverController.h>
#import <UIKit/UIPopoverPresentationController.h>
#import <UIKit/UIPresentationController.h>
#import <UIKit/UIPrinterPickerController.h>
#import <UIKit/UIPrintInteractionController.h>
#import <UIKit/UISearchController.h>
#import <UIKit/UISearchDisplayController.h>
#import <UIKit/UITabBarController.h>
#import <UIKit/UIVideoEditorController.h>
```


## 视图树

无论容器类还是内容类，都会有一个根视图节点，可通过 `self.view` 访问，通过它可添加其他视图，从而形成视图树。

![A container acting as the root view controller 图片来自 Apple 文档](https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/Art/VCPG-container-acting-as-root-view-controller_2-2_2x.png)
<p align="center">A container acting as the root view controller 图片来自 Apple 文档</p>

一般作为 rootViewController 的控制器不直接管理 view，而是向其中添加其他 view controller，这些 controller 中包含需要显示的 view。而 rootViewController 的尺寸，依据其所处的位置而定，如果是 window 的 rootViewController，则撑满整个 window。

> The size and position of the root view is determined by the object that owns it, which is either a parent view controller or the app’s window. The view controller that is owned by the window is the app’s root view controller and its view is sized to fill the window.
> -- [UIViewController - View Management](https://developer.apple.com/documentation/uikit/uiviewcontroller?language=objc)


## View Contrller 的呈现

两种方式，
- 通过容器型来呈现
- 原地直接呈现

### 容器型

比如 UITabBarController 可以配置多个 tab 及其关联的 View Controller，tab 切换时会自动切换到相应的子 controller。
再比如 UINavigationController，它维护了一个 View Ccontroller 的栈，当向其中 push 新的 View Controller 时界面便会切到相应的 controller。

示例：

```objc
[self pushViewController:[UIViewController new] animated:YES];
```

### 原地直接呈现

UIViewController 提供了一些方法可以使用多种试呈现 View Controller，包括全屏的，模态类型的，

- showViewController:sender:
- showDetailViewController:sender:
- presentViewController:animated:completion:

示例：

```objc
- (void)add:(id)sender {
   // Create the root view controller for the navigation controller
   // The new view controller configures a Cancel and Done button for the
   // navigation bar.
   RecipeAddViewController *addController = [[RecipeAddViewController alloc] init];
 
   addController.modalPresentationStyle = UIModalPresentationFullScreen;
   addController.transitionStyle = UIModalTransitionStyleCoverVertical;
   [self presentViewController:addController animated:YES completion: nil];
}

```


## UINavigationController 使用示例

UINavigationController 包含一个存储 View Controller 的数组，通过向其中压入新的 View Controller 来呈现新页面。

```objc
@property(nonatomic,copy) NSArray<__kindof UIViewController *> *viewControllers; // The current view controller stack.
```

示例：

_MyNavigationController.m_
```objc
- (void)viewDidLoad {
  [super viewDidLoad];
  [self pushViewController:[UIViewController new] animated:YES];
}
```

### 导航

导航是属于 UINavigationController 中子 Controller 的，所以需要在子 Controller 中去设置，而不是在 UINavigationController 中。同样，导航的标题也是。

_MyViewController.m_
```objc
- (void)viewDidLoad {
  self.title = @"ttile";
  UIBarButtonItem *left = [[UIBarButtonItem alloc] initWithTitle:@"left"
                                                           style:UIBarButtonItemStylePlain
                                                          target:nil
                                                          action:nil];
  [self.navigationItem setLeftBarButtonItem:left];
  self.navigationItem.prompt = @"prompt";
  self.navigationItem.backBarButtonItem =
      [[UIBarButtonItem alloc] initWithTitle:@"back to launch screen"
                                       style:UIBarButtonItemStyleDone
                                      target:nil
                                      action:nil];
  UIBarButtonItem *right = [[UIBarButtonItem alloc] initWithTitle:@"right"
                                                            style:UIBarButtonItemStylePlain
                                                           target:nil
                                                           action:nil];
  [self.navigationItem setRightBarButtonItem:right];
}
```

### toolbar

要展示 toolbar，需要先在 NavigationContorller 中设置成显示，

_MyNavigationController.m_
```objc
self.toolbarHidden = NO;
```

然后在子 Controller 中配置具体要展示的内容：

_MyViewController.m_
```objc
- (void)viewDidLoad {
  self.toolbarItems = @[
    [[UIBarButtonItem alloc] initWithTitle:@"btn1"
                                     style:UIBarButtonItemStylePlain
                                    target:nil
                                    action:nil],
    [[UIBarButtonItem alloc] initWithTitle:@"btn2"
                                     style:UIBarButtonItemStylePlain
                                    target:nil
                                    action:nil]
  ];
}
```

## 相关资源

- [View Controller Programming Guide for iOS](https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/)

    