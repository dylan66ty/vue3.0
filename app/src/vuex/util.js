export const forEach = (obj, fn) => {
  Object.keys(obj).forEach((key, index) => fn(obj[key], key, index))
}


export const isPromise = (val) => {
  return val && typeof val.then === 'function'
}