<template>
    <div class="container">
      <h2 class="text-center mt-3">Agregar Nueva Bodega</h2>
      <div class="form-group mt-4">
        <label for="wareHouseName">Ingrese el nombre de la bodega:</label>
        <input type="text" class="form-control" id="wareHouseName" v-model="wareHouseName">
      </div>
      <div class="buttons-container mb-3 mr-3">
        <button class="btn btn-primary mr-2" @click="saveChanges">Guardar</button>
        <button class="btn btn-danger" @click="cancel">Cancelar</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        wareHouseName: ''
      };
    },
    methods: {
      saveChanges() {
        // Lógica para guardar los cambios
      },
      cancel() {
        this.$router.go(-1);
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    padding: 20px;
  }
  
  .buttons-container {
  position: absolute;
  right: 20px;
  bottom: 20px;
  padding: 100px;
}

.buttons-container button {
  margin-left: 10px;
}
  </style>
  