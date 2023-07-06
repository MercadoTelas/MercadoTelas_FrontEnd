<template>
  <div class="register-user container">
    <form @submit.prevent="registerUser">
      <table class="form-table">
        <tr>
          <td>
            <label for="nombre" class="label">Nombre:</label>
          </td>
          <td>
            <input type="text" id="nombre" class="form-control input" v-model="nombre">
          </td>
        </tr>
        <tr>
          <td>
            <label for="apellidos" class="label">Apellidos:</label>
          </td>
          <td>
            <input type="text" id="apellidos" class="form-control input" v-model="apellidos">
          </td>
        </tr>
        <tr>
          <td>
            <label for="cedula" class="label">Cédula:</label>
          </td>
          <td>
            <input type="text" id="cedula" class="form-control input" v-model="cedula">
          </td>
        </tr>
        <tr>
          <td>
            <label for="correo" class="label">Correo Electrónico:</label>
          </td>
          <td>
            <input type="text" id="correo" class="form-control input" v-model="correo">
          </td>
        </tr>
        <tr>
          <td>
            <label for="contrasena" class="label">Contraseña:</label>
          </td>
          <td>
            <input type="password" id="contrasena" class="form-control input" v-model="contrasena">
          </td>
        </tr>
        <tr>
          <td>
            <label for="confirmar_contrasena" class="label">Confirmar Contraseña:</label>
          </td>
          <td>
            <input type="password" id="confirmar_contrasena" class="form-control input" v-model="confirmar_contrasena">
          </td>
        </tr>
        <tr>
          <td>
            <label> </label>
          </td>
          <td class="form-buttons">
            <button class="btn btn-primary btn-register" type="submit">Registrar</button>
            <button class="btn btn-danger btn-cancel" type="button" @click="cancelRegistration">Cancelar</button>
          </td>
        </tr>
      </table>
    </form>
  </div>
</template>

  
<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

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
      // Mostrar Toast de éxito
      toast.success('Usuario registrado existosamente', {
        autoClose: 2000, // Duración en milisegundos
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

.form-table {
  width: 100%;
  table-layout: fixed;
}

.form-table td {
  padding: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-buttons {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 15px;
  height: 100%;
}

@media (max-width: 600px) {
  .form-table td {
    display: flex;
  }
}
</style>
