<template>
  <input
    type="checkbox"
    id="check"
    v-model="checked"
    @change="handleCheckboxChange"
  />
  <div class="container">
    <div class="row">
      <div class="col-md-12 mb-3 me-1 d-flex align-items-center">
        <div class="col-md-10 me-2">
          <label for="search" class="form-label">Buscar artículo:</label>
          <input
            type="text"
            id="search"
            class="form-control"
            v-model="searchQuery"
            placeholder="Buscar por cualquier característica"
          />
        </div>
        <div class="col-md-2 ms-2 align-self-center">
          <br />
          <button @click="addArticle" class="btn btn-success">
            Agregar artículo
          </button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="table-responsive col-md-12">
        <table
          class="table table-hover table-bordered table-secondary"
        >
          <thead>
            <tr>
              <th class="text-center">Código</th>
              <th class="text-center">Nombre</th>
              <th class="text-center">Categoría</th>
              <th class="text-center">Subcategoría</th>
              <th class="text-center">Inventario Mínimo</th>
              <th class="text-center">Estado</th>
              <th class="text-center">Marca</th>
              <th class="text-center">Diseño</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredArticles" :key="item.id">
              <td class="text-center">{{ item.id }}</td>
              <td class="text-center">{{ item.name }}</td>
              <td class="text-center">{{ item.category_name }}</td>
              <td class="text-center">{{ item.subcategory_name }}</td>
              <td class="text-center">
                {{ item.minimal_stock }} {{ item.storing_format_units_name }}
              </td>
              <td class="text-center">
                {{ item.status === "active" ? "Activo" : "Inactivo" }}
              </td>
              <td class="text-center">
                {{ item.brand_id !== null ? item.brand_name : "No posee" }}
              </td>
              <td class="text-center">
                {{ item.design_id !== null ? item.design_name : "No posee" }}
              </td>
              <td class="text-center">
                <router-link
                  :to="{ name: 'ArticleDetails', params: { id: item.id } }"
                  class="btn btn-primary"
                  >Detalles</router-link
                >
                <router-link
                  :to="{ name: 'EditArticle', params: { id: item.id } }"
                  class="btn btn-secondary"
                  >Editar</router-link
                >
                <button @click="deleteArticle(item)" class="btn btn-danger">
                  Eliminar
                </button>
              
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import { API_URL } from "@/config";

export default {
  name: "ArticleList",
  data() {
    return {
      items: [
      ],
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
    filteredArticles() {
      return this.items.filter((item) => {
        const search = this.searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(search) ||
          item.id.toLowerCase().includes(search) ||
          item.conversion_factor.toLowerCase().includes(search) ||
          item.minimal_stock.toLowerCase().includes(search) ||
          item.status.toLowerCase().includes(search) ||
          item.subcategory_name.toLowerCase().includes(search) ||
          item.category_name.toLowerCase().includes(search) ||
          (item.brand_name != null &&
            item.brand_name.toLowerCase().includes(search)) ||
          (item.design_name != null &&
            item.design_name.toLowerCase().includes(search))
        );
      });
    },
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    addArticle() {
      // Redireccionar a la vista de agregar artículo
      this.$router.push({ name: "AddArticle" });
    },
    deleteArticle(article) {
      // Lógica para eliminar un artículo
      Swal.fire({
        title: "¿Estás seguro?",
        text: `Se eliminará el artículo ${article.name}. Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          toast.success(`Se ha eliminado el artículo correctamente`, {
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
    this.$state.navbarTitle = "Lista de Artículos";
    // Obtener todos los artículos desde la API
    axios
      .get(API_URL + "/items")
      .then((response) => {
        console.log(response.data);
        this.items = response.data.items;
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

.table-container {
  overflow-x: auto;
  max-width: 100%;
}

.table-hover tbody tr:hover td {
  justify-content: center;
}

.text-primary {
  color: #007bff;
}

.btn {
  margin: 3px;
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
