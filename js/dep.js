//Dep容器  data中的每个数据会对应一个，用来收集并存储依赖
class Dep {
  constructor() {
    this.deps = []
  }
  //收集依赖
  addSub(sub) {
    if (sub && sub.update) {
      this.deps.push(sub)
    }
  }
  //通知更新
  notify() {
    this.deps.forEach(sub => {
      sub.update()
    })
  }
}