<template>
  <div class="container">
    <form @submit.prevent="onCreateSubcategory">
      <div class="table-responsive">
        <table class="table table-bordered">
          <tbody>
            <tr>
              <td class="table-label">Ingrese el nombre de la subcategoría:</td>
              <td class="table-input">
                <input type="text" class="form-control" id="subcategory" v-model="name" :disabled="isReadOnly">
              </td>
            </tr>
            <tr>
              <td class="table-label">Seleccione la categoría a la que se asociará esta subcategoría:</td>
              <td class="table-input">
                <select class="form-control" id="category" v-model="category" :disabled="isReadOnly">
                  <option value="" disabled selected>Seleccione una categoría</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary" type="submit" v-if="!isReadOnly">Guardar cambios</button>
        <router-link to="/subcategories" class="btn btn-danger">Cancelar</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from "sweetalert2";
import {API_URL} from '@/config'

export default {
  data() {
    return {
      name: '',
      category: '',
      categories: [],
      isReadOnly: false
    };
  },
  mounted() {
    this.$state.navbarTitle = 'Agregar Nueva Subcategoría';
    axios.get(API_URL + '/categories').then(response => {
      this.categories = response.data;
    }).catch(error => {
      console.log(error);
    });
  },
  methods: {
    onCreateSubcategory() {
      const subcategory = {
        subcategory: {
          name: this.name,
          category_id: this.category
        }
      };
      axios.post(API_URL + '/subcategories', subcategory).then(response => {
        Swal.fire({
          title: 'Subcategoría creada exitosamente',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
        console.log(response);
      }).catch(error => {
        Swal.fire({
          title: 'Error al crear la subcategoría',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        });
        const errors = error.response.data;
        console.log(errors);
      });
    },
  }, 
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.table {
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
}

.table-bordered {
  border-collapse: collapse;
  border-color: #dee2e6;
}

.table-label {
  width: 50%;
  vertical-align: middle;
  border-color: #dee2e6;
  padding: 0.75rem;
}

.table-input {
  vertical-align: middle;
  border-color: #dee2e6;
  padding: 0.75rem;
}
</style>