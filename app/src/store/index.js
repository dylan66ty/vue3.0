import { createStore } from '@/vuex'


function customPlugin(store) {
  let local = localStorage.getItem('VUEX:STATE')
  if (local) {
    store.replaceState(JSON.parse(local))
  }
  store.subscribe((mutation, state) => {
    localStorage.setItem('VUEX:STATE', JSON.stringify(state))
  })
}

const store = createStore({
  plugins: [
    customPlugin
  ],
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
    // a: {
    //   namespaced: true,
    //   state: {
    //     count: 0
    //   },
    //   mutations: {
    //     ADD(state, value) {
    //       state.count += value
    //     }
    //   },
    //   modules: {
    //     aa: {
    //       namespaced: true,
    //       state: {
    //         count: 0
    //       },
    //       mutations: {
    //         ADD(state, value) {
    //           state.count += value
    //         }
    //       }
    //     }
    //   }
    // },
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


// store.registerModule(['a'], {
//   namespaced: true,
//   state: {
//     count: 100
//   },
//   mutations: {
//     ADD(state, payload) {
//       state.count += payload
//     }
//   }
// })

export default store


