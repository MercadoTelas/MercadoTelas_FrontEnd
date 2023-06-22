<template>
  <div class="container">
    <h1 class="page-title">Editar Producto</h1>
    <form @submit.prevent="onEditItem">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="code">Código:</label>
            <input type="text" id="code" class="form-control" v-model="item_id" readonly>
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
            <label for="storing_format_units_name">Nombre de unidades de almacenamiento:</label>
            <input type="text" id="storing_format_units_name" class="form-control" v-model="storing_format_units_name">
          </div>

          <div class="form-group">
            <label for="transferring_format_units_name">Nombre de unidades de venta:</label>
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
      <div class="button-container">
        <button class="btn btn-primary" type="submit">Guardar cambios</button>
        <button class="btn btn-danger" @click="cancel">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import {API_URL} from "@/config";
import Swal from "sweetalert2";

export default {
  name: 'EditItem',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      filter: {
        category: ''
      },
      item_id: '',
      name: '',
      minimal_stock: '',
      storing_format_units_name: '',
      transferring_format_units_name: '',
      category: '',
      subcategory_id: '',
      design_id: '',
      brand_id: '',
      categories: [],
      subcategories: [],
      designs: [],
      brands: [],
      item: {},
    };
  },
  computed: {
    filteredSubcategories() {
      if (!this.filter.category) {
        return this.subcategories;
      }
      const selectedCategory = this.categories.find(category => category.name === this.filter.category);
      if (selectedCategory) {
        return selectedCategory.subcategories;
      }
      return [];
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Editar Artículo';
    axios.get(`${API_URL}/new_item`)
        .then(response => {
          this.categories = response.data.categories;
          this.designs = response.data.designs;
          this.brands = response.data.brands;
        })
        .catch(error => {
          console.log(error);
        });
    axios.get(`${API_URL}/items/${this.id}`).then(response => {
      this.item = response.data;
      this.item_id = this.item.id;
      this.name = this.item.name;
      this.minimal_stock = this.item.minimal_stock;
      this.conversion_factor = this.item.conversion_factor;
      this.storing_format_units_name = this.item.storing_format_units_name;
      this.transferring_format_units_name = this.item.transferring_format_units_name;
      this.category = this.item.category;
      this.subcategory_id = this.item.subcategory_id;
      this.design_id = this.item.design_id ? this.item.design_id : '';
      this.brand_id = this.item.brand_id ? this.item.brand_id : '';
      this.subcategories = this.item.subcategories_category;
      this.$nextTick(() => {
        document.getElementById('category').value = this.category.name;
        document.getElementById('subcategory').value = this.subcategory_id;
        document.getElementById('design').value = this.design_id ? this.design_id : '';
        document.getElementById('brand').value = this.brand_id ? this.brand_id : '';
      });
    }).catch(error => {
      console.log(error);
    });

  },
  methods: {
    resetSubcategory() {
      this.filter.subcategory = ''
    },
    cancel() {
      this.$router.go(-1);
    },
    onEditItem() {
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
      axios.patch(`${API_URL}/items/${this.id}`, item)
          .then(response => {
            Swal.fire({
              title: '¡Artículo actualizado!',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
            console.log(response);
          })
          .catch(error => {
            Swal.fire({
              title: '¡Error!',
              text: 'No se pudo actualizar el artículo',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
            console.log(error);
          });
    }
  }
};
</script>

<style>
.page-title {
  margin-bottom: 30px;
  margin-left: 100px;
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
  margin-left: 100px;
}

.button-container {
  margin-top: 20px;
  margin-left: 100px;
}
</style>
