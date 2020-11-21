---
layout: post
title: GitHub 同步主干到 fork
date: 2020-11-21T10:58:29Z
---
# GitHub 同步主干到 fork

参考 [SO 上这个回答](https://stackoverflow.com/a/7244456/1553656)，同步主干的提交到自己 fork 分支的步骤可这样来操作：

```sh
# Add the remote, call it "upstream":

git remote add upstream https://github.com/whoever/whatever.git

# Fetch all the branches of that remote into remote-tracking branches

git fetch upstream

# Make sure that you're on your master branch:

git checkout master

# Rewrite your main branch so that any commits of yours that
# aren't already in upstream/main are replayed on top of that
# other branch:

git rebase upstream/master
```

## 相关资源

- [How do I update a GitHub forked repository?](https://stackoverflow.com/questions/7244321/how-do-i-update-a-github-forked-repository)
