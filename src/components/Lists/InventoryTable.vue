<template>
  <input
    type="checkbox"
    id="check"
    v-model="checked"
    @change="handleCheckboxChange"
  />
  <div class="container-fluid">
    <div class="row">
      <div id="contentDiv" class="col-lg-10 col-md-12">
        <div class="table-container">
          <h1 class="filter-title text-primary">Filtros</h1>
          <div class="filters-container row">
            <div class="col-md-2">
              <div class="form-group">
                <label for="codigo">Código de Artículo:</label>
                <input
                  type="text"
                  id="codigo"
                  class="form-control"
                  v-model="filter.id"
                  placeholder="Código"
                />
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="category">Categoría:</label>
                <select
                  id="category"
                  class="form-control"
                  v-model="filter.category"
                  @change="resetSubcategory()"
                >
                  <option value="" disabled>Seleccionar categoría</option>
                  <option
                    v-for="category in categories"
                    :value="category.name"
                    :key="category.name"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="subcategory">Subcategoría:</label>
                <select
                  id="subcategory"
                  class="form-control"
                  v-model="filter.subcategory"
                >
                  <option value="" disabled selected>
                    Seleccionar subcategoría
                  </option>
                  <option
                    v-for="subcategory in filteredSubcategories"
                    :value="subcategory.name"
                    :key="subcategory.name"
                  >
                    {{ subcategory.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="design">Diseño:</label>
                <select
                  id="design"
                  class="form-control"
                  v-model="filter.design"
                >
                  <option value="" disabled selected>Seleccionar diseño</option>
                  <option
                    v-for="design in designs"
                    :value="design.name"
                    :key="design.name"
                  >
                    {{ design.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="brand">Marca:</label>
                <select id="brand" class="form-control" v-model="filter.brand">
                  <option value="" selected disabled>Seleccionar marca</option>
                  <option
                    v-for="brand in brands"
                    :value="brand.name"
                    :key="brand.name"
                  >
                    {{ brand.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-auto">
              <div class="form-group">
                <label for="warehouse">Bodega:</label>
                <select
                  id="warehouse"
                  class="form-control"
                  v-model="filter.warehouse"
                >
                  <option value="" selected disabled>Seleccionar bodega</option>
                  <option
                    v-for="warehouse in warehouses"
                    :value="warehouse.name"
                    :key="warehouse.name"
                  >
                    {{ warehouse.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Unidades de Entrada</th>
                  <th>Unidades de Salida</th>
                  <th>Bodega</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredItems" :key="item.id">
                  <td>{{ item.item_id }}</td>
                  <td>{{ item.name }}</td>
                  <td>
                    {{ item.storing_format_units }}
                    {{ item.storing_unit_format_name }}
                  </td>
                  <td>
                    {{ item.transferring_format_units }}
                    {{ item.transferring_unit_format_name }}
                  </td>
                  <td>{{ item.warehouse }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from "@/config";
import { mapState, mapMutations } from "vuex";

export default {
  name: "InventoryTable",
  data() {
    return {
      filter: {
        id: "",
        category: "",
        subcategory: "",
        design: "",
        brand: "",
        warehouse: "",
      },
      items: [],
      categories: [],
      designs: [],
      brands: [],
      warehouses: [],
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
      return this.categories
        .filter((category) => {
          return category.name === this.filter.category;
        })
        .map((category) => {
          return category.subcategories;
        })
        .flat();
    },
    filteredItems() {
      return this.items.filter((item) => {
        return (
          item.item_id.toUpperCase().includes(this.filter.id.toUpperCase()) &&
          (this.filter.category === "" ||
            item.category === this.filter.category) &&
          (this.filter.subcategory === "" ||
            item.subcategory === this.filter.subcategory) &&
          (this.filter.design === "" || item.design === this.filter.design) &&
          (this.filter.brand === "" || item.brand === this.filter.brand) &&
          (this.filter.warehouse === "" ||
            item.warehouse === this.filter.warehouse)
        );
      });
    },
  },
  mounted() {
    this.$state.navbarTitle = "Inventario";
    //Gets the all elements from the API
    axios
      .get(API_URL + "/inventory_items")
      .then((response) => {
        this.items = response.data.items;
        this.categories = response.data.categories;
        this.designs = response.data.designs;
        this.brands = response.data.brands;
        this.warehouses = response.data.warehouses;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    resetSubcategory() {
      this.filter.subcategory = "";
    },
  },
};
</script>

<style>
#check:checked ~ .container-fluid {
  padding-left: 345px;
}

#check:checked ~ #contentDiv {
  height: auto;
  display: block;
}

.container-fluid div {
  justify-content: center;
  align-items: center;
}

.table-container {
  margin-top: 20px;
}

.filters-container {
  margin-bottom: 10px;
}

.filters-container div {
  margin-left: 0px;
}

.buttonClass {
  margin-right: 1000px;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  background-color: #f2f2f2;
}

.button-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  /* Agrega esta línea para envolver los botones en dispositivos móviles */
  align-items: flex-start;
  /* Alinea los botones al costado izquierdo en dispositivos móviles */
}

.button-group {
  display: flex;
  gap: 8px;
}

.button-group button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  cursor: pointer;
}

.button-group button:hover {
  background-color: #45a049;
}

.button-container button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  cursor: pointer;
}

.button-container button:hover {
  background-color: #e53935;
}

.filter-title {
  margin-bottom: 20px;
}

.text-primary {
  color: #007bff;
}

.container-fluid {
  padding: 20px;
}

#contentDiv {
  height: 100%;
}
</style>
