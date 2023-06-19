<template>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import Chart from 'chart.js/auto';
  
  export default {
    mounted() {
      this.createChart();
    },
    methods: {
      createChart() {
        const canvas = this.$refs.chartCanvas;
        const ctx = canvas.getContext('2d');
  
        const tiposTelas = ['Algodón', 'Seda', 'Lino', 'Poliéster'];
        const inventario = [25, 18, 10, 32];
  
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: tiposTelas,
            datasets: [{
              data: inventario,
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
  