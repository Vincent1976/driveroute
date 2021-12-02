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
    radioItems: [],
    userItems: [],
    dialog: false,
    userdialog: false,
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    Loginloading: false
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

    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //判断用户openid是否绑定
  userlogin(e) {
    const that = this
    that.setData({
      Loginloading: true
    })
    mps('QueryuseropenId', { 'openId': wx.getStorageSync('tokenId') }, 'get').then((res) => {
      that.setData({
        Loginloading: false
      })
      const { data } = res
      console.log(data);
      if (data.total == 0) {
        wx.navigateTo({
          url: '../bind/bind'
        })
      } else if (data.total == 1) {
        mps('Viewusertypes', { 'openid': data.rows[0].openid, 'userflag': data.rows[0].userflag }, 'get').then((res) => {
          wx.setStorage({
            key: "myurl",
            data: res.data,
          })
          wx.navigateTo({
            url: '../route/route'
          })
        }).catch((error) => {
          that.setData({
            error: error?.data
          })
        })
      } else if (data.total > 1) {
        that.setData({
          error:'您的微信绑定多个用户，身份不明确，请联系管理员'
        })
      }
    }).catch((error) => {
      that.setData({
        error: error?.data
      })
    })
  },
})
