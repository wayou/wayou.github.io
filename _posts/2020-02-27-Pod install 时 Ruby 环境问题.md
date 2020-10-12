---
layout: post
title: "Pod install 时 Ruby 环境问题"
date: 2020-02-27 09:02:00 +0800
tags: 
---
    
# Pod install 时 Ruby 环境问题

执行 `pod install` 时，报类似如下的错误：

```
...
这里还有一大段堆栈信息省略...
...
Error loading RubyGems plugin "/Users/chiang/.rvm/gems/ruby-2.0.0-p247@global/gems/rubygems-bundler-1.2.2/lib/rubygems_plugin.rb": dlopen(/Users/chiang/.rvm/rubies/ruby-2.0.0-p247/lib/ruby/2.0.0/x86_64-darwin12.3.0/openssl.bundle, 9): Library not loaded: /opt/local/lib/libssl.1.0.0.dylib
  Referenced from: /Users/chiang/.rvm/rubies/ruby-2.0.0-p247/lib/ruby/2.0.0/x86_64-darwin12.3.0/openssl.bundle
  Reason: image not found - /Users/chiang/.rvm/rubies/ruby-2.0.0-p247/lib/ruby/2.0.0/x86_64-darwin12.3.0/openssl.bundle (LoadError)
```

一看便知是 Ruby 环境相关的问题。 Google 后发现有可能是本地执行了 `brew upgrade` 命令后将 Ruby 环境破坏了。

参考 [Stackoverflow 的回答](https://stackoverflow.com/a/58985452/1553656)，修正方式是重装 Ruby：

```sh
brew reinstall openssl
brew upgrade ruby-build rbenv
rbenv install 2.2.10 # or whatever version you're using it
```

# 相关资源

- [Error loading RubyGems plugin ，openssl.bundle (LoadError)](https://stackoverflow.com/questions/20092600/error-loading-rubygems-plugin-openssl-bundle-loaderror)

    