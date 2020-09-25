---
layout: post
title: "Objective-C 中不带加减号的方法"
date: 2020-05-23 09:05:00 +0800
tags: 
---
    
# Objective-C 中不带加减号的方法


显而易见的事实是，Objective-C 中，`+` 表示类方法，`-` 表示实例方法。

但看别人代码过程中，还会发现一种，不带加减号的方法。

```objc

@implementation MyViewController

void foo(){
    printf("msg from foo...");
}

- (void)loadView {
  [super loadView];
  foo();
}

@end

```

这种是混搭的 C 代码。

当然当 C 方法写在 `@implementation` 内也是可以的，编译器会正确地处理。因为 C 方法严格来说不隶属于类，好的做法是始终写在类实现的外部。

```objc
void foo(){
    printf("msg from foo...");
}

@implementation MyViewController

- (void)loadView {
  [super loadView];
  foo();
}

@end

```


## C 中获取 Objective-C 的数据

但如果你以为将 C 代码写在 `@implementation` 内部就可以获取到类里面的数据，那是不现实的。

_MyViewController.h_
```objc

@interface MyViewController ()
@property NSString *someStr;
@end
```

_MyViewController.m_
```objc

@implementation MyViewController
// void foo() { printf(self.someStr); } // 🚨 Use of undeclared identifier '_someStr'
void foo() { printf(_someStr); } // 🚨 Use of undeclared identifier '_someStr'

- (void)loadView {
  [super loadView];
  self.someStr = @"some string...";
  foo();
}

@end

```

正确的做法是将 Objective-C 的对象传递给 C 代码，这样在 C 中便有了一个对象的引用，数据就可以正常获取了。

_MyViewController.h_
```objc
@interface MyViewController : UIViewController

@property NSString *someStr;
- (void)myObjcMethod;

@end
```

_MyViewController.m_
```objc

void foo(MyViewController* obj) {
  printf("%s\n", [obj.someStr UTF8String]);
  [obj myObjcMethod];
}

@implementation MyViewController

- (void)loadView {
  [super loadView];
  self.someStr = @"some string...";
  foo(self);
}

- (void)myObjcMethod {
  NSLog(@"msg from my objc method");
}

@end

```

## 相关资源

- [Mixing C functions in an Objective-C class](https://stackoverflow.com/questions/801976/mixing-c-functions-in-an-objective-c-class)
- [accessing objective c variable from c function](https://stackoverflow.com/questions/14535660/accessing-objective-c-variable-from-c-function)

    