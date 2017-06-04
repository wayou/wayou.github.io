title: GBK批量转UTF8
toc: true
date: 2016-01-01 15:47:33
categories: 技术
tags:
- 编码
- bash
---

windows世界与非windows世界对文本默认编码的差异，导致文件在对方平台解压和打开后乱码。

<!-- more -->

## `iconv` 命令

为了修正文本的知码，mac/linux 下可以用`iconv` 命令来完成此任务。

基本用法为：

```bash
iconv -f <源始编码> -t <目标编码> file.txt > newfile.txt
```
或者通过`-o`来指定输出：

```bash
iconv -f <源始编码> -t <目标编码> file.txt -o newfile.txt
```

这里以常见的gbk转utf8为例，其他的转码类似。查看该命令支持的编码类型可以通过以下命令：

```bash
iconv -l
```

## 单文件转换

以下是使用示例：

```bash
iconv -f GBK -t UTF-8 foo.txt -o bar.txt
```

## 批量转换

进一步，我们可以在脚本里遍历文件实现批量转码。
保存以下脚本为sh文件到目标文件夹运行之。

```bash
FILES=$(find . -type f -name '*.*')
for f in $FILES
do
    if test -f $f; then
        CHARSET="$( file -bi "$f"|awk -F "=" '{print $2}')"
        if [ "$CHARSET" != utf-8 ]; then
            echo -e "\nConverting $f from $CHARSET to utf-8"
            # iconv -f "$CHARSET" -t utf-8 "$f" -o "$f.temp"
            iconv -f GBK -t UTF-8 "$f" -o "$f.temp"
            mv -f "$f.temp" $f
        fi
    else
        echo -e "\nSkipping $f - it's a regular file";
    fi
done
```
上为脚本为多次尝试的结果，注释行是尝试将原来文件的编码做为`iconv`的`-f`参数，发现由`file` 命令获得的编码信息并不可靠，所以将它得到的结果做为`iconv` 的入参并不能有效保证文本转码成功，于是索性将入参写死为`GBK`。
同时先将转码后的文件临时保存，再多一步`mv`一下也是尝试后的结果。

## 文件名乱码

另一种情况是文件名的乱码，此种情况经常发生在这样的场景：从windows传来的压缩文件到mac解压后文件名乱码。
大致是因为压缩时采用windows默认编码到mac解压时编码不一致。

完成此任务的命令为`convmv`。

关于文件名乱码的解决找到了两篇文章，[Work around of file name problem while unzip handling CJK encodings](https://blogs.gnome.org/happyaron/2010/09/03/workaround-of-file-name-problem-while-unzip-handling-cjk-encodings/) 和 [Extracting files from zip which contains non-UTF8 filename in Linux](https://allencch.wordpress.com/2013/04/15/extracting-files-from-zip-which-contains-non-utf8-filename-in-linux/)，讲的原理都一样，使用`convmv`命令。

需要注意的是，为了能够转换成功，需要在解压时将系统语言环境设置成标准Unix C（standard Unix codepage），然后通过`7z` 命令来解压。

不过我在本机经过多次尝试未成功过。文件名乱码有点难解，因为在使用`convmv`时不好确定原先文件名的编码是什么，所以就无从指定`-f`参数。而关于如何获取文件名编码信息，可以参考[这个](http://serverfault.com/questions/82821/how-to-tell-the-language-encoding-of-a-filename-on-linux?answertab=active#tab-top)，但获取到的编码信息也不是百分百准确的。

## 参考及引用

- [iconv(1) - Linux man page](http://linux.die.net/man/1/iconv)
- [Extracting files from zip which contains non-UTF8 filename in Linux](https://allencch.wordpress.com/2013/04/15/extracting-files-from-zip-which-contains-non-utf8-filename-in-linux/)
- [Work around of file name problem while unzip handling CJK encodings](https://blogs.gnome.org/happyaron/2010/09/03/workaround-of-file-name-problem-while-unzip-handling-cjk-encodings/)
- [Extracting files from zip which contains non-UTF8 filename in Linux](https://allencch.wordpress.com/2013/04/15/extracting-files-from-zip-which-contains-non-utf8-filename-in-linux/)
- [How to tell the language encoding of a filename on Linux?](http://serverfault.com/questions/82821/how-to-tell-the-language-encoding-of-a-filename-on-linux?answertab=active#tab-top)
- [汉字内码扩展规范编辑](https://zh.wikipedia.org/wiki/%E6%B1%89%E5%AD%97%E5%86%85%E7%A0%81%E6%89%A9%E5%B1%95%E8%A7%84%E8%8C%83)
