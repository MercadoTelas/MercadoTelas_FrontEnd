<template>
    <div class="password-reset-form container">
  
      <form @submit.prevent="sendEmail">
        <div class="form-group">
          <label for="email" class="label">Ingrese su correo electrónico:</label>
          <input type="text" id="email" class="form-control input" v-model="correo">
        </div>
  
        <p class="warning">Se le enviará a su correo electrónico un enlace para restaurar su contraseña.</p>
  
        <div class="form-buttons">
          <button class="btn btn-primary btn-send" type="submit">Enviar Correo</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        correo: '',
      };
    },
    methods: {
      sendEmail() {
        // Lógica para enviar el correo electrónico
      },
    },
    mounted() {
      this.$state.navbarTitle = 'Restablecer Contraseña';
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
  
  .warning {
    color: black;
  }
  
  .form-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
  }
  
  .btn-send {
    display: inline-block;
  }
  </style>
  