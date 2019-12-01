export default {
  get (key) {
    let value = localStorage.getItem(key)
    // console.log('【LocalStorage】获取')
    return value
  },
  set (key, value) {
    localStorage.setItem(key, value)
    // console.log('【LocalStorage】存储')

  },
  delete (key) {
    localStorage.setItem(key, undefined)
    // console.log('【LocalStorage】删除')
  },
  clear () {
    localStorage.clear()
    // console.log('【LocalStorage】清理')
  }
}
