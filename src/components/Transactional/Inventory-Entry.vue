<template>
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />

  <div class="container">
    <div>
      <div v-if="modalVisible">
        <div class="modal-background"></div>
        <div class="modal-content container-md">
          <h2>Búsqueda de artículos</h2>
          <div class="search-container">
            <label for="searchInput">Buscar por Nombre o Código:</label>
            <input type="text" id="searchInput" v-model="searchQuery" @keydown.enter="searchItem" class="input-field" />
            <button @click="searchItem" class="btn btn-success">Buscar</button>
          </div>
          <div class="table-container">
            <table class="table table-responsive-lg text-center">
              <thead>
                <tr>
                  <th class="text-center">Código del artículo</th>
                  <th class="text-center">Nombre del artículo</th>
                  <th class="text-center"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredItems" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td style="width: 10px">
                    <button @click="addItemToTable" class="btn btn-success">
                      <i class="bi bi-plus-circle"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button @click="closeModal" class="btn btn-danger">Cerrar</button>
        </div>
      </div>
    </div>
    <div class="document-header">
      <div class="header-row">
        <h1>Lista de Artículos</h1>
        <div class="form-group ms-0">
          <label for="warehouseSelect">Bodega:</label>
          <select id="warehouseSelect" class="form-select ms-2" v-model="selectedWarehouse">
            <option value="" disabled selected>Seleccionar</option>
            <option v-for="warehouse in warehouses" :value="warehouse" :key="warehouse.id">
              {{ warehouse.name }}
            </option>
          </select>
        </div>
      </div>
      <p>Fecha: {{ getCurrentDate() }}</p>
    </div>
    <div class="table-container">
      <table class="table table-responsive-lg text-center">
        <thead>
          <tr>
            <th class="text-center">Código del artículo</th>
            <th class="text-center">Nombre del artículo</th>
            <th class="text-center">
              Cantidad en unidades de inventario a agregar
            </th>
            <th class="text-center">Cantidad en unidades de venta a agregar</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr id="transactionList" v-for="(item, index) in tableData" :key="index">
            <td>
              <input :id="'ID' + index" type="text" v-model="item.item_id"
                @keydown.enter="onCellInput(item, 'item_id', $event, index)" class="input" />
            </td>
            <td>
              <input :id="'ID' + index" type="text" v-model="item.name"
                @keydown.enter="onCellInput(item, 'name', $event, index)" class="input" />
            </td>
            <td>
              <div class="row align-items-center">
                <div class="col-8">
                  <input type="number" v-model="item.storing_format_units" @input="
                    onCellInput(item, 'storing_format_units', $event, index)
                    " class="input" />
                </div>
                <div class="col-4">
                  {{ item.storing_unit_format_name }}
                </div>
              </div>
            </td>
            <td>
              <div class="row align-items-center">
                <div class="col-8">
                  <input type="number" v-model="item.transferring_format_units" @input="
                    onCellInput(item, 'sale_units', $event, 'ID' + index)
                    " class="input" />
                </div>
                <div class="col-4">
                  {{ item.transferring_unit_format_name }}
                </div>
              </div>
            </td>
            <td>
              <button class="btn btn-danger" @click="removeItem(index), enableField('ID' + index)">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="observations-section mt-4">
      <h3>Observaciones</h3>
      <textarea class="form-control" v-model="notes"></textarea>
    </div>

    <div class="form-footer text-center">
      <button class="btn btn-success" type="submit" @click="saveTransaction">
        Guardar transacción
      </button>
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
  data() {
    return {
      tableData: [
        {
          id: "",
          item_id: "",
          name: "",
          storing_format_units: "",
          conversion_factor: "",
          transferring_format_units: "",
          warehouse: "",
        },
      ],
      filteredItems: [],
      inventory_items: [],
      warehouses: [],
      modalVisible: false,
      selectedWarehouse: "",
      notes: "",
    };
  },
  mounted() {
    this.$state.navbarTitle = "Entradas de inventario";
    document.addEventListener("keydown", this.handleKeyDown);
    axios
      .get(`${API_URL}/warehouses/`)
      .then((response) => {
        this.warehouses = response.data;
      })
      .catch((error) => {
        console.error(error);
      });
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
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
    updateWarehouse(item, warehouseName) {
      item.warehouse = warehouseName;
    },
    showModal() {
      this.modalVisible = true;
    },
    closeModal() {
      this.modalVisible = false;
    },
    addItem() {
      const newItem = {
        item_id: "",
        name: "",
        storing_format_units: "",
        conversion_factor: "",
        sale_units: "",
      };
      this.tableData.push(newItem);
    },
    removeItem(index) {
      if (index !== this.tableData.length - 1) {
        if (this.tableData.length > 1) {
          this.tableData.splice(index, 1);
        }
      }
    },
    searchItem() {
      const query =
        this.searchQuery === undefined ? "" : this.searchQuery.trim();
      if (query !== "") {
        const url = `${API_URL}/search_items/?data=${query}`;
        axios
          .get(url)
          .then((response) => {
            console.log(response);
            this.filteredItems = response.data;
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    onCellInput(item, field, event, index) {
      event.stopPropagation();
      event.preventDefault();
      // Actualizar el valor del campo en el objeto item
      item[field] = event.target.value;

      // Verificar si se está editando la última fila
      if (item === this.tableData[this.tableData.length - 1]) {
        // Verificar si el campo del código está lleno en la última fila
        if (item.item_id.trim() !== "") {
          // Agregar una nueva fila vacía
          this.addItem();
        }
      }

      // Verificar si se presionó la tecla Enter en las celdas de código o nombre
      if (
        event.key === "Enter" &&
        (field === "item_id" || field === "name") &&
        this.selectedWarehouse !== ""
      ) {
        const itemId = item.item_id.trim();
        const itemName = item.name.trim();
        if (itemId !== "" || itemName !== "" && this.selectedWarehouse !== "") {
          let url = `${API_URL}/search_inventory_item?`;
          if (itemId !== "" && itemName === "" && this.selectedWarehouse !== "") {
            url += `item_id=${itemId}&warehouse_id=${this.selectedWarehouse.id}`;
          } else if (itemId === "" && itemName !== "" && this.selectedWarehouse !== "") {
            url += `name=${itemName}&warehouse_id=${this.selectedWarehouse.id}`;
          }
          axios
            .get(url)
            .then((response) => {
              const data = response.data;

              // Actualizar los valores de la fila con los datos obtenidos de la API
              item.id = data.id || "";
              item.item_id = data.item_id || "";
              item.name = data.name || "";
              item.storing_unit_format_name =
                data.storing_unit_format_name || "";
              item.conversion_factor = data.conversion_factor || "";
              item.transferring_unit_format_name =
                data.transferring_unit_format_name || "";

              // Realizar el cálculo de la cantidad de venta
              this.calculateSaleUnits(item);
              this.disableFields("ID" + index);
            })
            .catch((error) => {
              console.error(error);
              toast.error(`No se encontró el artículo`, {
                position: 'top-right',
                timeout: 2000,
                closeOnClick: true,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
              });
            });
        }
      } else if (
        field === "storing_format_units" ||
        field === "conversion_factor"
      ) {
        // Realizar el cálculo de la cantidad de venta al cambiar la cantidad de almacenamiento o el factor de conversión
        this.calculateSaleUnits(item);
      } else if (event.key === "Enter" && this.selectedWarehouse === "") {
        toast.info(`Debe seleccionar un almacén`, {
          position: 'top-right',
          timeout: 2000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
        });
      }
    },
    calculateSaleUnits(item) {
      const storingUnits = parseFloat(item.storing_format_units);
      const conversionFactor = parseFloat(item.conversion_factor);
      if (!isNaN(storingUnits) && !isNaN(conversionFactor)) {
        const saleUnits = storingUnits * conversionFactor;
        item.transferring_format_units = saleUnits.toFixed(2);
      }
    },
    disableFields(id) {
      var elements = document.querySelectorAll("#" + id);
      elements.forEach(function (element) {
        element.disabled = true;
      });
    },
    enableField(id) {
      var elements = document.querySelectorAll("#" + id);
      elements.forEach(function (element) {
        element.disabled = false;
      });
    },
    saveTransaction() {
      // Filtrar las filas que tienen todos los campos llenos
      this.inventory_items = this.tableData.filter((item) => {
        return (
          item.item_id.trim() !== "" &&
          item.name.trim() !== "" &&
          item.storing_format_units !== "" &&
          item.transferring_format_units !== ""
        );
      });

      // Verificar si hay filas válidas
      if (this.inventory_items.length > 0 && this.selectedWarehouse === "") {
        const url = `${API_URL}/inventories/insert_items`;
        console.log(this.$store.state.user.id);
        const data = {
          inventory_items: this.inventory_items,
          currentDate: this.getCurrentDate(),
          warehouse_id: this.selectedWarehouse.id,
          user: this.$store.state.user.id,
          notes: this.notes,
        };

        axios
          .post(url, data)
          .then((response) => {
            // Lógica de respuesta exitosa
            console.log(response);
            toast.success(`Transacción guardada`, {
              position: 'top-right',
              timeout: 2000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
            });

            this.tableData = [];
            this.addItem();
            this.notes = "";
            this.selectedWarehouse = "";
          })
          .catch((error) => {
            toast.error(`Error al guardar la transacción: ` + error.message, {
              position: 'top-right',
              timeout: 2000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
            });

          });
      } else {
        toast.info(`Debe llenar todos los campos en al menos una fila antes de guardar la transacción`, {
          position: 'top-right',
          timeout: 2000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
        });

      }
      this.inventory_items = [];
    },
    getCurrentDate() {
      const currentDate = new Date();
      return currentDate.toLocaleDateString();
    },
    handleKeyDown(event) {
      if (event.shiftKey && event.key === "Tab") {
        this.showModal();
      }
    },
  },
};
</script>

<style scoped>
#check:checked~.container {
  padding-left: 345px;
  max-width: 1500px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.document-header {
  margin-bottom: 20px;
}

.table-container {
  overflow-x: auto;
  max-width: 100%;
  max-height: 300px;
  overflow-y: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.input {
  width: 100%;
  padding: 8px;
  border: none;
  outline: none;
  background-color: transparent;
}

.form-footer {
  margin-top: 16px;
}

.form-group {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

/* Estilos del componente modal */
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 4px;
}

.search-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.search-container label {
  margin-right: 10px;
}

.search-container input {
  margin-right: 10px;
}
</style>

<!--
  Componente para registrar entradas de inventario
------------------------------------------------------------------

Este componente representa una lista de artículos con un formulario de búsqueda y un modal para agregar nuevos artículos. Proporciona una interfaz para buscar artículos por nombre o código, seleccionar una bodega y agregar artículos a la lista.

Estructura del Template
-----------------------

El bloque `<template>` define la estructura del componente utilizando elementos HTML.

- `<input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />`: Representa un checkbox que permite a los usuarios activar o desactivar una opción. Utiliza la directiva `v-model` para enlazar su estado al valor de la propiedad `checked` en los datos del componente. También tiene un listener `@change` que invoca el método `handleCheckboxChange` cuando el estado del checkbox cambia.

- `<div class="container">`: Actúa como un contenedor principal para el componente.

- `<div>`: Contenedor anidado utilizado para agrupar elementos.

- `<div v-if="modalVisible">`: Este bloque de código se muestra solo si la propiedad `modalVisible` en los datos del componente es verdadera. Contiene el modal para agregar nuevos artículos.

- `<div class="modal-background"></div>`: Representa el fondo oscuro del modal.

- `<div class="modal-content container-md">`: Representa el contenido del modal. Tiene una clase `container-md` que establece su ancho.

- `<h2>Búsqueda de artículos</h2>`: Título del modal.

- `<div class="search-container">`: Contenedor para el formulario de búsqueda. Contiene una etiqueta y un campo de entrada de texto.

- `<label for="searchInput">Buscar por Nombre o Código:</label>`: Etiqueta para el campo de entrada de búsqueda.

- `<input type="text" id="searchInput" v-model="searchQuery" @keydown.enter="searchItem" class="input-field" />`: Campo de entrada de texto para la búsqueda de artículos. Utiliza la directiva `v-model` para enlazar su valor a la propiedad `searchQuery` en los datos del componente. También tiene un listener `@keydown.enter` que invoca el método `searchItem` cuando se presiona la tecla Enter.

- `<button @click="searchItem" class="btn btn-success">Buscar</button>`: Botón de búsqueda. Invoca el método `searchItem` cuando se hace clic en él.

- `<div class="table-container">`: Contenedor para la tabla que muestra los resultados de búsqueda.

- `<table class="table table-responsive-lg text-center">`: Tabla para mostrar los resultados de búsqueda. Tiene clases de CSS para aplicar estilos de tabla responsiva y centrar el texto.

- `<thead>`: Encabezado de la tabla.

- `<tr>`: Fila de encabezado de la tabla.

- `<th class="text-center">Código del artículo</th>`: Celda de encabezado para el código del artículo.

- `<th class="text-center">Nombre del artículo</th>`: Celda de encabezado para el nombre del artículo.

- `<th class="text-center"></th>`: Celda de encabezado vacía.

- `<tbody>`: Cuerpo de la tabla.

- `<tr v-for="item in filteredItems" :key="item.id">`: Ciclo `v-for` que itera sobre los elementos filtrados y crea una fila en la tabla para cada elemento. Utiliza la propiedad especial `:key` para asignar una clave única a cada fila.

- `<td>{{ item.id }}</td>`: Celda que muestra el ID del artículo.

- `<td>{{ item.name }}</td>`: Celda que muestra el nombre del artículo.

- `<td style="width: 10px">`: Celda con un ancho de 10px.

- `<button @click="addItemToTable" class="btn btn-success">`: Botón para agregar el artículo a la tabla. Invoca el método `addItemToTable` cuando se hace clic en él.

- `<i class="bi bi-plus-circle"></i>`: Icono "+" dentro del botón de agregar artículo.

- `<button @click="closeModal" class="btn btn-danger">Cerrar</button>`: Botón para cerrar el modal. Invoca el método `closeModal` cuando se hace clic en él.

- `<div class="document-header">`: Encabezado del documento.

- `<div class="header-row">`: Fila de encabezado del documento.

- `<h1>Lista de Artículos</h1>`: Título principal del documento.

- `<div class="form-group ms-0">`: Contenedor para el campo de selección de bodega. Utiliza la clase de CSS `ms-0` para eliminar el margen derecho.

- `<label for="warehouseSelect">Bodega:</label>`: Etiqueta para el campo de selección de bodega.

- `<select id="warehouseSelect" class="form-select ms-2" v-model="selectedWarehouse">`: Campo de selección de bodega. Utiliza la directiva `v-model` para enlazar su valor a la propiedad `selectedWarehouse` en los datos del componente.

- `<option value="" disabled selected>Seleccionar</option>`: Opción desactivada y seleccionada por defecto.

- `<option v-for="warehouse in warehouses" :value="warehouse" :key="warehouse.id">{{ warehouse.name }}</option>`: Ciclo `v-for` que itera sobre el array `warehouses` y crea una opción para cada bodega. Utiliza las propiedades `value` y `key` para establecer los valores y claves correspondientes.

- `<p>Fecha: {{ getCurrentDate() }}</p>`: Párrafo que muestra la fecha actual utilizando la interpolación de Vue.js y el método `getCurrentDate`.

- `<div class="table-container">`: Contenedor para la tabla de artículos.

- `<table class="table table-responsive-lg text-center">`: Tabla de artículos. Tiene clases de CSS para aplicar estilos de tabla responsiva y centrar el texto.

- `<thead>`: Encabezado de la tabla.

- `<tr>`: Fila de encabezado de la tabla.

- `<th class="text-center">Código del artículo</th>`: Celda de encabezado para el código del artículo.

- `<th class="text-center">Nombre del artículo</th>`: Celda de encabezado para el nombre del artículo.

- `<th class="text-center">Cantidad en unidades de inventario a agregar</th>`: Celda de encabezado para la cantidad en unidades de inventario a agregar.

- `<th class="text-center">Cantidad en unidades de venta a agregar</th>`: Celda de encabezado para la cantidad en unidades de venta a agregar.

- `<th class="text-center">Acciones</th>`: Celda de encabezado para las acciones.

- `<tbody>`: Cuerpo de la tabla.

- `<tr id

="transactionList" v-for="(item, index) in tableData" :key="index">`: Ciclo `v-for` que itera sobre el array `tableData` y crea una fila en la tabla para cada elemento. Utiliza la propiedad especial `:key` para asignar una clave única a cada fila.

- `<td>`: Celda para el campo "Código del artículo". Contiene un campo de entrada de texto enlazado a la propiedad `item.item_id`.

- `<td>`: Celda para el campo "Nombre del artículo". Contiene un campo de entrada de texto enlazado a la propiedad `item.name`.

- `<td>`: Celda para el campo "Cantidad en unidades de inventario a agregar". Contiene un campo de entrada numérico enlazado a la propiedad `item.storing_format_units`.

- `<td>`: Celda para el campo "Cantidad en unidades de venta a agregar". Contiene un campo de entrada numérico enlazado a la propiedad `item.transferring_format_units`.

- `<td>`: Celda para las acciones. Contiene un botón "Eliminar" que invoca el método `removeItem` y habilita el campo correspondiente utilizando el método `enableField`.

- `<button class="btn btn-danger" @click="removeItem(index), enableField('ID' + index)">Eliminar</button>`: Botón para eliminar el artículo de la tabla. Invoca el método `removeItem` cuando se hace clic en él y habilita el campo correspondiente utilizando el método `enableField`.

- `<div class="observations-section mt-4">`: Sección para las observaciones.

- `<h3>Observaciones</h3>`: Título de la sección de observaciones.

- `<textarea class="form-control" v-model="notes"></textarea>`: Campo de texto de varias líneas para las observaciones. Utiliza la directiva `v-model` para enlazar su valor a la propiedad `notes` en los datos del componente.

- `<div class="form-footer text-center">`: Pie de formulario.

- `<button class="btn btn-success" type="submit" @click="saveTransaction">Guardar transacción</button>`: Botón para guardar la transacción. Invoca el método `saveTransaction` cuando se hace clic en él.

Estructura del Script
---------------------

El bloque `<script>` contiene la lógica del componente y define los datos, métodos y propiedades computadas utilizados en el template. A continuación se explica cada sección del script:

- `data()`: Método que devuelve un objeto que contiene los datos del componente. Inicializa los valores iniciales de los diferentes campos y propiedades utilizadas en el componente.

- `mounted()`: Gancho de ciclo de vida que se ejecuta después de que el componente se ha montado en el DOM. Realiza una solicitud HTTP para obtener las bodegas y asigna la respuesta a la propiedad `warehouses`.

- `computed`: Sección que contiene propiedades computadas que realizan cálculos basados en los datos del componente. En este caso, utiliza la propiedad computada `checked` para obtener el valor de la propiedad `checkboxValue` en los datos del componente.

- `methods`: Sección que contiene los métodos utilizados en el componente. Incluye métodos para manejar cambios en el checkbox, actualizar la bodega seleccionada, mostrar y cerrar el modal, agregar un nuevo artículo, eliminar un artículo de la tabla, buscar artículos, manejar eventos de entrada en las celdas de la tabla, calcular la cantidad de venta, deshabilitar y habilitar campos, guardar la transacción y obtener la fecha actual.

- `handleKeyDown`: Método que se invoca cuando se presiona una tecla. Verifica si se presiona Shift + Tab y muestra el modal en ese caso.

Estilos CSS
-----------

El bloque `<style>` contiene estilos CSS para dar formato al componente. Los estilos están definidos dentro del atributo `scoped`, lo que significa que solo se aplican al componente actual y no se propagan a otros componentes. A continuación se explica cada estilo:

- `#check:checked~.container`: Establece el relleno izquierdo y el ancho máximo del contenedor principal cuando el checkbox `#check` está marcado.

- `.container`: Define el ancho máximo y el margen automático para el contenedor principal.

- `.document-header`: Define el margen inferior del encabezado del documento.

- `.table-container`: Define el desplazamiento horizontal y vertical para el contenedor de la tabla.

- `.table`: Define el ancho de la tabla, el colapso de bordes y el margen interno para las celdas.

- `.table th, .table td`: Define los bordes y el relleno para las celdas de encabezado y celdas de datos en la tabla.

- `.input`: Define el ancho, el relleno, el borde y el color de fondo para los campos de entrada de texto en la tabla.

- `.form-footer`: Define el margen superior para el pie de formulario.

- `.form-group`: Define la visualización en línea y el relleno para los grupos de formulario.

- `.modal-background`: Define la posición fija y los estilos de fondo para el fondo del modal.

- `.modal-content`: Define la posición fija, los estilos de fondo y el relleno para el contenido del modal.

- `.search-container`: Define la visualización en línea y el margen inferior para el contenedor de búsqueda.

- `.search-container label`: Define el margen derecho para la etiqueta de búsqueda.

- `.search-container input`: Define el margen derecho para el campo de entrada de búsqueda.

-->