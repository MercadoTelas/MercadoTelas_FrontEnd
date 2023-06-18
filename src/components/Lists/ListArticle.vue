<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="mb-3">
          <label for="search" class="form-label">Buscar artículo:</label>
          <input type="text" id="search" class="form-control" v-model="searchQuery"
            placeholder="Buscar por cualquier campo">
        </div>
        <div class="row">
          <div class="col-md-12">
            <button @click="addArticle" class="btn btn-success">Agregar artículo</button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Código</th>
                <th>Factor de Conversión</th>
                <th>Tamaño</th>
                <th>Inventario Mínimo</th>
                <th>Estado</th>
                <th>Subcategoría</th>
                <th>Categoría</th>
                <th>Marca</th>
                <th>Diseño</th>
                <th>Unidades de Entrada</th>
                <th>Unidades de Salida</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="article in filteredArticles" :key="article.code">
                <td>{{ article.name }}</td>
                <td>{{ article.code }}</td>
                <td>{{ article.conversion_factor }}</td>
                <td>{{ article.size }}</td>
                <td>{{ article.minimal_stock }}</td>
                <td>{{ article.status }}</td>
                <td>{{ article.subcategory_id }}</td>
                <td>{{ article.category_id }}</td>
                <td>{{ article.brand_id }}</td>
                <td>{{ article.design_id }}</td>
                <td>{{ article.storing_format_units_name }}</td>
                <td>{{ article.transferring_format_units_name }}</td>
                <td>
                  <button @click="viewArticle(article)" class="btn btn-primary">Ver artículo</button>
                  <button @click="deleteArticle(article)" class="btn btn-danger">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import Swal from 'sweetalert2';
import axios from "axios";
import { API_URL } from "@/config";

export default {
  name: 'ArticleList',
  data() {
    return {
      articles: [
        {
          name: 'Artículo 1',
          code: 'A001',
          conversion_factor: '2',
          size: 'M',
          minimal_stock: '10',
          status: 'Activo',
          subcategory_id: 'Subcategoría 1',
          category_id: 'Categoría 1',
          brand_id: 'Marca 1',
          design_id: 'Diseño 1',
          storing_format_units_name: 'Unidades de Entrada',
          transferring_format_units_name: 'Unidades de Salida',
        },
        {
          name: 'Artículo 2',
          code: 'A002',
          conversion_factor: '1.5',
          size: 'L',
          minimal_stock: '5',
          status: 'Activo',
          subcategory_id: 'Subcategoría 2',
          category_id: 'Categoría 2',
          brand_id: 'Marca 2',
          design_id: 'Diseño 2',
          storing_format_units_name: 'Unidades de Entrada',
          transferring_format_units_name: 'Unidades de Salida',
        },
        // Más datos de prueba de los artículos
      ],
      searchQuery: '',
    };
  },
  computed: {
    filteredArticles() {
      return this.articles.filter((article) => {
        const search = this.searchQuery.toLowerCase();
        return (
          article.name.toLowerCase().includes(search) ||
          article.code.toLowerCase().includes(search) ||
          article.conversion_factor.toLowerCase().includes(search) ||
          article.size.toLowerCase().includes(search) ||
          article.minimal_stock.toLowerCase().includes(search) ||
          article.status.toLowerCase().includes(search) ||
          article.subcategory_id.toLowerCase().includes(search) ||
          article.category_id.toLowerCase().includes(search) ||
          article.brand_id.toLowerCase().includes(search) ||
          article.design_id.toLowerCase().includes(search) ||
          article.storing_format_units_name.toLowerCase().includes(search) ||
          article.transferring_format_units_name.toLowerCase().includes(search)
        );
      });
    }
  },
  methods: {
    addArticle() {
      // Lógica para agregar un nuevo artículo
      // ...
    },
    viewArticle(/*article*/) {
      // Lógica para ver los detalles de un artículo
      // ...
    },
    deleteArticle(article) {
      // Lógica para eliminar un artículo
      Swal.fire({
        title: '¿Estás seguro?',
        text: `Se eliminará el artículo ${article.name}. Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Lógica para eliminar el artículo aquí
          // ...

          Swal.fire({
            title: 'Eliminado',
            text: 'El artículo ha sido eliminado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Lista de Artículos';
    // Obtener todos los artículos desde la API
    axios.get(API_URL + '/articles').then(response => {
      this.articles = response.data;
    }).catch(error => {
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

.text-primary {
  color: #007bff;
}

.table {
  margin-top: 20px;
}

.table th,
.table td {
  padding: 8px;
  vertical-align: middle;
}

.table th {
  background-color: #f2f2f2;
}

@media (max-width: 576px) {
  .table-responsive {
    overflow-x: auto;
  }
}
</style>
  