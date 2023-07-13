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
        <div class="row mb-lg-5">
          <h1> Inventario en el Sistema </h1>
        </div>
        <div class="row border rounded-3 p-3 mb-lg-5">
          <h4 class="filter-title">Filtros</h4>
          <div class="filters-container row">
            <div class="col-md-2">
              <div class="form-group code">
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
                  <option value="">Todas las categorías</option>
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
                  <option value="">Todas las subcategorías</option>
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
                <select id="design" class="form-control" v-model="filter.design">
                  <option value="">Todos los diseños</option>
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
                  <option value="">Todas las marcas</option>
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
            <button
                class="btn btn-secondary"
                style="width: 200px; margin: 10px"
                @click="resetFilter('all')"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        <div class="mt-lg-4">
          <div class="row">
            <h3>Tabla de Inventario de Artículos</h3>
          </div>
          <div class="row">
            <div>
              <table class="table">
                <thead>
                <tr>
                  <th class="text-center">Código</th>
                  <th class="text-center">Nombre</th>
                  <th class="text-center">Stock Total</th>
                  <th v-for="warehouse in warehouses" :key="warehouse.name" class="text-center">
                    Stock {{ warehouse.name }}
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in filteredItems" :key="item.id">
                  <td class="text-center">
                    <i
                        class="bi bi-caret-right-fill"
                        style="margin-right: 2px"
                    ></i>
                    <router-link
                        :to="{
                      name: 'ArticleDetails',
                      params: { id: item.id },
                    }"
                        style="
                      background-color: transparent;
                      color: black;
                      text-decoration: none;
                    "
                    >{{ item.id }}
                    </router-link>
                  </td>
                  <td class="text-center">{{ item.name }}</td>
                  <td :class="{'text-danger': calculateStockUnits(item) < item.minimal_stock}" class="text-center">
                    {{ calculateStockUnits(item) }} {{ item.storing_format_units_name }}
                  </td>
                  <td v-for="inventory_item in item.inventory_items" :key="inventory_item.id" class="text-center">
                    {{ inventory_item.storing_format_units }} {{ item.storing_format_units_name }}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {API_URL} from "@/config";
import {mapState, mapMutations} from "vuex";

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
            item.id.toUpperCase().includes(this.filter.id.toUpperCase()) &&
            (this.filter.category === "" || item.category === this.filter.category) &&
            (this.filter.subcategory === "" || item.subcategory === this.filter.subcategory) &&
            (this.filter.design === "" || (item.design && item.design.name === this.filter.design)) &&
            (this.filter.brand === "" || (item.brand && item.brand.name === this.filter.brand)) &&
            (this.filter.warehouse === "" || item.warehouse === this.filter.warehouse)
        );
      }).sort((a, b) => a.category.localeCompare(b.category));
    },
  },
  mounted() {
    this.$state.navbarTitle = "Consulta de inventario";
    //Gets the all elements from the API
    axios
        .get(API_URL + "/stock")
        .then((response) => {
          console.log(response.data);
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
    calculateStockUnits(item) {
      let totalUnits = 0;
      item.inventory_items.forEach((inventoryItem) => {
        const units = parseFloat(inventoryItem.storing_format_units);
        if (!isNaN(units)) {
          totalUnits += units;
        }
      });
      return totalUnits;
    },
    resetFilter(filterName) {
      switch (filterName) {
        case "all":
          this.filter.id = "";
          this.filter.category = "";
          this.filter.subcategory = "";
          this.filter.design = "";
          this.filter.brand = "";
          this.filter.warehouse = "";
          break;
        default:
          break;
      }
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

.filters-container {
  margin-bottom: 10px;
}

.filters-container div {
  margin-left: 0;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background-color: #007bff;
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

.filter-title {
  margin-bottom: 20px;
  color: #0a4481;
}

.container-fluid {
  padding: 20px;
}

#contentDiv {
  height: 100%;
}
</style>
