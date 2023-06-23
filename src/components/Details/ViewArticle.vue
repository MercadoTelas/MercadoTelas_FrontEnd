<template>
    <div class="article-view">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="article-image">
              <img :src="item && item.image" alt="Article Image" class="img-fluid" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="article-details">
              <div class="field">
                <label>Código:</label>
                <span>{{ item && item.id }}</span>
              </div>
              <div class="field">
                <label>Nombre:</label>
                <span>{{ item && item.name }}</span>
              </div>
              <div class="field">
                <label>Categoría:</label>
                <span>{{ item && item.category.name }}</span>
              </div>
              <div class="field">
                <label>Subcategoría:</label>
                <span>{{ item && item.subcategory.name }}</span>
              </div>
              <div class="field">
                <label>Diseño:</label>
                <span>{{ item?.design?.name || 'No posee' }}</span>
              </div>
              <div class="field">
                <label>Marca:</label>
                <span>{{ item?.brand?.name || 'No posee' }}</span>
              </div>
              <div class="field">
                <label>Nombre de unidades de almacenamiento:</label>
                <span>{{ item && item.storing_format_units_name }}</span>
              </div>
              <div class="field">
                <label>Nombre de unidades de venta:</label>
                <span>{{ item && item.transferring_format_units_name }}</span>
              </div>
              <div class="d-flex justify-content-end">
                <router-link to="/items" class="btn btn-danger">Volver</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
import axios from "axios";
import {API_URL} from "@/config";
export default {
  name: 'ArticleView',
  data() {
    return {
      item: '',
    };
  },
  mounted() {
    this.fetchArticle();
    this.$state.navbarTitle = 'Ver Artículo';
  },
  methods: {
    fetchArticle() {
      const itemId = this.$route.params.id;

      // Hacer la solicitud GET a la API para obtener los datos del artículo según su ID
      axios.get(`${API_URL}/items/${itemId}`)
          .then(response => {
            this.item = response.data;
          })
          .catch(error => {
            console.log(error);
          });
    }
  },
};
</script>


<style>
  .article-view {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
  
  .article-details {
    font-size: 16px;
  }
  
  .field {
    margin-bottom: 10px;
  }
  
  .field label {
    font-weight: bold;
  }
  
  .field span {
    margin-left: 10px;
  }
  </style>
  