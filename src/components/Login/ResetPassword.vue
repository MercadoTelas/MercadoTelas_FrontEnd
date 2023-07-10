<template>
  <div class="background-image">
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="overlay">
        <form @submit.prevent="resetPassword" class="text-center">
          <div class="mb-4">
            <div class="logo-container">
              <img src="../../assets/logo_telas.jpg" alt="Logo" class="logo">
              <h2 class="h2">Restablecimiento de Contraseña</h2>
            </div>
          </div>

          <!-- Nueva contraseña input -->
          <div class="form-outline mb-4">
            <input type="password" id="new-password" class="form-control" v-model="new_password" required>
            <label class="form-label" for="new-password">Nueva Contraseña</label>
          </div>

          <!-- Confirmar contraseña input -->
          <div class="form-outline mb-4">
            <input type="password" id="confirm-password" class="form-control" v-model="new_password_confirmation" required>
            <label class="form-label" for="confirm-password">Confirmar Contraseña</label>
          </div>

          <!-- Submit button -->
          <button type="submit" class="btn btn-primary full-width d-block">Restaurar Contraseña</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {API_URL} from "@/config";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      new_password: '',
      new_password_confirmation: '',
      token: ''
    };
  },
  methods: {
    resetPassword() {
      if (this.new_password === this.new_password_confirmation) {
        const data = {
          new_password: this.new_password,
          password_confirmation: this.new_password_confirmation,
          reset_password_token: this.token
        };
        axios
            .put(`${API_URL}/users/password`, data)
            .then(response => {
              Swal.fire({
                title: "Contraseña actualizada",
                icon: "success",
                confirmButtonText: "Aceptar",
                timer: 3000
              });
              console.log(response);
              this.$router.push('/login');
            })
            .catch(error => {
              Swal.fire({
                title: "Error",
                text: "No se pudo actualizar la contraseña",
                icon: "error",
                confirmButtonText: "Aceptar"
              });
              console.log(error);
            });
      } else {
        Swal.fire({
          title: "Error",
          text: "Las contraseñas no coinciden",
          icon: "error",
          confirmButtonText: "Ok"
        });
      }
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Restablecimiento de Contraseña';
    this.token = this.$route.query.reset_password_token;
    console.log(this.token);
  }
};
</script>

<style scoped>
.background-image {
  background-image: url('../../assets/background_image.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.overlay {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 20px;
  border-radius: 10px;
  width: 450px;
}

.d-flex {
  display: flex;
}

.justify-content-center {
  justify-content: center;
}

.align-items-center {
  align-items: center;
}

.full-width {
  width: 100%;
}

.vh-100 {
  min-height: 100vh;
}

.logo-container {
  margin-right: 20px;
}

.logo {
  width: 300px;
  height: 250px;
  margin-bottom: 60px;
  border-radius: 20%;
}
</style>
