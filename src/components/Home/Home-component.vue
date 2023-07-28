<template>
  <div>
    <input
      type="checkbox"
      id="check"
      v-model="checked"
      @change="handleCheckboxChange"
    />
    <div class="container-fluid">
      <div
        class="button-container"
        style="
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        "
      >
        <div class="filter-row">
          <label for="bodega">Bodega:</label>
          <select id="bodega" v-model="selectedWarehouse" @change="filterItems">
            <option value="">Todas las bodegas</option>
            <option
              v-for="warehouse in bodegas"
              :key="warehouse"
              :value="warehouse"
            >
              {{ warehouse }}
            </option>
          </select>
        </div>
        <div class="filter-row">
          <label for="tipo">Tipo de artículo:</label>
          <select id="tipo" v-model="selectedType" @change="filterItems">
            <option value="">Todos los types</option>
            <option v-for="category in types" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div class="filter-row">
          <label for="search">Buscar artículo:</label>
          <input
            type="text"
            id="search"
            v-model="searchQuery"
            @input="filterItems"
            placeholder="Escriba el nombre del artículo"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6">
          <div class="card" style="height: 450px !important">
            <div class="card-body">
              <h4 class="card-title text-success">
                Los 10 artículos más sacados de las bodegas
              </h4>
              <div class="chart-container">
                <canvas ref="chartCanvas"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card" style="height: 452px !important">
            <div class="card-body">
              <h4 class="card-title text-danger">
                Artículos por debajo de la cantidad mínima de stock
              </h4>
              <div
                class="table-container"
                id="underStockTable"
                style="max-height: 350px; overflow-y: auto"
              >
                <table class="table table-bordered kpi-table">
                  <thead>
                    <tr>
                      <th>Código de item</th>
                      <th>Nombre</th>
                      <th>Cantidad de stock</th>
                      <th>Bodega</th>
                      <th>Marcar para hacer entrada</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in low_stock_items" :key="index">
                      <td>{{ item.general_code }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.storing_format_units }}</td>
                      <td>{{ item.warehouse }}</td>
                      <td>
                        <input
                          type="checkbox"
                          :value="item"
                          v-model="selectedItems"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button
                @click="createEntryTransaction"
                class="btn btn-success"
                :disabled="
                  selectedItems.length === 0 ||
                  !sameWarehouse(selectedItems)
                "
                style="
                  position: absolute;
                  bottom: 0;
                  right: 0;
                  margin: 10px;
                  margin-bottom: 20px;
                  margin-right: 20px;
                "
              >
                Hacer entrada
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6" style="margin-top: 20px">
          <div class="card" style="height: 452px !important">
            <div class="card-body">
              <h4 class="card-title text-primary text-center">
                Últimos movimientos realizados en el inventario
              </h4>
              <div
                class="table-container"
                id="lastTransactions"
                style="max-height: 450px !important"
              >
                <table class="table table-bordered kpi-table">
                  <thead>
                    <tr>
                      <th>Fecha de movimiento</th>
                      <th>Descripción del movimiento</th>
                      <th>Bodega</th>
                      <th>Responsable</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="movement in sortedMovements" :key="movement.id">
                      <td>{{ movement.date }}</td>
                      <td>{{ movement.description }}</td>
                      <td>{{ movement.warehouse }}</td>
                      <td>{{ movement.responsible }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6" style="margin-top: 20px">
          <div class="card" style="height: 452px !important">
            <div class="card-body">
              <h4 class="card-title text-danger">
                Comparativa de Stock y Nivel Deseado por Artículo
              </h4>
              <div class="chart-container">
                <canvas ref="chartLow"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import axios from "axios";
import { API_URL } from "@/config";
import { mapState, mapMutations } from "vuex";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { useStore } from "vuex";
import { shallowRef } from "vue";
import moment from "moment";

export default {
  data() {
    return {
      sortedMovements: [],
      low_stock_items: [],
      items: [],
      low_stock_items_cloned: [],
      items_cloned: [],
      movementsData: [],
      selectedWarehouse: "", // Valor seleccionado en el dropdown de bodega
      selectedType: "", // Valor seleccionado en el dropdown de tipo de artículo
      selectedItems: [], //Articulos seleccionados en la tabla de stock minimo
      bodegas: [], // Valores posibles para el dropdown de bodega
      types: [], // Valores posibles para el dropdown de tipo de artículo
      chartTop10: null,
      chartLow: null,
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
  },
  mounted() {
    const store = useStore();
    this.$state.navbarTitle = "Inicio";
    const user = store.state.user;
    if (!store.state.LogAttempts) {
      toast.success(
        `Hola ${user.name}, bienvenido al sistema de inventory del Mercado de las Telas`,
        {
          position: "top-right",
          timeout: 2500,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
        }
      );
      store.commit("setLogAttempt", true);
    }

    // Obtener todas las categorías desde la API
    axios
      .get(API_URL + "/categories")
      .then((response) => {
        this.types = response.data.map((category) => category.name);
      })
      .catch((error) => {
        console.error(error);
      });

    // Obtener todas las bodegas desde la API
    axios
      .get(`${API_URL}/warehouses`)
      .then((response) => {
        this.bodegas = response.data.map((warehouse) => warehouse.name);
      })
      .catch((error) => {
        console.error(error);
      });

    // Obtener el registro de movimientos más removidos
    axios
      .get(API_URL + "/movement_logs")
      .then((response) => {
        this.movementsData = response.data.movements_log.map((movement) => {
          return {
            item_id: movement.id,
            description: movement.description,
            date: moment(movement.created_at).format("DD/MM/YYYY"), // Cambia el formato de la fecha utilizando moment.js
            warehouse: movement.origin_warehouse.name,
            responsible: movement.user.name,
          };
        });
        this.sortedMovements = this.sortMovements();
      })
      .catch((error) => {
        console.error(error);
      });
    // Obtener los artículos más removidos o con más salidas de inventory desde la API
    axios
      .get(API_URL + "/most_removed_items")
      .then((response) => {
        this.items = response.data.map((item) => {
          return {
            item_id: item.id,
            name: item.name,
            removals: item.quantity_removed,
            category: item.category_name,
            storing_format_units_name: item.storing_format_units_name,
            transferring_format_units_name: item.transferring_format_units_name,
            general_code: item.general_code,
          };
        });
        this.items_cloned = this.items;

        this.createChartTop10();
        this.filterItems();
      })
      .catch((error) => {
        console.error(error);
      });

    // Obtener los artículos con la cantidad de stock por debajo del mínimo desde la API
    axios
      .get(API_URL + "/low_stock_items")
      .then((response) => {
        this.low_stock_items = response.data.map((item) => {
          return {
            item_id: item.item_id,
            name: item.name,
            storing_format_units: item.storing_format_units,
            storing_format_units_name: item.storing_format_units_name,
            warehouse: item.warehouse.name,
            warehouseComplete: item.warehouse,
            minimal_stock: item.minimal_stock,
            category: item.category,
            general_code: item.general_code,
          };
        });
        this.low_stock_items_cloned = this.low_stock_items;

        this.createChartLow();
        this.filterItems();
      })
      .catch((error) => {
        console.error(error);
      });
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    sortMovements() {
      return [...this.movementsData].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    },
    createChartTop10() {
      const canvas = this.$refs.chartCanvas;
      const ctx = canvas.getContext("2d");

      let sortedItems = [...this.items].sort(
        (a, b) => b.removals - a.removals
      );
      let itemTypes = sortedItems.map((item) => item.name);
      let inventory = sortedItems.map((item) => item.removals);

      this.chartTop10 = shallowRef(
          new Chart(ctx, {
            type: "bar",
            data: {
              labels: itemTypes,
              datasets: [
                {
                  label: "Salidas de inventory (" + this.items[0].transferring_format_units_name + ")",
                  data: inventory,
                  backgroundColor: "rgba(37, 168, 150, 0.5)",
                  borderColor: "rgba(54, 162, 235, 1)",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              indexAxis: "y", // Rotate the chart by 90 degrees
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                  },
                  title: {
                    display: true,
                    text: "Unidades removidas",
                  },
                },
                y: {
                  grid: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: "Artículos",
                  },
                },
              },
            },
          })
      );
    },
    createChartLow() {
      const canvas = this.$refs.chartLow;
      const ctx = canvas.getContext("2d");

      const sortedProductosLow = [...this.low_stock_items].sort(
        (a, b) => a.storing_format_units - b.storing_format_units
      );
      const itemTypes = sortedProductosLow.map((item) => item.name);
      const inventory = sortedProductosLow.map(
        (item) => item.storing_format_units
      );
      const nivelDeseado = sortedProductosLow.map(
        (item) => item.minimal_stock
      );

      this.chartLow = shallowRef(
          new Chart(ctx, {
            type: "bar",
            data: {
              labels: itemTypes,
              datasets: [
                {
                  label: "Nivel actual de stock",
                  data: inventory,
                  backgroundColor: "rgba(250, 10, 10, 0.5)",
                  borderColor: "rgba(70, 70, 70, 1)",
                  borderWidth: 1,
                },
                {
                  label: "Nivel deseado de stock",
                  data: nivelDeseado,
                  backgroundColor: "rgba(10, 10, 255, 0.5)",
                  borderColor: "rgba(70, 70, 70, 1)",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: "Artículos",
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                  },
                  title: {
                    display: true,
                    text: "Cantidad de stock",
                  },
                },
              },
            },
          })
      );
    },
    filterItems() {
      this.items = this.items_cloned;
      this.low_stock_items = this.low_stock_items_cloned;
      let productosFiltrados = [...this.items];
      let productosLowFiltrados = [...this.low_stock_items];

      if (this.selectedType) {
        productosFiltrados = productosFiltrados.filter(
          (item) => item.category === this.selectedType
        );
      }

      if (this.selectedWarehouse) {
        productosLowFiltrados = productosLowFiltrados.filter(
          (item) => item.warehouse === this.selectedWarehouse
        );
      }

      if (this.selectedType) {
        productosLowFiltrados = productosLowFiltrados.filter(
          (item) => item.category === this.selectedType
        );
      }

      if (this.searchQuery !== "") {
        productosFiltrados = productosFiltrados.filter((item) =>
          item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      this.items = productosFiltrados;
      this.low_stock_items = productosLowFiltrados;

      this.updateChartLow();
      this.updateChartTop10();
    },
    sameWarehouse(items) {
      if (items.length === 0) {
        return false; // Si no hay items seleccionados, no están en la misma bodega
      }

      const firstWarehouse = items[0].warehouse; // Suponiendo que la bodega está almacenada en la propiedad "bodega" del item

      for (let i = 1; i < items.length; i++) {
        if (items[i].warehouse !== firstWarehouse) {
          return false; // Si encuentra un item con una bodega diferente, no están en la misma bodega
        }
      }
      return true; // Si no se encontraron items con bodegas diferentes, están en la misma bodega
    },
    createEntryTransaction() {
      const selectedItemsToAdd = this.selectedItems.map(item => ({ item_id: item.general_code, name: item.name }));
      this.$store.commit("setSelectedItems", selectedItemsToAdd);
      this.$store.commit("setWarehouse", this.selectedItems[0].warehouseComplete);
      // Enrutar con la bodega de hacer entrada
      const warehouse = this.selectedItems[0].warehouse;
      this.$router.push({
        name: "Entry-from-home",
        params: {
          warehouse: warehouse,
        },
      });
    },
    updateChartTop10() {
      if (this.chartTop10) {
        const sortedItems = [...this.items].sort(
          (a, b) => b.removals - a.removals
        );
        const itemTypes = sortedItems.map((item) => item.name);
        const inventory = sortedItems.map((item) => item.removals);

        this.chartTop10.data.labels = itemTypes;
        this.chartTop10.data.datasets[0].data = inventory;
        this.chartTop10.update();
      }
    },

    updateChartLow() {
      if (this.chartLow) {
        const sortedProductosLow = [...this.low_stock_items].sort(
          (a, b) => a.storing_format_units - b.storing_format_units
        );
        const itemTypes = sortedProductosLow.map((item) => item.name);
        const inventory = sortedProductosLow.map(
          (item) => item.storing_format_units
        );
        const nivelDeseado = sortedProductosLow.map(
          (item) => item.minimal_stock
        );

        this.chartLow.data.labels = itemTypes;
        this.chartLow.data.datasets[0].data = inventory;
        this.chartLow.data.datasets[1].data = nivelDeseado;
        this.chartLow.update();
      }
    },
  },
};
</script>

<style scoped>
#check:checked ~ .container-fluid {
  padding-left: 345px;
  max-width: 1600px;
}

