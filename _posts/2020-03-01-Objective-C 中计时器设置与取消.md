---
layout: post
title: "Objective-C 中计时器设置与取消"
date: 2020-03-01 11:03:00 +0800
tags: 
---
    
# Objective-C 中计时器设置与取消

考察这样的场景：进入页面后设置接口轮询更新数据，离开页面时清除掉计时器。

轮询可通过创建延时任务，并且在任务中递归调用自己来生成。Objective-C 中延时任务有多种方式，配合 `viewDidLoad` 和 `viewWillDisappear` 实现计时器的设置与清除。

## `performSelector:withObject:afterDelay:` 与 `cancelPreviousPerformRequestsWithTarget:`

通过 `NSObject` 上的 [`performSelector:withObject:afterDelay:`](https://developer.apple.com/documentation/objectivec/nsobject/1416176-performselector?language=objc) 配合 [`cancelPreviousPerformRequestsWithTarget:`](https://kapeli.com/dash_share?docset_file=Apple_API_Reference&docset_name=Apple%20API%20Reference&path=dash-apple-api://load?request_key=hcVCAfekYt%23&platform=apple&repo=Main&source=https://developer.apple.com/documentation/objectivec/nsobject/1417611-cancelpreviousperformrequestswit?language=objc)。

```objc
[NSObject performSelector:@selector(SampleMethod) withObject:self afterDelay:delayTime];
[NSObject cancelPreviousPerformRequestsWithTarget:self];
```

## `dispatch_after` 与 `dispatch_block_cancel` 

通过 [`dispatch_after`](https://kapeli.com/dash_share?docset_file=Apple_API_Reference&docset_name=Apple%20API%20Reference&path=dash-apple-api://load?request_key=hcogKBJqmQ%23&platform=apple&repo=Main&source=https://developer.apple.com/documentation/dispatch/1452876-dispatch_after?language=objc) 与 [`dispatch_block_cancel`](https://developer.apple.com/documentation/dispatch/1431058-dispatch_block_cancel?language=objc#) 实现任务延迟与取消。

声明一个变量保存需要执行的任务：

```objc
var block: dispatch_block_t?
```

初始化 `block` 然后通过 `dispatch_after` 触发：

```objc
block = dispatch_block_create(DISPATCH_BLOCK_INHERIT_QOS_CLASS) {
  print("I executed")
}
let time: dispatch_time_t = dispatch_time(DISPATCH_TIME_NOW, Int64(5 * NSEC_PER_SEC))
dispatch_after(time, dispatch_get_main_queue(), block!)
```

最后在合适的时机通过 `dispatch_block_cancel` 取消任务：
```objc
dispatch_block_cancel(block!)
```

## `DispatchWorkItem`

Swift 中可使用 [`DispatchWorkItem`](https://developer.apple.com/documentation/dispatch/dispatchworkitem) 与 [`cancel()`](https://developer.apple.com/documentation/dispatch/dispatchworkitem/1780910-cancel)。

```objc
let queue = DispatchQueue(label: "queue", attributes: .concurrent)
let workItem = DispatchWorkItem {
    print("done")
}
    
DispatchQueue.main.asyncAfter(deadline: .now() + .seconds(1)) {
    queue.async(execute: workItem) // not work
}
workItem.cancel()
```

## 相关资源

- [iOS - Canceling delayed performSelector](https://coderwall.com/p/ochica/ios-canceling-delayed-performselector)
- [Stop dispatch_after](https://stackoverflow.com/a/37829673/1553656)
- [How to stop a DispatchWorkItem in GCD?](https://stackoverflow.com/questions/38370035/how-to-stop-a-dispatchworkitem-in-gcd)

    