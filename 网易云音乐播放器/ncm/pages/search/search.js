// pages/search/search.js

const API = require("../../http/API")
const http = require("../../http/http")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索关键字
    keywords: '',
    // 返回数量
    limit: 30,
    // 偏移数量
    offset: 0,
    // 搜索列表
    searchList: [],
    // 热搜关键字列表
    hotList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 请求热搜关键字
    this.getHotList()
  },

  // 请求热搜关键字
  getHotList(){
    http(API.searchhot).then(res=>{
      this.setData({
        hotList: res.data.result.hots
      })
    })
  },


  // 搜索框内容发生改变
  keywordsChange(){
    this.setData({offset: 0})
    if (this.time) {
      clearTimeout(this.time)
      this.time = null
    }
    if (this.data.keywords.trim()) {
      this.time = setTimeout(() => {
        this.getSearchList()
      }, 2000);
    } else {
      this.setData({searchList: []})
    }
  },

  // 点击热搜关键字
  hotItemTap(e){
    this.setData({
      keywords: e.currentTarget.dataset.hot,
      offset: 0
    })
    this.getSearchList()
  },

  // 根据关键字请求列表
  getSearchList(){
    http(API.search,{
      keywords: this.data.keywords,
      limit: this.data.limit,
      offset: this.data.offset
    }).then(res=>{
      if (res.data.result.songs) {
        if (this.data.offset === 0) {
          this.setData({searchList: res.data.result.songs})
        }else{
          this.setData({searchList: this.data.searchList.concat(res.data.result.songs)})
        }
      } else {
        wx.showToast({
          title: '没有更多的数据了',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({offset: this.data.offset + this.data.limit})
    this.getSearchList()
  }
})