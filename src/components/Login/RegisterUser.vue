<template>
  <input
      type="checkbox"
      id="check"
      v-model="checked"
      @change="handleCheckboxChange"
  />

  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <form @submit.prevent="OnCreateUser">
          <table class="table table-bordered table-secondary">
            <tbody>
            <tr>
              <td class="table-label">Nombre Completo:</td>
              <td class="table-input">
                <input type="text" class="form-control" v-model="name" required>
              </td>
            </tr>
            <tr>
              <td class="table-label">Cédula:</td>
              <td class="table-input">
                <input type="text" class="form-control" v-model="idCard" required>
              </td>
            </tr>
            <tr>
              <td class="table-label">Correo Electrónico:</td>
              <td class="table-input">
                <input type="email" class="form-control" v-model="email" required>
              </td>
            </tr>
            <tr>
              <td class="table-label">Rol:</td>
              <td class="table-input">
                <select class="form-control" v-model="role" required>
                  <option value="" disabled selected>Seleccionar rol</option>
                  <option value="admin">Administrador</option>
                  <option value="user">Usuario Regular</option>
                </select>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="text-center">
            <button type="submit" class="btn btn-primary">Registrar Usuario</button>
            <router-link to="/users" class="btn btn-danger">Cancelar</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import {API_URL} from '@/config';
import axios from 'axios';
import {toast} from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

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
    OnCreateUser() {
      const user = {
        name: this.name,
        id_card: this.idCard,
        email: this.email,
        role: this.role
      };
      axios.post(`${API_URL}/users`, {user, creator_user_id: this.current_user_id})
          .then(() => {
            toast.success(`El usuario ha sido registrado exitosamente`, {
              position: 'bottom-right',
              timeout: 2000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
            });
            // Clear form fields after a delay to allow the toast to show
            setTimeout(() => {
              this.name = '';
              this.idCard = '';
              this.email = '';
              this.role = '';
            }, 2000);
          })
          .catch((error) => {
            console.log(error);
            toast.error(`Error al registrar el usuario`, {
              position: 'bottom-right',
              timeout: 2000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
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
#check:checked ~ .container {
  padding-left: 345px;
  max-width: 1800px;
}

.container {
  margin-top: 50px;
}

.table {
  width: 100%;
  margin-bottom: 1rem;
  background-color: #f8f9fa;
}

.table-label {
  width: 30%;
  font-weight: bold;
}

.table-input {
  width: 70%;
}

.btn {
  margin-right: 5px;
}
</style>
