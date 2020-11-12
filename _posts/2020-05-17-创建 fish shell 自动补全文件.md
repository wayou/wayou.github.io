---
layout: post
title: 创建 fish shell 自动补全文件
date: 2020-05-17T15:29:01Z
---
# 创建 fish shell 自动补全文件

关于自动补全的文档参见 [Tab Completion](http://fishshell.com/docs/current/index.html#tab-completion)。

## completions 文件的位置

根据[文档](http://fishshell.com/docs/current/index.html#writing-your-own-completions)，fish 自带的 completions 文件在 `/usr/share/fish/completions`。当然，根据安装来源及本机实际安装的插件，和其他环境的不同，fish 的默认 completions 文件和实际加载的来源会有差异，可以通过如下命令查看：

```sh
$ echo $fish_complete_path
/Users/wayou/.config/fish/completions /Users/wayou/.local/share/omf/pkg/notify/completions /Users/wayou/.local/share/omf/pkg/notify/completions /Users/wayou/.local/share/omf/pkg/nvm/completions /Users/wayou/.local/share/omf/pkg/omf/completions /usr/local/Cellar/fish/3.1.0/etc/fish/completions /usr/local/Cellar/fish/3.1.0/share/fish/vendor_completions.d /usr/local/share/fish/vendor_completions.d /usr/local/Cellar/fish/3.1.0/share/fish/completions /Users/wayou/.local/share/fish/generated_completions
```

可以看出，本机因为安装的 omf，所以路径中包含了 omf 相关的路径。其中，因为 fish 是通过 brew 进行安装，其默认的 completions 文件在 `/usr/local/Cellar/fish/3.1.0/share/fish/completions`，可以查看该目录的文件进行学习，和自己编写 completion 文件的参数。

自己写的补全文件放置到 `~/.config/fish/completions` 目录下即可。如果没有该目录，创建一个。

## 语法

自动实例是通过 `complete` 命令完成的，一般后面紧跟需要补全的命令名，比如 `myprog`，它可以跟一个 `yes` 或 `no` 作为其参数，补全脚本可以这样来写：

```sh
complete -c myprog -a "yes no"
```

其中，

- `-c` 即 `--command` 指定需要补全的命令名
- `-a` 即 `--arguments` 指定命令后面自动列表出补全列表，形式为一个字符串，里面可通过空格，tab，[variable expansion](https://fishshell.com/docs/2.3/index.html)，[Command Substitutions](https://fishshell.com/docs/2.3/tutorial.html#tut_command_substitutions) 或其他形式的变量展开符进行分隔，这里简单知道可以用空格分隔补全列表即可。

更加详尽的参数参见：[complete - edit command specific tab-completions](http://fishshell.com/docs/current/cmds/complete.html#cmd-complete)。


## 编写补全脚本

因为测试需要实际有相应可执行程序才行，下面以 node 为例，为其添加自动补全。

创建补全文件到 `~/.config/fish/completions` 目录下：

```sh
$ touch ~/.config/fish/completions/node.fish
```

输入以下内容：

```sh
complete -c node -a "yes no"
```

## 测试补全脚本

fish 会自动加载 `$fish_complete_path` 这个变量的值包包含的目录下的补全文件。

打印该变更可查看具体有哪些目录：

```sh
echo $fish_complete_path
/Users/liuwayong/.config/fish/completions /Users/liuwayong/.local/share/omf/pkg/nvm/completions /Users/liuwayong/.local/share/omf/pkg/omf/completions /usr/local/Cellar/fish/3.1.2/etc/fish/completions /usr/local/Cellar/fish/3.1.2/share/fish/vendor_completions.d /usr/local/share/fish/vendor_completions.d /usr/local/Cellar/fish/3.1.2/share/fish/completions /Users/liuwayong/.local/share/fish/generated_completions
```

自己编写的补全文件，一般放到 `~/.config/fish/completions/<command_name>.fish` 即可，注意其中文件名需要是被补全命令的名称，比如 `git.fish`。

讲道理，放到对应目录后，fish 会自动加载，但是在下次打开命令行的时候。如果要立即生效，需要重新 source 一下该文件：

```sh
$ source ~/.config/fish/completions/git.fish 
```

测试自动补全：

```sh
$ node 
no yes
```

### 关闭文件提示

fish 默认会把当前目录下的文件作为补全候选对象，如果命令后不需要跟文件，可关通过 `-f` 即 `--no-files` 关闭文件的提示：

```sh
complete -f -c node -a "yes no"
```


## 发布到 omf 插件

发布到 omf 插件，这样别人可以通过 `omf install` 方便地安装。

### deno 的自动补全文件

以 deno 的自动补全为例。本周 [Deno 1.0 正式版释出](https://twitter.com/deno_land/status/1260701643311583234?s=20)，伴随着自带了一个命令可输出对应 shell 下的自动补全脚本，比如 fish 的可通过如下命令获取到：

```sh
$ deno completions fish
```

<details>
<summary>
`deno completions fish` 的输出
</summary>


```sh
$ deno completions fish
complete -c deno -n "__fish_use_subcommand" -s L -l log-level -d 'Set log level' -r -f -a "debug info"
complete -c deno -n "__fish_use_subcommand" -s q -l quiet -d 'Suppress diagnostic output'
complete -c deno -n "__fish_use_subcommand" -s h -l help -d 'Prints help information'
complete -c deno -n "__fish_use_subcommand" -s V -l version -d 'Prints version information'
complete -c deno -n "__fish_use_subcommand" -f -a "bundle" -d 'Bundle module and dependencies into single file'
complete -c deno -n "__fish_use_subcommand" -f -a "completions" -d 'Generate shell completions'
complete -c deno -n "__fish_use_subcommand" -f -a "eval" -d 'Eval script'
complete -c deno -n "__fish_use_subcommand" -f -a "cache" -d 'Cache the dependencies'
complete -c deno -n "__fish_use_subcommand" -f -a "fmt" -d 'Format source files'
complete -c deno -n "__fish_use_subcommand" -f -a "info" -d 'Show info about cache or info related to source file'
complete -c deno -n "__fish_use_subcommand" -f -a "install" -d 'Install script as an executable'
complete -c deno -n "__fish_use_subcommand" -f -a "repl" -d 'Read Eval Print Loop'
complete -c deno -n "__fish_use_subcommand" -f -a "run" -d 'Run a program given a filename or url to the module'
complete -c deno -n "__fish_use_subcommand" -f -a "test" -d 'Run tests'
complete -c deno -n "__fish_use_subcommand" -f -a "types" -d 'Print runtime TypeScript declarations'
complete -c deno -n "__fish_use_subcommand" -f -a "upgrade" -d 'Upgrade deno executable to given version'
complete -c deno -n "__fish_use_subcommand" -f -a "doc" -d 'Show documentation for a module'
complete -c deno -n "__fish_use_subcommand" -f -a "help" -d 'Prints this message or the help of the given subcommand(s)'
complete -c deno -n "__fish_seen_subcommand_from bundle" -l cert -d 'Load certificate authority from PEM encoded file'
complete -c deno -n "__fish_seen_subcommand_from bundle" -l importmap -d 'UNSTABLE: Load import map file'
complete -c deno -n "__fish_seen_subcommand_from bundle" -s c -l config -d 'Load tsconfig.json configuration file'
complete -c deno -n "__fish_seen_subcommand_from bundle" -s L -l log-level -d 'Set log level' -r -f -a "debug info"
complete -c deno -n "__fish_seen_subcommand_from bundle" -l unstable -d 'Enable unstable APIs'
complete -c deno -n "__fish_seen_subcommand_from bundle" -s h -l help -d 'Prints help information'
complete -c deno -n "__fish_seen_subcommand_from bundle" -s V -l version -d 'Prints version information'
complete -c deno -n "__fish_seen_subcommand_from bundle" -s q -l quiet -d 'Suppress diagnostic output'
complete -c deno -n "__fish_seen_subcommand_from completions" -s L -l log-level -d 'Set log level' -r -f -a "debug info"
complete -c deno -n "__fish_seen_subcommand_from completions" -s h -l help -d 'Prints help information'
complete -c deno -n "__fish_seen_subcommand_from completions" -s V -l version -d 'Prints version information'
complete -c deno -n "__fish_seen_subcommand_from completions" -s q -l quiet -d 'Suppress diagnostic output'
complete -c deno -n "__fish_seen_subcommand_from eval" -l inspect -d 'activate inspector on host:port (default: 127.0.0.1:9229)'
complete -c deno -n "__fish_seen_subcommand_from eval" -l inspect-brk -d 'activate inspector on host:port and break at start of user script'
complete -c deno -n "__fish_seen_subcommand_from eval" -l cert -d 'Load certificate authority from PEM encoded file'
complete -c deno -n "__fish_seen_subcommand_from eval" -l v8-flags -d 'Set V8 command line options. For help: --v8-flags=--help'
complete -c deno -n "__fish_seen_subcommand_from eval" -s L -l log-level -d 'Set log level' -r -f -a "debug info"
complete -c deno -n "__fish_seen_subcommand_from eval" -l unstable -d 'Enable unstable APIs'
complete -c deno -n "__fish_seen_subcommand_from eval" -s T -l ts -d 'Treat eval input as TypeScript'
complete -c deno -n "__fish_seen_subcommand_from eval" -s h -l help -d 'Prints help information'
complete -c deno -n "__fish_seen_subcommand_from eval" -s V -l version -d 'Prints version information'
complete -c deno -n "__fish_seen_subcommand_from eval" -s q -l quiet -d 'Suppress diagnostic output'
complete -c deno -n "__fish_seen_subcommand_from cache" -s r -l reload -d 'Reload source code cache (recompile TypeScript)'
complete -c deno -n "__fish_seen_subcommand_from cache" -l lock -d 'Check the specified lock file'
complete -c deno -n "__fish_seen_subcommand_from cache" -l importmap -d 'UNSTABLE: Load import map file'
complete -c deno -n "__fish_seen_subcommand_from cache" -s c -l config -d 'Load tsconfig.json configuration file'
complete -c deno -n "__fish_seen_subcommand_from cache" -l cert -d 'Load certificate authority from PEM encoded file'
complete -c deno -n "__fish_seen_subcommand_from cache" -s L -l log-level -d 'Set log level' -r -f -a "debug info"
complete -c deno -n "__fish_seen_subcommand_from cache" -l lock-write -d 'Write lock file. Use with --lock.'
complete -c deno -n "__fish_seen_subcommand_from cache" -l unstable -d 'Enable unstable APIs'
complete -c deno -n "__fish_seen_subcommand_from cache" -l no-remote -d 'Do not resolve remote modules'
complete -c deno -n "__fish_seen_subcommand_from cache" -s h -l help -d 'Prints help information'
complete -c deno -n "__fish_seen_subcommand_from cache" -s V -l version -d 'Prints version information'
complete -c deno -n "__fish_seen_subcommand_from cache" -s q -l quiet -d 'Suppress diagnostic output'
complete -c deno -n "__fish_seen_subcommand_from fmt" -s L -l log-level -d 'Set log level' -r -f -a "debug info"
complete -c deno -n "__fish_seen_subcommand_from fmt" -l check -d 'Check if the source files are formatted.'
complete -c deno -n "__fish_seen_subcommand_from fmt" -s h -l help -d 'Prints help information'
complete -c deno -n "__fish_seen_subcommand_from fmt" -s V -l version -d 'Prints version information'
complete -c deno -n "__fish_seen_subcommand_from fmt" -s q -l quiet -d 'Suppress diagnostic output'
complete -c deno -n "__fish_seen_subcommand_from info" -l cert -d 'Load certificate authority from PEM encoded file'
complete -c deno -n "__fish_seen_subcommand_from info" -s L -l log-level -d 'Set log level' -r -f -a "debug info"
complete -c deno -n "__fish_seen_subcommand_from info" -l unstable -d 'Enable unstable APIs'
complete -c deno -n "__fish_seen_subcommand_from info" -s h -l help -d 'Prints help information'
complete -c deno -n "__fish_seen_subcommand_from info" -s V -l version -d 'Prints version information'
complete -c deno -n "__fish_seen_subcommand_from info" -s q -l quiet -d 'Suppress diagnostic output'
complete -c deno -n "__fish_seen_subcommand_from install" -l allow-read -d 'Allow file system read access'
complete -c deno -n "__fish_seen_subcommand_from install" -l allow-write -d 'Allow file system write access'
complete -c deno -n "__fish_seen_subcommand_from install" -l allow-net -d 'Allow network access'
complete -c deno -n "__fish_seen_subcommand_from install" -s n -l name -d 'Executable file name'
complete -c deno -n "__fish_seen_subcommand_from install" -l root -d 'Installation root'
complete -c deno -n "__fish_seen_subcommand_from install" -l cert -d 'Load certificate authority from PEM encoded file'
complete -c deno -n "__fish_seen_subcommand_from install" -s L -l log-level -d 'Set log level' -r -f -a "debug info"
complete -c deno -n "__fish_seen_subcommand_from install" -l allow-env -d 'Allow environment access'
complete -c deno -n "__fish_seen_subcommand_from install" -l allow-run -d 'Allow running subprocesses'
complete -c deno -n "__fish_seen_subcommand_from install" -l allow-plugin -d 'Allow loading plugins'
complete -c deno -n "__fish_seen_subcommand_from install" -l allow-hrtime -d 'Allow high resolution time measurement'
complete -c deno -n "__fish_seen_subcommand_from install" -s A -l allow-all -d 'Allow all permissions'
complete -c deno -n "__fish_seen_subcommand_from install" -s f -l force -d 'Forcefully overwrite existing installation'
complete -c deno -n "__fish_seen_subcommand_from install" -l unstable -d 'Enable unstable APIs'
complete -c deno -n "__fish_seen_subcommand_from install" -s h -l help -d 'Prints help information'
complete -c deno -n "__fish_seen_subcommand_from install" -s V -l version -d 'Prints version information'
complete -c deno -n "__fish_seen_subcommand_from install" -s q -l quiet -d 'Suppress diagnostic output'
complete -c deno -n "__fish_seen_subcommand_from repl" -l inspect -d 'activate inspector on host:port (default: 127.0.0.1:9229)'
complete -c deno -n "__fish_seen_subcommand_from repl" -l inspect-brk -d 'activate inspector on host:port and break at start of user script'
complete -c deno -n "__fish_seen_subcommand_from repl" -l v8-flags -d 'Set V8 command line options. For help: --v8-flags=--help'
complete -c deno -n "__fish_seen_subcommand_from repl" -l cert -d 'Load certificate authority from PEM encoded file'
complete -c deno -n "__fish_seen_subcommand_from repl" -s L -l log-level -d 'Set log level' -r -f -a "debug info"
complete -c deno -n "__fish_seen_subcommand_from repl" -l unstable -d 'Enable unstable APIs'
complete -c deno -n "__fish_seen_subcommand_from repl" -s h -l help -d 'Prints help information'
complete -c deno -n "__fish_seen_subcommand_from repl" -s V -l version -d 'Prints version information'
complete -c deno -n "__fish_seen_subcommand_from repl" -s q -l quiet -d 'Suppress diagnostic output'
complete -c deno -n "__fish_seen_subcommand_from run" -l inspect -d 'activate inspector on host:port (default: 127.0.0.1:9229)'
complete -c deno -n "__fish_seen_subcommand_from run" -l inspect-brk -d 'activate inspector on host:port and break at start of user script'
complete -c deno -n "__fish_seen_subcommand_from run" -l allow-read -d 'Allow file system read access'
complete -c deno -n "__fish_seen_subcommand_from run" -l allow-write -d 'Allow file system write access'
complete -c deno -n "__fish_seen_subcommand_from run" -l allow-net -d 'Allow network access'
complete -c deno -n "__fish_seen_subcommand_from run" -l importmap -d 'UNSTABLE: Load import map file'
complete -c deno -n "__fish_seen_subcommand_from run" -s r -l reload -d 'Reload source code cache (recompile TypeScript)'
complete -c deno -n "__fish_seen_subcommand_from run" -s c -l config -d 'Load tsconfig.json configuration file'
complete -c deno -n "__fish_seen_subcommand_from run" -l lock -d 'Check the specified lock file'
complete -c deno -n "__fish_seen_subcommand_from run" -l v8-flags -d 'Set V8 command line options. For help: --v8-flags=--help'
complete -c deno -n "__fish_seen_subcommand_from run" -l cert -d 'Load certificate authority from PEM encoded file'
complete -c deno -n "__fish_seen_subcommand_from run" -l seed -d 'Seed Math.random()'
complete -c deno -n "__fish_seen_subcommand_from run" -s L -l log-level -d 'Set log level' -r -f -a "debug info"
complete -c deno -n "__fish_seen_subcommand_from run" -l allow-env -d 'Allow environment access'
complete -c deno -n "__fish_seen_subcommand_from run" -l allow-run -d 'Allow running subprocesses'
complete -c deno -n "__fish_seen_subcommand_from run" -l allow-plugin -d 'Allow loading plugins'
complete -c deno -n "__fish_seen_subcommand_from run" -l allow-hrtime -d 'Allow high resolution time measurement'
complete -c deno -n "__fish_seen_subcommand_from run" -s A -l allow-all -d 'Allow all permissions'
complete -c deno -n "__fish_seen_subcommand_from run" -l unstable -d 'Enable unstable APIs'
complete -c deno -n "__fish_seen_subcommand_from run" -l lock-write -d 'Write lock file. Use with --lock.'
complete -c deno -n "__fish_seen_subcommand_from run" -l no-remote -d 'Do not resolve remote modules'
complete -c deno -n "__fish_seen_subcommand_from run" -l cached-only -d 'Require that remote dependencies are already cached'
complete -c deno -n "__fish_seen_subcommand_from run" -s h -l help -d 'Prints help information'
complete -c deno -n "__fish_seen_subcommand_from run" -s V -l version -d 'Prints version information'
complete -c deno -n "__fish_seen_subcommand_from run" -s q -l quiet -d 'Suppress diagnostic output'
complete -c deno -n "__fish_seen_subcommand_from test" -l inspect -d 'activate inspector on host:port (default: 127.0.0.1:9229)'
complete -c deno -n "__fish_seen_subcommand_from test" -l inspect-brk -d 'activate inspector on host:port and break at start of user script'
complete -c deno -n "__fish_seen_subcommand_from test" -l allow-read -d 'Allow file system read access'
complete -c deno -n "__fish_seen_subcommand_from test" -l allow-write -d 'Allow file system write access'
complete -c deno -n "__fish_seen_subcommand_from test" -l allow-net -d 'Allow network access'
complete -c deno -n "__fish_seen_subcommand_from test" -l importmap -d 'UNSTABLE: Load import map file'
complete -c deno -n "__fish_seen_subcommand_from test" -s r -l reload -d 'Reload source code cache (recompile TypeScript)'
complete -c deno -n "__fish_seen_subcommand_from test" -s c -l config -d 'Load tsconfig.json configuration file'
complete -c deno -n "__fish_seen_subcommand_from test" -l lock -d 'Check the specified lock file'
complete -c deno -n "__fish_seen_subcommand_from test" -l v8-flags -d 'Set V8 command line options. For help: --v8-flags=--help'
complete -c deno -n "__fish_seen_subcommand_from test" -l cert -d 'Load certificate authority from PEM encoded file'
complete -c deno -n "__fish_seen_subcommand_from test" -l seed -d 'Seed Math.random()'
complete -c deno -n "__fish_seen_subcommand_from test" -l filter -d 'A pattern to filter the tests to run by'
complete -c deno -n "__fish_seen_subcommand_from test" -s L -l log-level -d 'Set log level' -r -f -a "debug info"
complete -c deno -n "__fish_seen_subcommand_from test" -l allow-env -d 'Allow environment access'
complete -c deno -n "__fish_seen_subcommand_from test" -l allow-run -d 'Allow running subprocesses'
complete -c deno -n "__fish_seen_subcommand_from test" -l allow-plugin -d 'Allow loading plugins'
complete -c deno -n "__fish_seen_subcommand_from test" -l allow-hrtime -d 'Allow high resolution time measurement'
complete -c deno -n "__fish_seen_subcommand_from test" -s A -l allow-all -d 'Allow all permissions'
complete -c deno -n "__fish_seen_subcommand_from test" -l unstable -d 'Enable unstable APIs'
complete -c deno -n "__fish_seen_subcommand_from test" -l lock-write -d 'Write lock file. Use with --lock.'
complete -c deno -n "__fish_seen_subcommand_from test" -l no-remote -d 'Do not resolve remote modules'
complete -c deno -n "__fish_seen_subcommand_from test" -l cached-only -d 'Require that remote dependencies are already cached'
complete -c deno -n "__fish_seen_subcommand_from test" -l failfast -d 'Stop on first error'
complete -c deno -n "__fish_seen_subcommand_from test" -l allow-none -d 'Don\'t return error code if no test files are found'
complete -c deno -n "__fish_seen_subcommand_from test" -s h -l help -d 'Prints help information'
complete -c deno -n "__fish_seen_subcommand_from test" -s V -l version -d 'Prints version information'
complete -c deno -n "__fish_seen_subcommand_from test" -s q -l quiet -d 'Suppress diagnostic output'
complete -c deno -n "__fish_seen_subcommand_from types" -s L -l log-level -d 'Set log level' -r -f -a "debug info"
complete -c deno -n "__fish_seen_subcommand_from types" -l unstable -d 'Enable unstable APIs'
complete -c deno -n "__fish_seen_subcommand_from types" -s h -l help -d 'Prints help information'
complete -c deno -n "__fish_seen_subcommand_from types" -s V -l version -d 'Prints version information'
complete -c deno -n "__fish_seen_subcommand_from types" -s q -l quiet -d 'Suppress diagnostic output'
complete -c deno -n "__fish_seen_subcommand_from upgrade" -l version -d 'The version to upgrade to'
complete -c deno -n "__fish_seen_subcommand_from upgrade" -s L -l log-level -d 'Set log level' -r -f -a "debug info"
complete -c deno -n "__fish_seen_subcommand_from upgrade" -l dry-run -d 'Perform all checks without replacing old exe'
complete -c deno -n "__fish_seen_subcommand_from upgrade" -s f -l force -d 'Replace current exe even if not out-of-date'
complete -c deno -n "__fish_seen_subcommand_from upgrade" -s h -l help -d 'Prints help information'
complete -c deno -n "__fish_seen_subcommand_from upgrade" -s q -l quiet -d 'Suppress diagnostic output'
complete -c deno -n "__fish_seen_subcommand_from doc" -s r -l reload -d 'Reload source code cache (recompile TypeScript)'
complete -c deno -n "__fish_seen_subcommand_from doc" -s L -l log-level -d 'Set log level' -r -f -a "debug info"
complete -c deno -n "__fish_seen_subcommand_from doc" -l unstable -d 'Enable unstable APIs'
complete -c deno -n "__fish_seen_subcommand_from doc" -l json -d 'Output documentation in JSON format.'
complete -c deno -n "__fish_seen_subcommand_from doc" -s h -l help -d 'Prints help information'
complete -c deno -n "__fish_seen_subcommand_from doc" -s V -l version -d 'Prints version information'
complete -c deno -n "__fish_seen_subcommand_from doc" -s q -l quiet -d 'Suppress diagnostic output'
complete -c deno -n "__fish_seen_subcommand_from help" -s L -l log-level -d 'Set log level' -r -f -a "debug info"
complete -c deno -n "__fish_seen_subcommand_from help" -s h -l help -d 'Prints help information'
complete -c deno -n "__fish_seen_subcommand_from help" -s V -l version -d 'Prints version information'
complete -c deno -n "__fish_seen_subcommand_from help" -s q -l quiet -d 'Suppress diagnostic output'
```

</details>

可以将其输出到文件并保存在 `~/.config/fish/completions` 目录下，fish 里就可以生效使用了。

```sh
$ deno completions fish >  ~/.config/fish/completions/deno.fish
```

但是这样只能自己本地使用，如果换台机器需要重新进行上面的步骤，别人也没法共享。通过编写成 omf 插件发布后，就可通过 omf 进行安装使用了。

### 编写 omf 插件

根据 [omf](https://github.com/oh-my-fish/oh-my-fish/blob/master/docs/en-US/Packages.md) 的文档进行插件的编写。

通过 `omf new plugin <plugin-name>` 可快速初始化一个插件：

```sh
$ omf new plugin plugin-deno
```

命令执行后生成了如下文件：

```
.
├── LICENSE
├── README.md
├── completions
│   └── plugin-deno.fish
├── functions
│   └── plugin-deno.fish
├── init.fish
└── uninstall.fish
```

其中，`functions`，`init.fish` 和 `uninstall.fish` 用不到，直接删除。

然后将 `completions/plugin-deno.fish`重命名成 `completions/deno.fish`，将 `deno completions fish` 的输出写入。

```sh
$ deno completions fish > completions/deno.fish
```

完善 README.md 后就可以 push 到 GitHub 了。


### 测试安装

代码推送到远端后，可通过如下命令进行安装：

```sh
$ omf install https://github.com/wayou/plugin-deno
```

### 添加到 omf 插件仓库

完成测试没问题后，最后一步，clone [oh-my-fish/packages-main](https://github.com/oh-my-fish/packages-main) 添加名为 `deno` 的文件到 `packages` 目录下，完善其内容：

```
type = plugin
repository = YOUR-PACKAGE-URL
maintainer = YOUR-NAME <YOUR-EMAIL>
description = YOUR-PACKAGE-DESCRIPTION
```

便可以提 PR 到该仓库了。合并后即可通过 `omf install deno` 进行安装使用了。


## 相关资源

- [Writing your own completions¶](http://fishshell.com/docs/current/index.html#writing-your-own-completions)
