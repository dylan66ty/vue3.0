import { inject } from 'vue'
export const storeKey = 'store'

export function useStore(injectKey) {
  return inject(injectKey || storeKey)
}