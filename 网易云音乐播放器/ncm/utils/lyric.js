module.exports = function(lrc){
  // 保存的[{time,content},...]
  let arr = [];
  // 正则解析歌词
  let reg = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/g
  // 循环解析
  let res = null;
  while(res = reg.exec(lrc)){
    let time = res[1]*60 + res[2]*1 + res[3]*1/1000
    let content = res[4]
    arr.push({time,content})
  }
  return arr
}