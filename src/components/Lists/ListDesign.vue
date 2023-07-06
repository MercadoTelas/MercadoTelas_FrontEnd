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
          <table class="table table-responsive table-bordered table-secondary">
            <thead>
            <tr>
              <th class="text-center">Nombre de Diseño</th>
              <th class="text-center">Acciones</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="design in filteredDesigns" :key="design.name">
              <td class="text-center">{{ design.name }}</td>
              <td class="text-center">
                <button @click="editDesign(design)" class="btn btn-secondary">Editar</button>
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
import Swal from 'sweetalert2';
import axios from "axios";
import { API_URL } from "@/config";

export default {
  name: 'DesignList',
  data() {
    return {
      designs: [],
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
      // Redirigir a la vista "Agregar Diseño"
      this.$router.push({name: 'AddDesign'});
    },
    editDesign(design) {
      // Redirigir a la vista "Editar Diseño" con el ID del diseño
      this.$router.push({name: 'EditDesign', params:{id: design.id}});
    },
    deleteDesign(design) {
      // Lógica para eliminar un diseño
      Swal.fire({
        title: '¿Estás seguro?',
        text: `Se eliminará el diseño ${design.name}. Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Lógica para eliminar el diseño aquí
          // ...

          Swal.fire({
            title: 'Eliminado',
            text: 'El diseño ha sido eliminado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Lista de Diseños';
    // Obtener todos los diseños desde la API
    axios.get(`${API_URL}/designs`).then(response => {
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
