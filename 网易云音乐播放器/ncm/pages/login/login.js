// pages/login/login.js

const app = getApp()
const API = require("../../http/API")
const http = require("../../http/http")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode: "phone",
    phone: "",
    password: "",
    imgData: ""
  },

  phoneLogin(){
    http(api.login,{
      phone: this.data.phone,
      password: this.data.password
    },{
      method: "POST"
    }).then(res=>{
      if (res.data.code == 200) {
        wx.setStorageSync('cookie', res.data.cookie)
        // 存储uid
        wx.setStorageSync('uid', res.data.profile.userId)
        // 保存用户信息
        app.globalData.uid = res.data.profile.userId;
        app.globalData.userInfo = res.data.profile;
        // 重新拉取一下我的歌单
        app.getUserPlayList(res.data.profile.userId)
        // 返回用户页面
        wx.navigateBack();
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    })
  },


  // 切换登录模式
  modeChange(e){
    this.setData({
      mode: e.detail.value
    },()=>{
      if (this.data.mode === 'qr') {
        // 二维码 key 生成接口
        http(API.qrkey).then(res=>{
          let key = res.data.data.unikey
          // 二维码生成接口
          http(API.qrcreate,{
            key,
            qrimg: true
          }).then(res=>{
            this.setData({
              imgData: res.data.data.qrimg
            })
            // 轮询此接口可获取二维码扫码状态,800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies)
            let interval = setInterval(() => {
              wx.request({
                url: API.qrcheck,
                data: {
                  key,
                  timestamp: Date.now()
                },
                success: res=>{
                  if (res.data.code === 803) {
                    clearInterval(interval);
                    wx.setStorageSync('cookie', res.data.cookie)
                    // 登录状态
                    http(API.loginstatus,{},{
                      method: "POST"
                    }).then(res=>{
                      console.log(res);
                      // 存储uid
                      wx.setStorageSync('uid', res.data.data.profile.userId)
                      // 保存用户信息
                      app.globalData.uid = res.data.data.profile.userId;
                      app.globalData.userInfo = res.data.data.profile;
                      // 返回到用户页面
                      wx.navigateBack()
                      // 手动拉取一下我的歌单
                      app.getUserPlayList()
                    })
                  }
                }
              })
            }, 1000);
          })
        })
      }
    })
  }

})