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
            <button @click="addSubcategory" class="btn btn-success">Agregar subcategoría</button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Nombre de Subcategoría</th>
                <th>Categoría asociada</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subcategory in filteredSubcategories" :key="subcategory.name">
                <td>{{ subcategory.name }}</td>
                <td>{{ getCategoryName(subcategory.parentCategoryId) }}</td>
                <td>
                  <button @click="viewSubcategory(subcategory)" class="btn btn-primary">Ver subcategoría</button>
                  <button @click="deleteSubcategory(subcategory)" class="btn btn-danger">Eliminar</button>
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
import Swal from 'sweetalert2';
import axios from "axios";
import { API_URL } from "@/config";

export default {
  name: 'SubcategoryList',
  data() {
    return {
      subcategories: [
          { name: 'Subcategory 1', parentCategoryId: 1 },
          { name: 'Subcategory 2', parentCategoryId: 2 },
          { name: 'Subcategory 3', parentCategoryId: 1 },
        ],
        categories: [
          { id: 1, name: 'Category 1' },
          { id: 2, name: 'Category 2' },
          { id: 3, name: 'Category 3' },
        ],
        searchQuery: '',
    };
  },
  computed: {
    filteredSubcategories() {
      if (this.searchQuery === '') {
        return this.subcategories;
      } else {
        const filteredSubcategories = new Set();
        const lowercaseQuery = this.searchQuery.toLowerCase();
        
        this.subcategories.forEach(subcategory => {
          const subcategoryName = subcategory.name.toLowerCase();
          const parentCategory = this.categories.find(category => category.id === subcategory.parentCategoryId);
          const parentCategoryName = parentCategory ? parentCategory.name.toLowerCase() : '';

          if (subcategoryName.includes(lowercaseQuery) || parentCategoryName.includes(lowercaseQuery)) {
            filteredSubcategories.add(subcategory);
          }
        });

        return Array.from(filteredSubcategories);
      }
    },
  },
  methods: {
    addSubcategory() {
      // Lógica para agregar una nueva subcategoría
      // ...
    },
    viewSubcategory(/*subcategory*/) {
      // Lógica para ver los detalles de una subcategoría
      // ...
    },
    deleteSubcategory(subcategory) {
      // Lógica para eliminar una subcategoría
      Swal.fire({
        title: '¿Estás seguro?',
        text: `Se eliminará la subcategoría ${subcategory.name}. Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Lógica para eliminar la subcategoría aquí
          // ...

          Swal.fire({
            title: 'Eliminada',
            text: 'La subcategoría ha sido eliminada correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : '';
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Lista de Subcategorías';
    // Obtener todas las subcategorías desde la API
    axios.get(API_URL + '/subcategories').then(response => {
      this.subcategories = response.data;
    }).catch(error => {
      console.log(error);
    });

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
