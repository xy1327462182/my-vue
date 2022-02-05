class Compiler {
  constructor(vm) {
    this.$vm = vm
    this.el = vm.$el
    let fragment = this.node2fragment(vm.$el)
    this.compile(fragment)
    this.el.appendChild(fragment)
  }
  node2fragment(node) {
    let fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = node.firstChild) {
      fragment.appendChild(firstChild)
    }
    return fragment
  }
  compile(el) {
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        this.compileElement(node)
      }
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }
  compileText(node) {
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.$vm[key])
      //实例化一个观察者
      new Watcher(this.$vm, key, (newVal) => {
        node.textContent = newVal
      })
    }
  }
  compileElement(node) {
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        attrName = attrName.substr(2)
        let eventName = ''
        if (this.isEventDirective(attrName)) {
          [attrName, eventName] = attrName.split(":")
        }
        let key = attr.value
        this.update(node, key, attrName, eventName)
      }
    })
  }
  update(node, key, attrName, eventName) {
    let updateFn = this[attrName + 'Updater']
    updateFn && updateFn.call(this, node, this.$vm[key], key, eventName)
  }
  //v-text
  textUpdater(node, value, key) {
    node.textContent = value
    //实例化一个观察者
    new Watcher(this.$vm, key, (newVal) => {
      node.textContent = newVal
    })
  }
  //v-model
  modelUpdater(node, value, key) {
    node.value = value
    new Watcher(this.$vm, key, (newVal) => {
      node.value = newVal
    })
    // 双向绑定
    node.addEventListener('input', () => {
      this.$vm[key] = node.value
    })
  }
  //v-html
  htmlUpdater(node, value, key) {
    node.innerHTML = value
    new Watcher(this.$vm, key, (newValue) => {
      node.innerHTML = newValue
    })
  }
  //v-on
  onUpdater(node, value, key, eventName) {
    node.addEventListener(eventName, value.bind(this.$vm))
  }
  //判断文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
  //判断元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
  //是否指令
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  //是否事件指令
  isEventDirective(attrName) {
    return attrName.indexOf(':') !== -1
  }
}