#lastTransactions {
  height: 390px !important;
}

.container-fluid {
  padding-top: 20px;
  padding-bottom: 20px;
  max-width: 90%;
  height: fit-content;
}

.table-container {
  height: 700px;
  overflow: auto;
}

#underStockTable {
  height: 330px !important;
}

.button-container {
  display: flex;
  gap: 10px;
}

.chart-container {
  width: 100%;
  height: 290px;
}

.kpi-table {
  width: 100%;
  border-collapse: collapse;
}

.kpi-table th,
.kpi-table td {
  padding: 8px;
  border: 1px solid #ccc;
}

.kpi-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.kpi-table td button {
  padding: 6px 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

.kpi-table td button:hover {
  background-color: #45a049;
}

.kpi-table td button:focus {
  outline: none;
}

.filter-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.filter-row label {
  margin-right: 10px;
}

.filter-row select {
  padding: 5px;
}

.kpi-table td button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.table thead {
  position: sticky;
  top: 0;
}

.table thead::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: -1px;
  z-index: 0;
  border: 2px solid #000;
}

@media (max-width: 991px) {
  #check:checked ~ .container-fluid {
    padding-left: 100px;
  }

  #lastTransactions {
    height: 330px !important;
  }

  #underStockTable {
    height: 300px !important;
  }

  .button-container {
    display: block;
  }

  .col-lg-6 {
    margin-bottom: 20px;
  }

  .chart-container {
    height: 250px;
  }

  .kpi-table th,
  .kpi-table td {
    font-size: 12px;
  }
}
</style>
