<template>
  <div>
    <input
      type="checkbox"
      id="check"
      v-model="checked"
      @change="handleCheckboxChange"
    />
    <div class="container-fluid">
      <div class="button-container" style="align-items: center; justify-content: center; margin-bottom: 20px;">
        <div class="filter-row">
          <label for="bodega">Bodega:</label>
          <select
            id="bodega"
            v-model="selectedBodega"
            @change="filterProductos"
          >
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
          <select id="tipo" v-model="selectedTipo" @change="filterProductos">
            <option value="">Todos los tipos</option>
            <option v-for="category in tipos" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6">
          <div class="card" style="height: 450px !important">
            <div class="card-body">
              <h4 class="card-title text-success">
                Top 10 artículos con más envíos a tienda
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
              <div class="table-container">
                <table class="table table-bordered kpi-table">
                  <thead>
                    <tr>
                      <th>Código de producto</th>
                      <th>Nombre</th>
                      <th>Cantidad de stock</th>
                      <th>Bodega</th>
                      <th>Marcar para hacer entrada</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(producto, index) in productosLow" :key="index">
                      <td>{{ producto.item_id }}</td>
                      <td>{{ producto.name }}</td>
                      <td>{{ producto.storing_format_units }}</td>
                      <td>{{ producto.warehouse }}</td>
                      <td>
                        <input
                          type="checkbox"
                          :value="producto"
                          v-model="selectedProductos"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button
                @click="hacerEntrada"
                class="btn btn-success"
                :disabled="
                  selectedProductos.length === 0 ||
                  !mismaBodega(selectedProductos)
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
                style="max-height: 450px !important;"
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
      productosLow: [],
      productos: [],
      productosLowClone: [],
      productosClone: [],
      movementsData: [],
      selectedBodega: "", // Valor seleccionado en el dropdown de bodega
      selectedTipo: "", // Valor seleccionado en el dropdown de tipo de artículo
      selectedProductos: [], //Articulos seleccionados en la tabla de stock minimo
      bodegas: [], // Valores posibles para el dropdown de bodega
      tipos: [], // Valores posibles para el dropdown de tipo de artículo
      chartTop10: null,
      chartLow: null,
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
        `Hola ${user.name}, bienvenido al sistema de inventario del Mercado de las Telas`,
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
        this.tipos = response.data.map((category) => category.name);
      })
      .catch((error) => {
        console.log(error);
      });

    // Obtener todas las bodegas desde la API
    axios
      .get(`${API_URL}/warehouses`)
      .then((response) => {
        this.bodegas = response.data.map((warehouse) => warehouse.name);
      })
      .catch((error) => {
        console.log(error);
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
        console.log(error);
      });
    // Obtener los artículos más removidos o con más salidas de inventario desde la API
    axios
      .get(API_URL + "/most_removed_items")
      .then((response) => {
        console.log(response.data);
        this.productos = response.data.map((item) => {
          return {
            item_id: item.id,
            name: item.name,
            removals: item.quantity_removed,
            category: item.category_name,
          };
        });
        this.productosClone = this.productos;

        this.createChartTop10();
        this.filterProductos();
      })
      .catch((error) => {
        console.log(error);
      });

    // Obtener los artículos con la cantidad de stock por debajo del mínimo desde la API
    axios
      .get(API_URL + "/low_stock_items")
      .then((response) => {
        this.productosLow = response.data.map((item) => {
          return {
            item_id: item.item_id,
            name: item.name,
            storing_format_units: item.storing_format_units,
            warehouse: item.warehouse.name,
            warehouseComplete: item.warehouse,
            minimal_stock: item.minimal_stock,
            category: item.category,
          };
        });
        this.productosLowClone = this.productosLow;

        this.createChartLow();
        this.filterProductos();
      })
      .catch((error) => {
        console.log(error);
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

      let sortedProductos = [...this.productos].sort(
        (a, b) => b.removals - a.removals
      );
      let tiposTelas = sortedProductos.map((producto) => producto.name);
      let inventario = sortedProductos.map((producto) => producto.removals);

      this.chartTop10 = shallowRef(
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: tiposTelas,
            datasets: [
              {
                label: "Salidas de inventario",
                data: inventario,
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
              },
              y: {
                grid: {
                  display: false,
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

      const sortedProductosLow = [...this.productosLow].sort(
        (a, b) => a.storing_format_units - b.storing_format_units
      );
      const tiposTelas = sortedProductosLow.map((producto) => producto.name);
      const inventario = sortedProductosLow.map(
        (producto) => producto.storing_format_units
      );
      const nivelDeseado = sortedProductosLow.map(
        (producto) => producto.minimal_stock
      );

      this.chartLow = shallowRef(
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: tiposTelas,
            datasets: [
              {
                label: "Nivel actual de stock",
                data: inventario,
                backgroundColor: "rgba(250, 10, 10, 0.5)",
                borderColor: "rgba(70, 70, 70, 1)",
                borderWidth: 1,
              },
              {
                label: "Nivel deseado",
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
              },
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                },
              },
            },
          },
        })
      );
    },
    filterProductos() {
      this.productos = this.productosClone;
      this.productosLow = this.productosLowClone;
      let productosFiltrados = [...this.productos];
      let productosLowFiltrados = [...this.productosLow];

      if (this.selectedTipo) {
        productosFiltrados = productosFiltrados.filter(
          (producto) => producto.category === this.selectedTipo
        );
      }

      if (this.selectedBodega) {
        productosLowFiltrados = productosLowFiltrados.filter(
          (producto) => producto.warehouse === this.selectedBodega
        );
      }

      if (this.selectedTipo) {
        productosLowFiltrados = productosLowFiltrados.filter(
          (producto) => producto.category === this.selectedTipo
        );
      }

      this.productos = productosFiltrados;
      this.productosLow = productosLowFiltrados;

      this.updateChartLow();
      this.updateChartTop10();
    },
    mismaBodega(productos) {
      if (productos.length === 0) {
        return false; // Si no hay productos seleccionados, no están en la misma bodega
      }

      const primeraBodega = productos[0].warehouse; // Suponiendo que la bodega está almacenada en la propiedad "bodega" del producto

      for (let i = 1; i < productos.length; i++) {
        if (productos[i].warehouse !== primeraBodega) {
          return false; // Si encuentra un producto con una bodega diferente, no están en la misma bodega
        }
      }
      return true; // Si no se encontraron productos con bodegas diferentes, están en la misma bodega
    },
    hacerEntrada() {
      const selectedItems = this.selectedProductos.map(
        (producto) => producto.item_id
      );
      this.$store.commit("setSelectedItems", selectedItems);
      this.$store.commit(
        "setWarehouse",
        this.selectedProductos[0].warehouseComplete
      );

      console.log(selectedItems);

      //Enrrutar con la bodega de hacer entrada
      const warehouse = this.selectedProductos[0].warehouse;
      this.$router.push({
        name: "Entry-from-home",
        params: {
          warehouse: warehouse,
        },
      });
    },
    updateChartTop10() {
      if (this.chartTop10) {
        const sortedProductos = [...this.productos].sort(
          (a, b) => b.removals - a.removals
        );
        const tiposTelas = sortedProductos.map((producto) => producto.name);
        const inventario = sortedProductos.map((producto) => producto.removals);

        this.chartTop10.data.labels = tiposTelas;
        this.chartTop10.data.datasets[0].data = inventario;
        this.chartTop10.update();
      }
    },

    updateChartLow() {
      if (this.chartLow) {
        const sortedProductosLow = [...this.productosLow].sort(
          (a, b) => a.storing_format_units - b.storing_format_units
        );
        const tiposTelas = sortedProductosLow.map((producto) => producto.name);
        const inventario = sortedProductosLow.map(
          (producto) => producto.storing_format_units
        );
        const nivelDeseado = sortedProductosLow.map(
          (producto) => producto.minimal_stock
        );

        this.chartLow.data.labels = tiposTelas;
        this.chartLow.data.datasets[0].data = inventario;
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

.button-container {
  display: flex;
  gap: 10px;
}

.centered-div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
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

.filter-container {
  margin-bottom: 20px;
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
  top: 0px;
  left: 0px;
  right: 0px;
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
