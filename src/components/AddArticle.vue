<template>
  <div class="add-item container">
    <h2 class="header">Agregar Nuevo Artículo</h2>

    <form @submit.prevent="onCreateItem">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="code">Código:</label>
            <input type="text" id="code" class="form-control" v-model="id">
          </div>

          <div class="form-group">
            <label for="name">Nombre:</label>
            <input type="text" id="name" class="form-control" v-model="name">
          </div>

          <div class="form-group">
            <label for="minimal_stock">Stock Mínimo:</label>
            <input type="number" id="minimal_stock" class="form-control" v-model="minimal_stock">
          </div>

          <div class="form-group">
            <label for="conversion_factor">Factor de conversión:</label>
            <input type="number" id="conversion_factor" class="form-control" v-model="conversion_factor">
          </div>

          <div class="form-group">
            <label for="storing_format_units_name">Nombre de unidades de entrada:</label>
            <input type="text" id="storing_format_units_name" class="form-control" v-model="storing_format_units_name">
          </div>

          <div class="form-group">
            <label for="transferring_format_units_name">Nombre de unidades de salida:</label>
            <input type="text" id="transferring_format_units_name" class="form-control"
                   v-model="transferring_format_units_name">
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="category">Categoría:</label>
            <select id="category" class="form-control" v-model="filter.category" @change="resetSubcategory()">
              <option value="" disabled>Seleccionar categoría</option>
              <option v-for="category in categories" :value="category.name" :key="category.name">{{ category.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="subcategory">Subcategoría:</label>
            <select id="subcategory" class="form-control" v-model="subcategory_id">
              <option value="" disabled selected>Seleccionar subcategoría</option>
              <option v-for="subcategory in filteredSubcategories" :value="subcategory.id"
                      :key="subcategory.name">
                {{ subcategory.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="design">Diseño:</label>
            <select id="design" class="form-control">
              <option value="" selected disabled>Seleccionar diseño</option>
              <option v-for="design in designs" :value="design.name" :key="design.id">{{ design.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="brand">Marca:</label>
            <select id="brand" class="form-control">
              <option value="" selected disabled>Seleccionar marca</option>
              <option v-for="brand in brands" :value="brand.name" :key="brand.id">{{ brand.name }}</option>
            </select>
          </div>
        </div>
      </div>
      <button class="btn btn-primary btn-save" type="submit">Guardar</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import {API_URL} from "@/config";

export default {
  data() {
    return {
      filter: {
        category: ''
      },
      id: '',
      name: '',
      minimal_stock: '',
      storing_format_units_name: '',
      transferring_format_units_name: '',
      category: '',
      subcategory_id: '',
      design_id: '',
      brand_id: '',
      categories: [],
      designs: [],
      brands: []
    };
  },
  computed: {
    filteredSubcategories() {
      const selectedCategory = this.categories.find(category => category.name === this.filter.category);
      if (selectedCategory) {
        return selectedCategory.subcategories;
      }
      return [];
    },
  },
  mounted() {
    axios.get(`${API_URL}/new_item`)
        .then(response => {
          this.categories = response.data.categories;
          this.designs = response.data.designs;
          this.brands = response.data.brands;
        })
        .catch(error => {
          console.log(error);
        });
  },
  methods:
      {
        resetSubcategory() {
          this.filter.subcategory = ''
        },
        onCreateItem() {
          const item = {
            id: this.id,
            name: this.name,
            minimal_stock: this.minimal_stock,
            storing_format_units_name: this.storing_format_units_name,
            transferring_format_units_name: this.transferring_format_units_name,
            conversion_factor: this.conversion_factor,
            subcategory_id: this.subcategory_id,
            design_id: this.design_id,
            brand_id: this.brand_id
          }
          console.log(item);
          axios.post(`${API_URL}/items`, item)
              .then(response => {
                Swal.fire({
                  title: '¡Artículo creado!',
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
                });
                console.log(response);
              })
              .catch(error => {
                Swal.fire({
                  title: '¡Error!',
                  text: 'No se pudo crear el artículo',
                  icon: 'error',
                  confirmButtonText: 'Aceptar'
                });
                console.log(error);
              });
        }
      }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: left;
}

.form-group {
  margin-bottom: 20px;
}

.btn-save {
  display: block;
  margin-top: 20px;
  margin-left: auto;
  margin-right: 0;
}
</style>
  