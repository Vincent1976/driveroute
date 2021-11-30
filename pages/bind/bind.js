// pages/bind/bind.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        form: {
            verificationcode: '',
            mobile: '',
            vcode: '',
            imgurl: ''
        },
        yztext: '获取验证码',
        p_class: ".p-e-auto",
        errorMsg: '', // 验证表单显示错误信息
        vcode2:'',
        rules: [
            {
                name: 'mobile',
                rules: [{ required: true, message: '请填写手机号码' }, { mobile: true, message: '电话格式不对' }]
            },
            {
                name: 'verificationcode',
                rules: { required: true, message: '请填写图形验证码' },
            },
            {
                name: 'vcode',
                rules: { required: true, message: '请填写短信验证码' }
            },
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            vcode2:this.randomString()
        })
        console.log("onLoad")
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        console.log("onReady")
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        console.log("onShow")
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        console.log("onHide")
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
    submitForm() {
        this.selectComponent('#form').validate((valid, errors) => {
            if (!valid) {
                const firstError = Object.keys(errors)
                if (firstError.length) {
                    this.setData({
                        error: errors[firstError[0]].message
                    })
                }
            } else {
                wx.showToast({
                    title: '校验通过'
                })
            }
        })
    },
    formInputChange(e) {
        const { field } = e.currentTarget.dataset
        this.setData({
            [`form.${field}`]: e.detail.value
        })
    },
    getvcode() {
        let i = 60
        const that = this
        that.setData({
            yztext: "发送中...",
            p_class: ".p-e-none"
        })
        if(that.data.form.vcode!=that.data.vcode2)
        {
            that.setData({
                error: "图形验证码错误",
                yztext: "重新获取验证码",
                p_class: ".p-e-auto"
            })
            return;
        }
        wx.request({
            url: 'https://www.taijuai.com/route/wechat/getMesCode2',
            method: "GET",
            data: {
                "userPhone": that.data.form.mobile,
                "userdb": "securall"
            },
            success: function (res) {
                console.log(res);
                if (res.data.indexOf("失败")) {
                    that.setData({
                        error: res.data
                    })
                } else {
                    let time = setInterval(() => {
                        that.setData({
                            yztext: (i) + "秒后发送"
                        })
                        if (i === 0) {
                            that.setData({
                                yztext: "重新获取验证码",
                                p_class: ".p-e-auto"
                            })
                            clearInterval(time)
                        }
                        i--;
                    }, 1000)
                }

            }
        })
    },
    upimgurlcode() {
        this.setData({
            vcode2:this.randomString()
        })
    },
    randomString(e) {
        e = e || 4;
        var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
            a = t.length,
            n = "";
        for (var i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
        return n
    }
})