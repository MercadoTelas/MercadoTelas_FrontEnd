<template>
    <div class="login-user-form container">
  
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="correo" class="label">Correo Electrónico:</label>
          <input type="text" id="correo" class="form-control input" v-model="correo">
        </div>
  
        <div class="form-group">
          <label for="contrasena" class="label">Contraseña:</label>
          <input type="password" id="contrasena" class="form-control input" v-model="contrasena">
        </div>
  
        <div class="form-buttons">
          <button class="btn btn-primary btn-login" type="submit">Iniciar Sesión</button>
        </div>
      </form>
  
      <p class="forgot-password">
        <a href="#" class="forgot-password-link">Olvidé mi contraseña</a>
      </p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        correo: '',
        contrasena: '',
      };
    },
    methods: {
      login() {
        // Lógica para iniciar sesión
      },
    },
    mounted() {
      this.$state.navbarTitle = 'Inicio de sesión';
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
  
  .form-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
  }
  
  .btn-login {
    display: inline-block;
  }
  
  .forgot-password {
    text-align: right;
    margin-top: 10px;
  }
  
  .forgot-password-link {
    color: blue;
  }
  </style>
  