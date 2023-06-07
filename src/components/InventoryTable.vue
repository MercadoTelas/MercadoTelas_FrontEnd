<template>
    <div class="table-container">
      <div class="filters-container row">
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
                <button @click="editProduct(product.id)">Editar</button>
                <button @click="viewProductDetails(product.id)">Detalles</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'InventoryTable',
    props: {
      products: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        filter: {
          codigo: '',
          categoria: '',
          subcategoria: '',
          diseno: '',
          marca: ''
        }
      };
    },
    computed: {
      filteredProducts() {
        return this.products.filter((product) => {
          return (
            product.code.includes(this.filter.codigo) &&
            product.name.includes(this.filter.categoria) &&
            product.name.includes(this.filter.subcategoria) &&
            product.name.includes(this.filter.diseno) &&
            product.name.includes(this.filter.marca)
          );
        });
      }
    },
    methods: {
      editProduct(productId) {
        // Lógica para editar el producto
        console.log('Editar producto con ID:', productId);
      },
      viewProductDetails(productId) {
        // Lógica para ver los detalles del producto
        console.log('Ver detalles del producto con ID:', productId);
      }
    }
  };
  </script>
  
  <style>
  .table-container {
    margin-bottom: 20px;
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
  