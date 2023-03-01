// components/recommendSongs/recommendSongs.js

const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    songsItemTap(e){
      app.getSongUrlAndDetail(e.currentTarget.id)
    }
  }
})
