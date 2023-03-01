// components/recommendSongsList/recommendSongsList.js

const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songsList: {
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
    songsListItemTap(e){
      // console.log(e.currentTarget.id);
      app.getPlayListDetail(e.currentTarget.id)
    }
  }
})
