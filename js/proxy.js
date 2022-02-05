class ProxyData {
  constructor(vm) {
    this.$vm = vm
    //代理data
    this._proxyData(vm.$data)
    //代理computed计算属性
    this._proxyComputed(vm.$options.computed)
    //代理methods方法
    this._proxyMethods(vm.$options.methods)
  }
  _proxyData(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this.$vm, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newVal) {
          if (newVal === data[key]) {
            return
          }
          data[key] = newVal
        }
      })
    })
  }
  _proxyComputed(computed) {
    for (let key in computed) {
      Object.defineProperty(this.$vm, key, {
        get(params) {
          return computed[key].call(this.$vm, params)
        }
      })
    }
  }
  _proxyMethods(methods) {
    for (let key in methods) {
      Object.defineProperty(this.$vm, key, {
        get() {
          return methods[key]
        }
      })
    }
  }
}