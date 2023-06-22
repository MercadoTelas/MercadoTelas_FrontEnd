<template>
  <div class="password-reset-form">
    <div class="card text-center" style="width: 500px; height: 400px;">
      <div class="card-header h5 text-white bg-primary">Restablecimiento de Contraseña</div>
      <div class="card-body px-5">
        <p class="card-text py-3">
          Ingrese su dirección de correo electrónico y le enviaremos un correo electrónico con las instrucciones para restablecer su contraseña.
        </p>
        <div class="form-outline">
          <input type="email" id="typeEmail" class="form-control my-3" v-model="email" />
          <label class="form-label" for="typeEmail">Correo electrónico</label>
        </div>
        <a href="#" class="btn btn-primary w-100" @click="resetPassword">Restablecer contraseña</a>
        <div class="d-flex justify-content-between mt-4">
          <a class="" href="" @click="goToLogin">Iniciar sesión</a>
          <a class="" href="#">Registrarse</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
    };
  },
  methods: {
    resetPassword() {
      // Lógica para restablecer la contraseña
    },
    goToLogin() {
      this.$router.push('/login');
    }
  },
};
</script>

<style>
.password-reset-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
