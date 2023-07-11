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

<!--

Componente para listar los usuarios

**Template:**

- `<input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />`: Este elemento `<input>` es un checkbox que está vinculado a la propiedad `checked` utilizando la directiva `v-model`. Cuando el estado del checkbox cambia, se invoca el método `handleCheckboxChange`.

- `<div class="container">`: Es el contenedor principal del componente.

- `<div class="row">`: Representa una fila de elementos dentro del contenedor.

- `<div class="col-md-8 offset-md-2">`: Representa una columna de ancho medio con un desplazamiento hacia la derecha.

- `<div class="mb-3">`: Contiene una etiqueta y un campo de búsqueda.

- `<label for="search" class="form-label">Buscar usuario:</label>`: Es una etiqueta para el campo de búsqueda.

- `<input type="text" id="search" class="form-control" v-model="searchQuery" placeholder="Buscar por nombre o cédula" />`: Es un campo de entrada de texto que está vinculado a la propiedad `searchQuery` utilizando la directiva `v-model`. Permite al usuario buscar usuarios por nombre o cédula.

- `<div class="row">`: Representa una fila dentro de la columna.

- `<div class="col-md-12">`: Representa una columna de ancho medio.

- `<button @click="addUser" class="btn btn-success">Agregar usuario</button>`: Es un botón que invoca el método `addUser` cuando se hace clic en él. Permite agregar un nuevo usuario.

- `<div class="table-responsive">`: Es un contenedor para la tabla de usuarios. Proporciona un desplazamiento horizontal cuando el contenido de la tabla excede el ancho del contenedor.

- `<table class="table table-striped">`: Es una tabla que muestra los usuarios.

- `<thead>`: Define el encabezado de la tabla.

- `<tr>`: Representa una fila en el encabezado de la tabla.

- `<th>`: Representa una celda del encabezado de la tabla.

- `<tbody>`: Define el cuerpo de la tabla.

- `<tr v-for="user in filteredUsers" :key="user.id">`: Utiliza la directiva `v-for` para iterar sobre cada usuario en la propiedad `filteredUsers`. Cada usuario se representa como una fila en la tabla. La propiedad `:key` se utiliza para proporcionar una clave única a cada fila.

- `<td>`: Representa una celda de la tabla.

- `<button @click="viewUser(user)" class="btn btn-primary">Ver usuario</button>`: Es un botón que invoca el método `viewUser`
cuando se hace clic en él. Permite ver los detalles de un usuario.

- `<button @click="deactivateUser(user)" class="btn btn-danger">{{ user.status === "active" ? "Desactivar" : "Activar" }}</button>`: Es un botón que invoca el método `deactivateUser` cuando se hace clic en él. Dependiendo del estado del usuario (activo o inactivo), el botón muestra "Desactivar" o "Activar".

**Script:**

- `import { mapState, mapMutations } from "vuex";`: Importa las funciones `mapState` y `mapMutations` de Vuex para mapear el estado y las mutaciones a las propiedades y métodos del componente.

- `import Swal from "sweetalert2";`: Importa la biblioteca SweetAlert2 para mostrar mensajes de confirmación.

- `import axios from "axios";`: Importa Axios, una biblioteca para realizar solicitudes HTTP.

- `import { API_URL } from "@/config";`: Importa la URL de la API desde el archivo de configuración.

- `name: "UserList"`: Define el nombre del componente como "UserList".

- `data() { return { ... } }`: Define los datos del componente. Inicializa las propiedades `users`, que es un arreglo vacío para almacenar los usuarios obtenidos de la API, `searchQuery`, que es una cadena vacía para almacenar los criterios de búsqueda ingresados por el usuario, y `current_user_id`, que almacenará el ID del usuario actualmente autenticado.

- `computed: { ... }`: Define las propiedades computadas del componente. Utiliza `mapState` para mapear la propiedad `checkboxValue` del estado de la aplicación a la propiedad computada `checked`. También define la propiedad `filteredUsers`, que filtra los usuarios según los criterios de búsqueda ingresados por el usuario.

- `methods: { ... }`: Define los métodos del componente. Utiliza `mapMutations` para mapear la mutación `toggleCheckboxValue`. Define el método `handleCheckboxChange`, que invoca la mutación `toggleCheckboxValue` cuando cambia el estado del checkbox. También define los métodos `addUser`, `viewUser` y `deactivateUser`, que manejan la lógica para agregar un usuario, ver los detalles de un usuario y desactivar/activar un usuario respectivamente.

- `mounted() { ... }`: Se ejecuta después de que el componente se haya montado en el DOM. Invoca el método `fetchUsers` para obtener todos los usuarios desde la API. También asigna el ID del usuario actualmente autenticado a la propiedad `current_user_id` del componente.

**Estilos:**

Los estilos CSS definidos en la sección `<style>` son similares a los otros componente de listar. Se aplica un margen superior e inferior a los elementos del componente y se definen estilos para la tabla.
-->