// pages/user/user.js

const app = getApp()
const API = require("../../http/API")
const http = require("../../http/http")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  onLoad(){

  },
  
  onShow(){
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  // 跳转登录页面
  goToLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  }
})