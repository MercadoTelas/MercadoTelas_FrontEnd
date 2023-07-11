<template>
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-6 mb-4">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title text-success">Top 10 productos con más envíos a tienda</h4>
            <div class="chart-container">
              <canvas ref="chartCanvas"></canvas>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title text-danger">Artículos por debajo de la cantidad mínima de stock</h4>
            <div class="table-responsive">
              <table class="table table-bordered kpi-table">
                <thead>
                  <tr>
                    <th>Código de producto</th>
                    <th>Nombre</th>
                    <th>Cantidad de stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(producto, index) in productos" :key="index">
                    <td>{{ producto.codigo }}</td>
                    <td>{{ producto.nombre }}</td>
                    <td>{{ producto.stock }}</td>
                    <td>
                      <button @click="hacerEntrada(index)" class="btn btn-success">Hacer entrada</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title text-primary text-center">Últimos movimientos realizados en el inventario</h4>
            <div class="table-responsive">
              <table class="table table-bordered kpi-table">
                <thead>
                  <tr>
                    <th>Fecha de movimiento</th>
                    <th>Descripción del movimiento</th>
                    <th>Bodega</th>
                    <th>Responsable</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="movement in sortedMovements" :key="movement.id">
                    <td>{{ movement.date }}</td>
                    <td>{{ movement.description }}</td>
                    <td>{{ movement.warehouse }}</td>
                    <td>{{ movement.responsible }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import axios from "axios";
import { API_URL } from '@/config';
import { mapState, mapMutations } from "vuex";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useStore } from "vuex";

