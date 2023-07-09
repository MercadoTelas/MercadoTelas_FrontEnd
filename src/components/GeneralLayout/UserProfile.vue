<template>
  <div class="centered-div">
    <input
        type="checkbox"
        id="check"
        v-model="checked"
        @change="handleCheckboxChange"
    />
  </div>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card" style="border-radius: 15px;">
          <div class="card-body text-center">
            <h4 class="mb-3">{{ user.name }}</h4>
            <form @submit.prevent="changePassword">
              <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" class="form-control" :value="user.email" readonly />
              </div>
              <div class="form-group mt-4">
                <label for="currentPassword">Contraseña actual:</label>
                <input type="password" id="currentPassword" class="form-control" v-model="current_password" />
              </div>
              <div class="form-group mt-4">
                <label for="newPassword">Nueva contraseña:</label>
                <input type="password" id="newPassword" class="form-control" v-model="new_password" />
              </div>
              <div class="form-group mt-4">
                <label for="passwordConfirmation">Confirmar nueva contraseña:</label>
                <input type="password" id="passwordConfirmation" class="form-control" v-model="new_password_confirmation" />
              </div>
              <div class="mt-4">
                <button type="submit" class="btn btn-primary btn-block">Cambiar contraseña</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Swal from "sweetalert2";
import axios from "axios";
import { API_URL } from "@/config";

export default {
  name: "MyComponent",
  data() {
    return {
      checked: false,
      user: {},
      current_password: "",
      new_password: "",
      new_password_confirmation: ""
    };
  },
  computed: {
    ...mapState(["checkboxValue"]),
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    changePassword() {
      if (this.new_password === this.new_password_confirmation) {
        const config = {
          headers: { Authorization: this.sessionToken }
        };
        const data = {
          email: this.user.email,
          current_password: this.current_password,
          new_password: this.new_password,
          password_confirmation: this.new_password_confirmation
        };
        axios
            .put(`${API_URL}/users/password`, data, config)
            .then(response => {
              Swal.fire({
                title: "Contraseña actualizada",
                icon: "success",
                confirmButtonText: "Aceptar"
              });
              console.log(response);
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
    }
  },
  mounted() {
    this.$state.navbarTitle = "Perfil de usuario";
    this.user = JSON.parse(localStorage.getItem("user"));
    this.checked = this.checkboxValue;
    this.sessionToken = localStorage.getItem("sessionToken");
  }
};
</script>

<style scoped>
.centered-div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.container {
  margin-top: 50px;
}

.card {
  border-radius: 15px;
}

.card-body {
  text-align: center;
}

.form-control {
  width: 100%;
}

.btn-primary {
  margin-top: 30px;
  height: 35px;
  border: none;
  background-color: #3066be;
  border-radius: 10px;
  color: #ffffff;
}

.btn-block {
  width: 100%;
}

.mt-4 {
  margin-top: 20px;
}
</style>
