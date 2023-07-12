<template>
  <div>
    <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />
    <div class="container-fluid">
      <div class="button-container">
        <div class="filter-row">
          <label for="bodega">Bodega:</label>
          <select id="bodega" v-model="selectedBodega" @change="filterProductos">
            <option value="">Todas las bodegas</option>
            <option v-for="bodega in bodegas" :key="bodega" :value="bodega">{{ bodega }}</option>
          </select>
        </div>
        <div class="filter-row">
          <label for="tipo">Tipo de artículo:</label>
          <select id="tipo" v-model="selectedTipo" @change="filterProductos">
            <option value="">Todos los tipos</option>
            <option v-for="tipo in tipos" :key="tipo" :value="tipo">{{ tipo }}</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6 mb-4">
          <div class="card">
            <div class="card-body">


              <h4 class="card-title text-success">
                Top 10 artículos con más envíos a tienda
              </h4>
              <div class="chart-container">
                <canvas ref="chartCanvas"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title text-danger">
                Artículos por debajo de la cantidad mínima de stock
              </h4>
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
                    <tr v-for="(producto, index) in productosLow" :key="index">
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
        <div class="col-lg-6">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title text-primary text-center">
                Últimos movimientos realizados en el inventario
              </h4>
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
        <div class="col-lg-6 mb-4">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title text-danger">
                Comparativa de Stock y Nivel Deseado por Artículo
              </h4>
              <div class="chart-container">
                <canvas ref="chartLow"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
//import axios from 'axios';
//import { API_URL } from '@/config';
import { mapState, mapMutations } from 'vuex';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useStore } from "vuex";
import { shallowRef } from 'vue';


