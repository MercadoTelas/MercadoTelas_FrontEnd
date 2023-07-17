<template>
  <div class="background-image">
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="overlay">
        <form @submit.prevent="login" class="text-center">
          <div class="mb-4">
            <div class="logo-container">
              <img src="../../assets/logo_telas.jpg" alt="Logo" class="logo">
              <h2 class="h2">Iniciar sesión</h2>
            </div>
          </div>

          <!-- Email input -->
          <div class="form-outline mb-4">
            <input type="email" id="email" class="form-control" required />
            <label class="form-label" for="email">Correo electrónico</label>
          </div>

          <!-- Password input -->
          <div class="form-outline mb-4">
            <input type="password" id="password" class="form-control" required />
            <label class="form-label" for="password">Contraseña</label>
          </div>

          <!-- 2 column grid layout for inline styling -->
          <div class="row mb-4">
            <div class="col d-flex justify-content-center">
              <!-- Checkbox -->
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="remind_me" checked />
                <label class="form-check-label" for="remind_me">Recordarme</label>
              </div>
            </div>

            <div class="col">
              <!-- Simple link -->
              <router-link to="/sendEmail">¿Olvidaste tu contraseña?</router-link>
            </div>
          </div>

          <!-- Submit button -->
          <button type="submit" class="btn btn-primary full-width d-block" @click="log">Iniciar sesión</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from "@/config";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  methods: {
    forgotPass() {
      this.$router.push('/sendEmail');
    },
    login() {
      // Obtener los valores de email electrónico y contraseña
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      let user = {
        email,
        password,
        current_warehouse_logged_id: 1
      };

      axios.post(`${API_URL}/users/sign_in`, user)
        .then(response => {
          const headers = response.headers;
          const token = headers['authorization'];
          console.log(response);
          user = response.data.data;
          if (response.data.status === 'success') {
            this.$store.commit('setLoggedIn', true);
            //this.$store.commit('incrementLogAttempts');
            this.$store.commit('setUser', user);
            this.$store.commit('setSessionToken', token);
            this.$router.push('/home');
          }
        }).catch(
          error => {
            const { response } = error;
            console.log(response);
            toast.error(`Error al iniciar sesión`, {
              position: 'bottom-right',
              timeout: 2000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
            });
          });

    }
  },
  mounted() {
    this.$store.commit('setCheck', false);
    this.$store.commit('setLoggedIn', false);
    this.$store.commit('setLogAttempt', false);
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
  