<template>
<<<<<<< HEAD:src/components/Home/KPIs.vue
  <div>
    <div class="centered-div">
      <h4 class="text-primary">Top 10 productos con más envíos a tienda</h4>
    </div>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
    <div class="centered-div">
      <h4 class="text-danger">Artículos por debajo de la cantidad mínima de stock</h4>
    </div>
    <table class="kpi-table">
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
            <button @click="hacerEntrada(index)">Hacer entrada</button>
          </td>
        </tr>
      </tbody>
    </table>
=======
  <div className="chart-container">
    <canvas ref="chartCanvas"></canvas>
>>>>>>> add_user:src/components/BarsGraphic.vue
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
<<<<<<< HEAD:src/components/Home/KPIs.vue
=======
import axios from "axios";
import {API_URL} from '@/config';
>>>>>>> add_user:src/components/BarsGraphic.vue

export default {
  data() {
    return {
<<<<<<< HEAD:src/components/Home/KPIs.vue
      productos: [
        { codigo: 'P001', nombre: 'Producto 1', stock: 25 },
        { codigo: 'P002', nombre: 'Producto 2', stock: 18 },
        { codigo: 'P003', nombre: 'Producto 3', stock: 10 },
        { codigo: 'P004', nombre: 'Producto 4', stock: 32 }
      ]
    };
  },
  mounted() {
    this.createChart();
  },
  methods: {
=======
      items: []
    };
  },
  mounted() {
    this.fetchItems();
  },
  methods: {
    fetchItems() {
      axios.get(`${API_URL}/items`)
          .then((response) => {
            this.items = response.data.items;
            this.createChart();
          })
          .catch((error) => {
            console.log(error);
          });
    },
>>>>>>> add_user:src/components/BarsGraphic.vue
    createChart() {
      const canvas = this.$refs.chartCanvas;
      const ctx = canvas.getContext('2d');

<<<<<<< HEAD:src/components/Home/KPIs.vue
      const tiposTelas = ['Algodón', 'Seda', 'Lino', 'Poliéster'];
      const inventario = [25, 18, 10, 32];
=======
      // Ordenar los artículos por cantidad de movimientos de mayor a menor
      const sortedItems = this.items.sort((a, b) => b.number_of_movements - a.number_of_movements);

      const labels = sortedItems.map(item => item.name);
      const data = sortedItems.map(item => item.number_of_movements);
>>>>>>> add_user:src/components/BarsGraphic.vue

      new Chart(ctx, {
        type: 'bar',
        data: {
<<<<<<< HEAD:src/components/Home/KPIs.vue
          labels: tiposTelas,
          datasets: [{
            data: inventario,
=======
          labels: labels,
          datasets: [{
            data: data,
>>>>>>> add_user:src/components/BarsGraphic.vue
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
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
<<<<<<< HEAD:src/components/Home/KPIs.vue
    },
    hacerEntrada(index) {
      // Lógica para realizar una entrada en el producto seleccionado
      // Puedes implementar aquí tu código para hacer las modificaciones necesarias en el stock del producto
      // Por ejemplo, puedes usar una llamada a una API o actualizar los datos localmente
      console.log('Haciendo entrada para el producto con índice:', index);
=======
>>>>>>> add_user:src/components/BarsGraphic.vue
    }
  }
};
</script>
<<<<<<< HEAD:src/components/Home/KPIs.vue
  
<style>
.centered-div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  /* Ajusta la altura según tus necesidades */
}

=======

<style>
>>>>>>> add_user:src/components/BarsGraphic.vue
.chart-container {
  width: 80%;
  height: 470px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
<<<<<<< HEAD:src/components/Home/KPIs.vue

.kpi-table {
  width: 80%;
  margin: auto;
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
</style>

  
=======
</style>
>>>>>>> add_user:src/components/BarsGraphic.vue