export default {
  name: "CombinedComponent",
  data() {
    return {
      sortedMovements: [],
      productos: [],
      movementsData: [
        {
          id: 1,
          date: "2023-06-01",
          description: "5 entradas de tela Brush Azul",
          warehouse: "Bodega 1",
          responsible: "Andrés Méndez",
        },
        {
          id: 2,
          date: "2023-06-02",
          description: "5 salidas de tela Brush Negra",
          warehouse: "Bodega 2",
          responsible: "Jane Alfaro",
        },
        {
          id: 3,
          date: "2023-06-03",
          description: "3 entradas de rollos de hilo Blanco",
          warehouse: "Bodega 3",
          responsible: "Silvia Castro",
        },
        // Agrega más objetos de movimiento según tu estructura de datos
      ],
    };
  },
  computed: {
    ...mapState(["checkboxValue"]),
    checked: {
      get() {
        return this.checkboxValue;
      },
    },
  },
  mounted() {
    this.fetchItems();
    this.$router.push("/home");
    this.sortedMovements = this.sortMovements();
    this.$state.navbarTitle = "Inicio";
    const store = useStore();
    const user = store.state.user;
    if (store.state.LogAttempts == false) {
      toast.success(`Hola ${user.name}, bienvenido al sistema de inventario del Mercado de las Telas`, {
        position: 'top-right',
        timeout: 2500,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });
      store.commit('setLogAttempt', true);
    }
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    fetchItems() {
      axios.get(`${API_URL}/items`)
        .then((response) => {
          this.productos = response.data.items;
          this.createChart();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    createChart() {
      const canvas = this.$refs.chartCanvas;
      const ctx = canvas.getContext('2d');

      const tiposTelas = this.productos.map((producto) => producto.nombre);
      const inventario = this.productos.map((producto) => producto.stock);

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: tiposTelas,
          datasets: [
            {
              data: inventario,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          }
        }
      });
    },
    hacerEntrada() {
      // Lógica para realizar una entrada en el producto seleccionado
      const code = 'HBT123';
      const name = 'Tela brush';
      this.$router.push({
        name: 'EntryMin',
        params: {
          code: code,
          name: name
        }
      });

    },
    sortMovements() {
      return [...this.movementsData].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    },
  },
};
</script>
<style scoped>
.container-fluid {
  margin-top: 20px;
  margin-left: auto;
}

.centered-div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.chart-container {
  width: 100%;
  height: 300px;
}

.kpi-table {
  width: 100%;
  border-collapse: collapse;
}

.kpi-table th,
.kpi-table td {
  padding: 8px;
  border: 1px solid #ccc;
}

.kpi-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.kpi-table td button {
  padding: 6px 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

.kpi-table td button:hover {
  background-color: #45a049;
}

.kpi-table td button:focus {
  outline: none;
}

.kpi-table td button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

@media (max-width: 991px) {
  .col-lg-6 {
    margin-bottom: 20px;
  }

  .chart-container {
    height: 250px;
  }

  .kpi-table th,
  .kpi-table td {
    font-size: 12px;
  }
}
</style>

<!--

Componente para la página principal de administración (cockpit-dashboard)

**Template:**

- `<input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange">`: Es un checkbox que se utiliza para controlar el estado del menú desplegable. Su estado está vinculado a la propiedad `checked` utilizando `v-model`, y cuando cambia, se invoca el método `handleCheckboxChange`.

- `<div class="container-fluid">`: Es un contenedor fluido que envuelve todo el contenido de la página de inicio.

- `<div class="row">`: Es una fila que contiene dos columnas.

- `<div class="col-lg-6 mb-4">`: Es una columna con un ancho de 6 columnas para dispositivos grandes (lg) y un margen inferior de 4 píxeles.

- `<div class="card">`: Es una tarjeta que contiene información sobre los 10 productos con más envíos a la tienda.

- `<div class="card-body">`: Es el cuerpo de la tarjeta.

- `<h4 class="card-title text-success">Top 10 productos con más envíos a tienda</h4>`: Es el título de la tarjeta con un estilo de texto de éxito.

- `<div class="chart-container">`: Es un contenedor para el gráfico. Contiene un elemento canvas que se utiliza para dibujar el gráfico utilizando la biblioteca Chart.js.

- `<div class="col-lg-6">`: Es una columna con un ancho de 6 columnas para dispositivos grandes (lg).

- `<div class="card">`: Es una tarjeta que contiene información sobre los artículos por debajo de la cantidad mínima de stock.

- `<div class="card-body">`: Es el cuerpo de la tarjeta.

- `<h4 class="card-title text-danger">Artículos por debajo de la cantidad mínima de stock</h4>`: Es el título de la tarjeta con un estilo de texto de peligro.

- `<div class="table-responsive">`: Es un contenedor que permite que la tabla sea sensible y se desplace horizontalmente en dispositivos pequeños.

- `<table class="table table-bordered kpi-table">`: Es una tabla con bordes y una clase personalizada "kpi-table".

- `<thead>`: La sección de encabezado de la tabla.

- `<tr>`: Representa una fila en el encabezado de la tabla.

- `<th>`: Representa una celda de encabezado en la tabla.

- `<tbody>`: La sección de cuerpo de la tabla.

- `<tr v-for="(producto, index) in productos" :key="index">`: Representa una fila en el cuerpo de la tabla para cada producto en la lista de productos. El atributo `v-for` se utiliza para iterar sobre la lista de productos y el atributo `:key` se utiliza para proporcionar una clave única para cada fila.

- `<td>{{ producto.codigo }}</td>`: Muestra el código del producto en una celda de la tabla.

- `<td>{{ producto.nombre }}</td>`: Muestra el nombre del producto en una celda de la tabla.

- `<td>{{ producto.stock }}</td>`: Muestra la cantidad de stock del producto en una celda de la tabla.

- `<td>`: Representa una celda en la tabla para las acciones.

- `<button @click="hacerEntrada(index)" class="btn btn-success">Hacer entrada</button>`: Es un botón de éxito que se utiliza para realizar una entrada en el producto seleccionado. El método `hacerEntrada` se invoca cuando se hace clic en el botón.

- `<div class="row">`: Es una segunda fila que contiene una columna.

- `<div class="col-lg-12">`: Es una columna con un ancho de 12 columnas para dispositivos grandes (lg).

- `<div class="card">`: Es una tarjeta que contiene información sobre los últimos movimientos realizados en el inventario.

- `<div class="card-body">`: Es el cuerpo de la tarjeta.

- `<h4 class="card-title text-primary text-center">Últimos
  movimientos realizados en el inventario</h4>`: Es el título de la tarjeta con un estilo de texto primario y centrado.

- `<div class="table-responsive">`: Es un contenedor que permite que la tabla sea sensible y se desplace horizontalmente en dispositivos pequeños.

- `<table class="table table-bordered kpi-table">`: Es una tabla con bordes y una clase personalizada "kpi-table".

- `<thead>`: La sección de encabezado de la tabla.

- `<tr>`: Representa una fila en el encabezado de la tabla.

- `<th>`: Representa una celda de encabezado en la tabla.

- `<tbody>`: La sección de cuerpo de la tabla.

- `<tr v-for="movement in sortedMovements" :key="movement.id">`: Representa una fila en el cuerpo de la tabla para cada movimiento en la lista de movimientos. El atributo `v-for` se utiliza para iterar sobre la lista de movimientos y el atributo `:key` se utiliza para proporcionar una clave única para cada fila.

- `<td>{{ movement.date }}</td>`: Muestra la fecha del movimiento en una celda de la tabla.

- `<td>{{ movement.description }}</td>`: Muestra la descripción del movimiento en una celda de la tabla.

- `<td>{{ movement.warehouse }}</td>`: Muestra la bodega del movimiento en una celda de la tabla.

- `<td>{{ movement.responsible }}</td>`: Muestra el responsable del movimiento en una celda de la tabla.

**Script:**

- `import Chart from 'chart.js/auto';`: Importa la biblioteca Chart.js para crear gráficos interactivos.

- `import axios from "axios";`: Importa Axios, una biblioteca para realizar solicitudes HTTP.

- `import { API_URL } from '@/config';`: Importa la URL de la API desde el archivo de configuración.

- `import { mapState, mapMutations } from "vuex";`: Importa las funciones `mapState` y `mapMutations` de Vuex para mapear el estado y las mutaciones del store a las propiedades y métodos del componente.

- `import { toast } from 'vue3-toastify';`: Importa la función `toast` de la biblioteca vue3-toastify para mostrar notificaciones en la página de inicio.

- `import 'vue3-toastify/dist/index.css';`: Importa los estilos CSS de vue3-toastify.

- `import { useStore } from "vuex";`: Importa la función `useStore` de Vuex para acceder al store.

- `data() { return { ... } }`: Define los datos del componente. Inicializa las propiedades `sortedMovements` como una matriz vacía, `productos` como una matriz vacía y `movementsData` como una matriz de objetos de movimiento de ejemplo.

- `computed: { ... }`: Define las propiedades computadas del componente. Incluye la propiedad `checked` que obtiene y establece el valor del checkbox principal utilizando `mapState`.

- `mounted() { ... }`: Se ejecuta cuando el componente está montado en el DOM. Llama al método `fetchItems` para obtener los productos y crea el gráfico utilizando el método `createChart`. Además, establece el título de la barra de navegación y muestra una notificación de bienvenida utilizando la función `toast`.

- `methods: { ... }`: Define los métodos del componente.

El método `fetchItems` realiza una solicitud HTTP para obtener los productos de la API.

El método `createChart` utiliza la biblioteca Chart.js para crear un gráfico de barras con los productos y sus inventarios.

El método `hacerEntrada` se invoca cuando se hace clic en el botón "Hacer entrada" y realiza la lógica para realizar una entrada en el producto seleccionado.

El método `sortMovements` devuelve una copia ordenada de los movimientos utilizando la fecha del movimiento.

**Estilos:**

- `.container-fluid`: Establece un margen superior y un margen izquierdo automático para el contenedor fluido.

- `.centered-div`: Define un estilo para un div centrado verticalmente.

- `.chart-container`: Establece el ancho y la altura del contenedor del gráfico.

- `.kpi-table`: Establece el ancho del 100% para la tabla y colapsa los bordes.

- `.kpi-table th, .kpi-table td`: Establece el relleno y el borde para las celdas de la tabla.

- `.kpi-table th`: Establece el color de fondo y el peso de la fuente para las celdas de encabezado.

- `.kpi-table td button`: Establece el relleno, el color de fondo, el color de texto y el borde para los botones en las celdas de la tabla.

- `.kpi-table td button:hover`: Establece el color de fondo cuando se pasa el mouse sobre los botones.

- `.kpi-table td button:focus`: Establece el estilo cuando los botones obtienen el enfoque.

- `.kpi-table td button:disabled`: Establece el estilo cuando los botones están deshabilitados.

- `@media (max-width: 991px)`: Define estilos específicos para dispositivos con un ancho máximo de 991 píxeles, como reducir el margen inferior de las columnas y el tamaño de fuente de las celdas de la tabla.
-->