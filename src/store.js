import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      checkboxValue: false,
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    };
  },
  mutations: {
    toggleCheckboxValue(state) {
      state.checkboxValue = !state.checkboxValue;
    },
    setLoggedIn(state, value) {
      state.isLoggedIn = value;
      localStorage.setItem('isLoggedIn', value.toString());
    },
  },
});

export default store;
