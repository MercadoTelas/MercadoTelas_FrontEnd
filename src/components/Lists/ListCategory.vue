<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="mb-3">
          <label for="search" class="form-label">Buscar categoría:</label>
          <input type="text" id="search" class="form-control" v-model="searchQuery" placeholder="Buscar por nombre">
        </div>
        <div class="row">
          <div class="col-md-12">
            <button @click="addCategory" class="btn btn-success">Agregar categoría</button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-striped table-responsive">
            <thead>
            <tr>
              <th class="text-center">Nombre de Categoría</th>
              <th class="text-center">Acciones</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="category in filteredCategories" :key="category.name">
              <td class="text-center">{{ category.name }}</td>
              <td class="text-center">
                <button @click="viewCategory(category)" class="btn btn-primary">Ver categoría</button>
                <button @click="deleteCategory(category)" class="btn btn-danger">Eliminar</button>
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
import Swal from 'sweetalert2';

export default {
  name: 'CategoryList',
  data() {
    return {
      categories: [
        { name: 'Category 1' },
        { name: 'Category 2' },
        { name: 'Category 3' },
      ],
      searchQuery: '',
    };
  },
  computed: {
    filteredCategories() {
      return this.categories.filter((category) => {
        return category.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  },
  methods: {
    addCategory() {
      // Lógica para agregar una nueva categoría
      // ...
    },
    viewCategory(/*category*/) {
      // Lógica para ver los detalles de una categoría
      // ...
    },
    deleteCategory(category) {
      // Lógica para eliminar una categoría
      Swal.fire({
        title: '¿Estás seguro?',
        text: `Se eliminará la categoría ${category.name}. Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Lógica para eliminar la categoría aquí
          // ...

          Swal.fire({
            title: 'Eliminado',
            text: 'La categoría ha sido eliminada correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Lista de Categorías';
    // Obtener todas las categorías desde la API
    axios.get(API_URL + '/categories').then(response => {
      this.categories = response.data;
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
