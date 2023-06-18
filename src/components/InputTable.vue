<template>
    <div>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre Artículo</th>
              <th>Cantidad formato entrada</th>
              <th>Cantidad formato salida</th>
              <th>Factor de conversión</th>
              <th>Bodega</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.code }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.inputUnits }}</td>
              <td>{{ product.outputUnits }}</td>
              <td>{{ product.conversionFactor }}</td>
              <td>{{ product.warehouse }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'InventoryTable',
    props: {
      products: {
        type: Array,
        required: true
      }
    }, 
    mounted() {
      this.$state.navbarTitle = 'Tabla de entradas';
    },
  };
  </script>
  
  <style scoped>
  @media (max-width: 767.98px) {
    .table-responsive {
      overflow-x: auto;
    }
  }
  </style>
  