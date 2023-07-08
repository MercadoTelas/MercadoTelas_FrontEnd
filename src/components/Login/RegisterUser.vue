<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <form @submit.prevent="OnCreateUser">
          <div class="form-group">
            <label for="nombre">Nombre Completo:</label>
            <input type="text" class="form-control" v-model="name" required>
          </div>
          <div class="form-group">
            <label for="id_card">Cédula:</label>
            <input type="text" class="form-control" v-model="idCard" required>
          </div>
          <div class="form-group">
            <label for="correo">Correo Electrónico:</label>
            <input type="email" class="form-control" v-model="email" required>
          </div>
          <div class="form-group">
            <label for="role">Rol:</label>
            <select class="form-control" v-model="role" required>
              <option value="" disabled selected>Seleccionar rol</option>
              <option value="admin">Administrador</option>
              <option value="user">Usuario Regular</option>
            </select>
          </div>
          <br>
          <button type="submit" class="btn btn-primary">Registrar Usuario</button>
          <router-link to="/users" class="btn btn-danger">Cancelar</router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { API_URL } from '@/config';
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      idCard: '',
      email: '',
      role: '',
      current_user_id: ''
    };
  },
  methods: {
    OnCreateUser() {
      const user = {
        name: this.name,
        id_card: this.idCard,
        email: this.email,
        role: this.role
      };
      axios.post(`${API_URL}/users`, {user, creator_user_id: this.current_user_id})
        .then(() => {
          Swal.fire({
            title: 'Usuario registrado',
            text: 'El usuario ha sido registrado exitosamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            this.name = '';
            this.idCard = '';
            this.email ='';
            this.role = '';
          });
        })
        .catch((error) => {
          Swal.fire({
            title: 'Error',
            text: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        });
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Registro de usuario';
    this.current_user_id = this.$store.state.user.id;
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
