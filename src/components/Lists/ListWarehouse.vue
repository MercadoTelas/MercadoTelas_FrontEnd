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
          <table class="table">
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
                      params: { id: warehouse.id }
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
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


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
          axios
            .delete(`${API_URL}/warehouses/${warehouse.id}`)
            .then((response) => {
              console.log(response);
              // Eliminar la bodega de la lista
              this.warehouses = this.warehouses.filter(
                (w) => w.id !== warehouse.id
              );
              toast.success(`Se ha eliminado la bodega correctamente`, {
                position: 'top-right',
                timeout: 2000,
                closeOnClick: true,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
              });
            })
            .catch((error) => {
              console.log(error);
              toast.error(`Ha ocurrido un error al eliminar la bodega`, {
                position: 'top-right',
                timeout: 2000,
                closeOnClick: true,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
              });
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

.table {
  margin-top: 20px;
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
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
