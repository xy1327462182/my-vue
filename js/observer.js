class Observer {
  constructor(data) {
    this.walk(data)
  }
  walk(data) {
    if (!data || typeof data !== 'object') {
      return
    }
    Object.keys(data).forEach(key => {
      //定义数据为响应式
      this.defineReactive(data, key, data[key])
    })
  }
  defineReactive(data, key, val) {
    //data中的每一个数据对应一个dep容器，存放依赖于该数据的依赖项
    const dep = new Dep()
    let _this = this
    this.walk(val)
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get() {
        Dep.target && dep.addSub(Dep.target)//收集依赖
        return val
      },
      set(newVal) {
        if (newVal === val) {
          return
        }
        val = newVal
        //如果newVal也是对象，则递归，劫持它的每一个属性
        _this.walk(newVal)
        dep.notify()
      }
    })
  }
}