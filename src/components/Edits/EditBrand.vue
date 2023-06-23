<template>
  <div class="container">
    <div class="row">
      <form @submit.prevent="updateBrand()">
        <div class="col-md-8">
          <h2>Editar Marca</h2>
          <div class="form-group">
            <label for="name">Nombre de la marca:</label>
            <input type="text" id="name" class="form-control" v-model="brand.name">
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <button class="btn btn-primary" type="submit">Guardar cambios</button>
          <router-link to="/brands" class="btn btn-danger">Cancelar</router-link>
        </div>
      </form>

    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import axios from "axios";
import { API_URL } from "@/config";

export default {
  name: 'EditBrand',
  data() {
    return {
      brand: {
        name: ''
      }
    };
  },
  methods: {
    updateBrand() {
      // Realizar la petición HTTP para actualizar la marca
      axios.put(API_URL + '/brands/' + this.$route.params.id, this.brand)
          .then(response => {
            Swal.fire({
              title: 'Actualizada',
              text: 'La marca ha sido actualizada correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
            console.log(response.data);
            this.$router.push('/brands');
          })
          .catch(error => {
            console.log(error);
            Swal.fire({
              title: 'Error',
              text: 'Ha ocurrido un error al actualizar la marca.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          });
    }
  },
  mounted() {
    // Obtener los datos de la marca desde la API
    axios.get(API_URL + '/brands/' + this.$route.params.id)
        .then(response => {
          this.brand = response.data;
        })
        .catch(error => {
          console.log(error);
        });
  }
};
</script>

<style>
.container {
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
