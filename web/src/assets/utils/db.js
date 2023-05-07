export default {
  //深拷贝
  deepClone: (item) => {
    let cloneItem = JSON.parse(JSON.stringify(item))
    return cloneItem
  },
  //去除输入框的空格
  filterValue: (e, value, that) => {
    let max = e.target.maxLength
    if (max >= 1 && value.length >= max) {
      that.$message.info('最多输入 ' + max + ' 个字符')
    }
    if (typeof(value) == 'string') {
      value = e.target.value.trim()
    }
    return value
  },
  // 上传本地图片
  handleFile(e,that) {
    return new Promise((resolve, reject)=>{
      let file = e.target.files;
      let max = 2 * 1024 * 1024
      if (file[0].size > max) {
        that.$message.error('上传文件小于2M！')
        return false;
      }
      let reader = new FileReader(); //读取文件
      reader.readAsDataURL(file[0]);
      reader.onload = () => {
        resolve(reader.result)
      }
    })
  },
  //防抖函数(在一段时间内，你触发多少次我只执行一次)
  debounce: (fnName, dealy) => {
    let timer = null
    return function() {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        this[fnName]();
      }, dealy)
    }
  },
  //节流（在一段时间内，点击我多少次，我就给你处理一次）
  throttle: (fn, wait) => {
    let _arguments = arguments
    //定义一个事件为0，第一次肯定会执行
    let canRun = true
    return (e) => {
      if (!canRun) return
      canRun = false
      setTimeout(() => {
        fn.call(this, _arguments)
        canRun = true
      }, time);
    }
  }
}
