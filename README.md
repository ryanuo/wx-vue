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

* `self.host`// 你自己配置的域名地址
* 后端文件在flask中修改wx.py中的`self.key`中的腾讯`webserverAPIsdk`

## 页面展示

![web](https://gitee.com/rbozo/picgo_image/raw/master/image/0/e99e570c346af8f502061161e9fe1de.png)

## cookie获取

* 需要自己使用抓包软件去抓取cookie信息
* 抓包文件放到apk文件中了

## 更新文档

* v1.3

1. 优化代码，调整页面的细节
2. 修改页面提示信息反馈，按钮大小的修改
3. 移动端优化，禁止用户缩放页面，禁止左右滑动

* v1.2

1. 将详情表格信息，存储到缓冲中，方便用户查看之前的提交信息
2. 加入清除所有缓冲的按钮
3. 并且加入了状态提示

* v1.1

1. 加入userID本地缓冲，方便提交信息
2. 后端接入随机地址，范围0-100米，使用腾讯JavaScriptApi  webserverAPIsdk
3. 加入详情页展示

* v1.0

1. 使用flask框架替换node.js前端请求
2. 将本地打包部署到服务器中
