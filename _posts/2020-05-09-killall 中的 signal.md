---
layout: post
title: "killall 中的 signal"
date: 2020-05-09 21:05:00 +0800
tags: 
---
    
# killall 中的 signal


Flutter 开发时，会遇到另的任务挂起导致新的 Dart 服务无法启动的问题，提示如下：

```sh
Waiting for another flutter command to release the startup lock...
```

## killall 命令

此时可以通过以下命令，将所有当前运行的 Dart 服务先结束掉：

```sh
$ killall -9 dart
```

## SIGNAL 参数

这里的 `-9` 指定的是 `killall -SIGNAL` 中的 `SIGNAL` 参数，可用的 SIGNAL 参数可通过 `killall -l` 列出：

```sh
$ killall -l
HUP INT QUIT ILL TRAP ABRT EMT FPE KILL BUS SEGV SYS PIPE ALRM TERM URG STOP
TSTP CONT CHLD TTIN TTOU IO XCPU XFSZ VTALRM PROF WINCH INFO USR1 USR2
```

可以看到这里列出的是各种信号的名称，每个名称根据其顺序对应了一个数字，所以指定 `-SIGNAL` 参数时，除了使用数字，也可以直接使用这里列出的名称。

名称和数字的对应关系在这里不直观，可通过 `man signal` 来查看：

```sh
$ man signal
...
     No    Name         Default Action       Description
     1     SIGHUP       terminate process    terminal line hangup
     2     SIGINT       terminate process    interrupt program
     3     SIGQUIT      create core image    quit program
     4     SIGILL       create core image    illegal instruction
     5     SIGTRAP      create core image    trace trap
     6     SIGABRT      create core image    abort program (formerly SIGIOT)
     7     SIGEMT       create core image    emulate instruction executed
     8     SIGFPE       create core image    floating-point exception
     9     SIGKILL      terminate process    kill program
     10    SIGBUS       create core image    bus error
     11    SIGSEGV      create core image    segmentation violation
     12    SIGSYS       create core image    non-existent system call invoked
     13    SIGPIPE      terminate process    write on a pipe with no reader
     14    SIGALRM      terminate process    real-time timer expired
     15    SIGTERM      terminate process    software termination signal
     16    SIGURG       discard signal       urgent condition present on socket
     17    SIGSTOP      stop process         stop (cannot be caught or ignored)
     18    SIGTSTP      stop process         stop signal generated from keyboard
     19    SIGCONT      discard signal       continue after stop
     20    SIGCHLD      discard signal       child status has changed
     21    SIGTTIN      stop process         background read attempted from con-
                                             trol terminal
     22    SIGTTOU      stop process         background write attempted to con-
                                             trol terminal
     23    SIGIO        discard signal       I/O is possible on a descriptor (see
                                             fcntl(2))
     24    SIGXCPU      terminate process    cpu time limit exceeded (see
                                             setrlimit(2))
     25    SIGXFSZ      terminate process    file size limit exceeded (see
                                             setrlimit(2))
     26    SIGVTALRM    terminate process    virtual time alarm (see
                                             setitimer(2))
     27    SIGPROF      terminate process    profiling timer alarm (see
                                             setitimer(2))
     28    SIGWINCH     discard signal       Window size change
     29    SIGINFO      discard signal       status request from keyboard
     30    SIGUSR1      terminate process    User defined signal 1
     31    SIGUSR2      terminate process    User defined signal 2
...
```

## SIGNAL 的用途

程序被终止时，是可以根据外部传来的信号判断出终止的原因，从而在业务上进行合理的善后工作。结束程序时，默认会发送 `SIGTERM` 信号，而 `killall` 时，通过手动指定相应的信号，可以让程序合理的响应。




    