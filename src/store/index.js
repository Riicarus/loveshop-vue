import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate"

export default createStore({
  state: {
    'host': 'http://124.222.158.8:9999/api',
    //'host': 'http://192.168.43.18:9090',
    'token': '',
    'admin': {
      'id': '',
      'name': '',
      'studentId': '',
      'type': ''
    },
    'ISBN_API_KEY': [
        "13586.4d614a9918b1c682e60703790c7a4c15.ca50cafb6d5db303eecf1e4c1d720941",
        "13553.a1dc12ba4903dc9d12c72d9a2b6c4be2.c521e2db6ac2ee389f26b62a714d16b4"
    ],
    'ISBN_API_KEY_INDEX': 1
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
    },
    setIndex(state, index) {
      state.ISBN_API_KEY_INDEX = index;
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
