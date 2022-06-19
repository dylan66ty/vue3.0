import { storeKey } from './injectKey'
import { reactive } from 'vue'
import { forEach } from './util.js'

class Store {
  constructor(options) {
    // vuex3 new Vue
    // vuex4 reactive
    const store = this
    // repaceState 可以直接 store._state.data = {}重新赋值
    store._state = reactive({ data: options.state })

    store.getters = {}
    const _getters = options.getters
    forEach(_getters, (fn, key) => {
      Object.defineProperty(store.getters, key, {
        enumerable: true,
        // vuex3 使用的是computed
        // vue3.1有个问题 组件销毁时会移除计算属性 
        // vue3.2会修复这个问题
        get: () => fn(store.state)
      })
    })

    // mutations {ADD(){}}
    // actions {asyncAdd(){}}

    store._mutations = Object.create(null)
    store._actions = Object.create(null)

    const _mutations = options.mutations
    const _actions = options.actions

    forEach(_mutations, (mutation, key) => {
      store._mutations[key] = (payload) => {
        mutation.call(store, store.state, payload)
      }
    })

    forEach(_actions, (action, key) => { // Promise.all
      store._actions[key] = (payload) => {
        action.call(store, store, payload)
      }
    })

  }
  commit = (type, payload) => { // 编译 bind
    const store = this
    store._mutations[type](payload)

  }
  dispatch = (type, payload) => {
    const store = this
    store._actions[type](payload)
  }
  get state() {
    return this._state.data
  }
  install(app, injectKey) { //createApp().use(store,'my')
    // this指向stroe的实例
    app.provide(injectKey || storeKey, this)
    // 增加$store属性
    app.config.globalProperties.$store = this
  }

}


export default Store