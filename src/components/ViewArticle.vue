<template>
    <div class="article-view">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="article-image">
              <img :src="article && article.image" alt="Article Image" class="img-fluid" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="article-details">
              <div class="field">
                <label>Código:</label>
                <span>{{ article && article.code }}</span>
              </div>
              <div class="field">
                <label>Nombre:</label>
                <span>{{ article && article.name }}</span>
              </div>
              <div class="field">
                <label>Categoría:</label>
                <span>{{ article && article.category }}</span>
              </div>
              <div class="field">
                <label>Subcategoría:</label>
                <span>{{ article && article.subcategory }}</span>
              </div>
              <div class="field">
                <label>Diseño:</label>
                <span>{{ article && article.design }}</span>
              </div>
              <div class="field">
                <label>Marca:</label>
                <span>{{ article && article.brand }}</span>
              </div>
              <div class="field">
                <label>Bodega:</label>
                <span>{{ article && article.warehouse }}</span>
              </div>
              <div class="field">
                <label>Unidades en formato de entrada:</label>
                <span>{{ article && article.inputUnits }}</span>
              </div>
              <div class="field">
                <label>Unidades en formato de salida:</label>
                <span>{{ article && article.outputUnits }}</span>
              </div>
              <button class="btn btn-primary" @click="cancelar">Regresar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ArticleView',
    data() {
      return {
        article: null,
      };
    },
    mounted() {
      this.fetchArticle();
    },
    methods: {
      fetchArticle() {
        const articleId = this.$route.params.id;
  
        setTimeout(() => {
          this.article = {
            id: articleId,
            code: 'ART001',
            name: 'Example Product',
            category: 'Electronics',
            subcategory: 'Smartphones',
            design: 'Design 1',
            brand: 'Brand X',
            warehouse: 'Warehouse A',
            inputUnits: 100,
            outputUnits: 50,
            image: 'https://picsum.photos/400/300',
          };
        }, 500);
      },
      goBack() {
        // Lógica para regresar a la página anterior
      },
      cancelar() {
        this.$router.go(-1);
      },
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
  