<template>
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="mb-3">
          <label for="search" class="form-label">Buscar diseño:</label>
          <input type="text" id="search" class="form-control" v-model="searchQuery" placeholder="Buscar por nombre" />
        </div>
        <div class="row">
          <div class="col-md-12">
            <button @click="addDesign" class="btn btn-success">
              Agregar diseño
            </button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-responsive table-bordered table-secondary">
            <thead>
              <tr>
                <th class="text-center">Nombre de Diseño</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="design in filteredDesigns" :key="design.name">
                <td class="text-center">{{ design.name }}</td>
                <td class="text-center">
                  <button @click="editDesign(design)" class="btn btn-secondary">
                    Editar
                  </button>
                  <button @click="deleteDesign(design)" class="btn btn-danger">
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
  name: "DesignList",
  data() {
    return {
      designs: [],
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
    filteredDesigns() {
      return this.designs.filter((design) => {
        return design.name
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
    addDesign() {
      // Redirigir a la vista "Agregar Diseño"
      this.$router.push({ name: "AddDesign" });
    },
    editDesign(design) {
      // Redirigir a la vista "Editar Diseño" con el ID del diseño
      this.$router.push({ name: "EditDesign", params: { id: design.id } });
    },
    deleteDesign(design) {
      // Lógica para eliminar un diseño
      Swal.fire({
        title: "¿Estás seguro?",
        text: `Se eliminará el diseño ${design.name}. Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          toast.success(`Se ha eliminado el diseño correctamente`, {
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
    this.$state.navbarTitle = "Lista de Diseños";
    // Obtener todos los diseños desde la API
    axios
      .get(`${API_URL}/designs`)
      .then((response) => {
        this.designs = response.data;
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

Componente para listar los diseños

**Template:**

- `<input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />`: Este elemento `<input>` es un checkbox que está vinculado a la propiedad `checked` utilizando la directiva `v-model`. Cuando el estado del checkbox cambia, se invoca el método `handleCheckboxChange`.

- `<div class="container">`: Es el contenedor principal del componente.

- `<div class="row">`: Representa una fila de elementos dentro del contenedor.

- `<div class="col-md-8 offset-md-2">`: Es una columna que ocupa 8 columnas de ancho en dispositivos medianos (`md`) y se desplaza hacia la derecha en 2 columnas (`offset-md-2`).

- `<div class="mb-3">`: Contiene una etiqueta y un campo de entrada para buscar diseños.

- `<label for="search" class="form-label">Buscar diseño:</label>`: Es una etiqueta que describe el campo de entrada.

- `<input type="text" id="search" class="form-control" v-model="searchQuery" placeholder="Buscar por nombre" />`: Es un campo de entrada de texto vinculado a la propiedad `searchQuery` utilizando `v-model`. Permite al usuario buscar diseños por nombre.

- `<div class="row">`: Es otra fila de elementos.

- `<div class="col-md-12">`: Es una columna que ocupa 12 columnas de ancho en dispositivos medianos. Contiene un botón para agregar un nuevo diseño.

- `<button @click="addDesign" class="btn btn-success">Agregar diseño</button>`: Es un botón que invoca el método `addDesign` cuando se hace clic en él.

- `<div class="table-responsive">`: Contiene una tabla que muestra los diseños.

- `<table class="table table-responsive table-bordered table-secondary">`: Es una tabla que muestra los diseños en filas y columnas.

- `<thead>`: Define el encabezado de la tabla.

- `<tr>`: Representa una fila en el encabezado de la tabla.

- `<th class="text-center">Nombre de Diseño</th>`: Es una celda del encabezado de la tabla que muestra el nombre del diseño.

- `<th class="text-center">Acciones</th>`: Es una celda del encabezado de la tabla que muestra las acciones disponibles para cada diseño.

- `<tbody>`: Define el cuerpo de la tabla.

- `<tr v-for="design in filteredDesigns" :key="design.name">`: Utiliza la directiva `v-for` para iterar sobre cada diseño en la propiedad `filteredDesigns`. Cada diseño se representa como una fila en la tabla. La propiedad `:key` se utiliza para proporcionar una clave única a cada fila.

- `<td class="text-center">{{ design.name }}</td>`: Es una celda de la tabla que muestra el nombre de cada diseño.

- `<td class="text-center">`: Es una celda de la tabla que contiene botones de acción para editar y eliminar diseños.

- `<button @click="editDesign(design)" class="btn btn-secondary">Editar</button>`: Es un botón que invoca el método `editDesign` cuando se hace clic en él. Permite editar un diseño específico.

- `<button @click="deleteDesign(design)" class="btn btn-danger">Eliminar</button>`: Es un botón que invoca el método `deleteDesign` cuando se hace clic en él. Permite eliminar un diseño específico.

**Script:**

- `import { mapState, mapMutations } from "vuex";`: Importa las funciones `mapState` y `mapMutations` de Vuex para mapear el estado y las mutaciones a las propiedades y métodos del componente.

- `import axios from "axios";`: Importa Axios, una biblioteca para realizar solicitudes HTTP.

- `import { API_URL } from "@/config";`: Importa la URL de la API desde el archivo de configuración.

- `import Swal from "sweetalert2";`: Importa SweetAlert2, una biblioteca para mostrar mensajes de confirmación.

- `import { toast } from 'vue3-toastify';`: Importa la biblioteca vue3-toastify para mostrar notificaciones de éxito.

- `name: "DesignList"`: Define el nombre del componente como "DesignList".

- `data() { return { ... } }`: Define los datos del componente. Inicializa dos propiedades: `designs`, que es un arreglo vacío para almacenar los diseños obtenidos de la API, y `searchQuery`, que es una cadena vacía para almacenar el término de búsqueda ingresado por el usuario.

- `computed: { ... }`: Define las propiedades computadas del componente. Utiliza `mapState` para mapear la propiedad `checkboxValue` del estado de la aplicación a la propiedad computada `checked`. También define la propiedad `filteredDesigns`, que filtra los diseños según el término de búsqueda ingresado por el usuario.

- `methods: { ... }`: Define los métodos del componente. Utiliza `mapMutations` para mapear la mutación `toggleCheckboxValue`. Define los métodos `handleCheckboxChange`, `addDesign`, `editDesign` y `deleteDesign`. `handleCheckboxChange` invoca la mutación `toggleCheckboxValue` cuando cambia el estado del checkbox. `addDesign` redirige al usuario a la página para agregar un nuevo diseño. `editDesign` redirige al usuario a la página para editar un diseño específico. `deleteDesign` muestra un mensaje de confirmación utilizando SweetAlert2 y, si el usuario confirma la acción, elimina el diseño y muestra una notificación de éxito utilizando vue3-toastify.

- `mounted() { ... }`: Se ejecuta después de que el componente se haya montado en el DOM. Actualiza la propiedad `navbarTitle` del estado de la aplicación y obtiene todos los diseños desde la API utilizando Axios. Los datos obtenidos se asignan a la propiedad `designs` del componente.

**Estilos:**
Los estilos CSS definidos en la sección `<style>` son similares a al componente de listar categorias. Se aplica un margen izquierdo y un ancho máximo al contenedor cuando el checkbox `#check` está marcado. También se definen estilos para la tabla, los encabezados y las celdas de la tabla.
-->
