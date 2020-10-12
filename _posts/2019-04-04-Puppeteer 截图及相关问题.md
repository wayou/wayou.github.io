---
layout: post
title: "Puppeteer 截图及相关问题"
date: 2019-04-04 21:04:00 +0800
tags: 
---
    
Puppeteer 截图及相关问题
===

[Puppeteer](https://pptr.dev) 是 Headless Chrome 的 Node.js 封装。通过它可方便地对页面进行截图，或者保存成 PDF。

## 镜像的设置

因为其使用了 Chromium，其源在 Google 域上，最好设置一下 npm 从国内镜像安装，可解决无法安装的问题。

推荐在项目中放置 `.npmrc` 或 `.yarnrc` 文件来进行镜像的设置，这样设置只针对项目生效，不影响其他项目，同时其他人不用重复在本地设置。

这是一个整理好的 [`.npmrc` 文件](https://gist.github.com/wayou/baa18849de3424db5d7ca24e94645c25)，如果使用的是 yarn，对应的 [`.yarnrc` 文件](https://gist.github.com/wayou/a1a6fb1fc5153bc20829c7b2700ec0bc)。也可通过如下命令从 GitHub gist 下载到项目中，

```sh
# .npmrc
$ npx pkgrc

# .yarnc
$ npx pkgrc yarn
```

## 截取页面

使用 [`page.screenshot()`](https://pptr.dev/#?product=Puppeteer&version=v1.14.0&show=api-pagescreenshotoptions) API 进行截图的示例：

```js
const puppeteer = require("puppeteer");

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto("https://example.com");
  await page.screenshot({ path: "screenshot.png" });
  await browser.close();
});
```

实际应用中，你需要加上等待时间，以保证页面已经完全加载，否则截取出来的画面是页面半成品的样子。

通过 [`page.waitFor()`](https://pptr.dev/#?product=Puppeteer&version=v1.14.0&show=api-pagewaitforselectororfunctionortimeout-options-args) 可让页面等待指定时间，

```diff
const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto('https://example.com');

    // 等待一秒钟
+  await page.waitFor(1000);

  await page.screenshot({path: 'screenshot.png'});
  await browser.close();
});
```

但这里无论你指定的时长是多少，都是比较主观的值。页面实际加载情况受很多因素影响，机器性能，网络好坏等。即页面加载完成是个无法预期的时长，所以这种方式不靠谱。我们应该使用另一个更加有保障的方式，在调用 [`page.goto()`](https://pptr.dev/#?product=Puppeteer&version=v1.14.0&show=api-pagegotourl-options) 时，可指定 `waitUntil` 参数。

```diff
const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto('https://example.com’,{
+      waitUtil: 'networkidle2'
  });
  await page.screenshot({path: 'screenshot.png'});
  await browser.close();
});
```

> networkidle2 - consider navigation to be finished when there are no more than 2 network connections for at least 500 ms.
> _-- 来自 [puppeteer 文档中关于 `waitUtil` 参数的描述](https://pptr.dev/#?product=Puppeteer&version=v1.14.0&show=api-pagegotourl-options)_

`networkidle2` 会一直等待，直到页面加载后同时没有存在 2 个以上的资源请求，这个种状态持续至少 500 ms。

此时再进行截图，是比较保险的了。

截图时还有个实用的参数 `fullPage`，一般情况下也会搭配着使用，对整个页面进行截取。如果页面过长，超出了当前视窗（viewport），它会自动截取超出的部分，即截取结果是长图。这应该是大部分情况下所期望的。

```js
await page.screenshot({ path: "screenshot.png", fullPage: true });
```

注意，其与 `clip` 参数互斥，即，如果手动指定了 clip 参数对页面进行范围的限定，则不能再指定 `fullPage` 参数。

```js
// 💥 抛错！
await page.screenshot({
  path: "screenshot.png",
  fullPage: true,
  clip: {
    x: 0,
    y: 0,
    width: 400,
    height: 400
  }
});
```

## 针对页面中某个元素进行截取

如果你使用过 Chrome DevTool 中的截图命令，或许知道，其中有一个针对元素进行截取的命令。

![Chrome DevTool 中对元素进行截图的命令](https://user-images.githubusercontent.com/3783096/55492896-93573980-566a-11e9-834f-9419a3758981.png)
<p align="center">Chrome DevTool 中对元素进行截图的命令</p>


所以，除了对整个页面进行截取，Chrome 还支持对页面某个元素进行截取。通过 [`elementHandle .screenshot()`](https://pptr.dev/#?product=Puppeteer&version=v1.14.0&show=api-elementhandlescreenshotoptions) 可针对具体元素进行截取。

这就很实用了，能够满足大部分自定义的需求。大多数情况下，我们只对 body 部分感兴趣，通过只对 body 进行截取，就不用指定长宽而且自动排除掉 body 外多余的留白等。

```js
const puppeteer = require("puppeteer");

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto("https://example.com", {
    waitUtil: "networkidle2"
  });
  const element = await page.$("body");
  await element.screenshot({
    path: "screenshot.png"
  });
});
```

其参数与 `page.screenshot()` 一样。需要注意的是，虽说一样，但其中是不能使用 `fullPage` 参数的。因为针对元素进行图片截取已经表明是局部截图了，与 `fullPage` 截取整个页面是冲突的，但它还是会自动滚动以截取完整的这个元素， `fullPage` 的优点没有丢掉。


## 数据的返回

生成的图片可直接返回，也可保存成文件后返回文件地址。

其中，截图方法 `page.screenshot([options])` 的返回是 `<Promise<string|Buffer>>`，即生成的可能是 buffer 数据，也可以是base64 形式的字符串数据，默认为 Buffer 内容，通过设置 `encoding` 参数为 `base64` 便可得到字符串形式的截图数据。

以 Koa 为例，binary 形式的 buffer 数据直接赋值给 `ctx.body` 进行返回，通过 `response.attachment` 可设置返回的文件名。

```js
app.use(async ctx => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const buffer = await page.screenshot();
  await browser.close();
  ctx.response.attachment("screenshot.png");
  ctx.body = buffer;
});
```

字符串形式时，需要注意拿到的并不是标准的图片 base64 格式，它只包含了数据部分，并没有文件类型部分，即 `data:image/png;base64`，所以需要手动拼接后才是正确可展示的图片。

```js
app.use(async ctx => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const base64 = await page.screenshot({ encoding: "base64" });
  await browser.close();
  ctx.body = `<img src="data:image/png;base64,${base64}"/>`;
});
```

如果你是以异步接口形式返回到前端，只需要将 `"data:image/png;base64,${base64}"` 这部分作为数据返回即可。

当然，字符串形式下，仍然是可以返回成文件下载的形式的，

```js
app.use(async ctx => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const base64 = await page.screenshot({ encoding: "base64" });
  await browser.close();
  ctx.response.attachment("screenshot.png");
  const image = new Buffer(base64, "base64");
  ctx.body = image;
});
```

## PDF 的生成

通过 [`page.pdf([options])`](https://pptr.dev/#?product=Puppeteer&version=v1.14.0&show=api-pagepdfoptions) 可将页面截取成 PDF 格式。

```js
const puppeteer = require("puppeteer");

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.emulateMedia("screen");
  await page.goto("https://www.google.com/chromebook/");
  await page.pdf({
    path: "puppeteer.pdf",
    format: "A4"
  });

  await browser.close();
}

run();
```

一般 PDF 用于打印，所以默认以 `print` 媒体查询 （media query）的样式来截取。这里调用 `page.emulateMedia("screen")` 显式指定环境为 `screen` 而不是 `print` 是为了得到更加接近于页面在浏览器中展示的效果。

需要注意的是，如果页面中使用了背景图片，上面代码截取出来是看不到的。

![截图 PDF 时背景图片未显示](https://user-images.githubusercontent.com/3783096/55738983-c3338200-5a5a-11e9-9874-22002bb8da20.png)
<p align="center">截图 PDF 时背景图片未显示</p>

需要设置截取时的 ` printBackground` 参数为 `true`：

```diff
  await page.pdf({
    path: "puppeteer.pdf",
    format: "A4",
+    printBackground: true
  });
```

![修正后截图的 PDF 背景图片正常显示](https://user-images.githubusercontent.com/3783096/55739102-fa099800-5a5a-11e9-93e6-f9840eba698d.png)
<p align="center">修正后截图的 PDF 背景图片正常显示</p>


## 一些问题

### 服务器字体文件问题

部署到全新的 Linux 环境时，大概率你会看到截来的图片中中文无法显示。

![中文字体缺失的情况](https://user-images.githubusercontent.com/3783096/55492861-833f5a00-566a-11e9-9ae2-f4b09a16becc.png)
<p align="center">中文字体缺失的情况</p>

￼
那是因为系统缺少中文字体，Chromium 无法正常渲染。你需要[安装](https://help.accusoft.com/PCC/v11.2/HTML/Installing%20Asian%20Fonts%20on%20Ubuntu%20and%20Debian.html)中文字体，通过包管理工具或者手动下载安装。

```sh
$ sudo apt-get install language-pack-zh*
$ sudo apt-get install chinese*
```

### 服务器上 Chromium 无法启动的问题

在 Puppeteer 的 [troubleshoting 文档](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch) 中有对应的解决方案。

```
(node:24206) UnhandledPromiseRejectionWarning: Error: Failed to launch chrome!
```

一般是机器上缺少对应的依赖库，安装补上即可。Puppeteer 自带的 Chromium 是非常纯粹的，它不会安装除了自身作为浏览器外的其他东西。

通过 `ldd` （List Dynamic Dependencies）命令可查看运行 Chromium 运行所需但缺少的 shared object dependencies。

<details>
<summary>查看缺少的依赖项</summary>
<p>

```sh
$ ldd node_modules/puppeteer/.local-chromium/linux-641577/chrome-linux/chrome | grep not
        libX11.so.6 => not found
        libX11-xcb.so.1 => not found
        libxcb.so.1 => not found
        libXcomposite.so.1 => not found
        libXcursor.so.1 => not found
        libXdamage.so.1 => not found
        libXext.so.6 => not found
        libXfixes.so.3 => not found
        libXi.so.6 => not found
        libXrender.so.1 => not found
        libXtst.so.6 => not found
        libgobject-2.0.so.0 => not found
        libglib-2.0.so.0 => not found
        libnss3.so => not found
        libnssutil3.so => not found
        libsmime3.so => not found
        libnspr4.so => not found
        libcups.so.2 => not found
        libdbus-1.so.3 => not found
        libXss.so.1 => not found
        libXrandr.so.2 => not found
        libgio-2.0.so.0 => not found
        libasound.so.2 => not found
        libpangocairo-1.0.so.0 => not found
        libpango-1.0.so.0 => not found
        libcairo.so.2 => not found
        libatk-1.0.so.0 => not found
        libatk-bridge-2.0.so.0 => not found
        libatspi.so.0 => not found
        libgtk-3.so.0 => not found
        libgdk-3.so.0 => not found
        libgdk_pixbuf-2.0.so.0 => not found
```
</p>
</details>


那么多，一个个搜索（因为这里例出的名称不一定就是直接可用来安装的名称）安装多麻烦。所以需要用其他方法。

以 Debian 系统为例。

_tips: 可通过 `$ cat /etc/os-release` 查看系统信息从而判断是什么系统。_

```sh
$ cat /etc/os-release
PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
```

#### 脚本安装

通过 troubleshoting 页面 [Chrome headless doesn't launch 部分](https://stackoverflow.com/a/44698744/1553656)其列出的对应系统所需依赖中，将所有依赖复制出来组装成如下的命令执行：

```sh
sudo apt-get install gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

#### 通过安装 Chrome 来自动安装

直接安装一个非 Chromium 版本的 Chrome，它会把依赖自动安装上。

Chrome 是基于 Chromium 的发行版，包括 `google-chrome-stable`，`google-chrome-unstable`，`google-chrome-beta`，安装任意一个都行。

还是以 Debian 系统为例：

```sh
$ apt-get update && apt-get install google-chrome-unstable
```

如果直接执行上面的安装，会报错：

```sh
E: Unable to locate package google-chrome-unstable
```

这是安装程序时的一个[安全相关策略](https://stackoverflow.com/a/44698744/1553656) ，需要先设置一下 `apt-key`。

```sh
$ wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
```

然后设置 Chrome 的仓库：

```sh
$ sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
```

再次执行安装便正常进行了。

安装时可以看到会提示所需的依赖项：

<details><summary>安装 Chrome 时的提示信息</summary>
<p>

```sh
$ sudo apt-get install google-chrome-unstable
Reading package lists... Done
Building dependency tree
Reading state information... Done
The following additional packages will be installed:
  adwaita-icon-theme at-spi2-core dbus dconf-gsettings-backend dconf-service fontconfig fontconfig-config fonts-liberation glib-networking
  glib-networking-common glib-networking-services gsettings-desktop-schemas gtk-update-icon-cache hicolor-icon-theme libappindicator3-1
  libasound2 libasound2-data libatk-bridge2.0-0 libatk1.0-0 libatk1.0-data libatspi2.0-0 libauthen-sasl-perl libavahi-client3
  libavahi-common-data libavahi-common3 libcairo-gobject2 libcairo2 libcolord2 libcroco3 libcups2 libdatrie1 libdbus-1-3 libdbusmenu-glib4
  libdbusmenu-gtk3-4 libdconf1 libdrm-amdgpu1 libdrm-intel1 libdrm-nouveau2 libdrm-radeon1 libdrm2 libegl1-mesa libencode-locale-perl
  libepoxy0 libfile-basedir-perl libfile-desktopentry-perl libfile-listing-perl libfile-mimeinfo-perl libfont-afm-perl libfontconfig1
  libfontenc1 libgbm1 libgdk-pixbuf2.0-0 libgdk-pixbuf2.0-common libgl1-mesa-dri libgl1-mesa-glx libglapi-mesa libglib2.0-0 libglib2.0-data
  libgraphite2-3 libgtk-3-0 libgtk-3-bin libgtk-3-common libharfbuzz0b libhtml-form-perl libhtml-format-perl libhtml-parser-perl
  libhtml-tagset-perl libhtml-tree-perl libhttp-cookies-perl libhttp-daemon-perl libhttp-date-perl libhttp-message-perl
  libhttp-negotiate-perl libice6 libindicator3-7 libio-html-perl libio-socket-ssl-perl libipc-system-simple-perl libjbig0 libjpeg62-turbo
  libjson-glib-1.0-0 libjson-glib-1.0-common liblcms2-2 libllvm3.9 liblwp-mediatypes-perl liblwp-protocol-https-perl libmailtools-perl
  libnet-dbus-perl libnet-http-perl libnet-smtp-ssl-perl libnet-ssleay-perl libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0
  libpangoft2-1.0-0 libpciaccess0 libpixman-1-0 libproxy1v5 librest-0.7-0 librsvg2-2 librsvg2-common libsensors4 libsm6 libsoup-gnome2.4-1
  libsoup2.4-1 libthai-data libthai0 libtie-ixhash-perl libtiff5 libtimedate-perl libtxc-dxtn-s2tc libu2f-udev liburi-perl
  libwayland-client0 libwayland-cursor0 libwayland-egl1-mesa libwayland-server0 libwww-perl libwww-robotrules-perl libx11-6 libx11-data
  libx11-protocol-perl libx11-xcb1 libxau6 libxaw7 libxcb-dri2-0 libxcb-dri3-0 libxcb-glx0 libxcb-present0 libxcb-render0 libxcb-shape0
  libxcb-shm0 libxcb-sync1 libxcb-xfixes0 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxdmcp6 libxext6 libxfixes3 libxft2 libxi6
  libxinerama1 libxkbcommon0 libxml-parser-perl libxml-twig-perl libxml-xpathengine-perl libxml2 libxmu6 libxmuu1 libxpm4 libxrandr2
  libxrender1 libxshmfence1 libxss1 libxt6 libxtst6 libxv1 libxxf86dga1 libxxf86vm1 perl-openssl-defaults sgml-base shared-mime-info
  x11-common x11-utils x11-xserver-utils xdg-user-dirs xdg-utils xkb-data xml-core
```
</p>
</details>

按[Y] 确认即可。

有了这些依赖，Puppeteer 中的 Chromium 便可运行了。

```sh
$ google-chrome-unstable --version
Google Chrome 75.0.3745.4 dev
$ ldd node_modules/puppeteer/.local-chromium/linux-641577/chrome-linux/chrome | grep not
```

`google-chrome-unstable --version` 正常输出版本号表示安装成功，再次检查 `not found` 的依赖项输出为空。

我们的目的只是安装依赖，所以装完后可移除 Chome。`apt-get remove google-chrome-unstable` 时会自动列出其依赖项，就像安装时一样。后续如果机器上不再需要 Chromium 了可通过 `apt-get autoremove` 来清理。

<details><summary>卸载 Chrome 时的提示信息</summary>
<p>

```sh
$ sudo apt-get remove google-chrome-unstable
...
Building dependency tree
Reading state information... Done
The following packages were automatically installed and are no longer required:
  adwaita-icon-theme at-spi2-core dconf-gsettings-backend dconf-service fontconfig fontconfig-config fonts-liberation glib-networking
  glib-networking-common glib-networking-services gsettings-desktop-schemas gtk-update-icon-cache hicolor-icon-theme libappindicator3-1
  libasound2 libasound2-data libatk-bridge2.0-0 libatk1.0-0 libatk1.0-data libatspi2.0-0 libauthen-sasl-perl libavahi-client3
  libavahi-common-data libavahi-common3 libcairo-gobject2 libcairo2 libcolord2 libcroco3 libcups2 libdatrie1 libdbusmenu-glib4
  libdbusmenu-gtk3-4 libdconf1 libdrm-amdgpu1 libdrm-intel1 libdrm-nouveau2 libdrm-radeon1 libdrm2 libegl1-mesa libencode-locale-perl
  libepoxy0 libfile-basedir-perl libfile-desktopentry-perl libfile-listing-perl libfile-mimeinfo-perl libfont-afm-perl libfontconfig1
  libfontenc1 libgbm1 libgdk-pixbuf2.0-0 libgdk-pixbuf2.0-common libgl1-mesa-dri libgl1-mesa-glx libglapi-mesa libglib2.0-0 libglib2.0-data
  libgraphite2-3 libgtk-3-0 libgtk-3-bin libgtk-3-common libharfbuzz0b libhtml-form-perl libhtml-format-perl libhtml-parser-perl
  libhtml-tagset-perl libhtml-tree-perl libhttp-cookies-perl libhttp-daemon-perl libhttp-date-perl libhttp-message-perl
  libhttp-negotiate-perl libice6 libicu57 libindicator3-7 libio-html-perl libio-socket-ssl-perl libipc-system-simple-perl libjbig0
  libjpeg62-turbo libjson-glib-1.0-0 libjson-glib-1.0-common liblcms2-2 libllvm3.9 liblwp-mediatypes-perl liblwp-protocol-https-perl
  libmailtools-perl libnet-dbus-perl libnet-http-perl libnet-smtp-ssl-perl libnet-ssleay-perl libnspr4 libnss3 libpango-1.0-0
  libpangocairo-1.0-0 libpangoft2-1.0-0 libpciaccess0 libpixman-1-0 libproxy1v5 librest-0.7-0 librsvg2-2 librsvg2-common libsensors4 libsm6
  libsoup-gnome2.4-1 libsoup2.4-1 libthai-data libthai0 libtie-ixhash-perl libtiff5 libtimedate-perl libtxc-dxtn-s2tc libu2f-udev
  liburi-perl libuv1 libwayland-client0 libwayland-cursor0 libwayland-egl1-mesa libwayland-server0 libwww-perl libwww-robotrules-perl
  libx11-6 libx11-data libx11-protocol-perl libx11-xcb1 libxau6 libxaw7 libxcb-dri2-0 libxcb-dri3-0 libxcb-glx0 libxcb-present0
  libxcb-render0 libxcb-shape0 libxcb-shm0 libxcb-sync1 libxcb-xfixes0 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxdmcp6 libxext6
  libxfixes3 libxft2 libxi6 libxinerama1 libxkbcommon0 libxml-parser-perl libxml-twig-perl libxml-xpathengine-perl libxml2 libxmu6 libxmuu1
  libxpm4 libxrandr2 libxrender1 libxshmfence1 libxss1 libxt6 libxtst6 libxv1 libxxf86dga1 libxxf86vm1 perl-openssl-defaults sgml-base
  shared-mime-info x11-common x11-utils x11-xserver-utils xdg-user-dirs xdg-utils xkb-data xml-core
Use 'sudo apt autoremove' to remove them.
The following packages will be REMOVED:
  google-chrome-unstable
0 upgraded, 0 newly installed, 1 to remove and 25 not upgraded.
After this operation, 213 MB disk space will be freed.
Do you want to continue? [Y/n]
(Reading database ... 71778 files and directories currently installed.)
Removing google-chrome-unstable (75.0.3745.4-1) ...
Processing triggers for mime-support (3.60) ...
Processing triggers for man-db (2.7.6.1-2) ...
```
</p>
</details>



### sandbox 的问题

Linux 上 Puppeteer 启动 Chromium 时可能会看到如下的错误提示：

```sh
[0402/152925.182431:ERROR:zygote_host_impl_linux.cc(89)] Running as root without --no-sandbox is not supported. See https://crbug.com/638180.
```

错误信息已经很明显，所以在启动时加上 `--no-sandbox` 参数即可。

```js
const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
```
但考虑到安全问题，Puppeteer 是[强烈不建议](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#setting-up-chrome-linux-sandbox)在无沙盒环境下运行，除非加载的页面其内容是绝对可信的。

如果需要设置在沙盒中运行，可参考[文档中的两种方法](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#recommended-enable-user-namespace-cloning)。


## 相关资源

- [puppeteer troubleshooting](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch)
- [How to Update and Install Latest Chrome in Linux/Ubuntu](https://linoxide.com/linux-how-to/install-latest-chrome-run-terminal-ubuntu/)
- [How to Manually Install, Update, and Uninstall Fonts on Linux](https://medium.com/source-words/how-to-manually-install-update-and-uninstall-fonts-on-linux-a8d09a3853b0)
- [Installing Asian Fonts on Ubuntu & Debian](https://help.accusoft.com/PCC/v11.2/HTML/Installing%20Asian%20Fonts%20on%20Ubuntu%20and%20Debian.html)

    