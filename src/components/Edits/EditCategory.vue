<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h3>Editar Categoría</h3>
        <form @submit.prevent="updateCategory">
          <div class="mb-3">
            <label for="categoryName" class="form-label">Nombre de Categoría:</label>
            <input type="text" id="categoryName" class="form-control" v-model="category.name">
          </div>
          <div class="d-flex justify-content-end">
            <button class="btn btn-primary" type="submit">Guardar cambios</button>
            <router-link to="/categories" class="btn btn-danger">Cancelar</router-link>
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
  name: 'EditCategory',
  data() {
    return {
      category: {
        id: null,
        name: '',
      },
    };
  },
  methods: {
    updateCategory() {
      // Lógica para actualizar la categoría
      axios.put(`${API_URL}/categories/${this.category.id}`, this.category)
          .then(response => {
            // Manejar la respuesta exitosa
            console.log(response.data);
            Swal.fire({
              title: 'Categoría actualizada',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            // Redirigir a la vista de listar categorías
            this.$router.push('/categories');
          })
          .catch(error => {
            // Manejar el error
            console.error(error);
          });
    },
  },
  mounted() {
    // Obtener el ID de categoría desde la URL
    const categoryId = this.$route.params.id;
    // Obtener los detalles de la categoría desde la API
    axios.get(`${API_URL}/categories/${categoryId}`)
        .then(response => {
          this.category = response.data;
        })
        .catch(error => {
          console.error(error);
        });
  },
};
</script>

<style>
.container {
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
