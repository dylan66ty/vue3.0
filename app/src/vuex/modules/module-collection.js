import Module from './module'
import { forEach } from '../util'
class ModuleCollection {
  constructor(rootModule) {
    this.root = null
    this.register(rootModule, [])
  }
  register(rawModule, path) {
    const newModule = new Module(rawModule)
    if (path.length === 0) {
      this.root = newModule
    } else {
      // path ['a','aa','aaa'] -> aa {} getChild 
      const parent = path.slice(0, -1).reduce((module, current) => {
        return module.getChild(current)
      }, this.root)
      parent.addChild(path[path.length - 1], newModule)
    }


    if (rawModule.modules) {
      forEach(rawModule.modules, (rawChildModule, key) => {
        this.register(rawChildModule, path.concat(key))
      })

    }
    return newModule
  }
  getNamespaced(path) {
    let module = this.root
    return path.reduce((namespaceStr, key) => {
      module = module.getChild(key)
      return namespaceStr + (module.namespaced ? key + '/' : '')
    }, '')

  }

}



// 格式化用户的参数 
/**
 *  root = {
 *      _raw:rootModule,
 *      state:rootModule.state,
 *      _children: {
 *          a: {
 *            _raw:aModule,
 *            state:aModule.state,
 *            _chilren: {
 *                c : {...}
 *             } 
 *         }
 *      }
 * }
 * 
 * 
 */


export default ModuleCollection