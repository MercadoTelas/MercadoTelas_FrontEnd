<template>
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />
  <div class="container-fluid">
    <div class="row">
      <div id="contentDiv" class="col-lg-10 col-md-12">
        <div class="table-container">
          <h2 class="filter-title text-primary">Filtros</h2>
          <div class="filters-container row">
            <div class="col-md-2">
              <div class="form-group">
                <label for="codigo">Código de Artículo:</label>
                <input type="text" id="codigo" class="form-control" v-model="filter.id" placeholder="Código" />
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="category">Categoría:</label>
                <select id="category" class="form-control" v-model="filter.category" @change="resetSubcategory()">
                  <option value="" disabled>Seleccionar categoría</option>
                  <option v-for="category in categories" :value="category.name" :key="category.name">
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="subcategory">Subcategoría:</label>
                <select id="subcategory" class="form-control" v-model="filter.subcategory">
                  <option value="" disabled selected>
                    Seleccionar subcategoría
                  </option>
                  <option v-for="subcategory in filteredSubcategories" :value="subcategory.name" :key="subcategory.name">
                    {{ subcategory.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="design">Diseño:</label>
                <select id="design" class="form-control" v-model="filter.design">
                  <option value="" disabled selected>Seleccionar diseño</option>
                  <option v-for="design in designs" :value="design.name" :key="design.name">
                    {{ design.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="brand">Marca:</label>
                <select id="brand" class="form-control" v-model="filter.brand">
                  <option value="" selected disabled>Seleccionar marca</option>
                  <option v-for="brand in brands" :value="brand.name" :key="brand.name">
                    {{ brand.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="warehouse">Bodega:</label>
                <select id="warehouse" class="form-control" v-model="filter.warehouse">
                  <option value="" selected disabled>Seleccionar bodega</option>
                  <option v-for="warehouse in warehouses" :value="warehouse.name" :key="warehouse.name">
                    {{ warehouse.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Unidades de Entrada</th>
                  <th>Unidades de Salida</th>
                  <th>Bodega</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredItems" :key="item.id">
                  <td>{{ item.item_id }}</td>
                  <td>{{ item.name }}</td>
                  <td>
                    {{ item.storing_format_units }}
                    {{ item.storing_unit_format_name }}
                  </td>
                  <td>
                    {{ item.transferring_format_units }}
                    {{ item.transferring_unit_format_name }}
                  </td>
                  <td>{{ item.warehouse }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from "@/config";
import { mapState, mapMutations } from "vuex";

export default {
  name: "InventoryTable",
  data() {
    return {
      filter: {
        id: "",
        category: "",
        subcategory: "",
        design: "",
        brand: "",
        warehouse: "",
      },
      items: [],
      categories: [],
      designs: [],
      brands: [],
      warehouses: [],
    };
  },
  computed: {
    ...mapState(["checkboxValue"]),
    checked: {
      get() {
        return this.checkboxValue;
      },
    },
    filteredSubcategories() {
      return this.categories
        .filter((category) => {
          return category.name === this.filter.category;
        })
        .map((category) => {
          return category.subcategories;
        })
        .flat();
    },
    filteredItems() {
      return this.items.filter((item) => {
        return (
          item.item_id.toUpperCase().includes(this.filter.id.toUpperCase()) &&
          (this.filter.category === "" ||
            item.category === this.filter.category) &&
          (this.filter.subcategory === "" ||
            item.subcategory === this.filter.subcategory) &&
          (this.filter.design === "" || item.design === this.filter.design) &&
          (this.filter.brand === "" || item.brand === this.filter.brand) &&
          (this.filter.warehouse === "" ||
            item.warehouse === this.filter.warehouse)
        );
      });
    },
  },
  mounted() {
    this.$state.navbarTitle = "Inventario";
    //Gets the all elements from the API
    axios
      .get(API_URL + "/inventory_items")
      .then((response) => {
        this.items = response.data.items;
        this.categories = response.data.categories;
        this.designs = response.data.designs;
        this.brands = response.data.brands;
        this.warehouses = response.data.warehouses;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    resetSubcategory() {
      this.filter.subcategory = "";
    },
  },
};
</script>

<style>
#check:checked~.container-fluid {
  padding-left: 345px;
}

#check:checked~#contentDiv {
  height: auto;
  display: block;
}

.container-fluid div {
  justify-content: center;
  align-items: center;
}

.table-container {
  margin-top: 20px;
}

.filters-container {
  margin-bottom: 10px;
}

.filters-container div {
  margin-left: 0px;
}

.buttonClass {
  margin-right: 1000px;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}


.table th,
.table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  background-color: #f2f2f2;
}

.button-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  /* Agrega esta línea para envolver los botones en dispositivos móviles */
  align-items: flex-start;
  /* Alinea los botones al costado izquierdo en dispositivos móviles */
}

.button-group {
  display: flex;
  gap: 8px;
}

.button-group button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  cursor: pointer;
}

.button-group button:hover {
  background-color: #45a049;
}

.button-container button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  cursor: pointer;
}

.button-container button:hover {
  background-color: #e53935;
}

.filter-title {
  margin-bottom: 20px;
}

.text-primary {
  color: #007bff;
}

.container-fluid {
  padding: 20px;
}

#contentDiv {
  height: 100%;
}
</style>

<!--
  Componente para la lista de inventario

Estructura del Template
-----------------------

El bloque `<template>` define la estructura del componente utilizando elementos HTML y directivas de Vue.js. A continuación se explica cada elemento en el componente:

- `<input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />`: Checkbox que se utiliza para mostrar u ocultar el panel de filtros. Utiliza la directiva `v-model` para vincular su estado a la propiedad `checked` en el componente y el evento `@change` para invocar el método `handleCheckboxChange` cuando cambia el estado.

- `<div class="container-fluid">`: Contenedor principal del componente. Utiliza la clase `container-fluid` de Bootstrap para ocupar todo el ancho disponible.

- `<div class="row">`: Fila que contiene el contenido del componente.

- `<div id="contentDiv" class="col-lg-10 col-md-12">`: Columna que contiene el contenido principal del componente. Utiliza las clases de Bootstrap `col-lg-10` y `col-md-12` para establecer el ancho de la columna en diferentes tamaños de pantalla. También tiene un ID `contentDiv` que se utiliza en los estilos CSS.

- `<div class="table-container">`: Contenedor para la tabla y los filtros. Utiliza la clase `table-container`.

- `<h1 class="filter-title text-primary">Filtros</h1>`: Título de los filtros. Utiliza las clases `filter-title` y `text-primary` para aplicar estilos.

- `<div class="filters-container row">`: Contenedor para los filtros. Utiliza la clase `filters-container` y `row` para crear una fila.

- `<div class="col-md-2">`: Columna para el filtro de código de artículo. Utiliza la clase `col-md-2` para establecer el ancho de la columna en dispositivos medianos.

- `<div class="form-group">`: Contenedor para el filtro de código de artículo.

- `<label for="codigo">Código de Artículo:</label>`: Etiqueta del filtro de código de artículo.

- `<input type="text" id="codigo" class="form-control" v-model="filter.id" placeholder="Código" />`: Campo de entrada de texto para el filtro de código de artículo. Utiliza la directiva `v-model` para vincular su valor a la propiedad `filter.id` en el componente.

- `<div class="col-md-2">`: Columna para el filtro de categoría. Utiliza la clase `col-md-2` para establecer el ancho de la columna en dispositivos medianos.

- `<div class="form-group">`: Contenedor para el filtro de categoría.

- `<label for="category">Categoría:</label>`: Etiqueta del filtro de categoría.

- `<select id="category" class="form-control" v-model="filter.category" @change="resetSubcategory()">`: Selector de categoría. Utiliza la directiva `v-model` para vincular su valor a la propiedad `filter.category` en el componente y el evento `@change` para invocar el método `resetSubcategory` cuando cambia la selección.

- `<option v-for="category in categories" :value="category.name" :key="category.name">{{ category.name }}</option>`: Opciones del selector de categoría. Utiliza la directiva `v-for` para iterar sobre la matriz `categories` y generar opciones para cada categoría.

- `<div class="col-md-2">`: Columna para el filtro de subcategoría. Utiliza la clase `col-md-2` para establecer el ancho de la columna en dispositivos medianos.

- `<div class="form-group">`: Contenedor para el filtro de subcategoría.

- `<label for="subcategory">Subcategoría:</label>`: Etiqueta del filtro de subcategoría.

- `<select id="subcategory" class="form-control" v-model="filter.subcategory">`: Selector de subcategoría. Utiliza la directiva `v-model` para vincular su valor a la propiedad `filter.subcategory` en el componente.

- `<option v-for="subcategory in filteredSubcategories" :value="subcategory.name" :key="subcategory.name">{{ subcategory.name }}</option>`: Opciones del selector de subcategoría. Utiliza la directiva `v-for` para iterar sobre la matriz `filteredSubcategories` y generar opciones para cada subcategoría.

- `<div class="col-md-2">`: Columna para el filtro de diseño. Utiliza la clase `col-md-2` para establecer el ancho de la columna en dispositivos medianos.

- `<div class="form-group">`: Contenedor para el filtro de diseño.

- `<label for="design">Diseño:</label>`: Etiqueta del filtro de diseño.

- `<select id="design" class="form-control" v-model="filter.design">`: Selector de diseño. Utiliza la directiva `v-model` para vincular su valor a la propiedad `filter.design` en el componente.

- `<option v-for="design in designs" :value="design.name" :key="design.name">{{ design.name }}</option>`: Opciones del selector de diseño. Utiliza la directiva `v-for` para iterar sobre la matriz `designs` y generar opciones para cada diseño.

- `<div class="col-md-2">`: Columna para el filtro de marca. Utiliza la clase `col-md-2` para establecer el ancho de la columna en dispositivos medianos.

- `<div class="form-group">`: Contenedor para el filtro de marca.

- `<label for="brand">Marca:</label>`: Etiqueta del filtro de marca.

- `<select id="brand" class="form-control" v-model="filter.brand">`: Selector de marca. Utiliza la directiva `v-model` para vincular su valor a la propiedad `filter.brand` en el componente.

- `<option v-for="brand in brands" :value="brand.name" :key="brand.name">{{ brand.name }}</option>`: Opciones del selector de marca. Utiliza la directiva `v-for` para iterar sobre la matriz `brands` y generar opciones para cada marca.

- `<div class="col-md-auto">`: Columna para el filtro de bodega. Utiliza la clase `col-md-auto` para ajustar el ancho de la columna automáticamente.

- `<div class="form-group">`: Contenedor para el filtro de bodega.

- `<label for="warehouse">Bodega:</label>`: Etiqueta del filtro de bodega.

- `<select id="warehouse" class="form-control" v-model="filter.warehouse">`: Selector de bodega. Utiliza la directiva `v-model` para vincular su valor a la propiedad `filter.warehouse` en el componente.

- `<option v-for="warehouse in warehouses" :value="warehouse.name" :key="warehouse.name">{{ warehouse.name }}</option>`: Opciones del selector de bodega.

Continuación de la descripción del código:

- `<div class="table-responsive">`: Contenedor para hacer que la tabla sea responsive. Utiliza la clase `table-responsive`.

- `<table class="table">`: Tabla que muestra los datos filtrados. Utiliza la clase `table` de Bootstrap.

- `<thead>`: Cabecera de la tabla.

- `<tr>`: Fila de la cabecera.

- `<th>Código</th>`: Celda de la cabecera para el código.

- `<th>Nombre</th>`: Celda de la cabecera para el nombre.

- `<th>Unidades de Entrada</th>`: Celda de la cabecera para las unidades de entrada.

- `<th>Unidades de Salida</th>`: Celda de la cabecera para las unidades de salida.

- `<th>Bodega</th>`: Celda de la cabecera para la bodega.

- `<tbody>`: Cuerpo de la tabla.

- `<tr v-for="item in filteredItems" :key="item.id">`: Fila de la tabla para cada elemento filtrado. Utiliza la directiva `v-for` para iterar sobre la matriz `filteredItems` y generar filas para cada elemento.

- `<td>{{ item.item_id }}</td>`: Celda para mostrar el código del artículo.

- `<td>{{ item.name }}</td>`: Celda para mostrar el nombre del artículo.

- `<td>{{ item.storing_format_units }} {{ item.storing_unit_format_name }}</td>`: Celda para mostrar las unidades de entrada del artículo.

- `<td>{{ item.transferring_format_units }} {{ item.transferring_unit_format_name }}</td>`: Celda para mostrar las unidades de salida del artículo.

- `<td>{{ item.warehouse }}</td>`: Celda para mostrar la bodega del artículo.

Estructura del Script
---------------------

El bloque `<script>` contiene la lógica del componente y define los datos y métodos utilizados en el template. A continuación se explica cada sección del script:

- `import axios from "axios";`: Importa el módulo `axios` para realizar solicitudes HTTP.

- `import { API_URL } from "@/config";`: Importa la variable `API_URL` desde el módulo de configuración.

- `import { mapState, mapMutations } from "vuex";`: Importa las funciones `mapState` y `mapMutations` de Vuex para mapear el estado y las mutaciones del store en el componente.

- `export default { ... }`: Exporta el objeto que define el componente.

- `name: "InventoryTable",`: Propiedad `name` que establece el nombre del componente.

- `data() { ... }`: Método que devuelve un objeto con los datos del componente.

  - `filter`: Objeto que almacena los valores de los filtros.

  - `items`: Arreglo que almacena los elementos obtenidos de la API.

  - `categories`, `designs`, `brands`, `warehouses`: Arreglos que almacenan las categorías, diseños, marcas y bodegas obtenidas de la API.

- `computed: { ... }`: Sección que contiene las propiedades computadas utilizadas en el componente.

  - `...mapState(["checkboxValue"])`: Mapea la propiedad `checkboxValue` del store al componente.

  - `checked: { get() { return this.checkboxValue; }, }`: Propiedad computada `checked` que obtiene el valor de `checkboxValue`.

  - `filteredSubcategories() { ... }`: Propiedad computada que filtra las subcategorías según la categoría seleccionada.

  - `filteredItems() { ... }`: Propiedad computada que filtra los elementos según los filtros aplicados.

- `mounted() { ... }`: Método que se ejecuta después de que el componente se haya montado en el DOM. Establece el título de la barra de navegación y realiza una solicitud GET a la API para obtener los elementos, categorías, diseños, marcas y bodegas.

- `methods: { ... }`: Sección que contiene los métodos utilizados en el componente.

  - `...mapMutations(["toggleCheckboxValue"])`: Mapea la mutación `toggleCheckboxValue` del store al componente.

  - `handleCheckboxChange() { ... }`: Método que se invoca cuando cambia el estado del checkbox. Invoca la mutación `toggleCheckboxValue` para cambiar el estado del checkbox.

  - `resetSubcategory() { ... }`: Método que se invoca cuando cambia la selección de categoría. Resetea el valor de subcategoría a una cadena vacía.

Estilos CSS
-----------

El bloque `<style>` contiene estilos CSS para dar formato al componente. Los estilos se aplican globalmente a todo el componente.

- `#check:checked ~ .container-fluid { padding-left: 345px; }`: Estilos que se aplican al contenedor principal cuando el checkbox está seleccionado. Agrega un relleno izquierdo para dejar espacio para el panel de filtros.

- `#check:checked ~ #contentDiv { height: auto; display: block; }`: Estilos que se aplican al contenido principal cuando el checkbox está seleccionado. Ajusta la altura del contenido para que se expanda automáticamente y lo muestra como bloque.

- `.container-fluid div { justify-content: center; align-items: center; }`: Estilos para centrar horizontal y verticalmente los elementos dentro del contenedor principal.

- `.table-container { margin-top: 20px; }`: Estilos para el contenedor de la tabla. Agrega un margen superior.

- `.filters-container { margin-bottom: 10px; }`: Estilos para el contenedor de los filtros. Agrega un margen inferior.

- `.filters-container div { margin-left: 0px; }`: Estilos para los contenedores de los filtros. Elimina el margen izquierdo.

- `.buttonClass { margin-right: 1000px; }`: Estilos para la clase de botón. Agrega un margen derecho grande.

- `.table-responsive { overflow-x: auto; }`: Estilos para hacer que la tabla sea responsive y permita desplazamiento horizontal si los contenidos son demasiado anchos.

- `.table { width: 100%; border-collapse: collapse; }`: Estilos para la tabla. Establece el ancho al 100% y colapsa los bordes de la tabla.

- `.table th, .table td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }`: Estilos para las celdas de la tabla. Establece el relleno, la alineación del texto y agrega un borde inferior.

- `.table th { background-color: #f2f2f2; }`: Estilos para las celdas de cabecera de la tabla. Establece el fondo de color gris claro.

- `.button-container { ... }`: Estilos para el contenedor de los botones. Muestra los botones como flexbox y envuelve

los botones en dispositivos móviles.

- `.button-group { ... }`: Estilos para el grupo de botones. Muestra los botones en línea y aplica espaciado.

- `.button-group button { ... }`: Estilos para los botones del grupo. Establece el color de fondo, color de texto y otros estilos.

- `.button-container button { ... }`: Estilos para los botones en el contenedor. Establece el color de fondo, color de texto y otros estilos.

- `.filter-title { margin-bottom: 20px; }`: Estilos para el título de los filtros. Agrega un margen inferior.

- `.text-primary { color: #007bff; }`: Estilos para el texto con color primario.

- `.container-fluid { padding: 20px; }`: Estilos para el contenedor principal. Agrega un relleno.

- `#contentDiv { height: 100%; }`: Estilos para el contenido principal. Establece la altura al 100%.

-->