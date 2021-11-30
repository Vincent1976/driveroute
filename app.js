// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId 
        // console.log(res);
        if (res.code) {
          wx.request({
            url: 'https://www.taijuai.com/route/wechat/Get_WXApp_OPENID',
            //仅为示例，并非真实的接口地址
            method: "GET",
            data: {
              "code": res.code
            },
            header: {
              'content-type': 'application/json'
              // 默认值
            },
            success: function (res) {
            // console.log(res);
              if (res.data) {
                wx.setStorage({
                  key: "tokenId",
                  data: res.data,
                })
              }
            }
          })
        }
      }

    })

  },
  globalData: {
    userInfo: null
  }
})