<template>
    <div class="movement-table">
      <table>
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
  </template>
  
  <script>
  export default {
    name: 'MovementTable',
    props: {
      movements: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        sortedMovements: []
      };
    },
    mounted() {
      this.sortedMovements = this.sortMovements();
    },
    methods: {
      sortMovements() {
        return [...this.movements].sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    }
  };
  </script>
  
  <style scoped>
  .movement-table {
    overflow-x: auto;
    width: 100%;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th,
  td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  @media (max-width: 768px) {
    table {
      font-size: 12px;
    }
  }
  </style>
  