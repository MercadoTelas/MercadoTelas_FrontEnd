<template>
  <div className="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import axios from "axios";
import {API_URL} from '@/config';

export default {
  data() {
    return {
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
    createChart() {
      const canvas = this.$refs.chartCanvas;
      const ctx = canvas.getContext('2d');

      // Ordenar los artículos por cantidad de movimientos de mayor a menor
      const sortedItems = this.items.sort((a, b) => b.number_of_movements - a.number_of_movements);

      const labels = sortedItems.map(item => item.name);
      const data = sortedItems.map(item => item.number_of_movements);

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: data,
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
    }
  }
};
</script>

<style>
.chart-container {
  width: 80%;
  height: 470px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
