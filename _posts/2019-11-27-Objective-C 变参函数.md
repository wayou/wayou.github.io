---
layout: post
title: "Objective-C 变参函数"
date: 2019-11-27 23:11:00 +0800
tags: 
---
    
# Objective-C 变参函数

接收可变参数的函数，Objective-C 中称作 Variadic Functions，很明显的例子就是 [`NSString stringWithFormat:`](https://developer.apple.com/documentation/foundation/nsstring/1497275-stringwithformat?language=objc)  和 [`NSLog(NSString *format, ...)`](https://developer.apple.com/documentation/foundation/1395275-nslog?language=occ)。前者接收一个带格式化占位的字符串，后面跟任意多个需要插入占位的变量，后者同理。

```objc
NSString *name = @"niuwayong";
NSString *verb = @"wft";
NSString *message =
    [NSString stringWithFormat:@"hello my name is %@ and nice to %@ you!", name, verb];
NSLog(@"message: %@", message);
// message: hello my name is niuwayong and nice to wft you!
```

作为强类型语言，Objective-C 中实现可变参数是没有像弱类型语言那么方便。比如 JavaScript 中，参数是很随意的：

```js
function fn(){
  console.log(...arguments)
}

fn(1,2,3) // 1 2 3
```

像上面这样，你甚至都没指定任何入参，但调用的时候也是可以传递任意参数的。

 但不是说就不能，因为开头已经看到了例子。以 `NSLog` 为例，查看其函数声明为如下形式：
 
 ```objc
 void NSLog(NSString *format, ...)
 ```
 
 这里的 `...` 便是实现可变参数的魔法点所在。
 
 ## va_list
 
 实现可变参数需要借助标准 C 里面的一些技术，其实与 Objective-C 无关了。
 
 - [`va_list`](https://en.cppreference.com/w/c/variadic/va_list) - 指向参数列表的指针。
 - [`va_start`](http://www.cplusplus.com/reference/cstdarg/va_start/) - 初始化 `va_list` 并使其指向指定参数之后的参数位置。
 - [`va_arg`](https://en.cppreference.com/w/c/variadic/va_arg) - 从参数列表中获取下一个参数（获取时需指定参数类型，这样底层才能正确计算出内存范围）。
 - [`va_end`](http://www.cplusplus.com/reference/cstdarg/va_end/) - 释放参数列表所占内存。


## 利用 `va_list` 实现可变参数函数

利用 `va_list` 可实现自己的可变参数函数，比如向字符串无限追加内容：

 ```objc
 + (NSString *)setContentByAppendingStrings:(NSString *)message, ... {
   NSMutableString *newContentString = [NSMutableString string];
   va_list args;
   va_start(args, message);
   for (NSString *arg = message; arg != nil; arg = va_arg(args, NSString *)) {
     [newContentString appendString:arg];
   }
   va_end(args);
   return newContentString;
 }
 ```
 
 运行效果：
 
 ```objc
 NSString *message = @"hello";
 message = [Util setContentByAppendingStrings:message, @" niuwayong", @",大壮"];
 NSLog(@"message: %@", message);
 //message: hello niuwayong,大壮
 ```

回过头来看，可以推测 `NSLog` 的内部的实现，这里是利用 `NSLogv` 实现的一个简单等效函数：


```objc
+ (void)my_log:(NSString *)format, ... {
  va_list args;
  va_start(args, format);
  NSLogv(format, args);
  va_end(args);
}
```

## 相关资源

 - [How to create variable argument methods in Objective-C](https://stackoverflow.com/questions/4804674/how-to-create-variable-argument-methods-in-objective-c)
 - [va_list](https://en.cppreference.com/w/c/variadic/va_list)
 - [va_start](http://www.cplusplus.com/reference/cstdarg/va_start/)
 - [va_end](http://www.cplusplus.com/reference/cstdarg/va_end/)
 - [`va_arg`](https://en.cppreference.com/w/c/variadic/va_arg)
 - [Variable argument lists in Cocoa](https://www.cocoawithlove.com/2009/05/variable-argument-lists-in-cocoa.html)

    