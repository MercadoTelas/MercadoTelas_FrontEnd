<template>
    <div class="password-reset-form container">
  
      <form @submit.prevent="resetPassword">
        <div class="form-group">
          <label for="new-password" class="label">Nueva Contraseña:</label>
          <input type="password" id="new-password" class="form-control input" v-model="newPassword" required>
        </div>
  
        <div class="form-group">
          <label for="confirm-password" class="label">Confirmar Contraseña:</label>
          <input type="password" id="confirm-password" class="form-control input" v-model="confirmPassword" required>
        </div>
  
        <div class="form-buttons">
          <button class="btn btn-primary btn-reset" type="submit">Restaurar Contraseña</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2';
  export default {
    data() {
      return {
        newPassword: '',
        confirmPassword: '',
      };
    },
    methods: {
      resetPassword() {
        // Lógica para restablecer la contraseña
         // Mostrar Sweet Alert
         Swal.fire({
            icon: 'success',
            title: '¡Contraseña recuperada!',
            text: 'El usuario ha restablecido la contraseña correctamente',
            confirmButtonText: 'Aceptar',
        });
      },
    },
    mounted() {
      this.$state.navbarTitle = 'Restaurar Contraseña';
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
  
  .btn-reset {
    display: inline-block;
  }
  </style>
  