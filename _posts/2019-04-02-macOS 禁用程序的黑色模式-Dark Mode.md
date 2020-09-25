---
layout: post
title: "macOS 禁用程序的黑色模式/Dark Mode"
date: 2019-04-02 23:04:00 +0800
tags: 
---
    
macOS 禁用程序的黑色模式/Dark Mode
===

macOS Mojave 中引入了系统层面的黑色模式，Chrome 73 在应用中支行了这一模式，即系统设置为黑色模式时，Chrome 会自动适应切换到 Dark Mode。

![Chrome 跟随系统设置的黑色模式](https://user-images.githubusercontent.com/3783096/55413010-114c0f80-559b-11e9-9ec1-7080e80ad92a.png)
_Chrome 跟随系统设置的黑色模式_


很酷对不？

但其实黑色模式下标题与顶部系统菜单融为一体，且黑色模式下 Chrome 标签上内容辨识度也不高了，看起来还是有点别扭。更重要的是，这个模式让人很难区分隐身模式。

![Chrome 黑色模式下与隐身模式的对比](https://user-images.githubusercontent.com/3783096/55413062-2d4fb100-559b-11e9-88f2-3bfe5c5a5b97.png)
_Chrome 黑色模式下与隐身模式的对比_


所以决定系统使用 Dark Mode 的情况下将 Chrome 的黑色禁用。

通过命令行中设置 `defaults` 值可达到目的。

```sh
$ defaults write com.google.Chrome NSRequiresAquaSystemAppearance -bool Yes
```

如果想恢复默认，只需要将刚才设置的值删掉或者将 `Yes` 设置成 `No`。

```sh
$ defaults delete com.google.Chrome NSRequiresAquaSystemAppearance
```


## 禁用任意 App 的 Dark Mode

推而广之，不仅可禁止 Chrome 进入 Dark Mode，还可让其他任意 App 不进入 Dark Mode，如果该应用支持过 Dark Mode 的话。只需要找出该应用的打包发布的 bundle id 即可。这个 id 可通过下面的命令来得到。比如查看 Canary 版本的 Chrome：

```sh
$ osascript -e 'id of app "Google Chrome Canary"'
com.google.Chrome.canary
```

其中 `Google Chrome Canary` （不区分大小写）是你在程序文件夹下看到的 `.app` 后缀的那个文件的文件名，比如这里 `Google Chrome Canary.app`。得到的 id 为 `com.google.Chrome.canary` 再代入最上面的命令中即可。

### 程序 bundle id 的查找

更为准备的方式，查找 id，是通过右键 `.app` 文件选择 `Show Package Contents`，然后找到 `Contents>info.plist` 文件，搜索 `CFBundleIdentifier` 即可看到该程序的 bundle id。


```sh
$ defaults write com.google.Chrome.canary NSRequiresAquaSystemAppearance -bool Yes
```

这里 id 是区分大小写的，写错不生效。

要恢复默认时同理。

### 一些常用软件

- 网易云音乐

同理，设置网易云音乐关闭其黑色模式，通过 `plist` 文件发现其 bundle id 为 `com.netease.163music`，

```sh
...
<key>CFBundleIdentifier</key>
<string>com.netease.163music</string>
...
```

设置：

```sh
defaults write com.netease.163music NSRequiresAquaSystemAppearance -bool Yes
```

- iBooks:

```sh
defaults write com.apple.iBooksX NSRequiresAquaSystemAppearance -bool Yes
```

- Xcode:

```sh
defaults write com.apple.dt.Xcode NSRequiresAquaSystemAppearance -bool YES
```

- Notes:

```sh
defaults write com.apple.Notes NSRequiresAquaSystemAppearance -bool Yes
```

### 其他默认值

通过 `defaults read` 可查看到所有应用已经存在的的 defaults 值。

```sh
$ defaults read >> defaults.txt
```

打开 `defaults.txt` 后搜索相应 app 的 id 可看到其所有可用值的列表。比如搜索 `com.google.chrome`

```
{
      "com.google.Chrome" =     {
        KeychainReauthorizeInAppSpring2017 = 2;
        KeychainReauthorizeInAppSpring2017Success = 1;
        LastRunAppBundlePath = "/Applications/Google Chrome.app";
        ...
    };
    "com.google.Chrome.canary" =     {
        KeychainReauthorizeInAppSpring2017 = 1;
        KeychainReauthorizeInAppSpring2017Success = 1;
        LastRunAppBundlePath = "/Applications/Google Chrome Canary.app";
        ...
    };
}
```


### 相关资源

- [How to disable Google Chrome Dark Mode?](https://superuser.com/questions/1417973/how-to-disable-google-chrome-dark-mode)
- [Concise, compact list of all 'defaults' currently configured and their values?](https://apple.stackexchange.com/questions/195244/concise-compact-list-of-all-defaults-currently-configured-and-their-values)

    