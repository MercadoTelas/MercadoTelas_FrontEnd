<template>
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />

  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card" style="border-radius: 15px">
          <div class="card-body text-center">
            <div class="logo-container">
              <img src="../../assets/informacion.png" alt="Logo" class="logo">
            </div>
            <h4 class="mb-3">Hola de nuevo, {{ user.name }} </h4>
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
                <input type="password" id="passwordConfirmation" class="form-control"
                  v-model="new_password_confirmation" />
              </div>
              <div class="mt-4">
                <button type="submit" class="btn btn-primary btn-block">
                  Cambiar contraseña
                </button>
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
import axios from "axios";
import { API_URL } from "@/config";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


export default {
  name: "MyComponent",
  data() {
    return {
      user: {},
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    };
  },
  computed: {
    ...mapState(["checkboxValue"]),
    checked: {
      get() {
        return this.checkboxValue;
      },
    },
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    changePassword() {
      if (this.new_password === this.new_password_confirmation) {
        const config = {
          headers: { Authorization: this.sessionToken },
        };
        const data = {
          email: this.user.email,
          current_password: this.current_password,
          new_password: this.new_password,
          password_confirmation: this.new_password_confirmation,
        };
        axios
          .put(`${API_URL}/users/password`, data, config)
          .then((response) => {
            toast.success(`Contraseña actualizada`, {
              position: 'top-right',
              timeout: 2000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
            });

            console.log(response);
          })
          .catch((error) => {
            toast.error(`No se pudo actualizar la contraseña`, {
              position: 'top-right',
              timeout: 2000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
            });

            console.log(error);
          });
      } else {
        toast.error(`Las contraseñas no coinciden`, {
          position: 'top-right',
          timeout: 2000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
        });
      }
    },
  },
  mounted() {
    this.$state.navbarTitle = "Perfil de usuario";
    this.user = JSON.parse(localStorage.getItem("user"));
    this.checked = this.checkboxValue;
    this.sessionToken = localStorage.getItem("sessionToken");
  },
};
</script>

<style scoped>
#check:checked~.container {
  padding-left: 345px;
  max-width: 1800px;
}

.container {
  margin-top: 50px;
}

.logo-container {
  margin-right: 20px;
}

.logo {
  width: 105px;
  height: 130px;
  margin-bottom: 40px;
  border-radius: 20%;
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

.btn-danger {
  margin-top: 30px;
  height: 35px;
  border: none;
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
