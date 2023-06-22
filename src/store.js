import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
<<<<<<< HEAD
      checkboxValue: false,
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
=======
      checkboxValue: sessionStorage.getItem("checkboxValue") === "true",
      isLoggedIn: sessionStorage.getItem("isLoggedIn") === "true",
>>>>>>> 2e4759bb01b00650cbddad14001b60989f1637b6
    };
  },
  mutations: {
    toggleCheckboxValue(state) {
      state.checkboxValue = !state.checkboxValue;
    },
    setCheck(state, value) {
      state.checkboxValue = value;
      sessionStorage.setItem("checkboxValue", value.toString());
    },
    setLoggedIn(state, value) {
      state.isLoggedIn = value;
<<<<<<< HEAD
      localStorage.setItem('isLoggedIn', value.toString());
=======
      sessionStorage.setItem("isLoggedIn", value.toString());
>>>>>>> 2e4759bb01b00650cbddad14001b60989f1637b6
    },
  },
});

export default store;
