<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h3>Editar Diseño</h3>

        <!-- Formulario de edición de diseño -->
        <form @submit.prevent="updateDesign">
          <div class="mb-3">
            <label for="name" class="form-label">Nombre:</label>
            <input type="text" id="name" class="form-control" v-model="design.name" required>
          </div>

          <!-- Agrega aquí los campos adicionales para editar el diseño -->

          <div class="d-flex justify-content-end">
            <button class="btn btn-primary" type="submit">Guardar cambios</button>
            <router-link to="/designs" class="btn btn-danger">Cancelar</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from "@/config";
import Swal from "sweetalert2";

export default {
  name: 'EditDesign',
  data() {
    return {
      design: '',
    };
  },
  methods: {
    updateDesign() {
      const designId = this.$route.params.id;
      axios
          .put(`${API_URL}/designs/${designId}`, this.design)
          .then((response) => {
            console.log(response.data);
            Swal.fire({
              title: 'Diseño actualizado',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            this.$router.push('/designs');
          })
          .catch((error) => {
            Swal.fire({
              title: 'Error al actualizar el diseño',
              icon: 'error',
              confirmButtonText: 'Ok',
            });
            console.log(error);
          });
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Editar Diseño';
    const designId = this.$route.params.id;
    // Obtener los detalles del diseño desde la API
    axios
        .get(`${API_URL}/designs/${designId}`)
        .then((response) => {
          this.design = response.data;
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

h3 {
  margin-bottom: 20px;
}
</style>
