title: Angular条件路由
toc: false
categories: 技术
date: 2015-03-08 11:43:04
tags:
- anular
---
对于Web程序通常会有这样的需求：针对不同的情况，我们希望用户进入站点后打开不同的页面。
写一下Web程序的时候，会有这样的需求：根据用户的类型，将用户导向不同的页面。
譬如，对于非注册用户，打开站点后导向到注册页面;
或者，以之前做的一个项目为例，对于普通用户，打开培训页面，而培训合格的用户，我们希望默认打开管理页面。

这样的路由控制当然可以由后端来做。

<!-- more -->

当使用了Angular这样的前端框架时，路由由前端控制并且是事先配好的（当然，这种情况下也不是说后端就不能控制路由了）。
一个典型的angular示例如下面代码所示：
```js
var app = angular.module('myApp', []);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        //培训页面
        when('/home', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        }).
        //管理
        when('/auth', {
            templateUrl: 'views/auth.html',
            controller: 'AuthCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);
```
这里不深入讨论完整的权限控制，用户当然可以手动更改URL来打开管理页面，但你可以选择不展示内容而是给个提示“无权限”之类的，总之这里不讨论，这里要说的就是我们有能力根据条件更改Angular路由的默认页面。

如果我们不做作何处理，根据现在的配置，默认是打开培训页面。为了对已经通过培训的用户默认打开管理页面，首先我们要知道当前用户的身份，然后判断是否该跳转。

Angular模块的`run`函数，是最接近主程序启动的地方，可以在这里进行判断与重定向。
所以更新后的代码如下：

```js
var app = angular.module('myApp', []);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        //首页
        when('/home', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        }).
        //注册页
        when('/auth', {
            templateUrl: 'views/auth.html',
            controller: 'AuthCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]).run(['$location', '$http',
    function($location, $http) {

        $http.get('path/to/get/user/data').
        success(function(res) {
            //拿到用户数据，判断用户类型，然后定位到相应的页面
            if (res.member) {
                //如果是合格用户，转向管理页面
                $location.path('/auth');
            }
        }).
        error(function(err) {
            console.log(err);
        });

    }
]);
```
向模块添加`run`函数，首先发起一个请求获取用户数据，根据返回的数据进行判断，然后使用`$location.path`来重新路由。


# references
- [Angular Modeule Run Blocks](https://docs.angularjs.org/guide/module) 