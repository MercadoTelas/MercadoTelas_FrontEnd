<template>
  <div>
    <navbar></navbar>
    <sidebar></sidebar>
    <router-view></router-view>
  </div>
</template>

<script>
import sidebar from './components/Side-bar.vue';
import navbar from './components/Nav-bar.vue';

export default {
  name: 'App',
  components: {
    sidebar,
    navbar,
  }
}
</script>

