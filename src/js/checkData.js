export default {
  //正则表达式验证
  checkPhone(val) {
    if (val.length == 11) {
      if (!/^1[3456789]\d{9}$/.test(val)) {
        return true
      } else {
        return false
      }
    }
  },
  containSpecial(val) {
    let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
    if (pattern.test(val)) {
      return true
    }
    return false
  }
}
