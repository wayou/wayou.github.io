title: Nexus 5 刷机及ROOT
toc: true
categories: 科技有意思
date: 2014-12-21 11:17:10
tags:
- nexus
- android
---

> 刷机有风险，root需谨慎！
> following steps below on your own risk

<!-- more -->

Google死忠入手一台Nexus是必需的事情。Nexus6 刚出，特别赞，但被尺寸吓到了，机身跟6 plus差不离。觉得这样的尺寸无法接受，遂入手Nexus5。我不算太能折腾，所以不想去刷机什么的。但问题来了，Android 5 棒棒糖太吸引人，Material Design 简直美Cry。

对于Google死忠来说，这样的诱惑是难以抵挡的。于是咬咬牙，升！

Nexus5 自带Android 4.4.3其实可以接收OTA自动升级到最新版本的。鉴于国内特殊情况，要完成顺利的升级你得懂得科学上网，而且是让手机科学上网。

![](/asset/posts/2014-12-21-nexus-root/1.png)

科学上网只是第一步，保证你手机可以下载到更新，值得提及的是升级过程似乎只能一步一步来，4.4.3 到4.4.4，然后4.4.4 到 5.0， 最后才是5.0.1。

如果手机之前ROOT过，OTA有可能不会那么自动，更新包下载完成重启时可能进入安装界面，于是不知道怎么操作，也没搜到相关资料，只能手动刷了。

当然，如果你没有VPN，不能科学上网，你的唯一选择就只有手动刷了。

但先让我们来ROOT，因为官方都说了，安装新系统镜像前有可能需要`unlock`，所以为了提高成功率还是先ROOT一下。

# ROOT


## ROOT视频教程

