# 仓库简介

> 企业微信健康打卡, 仅用于学习, 并未进行宣传(健康是前提)

## 使用技术

* 前端: Vue.js+jquery
* 后端: python+flask

## 使用方法

```JS
npm install
```

> 修改src文件中index.js文件开头的配置信息

* `self.key`// 腾讯地图SDK webserverAPI 自己去获取一下
* `self.host`// 你自己配置的域名地址
* 后端文件在flask中修改wx.py中的self.headers中的腾讯sdk

## 页面展示

![web](https://gitee.com/rbozo/picgo_image/raw/master/image/0/e99e570c346af8f502061161e9fe1de.png)

## cookie获取

* 需要自己使用抓包软件去抓取cookie信息
* 抓包文件放到apk文件中了
