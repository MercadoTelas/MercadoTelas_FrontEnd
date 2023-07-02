<template>
  <input
      type="checkbox"
      id="check"
      v-model="checked"
      @change="handleCheckboxChange"
  />

  <div class="container">
    <form @submit.prevent="changePassword">
      <div class="row">
        <div id="contentDiv" class="col-md-6 mt-8">
          <div class="d-flex justify-content-center" style="width: 600px">
            <h3 style="width: fit-content; margin: 0 auto">
              Hola de nuevo, {{ user.name }}
            </h3>
          </div>

          <legend style="margin-top: 50px; padding-left: 100px; width: fit-content">
            Información de la cuenta
          </legend>

          <div class="form-group mb-8">
            <label for="email" class="form-label">Correo electrónico</label>
            <input
                v-model="user.email"
                type="text"
                class="form-control"
                id="email"
                disabled
                style="width: 400px"
            />
          </div>

          <legend style="padding-left: 100px; width: fit-content">
            Cambio de contraseña
          </legend>
          <div class="form-group mt-5">
            <label for="currentPassword" class="form-label">Contraseña actual</label>
            <input
                v-model="current_password"
                type="password"
                class="form-control"
                id="currentPassword"
                style="width: 400px"
            />
          </div>
          <div class="form-group mt-3">
            <label for="newPassword" class="form-label">Nueva contraseña</label>
            <input
                v-model="new_password"
                type="password"
                class="form-control"
                id="newPassword"
                style="width: 400px"
            />
          </div>
          <div class="form-group mt-3">
            <label for="passwordConfirmation" class="form-label">Confirme su nueva contraseña</label>
            <input
                v-model="new_password_confirmation"
                type="password"
                class="form-control"
                id="passwordConfirmation"
                style="width: 400px"
            />
          </div>
          <div class="d-flex justify-content-center" style="width: 600px">
            <button
                id="changePassword"
                type="submit"
                class="form-button"
                style="margin-top: 30px"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
            >
              Confirmar cambio de contraseña
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import Swal from "sweetalert2";
import axios from "axios";
import {API_URL} from "@/config";

export default {
  name: "Perfil-Component",
  data() {
    return {
      user: "",
      sessionToken: "",
      current_password: "",
      new_password: "",
      new_password_confirmation: ""
    };
  },
  computed: {
    ...mapState(["checkboxValue"]),
    checked: {
      get() {
        return this.checkboxValue;
      }
    }
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.sessionToken = localStorage.getItem("sessionToken");
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    changePassword() {
      if (this.new_password === this.new_password_confirmation) {
        const config = {
          headers: {Authorization: `${this.token}`}
        };
        let data = {
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
  }
};
</script>

<style lang="scss">
#check:checked ~ .container .row #contentDiv {
  margin-left: 345px;
}

.container .row {
  justify-content: center;
  align-items: center;
}

.form-group {
  width: fit-content;
}

.container .row .div h3 {
  text-align: center;
}

.form-button {
  height: 35px;
  border: none;
  background-color: #3066be;
  border-radius: 10px;
  color: #ffffff;
  width: 300px;
  text-align: center;
}
</style>
