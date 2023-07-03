<template>
    <div class="container">
      <form @submit.prevent="onCreateDesign">
        <div class="form-group mt-4">
          <label for="designName">Ingrese el nombre del diseño:</label>
          <input type="text" class="form-control" id="design" v-model="name">
        </div>
        <div class="d-flex justify-content-end">
          <button class="btn btn-primary" type="submit">Guardar cambios</button>
          <router-link to="/designs" class="btn btn-danger">Cancelar</router-link>
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
        let design = {
          design: {
            name: this.name
          }
        };
        design.user = this.$store.state.user.id;
        const errors = [];
        axios.post(API_URL + '/designs', design).then(response => {
          Swal.fire({
            title: 'Diseño creado exitosamente',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
          console.log(response);
          this.$router.go(-1);
        }).catch(error => {
          Swal.fire({
            title: 'Error al crear el diseño',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          });
          errors.push(error.messages);
          console.log(error);
        });
      },
    }, 
    mounted() {
      this.$state.navbarTitle = 'Agregar Nuevo Diseño';
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
  