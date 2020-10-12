---
layout: post
title: "CocoaPods 的使用"
date: 2019-12-07 11:12:00 +0800
tags: 
---
    
大部分现代语言都会标配包管理器，比如 Node.js 的 npm，如果没有，那一定会出现第三方社区提供的工具，比如 Cocoa 则是 [CocoaPods](https://cocoapods.org/)，而且还会不止一种，[Carthage](https://github.com/Carthage/Carthage)...

## 安装

```sh
$ sudo gem install cocoapods
```

检查安装：

```sh
$ pod --version
```

### 更新

要更新到最新版本，重新安装即可：

```sh
$ sudo gem install cocoapods
```

## 初始化

在项目根目录执行

```sh
$ pod init
```

该命令会创建一个 `Podfile` 到当前目录，里面内容长这样：

```rb
# Uncomment the next line to define a global platform for your project
platform :ios, '11.0'

target 'ProjectName' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!
  
  # Pods for ProjectName
  
  target 'Tests' do
    inherit! :search_paths
    # Pods for testing
  end

  target 'UITests' do
    inherit! :search_paths
    # Pods for testing
  end

end

```

## Pod 包的安装

编辑 Podfile 添加需要安装依赖的库，比如添加 [Masonry](https://github.com/SnapKit/Masonry)

```diff
# Uncomment the next line to define a global platform for your project
platform :ios, '11.0'

target 'ProjectName' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!
  
  # Pods for ProjectName
+ pod 'Masonry', '~> 1.1'
  ...
end
```

然后执行安装命令：

```sh
$ pod install
```

<details>

<summary>pod install 的输出信息</summary>

```
$ pod install
Analyzing dependencies
Downloading dependencies
Installing Masonry (1.1.0)
Generating Pods project
Integrating client project

[!] Please close any current Xcode sessions and use `PodTest.xcworkspace` for this project from now on.
Pod installation complete! There is 1 dependency from the Podfile and 1 total pod installed.

[!] Automatically assigning platform `iOS` with version `13.2` on target `PodTest` because no platform was specified. Please specify a platform for this target in your Podfile. See `https://guides.cocoapods.org/syntax/podfile.html#platform`.

```


</details>


顺利的话，就可以在项目中引入库的头文件进行使用了。

```objc
#import <Masonry/Masonry.h>
```

## 可能遇到的问题

### Pod 源

如果安装时出现无法下载的错误，来自 trunk 的资源直接连接不上。那是因为新的 Pod 1.8.4 中将源从 master 切换到了 trunk，可修改成 master 源。

<details>

<summary>pod install 时报无法下载的错误详情</summary>

```
$ pod install
Analyzing dependencies
[!] CDN: trunk Repo update failed - 27 error(s):
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.0.2/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.0.3/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.1.0/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.1.5/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.1.6/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.2.0/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.2.1/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.2.2/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.2.3/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.2.4/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.3.0/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.3.1/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.3.2/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.4.0/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.5.0/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.5.1/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.5.2/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.5.3/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.6.0/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.6.1/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.6.2/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.6.3/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/0.6.4/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/1.0.0/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/1.0.1/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/1.0.2/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)
CDN: trunk URL couldn't be downloaded: https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/a/4/Masonry/1.1.0/Masonry.podspec.json, error: Failed to open TCP connection to raw.githubusercontent.com:443 (Connection refused - connect(2) for "raw.githubusercontent.com" port 443)

[!] Automatically assigning platform `iOS` with version `13.2` on target `PodTest` because no platform was specified. Please specify a platform for this target in your Podfile. See `https://guides.cocoapods.org/syntax/podfile.html#platform`.
```
</details>

查看当前的源：

```sh
$ pod repo list

master
- Type: git (master)
- URL:  https://github.com/CocoaPods/Specs.git
- Path: /Users/wayou/.cocoapods/repos/master

trunk
- Type: CDN
- URL:  https://cdn.cocoapods.org/
- Path: /Users/wayou/.cocoapods/repos/trunk

2 repos
```

删除 trunk:

```sh
$ pod repo remove trunk
```

Podfile 中手动配置源，如果不显式配置一下，再次执行 `pod install` 时 trunk 还会自动被加回来。

```rb
source 'https://github.com/CocoaPods/Specs.git'
```
#### 回退 Cocoa Pod 到老版本

最后，还有个不推荐的办法，直接回退到老版本的 pod 就一切正常了。所有可用版本列表参见[这里](https://rubygems.org/gems/cocoapods/versions)

删除当前版本：

```sh
$ sudo gem uninstall cocoapods
```

安装指定版：

```sh
$ sudo gem install cocoapods -v 1.7.5
```

### `framework not found`

安装完 Pod 包之后如果编译报  `framework not found`，即安装好的包找不到，极有可能是项目打开方式不对。配置好 Pod 后需要使用 `<ProjectName>.xcworkspace` 文件作为项目入口，即用 Xcode 打开 `.xcworkspace` 文件而不是 `xcodeproj` 了。

这一点在安装完 pod 包时命令行有提示：

```
[!] Please close any current Xcode sessions and use `PodTest.xcworkspace` for this project from now on.
Pod installation complete! There is 1 dependency from the Podfile and 1 total pod installed.
```


### Pod 中的 warning

如果三方库在编译过程中产生警告，可以在 Podfild 中配置忽略掉，因为三方库代码是不建议直接修改的，所以也做不了什么。

```rb
# ignore all warnings from all pods
inhibit_all_warnings!

# ignore warnings from a specific pod
pod 'FBSDKCoreKit', :inhibit_warnings => true
```

## 相关资源

- [Using CocoaPods](https://guides.cocoapods.org/using/using-cocoapods.html)
- [Ignore Xcode warnings when using Cocoapods](https://stackoverflow.com/a/13209057/1553656)
- [Сocoapods trunk URL couldn't be downloaded](https://stackoverflow.com/questions/58409725/%D0%A1ocoapods-trunk-url-couldnt-be-downloaded)
- [How to downgrade or install an older version of Cocoapods](https://stackoverflow.com/a/20489489/1553656)

    