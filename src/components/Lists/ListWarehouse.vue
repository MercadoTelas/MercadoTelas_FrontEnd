<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="mb-3">
          <label for="search" class="form-label">Buscar bodega:</label>
          <input type="text" id="search" class="form-control" v-model="searchQuery" placeholder="Buscar por nombre">
        </div>

        <div class="row">
          <div class="col-md-12">
            <button @click="addWarehouse" class="btn btn-success">Agregar bodega</button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Nombre de Bodega</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="warehouse in filteredWarehouses" :key="warehouse.name">
                <td>{{ warehouse.name }}</td>
                <td>{{ warehouse.address }}</td>
                <td>
                  <button @click="viewWarehouse(warehouse)" class="btn btn-primary">Ver bodega</button>
                  <button @click="deleteWarehouse(warehouse)" class="btn btn-danger">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from "@/config";

export default {
  name: 'WarehouseList',
  data() {
    return {
      warehouses: [
        { name: 'Bodega 1' },
        { name: 'Bodega 2' },
        { name: 'Bodega 3' },],
      searchQuery: '',
    };
  },
  computed: {
    filteredWarehouses() {
      return this.warehouses.filter((warehouse) => {
        return (
          warehouse.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          warehouse.address.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    }
  },
  methods: {
    addWarehouse() {
      // Lógica para agregar una nueva bodega
      // ...
    },
    viewWarehouse(/*warehouse*/) {
      // Lógica para ver los detalles de una bodega
      // ...
    },
    deleteWarehouse(/*warehouse*/) {
      // Lógica para eliminar una bodega
      // ...
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Lista de Bodegas';
    // Obtener todas las bodegas desde la API
    axios.get(API_URL + '/warehouses').then(response => {
      this.warehouses = response.data;
    }).catch(error => {
      console.log(error);
    });
  },
};
</script>

<style>
.container {
  padding-top: 20px;
  padding-bottom: 20px;
}

.text-primary {
  color: #007bff;
}

.table {
  margin-top: 20px;
}

.table th,
.table td {
  padding: 8px;
  vertical-align: middle;
}

.table th {
  background-color: #f2f2f2;
}

@media (max-width: 576px) {
  .table-responsive {
    overflow-x: auto;
  }
}
</style>
