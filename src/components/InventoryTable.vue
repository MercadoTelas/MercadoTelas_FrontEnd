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
                <select id="codigo" class="form-control" v-model="filter.codigo">
                  <option value="">Todos</option>
                  <option value="codigo1">Código 1</option>
                  <option value="codigo2">Código 2</option>
                  <!-- Agrega más opciones según tus necesidades -->
                </select>
              </div>
            </div>

            <div class="col-md-2">
              <div class="form-group">
                <label for="categoria">Categoría:</label>
                <select id="categoria" class="form-control" v-model="filter.categoria">
                  <option value="">Todas</option>
                  <option value="categoria1">Categoría 1</option>
                  <option value="categoria2">Categoría 2</option>
                  <!-- Agrega más opciones según tus necesidades -->
                </select>
              </div>
            </div>

            <div class="col-md-2">
              <div class="form-group">
                <label for="subcategoria">Subcategoría:</label>
                <select id="subcategoria" class="form-control" v-model="filter.subcategoria">
                  <option value="">Todas</option>
                  <option value="subcategoria1">Subcategoría 1</option>
                  <option value="subcategoria2">Subcategoría 2</option>
                  <!-- Agrega más opciones según tus necesidades -->
                </select>
              </div>
            </div>

            <div class="col-md-2">
              <div class="form-group">
                <label for="diseno">Diseño:</label>
                <select id="diseno" class="form-control" v-model="filter.diseno">
                  <option value="">Todos</option>
                  <option value="diseno1">Diseño 1</option>
                  <option value="diseno2">Diseño 2</option>
                  <!-- Agrega más opciones según tus necesidades -->
                </select>
              </div>
            </div>

            <div class="col-md-2">
              <div class="form-group">
                <label for="marca">Marca:</label>
                <select id="marca" class="form-control" v-model="filter.marca">
                  <option value="">Todas</option>
                  <option value="marca1">Marca 1</option>
                  <option value="marca2">Marca 2</option>
                  <!-- Agrega más opciones según tus necesidades -->
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
                <tr v-for="product in filteredProducts" :key="product.id">
                  <td>{{ product.code }}</td>
                  <td>{{ product.name }}</td>
                  <td>{{ product.inputUnits }}</td>
                  <td>{{ product.outputUnits }}</td>
                  <td>
                    <div class="button-container">
                      <div class="button-group">
                        <button @click="editArticle(product.id)">Editar</button>
                        <button @click="viewProductDetails(product.id)">Detalles</button>
                      </div>
                      <button @click="confirmDeleteArticle(product.id)">Eliminar</button>
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
import Swal from 'sweetalert2';

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
    deleteArticle(articleId) {
      // Lógica para eliminar el artículo
      console.log('Eliminar artículo con ID:', articleId);
    },

    viewProductDetails(articleId) {
      // Lógica para ver los detalles del producto
      console.log('Ver detalles del producto con ID:', articleId);
      this.$router.push({ name: 'ViewArticle', params: { id: articleId } });
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
