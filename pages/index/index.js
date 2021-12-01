// index.js
// 获取应用实例
import { mps } from "../../utils/util"
const app = getApp()


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    radioItems: [

    ],
    dialog: false,
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })

      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //判断用户openid是否绑定
  userlogin(e) {
    const that=this
    mps('QueryuseropenId', { 'openId': wx.getStorageSync('tokenId') }, 'get').then((res) => {
      const { data } = res
      // if(data.indexOf('error')>=0){
      //   that.setData({
      //     error:data
      //   })
      //   return
      // }
      if (data.total == 0) {
        wx.navigateTo({
          url: '../bind/bind'
        })
      } else if (data.total == 1) {
        wx.setStorage({
          key: "myurl",
          data: data.rows[0].user_url + "?openid=" + data.rows[0].openid,
        })
        wx.navigateTo({
          url: '../route/route'
        })
      } else if (data.total > 1) {
        let userarr = []
        for (let i = 0; i < data.total; i++) {
          if (i === 0) {
            userarr.push({ name: data.rows[i].username, value: data.rows[i].user_url + "?openid=" + data.rows[i].openid, checked: true })
          }
          else {
            userarr.push({ name: data.rows[i].username, value: data.rows[i].user_url + "?openid=" + data.rows[i].openid })
          }
        }
        that.setData({
          radioItems:userarr
        })
      }
    })
  },
  //弹出框点击按钮事件
  tapDialogButton(e) {
    const that = this
    const _btn = e.detail.item.text;
    if (_btn == '确定') {
      let users = that.data.radioItems.filter((item) => {
        return item.checked == true
      })
      wx.setStorage({
        key: "myurl",
        data: users[0].value,
      })
      wx.navigateTo({
        url: '../route/route'
      })
    }
    this.setData({
      dialog: false,
    })
  },
  //多选框点击事件
  radioChange: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems,
      [`formData.radio`]: e.detail.value
    })
  },
})
