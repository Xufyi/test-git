export default {
  get (key) {
    let value = sessionStorage.getItem(key)
    // console.log('【SessionStorage】获取')
    return value
  },
  set (key, value) {
    sessionStorage.setItem(key, value)
    // console.log('【SessionStorage】存储')
  },
  delete (key) {
    sessionStorage.setItem(key, undefined)
    // console.log('Key：', key)
  },
  clear () {
    sessionStorage.clear()
    // console.log('【SessionStorage】清理')
  }
}
