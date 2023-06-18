// store.js

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    navbarTitle: '',
  },
  mutations: {
    updateNavbarTitle(state, newTitle) {
      state.navbarTitle = newTitle;
    },
  },
});

export default store;
