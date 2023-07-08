<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <form @submit.prevent="registrarUsuario">
          <div class="form-group">
            <label for="nombre">Nombre:</label>
            <input type="text" class="form-control" v-model="nombre" required>
          </div>
          <div class="form-group">
            <label for="apellidos">Apellidos:</label>
            <input type="text" class="form-control" v-model="apellidos" required>
          </div>
          <div class="form-group">
            <label for="cedula">Cédula:</label>
            <input type="text" class="form-control" v-model="cedula" required>
          </div>
          <div class="form-group">
            <label for="correo">Correo Electrónico:</label>
            <input type="email" class="form-control" v-model="correo" required>
            <br>
            <button type="submit" class="btn btn-primary">Registrar Usuario</button>
            <button type="button" class="btn btn-danger" @click="deleteOper">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
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
    };

  },
  methods: {
    deleteOper() {
      // Lógica para eliminar un artículo
      this.$router.go(-1);
    },
    registrarUsuario() {
      // Aquí puedes realizar la lógica para enviar los datos del usuario al servidor
      // Por ahora, mostraremos una alerta de SweetAlert como confirmación
      
      // Luego de mostrar la alerta, puedes reiniciar los campos del formulario
      this.nombre = '';
      this.apellidos = '';
      this.cedula = '';
      this.correo = '';
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Registro de usuario';
  },
};
</script>

<style scoped>
.container {
  margin-top: 50px;
}

.btn {
  margin-right: 5px;
}
</style>
