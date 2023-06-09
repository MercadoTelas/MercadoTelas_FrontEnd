<template>
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <h1 class="page-title">Editar Producto</h1>
          <div class="form-group">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" class="form-control" v-model="nombre" />
          </div>
          <div class="form-group">
            <label for="factor">Factor de Conversión:</label>
            <input type="text" id="factor" class="form-control" v-model="factor" />
          </div>
          <div class="form-group">
            <label for="categoria">Categoría:</label>
            <select class="form-control" id="categoria" v-model="categoriaSeleccionada">
              <option value="">Seleccionar</option>
              <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.nombre">{{ categoria.nombre }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="subcategoria">Subcategoría:</label>
            <select class="form-control" id="subcategoria" v-model="subcategoriaSeleccionada">
              <option value="">Seleccionar</option>
              <option v-for="subcategoria in subcategorias" :key="subcategoria.id" :value="subcategoria.nombre">{{ subcategoria.nombre }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="diseno">Diseño:</label>
            <select class="form-control" id="diseno" v-model="disenoSeleccionado">
              <option value="">Seleccionar</option>
              <option v-for="diseno in diseños" :key="diseno.id" :value="diseno.nombre">{{ diseno.nombre }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="marca">Marca:</label>
            <select class="form-control" id="marca" v-model="marcaSeleccionada">
              <option value="">Seleccionar</option>
              <option v-for="marca in marcas" :key="marca.id" :value="marca.nombre">{{ marca.nombre }}</option>
            </select>
          </div>
          <div class="button-container">
            <button class="btn btn-primary" @click="guardarCambios">Guardar cambios</button>
            <button class="btn btn-danger" @click="cancelar">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'EditarProducto',
    data() {
      return {
        nombre: '',
        factor: '',
        categoriaSeleccionada: '',
        subcategoriaSeleccionada: '',
        disenoSeleccionado: '',
        marcaSeleccionada: '',
        categorias: [
          { id: 1, nombre: 'Categoría 1' },
          { id: 2, nombre: 'Categoría 2' },
          // Agrega más categorías según tus necesidades
        ],
        subcategorias: [
          { id: 1, nombre: 'Subcategoría 1' },
          { id: 2, nombre: 'Subcategoría 2' },
          // Agrega más subcategorías según tus necesidades
        ],
        diseños: [
          { id: 1, nombre: 'Diseño 1' },
          { id: 2, nombre: 'Diseño 2' },
          // Agrega más diseños según tus necesidades
        ],
        marcas: [
          { id: 1, nombre: 'Marca 1' },
          { id: 2, nombre: 'Marca 2' },
          // Agrega más marcas según tus necesidades
        ],
      };
    },
    methods: {
      guardarCambios() {
        // Lógica para guardar los cambios
        console.log('Se han guardado los cambios');
      },
      cancelar() {
        this.$router.go(-1);
      },
    },
  };

  </script>
  
  <style>
  .page-title {
    margin-bottom: 30px;
    margin-left:100px;
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
  