<template>
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />

  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="mb-3">
          <label for="search" class="form-label">Buscar bodega:</label>
          <input type="text" id="search" class="form-control" v-model="searchQuery" placeholder="Buscar por nombre" />
        </div>

        <div class="row">
          <div class="col-md-12">
            <button @click="addWarehouse" class="btn btn-success">
              Agregar bodega
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-responsive table-bordered table-secondary">
            <thead>
              <tr>
                <th class="text-center">Nombre de Bodega</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="warehouse in filteredWarehouses" :key="warehouse.name">
                <td class="text-center">{{ warehouse.name }}</td>
                <td class="text-center">
                  <router-link :to="{
                    name: 'EditWarehouse',
                    params: { id: warehouse.id },
                  }" class="btn btn-secondary">Editar</router-link>
                  <button @click="deleteWarehouse(warehouse)" class="btn btn-danger">
                    Eliminar
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
  name: "WarehouseList",
  data() {
    return {
      warehouses: [],
      searchQuery: "",
    };
  },
  computed: {
    ...mapState(["checkboxValue"]),
    checked: {
      get() {
        return this.checkboxValue;
      },
    },
    filteredWarehouses() {
      return this.warehouses.filter((warehouse) => {
        return warehouse.name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
      });
    },
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    addWarehouse() {
      // Redirigir a la vista de agregar bodega
      this.$router.push({ name: "AddWarehouse" });
    },
    deleteWarehouse(warehouse) {
      // Lógica para eliminar una bodega
      Swal.fire({
        title: "¿Estás seguro?",
        text: `Se eliminará la bodega ${warehouse.name}. Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          toast.success(`Se ha eliminado la bodega correctamente`, {
            position: 'top-right',
            timeout: 2000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
          });

        }
      });
    },
  },
  mounted() {
    this.$state.navbarTitle = "Lista de Bodegas";
    // Obtener todas las bodegas desde la API
    axios
      .get(`${API_URL}/warehouses`)
      .then((response) => {
        this.warehouses = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
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

Componente para listas las bodegas

**Template:**

- `<input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />`: Este elemento `<input>` es un checkbox que está vinculado a la propiedad `checked` utilizando la directiva `v-model`. Cuando el estado del checkbox cambia, se invoca el método `handleCheckboxChange`.

- `<div class="container">`: Es el contenedor principal del componente.

- `<div class="row">`: Representa una fila de elementos dentro del contenedor.

- `<div class="col-md-8 offset-md-2">`: Representa una columna de ancho medio con un desplazamiento hacia la derecha.

- `<div class="mb-3">`: Contiene una etiqueta y un campo de búsqueda.

- `<label for="search" class="form-label">Buscar bodega:</label>`: Es una etiqueta para el campo de búsqueda.

- `<input type="text" id="search" class="form-control" v-model="searchQuery" placeholder="Buscar por nombre" />`: Es un campo de entrada de texto que está vinculado a la propiedad `searchQuery` utilizando la directiva `v-model`. Permite al usuario buscar bodegas por nombre.

- `<div class="row">`: Representa una fila dentro de la columna.

- `<div class="col-md-12">`: Representa una columna de ancho medio.

- `<button @click="addWarehouse" class="btn btn-success">Agregar bodega</button>`: Es un botón que invoca el método `addWarehouse` cuando se hace clic en él. Permite agregar una nueva bodega.

- `<div class="table-responsive">`: Es un contenedor para la tabla de bodegas. Proporciona un desplazamiento horizontal cuando el contenido de la tabla excede el ancho del contenedor.

- `<table class="table table-responsive table-bordered table-secondary">`: Es una tabla que muestra las bodegas.

- `<thead>`: Define el encabezado de la tabla.

- `<tr>`: Representa una fila en el encabezado de la tabla.

- `<th class="text-center">Nombre de Bodega</th>`: Representa una celda del encabezado de la tabla.

- `<tbody>`: Define el cuerpo de la tabla.

- `<tr v-for="warehouse in filteredWarehouses" :key="warehouse.name">`: Utiliza la directiva `v-for` para iterar sobre cada bodega en la propiedad `filteredWarehouses`. Cada bodega se representa como una fila en la tabla. La propiedad `:key` se utiliza para proporcionar una clave única a cada fila.

- `<td class="text-center">{{ warehouse.name }}</td>`: Representa una celda de la tabla que muestra el nombre de la bodega.

- `<td class="text-center">`: Representa una celda de la tabla que contiene botones de acción.

- `<router-link :to="...">`: Es un enlace de Vue Router que redirige a la vista de edición de una bodega cuando se hace clic en él.

- `<button @click="deleteWarehouse(warehouse)" class="btn btn-danger">Eliminar</button>`: Es un botón que invoca el método
`deleteWarehouse` cuando se hace clic en él. Permite eliminar una bodega.

- `<style>`: Define los estilos CSS para el componente, como el tamaño de la tabla, el espaciado y el color.

**Script:**

- `import { mapState, mapMutations } from "vuex";`: Importa las funciones `mapState` y `mapMutations` de Vuex para mapear el estado y las mutaciones a las propiedades y métodos del componente.

- `import Swal from "sweetalert2";`: Importa la biblioteca SweetAlert2 para mostrar mensajes de confirmación.

- `import axios from "axios";`: Importa Axios, una biblioteca para realizar solicitudes HTTP.

- `import { API_URL } from "@/config";`: Importa la URL de la API desde el archivo de configuración.

- `name: "WarehouseList"`: Define el nombre del componente como "WarehouseList".

- `data() { return { ... } }`: Define los datos del componente. Inicializa las propiedades `warehouses`, que es un arreglo vacío para almacenar las bodegas obtenidas de la API, y `searchQuery`, que es una cadena vacía para almacenar los criterios de búsqueda ingresados por el usuario.

- `computed: { ... }`: Define las propiedades computadas del componente. Utiliza `mapState` para mapear la propiedad `checkboxValue` del estado de la aplicación a la propiedad computada `checked`. También define la propiedad `filteredWarehouses`, que filtra las bodegas según los criterios de búsqueda ingresados por el usuario.

- `methods: { ... }`: Define los métodos del componente. Utiliza `mapMutations` para mapear la mutación `toggleCheckboxValue`. Define el método `handleCheckboxChange`, que invoca la mutación

`toggleCheckboxValue` cuando cambia el estado del checkbox. También define los métodos `addWarehouse` y `deleteWarehouse`, que manejan la lógica para agregar y eliminar una bodega respectivamente.

- `mounted() { ... }`: Se ejecuta después de que el componente se haya montado en el DOM. Invoca el método `fetchWarehouses` para obtener todas las bodegas desde la API.

**Estilos:**
Los estilos CSS definidos en la sección `<style>` son similares a los explicados en los otros componente de listar. Se aplica un margen superior e inferior a los elementos del componente y se definen estilos para la tabla.

-->
