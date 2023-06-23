<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h3>Editar Subcategoría</h3>
        <form @submit.prevent="updateSubcategory">
          <div class="mb-3">
            <label for="subcategoryName" class="form-label">Nombre de Subcategoría:</label>
            <input type="text" id="subcategoryName" class="form-control" v-model="subcategory.name">
          </div>
          <div class="mb-3">
            <label for="category" class="form-label">Categoría:</label>
            <select id="category" class="form-control" v-model="subcategory.category_id">
              <option v-for="category in categories" :value="category.id" :key="category.id">{{ category.name }}</option>
            </select>
          </div>
          <div class="d-flex justify-content-end">
            <button class="btn btn-primary" type="submit">Guardar cambios</button>
            <router-link to="/subcategories" class="btn btn-danger">Cancelar</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from "@/config";

export default {
  name: 'EditSubcategory',
  data() {
    return {
      subcategory: {
        id: null,
        name: '',
        category_id: null,
      },
      categories: [],
    };
  },
  methods: {
    updateSubcategory() {
      // Lógica para actualizar la subcategoría
      axios
          .put(`${API_URL}/subcategories/${this.subcategory.id}`, this.subcategory)
          .then((response) => {
            // Manejar la respuesta exitosa
            console.log(response.data);
            // Redirigir a la vista de listar subcategorías
            this.$router.push('/subcategories');
          })
          .catch((error) => {
            // Manejar el error
            console.error(error);
          });
    },
  },
  mounted() {
    // Obtener el ID de subcategoría desde la URL
    const subcategoryId = this.$route.params.id;
    // Obtener los detalles de la subcategoría desde la API
    axios
        .get(`${API_URL}/subcategories/${subcategoryId}`)
        .then((response) => {
          this.subcategory = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    // Obtener todas las categorías desde la API
    axios
        .get(`${API_URL}/categories`)
        .then((response) => {
          this.categories = response.data;
        })
        .catch((error) => {
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

h3 {
  margin-bottom: 20px;
}
</style>
