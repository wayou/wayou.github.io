## gitignore 添加文件不生效的问题

`.gitignore` 文件用来指定需要排除在版本管理之外的文件或目录。最近发现一个问题，如果某个文件或文件夹之前是在版本管理内的，并且进行过提交，事后想加入 gitignore 中，并不生效。


### 问题复现

以下操作步骤展示了这一问题。

创建一个示例仓库：

```bash
$ mkdir git-ignore-issue && cd $_
$ git init
```

上面命令创建了一个空文件夹并初始化了一个仓库。

创建 `.gitignore` 文件并添加 `A.md` 为需要忽略的文件。

```bash
$ echo “A.md” > .gitignore
```

此时我们的 `.gitignore` 文件中包含了一条过滤规则，即 `A.md`  这个文件被排除在版本管理外。

```bash
$ vi .gitignore

A.md
```

再添加一些示例文件，以下命令创建了 `A.md`，`B.md` 和 `C.md` 三个文件。

```bash
touch {A..C}.md
```

此时的目录结构及文件情况是这样的：

```
$ tree . -aL 1
.
├── .git
├── .gitignore
├── A.md
├── B.md
└── C.md
```

通过 `git status` 命令可以看到被排除的文件 `A.md` 确实没有被包含进来。

```bash
$ git status
On branch master

Initial commit

Untracked files:
  (use "git add <file>..." to include in what will be committed)

	.gitignore
	B.md
	C.md
```

此时我们将所有文件添加并提交。

```bash
$ git add -A && git commit -m "initial commit"
[master (root-commit) bb7b8a8] initial commit
 3 files changed, 1 insertion(+)
 create mode 100644 .gitignore
 create mode 100644 B.md
 create mode 100644 C.md
```

下面问题来了。此时我们想将 `B.md` 排除在版本管理之外，于是我们将其添加到 `.gitignore` 。

```bash
$ echo "B.md" >> .gitignore
```
此时我们的 `.gitignore` 文件包含了 `A.md` 及 `B.md` 两个文件。

```diff
$ vi .gitignore

A.md
+B.md
```

现在去修改 `B.md` 文件，往其中随便写点东西。

```bash
$ echo "B" > B.md
```

然后通过 `git diff` 查看文件变更，检查其是否成功被排除在了版本管理外。

```diff
$ git diff

--------------------------------------------
modified: .gitignore
--------------------------------------------
@@ -1 +1,2 @@
 A.md
+B.md
--------------------------------------------
modified: B.md
--------------------------------------------
@@ -0,0 +1 @@
+B

```

我们惊奇地发现， `B.md` 文件的变更仍然出现在了变更列表中，并没有如愿被排除。


### 解决

解决办法也是很简单，只需要清空一下 git 本地的缓存提交一次即可。

先清掉 git 缓存 
```bash
git rm -r --cached .
git add .
git commit -m "fixed untracked files"
```

此时我们再对 `B.md` 进行一次修改进行验证。

```bash
$ echo “Blah” >> B.md
$ git status
On branch master
nothing to commit, working directory clean
```




