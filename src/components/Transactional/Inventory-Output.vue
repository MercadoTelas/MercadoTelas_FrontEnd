<template>
  <input
      id="check"
      v-model="checked"
      type="checkbox"
      @change="handleCheckboxChange"
  />

  <div class="container">
    <div>
      <div v-if="modalVisible">
        <div class="modal-background"></div>
        <div class="modal-content container-md" style="z-index: 1">
          <h2>Búsqueda de artículos</h2>
          <div class="search-container">
            <label for="searchInput">Buscar por Nombre o Código:</label>
            <input
                id="searchInput"
                v-model="searchQuery"
                class="form-control"
                type="text"
                @keydown.enter="searchItem"
            />
            <button class="btn btn-success" @click="searchItem">Buscar</button>
          </div>
          <div class="table-container" style="max-height: 500px !important">
            <table class="table table-bordered">
              <thead>
              <tr>
                <th class="text-center">Código del artículo</th>
                <th class="text-center">Nombre del artículo</th>
                <th class="text-center"></th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="item in filteredItems"
                  :key="item.id"
                  :class="{ 'table-row-selected': item.isSelected }"
              >
                <td class="text-center">
                  {{ item.general_code }}
                </td>
                <td class="text-center">{{ item.name }}</td>
                <td class="text-center" style="width: 10px">
                  <input
                      :id="item.id"
                      v-model="selectedItems"
                      :value="item"
                      class="form-check-input"
                      type="checkbox"
                      @change="handleItemCheckboxChange(item)"
                  />
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="d-flex justify-content-center btn-group">
          <button class="btn btn-danger" @click="closeModal">Cerrar</button>
          <button class="btn btn-success" @click="addSelectedItems">
            Agregar
          </button>
            </div>
        </div>
      </div>
    </div>
    <div class="document-header">
      <div class="header-row">
        <h1 class="text-center mb-5">Salida</h1>
        <div class="ms-0">
          <p>Fecha: {{ getCurrentDate() }}</p>
          <p>Hora: {{ getCurrentTime() }}</p>
          <p>Usuario: {{ this.$store.state.user.name }}</p>
          <div
              class="row mb-lg-5"
              style="justify-content: center; align-items: center; display: flex"
          >
            <div class="col-2">
              <label :hidden="selectDisabled" for="warehouseSelect"
              >Bodega:</label
              >
            </div>
            <div :hidden="selectDisabled" class="col-10">
              <select
                  id="warehouseSelect"
                  v-model="selectedWarehouse"
                  class="form-select ms-2"
              >
                <option disabled value="">Seleccionar</option>
                <option
                    v-for="warehouse in warehouses"
                    :key="warehouse.id"
                    :value="warehouse"
                >
                  {{ warehouse.name }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label :hidden="!selectDisabled">Bodega seleccionada: {{ selectedWarehouse.name }}</label>
          </div>
        </div>
      </div>
    </div>
    <h4 style="margin-top: 30px">Lista de Artículos</h4>
    <button
        id="searchArticleButton"
        class="btn btn-success"
        @click="openSearchMenu()"
    >
      Buscar
    </button>
    <div class="table-container" style="max-height: 500px !important">
      <table class="table table-bordered">
        <thead>
        <tr>
          <th class="text-center"></th>
          <th class="text-center">Código del artículo</th>
          <th class="text-center">Nombre del artículo</th>
          <th class="text-center">
            Cantidad en unidades de inventario a remover
          </th>
          <th class="text-center">Unidades</th>
          <th class="text-center">
            Cantidad en unidades de venta a remover
          </th>
          <th class="text-center">Unidades</th>
          <th class="text-center">Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(item, index) in tableData"
            :key="index"
            :class="{ 'table-row-selected': item.selected }"
        >
          <td>
            {{ index + 1 }}
          </td>
          <td>
            <input
                :id="'ID' + index"
                v-model="item.general_code"
                class="form-control"
                type="text"
                @keydown.tab="onCellInput(item, 'general_code', $event, index)"
            />
          </td>
          <td>
            <input
                :id="'NA' + index"
                v-model="item.name"
                class="form-control"
                type="text"
                @keydown.tab="onCellInput(item, 'name', $event, index)"
            />
          </td>
          <td>
            <div class="text-center">
              <input
                  :id="'SU' + index"
                  v-model="item.storing_format_units"
                  class="form-control"
                  type="number"
                  @input="onCellInput(item, 'storing_format_units', $event)"
              />
            </div>
          </td>
          <td>
            <div class="text-center">
              {{ item.storing_unit_format_name }}
            </div>
          </td>
          <td>
            <div class="text-center">
              <input
                  v-model="item.transferring_format_units"
                  class="form-control"
                  type="number"
                  @input="onCellInput(item, 'transferring_format_units', $event)"
              />
            </div>
          </td>
          <td>
            <div class="text-center">
              {{ item.transferring_unit_format_name }}
            </div>
          </td>
          <td class="text-center">
            <button class="btn btn-danger" @click="removeItem(index)">
              Eliminar
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="observations-section mt-4">
      <h4>Observaciones</h4>
      <textarea v-model="notes" class="form-control"></textarea>
    </div>

    <div class="form-footer text-center">
      <button class="btn btn-success" type="submit" @click="saveTransaction">
        Guardar
      </button>
      <router-link
          class="btn btn-danger btn-save"
          to="#"
          type="button"
          @click="goToPreviousPage()"
      >
        Volver
      </router-link>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import axios from "axios";
import {API_URL} from "@/config";
import {toast} from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  data() {
    return {
      tableData: [],
      filteredItems: [],
      inventory_items: [],
      warehouses: [],
      modalVisible: false,
      selectedWarehouse: "",
      selectedItems: [],
      notes: "",
    };
  },
  mounted() {
    this.$state.navbarTitle = "Salidas de inventario";
    document.addEventListener("keydown", this.handleKeyDown);
    axios
        .get(`${API_URL}/warehouses/`)
        .then((response) => {
          this.warehouses = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    this.addItem();
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  },
  watch: {
    // Observar los cambios en la selección de almacén para actualizar los datos de stock
    selectedWarehouse: {
      handler(newWarehouse) {
        if (newWarehouse) {
          this.updateStockValuesForWarehouse();
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState(["checkboxValue"]),
    checked: {
      get() {
        return this.checkboxValue;
      },
    },
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    handleItemCheckboxChange(item) {
      item.isSelected = !item.isSelected;
    },
    updateWarehouse(item, warehouseName) {
      item.warehouse = warehouseName;
    },
    showModal() {
      this.modalVisible = true;
    },
    closeModal() {
      this.modalVisible = false;
    },
    addSelectedItems() {
      this.selectedItems.forEach((item) => {
        this.addItem(0, item);
      });
      this.selectedItems = [];
      this.closeModal();
    },
    addItem(index, item) {
      if (item) {
        const itemId = item.general_code == null ? item.id : item.general_code.trim();
        const name = item.name == null ? item.name : item.name.trim();
        if (itemId !== "") {
          let url = `${API_URL}/find_inventory_item?`;
          if (itemId !== "") {
            url += `general_code=${itemId}&name=${name}&warehouse_id=${this.selectedWarehouse.id}`;
          }
          axios
              .get(url)
              .then((response) => {
                const data = response.data;

                // Actualizar los valores de la fila con los datos obtenidos de la API
                item.item_id = data.item_id || "";
                item.general_code = data.general_code || "";
                item.name = data.name || "";
                item.storing_unit_format_name =
                    data.storing_unit_format_name || "";
                item.conversion_factor = data.conversion_factor || "";
                item.transferring_unit_format_name =
                    data.transferring_unit_format_name || "";
                item.storing_format_units = "";
                item.transferring_format_units = "";
                item.id = data.id || "";
                item.current_stock_storing_units = data.storing_format_units;
                item.current_stock_transferring_units = data.transferring_format_units;

                // Realizar el cálculo de la cantidad de venta
                this.calculateSaleUnits(item);

                // Insertar el elemento en la tabla
                this.tableData.splice(1, 0, item);

                // Limpiar los campos de la primera fila
                this.tableData.splice(0, 1, {
                  item_id: "",
                  general_code: "",
                  name: "",
                  storing_format_units: "",
                  storing_unit_format_name: "",
                  transferring_format_units: "",
                  transferring_unit_format_name: "",
                });

                // Focus en el campo de la cantidad de unidades de almacenamiento del elemento agregado
                this.$nextTick(() => {
                  const input = document.getElementById(`SU${index + 1}`);
                  if (input) {
                    input.focus();
                  }
                });
              })
              .catch((error) => {
                const errorMessage = error.response.data.error;
                if (error.response.status !== 500 && errorMessage) {
                  toast.error(errorMessage, {
                    position: "top-right",
                    timeout: 2000,
                    closeOnClick: true,
                    pauseOnFocusLoss: true,
                    pauseOnHover: true,
                  });
                } else {
                  console.error(error);
                }
              });
        }
      } else {
        this.tableData.unshift({
          item_id: "",
          general_code: "",
          name: "",
          storing_format_units: "",
          storing_unit_format_name: "",
          transferring_format_units: "",
          transferring_unit_format_name: "",
        });
      }
      if (this.modalVisible) {
        this.closeModal();
      }
    },
    checkUnits(item) {
      return (
          item.transferring_format_units !== "" ||
          item.storing_format_units !== ""
      );
    },
    removeItem(index) {
      if (index !== 0) {
        // Verificar si no es el primer elemento
        this.tableData.splice(index, 1);
      }
    },
    searchItem() {
      const query =
          this.searchQuery === undefined ? "" : this.searchQuery.trim();
      if (query !== "") {
        const url = `${API_URL}/search_inventory_items/?data=${query}&warehouse=${this.selectedWarehouse.id}`;
        axios
            .get(url)
            .then((response) => {
              this.filteredItems = response.data;
            })
            .catch((error) => {
              console.error(error);
            });
      }
    },
    onCellInput(item, field, event, index) {
      event.stopPropagation();
      event.preventDefault();
      // Actualizar el valor del campo en el objeto item
      item[field] = event.target.value;

      // Verificar si se presionó la tecla Tab en las celda de código
      if (event.key === "Tab" && (field === "general_code" || field === "name")) {
        // Verificar si se está editando la última fila
        if (item === this.tableData[0] && (field === "general_code" || field === "name")) {
          // Verificar si el campo del código está lleno en la última fila
          if (item.general_code.trim() !== "" && item.name.trim() !== "") {
            // Agregar una nueva fila vacía
            this.addItem(index, item);
          } else {
            toast.info(`Debe llenarse el campo del código y del nombre del artículo`, {
              position: "top-right",
              timeout: 2000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
            });
          }
        }
      } else if (
          field === "storing_format_units" ||
          field === "conversion_factor"
      ) {
        // Realizar el cálculo de la cantidad de venta al cambiar la cantidad de almacenamiento o el factor de conversión
        this.calculateSaleUnits(item);
      } else if (event.key === "Enter" && this.selectedWarehouse === "") {
        toast.info(`Debe seleccionar un almacén`, {
          position: "top-right",
          timeout: 2000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
        });
      } else if (event.key === "Enter") {
        // Realizar transacción
        this.saveTransaction();
      } else if (event.key === "Escape") {
        // Cerrar modal
        this.closeModal();
      }
    },
    calculateSaleUnits(item) {
      const storingUnits = parseFloat(item.storing_format_units);
      const conversionFactor = parseFloat(item.conversion_factor);
      if (!isNaN(storingUnits) && !isNaN(conversionFactor)) {
        const saleUnits = storingUnits * conversionFactor;
        item.transferring_format_units = saleUnits.toFixed(2);
      }
    },
    saveTransaction() {
      // Filtrar las filas que tienen todos los campos llenos
      this.inventory_items = this.tableData.filter((item) => {
        return (
            item.general_code.trim() !== "" &&
            item.name.trim() !== "" &&
            item.storing_format_units !== "" &&
            item.transferring_format_units !== ""
        );
      });

      // Verificar si hay almacén seleccionado
      if (this.selectedWarehouse === "") {
        toast.info(`Debe seleccionar un almacén`, {
          position: "top-right",
          timeout: 2000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
        });
      } else {
        // Verificar si hay filas válidas
        if (this.inventory_items.length > 0) {
          const articleQuantities = {};

          for (const item of this.inventory_items) {
            // Verificar si no se ingresaron las unidades de almacenamiento y venta
            if (!this.checkUnits(item)) {
              toast.info(
                  `Debe ingresar las unidades de almacenamiento y venta para todos los artículos agregados`,
                  {
                    position: "top-right",
                    timeout: 2000,
                    closeOnClick: true,
                    pauseOnFocusLoss: true,
                    pauseOnHover: true,
                  }
              );
              return;
            }

            // Obtener las cantidades a remover como números
            const requestedStoringUnits = parseFloat(item.storing_format_units);
            const requestedTransferringUnits = parseFloat(item.transferring_format_units);

            // Verificar si la cantidad de unidades de almacenamiento a remover supera el stock actual
            const currentStoringUnits = item.current_stock_storing_units;
            if (requestedStoringUnits > currentStoringUnits) {
              toast.info(
                  `La cantidad de unidades de almacenamiento a remover para el artículo "${item.name}" con código "${item.general_code}" supera el stock actual`,
                  {
                    position: "top-right",
                    timeout: 2000,
                    closeOnClick: true,
                    pauseOnFocusLoss: true,
                    pauseOnHover: true,
                  }
              );
              return;
            }

            // Verificar si la cantidad de unidades de venta a remover supera el stock actual
            const currentTransferringUnits = item.current_stock_transferring_units;
            if (requestedTransferringUnits > currentTransferringUnits) {
              toast.info(
                  `La cantidad de unidades de venta a remover para el artículo "${item.name}" con código "${item.general_code}" supera el stock actual`,
                  {
                    position: "top-right",
                    timeout: 2000,
                    closeOnClick: true,
                    pauseOnFocusLoss: true,
                    pauseOnHover: true,
                  }
              );
              return;
            }

            // Actualizar las cantidades del artículo en el objeto articleQuantities
            const itemId = item.item_id;
            if (articleQuantities[itemId]) {
              articleQuantities[itemId].storing += requestedStoringUnits;
              articleQuantities[itemId].transferring += requestedTransferringUnits;
            } else {
              articleQuantities[itemId] = {
                storing: requestedStoringUnits,
                transferring: requestedTransferringUnits,
              };
            }

            // Verificar si las cantidades a remover superan el stock total del artículo
            if (
                articleQuantities[itemId].storing > currentStoringUnits ||
                articleQuantities[itemId].transferring > currentTransferringUnits
            ) {
              toast.info(
                  `La cantidad total de unidades a remover para el artículo "${item.name}" con código "${item.general_code}" supera el stock actual`,
                  {
                    position: "top-right",
                    timeout: 2000,
                    closeOnClick: true,
                    pauseOnFocusLoss: true,
                    pauseOnHover: true,
                  }
              );
              return;
            }
          }

          // Si todas las validaciones pasan, procedemos a guardar la transacción
          const url = `${API_URL}/inventories/remove_items`;
          const data = {
            inventory_items: this.inventory_items,
            currentDate: this.getCurrentDate(),
            warehouse_id: this.selectedWarehouse ? this.selectedWarehouse.id : null,
            user: this.$store.state.user.id,
            notes: this.notes,
          };

          axios
              .post(url, data)
              .then(() => {
                // Lógica de respuesta exitosa
                toast.success(`Transacción guardada`, {
                  position: "top-right",
                  timeout: 2000,
                  closeOnClick: true,
                  pauseOnFocusLoss: true,
                  pauseOnHover: true,
                });

                this.tableData = [];
                this.addItem();
                this.notes = "";
                this.selectedWarehouse = "";
              })
              .catch((error) => {
                toast.error(`Error al guardar la transacción: ` + error.message, {
                  position: "top-right",
                  timeout: 2000,
                  closeOnClick: true,
                  pauseOnFocusLoss: true,
                  pauseOnHover: true,
                });
              });
        } else {
          toast.info(
              `Debe llenar todos los campos en al menos una fila antes de guardar la transacción`,
              {
                position: "top-right",
                timeout: 2000,
                closeOnClick: true,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
              }
          );
        }
      }
      this.inventory_items = [];
    },
    updateStockValuesForWarehouse() {
      if (!this.selectedWarehouse || this.tableData.length === 0) return;

      // Obtener los IDs de los artículos en la tabla
      const itemIds = this.tableData.map((item) => item.item_id);

      // Obtener los datos de stock actualizados para los artículos en la bodega seleccionada
      const url = `${API_URL}/inventories/get_stock_by_warehouse/${this.selectedWarehouse.id}`;
      axios
          .get(url, { itemIds })
          .then((response) => {
            const stockData = response.data;
            // Actualizar los datos de stock en la tabla con la información recibida de la API
            this.tableData.forEach((item) => {
              const stockInfo = stockData.find((stockItem) => stockItem.item_id === item.id);
              if (stockInfo) {
                item.current_stock_storing_units = stockInfo.storing_format_units;
                item.current_stock_transferring_units = stockInfo.transferring_format_units;
              }
            });
          })
          .catch((error) => {
            console.error("Error al obtener los datos de stock: ", error);
          });
    },
    getCurrentDate() {
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, "0");
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const year = String(currentDate.getFullYear()).slice(-2);
      return `${day}-${month}-${year}`;
    },
    getCurrentTime() {
      const currentDate = new Date();
      return currentDate.toLocaleTimeString("en-US", {timeStyle: "medium"});
    },
    handleKeyDown(event) {
      if (event.shiftKey && event.key === "Tab" && this.selectedWarehouse !== "") {
        this.showModal();
      } else if (event.key === "Escape") {
        this.closeModal();
      } else if (event.key === "Enter" && this.selectedWarehouse !== "" && !this.modalVisible) {
        this.saveTransaction();
      } else if (event.shiftKey && event.key === "Tab" && this.selectedWarehouse === "") {
        toast.info(`Debe seleccionar un almacén`, {
          position: "top-right",
          timeout: 2000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
        });
      }
    },
    openSearchMenu() {
      if (this.selectedWarehouse === "") {
        console.log("Debe seleccionar un almacén");
      } else {
        this.showModal();
      }
    },
    goToPreviousPage() {
      this.$router.go(-1);
    },
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

.form-footer {
  margin-top: 16px;
}

/* Estilos del componente modal */
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ddd;
  padding: 20px;
  border-radius: 4px;
}

.search-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.search-container label {
  margin-right: 10px;
}

.search-container input {
  margin-right: 10px;
}

.table-row-selected {
  background-color: #aed2de !important;
}

.form-check-input {
  transform: scale(1.6);
}

#searchArticleButton {
  display: none;
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

  #searchArticleButton {
    display: block;
  }
}
</style>
