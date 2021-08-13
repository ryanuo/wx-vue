#  -*-coding:utf8 -*-
import requests, datetime, random, json

'''
企业微信健康打卡
'''
result = {
    "username": "",  # 签到人
    "build_time": "",  # 建立时间
    "status": "",  # 签到状态
    "detail": {},
}


class Signed:
    def __init__(self, ID, Cookie):
        self.today = datetime.date.today()  # 获取今天的日期
        self.userid = ID  # 学号
        self.url = 'http://mp.sxtcm.edu.cn/microapp/health_daily/'
        self.latitude = f'37.7378{random.randint(10, 100)}'  # 37.7500
        self.longitude = f'112.7391{random.randint(10, 100)}'  # 112.7276 学校地址
        self.key = ''  # 腾讯地图SDK webserverAPI
        self.header = {
            "Host": "mp.sxtcm.edu.cn",
            "Accept": "application/json, text/plain, */*",
            "User-Agent": "Mozilla/5.0 (Linux; Android 9; vivo X21A Build/PKQ1.180819.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045618 Mobile Safari/537.36 wxwork/3.1.11 ColorScheme/Light MicroMessenger/7.0.1 NetType/WIFI Language/zh Lang/zh",
            "X-Requested-With": "com.tencent.wework",
            "Referer": "http://mp.sxtcm.edu.cn/front/index.html",
            "Cookie": f"JSESSIONID={Cookie}",  # 抓取到个人的cookie信息
        }

    def requests(self, url):
        url = self.url + url
        res = requests.post(url, headers=self.header)
        return res.json()['status']

    # 初始化
    def initApp(self):
        r1 = self.requests('getHotArea')
        r2 = self.requests('userInfo')
        if r1 == 1 & r2 == 1:
            return self.getAlreadyReport()
        else:
            return {"state": -1, "message": "cookie值有误请重新获取！！"}

    # 获取上报记录
    def getAlreadyReport(self):
        url = f'{self.url}alreadyReport?userId={self.userid}&day={self.today}'
        res = requests.post(url, headers=self.header)
        ids = res.json()['data'][0]['id']
        print('----------------------')
        print(f'上一次签到：{res.json()["data"][0]["time"]}签到！！！')
        return self.getHealthDaily(ids)

    # 返回今日的情况
    def getHealthDaily(self, id_key):
        url = f'{self.url}getHealthDaily?id={id_key}'
        res = requests.post(url, headers=self.header)
        address = res.json()['data'][0]['latitude'] + ',' + res.json()['data'][0]['longitude']
        print(f'上一次签到：{res.json()["data"][0]["time"]}签到！！！')
        return self.countDistance(address)

    # 距离测算
    def countDistance(self, old_add):
        url = f'https://apis.map.qq.com/ws/distance/v1/?from={old_add}&to={self.latitude + "," + self.longitude}&key={self.key}'
        res = requests.get(url)
        distance = res.json()['result']['elements'][0]['distance']
        print(f'距离上次的距离为：{distance}米')
        return self.reportPush(distance)

    def addressPush(self):
        url = f'{self.url}calculateDistance?longitude={self.longitude}&latitude={self.latitude}'
        res = requests.post(url, headers=self.header)
        print('将地址信息提交上去')

    # 最后的数据提交
    def reportPush(self, distance):
        self.addressPush()  # 将地址的数据信息提交上去
        url = self.url + 'report'
        datas = {
            "address": "唐宁大道",
            "locationErrorExplain": "null",
            "province": "山西省",
            "city": "晋中市",
            "county": "榆次区",
            "distance": distance,
            "longitude": self.longitude,
            "latitude": self.latitude,
            "temperature": "36",
            "healthCondition": "正常",
            "healthConditionExplain": "null",
            "roomieCondition": "null",
            "roomieConditionExplain": "null",
            "ifContactCase": "无",
            "ifContactCaseExplain": "null",
            "askForLeave": "null",
            "leaveReason": "null",
            "ifQuarantine": "null",
            "quarantineArea": "null",
            "ifReturnToSchool": "无",
            "ifReturnToSchoolExplain": "null",
            "startingPoint": "null",
            "terminalPoint": "null",
            "vehicle": "null",
            "billingContactName": "null",
            "billingContactNameTel": "null",
            "remarks": "null",
            "plusinfo": "Mozilla/5.0 (Linux; Android 9; vivo X21A Build/PKQ1.180819.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045618 Mobile Safari/537.36 wxwork/3.1.11 ColorScheme/Light MicroMessenger/7.0.1 NetType/WIFI Language/zh Lang/zh"
        }
        self.header['Content-type'] = 'application/json;charset=UTF-8'
        ress = requests.post(url, headers=self.header, data=json.dumps(datas))
        if ress.json()['status'] == 1:
            urls = f'{self.url}alreadyReport?userId={self.userid}&day={self.today}'
            res = requests.post(urls, headers=self.header)
            return json.dumps(res.json()['data'], ensure_ascii=False)
