import { createStore } from '@/vuex'

export default createStore({
  state: {
    count: 0
  },
  getters: {
    count1(state) {
      return state.count + 10
    }

  },
  mutations: {
    ADD(state, value) {
      state.count += value
    },
    DECREASE(state, value) {
      state.count -= value
    }
  },
  actions: {
    asyncAdd({ commit, dispatch }, payload) {
      setTimeout(() => {
        commit('ADD', payload)
      }, 1000);
    }
  },
  modules: {
    a: {
      namespaced: true,
      state: {
        count: 0
      },
      mutations: {
        ADD(state, value) {
          state.count += value
        }
      }
    },
    b: {
      namespaced: true,
      state: {
        count: 0
      },
      mutations: {
        ADD(state, value) {
          state.count += value
        }
      }
    }

  },
  strict: true
})
