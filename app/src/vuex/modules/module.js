import { forEach } from "../util"

class Module {
  constructor(rawModule) {
    this._raw = rawModule
    this.state = rawModule.state
    this._children = {}
    this.namespaced = rawModule.namespaced
  }
  addChild(key, module) {
    this._children[key] = module
  }
  getChild(key) {
    return this._children[key]
  }
  forEachChild(fn) {
    forEach(this._children, fn)
  }
  forEachGetters(fn) {
    if (this._raw.getters) {
      forEach(this._raw.getters, fn)
    }
  }
  forEachMutation(fn) {
    if (this._raw.mutations) {
      forEach(this._raw.mutations, fn)
    }
  }
  forEachAction(fn) {
    if (this._raw.actions) {
      forEach(this._raw.actions, fn)
    }
  }
}

export default Module