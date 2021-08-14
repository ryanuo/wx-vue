import '@/index.less';
let dayjs = require('dayjs')
import Vue from '@/vue.min.js';
// import '@/favicon.ico';
// 初始化的值
const self = {};
self.host = 'https://pan.mr90.top'  // 你自己配置的域名地址
self.today = dayjs().format("YYYY-MM-DD HH:mm:ss") // 获取今天的日期
self.url = 'http://mp.sxtcm.edu.cn/microapp/health_daily/'

// 头部组件
const myheader = {
  template: '#tpl',
  data() {
    return {
      userId: '',
      remind: { class: 'alert alert-danger', hidden: true, content: "" }
    }
  },
  methods: {
    // 提示框
    reminds(state, content) {
      let remind = { class: `alert alert-${state}`, hidden: false, content }
      this.remind = remind
      setTimeout(() => {
        this.remind['hidden'] = true
      }, 2500);
    },
    submitId(e) {
      let value = this.$refs.idRef.value  // 获取值
      // 判空操作
      if (value.trim().length <= 0) {
        this.reminds('danger', '您输入的学号为空请重新输入！！')
      } else {
        // 缓冲验证
        this.isUserId(value)
      }
    },
    isUserId(value) {
      // 判断缓冲的操作
      let status = localStorage.hasOwnProperty("userId")
      if (status) {
        let userId = localStorage.getItem('userId')
        if (value != userId) {
          this.reminds('info', '学号修改完成!!')
          localStorage.setItem('userId', value)
          this.userId = value
        } else {
          this.reminds('success', '学号已保存到缓冲中!!如需修改上方输入框中修改即可')
          this.userId = userId
        }
      } else {
        localStorage.setItem('userId', value)
        this.userId = value
        this.reminds('success', '学号已保存到缓冲中！！')
      }
    }
  },
  created() {
    let status = localStorage.hasOwnProperty("userId")
    if (status) {
      let userId = localStorage.getItem('userId')
      this.userId = userId
    }
  }
}

// 中间组件
const middlecom = {
  template: '#tpl2',
  data() {
    return {
      times: self.today,
      cookie: '',
      allList: { username: "", userId: "", orgname: "", address: "", distance: "", healthCondition: "", address_ip: "", temperature: "", timeInterval: "", billingContactName: "", billingContactNameTel: "" },
      remind: { class: 'alert alert-danger', hidden: true, content: "" }
    }
  },
  // created(){
  //   let status = localStorage.hasOwnProperty('detail_List')
  //   let detail_List = localStorage.getItem('detail_List')
  //   if (status) {
  //     this.allList = detail_List
  //     // let times = 2 - JSON.parse(this.alist)['timeInterval'][0]
  //   } else {
  //     return false;
  //   }
  // },
  mounted() {
    // 先判断原缓冲中的数据是否存在
    let status = localStorage.hasOwnProperty('detail_List')
    let detail_List = localStorage.getItem('detail_List')
    if (status) {
      this.allList = JSON.parse(detail_List)
      let times = 2 - this.allList['timeInterval'][0]
      this.reminds('info',`今日还需上报${times}次`)
    } else {
      return false;
    }
  },
  methods: {
    // 数据的提交
    submitData() {
      let value = this.$refs.cookieRef.value
      if (value.length == 0) {
        this.reminds('danger', 'cookie值为空')
      } else {
        this.cookie = value
        this.getInit()
      }
    },
    // 提醒
    reminds(state, content) {
      let remind = { class: `alert alert-${state}`, hidden: false, content }
      this.remind = remind
      setTimeout(() => {
        this.remind['hidden'] = true
      }, 2500);
    },
    // 初始化
    getInit() {
      let url = `${self.host}/login`  // 域名地址
      let userId = localStorage.getItem('userId')
      if (!userId) {
        return this.reminds('danger', '保存后提交')
      }
      let data = {
        cookie: this.cookie, userId
      }
      $.ajax({
        type: "get", url, data, dataType: 'JSONP', // 注意：这里是指希望服务端返回json格式的数据
        jsonpCallback: "successCallback",
        success: (res) => {
          // 姓名
          if (res.state == -1) return this.reminds('danger', res.message)
          let _this = res[0]
          // console.log(_this);
          let datas = {
            username: _this.username,
            userId: _this.userId,
            orgname: _this.orgname,
            address: _this.province + _this.city + _this.county + _this.address,
            distance: _this.distance + "米",
            healthCondition: _this.healthCondition,
            address_ip: _this.latitude + ',' + _this.longitude,
            temperature: _this.temperature + "°",
            timeInterval: _this.timeInterval + "次",
            billingContactName: _this.billingContactName,
            billingContactNameTel: _this.billingContactNameTel,
            time: _this.time
          }
          this.allList = datas
          localStorage.setItem('detail_List', JSON.stringify(datas))
          this.reminds('success', '提交成功!!,并且将数据更新到缓冲中!!')
        }
      });
    },
    // 缓冲清除
    clearLocationStorage() {
      localStorage.clear();
      window.location.reload();
    }
  }
}
// 提交信息的组件
const app = new Vue({
  el: '#app',
  data: {
    userId: '',
    alist: {}
  },
  components: {
    myheader, middlecom
  },
  mounted() {

  }
})
