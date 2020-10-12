---
layout: post
title: "Objective-C 属性的声明及 @dynamic"
date: 2019-12-01 12:12:00 +0800
tags: 
---
    
# Objective-C 属性的声明及 @dynamic

类接口中属性其实是 getter 和 setter 的集合，当你声明一个属性时，

```objc
@property (strong, nonatomic) NSString *name;
```

你得到的其实是一对存取器方法：

```objc
- (NSString *)name;
- (void)setName:(NSString *)name;
```

即，代码中使用 `obj.name` 的地方会变成 `[obj name]`，向对象发送 getter 消息。而 `obj.name = @"hello"` 则在编译后成为 `[obj setName:@"hello"]`。

按照 Objective-C 的命名约定，这背后实际存储 `name` 的变量，会是 `_name`，称这个 `_name` 为 **实例变量（intance variable）**。当然也可直接访问这个 `_name` 进行操作，但只有 `obj.name` 会通过存取器来进行值设置和读取。

前面只是属性的声明，在类的实现中，有这些种途径来完成属性存取器的实现，

- 自动，只需使用 `@property` 声明一下即可。
- 自定义存取器
- 使用 `@dynamic`。


## 自动生成

这也是最常用的方式，如果没有额外的需求，使用 `@property` 进行属性的声明即可。

```objc
@interface MyClass : UIView

@property (strong, nonatomic) NSString *name;

@end

@implementation MyClass

@end
```

实现部分会有编译器自动完成，编译后生成的代码如文章开头所示，即：

```objc
- (NSString *)name;
- (void)setName:(NSString *)name;
```


## 自定义存取器

```objc
@interface MyClass : UIView {
    NSString *_name;
}

@property (copy, nonatomic) NSString *name;

@end

@implementation MyClass

- (NSString *)name {
    return _name;
}

- (void)setName:(NSString *)name {
    _name = [name uppercaseString];
}

@end
```

自定义存取器往往伴随着需要使用  `@synthesize` 关键字。 

###  `@synthesize`

默认情况下，编译器会为属性生成一条 `@synthesize`，比如下面示例中，`@synthesize name = _name;` 写或不写效果一样：

```objc
@interface MyClass : UIView {
    NSString *_name;
}

@property (strong, nonatomic) NSString *name;

@end

@implementation MyClass

@synthesize name = _name;

@end

```
这样我们在类的实现中可以访问 `[self.name]` 或直接访问  `_name`。

如果你想自定义实例变量的名称，则可通过  `@synthesize` 来实现，比如：

```objc
@synthesize name = blah;
```

此时 `name` 属性还是那个属性，`self.name`  正常访问，但其背后的实例变量则变成了 `blah`，而不是 `_name` 了。

使用 `@synthesize` 还有种情况就是自定义了存取器，此时编译器不会自动生成实例变量，需要手动 `@synthesize` 或自己声明这个实例变量（在类声明的顶部放在花括号中）。

```objc
@interface MyClass : UIView

@property (copy, nonatomic) NSString *name;

@end

@implementation MyClass

 @synthesize name = _name;

- (NSString *)name {
    return _name;
}

- (void)setName:(NSString *)name {
    _name = [name uppercaseString];
}

@end

```

或

```objc
@interface MyClass : UIView {
    NSString *_name;
}

@property (copy, nonatomic) NSString *name;

@end

@implementation MyClass

- (NSString *)name {
    return _name;
}

- (void)setName:(NSString *)name {
    _name = [name uppercaseString];
}

@end

```


##  `@dynamic`

 `@dynamic` 告诉编译器该属性的存取器会在别的地方有定义。
 
 比如，父类定义了一个按钮属性，子类中使用时想为该属性创建 outlet，
 
 父类：
 ```objc
 @property (nonatomic, retain) NSButton *someButton;
 ...
 @synthesize someButton;
 ```
 
 子类 ：
 
 ```objc
 @property (nonatomic, retain) IBOutlet NSButton *someButton;
 ...
 @dynamic someButton;
 ```

## 相关资源

- [@dynamic property in Objective C](https://stackoverflow.com/questions/52376315/dynamic-property-in-objective-c/52392649#52392649)
- [@synthesize vs @dynamic, what are the differences?
](https://stackoverflow.com/questions/1160498/synthesize-vs-dynamic-what-are-the-differences)


    