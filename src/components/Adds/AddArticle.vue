<template>
  <input
      type="checkbox"
      id="check"
      v-model="checked"
      @change="handleCheckboxChange"
  />

  <div class="add-item container">
    <form class="form-estilo" @submit.prevent="onSubmit">
      <div class="table-responsive">
        <table class="table table-bordered table-secondary">
          <tbody>
          <tr>
            <td class="table-label">Código:</td>
            <td class="table-input" colspan="5">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-123"></i></span>
                <input type="text" id="id" class="form-control" :readonly="isReadOnly" v-model="id">
              </div>
            </td>
          </tr>
          <tr>
            <td class="table-label">Nombre:</td>
            <td class="table-input" colspan="5">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-person-badge-fill"></i></span>
                <input type="text" id="name" class="form-control" :readonly="isReadOnly" v-model="name">
              </div>
            </td>
          </tr>
          <tr>
            <td class="table-label">Stock Mínimo:</td>
            <td class="table-input">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-dash-square-fill"></i></span>
                <input type="number" id="minimal_stock" class="form-control" v-model="minimal_stock" :readonly="isReadOnly">
              </div>
            </td>
            <td class="table-label">Factor de Conversión:</td>
            <td class="table-input">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-input-cursor"></i></span>
                <input type="number" id="conversion_factor" class="form-control" v-model="conversion_factor" :readonly="isReadOnly">
              </div>
            </td>
          </tr>
          <tr>
            <td class="table-label">Unidades de Almacenamiento:</td>
            <td class="table-input">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-postcard"></i></span>
                <input type="text" id="storing_format_units_name" class="form-control" v-model="storing_format_units_name" :readonly="isReadOnly">
              </div>
            </td>
            <td class="table-label">Unidades de Venta:</td>
            <td class="table-input">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-postcard"></i></span>
                <input type="text" id="transferring_format_units_name" class="form-control" v-model="transferring_format_units_name" :readonly="isReadOnly">
              </div>
            </td>
          </tr>
          <tr>
            <td class="table-label">Categoría:</td>
            <td class="table-input" colspan="5">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-tag-fill"></i></span>
                <select id="category" class="form-select" v-model="filter.category" @change="onCategoryChange" :disabled="isReadOnly">
                  <option value="" disabled>Seleccionar categoría</option>
                  <option v-for="category in categories" :value="category.name" :key="category.name">{{ category.name }}</option>
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td class="table-label">Subcategoría:</td>
            <td class="table-input" colspan="5">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-tags"></i></span>
                <select id="subcategory" class="form-select" v-model="subcategory_id" :disabled="isReadOnly">
                  <option value="" disabled selected>Seleccionar subcategoría</option>
                  <option v-for="subcategory in filteredSubcategories" :value="subcategory.id" :key="subcategory.name">
                    {{ subcategory.name }}
                  </option>
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td class="table-label">Diseño:</td>
            <td class="table-input" colspan="5">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-x-diamond-fill"></i></span>
                <select id="design" class="form-select" v-model="design_id" :disabled="isReadOnly">
                  <option value="" selected disabled>Seleccionar diseño</option>
                  <option v-for="design in designs" :value="design.id" :key="design.id">{{ design.name }}</option>
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td class="table-label">Marca:</td>
            <td class="table-input" colspan="5">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-medium"></i></span>
                <select id="brand" class="form-select" v-model="brand_id" :disabled="isReadOnly">
                  <option value="" selected disabled>Seleccionar marca</option>
                  <option v-for="brand in brands" :value="brand.id" :key="brand.id">{{ brand.name }}</option>
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td class="table-label">Imagen:</td>
            <td class="table-input" colspan="5">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-card-image"></i></span>
                <input type="file" id="image" class="form-control" accept="image/*" @change="handleImageChange">
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="text-center">
        <button type="submit" class="btn btn-primary btn-save" v-if="!isReadOnly">Guardar</button>
        <router-link to="/items" type="button" class="btn btn-danger btn-save" >Volver</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { API_URL }from '@/config';

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
      conversion_factor: '',
      subcategory_id: '',
      design_id: '',
      brand_id: '',
      categories: [],
      designs: [],
      brands: [],
      image: null,
      isReadOnly: false,
      mode: ''
    };
  },
  computed: {
    ...mapState(["checkboxValue"]),
    checked: {
      get() {
        return this.checkboxValue;
      },
    },
    filteredSubcategories() {
      const selectedCategory = this.categories.find(category => category.name === this.filter.category);
      if (selectedCategory) {
        return selectedCategory.subcategories;
      }
      return [];
    },
  },
  created() {
    const idParam = this.$route.params.id;
    if (idParam) {
      this.fetchItemData(idParam);
    } else {
      this.fetchNewItemData();
    }
    // Verificar si la URL contiene la palabra "details"
    if (window.location.href.includes('details')) {
      this.isReadOnly = true; // Establecer isReadOnly en true
      this.$state.navbarTitle = 'Detalles Artículo';
    }
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    handleImageChange(event) {
      this.image = event.target.files[0];
    },
    onCategoryChange() {
      this.filter.subcategory = '';
    },
    fetchNewItemData() {
      this.$state.navbarTitle = 'Agregar Nuevo Artículo';
      this.mode = 'new';
      axios.get(`${API_URL}/new_item`)
          .then(response => {
            this.categories = response.data.categories;
            this.designs = response.data.designs;
            this.brands = response.data.brands;
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
    },
    fetchItemData(itemId) {
      this.mode = 'edit';
      this.$state.navbarTitle = 'Editar Artículo';
      axios.get(`${API_URL}/new_item`)
          .then(response => {
            this.categories = response.data.categories;
            this.designs = response.data.designs;
            this.brands = response.data.brands;
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
      axios.get(`${API_URL}/items/${itemId}`)
          .then(response => {
            const itemData = response.data;
            this.id = itemData.id;
            this.name = itemData.name;
            this.minimal_stock = itemData.minimal_stock;
            this.storing_format_units_name = itemData.storing_format_units_name;
            this.transferring_format_units_name = itemData.transferring_format_units_name;
            this.conversion_factor = itemData.conversion_factor;
            this.filter.category = itemData.category_name;
            this.subcategory_id = itemData.subcategory_id;
            this.design_id = itemData.design_id;
            this.brand_id = itemData.brand_id;
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
    },
    onSubmit() {
      let item = {
        id: this.id,
        name: this.name,
        minimal_stock: this.minimal_stock,
        storing_format_units_name: this.storing_format_units_name,
        transferring_format_units_name: this.transferring_format_units_name,
        conversion_factor: this.conversion_factor,
        subcategory_id: this.subcategory_id,
        design_id: this.design_id,
        brand_id: this.brand_id,
        image: this.image
      };
      item.user = this.$store.state.user.id;
      console.log(item);
      if (this.mode === 'edit') {
        this.updateItem(item);
      } else {
        this.createItem(item);
      }
    },
    updateItem(item) {
      axios
          .put(`${API_URL}/items/${item.id}`, item)
          .then(response => {
            console.log(response);
            toast.success('Artículo actualizado exitosamente', { timeout: 5000 });
            this.$router.push('/items');
          })
          .catch(error => {
            console.log(error);
            toast.error('Error al actualizar artículo', { closeOnClick: false });
          });
    },
    createItem(item) {
      axios
          .post(`${API_URL}/items`, item)
          .then(response => {
            console.log(response);
            toast.success('Artículo creado exitosamente', { timeout: 5000 });
            this.$router.push('/items');
          })
          .catch(error => {
            console.log(error);
            toast.error('Error al crear artículo', { closeOnClick: false });
          });
    }
  }
};
</script>

<style scoped>
#check:checked ~ .container {
  padding-left: 345px;
  max-width: 1000px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.btn-save {
  margin-top: 20px;
  margin-left: auto;
  margin-right: 0;
  margin: 5px;
}
</style>
