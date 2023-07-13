<template>
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="mb-3">
          <label for="search" class="form-label">Buscar usuario:</label>
          <input type="text" id="search" class="form-control" v-model="searchQuery"
            placeholder="Buscar por nombre o cédula" />
        </div>

          <div class="col-md-12">
            <button @click="addUser" class="btn btn-success">
              Agregar usuario
            </button>
          </div>
        
        <div class="table-container" style="max-height: 650px !important;">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cédula</th>
                <th>Estado</th>
                <th>Rol</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.id_card }}</td>
                <td>{{ user.status === "active" ? "Activo" : "Inactivo" }}</td>
                <td>
                  {{
                    user.role === "admin" ? "Administrador" : "Usuario regular"
                  }}
                </td>
                <td>{{ user.email }}</td>
                <td>
                  <button @click="deactivateUser(user)" class="btn btn-danger">
                    {{ user.status === "active" ? "Desactivar" : "Activar" }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


export default {
  name: "UserList",
  data() {
    return {
      users: [],
      searchQuery: "",
      current_user_id: "",
    };
  },
  computed: {
    ...mapState(["checkboxValue"]),
    checked: {
      get() {
        return this.checkboxValue;
      },
    },
    filteredUsers() {
      return this.users.filter((user) => {
        return (
          user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.id_card.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    },
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    addUser() {
      // Lógica para agregar un nuevo usuario
      this.$router.push({ name: "AddUser" });
    },
    deactivateUser(user) {
      // Lógica para desactivar un usuario
      if (user.status === "active") {
        Swal.fire({
          title: "¿Estás seguro?",
          text: "El usuario será desactivado y no podrá acceder al sistema",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Desactivar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            axios
              .put(API_URL + "/users/" + user.id, {
                status: "inactive",
                creator_user_id: this.current_user_id,
              })
              .then((response) => {
                toast.success(`Usuario desactivado correctamente`, {
                  position: 'top-right',
                  timeout: 2000,
                  closeOnClick: true,
                  pauseOnFocusLoss: true,
                  pauseOnHover: true,
                });

                console.log(response.data);
                this.users = this.users.map((u) => {
                  if (u.id === user.id) {
                    u.status = "inactive";
                  }
                  return u;
                });
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
      } else {
        Swal.fire({
          title: "¿Estás seguro?",
          text: "El usuario será activado y podrá acceder al sistema",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Activar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            axios
              .put(API_URL + "/users/" + user.id, {
                status: "active",
                creator_user_id: this.current_user_id,
              })
              .then((response) => {
                toast.success(`Usuario activado correctamente`, {
                  position: 'top-right',
                  timeout: 2000,
                  closeOnClick: true,
                  pauseOnFocusLoss: true,
                  pauseOnHover: true,
                });

                console.log(response.data);
                this.users = this.users.map((u) => {
                  if (u.id === user.id) {
                    u.status = "active";
                  }
                  return u;
                });
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
      }
    },
  },
  mounted() {
    this.$state.navbarTitle = "Lista de usuarios";
    // Obtener todos los usuarios desde la API
    axios
      .get(API_URL + "/users")
      .then((response) => {
        this.users = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    this.current_user_id = this.$store.state.user.id;
  },
};
</script>

<style>
#check:checked~.container {
  padding-left: 345px;
  max-width: 1500px;
}

.container {
  padding-top: 20px;
  padding-bottom: 20px;
}

.table {
  margin-top: 20px;
}

.table th,
.table td {
  padding: 8px;
  vertical-align: middle;
}

.table th {
  background-color: #f2f2f2;
}

@media (max-width: 576px) {
  .table-responsive {
    overflow-x: auto;
  }
}
</style>
