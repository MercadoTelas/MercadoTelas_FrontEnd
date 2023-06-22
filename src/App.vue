<template>
  <div v-if="isLoggedIn">
    <navbar></navbar>
    <sidebar></sidebar>
  </div>
  <router-view @vue:mounted="checkLoggedIn()"></router-view>
</template>

<script>
import sidebar from "./components/Side-bar.vue";
import navbar from "./components/Nav-bar.vue";
import { useStore } from "vuex";

export default {
  name: "App",
  components: {
    sidebar,
    navbar,
  },

  data() {
    return {
      username: "",
      password: "",
    };
  },
  mounted() {
    const store = useStore();
    console.log(store.state.isLoggedIn); // Ejemplo de uso de la variable store
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
  },

  methods: {
    checkLoggedIn() {
      if (this.$store.state.isLoggedIn == false) {
        this.$router.push('/login');
      }
    }
  },
};

//Validación login
<<<<<<< HEAD

=======
>>>>>>> 2e4759bb01b00650cbddad14001b60989f1637b6
</script>

<style>
.content {
  margin-left: 250px;
  padding: 20px;
}

@media (max-width: 767.98px) {
  .content {
    margin-left: 0;
  }
}
</style>