你可以看[此视频教程](http://v.youku.com/v_show/id_XODUzNDIyOTc2.html)（从Youtube 扒到优酷的），也可以跟随下面的步骤，多体位任君选择。

<iframe height=498 width=510 src="http://player.youku.com/embed/XODUzNDIyOTc2" frameborder=0 allowfullscreen></iframe>

## 准备

开始之前，你需要准备一些工具。包括了系统驱动及一些`adb`命令行工具等，可以[点此下载](http://downloadandroidrom.com/file/Nexus5/root/Nexus5Root.zip)。

### 开启手机开发者选项

开启手机开发者调试选项。

> Settings->About Phone

进入「关于手机」界面，下拉到底部，连续点击`Build number` 直到出现提示说还剩多少次点击便可开启开发者选项，再继续，最后会提示你开启成功。

![](/asset/posts/2014-12-21-nexus-root/3.jpg)
> 图片来自[How to easily root an Android device](http://www.cnet.com/how-to/how-to-easily-root-an-android-device/)


然后返回到上一级，会多出一个菜单 `Developer options`,点击进入。选中`USB debugging`。

![](/asset/posts/2014-12-21-nexus-root/4.png)


### 驱动安装

首先需要在电脑上安装识别手机的驱动。这里以Window为例。将手机用数据线连接到电脑。前面已经开启了USB调试选项，连接后，手机出现提示是否允许调试，选中同意。

- 下载上面提到的[root工具](http://downloadandroidrom.com/file/Nexus5/root/Nexus5Root.zip)后解压。

- 进入Windows的设备管理器（控制面板->设备管理器）, 此时我们的手机应该是未识别的设备，有黄色图标。

![](/asset/posts/2014-12-21-nexus-root/5.jpg)

> 双击该设备打开属性面板，然后选择「更新驱动」，在弹出的窗口中选择从本地电脑中选择驱动。

![](/asset/posts/2014-12-21-nexus-root/6.jpg)

> 在弹出的窗口中再次选择从电脑中浏览，之后在弹出的窗口中直接点击「下一步」。

![](/asset/posts/2014-12-21-nexus-root/7.jpg)

> 下一步窗口中选择`Have Disk...` 打开`Install From Disk` 窗口。选择「浏览」定位到之前解压的位置，选中`Nexus5Root\usb_driver\android_winusb.inf` 进行安装。

![](/asset/posts/2014-12-21-nexus-root/8.jpg)

> 接下来选择`Android ADB Interface` 再点击「下一步」开始安装。

![](/asset/posts/2014-12-21-nexus-root/9.jpg)

到此，驱动安装完成！


### 资料备份

如果你是新手机，没啥重要数据，或者通讯录什么的都云端备份了，这一步就可以省了。如果你想保存手机上的APP信息什么的，那就过一下此步骤吧。

注意这个时候你的手机应该是开机状态且用数据线连接到电脑了。

- 还是在之前解压的文件夹下，按住左键在空白处右击，在出来的菜单中选择「在此处打开命令行」

![](/asset/posts/2014-12-21-nexus-root/10.png)

- 输入`adb devices` 查看设备连接状态。第一次可能会需要在手机上弹出的确认窗口中点击一下确认。正常情况下命令行里会返回已经识别到的机器。

![](/asset/posts/2014-12-21-nexus-root/11.jpg)

- 输入`adb backup -apk -all -f backup.ab` 进行资料备份。此时到手机上点击确定开始进行备份。

分分钟后备份工作完毕！

## ROOT 进行时

接下来开始ROOT。

此时你的手机也保持和电脑连接的。

-  先是手机关机。之后按住音量向下键和电源键，一定是同时按住，大概2秒后进入启动界面。 

- 此时你需要重复上面驱动安装的步骤再次安装一下驱动，如果设备管理器里面手机图标还是带黄色感叹号的话

- 还是在刚才的命令行里面，输入`fastboot oem unlock`，这就是鉴证奇迹的时刻。此时到手机上用音量键选择`YES` 然后按电源键来确认。然后系统开始擦除数据，进行ROOT。大概秒秒钟后完成。成功后会显示系统状态为`unlocked`

- 然后用音量键选择`Start`模式启动手机

此时手机启动后就焕然一新了，需要重新设置时间等。

## 安装ROOT授权管理软件

接下来需要安装一个ROOT授权管理软件，以方便我们管理软件。

- 开机后手机还是连接到电脑的。将解压包里的`UPDATE-SuperSU-v1.65.zip` 文件复制到手机SD卡

- 然后关机。还是以上面那种方式，按住音量向下键和电源键，直到启动界面出现

- 还是原来的命令行窗口里面，输入`fastboot flash recovery openrecovery-twrp-2.6.3.1-hammerhead.img` 写入`recovery` 程序

- 成功后到手机上，用音量键切换到`Recovery mode`，按电源键确定进入。此时手机重启，进入`recovery` 界面

- 选择`Install`, 然后找到你复制到SD卡中的`UPDATE-SuperSU-v1.65.zip`，选择中它。现在出现提示叫你「滑动来确定安装」，滑动安装之

- 秒秒钟后安装成功，选择重启系统

重启后多了个 Super SU 软件，这个就是用来管理ROOT授权的。

到此系统ROOT完毕！

## 资料还原

现在需要做的就是还原之前备份的资料。

此时手机已经焕然一新了，于是我们需要重复之前的步骤来开启手机的开发者调试选项。步骤见上文。

然后手机同样连接到电脑。

- 输入`adb devices` 查看设备连接状态

- 输入`adb restore backup.ab` 进行还原。此时到手机上操作，选择恢复

如果顺利的话，到此你的手机就ROOT成功并且数据还原完毕啦！


# 手动升级Android Lollipop

如果之前是Android 4.x，建议先升5再升5.0.1。升级系统不必ROOT，但至少官方有如下提示：
> 4. If necessary, unlock the device's bootloader by running:
>   `fastboot oem unlock` 

所以如果你之前尝试过升级不成功的话可以试试上面步骤先ROOT一下。并且对于喜欢折腾的发烧友们来说，手机不ROOT就无法DIY，各种摄手摄脚啊。

下面开始刷5.0.1系统。

## 下载谷歌原厂系统镜像

到[谷歌官网](https://developers.google.com/android/nexus/images)下载适配机型的img系统镜像文件。这里我们选择最新的[Nexus5 Android 5.0.1](https://dl.google.com/dl/android/aosp/hammerhead-lrx22c-factory-0f9eda1b.tgz)

![](/asset/posts/2014-12-21-nexus-root/2.jpg)

## 解压写入

此时你的手机连接到电脑并且开始的开发者调试模式。

将下载的文件解压。我的建议是将解压出来的文件与上面的root工具放一起，这样方便执行`adb` 命令时好找文件。

还是上面那个命令行工具，执行`adb reboot bootloader` 重启手机进入启动界面。

然后再执行`flash-all` 开始写入系统文件。

这一过程可能持续一会儿，分把钟的样子。

成功后如果你想解释ROOT状态，可以执行`fastboot oem lock`。

重启手机，感受全新的Material Design 美艳界面吧！

## 手动写入

如果你在执行上面的`flash-all` 脚本时出现错误了，此时需要手机写入。

方法是将下载下来的系统文件解压后，里面会有一个包含很多系统相关镜像的压缩包文件`image-hammerhead-lrx22o.zip`，将它解压。

解压后你会得到
- android-info.txt
- boot.img
- cache.img
- recovery.img
- system.img
- userdata.img

这些文件.然后将这些文件同样放到跟adb工具一起，方便之后执行命令时不用多写路径。

开始手动写入。

- 执行`fastboot flash bootloader bootloader-hammerhead-hhz12d.img` 这里的`bootloader-hammerhead-hhz12d.img` 文件名以你自己的为准，不同系统可能有不同
- 执行`fastboot flash radio radio-hammerhead-m8974a-2.0.50.2.22.img`
- 执行`fastboot reboot-bootloader` 重启
- 再依次执行
```bash
    fastboot flash recovery recovery.img
    fastboot flash boot boot.img
    fastboot flash system system.img
```

- 如果是Nexus9 完成上面的步骤后需要执行 `fastboot flash vendor vendor.img`, **注意：此步骤仅Nexus9需要**

- 执行`fastboot flash cache cache.img`
- 执行`fastboot flash userdata userdata.img` 

到此，手动写入完成！

开机即可体验！！


# refernce
- [How to Root Nexus 5! [4.4.3/4.4.4/5.0]](http://rootnexus5.com/nexus-5-root/how-to-root-nexus-5/)
- [Factory Images for Nexus Devices](https://developers.google.com/android/nexus/images)
- [Running Into The Dreaded "missing system.img" Error Flashing Android 5.0 Factory Images? Here's How To Get Around It](http://www.androidpolice.com/2014/11/12/running-into-the-dreaded-missing-system-img-error-flashing-android-5-0-factory-images-heres-how-to-get-around-it/)
