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

        <div>
          <table class="table">
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
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


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
          // Lógica para eliminar la subcategoría aquí
          // ...
          this.subcategories = this.subcategories.filter(
            (s) => s.id !== subcategory.id
          );
          toast.success(`Se ha eliminado la subcategoría correctamente`, {
              position: 'top-right',
              timeout: 2000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
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
}

.table th,
.table td {
  padding: 8px;
  vertical-align: middle;
}

.table th {
  background-color: #f2f2f2;
}
</style>
