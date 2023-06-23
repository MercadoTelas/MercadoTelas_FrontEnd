<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h3>Editar Bodega</h3>

        <!-- Formulario de edición de bodega -->
        <form @submit.prevent="updateWarehouse">
          <div class="mb-3">
            <label for="name" class="form-label">Nombre:</label>
            <input type="text" id="name" class="form-control" v-model="warehouse.name">
          </div>

          <!-- Agrega aquí los campos adicionales para editar la bodega -->

          <div class="d-flex justify-content-end">
            <button class="btn btn-primary" type="submit">Guardar cambios</button>
            <router-link to="/warehouses" class="btn btn-danger">Cancelar</router-link>
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
  name: 'EditWarehouse',
  data() {
    return {
      warehouse: '',
    };
  },
  methods: {
    updateWarehouse() {
      // Lógica para actualizar la bodega
      axios
          .put(`${API_URL}/warehouses/${this.warehouse.id}`, this.warehouse)
          .then((response) => {
            // Manejar la respuesta exitosa
            console.log(response.data);
            // Redirigir a la vista de listar bodegas
            this.$router.push('/warehouses');
          })
          .catch((error) => {
            // Manejar el error
            console.error(error);
          });
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Editar Bodega';
    const warehouseId = this.$route.params.id;
    // Obtener los detalles de la bodega desde la API
    axios
        .get(`${API_URL}/warehouses/${warehouseId}`)
        .then((response) => {
          console.log(response.data);
          this.warehouse = response.data;
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
