<template>
  <div class="container">
    <form @submit.prevent="onBrandCreate">
      <div class="form-group mt-4">
        <label for="brandName">Ingrese el nombre de la marca:</label>
        <input type="text" class="form-control" id="brand" name="brand" v-model="name">
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary" type="submit">Guardar cambios</button>
        <router-link to="/brands" class="btn btn-danger">Cancelar</router-link>
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
      name: ''
    };
  },
  methods: {
    onBrandCreate() {
      const brand = {
        brand: {
          name: this.name
        }
      };
      axios.post(API_URL + '/brands', brand).then(response => {
        Swal.fire({
          title: 'Marca creada exitosamente',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
        console.log(response);
        this.$router.go(-1);
      }).catch(error => {
        Swal.fire({
          title: 'Error al crear la marca',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        });
        console.log(error);
      });
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Agregar Nueva Marca';
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
  