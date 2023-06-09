<template>
    <div class="container">
      <h2 class="text-center mt-3">Agregar Nuevo Diseño</h2>
      <form @submit.prevent="onCreateDesign">
        <div class="form-group mt-4">
          <label for="designName">Ingrese el nombre del diseño:</label>
          <input type="text" class="form-control" id="design" v-model="name">
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
      onCreateDesign() {
        const design = {
          design: {
            name: this.name
          }
        };
        axios.post(API_URL + '/designs', design).then(response => {
          if(response.status === 200){
            Swal.fire({
              title: 'Diseño creado exitosamente',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            });
            this.$router.push('/designs');
          } else {
            Swal.fire({
              title: 'Error al crear el diseño',
              icon: 'error',
              showConfirmButton: false,
              timer: 1500
            });
          }
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
  