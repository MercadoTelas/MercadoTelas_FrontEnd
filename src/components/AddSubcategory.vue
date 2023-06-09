<template>
  <div class="container">
    <h2 class="text-center mt-3">Agregar Nueva Subcategoría</h2>
    <form @submit.prevent="onCreateSubcategory">
      <div class="form-group mt-4">
        <label for="subCategoryName">Ingrese el nombre de la subcategoría:</label>
        <input type="text" class="form-control" id="subcategory" v-model="name">
      </div>
      <div class="form-group mt-4">
        <label for="category">Seleccione la categoría a la que se asociará esta subcategoría:</label>
        <select class="form-control" id="category" v-model="category">
          <option value="" disabled selected>Seleccione una categoría</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
      </div>
      <div class="buttons-container mb-3 mr-3">
        <button class="btn btn-primary mr-2" type="submit">Guardar</button>
        <button class="btn btn-danger" @click="cancel">Cancelar</button>
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
      categories: []
    };
  },
  mounted() {
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
        // Show error message
        Swal.fire({
          title: 'Error al crear la subcategoría',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        });
        // Shows why the error was thrown using sweetalert2
        const errors = error.response.data;
        console.log(errors);
      });
    },
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.buttons-container {
  position: absolute;
  right: 20px;
  bottom: 20px;
  padding: 100px;
}

.buttons-container button {
  margin-left: 10px;
}
</style>
  