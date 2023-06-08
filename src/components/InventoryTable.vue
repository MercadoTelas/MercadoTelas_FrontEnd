<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-2">
        <Side-bar></Side-bar>
      </div>
      
      <div class="col-lg-9">
        <div class="table-container">
          <h1 class="filter-title text-primary">Filtros</h1>
          <h1 class="filter-title"></h1>
          <br>
          <div class="filters-container row"><br>
            <br>
            <br>
            <div class="col-md-2 mb-2">
              <label for="codigo">Código de Artículo:</label>
              <select id="codigo" class="form-control" v-model="filter.codigo">
                <option value="">Todos</option>
                <option value="codigo1">Código 1</option>
                <option value="codigo2">Código 2</option>
                <!-- Agrega más opciones según tus necesidades -->
              </select>
            </div>

            <div class="col-md-2 mb-2">
              <label for="categoria">Categoría:</label>
              <select id="categoria" class="form-control" v-model="filter.categoria">
                <option value="">Todas</option>
                <option value="categoria1">Categoría 1</option>
                <option value="categoria2">Categoría 2</option>
                <!-- Agrega más opciones según tus necesidades -->
              </select>
            </div>

            <div class="col-md-2 mb-2">
              <label for="subcategoria">Subcategoría:</label>
              <select id="subcategoria" class="form-control" v-model="filter.subcategoria">
                <option value="">Todas</option>
                <option value="subcategoria1">Subcategoría 1</option>
                <option value="subcategoria2">Subcategoría 2</option>
                <!-- Agrega más opciones según tus necesidades -->
              </select>
            </div>

            <div class="col-md-2 mb-2">
              <label for="diseno">Diseño:</label>
              <select id="diseno" class="form-control" v-model="filter.diseno">
                <option value="">Todos</option>
                <option value="diseno1">Diseño 1</option>
                <option value="diseno2">Diseño 2</option>
                <!-- Agrega más opciones según tus necesidades -->
              </select>
            </div>

            <div class="col-md-2 mb-2">
              <label for="marca">Marca:</label>
              <select id="marca" class="form-control" v-model="filter.marca">
                <option value="">Todas</option>
                <option value="marca1">Marca 1</option>
                <option value="marca2">Marca 2</option>
                <!-- Agrega más opciones según tus necesidades -->
              </select>
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
                <tr v-for="product in filteredProducts" :key="product.id">
                  <td>{{ product.code }}</td>
                  <td>{{ product.name }}</td>
                  <td>{{ product.inputUnits }}</td>
                  <td>{{ product.outputUnits }}</td>
                  <td>
                    <div class="button-container">
                      <button @click="editArticle(product.id)">Editar</button>
                      <button @click="viewProductDetails(product.id)">Detalles</button>
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
export default {
  name: 'InventoryTable',
  props: {
    products: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      filter: {
        codigo: '',
        categoria: '',
        subcategoria: '',
        diseno: '',
        marca: '',
      },
      productsData: [
        {
          id: 1,
          code: 'codigo1',
          name: 'Producto 1',
          inputUnits: 10,
          outputUnits: 5,
        },
        {
          id: 2,
          code: 'codigo2',
          name: 'Producto 2',
          inputUnits: 15,
          outputUnits: 8,
        },
        // Agrega más objetos de producto según tu estructura de datos
      ],
    };
  },
  computed: {
    filteredProducts() {
      return this.productsData.filter((product) => {
        return (
          product.code.includes(this.filter.codigo) &&
          product.name.includes(this.filter.categoria) &&
          product.name.includes(this.filter.subcategoria) &&
          product.name.includes(this.filter.diseno) &&
          product.name.includes(this.filter.marca)
        );
      });
    },
  },
  methods: {
    editArticle(articleId) {
      // Lógica para editar el artículo
      console.log('Editar artículo con ID:', articleId);

      // Navegar a la vista de edición del artículo con el ID proporcionado
      this.$router.push({ name: 'EditArticle', params: { id: articleId } });
    },
  },
};
</script>

<style>
.table-container {
  margin-bottom: 20px;
  margin-top: 50px;
  margin-left: 130px;
}

.filters-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
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
}
</style>
