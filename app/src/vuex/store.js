import { storeKey } from './injectKey'
import { reactive, watch } from 'vue'
import { forEach, isPromise } from './util.js'
import ModuleCollection from './modules/module-collection'

// 根据路径获取store上的最新状态
const getNestedState = (store, path) => {
  return path.reduce((state, key) => state[key], store.state)
}

// 递归安装模块
const installModule = (store, rootState, path, module) => {
  let isRoot = !path.length

  const namespaced = store._modules.getNamespaced(path)

  if (!isRoot) {
    let parentState = path.slice(0, -1).reduce((state, key) => state[key], rootState)
    parentState[path[path.length - 1]] = module.state
  }

  // _wrappedGettes:{getter(){}}
  module.forEachGetters((getter, key) => {
    store._wrappedGetters[namespaced + key] = () => {
      return getter(getNestedState(store, path)) // 如果直接使用模块上的状态 不是响应式的
    }
  })

  // _mutation:{ADD:[fn,fn]}
  module.forEachMutation((mutation, key) => {
    const entry = store._mutations[namespaced + key] || (store._mutations[namespaced + key] = [])
    entry.push((payload) => {
      mutation.call(store, getNestedState(store, path), payload)
    })
  })

  // action执行后返回的是一个promise
  module.forEachAction((action, key) => {
    const entry = store._actions[namespaced + key] || (store._actions[namespaced + key] = [])
    entry.push((payload) => {
      const res = action.call(store, store, payload)
      if (!isPromise(res)) return Promise.resolve(res)
      return res
    })
  })

  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child)
  })
}

const enableStrictMode = (store) => {
  watch(() => store._state.data, () => {
    console.assert(store._commiting, '不能在mutation之外的handler修改状态')

  }, { deep: true, flush: 'sync' }) // 默认watch是异步的。这里改成同步监控。
}

const resetStoreState = (store, state) => {
  store._state = reactive({ data: state })
  const wrappedGetters = store._wrappedGetters
  store.getters = Object.create(null)
  forEach(wrappedGetters, (getter, key) => {
    Object.defineProperty(store.getters, key, {
      enumerable: true,
      get: getter
    })
  })

  if (store.strict) {
    enableStrictMode(store)
  }
}

class Store {
  _withCommit(fn) {
    const commiting = this._commiting
    this._commiting = true
    fn()
    this._commiting = commiting
  }
  constructor(options) {
    const store = this
    store._modules = new ModuleCollection(options)
    store._mutations = Object.create(null)
    store._actions = Object.create(null)
    store._wrappedGetters = Object.create(null)


    this.strict = options.strict || false
    this._commiting = false



    // 定义状态
    const state = store._modules.root.state
    installModule(store, state, [], store._modules.root)
    // 定义响应式数据
    resetStoreState(store, state)
  }

  get state() {
    return this._state.data
  }

  commit = (type, payload) => {
    const entry = this._mutations[type] || []
    this._withCommit(() => entry.forEach(handler => handler(payload)))

  }
  dispatch = (type, payload) => {
    const entry = this._actions[type] || []
    return Promise.all(entry.map(handler => handler(payload)))
  }

  install(app, injectKey) { //createApp().use(store,'my')
    // this指向stroe的实例
    app.provide(injectKey || storeKey, this)
    // 增加$store属性
    app.config.globalProperties.$store = this
  }

}




export default Store