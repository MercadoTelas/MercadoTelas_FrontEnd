<template>
    <div class="add-item container">
      <h2 class="header">Agregar Nuevo Artículo</h2>
  
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="code">Código:</label>
            <input type="text" id="code" class="form-control" v-model="code">
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
            <label for="storing_format_units_name">Nombre de unidades de entrada:</label>
            <input type="text" id="storing_format_units_name" class="form-control" v-model="storing_format_units_name">
          </div>
  
          <div class="form-group">
            <label for="transferring_format_units_name">Nombre de unidades de salida:</label>
            <input type="text" id="transferring_format_units_name" class="form-control" v-model="transferring_format_units_name">
          </div>
        </div>
  
        <div class="col-md-6">
          <div class="form-group">
            <label for="category">Categoría:</label>
            <select id="category" class="form-control" v-model="category">
              <option value="">Seleccionar categoría</option>
              <option value="categoria1">Categoría 1</option>
              <option value="categoria2">Categoría 2</option>
              <option value="categoria3">Categoría 3</option>
            </select>
          </div>
  
          <div class="form-group">
            <label for="subcategory">Subcategoría:</label>
            <select id="subcategory" class="form-control" v-model="subcategory_id">
              <option value="">Seleccionar subcategoría</option>
              <option value="subcategoria1">Subcategoría 1</option>
              <option value="subcategoria2">Subcategoría 2</option>
              <option value="subcategoria3">Subcategoría 3</option>
            </select>
          </div>
  
          <div class="form-group">
            <label for="design">Diseño:</label>
            <select id="design" class="form-control" v-model="design_id">
              <option value="">Seleccionar diseño</option>
              <option value="diseno1">Diseño 1</option>
              <option value="diseno2">Diseño 2</option>
              <option value="diseno3">Diseño 3</option>
            </select>
          </div>
  
          <div class="form-group">
            <label for="brand">Marca:</label>
            <select id="brand" class="form-control" v-model="brand_id">
              <option value="">Seleccionar marca</option>
              <option value="marca1">Marca 1</option>
              <option value="marca2">Marca 2</option>
              <option value="marca3">Marca 3</option>
            </select>
          </div>
        </div>
      </div>
  
      <button @click="saveItem" class="btn btn-primary btn-save">Guardar</button>
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2';
  
  export default {
    data() {
      return {
        code: '123',
        name: 'Producto de ejemplo',
        minimal_stock: 10,
        storing_format_units_name: 'Cajas',
        transferring_format_units_name: 'Unidades',
        category: '',
        subcategory_id: '',
        design_id: '',
        brand_id: ''
      };
    },
    methods: {
      saveItem() {
        // Lógica para guardar el artículo
  
        // Mostrar la notificación centrada verticalmente
        Swal.fire({
          icon: 'success',
          title: 'Artículo agregado correctamente',
          showConfirmButton: false,
          timer: 3000,
          position: 'top-end',
          toast: true
        });
  
        // Resto de la lógica
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
  