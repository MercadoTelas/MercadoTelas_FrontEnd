<template>
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />
  <div class="container">
    <div class="row">
      <div class="col-md-12 mb-3 me-1 d-flex align-items-center">
        <div class="col-md-10 me-2">
          <label for="search" class="form-label">Buscar artículo:</label>
          <input type="text" id="search" class="form-control" v-model="searchQuery"
            placeholder="Buscar por cualquier característica" />
        </div>
        <div class="col-md-2 ms-2 align-self-center">
          <br />
          <button @click="addArticle" class="btn btn-success">
            Agregar artículo
          </button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="table-responsive col-md-12">
        <table class="table table-hover table-responsive table-bordered table-secondary">
          <thead>
            <tr>
              <th class="text-center">Código</th>
              <th class="text-center">Nombre</th>
              <th class="text-center">Categoría</th>
              <th class="text-center">Subcategoría</th>
              <th class="text-center">Inventario Mínimo</th>
              <th class="text-center">Estado</th>
              <th class="text-center">Marca</th>
              <th class="text-center">Diseño</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredArticles" :key="item.id">
              <td class="text-center">{{ item.id }}</td>
              <td class="text-center">{{ item.name }}</td>
              <td class="text-center">{{ item.category_name }}</td>
              <td class="text-center">{{ item.subcategory_name }}</td>
              <td class="text-center">
                {{ item.minimal_stock }} {{ item.storing_format_units_name }}
              </td>
              <td class="text-center">
                {{ item.status === "active" ? "Activo" : "Inactivo" }}
              </td>
              <td class="text-center">
                {{ item.brand_id !== null ? item.brand_name : "No posee" }}
              </td>
              <td class="text-center">
                {{ item.design_id !== null ? item.design_name : "No posee" }}
              </td>
              <td class="text-center">
                <router-link :to="{ name: 'ArticleDetails', params: { id: item.id } }" class="btn btn-primary">Ver
                  detalles</router-link>
                <router-link :to="{ name: 'EditArticle', params: { id: item.id } }"
                  class="btn btn-secondary">Editar</router-link>
                <button @click="deleteArticle(item)" class="btn btn-danger">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import { API_URL } from "@/config";

