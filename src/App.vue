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
import InventoryTable from './components/InventoryTable.vue';

export default {
  name: 'App',
  components: {
    sidebar,
    navbar,
  }
};
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
