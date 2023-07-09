<template>
  <input
    type="checkbox"
    id="check"
    v-model="checked"
    @change="handleCheckboxChange"
  />

  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="mb-3">
          <label for="search" class="form-label">Buscar bodega:</label>
          <input
            type="text"
            id="search"
            class="form-control"
            v-model="searchQuery"
            placeholder="Buscar por nombre"
          />
        </div>

        <div class="row">
          <div class="col-md-12">
            <button @click="addWarehouse" class="btn btn-success">
              Agregar bodega
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-responsive table-bordered table-secondary">
            <thead>
              <tr>
                <th class="text-center">Nombre de Bodega</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="warehouse in filteredWarehouses" :key="warehouse.name">
                <td class="text-center">{{ warehouse.name }}</td>
                <td class="text-center">
                  <router-link
                    :to="{
                      name: 'EditWarehouse',
                      params: { id: warehouse.id },
                    }"
                    class="btn btn-secondary"
                    >Editar</router-link
                  >
                  <button
                    @click="deleteWarehouse(warehouse)"
                    class="btn btn-danger"
                  >
                    Eliminar
                  </button>
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
import { mapState, mapMutations } from "vuex";
import Swal from "sweetalert2";
import axios from "axios";
import { API_URL } from "@/config";

export default {
  name: "WarehouseList",
  data() {
    return {
      warehouses: [],
      searchQuery: "",
    };
  },
  computed: {
    ...mapState(["checkboxValue"]),
    checked: {
      get() {
        return this.checkboxValue;
      },
    },
    filteredWarehouses() {
      return this.warehouses.filter((warehouse) => {
        return warehouse.name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
      });
    },
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    addWarehouse() {
      // Redirigir a la vista de agregar bodega
      this.$router.push({ name: "AddWarehouse" });
    },
    deleteWarehouse(warehouse) {
      // Lógica para eliminar una bodega
      Swal.fire({
        title: "¿Estás seguro?",
        text: `Se eliminará la bodega ${warehouse.name}. Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          // Lógica para eliminar la bodega aquí
          // ...

          Swal.fire({
            title: "Eliminada",
            text: "La bodega ha sido eliminada correctamente.",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        }
      });
    },
  },
  mounted() {
    this.$state.navbarTitle = "Lista de Bodegas";
    // Obtener todas las bodegas desde la API
    axios
      .get(`${API_URL}/warehouses`)
      .then((response) => {
        this.warehouses = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style>
#check:checked ~ .container {
  padding-left: 345px;
  max-width: 1500px;
}

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
