<template>
  <div class="container">
    <form @submit.prevent="onCategoryCreate">
      <div class="form-group mt-4">
        <label for="categoryName">Ingrese el nombre de la categoría:</label>
        <input type="text" class="form-control" id="category" name="category" v-model="name">
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
import { API_URL } from '@/config'

export default {
  data() {
    return {
      name: ''
    };
  },
  methods: {
    onCategoryCreate() {
      const category = {
        category: {
          name: this.name
        }
      };
      axios.post(API_URL + '/categories', category).then(response => {
        Swal.fire({
          title: 'Categoría creada exitosamente',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
        console.log(response);

      }).catch(error => {
        // Show error message
        Swal.fire({
          title: 'Error al crear la categoría',
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
  },
  mounted() {
    this.$state.navbarTitle = 'Agregar Nueva Categoría';
  },
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
