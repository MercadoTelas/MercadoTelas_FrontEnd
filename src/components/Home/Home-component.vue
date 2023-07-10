<template>
  
  <input
      type="checkbox"
      id="check"
      v-model="checked"
      @change="handleCheckboxChange"
  />
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
