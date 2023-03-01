module.exports = function(num){
  // 先生成对应歌单列表长度的数组（代表的是索引）
  let arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(i)
  }
  // 把数组打乱
  for (let i = 0; i < arr.length; i++) {
    let index1 = Math.floor(Math.random() * num)
    let index2 = Math.floor(Math.random() * num)
    let temp = arr[index1]
    arr[index1] = arr[index2]
    arr[index2] = temp;
  }
  return arr;
}