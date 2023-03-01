// app.js

const API = require("./http/API")
const http = require("./http/http")
const randomList = require("./utils/randomList")

App({
  globalData: {
    // 用户的 userid
    uid: null,
    // 保存用户信息
    userInfo: null,
    // 我的歌单 id
    playListId: null,
    // 我的歌单所有的歌曲
    playList: null,
    // 当前播放歌单
    currentPlayList: null,
    // 当前播放歌曲的索引
    currentIndex: 0,
    // 播放器对象
    player: null,
    // 当前正在播放的歌曲信息
    song: null,
    // 随机播放列表
    randomList: []
  },

  onLaunch() {
    // 获取全局唯一的背景音频管理器
    this.getAudioManager()

    // 从本地读取 uid
    const uid = wx.getStorageSync('uid')
    if (uid) {
      this.globalData.uid = uid
      // 获取用户详情
      this.getUserDetail()
      // 获取用户歌单
      this.getUserPlayList()
    }
  },

  // 获取全局唯一的背景音频管理器
  getAudioManager(){
    let player = wx.getBackgroundAudioManager()
    this.globalData.player = player;
    // 1.监听背景音频进入可播放状态事件。 但不保证后面可以流畅播放
    player.onCanplay(()=>{
      this.notificationCenter.emit("canplay",this.globalData.song)
    })
    // 2.监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发
    player.onWaiting(()=>{
      this.notificationCenter.emit("waiting",this.globalData.song)
    })
    // 3.监听背景音频播放事件
    player.onPlay(()=>{
      this.notificationCenter.emit("play",this.globalData.song)
    })
    // 4.监听背景音频暂停事件
    player.onPause(()=>{
      this.notificationCenter.emit("pause",this.globalData.song)
    })
    // 5.监听背景音频自然播放结束事件
    player.onEnded(()=>{
      this.notificationCenter.emit("ended",this.globalData.song)
    })
    // 6.监听背景音频停止事件
    player.onStop(()=>{
      this.notificationCenter.emit("stop",this.globalData.song)
    })
    // 7.监听背景音频播放进度更新事件，只有小程序在前台时会回调。
    player.onTimeUpdate(()=>{
      this.notificationCenter.emit("timeupdate",this.globalData.player)
    })
  },

  // 获取用户详情
  getUserDetail(){
    http(API.userdetail,{
      uid: this.globalData.uid
    }).then(res=>{
      this.globalData.userInfo = res.data.profile
    })
  },

  // 获取用户歌单 id
  getUserPlayList(){
    http(API.userplaylist,{
      uid: this.globalData.uid
    }).then(res=>{
      this.globalData.playListId = res.data.playlist[0].id
      this.getPlayListDetail(res.data.playlist[0].id)
    })
  },

  // 根据歌单 id 获取歌单详情
  getPlayListDetail(id){
    http(API.playlistdetail,{
      id,
      timestamp: Date.now()
    }).then(res=>{
      if (id === this.globalData.playListId) {
        this.globalData.playList = res.data.playlist.trackIds
      } else {
        this.setCurrentPlayList(res.data.playlist.trackIds)
      }
    })
  },

  // 设置当前播放歌单
  setCurrentPlayList(list){
    this.globalData.currentPlayList = list;
    this.globalData.currentIndex = 0;
    // 生成一个随机播放的列表
    this.globalData.randomList = randomList(list.length)
    // 获取歌曲的 url 和详情
    this.getSongUrlAndDetail(this.globalData.currentPlayList[this.globalData.currentIndex].id);
  },

  // 获取歌曲的 url 和详情
  getSongUrlAndDetail(id){
    Promise.all([
      http(API.songurl,{
        id
      }),
      http(API.songdetail,{
        ids: id
      })
    ]).then(data=>{
      // 设置播放信息
      let song = data[1].data.songs[0]
      this.globalData.song = song
      this.globalData.player.title = song.name
      this.globalData.player.epname = song.al.name
      this.globalData.player.singer = song.ar.map(item=>item.name).join(",")
      this.globalData.player.coverImgUrl = song.al.picUrl
      // 设置url和播放
      this.globalData.player.src = data[0].data.data[0].url
      this.globalData.player.play()
    }).catch(()=>{
      wx.showToast({
        title: '暂无权限',
        icon: 'error'
      })
    })
  },

  // 通知中心模式
  notificationCenter: {
    // 通知列表
    notiList: {
    },
    // 添加监听
    on(name,cb){
      if (!this.notiList[name]) {
        this.notiList[name] = []
      }
      this.notiList[name].push(cb)
    },
    // 发射事件
    emit(name,data){
      if (this.notiList[name]) {
        this.notiList[name].forEach(cb=>{
          cb(data)
        })
      }
    },
    // 移除事件
    off(name,cb){
      if (this.notiList[name]) {
        let index = this.notiList[name].indexOf(cb);
        if (index >= 0) {
          this.notiList[name].splice(index,1)
        }
      }
    }
  }

})