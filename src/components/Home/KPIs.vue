<template>
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
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import axios from "axios";
import { API_URL } from '@/config';

export default {
  data() {
    return {
      productos: []
    };
  },
  mounted() {
    this.fetchItems();
  },
  methods: {
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
      const sortedItems = this.productos.sort((a, b) => b.stock - a.stock);

      const labels = sortedItems.map((item) => item.nombre);
      const data = sortedItems.map((item) => item.stock);

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: tiposTelas,
          datasets: [
            {
              data: inventario,
              labels: labels,
              datasets: [
                {
                  data: data,
                  backgroundColor: 'rgba(54, 162, 235, 0.5)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1
                }
              ]
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
    hacerEntrada(index) {
      // Lógica para realizar una entrada en el producto seleccionado
      // Puedes implementar aquí tu código para hacer las modificaciones necesarias en el stock del producto
      // Por ejemplo, puedes usar una llamada a una API o actualizar los datos localmente
      console.log('Haciendo entrada para el producto con índice:', index);
    }
  }
};
</script>

<style>
.centered-div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.chart-container {
  width: 80%;
  height: 470px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

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
