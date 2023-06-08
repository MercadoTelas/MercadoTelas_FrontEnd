<template>
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-2">
          <sidebar></sidebar>
        </div>
        <div class="col-lg-9">
          <div class="movement-table">
            <h1 class="header text-primary">Lista de los últimos movimientos realizados en el inventario</h1>
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Fecha de movimiento</th>
                    <th>Descripción del movimiento</th>
                    <th>Bodega</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="movement in sortedMovements" :key="movement.id">
                    <td>{{ movement.date }}</td>
                    <td>{{ movement.description }}</td>
                    <td>{{ movement.warehouse }}</td>
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
  export default {
    name: 'MovementTable',
    data() {
      return {
        sortedMovements: [],
        movementsData: [
          { id: 1, date: '2023-06-01', description: 'Movimiento 1', warehouse: 'Bodega A' },
          { id: 2, date: '2023-06-02', description: 'Movimiento 2', warehouse: 'Bodega B' },
          { id: 3, date: '2023-06-03', description: 'Movimiento 3', warehouse: 'Bodega A' },
          // Agrega más objetos de movimiento según tu estructura de datos
        ],
      };
    },
    mounted() {
      this.sortedMovements = this.sortMovements();
    },
    methods: {
      sortMovements() {
        return [...this.movementsData].sort((a, b) => new Date(b.date) - new Date(a.date));
      },
    },
  };
  </script>
  
  <style scoped>
  .movement-table {
    margin-left: 150px;
    margin-top: 15px;
  }
  
  .header {
    font-size: 24px;
    color: blue;
    margin-bottom: 20px;
  }
  
  @media (max-width: 768px) {
    .header {
      font-size: 18px;
    }
  }
  </style>
  