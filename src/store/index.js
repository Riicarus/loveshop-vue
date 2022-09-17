import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate"

export default createStore({
  state: {
    'host': 'http://192.168.43.18:9000',
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
