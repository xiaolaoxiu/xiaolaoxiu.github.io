// components/cdPlayer/cdPlayer.js

const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    picUrl: "",
    isPlaying: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToPlayer(){
      if (app.globalData.song) {
        wx.navigateTo({
          url: '../../pages/player/player',
        })
      }
    }
  },

  /**
   * 组件的生命周期
   */
  lifetimes:{
    // 添加监听
    ready(){
      this.setData({
        picUrl: app.globalData.song&&app.globalData.song.al.picUrl,
        isPlaying: !app.globalData.player.paused
      })
      
      this.canplay = song=>{
        this.setData({picUrl: song.al.picUrl})
      }
      app.notificationCenter.on("canplay",this.canplay)

      this.play = song=>{
        this.setData({isPlaying: true})
      }
      app.notificationCenter.on("play",this.play)

      this.pause = song=>{
        this.setData({isPlaying: false})
      }
      app.notificationCenter.on("pause",this.pause)

      this.ended = song=>{
        this.setData({isPlaying: false})
      }
      app.notificationCenter.on("ended",this.ended)

      this.stop = song=>{
        this.setData({isPlaying: false})
      }
      app.notificationCenter.on("stop",this.stop)
    },
    // 移除监听
    detached(){
      app.notificationCenter.off("canplay",this.canplay)
      app.notificationCenter.off("play",this.play)
      app.notificationCenter.off("pause",this.pause)
      app.notificationCenter.off("ended",this.ended)
      app.notificationCenter.off("stop",this.stop)
    }
  }
})
