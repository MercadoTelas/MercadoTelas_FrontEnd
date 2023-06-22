import { createStore } from "vuex";


const store = createStore({
  state() {
    return {
      checkboxValue: sessionStorage.getItem("checkboxValue") === "true",
      isLoggedIn: sessionStorage.getItem("isLoggedIn") === "true",
    };
  },
  mutations: {
    toggleCheckboxValue(state) {
      state.checkboxValue = !state.checkboxValue;
    },
    setLoggedIn(state, value) {
      state.isLoggedIn = value;
      sessionStorage.setItem("isLoggedIn", value.toString());
    },
  },
});

export default store;
