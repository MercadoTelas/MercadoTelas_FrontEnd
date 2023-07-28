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
    <div class="table-container" style="max-height: 700px !important;">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col" class="text-center">Código</th>
            <th scope="col" class="text-center">Nombre</th>
            <th scope="col" class="text-center">Categoría</th>
            <th scope="col" class="text-center">Subcategoría</th>
            <th scope="col" class="text-center">Inventario mínimo</th>
            <th scope="col" class="text-center">Unidades</th>
            <th scope="col" class="text-center">Estado</th>
            <th scope="col" class="text-center">Marca</th>
            <th scope="col" class="text-center">Diseño</th>
            <th scope="col" class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredArticles" :key="item.id">
            <td class="text-center">{{ item.general_code }}</td>
            <td class="text-center">{{ item.name }}</td>
            <td class="text-center">{{ item.category_name }}</td>
            <td class="text-center">{{ item.subcategory_name }}</td>
            <td class="text-center">
              {{ item.minimal_stock }}
            </td>
            <td class="text-center">
              {{ item.storing_format_units_name }}
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
                >Detalles
              </router-link>
              <router-link
                :to="{ name: 'EditArticle', params: { id: item.id } }"
                class="btn btn-secondary"
                >Editar
              </router-link>
              <button
                v-if="
                  item.transfers <= 0 &&
                  item.insertions <= 0 &&
                  item.removals <= 0
                "
                @click="deleteArticle(item)"
                class="btn btn-danger"
              >
                Eliminar
              </button>
              <button
                v-else-if="item.status === 'active'"
                @click="toggleItemStatus(item)"
                class="btn btn-warning"
              >
                Desactivar
              </button>
              <button
                v-else-if="item.status === 'inactive'"
                @click="toggleItemStatus(item)"
                class="btn btn-warning"
              >
                Activar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

import { API_URL } from "@/config";

export default {
  name: "ArticleList",
  data() {
    return {
      items: [],
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
          item.general_code.toLowerCase().includes(search) ||
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
    deleteArticle(item) {
      // Lógica para eliminar un artículo
      Swal.fire({
        title: "¿Estás seguro?",
        text: `Se eliminará el artículo ${item.name}. Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(
              API_URL +
                "/items/?id=" +
                item.id +
                "&user=" +
                this.$store.state.user.id
            )
            .then((response) => {
              console.log(response);
              toast.success(`Se ha eliminado el artículo correctamente`, {
                position: "top-right",
                timeout: 2000,
                closeOnClick: true,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
              });
              // Eliminar el artículo de la lista
              this.items = this.items.filter(
                (article) => article.id !== item.id
              );
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
    toggleItemStatus(item) {
      console.log(item);
      Swal.fire({
        title: "¿Estás seguro?",
        text: `Se ${
          item.status === "active" ? "desactivará" : "activará"
        } el artículo ${item.name}. ${
          item.status === "active"
            ? "No se podrá realizar ninguna operación con este artículo."
            : ""
        }`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: `Sí, ${
          item.status === "active" ? "desactivarlo" : "activarlo"
        }`,
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .put(API_URL + "/items/" + item.id + "/toggle_status", {
              id: item.id,
              user: this.$store.state.user.id,
            })
            .then((response) => {
              console.log(response);
              toast.success(
                `Se ha ${
                  item.status === "active" ? "desactivado" : "activado"
                } el artículo correctamente`,
                {
                  position: "top-right",
                  timeout: 2000,
                  closeOnClick: true,
                  pauseOnFocusLoss: true,
                  pauseOnHover: true,
                }
              );
              // Cambiar el estado del artículo
              item.status = item.status === "active" ? "inactive" : "active";
            })
            .catch((error) => {
              console.log(error);
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
        console.log(response);
        this.items = response.data;
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
