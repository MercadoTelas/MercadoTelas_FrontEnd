<template>
    <div class="container">
      <form @submit.prevent="onCreateWarehouse">
        <div class="form-group mt-4">
          <label for="warehouseName">Ingrese el nombre de la bodega:</label>
          <input type="text" class="form-control" id="warehouse" name="warehouse" v-model="name">
        </div>
        <div class="d-flex justify-content-end">
          <button class="btn btn-primary" type="submit">Guardar cambios</button>
          <router-link to="/warehouses" class="btn btn-danger">Cancelar</router-link>
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
      onCreateWarehouse(){
        const warehouse = {
          warehouse: {
            name: this.name
          }
        };
        axios.post(API_URL + '/warehouses', warehouse).then(response => {
          Swal.fire({
            title: 'Bodega creada exitosamente',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
          console.log(response);
        }).catch(error => {
          Swal.fire({
            title: 'Error al crear la bodega',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          });
          console.log(error.response.data);
        });
      },
    }, 
    mounted() {
      this.$state.navbarTitle = 'Agregar Nueva Bodega';
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
  