export default {
  data() {
    return {
      sortedMovements: [],
      productosLow: [
        {
          codigo: '001',
          nombre: 'Producto 1',
          stock: 10,
          minStock: 20,
          bodega: 'Bodega 3',
          tipo: 'Tipo 1'
        },
        {
          codigo: '002',
          nombre: 'Producto 2',
          stock: 5,
          minStock: 10,
          bodega: 'Bodega 3',
          tipo: 'Tipo 2'
        },
        {
          codigo: '003',
          nombre: 'Producto 3',
          stock: 7,
          minStock: 15,
          bodega: 'Bodega 1',
          tipo: 'Tipo 1'
        },
        // Agrega más productos de prueba según tu estructura de datos
      ],
      productos: [
        {
          codigo: '001',
          nombre: 'Producto 1',
          stock: 10,
          bodega: 'Bodega 1',
          tipo: 'Tipo 1'
        },
        {
          codigo: '002',
          nombre: 'Producto 2',
          stock: 5,
          bodega: 'Bodega 2',
          tipo: 'Tipo 2'
        },
        {
          codigo: '003',
          nombre: 'Producto 3',
          stock: 7,
          bodega: 'Bodega 1',
          tipo: 'Tipo 1'
        },
        {
          codigo: '004',
          nombre: 'Producto 4',
          stock: 12,
          bodega: 'Bodega 2',
          tipo: 'Tipo 3'
        },
        {
          codigo: '005',
          nombre: 'Producto 5',
          stock: 45,
          bodega: 'Bodega 1',
          tipo: 'Tipo 2'
        },
        {
          codigo: '006',
          nombre: 'Producto 6',
          stock: 12,
          bodega: 'Bodega 3',
          tipo: 'Tipo 1'
        },
        // Agrega más productos de prueba según tu estructura de datos
      ],
      productosLowClone: [
        {
          codigo: '001',
          nombre: 'Producto 1',
          stock: 10,
          minStock: 20,
          bodega: 'Bodega 3',
          tipo: 'Tipo 1'
        },
        {
          codigo: '002',
          nombre: 'Producto 2',
          stock: 5,
          minStock: 10,
          bodega: 'Bodega 3',
          tipo: 'Tipo 2'
        },
        {
          codigo: '003',
          nombre: 'Producto 3',
          stock: 7,
          minStock: 15,
          bodega: 'Bodega 1',
          tipo: 'Tipo 1'
        },
        // Agrega más productos de prueba según tu estructura de datos
      ],
      productosClone: [
        {
          codigo: '001',
          nombre: 'Producto 1',
          stock: 10,
          bodega: 'Bodega 1',
          tipo: 'Tipo 1'
        },
        {
          codigo: '002',
          nombre: 'Producto 2',
          stock: 5,
          bodega: 'Bodega 2',
          tipo: 'Tipo 2'
        },
        {
          codigo: '003',
          nombre: 'Producto 3',
          stock: 7,
          bodega: 'Bodega 1',
          tipo: 'Tipo 1'
        },
        {
          codigo: '004',
          nombre: 'Producto 4',
          stock: 12,
          bodega: 'Bodega 2',
          tipo: 'Tipo 3'
        },
        {
          codigo: '005',
          nombre: 'Producto 5',
          stock: 45,
          bodega: 'Bodega 1',
          tipo: 'Tipo 2'
        },
        {
          codigo: '006',
          nombre: 'Producto 6',
          stock: 12,
          bodega: 'Bodega 3',
          tipo: 'Tipo 1'
        },
        // Agrega más productos de prueba según tu estructura de datos
      ],
      movementsData: [
        {
          id: 1,
          date: '2023-06-01',
          description: '5 entradas de tela Brush Azul',
          warehouse: 'Bodega 1',
          responsible: 'Andrés Méndez'
        },
        {
          id: 2,
          date: '2023-06-02',
          description: '5 salidas de tela Brush Negra',
          warehouse: 'Bodega 2',
          responsible: 'Jane Alfaro'
        },
        {
          id: 3,
          date: '2023-06-03',
          description: '3 entradas de rollos de hilo Blanco',
          warehouse: 'Bodega 3',
          responsible: 'Silvia Castro'
        }
        // Agrega más objetos de movimiento según tu estructura de datos
      ],
      selectedBodega: '', // Valor seleccionado en el dropdown de bodega
      selectedTipo: '', // Valor seleccionado en el dropdown de tipo de artículo
      bodegas: ['Bodega 1', 'Bodega 2', 'Bodega 3'], // Valores posibles para el dropdown de bodega
      tipos: ['Tipo 1', 'Tipo 2', 'Tipo 3'], // Valores posibles para el dropdown de tipo de artículo
      chartTop10: null,
      chartLow: null,
    };
  },
  computed: {
    ...mapState(['checkboxValue']),
    checked: {
      get() {
        return this.checkboxValue;
      },
    },
  },
  mounted() {
    this.sortedMovements = this.sortMovements();
    this.createChartTop10();
    this.createChartLow();
    const store = useStore();
    store.commit('setNavbarTitle', 'Inicio');
    const user = store.state.user;
    if (!store.state.LogAttempts) {
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
    ...mapMutations(['toggleCheckboxValue']),
    sortMovements() {
      return [...this.movementsData].sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    createChartTop10() {
      const canvas = this.$refs.chartCanvas;
      const ctx = canvas.getContext('2d');

      let sortedProductos = [...this.productos].sort((a, b) => b.stock - a.stock);
      let tiposTelas = sortedProductos.map((producto) => producto.nombre);
      let inventario = sortedProductos.map((producto) => producto.stock);

      this.chartTop10 = shallowRef(new Chart(ctx, {
        type: 'bar',
        data: {
          labels: tiposTelas,
          datasets: [
            {
              label: 'Salidas de inventario',
              data: inventario,
              backgroundColor: 'rgba(37, 168, 150, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: 'y', // Rotate the chart by 90 degrees
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
            },
            y: {
              grid: {
                display: false,
              },
            },
          },
        },
      }));
    },

    createChartLow() {
      const canvas = this.$refs.chartLow;
      const ctx = canvas.getContext('2d');

      const sortedProductosLow = [...this.productosLow].sort((a, b) => a.stock - b.stock);
      const tiposTelas = sortedProductosLow.map((producto) => producto.nombre);
      const inventario = sortedProductosLow.map((producto) => producto.stock);
      const nivelDeseado = sortedProductosLow.map((producto) => producto.minStock);

      this.chartLow = shallowRef (new Chart(ctx, {
        type: 'bar',
        data: {
          labels: tiposTelas,
          datasets: [
            {
              label: 'Nivel actual de stock',
              data: inventario,
              backgroundColor: 'rgba(250, 10, 10, 0.5)',
              borderColor: 'rgba(70, 70, 70, 1)',
              borderWidth: 1,
            },
            {
              label: 'Nivel Deseado',
              data: nivelDeseado,
              backgroundColor: 'rgba(10, 10, 255, 0.5)',
              borderColor: 'rgba(70, 70, 70, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
            },
          },
        },
      }));
    },
    filterProductos() {
      this.productos = this.productosClone;
      this.productosLow = this.productosLowClone;
      let productosFiltrados = [...this.productos];
      let productosLowFiltrados = [...this.productosLow];

      if (this.selectedBodega) {
        productosFiltrados = productosFiltrados.filter((producto) => producto.bodega === this.selectedBodega);
      }

      if (this.selectedTipo) {
        productosFiltrados = productosFiltrados.filter((producto) => producto.tipo === this.selectedTipo);
      }

      if (this.selectedBodega) {
        productosLowFiltrados = productosLowFiltrados.filter((producto) => producto.bodega === this.selectedBodega);
      }

      if (this.selectedTipo) {
        productosLowFiltrados = productosLowFiltrados.filter((producto) => producto.tipo === this.selectedTipo);
      }

      this.productos = productosFiltrados;
      this.productosLow = productosLowFiltrados;

      this.updateChartLow();
      this.updateChartTop10();

    }
    ,
    hacerEntrada(index) {
      const code = this.productosLow[index].codigo;
      const name = this.productosLow[index].nombre;
      this.$router.push({
        name: 'EntryMin',
        params: {
          code: code,
          name: name,
        },
      });
    },
    updateChartTop10() {
      if (this.chartTop10) {
        const sortedProductos = [...this.productos].sort((a, b) => b.stock - a.stock);
        const tiposTelas = sortedProductos.map((producto) => producto.nombre);
        const inventario = sortedProductos.map((producto) => producto.stock);

        this.chartTop10.data.labels = tiposTelas;
        this.chartTop10.data.datasets[0].data = inventario;
        this.chartTop10.update();
      }
    },

    updateChartLow() {
      if (this.chartLow) {
        const sortedProductosLow = [...this.productosLow].sort((a, b) => a.stock - b.stock);
        const tiposTelas = sortedProductosLow.map((producto) => producto.nombre);
        const inventario = sortedProductosLow.map((producto) => producto.stock);
        const nivelDeseado = sortedProductosLow.map((producto) => producto.minStock);

        this.chartLow.data.labels = tiposTelas;
        this.chartLow.data.datasets[0].data = inventario;
        this.chartLow.data.datasets[1].data = nivelDeseado;
        this.chartLow.update();
      }
    },

  },
};
</script>

<style scoped>
#check:checked ~ .container-fluid {
  padding-left: 345px;
  max-width: 1800px;
}

.container-fluid {
  margin-top: 20px;
  margin-left: auto;
}

.button-container {
  display: flex;
  gap: 10px;
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

.filter-container {
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.filter-row label {
  margin-right: 10px;
}

.filter-row select {
  padding: 5px;
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
