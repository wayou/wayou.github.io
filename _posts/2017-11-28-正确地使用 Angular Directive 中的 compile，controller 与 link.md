---
layout: post
title: "正确地使用 Angular Directive 中的 compile，controller 与 link"
date: 2017-11-28 23:11:00 +0800
tags: angular
---
    
## Angular Directive 中正确使用 compile，controller 与 link

编写 Angular Directive 时，到底该用 `link` 还是 `controller`，或者 `compile`。 看官方文档的示例代码时，也是一会儿用 `link`, 一会儿又用 `controller`。网上搜问题时遇到的代码也都是用每个的都有。

那么问题来了，这三者有何区别，什么情况下用哪个最合适。

### 重新认识

从官方文档 [Comprehensive Directive API](https://docs.angularjs.org/api/ng/service/$compile#comprehensive-directive-api)，可以找到一段 directive 完整定义的示例代码，其中，`directiveDefinitionObject` 就是完整定义一个 directive 的配置对象。是它告诉 Angular 的 `$compile` 如何去解析生成这个 directive。

```js
var myModule = angular.module(...);

myModule.directive('directiveName', function factory(injectables) {
  var directiveDefinitionObject = {
    priority: 0,
    template: '<div></div>', // or // function(tElement, tAttrs) { ... },
    // or
    // templateUrl: 'directive.html', // or // function(tElement, tAttrs) { ... },
    transclude: false,
    restrict: 'A',
    templateNamespace: 'html',
    scope: false,
    controller: function($scope, $element, $attrs, $transclude, otherInjectables) { ... },
    controllerAs: 'stringIdentifier',
    bindToController: false,
    require: 'siblingDirectiveName', // or // ['^parentDirectiveName', '?optionalDirectiveName', '?^optionalParent'],
    multiElement: false,
    compile: function compile(tElement, tAttrs, transclude) {
      return {
         pre: function preLink(scope, iElement, iAttrs, controller) { ... },
         post: function postLink(scope, iElement, iAttrs, controller) { ... }
      }
      // or
      // return function postLink( ... ) { ... }
    },
    // or
    // link: {
    //  pre: function preLink(scope, iElement, iAttrs, controller) { ... },
    //  post: function postLink(scope, iElement, iAttrs, controller) { ... }
    // }
    // or
    // link: function postLink( ... ) { ... }
  };
  return directiveDefinitionObject;
});
```

从上面示例代码可以看到本文要讨论的三个函数的关系。三者可以并列，但 compile 和 link 的关系有点微妙。这里，link 严格意义上是分为 preLink 及 postLink 的。默认情况下 link 指的是 postLink。两者之所以微妙，是因为有 compile 定义的情况下，配置对象中的 link 属性会被忽略。此时如果想使用 link 方法的话，需要在 compile 里进行返回。

平时只注重使用，也没细看。现在根据三者执行的顺序，来仔细认识一下他们，以看看三者的区别。

![从 Stackoverflow 扒来的神图展示了 Angular 启动时都发生了些什么](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/understanding-angular-directive-hooks/assets/angular-bootstrap-steps.png)

_从 Stackoverflow 扒来的神图展示了 Angular 启动时都发生了些什么_


从图中可看出，Anuglar 启动后，主要两部分，

#### $compile 阶段

这里面包含了 Directive 的 `compile` 方法。

DOM 模板被加载后则开始了编译。遍历所有节点，找出 directive 然后调用每个 directive 的 `cmopile` 方法。这里使用的 DOM 模板代码为原始的 DOM 模板。

![Angular directive compile 阶段](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/understanding-angular-directive-hooks/assets/compile-phase.png)

_Angular directive compile 阶段_


#### nodeLinkFn 阶段

这里面包含了 Directive 的 `controller` 以及 `link` (`preLink` 和 `postLink`)。

将原始的 DOM 模板代码生成到页面后，就认为实例化了该模板，因为该模板和一个实例 directive 进行了绑定，有确定的作用域 scope。所以这一阶段使用的 DOM 区别于前面，是实例化的 DOM。

实例化的 DOM 除了从原始 DOM 直接编译而来，还有的是通过 `ngRepeat` 等在代码中动态生成的。无论哪种形式而来，一旦 DOM 被渲染到页面，则开始的 link 阶段的工作。

![Angular directive link 阶段](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/understanding-angular-directive-hooks/assets/link-phase.png)

_Angular directive link 阶段_


### 详细看看各步骤

为了更好理解各执行步骤，考察下面的示例代码：

```html
<div ng-repeat="i in [0,1,2]">
    <my-element>
        <div>Inner content</div>
    </my-element>
</div>
```

其中用到的 directive 代码为：

```js
myApp.directive( 'myElement', function() {
    return {
        restrict:   'EA',
        transclude: true,
        template:   '<div>{{label}}<div ng-transclude></div></div>'
    }
});
```


#### compile

compile 主要用来对模板代码进行转换，大部分的 directive 用不到。 `link` 阶段的 DOM 是这一阶段产出的克隆版本。

首先来到的是 $compile 阶段。这里面包含了 directive 的 compile 方法。从上面示例代码中可以看出，它的签名是

```js
compile: function compile( tElement, tAttributes ) { ... }
```

这里参数命名值得提一下，`tElement` 实际上指 `template element`，指的是直接从模板拿到的原始代码，以区别于实例的 `element` `iElement` (instance element)，后者指 directive 实例化之后的 DOM 代码，用在 link 方法中。 `tAttributes` 同理。

在 compile 执行之前，通过 `ng-transclude` 嵌入的代码会先被移除，然后模板代码被放入 directive 标签内。所以传给 compile 的 DOM 成了这样：

```html
<my-element>
    <div>
        "{{label}}"
        <div ng-transclude></div>
    </div>
</my-element>
```
然后就是调用 compile 方法。完了之后会将这个 directive 下所有子组件再走一遍这个流程。

### 组件的实例化

compile 可以理解为是对原始模板的编译处理。针对一个 directive 只进行一次。之后便是将编译好的代码实例出一个组件来。

上面参数命名的地方也提到过实例。指的也就是页面中一个 direcitve 的生成。这里，我们测试用的代码中，`ng-repeat="i in [0,1,2]"` 会生成三个 `myElement` 的实例。也就是说，下面的步骤会进行三次，每实例化一个 directive 都会走一遍下面的流程。

#### Controller

从上面示例代码中，可以看到 controller 方法的签名是这样的：

```js
controller: function( $scope, $element, $attrs, $transclude ) { ... }
```

controller 的执行表示 directive 进入了上图中标识的 nodeLinkFn 阶段。这里的 nodeLinkFn 方法来自上一阶段 $compile 的返回，并且在返回时提供了 `scope` 入参。

这里，根据配置属性上 `scope` 的不同设置，传递给 controller 的 `$scope` 会有不同，具体见[官方文档 scope 部分](https://docs.angularjs.org/api/ng/service/$compile#-scope-)。

* `scope: false` 默认值。不会有新的 scope 被创建，将使用父级 scope。
* `scope: true` 会创建一个继承于父scope 的新 scope 给 directive 使用。
* `scope: {...}` 创建一个独立的 scope 给 directive 使用。

然后 controller 则以上面的 scope 和实例化之后的 DOM 元素开始运行。

#### preLink

签名：

```js
function preLink(scope, iElement, iAttrs, controller) { ... },
```

发生在所有子组件被 link 前。事实上这一阶段从视觉上看不出发生了什么。之后便是遍历所有子组件，将正确的 scope 传播下去。

可以理解为主要是遍历和组装各子组件使之 ready。

#### postLink

我们通常的说的 link 指的是 postLink，大部分逻辑是在这里面的。并且，无论是从 compile 方法返回的 link，还是配置对象中的 link, 默认指的都是 postLink。

它的签名是同 preLink 一样，入参上没有什么区别。

```js
function postLink(scope, iElement, iAttrs, controller) { ... }
```

这个方法执行的时候，其所有子组件的 postLink 方法也都执行完毕。也就是说，所以子组件都已经完成了初始化，包括

* 数据绑定
* 模板嵌入
* scope 传入

所以此刻模板的样子已经变成了：

```html
<my-element>
    <div class="ng-binding">
        "{{label}}"
        <div ng-transclude>                
            <div class="ng-scope">Inner content</div>
        </div>
    </div>
</my-element>
```

### 执行顺序

上面理解了各步骤干的事情，这里通过代码看看他们的执行顺序，特别是在组件嵌套的情况下。

考察下面的示例代码：

```html
<body>
    <div log='some-div'></div>
</body>
```

其中使用的 directive 代码为：

```js
myApp.directive('log', function() {

    return {
        controller: function( $scope, $element, $attrs, $transclude ) {
            console.log( $attrs.log + ' (controller)' );
        },
        compile: function compile( tElement, tAttributes ) {
            console.log( tAttributes.log + ' (compile)'  );
            return {
                pre: function preLink( scope, element, attributes ) {
                    console.log( attributes.log + ' (pre-link)'  );
                },
                post: function postLink( scope, element, attributes ) {
                    console.log( attributes.log + ' (post-link)'  );
                }
            };
         }
     };  

});
```

在每一个阶段里都进行了日志输出，以查看其执行顺序。

对于单个 `directive` 而言，无疑很简单，通过最前端的图都可以猜到 `log` 的顺序。

```
some-div (compile)
some-div (controller)
some-div (pre-link)
some-div (post-link)
```

对于多个组件嵌套的情况，正常的 directive 是按照上面的顺序执行的，但一些 directive 譬如 ngIf，ngRepeat 或者其他使用 `transclude` 嵌套的组件，`link` 先于 `compile` 运行，因为这些组件是在 `link` 内渲染子组件的。

考察下面嵌套的示例代码:

```html
<body>
    <div log='parent'>
        <div log='..first-child'></div>
        <div log='..second-child'></div>
    </div>
</body>
```

输出则是：

```
// The compile phase
parent (compile)
..first-child (compile)
..second-child (compile)

// The link phase   
parent (controller)
parent (pre-link)
..first-child (controller)
..first-child (pre-link)
..first-child (post-link)
..second-child (controller)
..second-child (pre-link)
..second-child (post-link)
parent (post-link)
```

这里，可以明显体现出之前讨论过的两个阶段，compile 阶段和 link 阶段。


### 所以结论是

上面解释了各方法的顺序及作用。但并没有给出建议，写 directive 时用哪个比较合理。

还是出自同一个来自 stackoverflow 提问下的回答，[@Izhaki](https://stackoverflow.com/users/1179377/izhaki) 这位 Bro 的回答可以说是相当到位，分段落每个部分回答成一个答案。

#### compile

每个directive 的 compile 方法只执行一次，这里主要用来对 DOM 进行操作，前提是不影响 scope 及数据绑定的 DOM 操作。

考虑下面的示例代码：

```html
<tr ng-repeat="raw in raws">
    <my-raw></my-raw>
</tr>
```
假如说我们希望操作 `my-raw` 的 DOM 比如加个 `span` 进去。可以在 compile 中进行，然后让 `ng-repeat` 复制出许多克隆来，也可以在 `ng-repeat` 复制后（link 阶段），去操作每个复制出来的版本。

在数据量大的情况下，前者性能会好一些。

所以，在 compile 里面，

**推荐**
* 修改 DOM 模板

**不推荐**
* 绑定事件，因为这是复制之前，事件应该绑定到对应实例上
* 操作子元素
* 设置对属性的监听
* 设置对 scope 的监听


#### controller

实例化之后 controller 便开始执行。

在 controller 里，通常

* 定义一些可以与其他组件的 controller 共享的代码逻辑
* 初始化 scope 变量

需要注意的一点是，如果该组件使用独立的 scope，那么是没法使用从父级 scope 继承而来的那些变量的。

在 controller 里面，

**推荐**
* 书写 controller 逻辑
* 初始化 scope 变量

**不推荐**
* 操作子元素（因为有可能还没被渲染出来）

#### preLink

也是在实例之后开始执行。根据前文的分析，preLink 的顺序是先父组件后子组件，刚好与 postLink 相反，后者先子组件最后回溯到父组件。

一般组件很少用到 compile 方法，preLink 则更加少的情况会被用到。只某些特殊情况下会很有用，譬如：

`ngModelController`

**不推荐**
* 操作子元素（因为有可能还没被渲染出来）


#### postLink

postLink 执行的时候，上面的步骤都已经完成了：数据绑定，模板代码嵌入等。所以这里是对生成好的 DOM 进行再次操作的最好时机。

**推荐**
* 操作DOM（此时操作的是实例化 DOM）
* 绑定事件
* 与子元素进行交互
* 设置属性的监听
* 设置 scope 上的 监听


### 原始模板代码与实例模板代码

前面有提到过，这里不妨再细究一下。

* 原始模板代码 - 用来进行复制的原始模板，如果进行了复制操作，则原始模板是不会展示在界面上的
* 实例模板代码 - 从原始模板代码复制而来，绑定到对应组件实例，也就是每个组件实例会对应一分，它是真正被渲染到界面上的模板

譬如：

```html
<div ng-repeat="i in [0,1,2]">
    <my-directive>{{i}}</my-directive>
</div>
```
上面代码中，原始模板代码为：

```html
    <my-directive>{{i}}</my-directive>
```

通过`ng-repeat="i in [0,1,2]"`指令，这段模板会被复制成三分，复制出来的模板代码为实例模板代码，第一个都被绑定了各自的 scope，并且都会渲染到界面。


### 相关资源

* [Comprehensive Directive API](https://docs.angularjs.org/api/ng/service/$compile#comprehensive-directive-api)
* [Angular directives - when and how to use compile, controller, pre-link and post-link](https://stackoverflow.com/a/24615185/1553656)
* [Difference between the 'controller', 'link' and 'compile' functions when defining a directive](https://stackoverflow.com/a/12570008/1553656)


    