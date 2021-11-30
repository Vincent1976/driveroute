// pages/route/test.js
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
    bindtext: '重新发送'
  },
  showVCode: function (e) {
    const that = this;
    that.setData({
      vCodeValue: e.detail.value,
    });
    if (that.data.vCodeValue.length == 6) {
      that.Submitbinding()
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (option) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  Submitbinding() {
    const that = this
    that.setData({
      loding: true
    })
    wx.request({
      url: 'https://www.taijuai.com/route/wechat/getMobileIndex',
      data: {
        'userflag': 'ro',
        'userphone': that.data.phoneNum,
        'openid': 'ovptbt8ANFwFTwzCGNm_BxnmeDks',
        'smscode': that.data.vCodeValue
      },
      success: (res) => {
        that.setData({
          loding: false
        })
        if (res.data.indexOf('error:') >= 0) {
          that.setData({
            error: res.data
          })
          return
        }
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
  Resend() {
    const that = this
    let i = 60
    that.setData({
      bindclass:'.p-e-none'
    })
    wx.request({
      url: 'https://www.taijuai.com/route/wechat/getMesCode2',
      method: "GET",
      data: {
        "userPhone": that.data.phoneNum,
        "userdb": "securall"
      },
      success: function (res) {
        console.log(res);
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
  }
})