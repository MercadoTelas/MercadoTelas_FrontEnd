<template>
    <div class="register-user container">
      <h2 class="header">Registrar Usuario</h2>
  
      <form @submit.prevent="registerUser">
        <div class="form-group">
          <label for="nombre" class="label">Nombre:</label>
          <input type="text" id="nombre" class="form-control input" v-model="nombre">
        </div>
  
        <div class="form-group">
          <label for="apellidos" class="label">Apellidos:</label>
          <input type="text" id="apellidos" class="form-control input" v-model="apellidos">
        </div>
  
        <div class="form-group">
          <label for="cedula" class="label">Cédula:</label>
          <input type="text" id="cedula" class="form-control input" v-model="cedula">
        </div>
  
        <div class="form-group">
          <label for="correo" class="label">Correo Electrónico:</label>
          <input type="text" id="correo" class="form-control input" v-model="correo">
        </div>
  
        <div class="form-group">
          <label for="contrasena" class="label">Contraseña:</label>
          <input type="password" id="contrasena" class="form-control input" v-model="contrasena">
        </div>
  
        <div class="form-group">
          <label for="confirmar_contrasena" class="label">Confirmar Contraseña:</label>
          <input type="password" id="confirmar_contrasena" class="form-control input" v-model="confirmar_contrasena">
        </div>
  
        <div class="form-buttons">
          <button class="btn btn-primary btn-register" type="submit">Registrar</button>
          <button class="btn btn-danger btn-cancel" type="button" @click="cancelRegistration">Cancelar</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
    import Swal from 'sweetalert2';

  export default {
    data() {
      return {
        nombre: '',
        apellidos: '',
        cedula: '',
        correo: '',
        contrasena: '',
        confirmar_contrasena: ''
      };
    },
    methods: {
      registerUser() {
         // Mostrar Sweet Alert
        Swal.fire({
            icon: 'success',
            title: '¡Registrado!',
            text: 'El usuario ha sido registrado exitosamente.',
            confirmButtonText: 'Aceptar',
        });
      },
      cancelRegistration() {
        // Aquí puedes implementar la lógica para cancelar el registro del usuario
        // Puedes redirigir al usuario a otra página o realizar cualquier otra acción necesaria
      }
    },
    mounted() {
      this.$state.navbarTitle = 'Registro de usuario';
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
  
  .btn-register {
    display: inline-block;
    margin-right: 10px;
  }
  
  .btn-cancel {
    display: inline-block;
    background-color: red;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
  