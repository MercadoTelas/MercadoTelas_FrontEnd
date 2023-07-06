<template>
  <div class="centered-div">
    <input
      type="checkbox"
      id="check"
      v-model="checked"
      @change="handleCheckboxChange"
    />
  </div>
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-md-12 col-xl-4">
        <div class="card" style="border-radius: 15px;">
          <div class="card-body text-center">
            <div class="mt-3 mb-4">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                class="rounded-circle img-fluid" style="width: 100px;" />
            </div>
            <h4 class="mb-2">Steven J. Ramírez Cerdas</h4>
            <p class="text-muted mb-4">@Programmer <span class="mx-2"></span> </p>
            <div class="mb-4 pb-2">
              <button type="button" class="btn btn-outline-primary btn-floating">
                <i class="fab fa-facebook-f fa-lg"></i>
              </button>
              <button type="button" class="btn btn-outline-primary btn-floating">
                <i class="fab fa-twitter fa-lg"></i>
              </button>
              <button type="button" class="btn btn-outline-primary btn-floating">
                <i class="fab fa-skype fa-lg"></i>
              </button>
            </div>
            
            <div class="mt-4">
              <label for="email">Email:</label>
              <input type="email" id="email" class="form-control" value="admin@gmail.com" readonly/>
            </div>
            <div class="mt-4">
              <label for="password">Contraseña:</label>
              <input type="password" id="password" class="form-control" />
            </div>
            <div class="mt-4">
              <label for="confirm-password">Confirmar Contraseña:</label>
              <input type="password" id="confirm-password" class="form-control" />
            </div>
            <div class="mt-4">
              <button type="button" class="btn btn-primary">Cambiar contraseña</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyComponent',
  mounted() {
    this.$state.navbarTitle = "Perfil de usuario";
  }

}
</script>

<style scoped>
.centered-div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  /* Ajusta la altura según tus necesidades */
}
</style>
