<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="mb-3">
          <label for="search" class="form-label">Buscar usuario:</label>
          <input type="text" id="search" class="form-control" v-model="searchQuery"
                 placeholder="Buscar por nombre o cédula">
        </div>

        <div class="row">
          <div class="col-md-12">
            <button @click="addUser" class="btn btn-success">Agregar usuario</button>
          </div>
        </div>


        <div class="table-responsive">
          <table class="table table-striped">
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
              <td>{{ user.status === 'active' ? "Activo" : "Inactivo" }}</td>
              <td>{{ user.role === 'admin' ? "Administrador" : "Usuario regular" }}</td>
              <td>{{ user.email }}</td>
              <td>
                <button @click="viewUser(user)" class="btn btn-primary">Ver usuario</button>
                <button @click="deactivateUser(user)" class="btn btn-danger">
                  {{ user.status === 'active' ? "Desactivar" : "Activar" }}
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
import Swal from 'sweetalert2';
import axios from "axios";
import {API_URL} from "@/config";

export default {
  name: 'UserList',
  data() {
    return {
      users: [],
      searchQuery: '',
      current_user_id: ''
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) => {
        return (
            user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            user.id_card.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    }
  },
  methods: {
    addUser() {
      // Lógica para agregar un nuevo usuario
      this.$router.push({name: 'AddUser'});
    },
    viewUser(/*user*/) {
      // Lógica para ver los detalles de un usuario
      // ...
    },
    deactivateUser(user) {
      // Lógica para desactivar un usuario
      if (user.status === 'active') {
        Swal.fire({
          title: '¿Estás seguro?',
          text: "El usuario será desactivado y no podrá acceder al sistema",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Desactivar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            axios.put(API_URL + '/users/' + user.id, {
              status: 'inactive', creator_user_id: this.current_user_id
            }).then(response => {
              Swal.fire(
                  'Usuario desactivado',
                  'El usuario ha sido desactivado exitosamente',
                  'success'
              );
              console.log(response.data);
              this.users = this.users.map(u => {
                if (u.id === user.id) {
                  u.status = 'inactive';
                }
                return u;
              });
            }).catch(error => {
              console.log(error);
            });
          }
        });
      } else {
        Swal.fire({
          title: '¿Estás seguro?',
          text: "El usuario será activado y podrá acceder al sistema",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Activar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            axios.put(API_URL + '/users/' + user.id, {
              status: 'active', creator_user_id: this.current_user_id
            }).then(response => {
              Swal.fire(
                  'Usuario activado',
                  'El usuario ha sido activado exitosamente',
                  'success'
              );
              console.log(response.data);
              this.users = this.users.map(u => {
                if (u.id === user.id) {
                  u.status = 'active';
                }
                return u;
              });
            }).catch(error => {
              console.log(error);
            });
          }
        });
      }
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Lista de Usuarios';
    // Obtener todos los usuarios desde la API
    axios.get(API_URL + '/users').then(response => {
      this.users = response.data;
    }).catch(error => {
      console.log(error);
    });
    this.current_user_id = this.$store.state.user.id;
  },
};
</script>

<style>
.container {
  padding-top: 20px;
  padding-bottom: 20px;
}

.text-primary {
  color: #007bff;
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
  