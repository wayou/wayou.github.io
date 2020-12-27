---
layout: post
title: "shell 中使用 cat 配合 EOF 创建文件并写入多行内容"
date: 2020-12-27T03:55:44Z
---
# shell 使用 cat 配合 EOF 创建文件并写入多行内容

之前折腾 GtiHub Actions 想实现提交 issue 后将 issue 的内容生成一个 Markdown 文件提交到仓库，从而实现自动发布到 GitHub Pages 的目的。倒是有一些现成的 Action，但无法完全满足要求，所以自己尝试写一个 [wayou/turn-issues-to-posts-action](https://github.com/wayou/turn-issues-to-posts-action)。

过程中发现因为 issue 的标题和正文是任意的，也就是以下两部分：

- `${{ github.event.issue.title }}`
- `${{ github.event.issue.body }}`

分别通过环境变量 `github.event.issue` 获取。

当然，做成 Action 后这些参数通过外面以参数方式传递，因为 Action 里无法获取这些数据。

使用该 Action 的仓库中，`.github/workflows/main.yml` 配置如下内容进行传递：

```yaml
...
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: wayou/turn-issues-to-posts-action@v1
        with:
          dir: "_posts"
          title: ${{ github.event.issue.title }}
          body: ${{ github.event.issue.body }}
...
```

里面的内容可能包含任意字符，这样在生成文章标题和正文时会遇到转义问题。

## `mkdir` 创建目录失败的失败

生成的文件默认放到 `_posts/` 目录下，但也可以使用的地方进行传递。

```sh
mkdir ${{ inputs.dir }}
```

生成目录过程中，`_posts/ ` 目录不存在的话，该命令会失败，所以需要加上 `-p` 参数。`man mkdir` 查看可知：

```
     -p      Create intermediate directories as required.  If this option is not speci-
             fied, the full path prefix of each operand must already exist.  On the other
             hand, with this option specified, no error will be reported if a directory
             given as an operand already exists.  Intermediate directories are created
             with permission bits of rwxrwxrwx (0777) as modified by the current umask,
             plus write and search permission for the owner.
```

加了该参数后，`mkdir` 会自动创建缺失的目录而不是直接报错。

## 标题

然后通过标题创建对应的 Markdown 文件。

```sh
touch "${{ inputs.title }}.md"
```

直接像上面这样肯定不行，因为前面提到，这里的 title 可能包含任意字符。所以需要对 issue 的 title 进行一次处理。

```sh
POST_TITLE=$(sed -E 's/[[:space:]|[:punct:]]/_/g' <<<'${{ inputs.title }}')

```

上述操作是替换掉 issue 标题中的空格及标点。

## 正文

同时，正文部分也不能直接通过如下方式进行写入：

```sh
cat "${{ inputs.body }}" >> "${{ inputs.title }}.md"
```

一是因为正文是多行文本，这里 Action 执行时会被替换为真实的内容，到时候就是非法的 shell 命令，二是因为正文也会包含任意字符，造成命令非法。

后面发现，可通过如下形式进行文件创建和内容的写入而没有上面这些因为内容而引起的转义问题：

```
              <<[-]word
                      here-document
              delimiter
```

可通过 `man bash` 查看该形式的文档，位于 `Here Documents` 部分。

调整后[文件生成及内容生成部分的命令为](https://github.com/wayou/turn-issues-to-posts-action/blob/master/action.yml#L43)：

```sh
        cat <<'EOF' > _posts/"${DATE:0:10}-${POST_TITLE}".md
        ---
        layout: post
        title: "${{ inputs.title }}"
        date: ${{ inputs.created_at }}
        ---
        ${{ inputs.body }}
        EOF
```

不过仍然需要处理两处转义问题：

- `_posts/"${DATE:0:10}-${POST_TITLE}".md` 这里的 `"${DATE:0:10}-${POST_TITLE}"` 部分需要使用引号包裹，防止我死字符导致的文件名非法
- `title: "${{ inputs.title }}"` 这部分位于 Markdown 文件正文部分，会被 jekyll 编译后生成对应的 html 文件，这里不使用引号的话，jekyll 编译会有问题，比如标题中包含 backtick <code>`</code>：

```
---
layout: post
title: `/dev/null`
date: 2020-08-11 23:08:00 +0800
tags: 
---
```

jekyll 报错信息：

```
Error: YAML Exception reading xxx/_posts/2020-12-25-xxx.md: (<unknown>): found character that cannot start any token while scanning for the next token at line 3 column 8
```

## 相关资源

- [wayou/turn-issues-to-posts-action](https://github.com/wayou/turn-issues-to-posts-action)
- [GitHub Actions](https://docs.github.com/en/free-pro-team@latest/actions)
- [How does “cat << EOF” work in bash?](https://stackoverflow.com/questions/2500436/how-does-cat-eof-work-in-bash)

