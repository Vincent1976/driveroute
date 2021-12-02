// pages/route/test.js
import { mps } from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vCodeValue: '',
    isVFocus: true,
    phoneNum: '',//手机号码
    openId: '',
    loding: false,
    bindclass: 'bindclass',
    bindtext: '重新发送',
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    dialog: false,
    radioItems: [],
    systemItems: [],
    systemdialog: false,
    userflag: ''
  },
  //验证码输入是触发事件
  showVCode: function (e) {
    const that = this;
    that.setData({
      vCodeValue: e.detail.value,
    });
    if (that.data.vCodeValue.length == 6) {
      mps('Querymultisystem', { 'userphone': that.data.phoneNum }, 'get').then((res) => {
        const { data } = res
        if (data.total == 1) {
          that.Submitbinding(data.rows[0].userflag)
        } else if (data.total > 1) {
          mps('Querymultisystem_distinct', { 'userphone': that.data.phoneNum }, 'get').then((mydata) => {
            if (mydata.data.total == 1) {
              that.Submitbinding(mydata.data.rows[i].userflag)
            } else if (mydata.data.total > 1) {
              let arrsystem = []
              for (let i = 0; i < mydata.data.total; i++) {

                if (i === 0)
                  arrsystem.push({ name: mydata.data.rows[i].username, value: mydata.data.rows[i].userflag, checked: true })
                else
                  arrsystem.push({ name: mydata.data.rows[i].username, value: mydata.data.rows[i].userflag })
              }
              that.setData({
                systemItems: arrsystem,
                systemdialog: true
              })
            }
          }).catch((error) => {
            that.setData({
              error: error?.data
            })
          })
        }
      }).catch((error) => {
        that.setData({
          error: error?.data
        })
      })
    }
  },
  tapFn(e) {
    const that = this;
    that.setData({
      isVFocus: true,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData({
      openId: wx.getStorageSync('tokenId'),
      phoneNum: option.mobile
    })
  },
  //提交短信验证码到后台验证
  Submitbinding(userflag) {
    const that = this
    that.setData({
      loding: true
    })
    let userdata = {
      'userflag': userflag,
      'userphone': that.data.phoneNum,
      'openid': wx.getStorageSync('tokenId'),
      'smscode': that.data.vCodeValue
    }
    let date = mps('getMobileIndex_new', userdata, 'get')
    date.then((res) => {
      that.setData({
        loding: false
      })
      if (res.data.indexOf('error:') >= 0) {
        that.setData({
          error: res.data
        })
        return
      } else if (res.data.indexOf('多个账户') >= 0) {
        let raioditem = JSON.parse(res.data.split('&')[1])
        that.setData({
          dialog: true
        })
        let raioditems = []
        for (var i = 0; i < raioditem.total; i++) {
          if (i === 0)
            raioditems.push({ name: raioditem.rows[i].usernm, value: raioditem.rows[i].userid, checked: true })
          else
            raioditems.push({ name: raioditem.rows[i].usernm, value: raioditem.rows[i].userid })
        }
        that.setData({
          radioItems: raioditems
        })
      } else {
        wx.setStorage({
          key: "myurl",
          data: res.data,
        })
        wx.navigateTo({
          url: '../route/route?myurl=' + res.data
        })
      }
    })
  },
  //重新获取短信验证码
  Resend() {
    const that = this
    let i = 60
    that.setData({
      bindclass: '.p-e-none'
    })
    wx.request({
      url: 'https://www.taijuai.com/route/wechat/getMesCode2',
      method: "GET",
      data: {
        "userPhone": that.data.phoneNum
      },
      success: function (res) {
        if (res.data.indexOf('失败') >= 0) {
          that.setData({
            error: res.data,
            bindclass: ".p-e-auto"
          })
          return
        }
        wx.showToast({
          title: '短信验证码发送成功'
        })
        let time = setInterval(() => {
          that.setData({
            bindtext: (i) + "秒后发送"
          })
          if (i === 0) {
            that.setData({
              bindtext: "重新发送",
              bindclass: ".p-e-auto"
            })
            clearInterval(time)
          }
          i--;
        }, 1000)
      }
    })
  },
  //如果一个系统多大账户显示的选择框的按钮触发事件
  tapDialogButton(e) {
    const that = this
    const _btn = e.detail.item.text;
    if (_btn == '确定') {
      let users = that.data.radioItems.filter((item) => {
        return item.checked == true
      })
      wx.request({
        url: 'https://www.taijuai.com/route/wechat/loginChangeUser',
        data: {
          'userflag': that.data.userflag,
          'userphone': that.data.phoneNum,
          'openid': wx.getStorageSync('tokenId'),
          'userid': users[0].value
        },
        success: (res) => {
          if (res.data.indexOf('error') >= 0) {
            that.setData({
              error: res.data
            })
            return
          } wx.setStorage({
            key: "myurl",
            data: res.data,
          })
          wx.navigateTo({
            url: '../route/route'
          })
        }
      })
    }
    this.setData({
      dialog: false,
    })
  },
  //单选框点击时触发事件
  radioChange: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value
    }
    this.setData({
      radioItems: radioItems,
      [`formData.radio`]: e.detail.value
    })
  },
  //多个系统弹框按钮点击事件
  systemButton(e) {
    const that = this
    const _btn = e.detail.item.text;
    if (_btn == '确定') {
      let systems = that.data.systemItems.filter((item) => {
        return item.checked == true
      })
      that.setData({
        userflag: systems[0].value
      })
      that.Submitbinding(systems[0].value)
    }
    this.setData({
      systemdialog: false,
    })
  },
  //单选框点击时触发事件
  systemChange: function (e) {
    var systemItems = this.data.systemItems;
    for (var i = 0, len = systemItems.length; i < len; ++i) {
      systemItems[i].checked = systemItems[i].value == e.detail.value;
    }
    this.setData({
      systemItems: systemItems,
      [`formData.radio`]: e.detail.value
    })
  },
})