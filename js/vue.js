class Vue {
  constructor(options) {
    //保存选项的数据
    this.$options = options || {}
    this.$data = options.data || {}
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

    //代理数据
    new ProxyData(this)

    //数据劫持,把数据定义为响应式的,检测数据的变化
    new Observer(this.$data)

    //编译模板
    new Compiler(this)
  }
}