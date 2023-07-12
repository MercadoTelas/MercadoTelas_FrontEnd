import { createStore } from "vuex";

const store = createStore({
    state() {
        const checkboxValue = localStorage.getItem("checkboxValue") === "true";
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const currentWarehouseLoggedId = localStorage.getItem("current_warehouse_logged_id") || "";
        const sessionTimeout = 600000;
        const sessionToken = localStorage.getItem("sessionToken") || "";
        const LogAttempts = localStorage.getItem("LogAttempts") === "true";
        let user = null;

        try {
            user = JSON.parse(localStorage.getItem("user"));
        } catch (error) {
            console.error("Error parsing 'user' from localStorage:", error);
        }

        return {
            checkboxValue,
            isLoggedIn,
            currentWarehouseLoggedId,
            sessionTimeout,
            sessionToken,
            LogAttempts,
            user,
            selectedItems: [],
        };
    },
    mutations: {
        toggleCheckboxValue(state) {
            state.checkboxValue = !state.checkboxValue;
        },
        setCheck(state, value) {
            state.checkboxValue = value;
            localStorage.setItem("checkboxValue", value.toString());
        },
        setLoggedIn(state, value) {
            state.isLoggedIn = value;
            localStorage.setItem("isLoggedIn", value.toString());
        },
        setSessionToken(state, value) {
            state.sessionToken = value;
            localStorage.setItem("sessionToken", value.toString());
        },
        setLogAttempt(state, value) {
            state.LogAttempts = value;
        },
        setUser(state, value) {
            state.user = value;
            localStorage.setItem("user", JSON.stringify(value));
        },
        setCurrentWarehouseLoggedId(state, value) {
            state.currentWarehouseLoggedId = value;
            localStorage.setItem("current_warehouse_logged_id", value);
        },
        setSelectedItems(state, items) {
            state.selectedItems = items;
        },
    }
});

export default store;
