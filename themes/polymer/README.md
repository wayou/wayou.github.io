# hexo-theme-polymer
a mobile friendly theme for [hexo](http://hexo.io/) static blog based on google polymer

## preview

![hexo theme polymer preview](https://github.com/wayou/hexo-theme-polymer/blob/master/source/img/preview.gif?raw=true)

## install

- clone this repo
```shell
git clone https://github.com/wayou/hexo-theme-polymer.git themes/polmyer
```

- omdify the hexo `_config.yml` file to enable this theme

```yml
theme: polymer
```


## config

customize the `_config.yml` file under the themes directory as you wish

```yml
# Header
menu: #site menu, showing in the side navigation
  - title: Home # menu title
    url: / # the link
    icon: home  # menu icon, available icons can be found here:https://www.polymer-project.org/0.5/components/core-icons/demo.html


# Miscellaneous
google_analytics: # here goes your google analytics track id
baidu_analytics: # here goes the baidu track id, for chinese users only
favicon: /favicon.ico  # path for favicon
appicon: app-icon-192x192.png  # path for app when site added to home screen on mobile device

#cover: img/bg6.jpg
cover:  # path for header cover image, if provided, there will be a background image for the header
slogan: "dont count the days, make the days count"  # showing in the header of the home page
```
