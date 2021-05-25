---
layout: post
title: "Git annotated 与 unannotated tag"
date: 2021-05-24T06:21:00Z
---
# Git annotated 与 unannotated tag

Git 中打 Tag 时即可以通过如下命令

```
git tag <tagname>
```

生成一个 `unannotated tag`，

 也可以 通过 `-a` 的命令：

```sh
git tag -a <tagname> -m '<message>'
```

生成一个 `annotated tag`。

默认为当前所处提交打 Tag，当然，两者均可指定 Tag 指向的某次提交：

```
git tag <tagname> <commit>
# or
git tag -a <tagname> <commit> -m "stuck fixed"
```

两者区别在于后者为 Tag 提供了信息，可在 `git show <tag-name>` 时查看到。


`unannotated tag` 也叫 `lightweight tag`，指在生成 tag 时仅提供 tag 名称，未包含诸如 `-a`， `-s` 或 `-m` 参数。而一旦指定 `-a` 表明需要生成一个带注释的 tag，如果此时未指定 `-m` 则会弹出编辑界面以编写注释。甚至可以只指定 `-m` 参数，此时也会生成一个带注释的 tag。



## 相关资源

- [What is the difference between an annotated and unannotated tag?](https://stackoverflow.com/questions/11514075/what-is-the-difference-between-an-annotated-and-unannotated-tag)

