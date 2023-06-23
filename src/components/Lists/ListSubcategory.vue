<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="mb-3">
          <label for="search" class="form-label">Buscar subcategoría:</label>
          <input type="text" id="search" class="form-control" v-model="searchQuery" placeholder="Buscar por nombre o categoría">
        </div>

        <div class="row">
          <div class="col-md-12">
            <button @click="addSubcategory" class="btn btn-success">Agregar subcategoría</button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-striped table-responsive">
            <thead>
            <tr>
              <th class="text-center">Nombre de Subcategoría</th>
              <th class="text-center">Categoría asociada</th>
              <th class="text-center">Acciones</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="subcategory in filteredSubcategories" :key="subcategory.id">
              <td class="text-center">{{ subcategory.name }}</td>
              <td class="text-center">{{ subcategory.category.name }}</td>
              <td class="text-center">
                <button @click="editSubcategory(subcategory)" class="btn btn-secondary">Editar subcategoría</button>
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
      subcategories: [],
      searchQuery: '',
    };
  },
  computed: {
    filteredSubcategories() {
      return this.subcategories.filter((subcategory) => {
        return (
            subcategory.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            subcategory.category.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    },
  },
  methods: {
    addSubcategory() {
      // Redirigir a la vista de agregar subcategoría
      this.$router.push({ name: 'AddSubcategory' });
    },
    editSubcategory(subcategory) {
      // Redirigir a la vista de editar subcategoría
      this.$router.push({ name: 'EditSubcategory', params: { id: subcategory.id } });
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
          this.subcategories = this.subcategories.filter((s) => s.id !== subcategory.id);

          Swal.fire({
            title: 'Eliminada',
            text: 'La subcategoría ha sido eliminada correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Lista de Subcategorías';
    // Obtener todas las subcategorías desde la API
    axios
        .get(API_URL + '/subcategories')
        .then((response) => {
          this.subcategories = response.data;
        })
        .catch((error) => {
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
