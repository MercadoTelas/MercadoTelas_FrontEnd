import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      checkboxValue: false,
      isLoggedIn: false,
    };
  },
  mutations: {
    toggleCheckboxValue(state) {
      state.checkboxValue = !state.checkboxValue;
    },
    setLoggedIn(state, value) {
      state.isLoggedIn = value;
    },
  },
});

export default store;
