<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-2 col-md-12">
        <Side-bar></Side-bar>
      </div>

      <div class="col-lg-10 col-md-12">
        <div class="table-container">
          <h1 class="filter-title text-primary">Filtros</h1>
          <div class="filters-container row">
            <div class="col-md-2">
              <div class="form-group">
                <label for="codigo">Código de Artículo:</label>
                <input type="text" id="codigo" class="form-control" v-model="filter.id" placeholder="Código">
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="category">Categoría:</label>
                <select id="category" class="form-control" v-model="filter.category" @change="resetSubcategory()">
                  <option value="" disabled>Seleccionar categoría</option>
                  <option v-for="category in categories" :value="category.name" :key="category.name">{{ category.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="subcategory">Subcategoría:</label>
                <select id="subcategory" class="form-control" v-model="filter.subcategory">
                  <option value="" disabled selected>Seleccionar subcategoría</option>
                  <option v-for="subcategory in filteredSubcategories" :value="subcategory.name"
                          :key="subcategory.name">
                    {{ subcategory.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="design">Diseño:</label>
                <select id="design" class="form-control" v-model="filter.design">
                  <option value="" disabled selected>Seleccionar diseño</option>
                  <option v-for="design in designs" :value="design.name" :key="design.name">{{ design.name }}</option>
                </select>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="brand">Marca:</label>
                <select id="brand" class="form-control" v-model="filter.brand">
                  <option value="" disabled>Seleccionar marca</option>
                  <option v-for="brand in brands" :value="brand.name" :key="brand.name">{{ brand.name }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table">
              <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Unidades de Entrada</th>
                <th>Unidades de Salida</th>
                <th>Acciones</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in filteredItems" :key="item.id">
                <td>{{ item.item_id }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.storing_format_units }} {{ item.storing_unit_format_name }}</td>
                <td>{{ item.transferring_format_units }} {{ item.transferring_unit_format_name }}</td>
                <td>
                  <div class="button-group">
                    <button @click="editArticle(item.id)">Editar</button>
                    <button @click="viewProductDetails(item.id)">Detalles</button>
                    <button @click="confirmDeleteArticle(item.id)">Eliminar</button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from 'sweetalert2';
import {API_URL} from "@/config";

export default {
  name: 'InventoryTable',
  data() {
    return {
      filter: {
        id: '',
        category: '',
        subcategory: '',
        design: '',
        brand: '',
      },
      items: [],
      categories: [],
      designs: [],
      brands: [],
    };
  },
  computed: {
    filteredSubcategories() {
      return this.categories.filter((category) => {
        return category.name === this.filter.category
      }).map((category) => {
        return category.subcategories
      }).flat()
    },
    filteredItems() {
      return this.items.filter((item) => {
        return item.item_id.toUpperCase().includes(this.filter.id.toUpperCase()) &&
            (this.filter.category === '' || item.category === this.filter.category) &&
            (this.filter.subcategory === '' || item.subcategory === this.filter.subcategory) &&
            (this.filter.design === '' || item.design === this.filter.design) &&
            (this.filter.brand === '' || item.brand === this.filter.brand)
      })
    }
  },
  mounted() {
    //Gets the all elements from the API
    axios.get(API_URL + '/inventory_items').then(response => {
      this.items = response.data.inventory_items
      this.categories = response.data.categories
      this.designs = response.data.designs
      this.brands = response.data.brands
    }).catch(error => {
      console.log(error)
    });
  },
  methods: {
    resetSubcategory() {
      this.filter.subcategory = ''
    },
    editArticle(articleId) {
      // Lógica para editar el artículo
      console.log('Editar artículo con ID:', articleId);

      // Navegar a la vista de edición del artículo con el ID proporcionado
      this.$router.push({name: 'EditArticle', params: {id: articleId}});
    },
    deleteArticle(articleId) {
      // Lógica para eliminar el artículo
      console.log('Eliminar artículo con ID:', articleId);
    },

    viewProductDetails(articleId) {
      // Lógica para ver los detalles del producto
      console.log('Ver detalles del producto con ID:', articleId);
      this.$router.push({name: 'ViewArticle', params: {id: articleId}});
    },

    confirmDeleteArticle(articleId) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteArticle(articleId);
          Swal.fire('¡Eliminado!', 'El artículo ha sido eliminado.', 'success');
        }
      });
    },
  },
};
</script>

<style>
.table-container {
  margin-top: 20px;
}

.filters-container {
  margin-bottom: 10px;
}

.buttonClass {
  margin-right: 1000px;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  background-color: #f2f2f2;
}

.button-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  /* Agrega esta línea para envolver los botones en dispositivos móviles */
  align-items: flex-start;
  /* Alinea los botones al costado izquierdo en dispositivos móviles */
}

.button-group {
  display: flex;
  gap: 8px;
}

.button-group button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  cursor: pointer;
}

.button-group button:hover {
  background-color: #45a049;
}

.button-container button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  cursor: pointer;
}

.button-container button:hover {
  background-color: #e53935;
}

.filter-title {
  margin-bottom: 20px;
}

.text-primary {
  color: #007bff;
}

.container-fluid {
  padding: 20px;
}
</style>
