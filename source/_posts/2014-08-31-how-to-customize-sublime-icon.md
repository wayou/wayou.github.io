title: 自定义Sublime Text的图标
categories: 未分类
date: 2014-08-31 11:56:00
tags:
- 技巧
- sublimetext
- 自定义
- icon
---

[sublime text](http://www.sublimetext.com/3)很赞，windows上最接近mac逼格的轻量编辑器，对于我这样比较喜欢格调的人来说，简直不二之选啊。


美中不足的是，看久了觉得它的图标似乎不是很上心。现在都流行扁平化了而它还停留在拟物的阶段，拟物也就算了还带一点立体感把整个平面内顷，于是乎想自己换个图标，换个好心情。

如果你有同样的审美那我们继续。

<!-- more -->

step1. 选择喜欢的图片
---

首先你需要选择一个中意的图片做为新的图标，这里拿我喜欢的章鱼猫为例。
![octocat](/asset/posts/2014-08-31-how-to-customize-sublime-icon/octocat.png)

当然你不喜欢章鱼猫，随便[谷歌一下](https://www.google.com/search?q=octocat+icon&newwindow=1&safe=off&tbm=isch&imgil=wqxX4jp591NZZM%253A%253Beb8wapPIz1AUTM%253Bhttps%25253A%25252F%25252Fsupport.wombat.co%25252Fhc%25252Fen-us%25252Farticles%25252F202245250-Shipstation-Integration-&source=iu&fir=wqxX4jp591NZZM%253A%252Ceb8wapPIz1AUTM%252C_&usg=__2FX1-Ux3h7wdDssc2u6t_4Ba7Nc%3D&sa=X&ei=EJ8CVI32HNjd8AXYp4KIAw&ved=0CCsQ9QEwBQ&biw=1366&bih=683#newwindow=1&q=sublime+text+icon&safe=off&tbm=isch&facrc=_&imgdii=_&imgrc=NPM_JHMY3bmkdM%253A%3BavC4jPKJkwSy8M%3Bhttp%253A%252F%252Fwww.jonathanfontes.pt%252Fassets%252Fimg%252Flogo-sublime-3.png%3Bhttp%253A%252F%252Fwww.jonathanfontes.pt%252F%3B512%3B512)还是有很多正常的ST图标的，比如下面这些
![sublime](/asset/posts/2014-08-31-how-to-customize-sublime-icon/sublime.png)

step2. 转为ico格式
---

网上找的图片大多为`png`或`jpg`格式的，这里我们需要`ico`, so 需要转换一下下。
同样，转`ico`格式的网站也是蛮多的，比如[这个](http://www.convertico.com/),进去后把图片上传，完了下下来后你得到的就是一个`.ico` 格式的图片啦~

![转ico格式](/asset/posts/2014-08-31-how-to-customize-sublime-icon/convert_icon.png)

step3. ResEdit
---

[ResEdit](http://www.resedit.net/)是一个Windows下的资源编辑器，可以直接编辑`exe`文件，更改替换其中的资源，这里我们就用它来更改`exe` 程序的图标。
如果你手头没有，可以点击上面的链接进入官方页面选择下载。

step4. 用ResEdit打开SublimeText
---

将SublimeText安装目录下的`sublime_text.exe`复制一分放到比如桌面什么的。
运行ResEdit, `File->Open Project...`, 打开刚才复制的`sublime_text.exe`。

![用ResEdit打开sublime_text.exe后](/asset/posts/2014-08-31-how-to-customize-sublime-icon/openned.png)

step5. 替换图标
---

打开后差不多就像上面截图一样，你会看到左边`Resources`里第一个便是`Icon`, 在这个文件夹上面右击选择`Add resource...->Icon`,如下图

![添加icon资源](/asset/posts/2014-08-31-how-to-customize-sublime-icon/add_resource.png)

之后在弹出的对话框里选择`Create from an existing file`

![选择从现有文件创建](/asset/posts/2014-08-31-how-to-customize-sublime-icon/choose_type.png)

之后去选中我们先前准备好的`ico`文件，将其加载进来。

完了`Icon`文件夹下多了我们自己的icon文件，现在把原来的图标删除，右击`103[English (Australia)]` 选择`Remove from project`。

![删除原来的图标](/asset/posts/2014-08-31-how-to-customize-sublime-icon/remove.png)


最后点击`File->Save`。

step final. 替换exe
---

最后，将更改后的`sublime_text.exe`考回SublimeText安装目录下将原来的文件覆盖，当然，如果你以后可能想要恢复原来的图标的话，建议你覆盖前将原来的`sublime_text.exe`文件备份一下。

All done!

![octocat sublimetext](/asset/posts/2014-08-31-how-to-customize-sublime-icon/final.png)








