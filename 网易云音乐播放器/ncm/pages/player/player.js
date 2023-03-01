// pages/player/player.js

const app = getApp();
const API = require("../../http/API")
const http = require("../../http/http")
const lyric = require("../../utils/lyric")
const randomList = require("../../utils/randomList")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 控制显示歌词还是图片
    isShowLyric: true,
    // 歌曲的图片
    picUrl: '',
    // 歌曲的名字
    name: '',
    // 歌曲的演唱者
    ar: [],
    // 歌曲的总时长（秒）
    dt: 0,
    // 歌词
    lyric: [],
    // 歌词唱到的行数
    line: 0,
    // 当前歌曲播放进度
    ct: 0,
    // 播放还是暂停
    isPlaying: false,
    // 歌曲播放模式：loop、random、single
    mode: "loop",
    // 控制播放列表展开还是关闭
    isOpen: false,
    // 播放列表
    playList: [],
    // 当前播放歌曲的索引
    currentIndex: 0,
    // 是否在我的歌单中
    isIn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ isPlaying: !app.globalData.player.paused})
    this.canplay(app.globalData.song)
    app.notificationCenter.on("canplay",this.canplay)

    app.notificationCenter.on("timeupdate",this.timeupdate)

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
      if (this.data.mode === 'single') {
        app.getSongUrlAndDetail(app.globalData.currentPlayList[app.globalData.currentIndex].id)
      }else{
        this.nextTap()
      }
    }
    app.notificationCenter.on("ended",this.ended)

    this.stop = song=>{
      this.setData({isPlaying: false})
    }
    app.notificationCenter.on("stop",this.stop)

    // 获取歌单列表
    this.getPlayList()
  },

  // 歌曲准备好了可以播放了
  canplay(song){
    // 设置导航条标题
    wx.setNavigationBarTitle({
      title: song.name,
    })
    // 获取歌曲的其他信息
    this.setData({
      picUrl: song.al.picUrl,
      name: song.name,
      ar: song.ar,
      dt: song.dt,
      currentIndex: app.globalData.currentIndex,
      line: 4
    })
    // 获取歌曲的歌词
    http(API.lyric,{id: song.id}).then(res=>{
      this.setData({
        lyric: lyric(res.data.lrc.lyric)
      })
    })
    // 检测当前播放的这首歌在不在你的歌单中
    this.isInMyPlayListCheck(song)
  },

  // 播放进度改变了
  timeupdate(player){
    this.setData({ct: player.currentTime})
    for (let i = this.data.lyric.length-1; i >= 0; i--) {
      if (player.currentTime >= this.data.lyric[i].time) {
        if (this.data.line !== i) {
          this.setData({
            line: i
          })
        }
        break
      }
    }
  },

  // 获取歌单列表
  getPlayList(){
    let ids = app.globalData.currentPlayList.map(item=>item.id).join(",")
    http(API.songdetail,{ids}).then(res=>{
      this.setData({playList: res.data.songs})
    })
  },

  // 检测当前播放的这首歌在不在你的歌单中
  isInMyPlayListCheck(song){
    this.setData({isIn: app.globalData.playList.some(item => item.id===song.id)})
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.notificationCenter.off("canplay",this.canplay)
    app.notificationCenter.off("timeupdate",this.timeupdate)
    app.notificationCenter.off("play",this.play)
    app.notificationCenter.off("pause",this.pause)
    app.notificationCenter.off("ended",this.ended)
    app.notificationCenter.off("stop",this.stop)
  },

  /**
   * 事件
   */
  // 切换图片或者歌词
  changeLyricOrPic(){
    this.setData({
      isShowLyric: !this.data.isShowLyric
    })
  },
  // 点击歌词改变进度
  lyricLineTap(e){
    app.globalData.player.seek(e.currentTarget.dataset.time)
  },
  // 拖拽进度条改变进度
  changePlayerProgress(e){
    this.setData({ct: e.detail.value})
    app.globalData.player.seek(e.detail.value)
  },
  // 上一首
  prevTap(){
    switch (this.data.mode) {
      case "loop":
      case "single":
        app.globalData.currentIndex --;
        if (app.globalData.currentIndex < 0) {
          app.globalData.currentIndex = app.globalData.currentPlayList.length-1
        } 
        break;
      case "random":
        let index = app.globalData.randomList.indexOf(app.globalData.currentIndex) - 1
        if (index < 0) {
          index = app.globalData.randomList.length-1
        }
        app.globalData.currentIndex = app.globalData.randomList[index]
        break;
      default:
        break;
    }
    app.getSongUrlAndDetail(app.globalData.currentPlayList[app.globalData.currentIndex].id)
  },
  // 播放或者暂停
  playOrPauseTap(){
    if (app.globalData.player.paused) {
      app.globalData.player.play()
    }else{
      app.globalData.player.pause()
    }
  },
  // 下一首
  nextTap(){
    switch (this.data.mode) {
      case "loop":
      case "single":
        app.globalData.currentIndex ++;
        if (app.globalData.currentIndex >= app.globalData.currentPlayList.length) {
          app.globalData.currentIndex = 0
        } 
        break;
      case "random":
        let index = app.globalData.randomList.indexOf(app.globalData.currentIndex) + 1
        if (index >= app.globalData.randomList.length) {
          index = 0
        }
        app.globalData.currentIndex = app.globalData.randomList[index]
        break;
      default:
        break;
    }
    app.getSongUrlAndDetail(app.globalData.currentPlayList[app.globalData.currentIndex].id)
  },
  // 改变播放模式mode
  changeMode(e){
    this.setData({mode: e.currentTarget.dataset.mode})
  },
  // 点击星星添加或移除
  starTap(){
    http(API.playlisttracks,{
      op: this.data.isIn?'del':'add',
      pid: app.globalData.playListId,
      tracks: app.globalData.song.id
    }).then(res=>{
      if (this.data.isIn) {
        // 删除
        if (app.globalData.currentPlayList === app.globalData.playList) {
          // 在播放我的歌单时做的删除操作
          for (let i = 0; i < app.globalData.playList.length; i++) {
            if (app.globalData.playList[i].id === app.globalData.song.id) {
              // 从我的歌单删除
              app.globalData.playList.splice(i,1)
              this.getPlayList()
              // 重新生成随机列表
              app.globalData.randomList = randomList(app.globalData.playList.length)
              console.log(app.globalData.randomList);
              break;
            } 
          }
          // 播放下一首
          app.globalData.currentIndex--
          this.nextTap()
        } else {
          // 在播放推荐歌单时做的删除操作
          for (let i = 0; i < app.globalData.playList.length; i++) {
            if (app.globalData.playList[i].id === app.globalData.song.id) {
              // 从我的歌单删除
              app.globalData.playList.splice(i,1)
              this.setData({isIn: false})
              break;
            }
          }
        }
      } else {
        // 增加
        app.globalData.playList.unshift(app.globalData.song)
        this.setData({isIn: true})
      }
    })
  },
  // 打开/关闭列表
  changeIsOpen(){
    this.setData({isOpen: !this.data.isOpen})
  },
  // 点击列表中的歌曲
  listItemTap(e){
    if (this.data.currentIndex !== e.currentTarget.dataset.index) {
      app.globalData.currentIndex = e.currentTarget.dataset.index
      app.getSongUrlAndDetail(e.currentTarget.id)
    }
  } 
})
