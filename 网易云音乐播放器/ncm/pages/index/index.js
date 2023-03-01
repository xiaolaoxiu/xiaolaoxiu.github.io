// index.js
// 获取应用实例
const app = getApp()
const API = require("../../http/API")
const http = require("../../http/http")

Page({
  data: {
    // 推荐歌单
    recommendSongsList: [],
    // 推荐歌曲
    recommendSongs: []
  },

  onLoad(){
    // 推荐歌单数据
    http(API.personalized).then(res=>{
      this.setData({
        recommendSongsList: res.data.result
      })
    })
  },
  
  onShow(){
    // 推荐歌曲数据
    http(API.recommendsongs).then(res=>{
      this.setData({
        recommendSongs: res.data.data.dailySongs
      })
    })
  },

  // 播放我的歌单
  playMyList(){
    if (app.globalData.uid) {
      app.setCurrentPlayList(app.globalData.playList)
    }else{
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
  }
})
