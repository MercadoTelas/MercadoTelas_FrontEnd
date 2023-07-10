<template>
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="mb-3">
          <label for="search" class="form-label">Buscar categoría:</label>
          <input type="text" id="search" class="form-control" v-model="searchQuery" placeholder="Buscar por nombre" />
        </div>
        <div class="row">
          <div class="col-md-12">
            <button @click="addCategory" class="btn btn-success">
              Agregar categoría
            </button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-responsive table-bordered table-secondary">
            <thead>
              <tr>
                <th class="text-center">Nombre de Categoría</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in filteredCategories" :key="category.name">
                <td class="text-center">{{ category.name }}</td>
                <td class="text-center">
                  <button @click="editCategory(category)" class="btn btn-primary">
                    Editar categoría
                  </button>
                  <button @click="deleteCategory(category)" class="btn btn-danger">
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
import axios from "axios";
import { API_URL } from "@/config";
import Swal from "sweetalert2";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: "CategoryList",
  data() {
    return {
      categories: [],
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
    filteredCategories() {
      return this.categories.filter((category) => {
        return category.name
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
    addCategory() {
      // Redirigir a la vista de agregar categoría
      this.$router.push({ name: "AddCategory" });
    },
    editCategory(category) {
      // Redirigir a la vista de editar categoría
      this.$router.push({ name: "EditCategory", params: { id: category.id } });
    },
    deleteCategory(category) {
      // Lógica para eliminar una categoría
      Swal.fire({
        title: "¿Estás seguro?",
        text: `Se eliminará la categoría ${category.name}. Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          // Lógica para eliminar la categoría aquí
          // ...
          this.categories = this.categories.filter((c) => c.id !== category.id);
          toast.success(`Se ha eliminado la categoría correctamente`, {
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
    this.$state.navbarTitle = "Lista de Categorías";
    // Obtener todas las categorías desde la API
    axios
      .get(API_URL + "/categories")
      .then((response) => {
        this.categories = response.data;
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

Componente para listar las categorias
**Template:**

- `<input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />`: Este elemento `<input>` es un checkbox que está vinculado a la propiedad `checked` utilizando la directiva `v-model`. Cuando el estado del checkbox cambia, se invoca el método `handleCheckboxChange`.

- `<div class="container">`: Es el contenedor principal del componente.

- `<div class="row">`: Representa una fila de elementos dentro del contenedor.

- `<div class="col-md-8 offset-md-2">`: Es una columna que ocupa 8 columnas de ancho en dispositivos medianos (`md`) y se desplaza hacia la derecha en 2 columnas (`offset-md-2`).

- `<div class="mb-3">`: Contiene una etiqueta y un campo de entrada para buscar categorías.

- `<label for="search" class="form-label">Buscar categoría:</label>`: Es una etiqueta que describe el campo de entrada.
- `<input type="text" id="search" class="form-control" v-model="searchQuery" placeholder="Buscar por nombre" />`: Es un campo de entrada de texto vinculado a la propiedad `searchQuery` utilizando `v-model`. Permite al usuario buscar categorías por nombre.

- `<div class="row">`: Es otra fila de elementos.

- `<div class="col-md-12">`: Es una columna que ocupa 12 columnas de ancho en dispositivos medianos. Contiene un botón para agregar una nueva categoría.

- `<button @click="addCategory" class="btn btn-success">Agregar categoría</button>`: Es un botón que invoca el método `addCategory` cuando se hace clic en él.

- `<div class="table-responsive">`: Contiene una tabla que muestra las categorías.

- `<table class="table table-responsive table-bordered table-secondary">`: Es una tabla que muestra las categorías en filas y columnas.
- `<thead>`: Define el encabezado de la tabla.

- `<tr>`: Representa una fila en el encabezado de la tabla.

- `<th class="text-center">Nombre de Categoría</th>`: Es una celda del encabezado de la tabla que muestra el nombre de la categoría.

- `<th class="text-center">Acciones</th>`: Es una celda del encabezado de la tabla que muestra las acciones disponibles para cada categoría.

- `<tbody>`: Define el cuerpo de la tabla.

- `<tr v-for="category in filteredCategories" :key="category.name">`: Utiliza la directiva `v-for` para iterar sobre cada categoría en la propiedad `filteredCategories`. Cada categoría se representa como una fila en la tabla. La propiedad `:key` se utiliza para proporcionar una clave única a cada fila.

- `<td class="text-center">{{ category.name }}</td>`: Es una celda de la tabla que muestra el nombre de cada categoría.

- `<td class="text-center">`: Es una celda de la tabla que contiene botones de acción para editar y eliminar categorías.

- `<button @click="editCategory(category)" class="btn
btn-primary">Editar categoría</button>`: Es un botón que invoca el método `editCategory` cuando se hace clic en él. Permite editar una categoría específica.

- `<button @click="deleteCategory(category)" class="btn btn-danger">Eliminar</button>`: Es un botón que invoca el método `deleteCategory` cuando se hace clic en él. Permite eliminar una categoría específica.

**Script:**

- `import { mapState, mapMutations } from "vuex";`: Importa las funciones `mapState` y `mapMutations` de Vuex para mapear el estado y las mutaciones a las propiedades y métodos del componente.

- `import axios from "axios";`: Importa Axios, una biblioteca para realizar solicitudes HTTP.

- `import { API_URL } from "@/config";`: Importa la URL de la API desde el archivo de configuración.

- `import Swal from "sweetalert2";`: Importa SweetAlert2, una biblioteca para mostrar mensajes de confirmación.

- `import { toast } from 'vue3-toastify';`: Importa la biblioteca vue3-toastify para mostrar notificaciones de éxito.

- `name: "CategoryList"`: Define el nombre del componente como "CategoryList".

- `data() { return { ... } }`: Define los datos del componente. Inicializa dos propiedades: `categories`, que es un arreglo vacío para almacenar las categorías obtenidas de la API, y `searchQuery`, que es una cadena vacía para almacenar el término de búsqueda ingresado por el usuario.
- `computed: { ... }`: Define las propiedades computadas del componente. Utiliza `mapState` para mapear la propiedad `checkboxValue` del estado de la aplicación a la propiedad computada `checked`. También define la propiedad `filteredCategories`, que filtra las categorías según el término de búsqueda ingresado por el usuario.

- `methods: { ... }`: Define los métodos del componente. Utiliza `mapMutations` para mapear la mutación `toggleCheckboxValue`. Define los métodos `handleCheckboxChange`, `addCategory`, `editCategory` y `deleteCategory`. `handleCheckboxChange` invoca la mutación `toggleCheckboxValue` cuando cambia el estado del checkbox. `addCategory` redirige al usuario a la página para agregar una nueva categoría. `editCategory` redirige al usuario a la página para editar una categoría específica. `deleteCategory` muestra un mensaje de confirmación utilizando SweetAlert2 y, si el usuario confirma la acción, elimina la categoría y muestra una notificación de éxito utilizando vue3-toastify.

- `mounted() { ... }`: Se ejecuta después de que el componente se haya montado en el DOM. Actualiza la propiedad `navbarTitle` del estado de la aplicación y obtiene todas las categorías desde la API utilizando Axios. Los datos obtenidos se asignan a la propiedad `categories` del componente.

**Estilos:**
Los estilos CSS definidos en la sección `<style>` son similares a los explicados anteriormente. Se aplica un margen izquierdo y un ancho máximo al contenedor cuando el checkbox `#check` está marcado. También se definen estilos para la tabla, los encabezados y las celdas de la tabla.

-->