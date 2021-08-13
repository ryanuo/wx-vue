#  -*-coding:utf8 -*-
import flask, json
from flask import Flask, request
from flask_cors import CORS
from wx import Signed

'''
flask： web框架，通过flask提供的装饰器@server.route()将普通函数转换为服务
登录接口，需要传url、userId、passwd
'''
# 创建一个服务，把当前这个python文件当做一个服务
server = flask.Flask(__name__)
app = Flask(__name__)
CORS(app, supports_credentials=True)


# server.config['JSON_AS_ASCII'] = False
# @server.route()可以将普通函数转变为服务 登录接口的路径、请求方式
@server.route('/login', methods=['get', 'post'])
def login():
    # 获取通过url请求传参的数据
    # print(request)
    userId = request.values.get('userId')
    # 获取url请求传的密码，明文
    cookie = request.values.get('cookie')
    print(userId)
    print(cookie)
    # 判断用户名、密码都不为空，如果不传用户名、密码则userId和cookie为None
    if userId and cookie:
        return f"successCallback({Signed(userId, cookie).initApp()})"
    else:
        resu = {'code': 10001, 'message': '参数不能为空！'}
        return f"successCallback({json.dumps(resu, ensure_ascii=False)})"


if __name__ == '__main__':
    server.run(debug=True, port=8888, host='localhost')  # 指定端口、host,0.0.0.0代表不管几个网卡，任何ip都可以访问
