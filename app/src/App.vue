<template>
  <div>
    <h1>computedCount {{ computedCount }}</h1>
    <h1>state {{ $store.state.count }}</h1>
    <button @click="$store.state.count += 1">错误的状态修改</button>
    <h1>getters {{ $store.getters.count1 }}</h1>
    <h1>computedGetters {{ computedGetters }}</h1>
    <button @click="mutataionHandler">mutation</button>
    <button @click="actionHandler">action</button>
    <div>模块</div>
    <h1>a {{ aCount }}</h1>
    <h1>b {{ bCount }}</h1>
    <button @click="$store.commit('a/ADD', 1)">改A</button>
    <button @click="$store.commit('b/ADD', 2)">改B</button>
  </div>
</template>


<script>
import { useStore } from '@/vuex'
import { computed } from 'vue'

const useCount = () => {
  const store = useStore()

  const mutataionHandler = () => {
    store.commit('ADD', 10)
  }

  const actionHandler = () => {
    store.dispatch('asyncAdd', 20)
  }

  return {
    mutataionHandler,
    actionHandler
  }
}

export default {
  setup() {
    const store = useStore()
    return {
      computedCount: computed(() => store.state.count),
      computedGetters: computed(() => store.getters.count1),
      ...useCount(),
      aCount: computed(() => store.state.a.count),
      bCount: computed(() => store.state.b.count)
    }
  }
}
</script>

<style>
</style>
