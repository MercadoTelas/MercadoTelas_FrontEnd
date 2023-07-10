<template>
  <div class="password-reset-form background-image">
    <div class="card text-center overlay">
      <div class="card-header h2 text-white bg-primary">Restablecimiento de Contraseña</div>
      <div class="card-body">
        <p class="card-text py-3">
          Ingrese su dirección de correo electrónico y le enviaremos un correo electrónico con las instrucciones para
          restablecer su contraseña.
        </p>
        <form @submit.prevent="resetPassword" class="text-center">
          <div class="form-group">
            <label class="form-label" for="typeEmail">Correo electrónico</label>
            <input type="email" id="typeEmail" class="form-control" v-model="email"/>
          </div>
          <button type="submit" class="btn btn-primary w-100 mt-3">Restablecer contraseña</button>
        </form>
        <div class="d-flex justify-content-between mt-4">
          <a class="text-decoration-none" href="" @click="goToLogin">Iniciar sesión</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from "@/config";
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      email: '',
    };
  },
  methods: {
    resetPassword() {
      const user = {
        user: {
          email: this.email,
        }
      };
      axios.post(`${API_URL}/users/password/`, user)
          .then((response) => {
            console.log(response);
            Swal.fire({
              icon: 'success',
              title: 'Restablecimiento de contraseña',
              text: 'Se ha enviado un correo electrónico con las instrucciones para restablecer su contraseña.',
            });
          })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              icon: 'error',
              title: 'Error en el restablecimiento de contraseña',
              text: 'Ocurrió un error al enviar el correo electrónico de restablecimiento de contraseña. Por favor, inténtelo nuevamente.',
            });
          });
    },
    goToLogin() {
      this.$router.push('/login');
    }
  },
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
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.password-reset-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.card-header {
  font-size: 2rem;
}

.card-body {
  font-size: 1.2rem;
}

.btn-primary {
  margin-top: 1rem;
}
</style>
