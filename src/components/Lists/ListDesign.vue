<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="mb-3">
          <label for="search" class="form-label">Buscar diseño:</label>
          <input type="text" id="search" class="form-control" v-model="searchQuery" placeholder="Buscar por nombre">
        </div>
        <div class="row">
          <div class="col-md-12">
            <button @click="addDesign" class="btn btn-success">Agregar diseño</button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Nombre de Diseño</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="design in filteredDesigns" :key="design.name">
                <td>{{ design.name }}</td>
                <td>
                  <button @click="viewDesign(design)" class="btn btn-primary">Ver diseño</button>
                  <button @click="deleteDesign(design)" class="btn btn-danger">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from "@/config";

export default {
  name: 'DesignList',
  data() {
    return {
      designs: [
      { name: 'Estampado' },
        { name: 'Liso' },
        { name: 'Arrugado' },
      ],
      searchQuery: '',
    };
  },
  computed: {
    filteredDesigns() {
      return this.designs.filter((design) => {
        return design.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  },
  methods: {
    addDesign() {
      // Lógica para agregar un nuevo diseño
      // ...
    },
    viewDesign(/*design*/) {
      // Lógica para ver los detalles de un diseño
      // ...
    },
    deleteDesign(/*design*/) {
      // Lógica para eliminar un diseño
      // ...
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Lista de Diseños';
    // Obtener todos los diseños desde la API
    axios.get(API_URL + '/designs').then(response => {
      this.designs = response.data;
    }).catch(error => {
      console.log(error);
    });
  },
};
</script>

<style>
.container {
  padding-top: 20px;
  padding-bottom: 20px;
}

.text-primary {
  color: #007bff;
}

.table {
  margin-top: 20px;
}

.table th,
.table td {
  padding: 8px;
  vertical-align: middle;
}

.table th {
  background-color: #f2f2f2;
}

@media (max-width: 576px) {
  .table-responsive {
    overflow-x: auto;
  }
}
</style>
