<template>
  <div>
    <navbar></navbar>
    <sidebar></sidebar>
    <div class="content">
      <h1 class="mb-4">Inventario</h1>
      <InventoryTable :products="products"></InventoryTable>
    </div>
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
    InventoryTable
  },
  data() {
    return {
      movements: [
        { id: 1, date: '2023-06-01', description: 'Movimiento 1', warehouse: 'Bodega A' },
        { id: 2, date: '2023-06-02', description: 'Movimiento 2', warehouse: 'Bodega B' },
        { id: 3, date: '2023-06-03', description: 'Movimiento 3', warehouse: 'Bodega A' },
        // Agrega más objetos de movimiento según tu estructura de datos
      ],
      products: [
        {
          id: 1,
          code: '001',
          name: 'Producto 1',
          inputUnits: 10,
          outputUnits: 5
        },
        {
          id: 2,
          code: '002',
          name: 'Producto 2',
          inputUnits: 20,
          outputUnits: 8
        },
        // Agrega más objetos de prueba según sea necesario
      ]
    };
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
