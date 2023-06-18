import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      checkboxValue: false,
    };
  },
  mutations: {
    toggleCheckboxValue(state) {
      state.checkboxValue = !state.checkboxValue;
    },
  },
});

export default store;
