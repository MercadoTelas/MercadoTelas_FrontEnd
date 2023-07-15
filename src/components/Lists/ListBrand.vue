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
          <label for="search" class="form-label">Buscar marca:</label>
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
            <button @click="addBrand" class="btn btn-success">
              Agregar marca
            </button>
          </div>
        </div>
        <div class="table-container" style="max-height: 700px !important">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th class="text-center">Nombre de Marca</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="brand in filteredBrands" :key="brand.name">
                <td class="text-center">{{ brand.name }}</td>
                <td class="text-center">
                  <router-link
                    :to="{ name: 'EditBrand', params: { id: brand.id } }"
                    class="btn btn-secondary"
                    >Editar</router-link
                  >
                  <button @click="deleteBrand(brand)" class="btn btn-danger">
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
  name: "BrandList",
  data() {
    return {
      brands: [],
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
    filteredBrands() {
      return this.brands.filter((brand) => {
        return brand.name
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
    addBrand() {
      // Redirigir a la página de agregar marca
      this.$router.push({ name: "AddBrand" });
    },
    deleteBrand(brand) {
      // Lógica para eliminar una marca
      Swal.fire({
        title: "¿Estás seguro?",
        text: `Se eliminará la marca ${brand.name}. Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          // Eliminar la marca
          axios
            .delete(API_URL + "/brands/" + brand.id)
            .then((response) => {
              console.log(response);
              toast.success(`Se ha eliminado la marca correctamente`, {
                position: "top-right",
                timeout: 2000,
                closeOnClick: true,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
              });
              this.brands = this.brands.filter((b) => b.id !== brand.id);
            })
            .catch((error) => {
              console.log(error);
              toast.error(
                `No se pudo eliminar, ya que posee artículos relacionados`,
                {
                  position: "top-right",
                  timeout: 2000,
                  closeOnClick: true,
                  pauseOnFocusLoss: true,
                  pauseOnHover: true,
                }
              );
            });
        }
      });
    },
  },
  mounted() {
    this.$state.navbarTitle = "Lista de Marcas";
    // Obtener todas las marcas desde la API
    axios
      .get(API_URL + "/brands")
      .then((response) => {
        this.brands = response.data;
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
