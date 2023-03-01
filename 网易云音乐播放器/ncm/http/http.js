// url：请求的地址
// data：请求数据
// config：除了地址其他的配置
module.exports = function(url,data,config){
  // 返回 promose 对象
  return new Promise((resolve,reject)=>{
    // 显示 loading 提示框
    wx.showLoading({
      title: '正在加载中'
    })
    // 发送网络请求
    wx.request({
      url,
      data:{
        ...data,
        // 每次请求把登录成功之后存在本地的 cookie 手动携带过去
        cookie: wx.getStorageSync('cookie')
      },
      header: {
        // 每次请求把登录成功之后存在本地的 cookie 手动携带过去
        cookie: wx.getStorageSync('cookie')
      },
      ...config,
      success: res=>{
        resolve(res)
      },
      fail: err=>{
        reject(err)
      },
      complete: res=>{
        // 隐藏 loading 提示框
        wx.hideLoading()
        // 根据返回的状态码判断请求成功还是失败
        if (res.statusCode.toString().startsWith("2")) {
            wx.showToast({
              title: '请求成功',
            })
        } else {
          wx.showToast({
            title: '请求失败',
            icon: 'error'
          })
        }
      }
    })
  })
}