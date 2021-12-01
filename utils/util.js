const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
const mps=(url,data,method)=>{
 return new Promise((r,j)=>{
  wx.request({
    url: 'https://www.taijuai.com/route/wechat/'+url,
    data: data,
    type:method,
    success: (res) => {
     return r(res);
    },
    fail:(error)=>{
      return j(error);
    }
  })
 })
}

module.exports = {
  formatTime,mps
}