export default {
  name: "ArticleList",
  data() {
    return {
      items: [
        {
          id: "1",
          name: "Artículo 1",
          category_name: "Categoría 1",
          subcategory_name: "Subcategoría 1",
          minimal_stock: "10",
          status: "active",
          brand_name: "Marca 1",
          design_name: "Diseño 1",
        },
        {
          id: "2",
          name: "Artículo 2",
          category_name: "Categoría 2",
          subcategory_name: "Subcategoría 2",
          minimal_stock: "5",
          status: "inactive",
          brand_name: "Marca 2",
          design_name: "Diseño 2",
        },
      ],
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
    filteredArticles() {
      return this.items.filter((item) => {
        const search = this.searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(search) ||
          item.id.toLowerCase().includes(search) ||
          item.conversion_factor.toLowerCase().includes(search) ||
          item.minimal_stock.toLowerCase().includes(search) ||
          item.status.toLowerCase().includes(search) ||
          item.subcategory_name.toLowerCase().includes(search) ||
          item.category_name.toLowerCase().includes(search) ||
          (item.brand_name != null &&
            item.brand_name.toLowerCase().includes(search)) ||
          (item.design_name != null &&
            item.design_name.toLowerCase().includes(search))
        );
      });
    },
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    addArticle() {
      // Redireccionar a la vista de agregar artículo
      this.$router.push({ name: "AddArticle" });
    },
    viewItem(/*article*/) {
      // Lógica para ver los detalles de un artículo
      // ...
    },
    deleteArticle(article) {
      // Lógica para eliminar un artículo
      Swal.fire({
        title: "¿Estás seguro?",
        text: `Se eliminará el artículo ${article.name}. Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          toast.success(`Se ha eliminado el artículo correctamente`, {
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
    this.$state.navbarTitle = "Lista de Artículos";
    // Obtener todos los artículos desde la API
    axios
      .get(API_URL + "/items")
      .then((response) => {
        console.log(response.data);
        this.items = response.data.items;
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

Componente para lista articulos

El componente se llama "ArticleList" y representa una lista de artículos de inventario. Su propósito principal es mostrar los artículos, permitir la búsqueda, agregar nuevos artículos y eliminarlos.

Template:
---------

<input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />: Este elemento <input> representa un checkbox y está vinculado al dato checked utilizando v-model. Cuando cambia el estado del checkbox, se invoca el método handleCheckboxChange.

<div class="container">: Este contenedor envuelve todo el contenido del componente para aplicar estilos y establecer márgenes.

<div class="row">: Representa una fila de elementos dentro del contenedor.

<div class="col-md-12 mb-3 me-1 d-flex align-items-center">: Esta clase de columna contiene dos secciones: el formulario de búsqueda y el botón de agregar artículo. Está diseñada utilizando la biblioteca CSS Bootstrap.

<div class="col-md-10 me-2">: Esta clase de columna contiene el formulario de búsqueda. Incluye una etiqueta <label> y un <input> de tipo texto para ingresar el término de búsqueda.

<div class="col-md-2 ms-2 align-self-center">: Esta clase de columna contiene el botón para agregar un nuevo artículo. Está alineado verticalmente en el centro.

<table class="table table-hover table-responsive table-bordered table-secondary">: Esta tabla muestra los artículos en filas y columnas. Utiliza varias clases de Bootstrap para aplicar estilos y funcionalidades de tabla.

<thead>: La sección de encabezado de la tabla que contiene las etiquetas <th> para cada columna
  .
<tbody>: La sección del cuerpo de la tabla que contiene las filas generadas dinámicamente con la directiva v-for. Cada fila representa un artículo.

<tr v-for="item in filteredArticles" :key="item.id">: Esta directiva v-for itera sobre la lista de artículos filteredArticles y genera una fila por cada artículo. La propiedad :key asegura la identificación única de cada fila.

<td class="text-center">{{ item.id }}</td>: Cada celda representa un campo específico del artículo, como el ID, el nombre, la categoría, etc. Los datos del artículo se interpolan utilizando dobles llaves {{ }}.

Script:
-------
import { mapState, mapMutations } from "vuex";: Se importan las funciones mapState y mapMutations de Vuex, que permiten acceder al estado y a las mutaciones desde el componente.

import Swal from "sweetalert2";: Se importa la biblioteca SweetAlert2 para mostrar mensajes emergentes de confirmación.
import axios from "axios";: Se importa la biblioteca axios para realizar solicitudes HTTP a la API.

import { toast } from 'vue3-toastify';: Se importa la biblioteca vue3-toastify para mostrar notificaciones de éxito.
import 'vue3-toastify/dist/index.css';: Se importan los estilos CSS de vue3-toastify.

import { API_URL } from "@/config";: Se importa la constante API_URL del archivo de configuración.
export default { ... }: Se exporta el objeto que define el componente.

name: "ArticleList": El nombre del componente es "ArticleList".
data() { ... }: La función data retorna un objeto que contiene los datos del componente. items es una lista de artículos de ejemplo y searchQuery es una cadena de texto vacía utilizada para la búsqueda.

computed: { ... }: Define propiedades computadas que se actualizan automáticamente cuando cambian los datos subyacentes. Aquí se utiliza la función mapState para acceder al valor del checkbox del estado de Vuex.

methods: { ... }: Define los métodos utilizados en el componente. handleCheckboxChange invoca la mutación toggleCheckboxValue de Vuex cuando cambia el estado del checkbox. addArticle redirige al usuario a la vista de agregar artículo utilizando this.$router.push(). deleteArticle muestra un mensaje de confirmación utilizando SweetAlert2 y, si se confirma, muestra una notificación de éxito utilizando vue3-toastify.

mounted() { ... }: Este gancho de ciclo de vida se ejecuta después de que el componente se haya montado en el DOM. Aquí se establece el título de la barra de navegación y se realiza una solicitud GET a la API para obtener los artículos. Los datos se asignan a la propiedad items.

Estilos CSS:
-----------

#check:checked ~ .container { ... }: Este selector CSS aplica estilos al contenedor cuando el checkbox está marcado. Establece un margen izquierdo y un ancho máximo al contenedor.
.container { ... }: Establece los estilos para el contenedor, como el relleno superior e inferior.

.text-primary { ... }: Establece el color de texto primario a azul.

.table { ... }: Establece los estilos para la tabla, como el margen superior.

.table th, .table td { ... }: Establece los estilos para las celdas de encabezado y celdas de datos en la tabla, como el relleno y la alineación vertical.

.table th { ... }: Establece los estilos específicos para las celdas de encabezado de la tabla.

@media (max-width: 576px) { ... }: Aplica estilos adicionales a la tabla cuando la pantalla tiene un ancho máximo de 576 píxeles, lo que lo hace responsive en dispositivos móviles.
-->
