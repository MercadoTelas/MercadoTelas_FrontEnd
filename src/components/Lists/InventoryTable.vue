<template>
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />
  <div class="container-fluid">
    <div class="row">
      <div id="contentDiv" class="col-lg-10 col-md-12">
        <h2 class="filter-title">Filtros</h2>
        <div class="filters-container row">
          <div class="col-md-2">
            <div class="form-group code">
              <label for="codigo">Código de Artículo:</label>
              <input type="text" id="codigo" class="form-control" v-model="filter.id" placeholder="Código" />
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label for="category">Categoría:</label>
              <select id="category" class="form-control" v-model="filter.category" @change="resetSubcategory()">
                <option value="" disabled>Seleccionar categoría</option>
                <option v-for="category in categories" :value="category.name" :key="category.name">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label for="subcategory">Subcategoría:</label>
              <select id="subcategory" class="form-control" v-model="filter.subcategory">
                <option value="" disabled selected>
                  Seleccionar subcategoría
                </option>
                <option v-for="subcategory in filteredSubcategories" :value="subcategory.name" :key="subcategory.name">
                  {{ subcategory.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label for="design">Diseño:</label>
              <select id="design" class="form-control" v-model="filter.design">
                <option value="" disabled selected>Seleccionar diseño</option>
                <option v-for="design in designs" :value="design.name" :key="design.name">
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
                <option v-for="brand in brands" :value="brand.name" :key="brand.name">
                  {{ brand.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label for="warehouse">Bodega:</label>
              <select id="warehouse" class="form-control" v-model="filter.warehouse">
                <option value="" selected disabled>Seleccionar bodega</option>
                <option v-for="warehouse in warehouses" :value="warehouse.name" :key="warehouse.name">
                  {{ warehouse.name }}
                </option>
              </select>
            </div>

          </div>
          <button class="btn btn-secondary" style="width: 200px;margin: 10px;" @click="resetFilter('all')">Limpiar</button>
        </div>

        <h2 class="filter-title text-center">Tabla de Inventario</h2>

        <div class="table-responsive table-scroll">

          <table class="table table-bordered">
            <thead>
              <tr>
                <th class="text-primary">Código</th>
                <th class="text-primary">Nombre</th>
                <th class="text-primary">Unidades de Entrada</th>
                <th class="text-primary">Unidades de Salida</th>
                <th class="text-primary">Bodega</th>
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
    resetFilter(filterName) {
      switch (filterName) {
        case 'all':
          this.filter.codigo = '';
          this.filter.category = '';
          this.filter.subcategory = '';
          this.filter.design = '';
          this.filter.brand = '';
          this.filter.warehouse = '';
          break;
        default:
          break;
      }
    }
  },
};
</script>

<style>
#check:checked~.container-fluid {
  padding-left: 345px;
}

#check:checked~#contentDiv {
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
  margin-left: 0px;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background-color: #007bff;
}

.thead {
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

.text-primary {
  color: #1512de;
}

.container-fluid {
  padding: 20px;
}

#contentDiv {
  height: 100%;
}
</style>
