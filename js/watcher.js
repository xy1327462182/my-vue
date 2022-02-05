//观察者(订阅者)
let uid = 0;
class Watcher {
  constructor(vm, key, cb) {
    this.$vm = vm
    this.key = key
    this.cb = cb
    this.id = ++uid
    // 将Dep.target静态属性指向当前的Watcher实例
    Dep.target = this
    //访问这个数据 触发数据的拦截器，来进行依赖收集，其实就是收集当前的Watcher实例
    this.oldValue = vm[key]
    this.newValue = ''
    //将Dep.target置为null ，防止下一个数据被访问的时候，添加了当前的Watcher实例
    Dep.target = null
  }
  //观察者被通知时，调用更新方法
  update() {
    if (this.newValue === this.$vm[this.key]) return
    this.newValue = this.$vm[this.key]
    this.cb(this.newValue)
  } 
}