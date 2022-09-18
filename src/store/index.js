import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate"

export default createStore({
  state: {
    'host': 'http://124.222.158.8:9999/api',
    'token': '',
    'admin': {
      'id': '',
      'name': '',
      'studentId': '',
      'type': ''
    },

  },
  getters: {
  },
  mutations: {
    setToken(state, _token) {
      state.token = _token;
    },
    setAdmin(state, data) {
      state.admin = {
        id: data.id,
        name: data.name,
        studentId: data.studentId,
        type: data.type
      };
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [
      createPersistedState({
        storage: window.sessionStorage
      })
  ]
})
