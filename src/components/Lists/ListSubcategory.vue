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
          <label for="search" class="form-label">Buscar subcategoría:</label>
          <input
            type="text"
            id="search"
            class="form-control"
            v-model="searchQuery"
            placeholder="Buscar por nombre o categoría"
          />
        </div>

        <div class="row">
          <div class="col-md-12">
            <button @click="addSubcategory" class="btn btn-success">
              Agregar subcategoría
            </button>
          </div>
        </div>

        <div class="table-container" style="max-height: 700px !important">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th class="text-center">Nombre de Subcategoría</th>
                <th class="text-center">Categoría asociada</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="subcategory in filteredSubcategories"
                :key="subcategory.id"
              >
                <td class="text-center">{{ subcategory.name }}</td>
                <td class="text-center">{{ subcategory.category.name }}</td>
                <td class="text-center">
                  <button
                    @click="editSubcategory(subcategory)"
                    class="btn btn-secondary"
                  >
                    Editar subcategoría
                  </button>
                  <button
                    @click="deleteSubcategory(subcategory)"
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
  name: "SubcategoryList",
  data() {
    return {
      subcategories: [],
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
    filteredSubcategories() {
      return this.subcategories.filter((subcategory) => {
        return (
          subcategory.name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          subcategory.category.name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        );
      });
    },
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    addSubcategory() {
      // Redirigir a la vista de agregar subcategoría
      this.$router.push({ name: "AddSubcategory" });
    },
    editSubcategory(subcategory) {
      // Redirigir a la vista de editar subcategoría
      this.$router.push({
        name: "EditSubcategory",
        params: { id: subcategory.id },
      });
    },
    deleteSubcategory(subcategory) {
      // Lógica para eliminar una subcategoría
      Swal.fire({
        title: "¿Estás seguro?",
        text: `Se eliminará la subcategoría ${subcategory.name}. Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(API_URL + "/subcategories/" + subcategory.id)
            .then((response) => {
              // Eliminar la subcategoría de la lista
              this.subcategories = this.subcategories.filter(
                (subcategory) => subcategory.id !== response.data.id
              );
              toast.success(`Se ha eliminado la subcategoría correctamente`, {
                position: "top-right",
                timeout: 2000,
                closeOnClick: true,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
              });
            })
            .catch((error) => {
              console.log(error);
              toast.error(
                `Ha ocurrido un error al eliminar la subcategoría, esto debido a que hay artículos asociados a esta subcategoría`,
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
    this.$state.navbarTitle = "Lista de Subcategorías";
    // Obtener todas las subcategorías desde la API
    axios
      .get(API_URL + "/subcategories")
      .then((response) => {
        this.subcategories = response.data;
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
