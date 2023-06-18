<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-2">
        <sidebar></sidebar>
      </div>
      <div class="col-lg-10">
        <div class="movement-table">
          <h1 class="header text-primary">Lista de los últimos movimientos realizados en el inventario</h1>
          <div class="table-responsive">
            <table class="table table-bordered">
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
</template>

<script>
export default {
  name: 'MovementTable',
  data() {
    return {
      sortedMovements: [],
      movementsData: [
        { id: 1, date: '2023-06-01', description: '5 entradas de tela Brush Azul', warehouse: 'Bodega 1', responsible: 'Andres Mendez' },
        { id: 2, date: '2023-06-02', description: '5 salidas de tela Brush Negra', warehouse: 'Bodega 2', responsible: 'Jane Alfaro' },
        { id: 3, date: '2023-06-03', description: '3 entradas de rollos de hilo Blanco', warehouse: 'Bodega 3', responsible: 'Silvia Castro' },
        // Agrega más objetos de movimiento según tu estructura de datos
      ],
    };
  },
  mounted() {
    // Llama a la función de actualización del título del navbar
    this.sortedMovements = this.sortMovements();
    this.$state.navbarTitle = 'Inicio';
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
  margin: 15px;
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

  .table-responsive {
    overflow-x: auto;
  }
}
</style>
