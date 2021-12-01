// pages/bind/bind.js
import { mps } from "../../utils/util"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        form: {
            mobile: '',
            vcode: ''
        },
        yztext: '获取验证码',
        p_class: ".p-e-auto",
        errorMsg: '', // 验证表单显示错误信息
        vcode2: '1234',
        rules: [
            {
                name: 'mobile',
                rules: [{ required: true, message: '请填写手机号码' }, { mobile: true, message: '电话格式不对' }]
            },
            {
                name: 'vcode',
                rules: { required: true, message: '请填写图形验证码' },
            },
            // {
            //     name: 'vcode',
            //     rules: { required: true, message: '请填写短信验证码' }
            // },
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            vcode2: this.randomString()
        })
        // console.log("onLoad")
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // console.log("onReady")
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // console.log("onShow")
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        // console.log("onHide")
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
    //验证表单
    //绑定提交
    submitForm() {
        const that=this;
        this.selectComponent('#form').validate((valid, errors) => {
            if (!valid) {
                const firstError = Object.keys(errors)
                if (firstError.length) {
                    this.setData({
                        error: errors[firstError[0]].message
                    })
                }
            } else {
                if (that.data.form.vcode.toUpperCase() != that.data.vcode2.toUpperCase()) {
                    that.setData({
                        error: "图形验证码错误",
                    })
                    return;
                }
                mps('Querymultisystem',{'userphone':that.data.form.mobile},'get').then((e)=>{
                    if(e.data.indexOf("error") >= 0){
                        that.setData({
                            error:e.data
                        })
                        return
                    }
                    if(e.data.total==0){
                        that.setData({
                            error:'该手机号未注册系统，请联系管理员'
                        })
                        return
                    }
                    mps('getMesCode2',{'userPhone':that.data.form.mobile},'get').then((res)=>{
                        if (res.data.indexOf("失败") >= 0) {
                            that.setData({
                                error: res.data
                            })
                        }else{
                            wx.showToast({
                                title: '短信验证码发送成功'
                            })
                            wx.navigateTo({
                                url: '../route/test?mobile='+that.data.form.mobile
                            })
                        }
                    })
                })
              
            }
        })
    },
    //表单input输入框事件
    formInputChange(e) {
        const { field } = e.currentTarget.dataset
        this.setData({
            [`form.${field}`]: e.detail.value
        })
    },
    //获取短信验证码
    getvcode() {
        const that = this;
        this.selectComponent('#form').validate((valid, errors) => {
            if (!valid) {
                const firstError = Object.keys(errors)
                if (firstError.length) {
                    this.setData({
                        error: errors[firstError[0]].message
                    })
                }
            } else {
                if (that.data.form.vcode != that.data.vcode2) {
                    that.setData({
                        error: "图形验证码错误",
                        yztext: "重新获取验证码",
                        p_class: ".p-e-auto"
                    })
                    return;
                }
              
            }
        })
    },
    //图片验证码
    upimgurlcode() {
        this.setData({
            vcode2: this.randomString()
        })
    },
    //生成随机数
    randomString(e) {
        e = e || 4;
        var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
            a = t.length,
            n = "";
        for (var i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
        return n
    }
})