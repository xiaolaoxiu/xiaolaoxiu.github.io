// 远程
const baseurl = "http://118.195.239.82:3000"
// const baseurl = "http://192.168.124.14:3000" 
// const baseurl = "http://127.0.0.1:3000"

// export default {

// }

module.exports = {
  // 登录
  login: baseurl + "/login/cellphone",
  // 二维码 key 生成接口
  qrkey: baseurl + "/login/qr/key",
  // 二维码生成接口
  qrcreate: baseurl + "/login/qr/create",
  // 二维码检测扫码状态接口
  qrcheck: baseurl + "/login/qr/check",
  // 登录状态
  loginstatus: baseurl + "/login/status",
  // 获取用户详情
  userdetail: baseurl + "/user/detail",
  // 获取用户歌单
  userplaylist: baseurl + "/user/playlist",
  // 获取歌单详情
  playlistdetail: baseurl + "/playlist/detail",
  // 获取音乐 url
  songurl: baseurl + "/song/url",
  // 获取歌曲详情
  songdetail: baseurl + "/song/detail",
  // 获取歌词
  lyric: baseurl + "/lyric",
  // 推荐歌单
  personalized: baseurl + "/personalized",
  // 获取每日推荐歌曲
  recommendsongs: baseurl + "/recommend/songs",
  // 热搜列表(简略)
  searchhot: baseurl + "/search/hot",
  // 搜索
  search: baseurl + "/cloudsearch",
  // 对歌单添加或删除歌曲
  playlisttracks: baseurl + "/playlist/tracks",
}
