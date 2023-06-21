<template>

  <div v-if="isLoggedIn">
    <navbar></navbar>
    <sidebar></sidebar>
  </div>
  <router-view></router-view>
</template>

<script>
import sidebar from './components/Side-bar.vue';
import navbar from './components/Nav-bar.vue';
import { useStore } from 'vuex';

export default {

  name: 'App',
  components: {
    sidebar,
    navbar,
  },

  data() {
    return {
      username: '',
      password: '',
    };
  },

  mounted() {
    const store = useStore();
    console.log(store.state.isLoggedIn); // Ejemplo de uso de la variable store
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    }
  },

  methods: {
  },
};

//Validación login




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
