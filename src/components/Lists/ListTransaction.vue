<template>
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />
  <div class="container">
    <div class="row">
      <div class="mt-3 mb-4">
        <h3>Salidas</h3>
        <div class="table-container">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Código</th>
                <th>Usuario</th>
                <th>Artículos ingresados</th>
                <th>Bodega</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in filteredTransactions('S')" :key="transaction.id">
                <td>{{ transaction.identifier }}</td>
                <td>{{ transaction.user.name }}</td>
                <td>{{ transaction.items_moved }}</td>
                <td>{{ transaction.to_warehouse.name }}</td>
                <td>{{ transaction.created_at }}</td>
                <td>
                  <a :href="transaction.pdf_url" target="_blank" class="btn btn-success">Descargar PDF</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-3 mb-4">
        <h3>Entradas</h3>
        <div class="table-container">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Código</th>
                <th>Usuario</th>
                <th>Artículos removidos</th>
                <th>Bodega</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in filteredTransactions('E')" :key="transaction.id">
                <td>{{ transaction.identifier }}</td>
                <td>{{ transaction.user.name }}</td>
                <td>{{ transaction.items_moved }}</td>
                <td>{{ transaction.to_warehouse.name }}</td>
                <td>{{ transaction.created_at }}</td>
                <td>
                  <a :href="transaction.pdf_url" target="_blank" class="btn btn-success">Descargar PDF</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-3 mb-4">
        <h3>Transferencias</h3>
        <div class="table-container">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Código</th>
                <th>Usuario</th>
                <th>Artículos Tranferidos</th>
                <th>Bodega emisora</th>
                <th>Bodega receptora</th>
                <th>Fecha de Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in filteredTransactions('T')" :key="transaction.id">
                <td>{{ transaction.identifier }}</td>
                <td>{{ transaction.user.name }}</td>
                <td>{{ transaction.items_moved }}</td>
                <td>{{ transaction.from_warehouse.name }}</td>
                <td>{{ transaction.to_warehouse.name }}</td>
                <td>{{ transaction.created_at }}</td>
                <td>
                  <a :href="transaction.pdf_url" target="_blank" class="btn btn-success">Descargar PDF</a>
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
//import { toast } from 'vue3-toastify';
//import 'vue3-toastify/dist/index.css';


export default {
  name: "TransactionList",
  data() {
    return {
      transactions: [],
      searchIdentifier: "",
      searchDate: "",
    };
  },
  computed: {
    ...mapState(["checkboxValue"]),
    checked: {
      get() {
        return this.checkboxValue;
      },
    },
    filteredTransactions() {
      return (type) => {
        return this.transactions.filter((transaction) => {
          return (
            transaction.identifier.includes(this.searchIdentifier) &&
            (this.searchDate
              ? transaction.created_at.includes(this.searchDate)
              : true) &&
            transaction.type === type
          );
        });
      };
    },
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    fetchTransactions() {
      axios
        .get(`${API_URL}/transactions`)
        .then((response) => {
          this.transactions = response.data.transactions.map((transaction) => {
            return {
              ...transaction,
              pdf_url: `${API_URL}/transactions/${transaction.id}`, // URL del PDF para cada transacción
            };
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.fetchTransactions();
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

.table th,
.table td {
  padding: 8px;
  vertical-align: middle;
}

.table th {
  background-color: #f2f2f2;
}

.table-container {
  overflow-x: auto;
  max-width: 100%;
  max-height: 300px;
  overflow-y: auto;
}
</style>

<!--

Componente para listar las transacciones

**Template:**

- `<input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />`: Este elemento `<input>` es un checkbox que está vinculado a la propiedad `checked` utilizando la directiva `v-model`. Cuando el estado del checkbox cambia, se invoca el método `handleCheckboxChange`.

- `<div class="container">`: Es el contenedor principal del componente.

- `<div class="row">`: Representa una fila de elementos dentro del contenedor.

- `<div class="mt-3 mb-4">`: Contiene una sección de salidas, entradas y transferencias.

- `<h3>Salidas</h3>`: Es un encabezado para la sección de salidas.
- `<div class="table-container">`: Es un contenedor para la tabla de salidas. Tiene un desplazamiento horizontal y vertical limitado.

- `<table class="table table-striped">`: Es una tabla que muestra las salidas.

- `<thead>`: Define el encabezado de la tabla.

- `<tr>`: Representa una fila en el encabezado de la tabla.

- `<th>`: Representa una celda del encabezado de la tabla.

- `<tbody>`: Define el cuerpo de la tabla.

- `<tr v-for="transaction in filteredTransactions('S')" :key="transaction.id">`: Utiliza la directiva `v-for` para iterar sobre cada transacción en la propiedad `filteredTransactions('S')`. Cada transacción se representa como una fila en la tabla. La propiedad `:key` se utiliza para proporcionar una clave única a cada fila.

- `<td>`: Representa una celda de la tabla.

- `<a :href="transaction.pdf_url" target="_blank" class="btn btn-success">Descargar PDF</a>`: Es un enlace que abre una nueva pestaña y descarga un PDF relacionado con la transacción.
- La sección de entradas y transferencias sigue una estructura similar a la sección de salidas.

**Script:**

- `import { mapState, mapMutations } from "vuex";`: Importa las funciones `mapState` y `mapMutations` de Vuex para mapear el estado y las mutaciones a las propiedades y métodos del componente.

- `import axios from "axios";`: Importa Axios, una biblioteca para realizar solicitudes HTTP.

- `import { API_URL } from "@/config";`: Importa la URL de la API desde el archivo de configuración.

- `name: "TransactionList"`: Define el nombre del componente como "TransactionList".

- `data() { return { ... } }`: Define los datos del componente. Inicializa las propiedades `transactions`, que es un arreglo vacío para almacenar las transacciones obtenidas de la API, y `searchIdentifier` y `searchDate`, que son cadenas vacías para almacenar los criterios de búsqueda ingresados por el usuario.

- `computed: { ... }`: Define las propiedades computadas del componente. Utiliza `mapState` para mapear la propiedad `checkboxValue` del estado de la aplicación a la propiedad computada `checked`. También define la propiedad `filteredTransactions`, que es una función que recibe un tipo de transacción y devuelve las transacciones filtradas según los criterios de búsqueda ingresados por el usuario.

- `methods: { ... }`: Define los métodos del componente. Utiliza `mapMutations` para mapear la mutación `toggleCheckboxValue`. Define el método `handleCheckboxChange`, que invoca la mutación `toggleCheckboxValue` cuando cambia el estado del checkbox. También define el método `fetchTransactions`, que realiza una solicitud HTTP para obtener todas las transacciones desde la API y las asigna a la propiedad `transactions` del componente.

- `mounted() { ... }`: Se ejecuta después de que el componente se haya montado en el DOM. Invoca el método `fetchTransactions` para obtener las transacciones desde la API.

**Estilos:**

Los estilos CSS definidos en la sección `<style>` son similares a los otros componentes de listar. Se aplica un margen superior e inferior a los elementos de la sección, y se utiliza un contenedor con desplazamiento horizontal y vertical para limitar el tamaño de la tabla y permitir la navegación dentro de ella.
-->
