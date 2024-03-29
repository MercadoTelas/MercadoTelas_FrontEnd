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

        <div class="table-container" style="max-height: 700px !important">
          <table class="table table-bordered">
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
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

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
                position: "top-right",
                timeout: 2000,
                closeOnClick: true,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
              });
            })
            .catch((error) => {
              console.log(error);
              toast.error(`Ha ocurrido un error al eliminar la bodega`, {
                position: "top-right",
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

<style scoped>
#check:checked ~ .container {
  padding-left: 345px;
  max-width: 1500px;
}

.container {
  padding-top: 20px;
  padding-bottom: 20px;
  max-width: 90%;
  height: fit-content;
}

.table-container {
  height: 700px;
  overflow: auto;
}

.table-hover tbody tr:hover td {
  justify-content: center;
}

.btn {
  margin: 3px;
}

.table td {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.table {
  margin-top: 20px;
  border-spacing: 0;
}

.table thead {
  position: sticky;
  top: 0;
}

.table th,
.table td {
  vertical-align: middle;
  padding-bottom: -10px;
}

.table th {
  top: 0;
  background-color: #f2f2f2 !important;
}

.table th::before {
  content: "";
  position: absolute;
  top: -1px;
  left: -1px;
  right: 0;
  bottom: -1px;
  border: 2px solid #000;
}

@media (max-width: 1000px) {
  #check:checked ~ .container {
    padding-left: 100px;
  }
  .container {
    padding-left: 40px;
    overflow-x: auto;
    max-width: 600px;
  }

  .table {
    min-width: 1000px;
    overflow-x: auto;
  }
}
</style>
