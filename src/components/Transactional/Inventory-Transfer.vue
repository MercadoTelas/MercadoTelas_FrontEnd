<template>
  <div>
    <input
        type="checkbox"
        id="check"
        v-model="checked"
        @change="handleCheckboxChange"
    />

    <div class="container">
      <div>
        <div v-if="modalVisible">
          <div class="modal-background"></div>
          <div class="modal-content container-md" style="z-index: 1;">
            <h2>Búsqueda de artículos</h2>
            <div class="search-container">
              <label for="searchInput">Buscar por Nombre o Código:</label>
              <input
                  type="text"
                  id="searchInput"
                  v-model="searchQuery"
                  @keydown.enter="searchItem"
                  class="form-control"
              />
              <button @click="searchItem" class="btn btn-success">Buscar</button>
            </div>
            <div class="table-container">
              <table class="table">
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
                    :class="{'table-row-selected': item.isSelected}"
                >
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td style="width: 10px">
                    <input
                        type="checkbox"
                        :id="item.id"
                        :value="item"
                        v-model="selectedItems"
                        class="form-check-input"
                        @change="handleItemCheckboxChange(item)"
                    />
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <button @click="closeModal" class="btn btn-danger">Cerrar</button>
            <button @click="addSelectedItems" class="btn btn-success">Agregar</button>
          </div>
        </div>
      </div>
      <div class="document-header">
        <div class="header-row">
          <h1 class="text-center mb-5">Transferencias</h1>
          <div class="ms-0">
            <p>Fecha: {{ getCurrentDate() }}</p>
            <p>Hora: {{ getCurrentTime() }}</p>
            <p>Usuario: {{ user.name }}</p>
            <div class="row">
              <div class="col-2">
                <label for="senderWarehouse">Bodega de origen:</label>
              </div>
              <div class="col-10">
                <select id="senderWarehouse" class="form-select ms-2" v-model="senderWarehouse">
                  <option value="" disabled selected>Seleccionar</option>
                  <option v-for="warehouse in filteredSenderWarehouses" :value="warehouse" :key="warehouse.id">
                    {{ warehouse.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="row mt-1">
              <div class="col-2">
                <label for="receiverWarehouse">Bodega de destino:</label>
              </div>
              <div class="col-10">
                <select id="receiverWarehouse" class="form-select ms-2" v-model="receiverWarehouse">
                  <option value="" disabled selected>Seleccionar</option>
                  <option v-for="warehouse in filteredReceiverWarehouses" :value="warehouse" :key="warehouse.id">
                    {{ warehouse.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h4>Lista de Artículos</h4>
      <div class="table-container">
        <table class="table  table-hover">
          <thead>
          <tr>
            <th class="text-center">Código del artículo</th>
            <th class="text-center">Nombre del artículo</th>
            <th class="text-center">Cantidad en unidades de inventario a transferir</th>
            <th>Unidades</th>
            <th class="text-center">Cantidad en unidades de venta a transferir</th>
            <th>Unidades</th>
            <th class="text-center">Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in tableData" :key="index" :class="{ 'table-row-selected': item.selected }">
            <td>
              <input
                  :id="'ID' + index"
                  type="text"
                  v-model="item.item_id"
                  @keydown.tab="onCellInput(item, 'item_id', $event, index)"
                  class="form-control"
              />
            </td>
            <td>
              <input
                  type="text"
                  v-model="item.name"
                  class="form-control"
                  readonly
              />
            </td>
            <td>
              <div class="align-items-center">
                <input
                    type="number"
                    :id="'SU' + index"
                    v-model="item.storing_format_units"
                    @input="onCellInput(item, 'storing_format_units', $event)"
                    class="form-control"
                />
              </div>
            </td>
            <td>
              <div class="align-items-center">
                {{ item.storing_unit_format_name }}
              </div>
            </td>
            <td>
              <div class="align-items-center">
                <input
                    type="number"
                    v-model="item.transferring_format_units"
                    @input="onCellInput(item, 'transferring_format_units', $event)"
                    class="form-control"
                />
              </div>
            </td>
            <td>
              <div class="align-items-center">
                {{ item.transferring_unit_format_name }}
              </div>
            </td>
            <td>
              <button
                  class="btn btn-danger"
                  @click="removeItem(index)"
              >
                Eliminar
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="observations-section mt-4">
        <h4>Observaciones</h4>
        <textarea class="form-control" v-model="notes"></textarea>
      </div>

      <div class="form-footer text-center">
        <button class="btn btn-success" type="submit" @click="saveTransaction">
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import { API_URL } from "@/config";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  data() {
    return {
      tableData: [
        {
          item_id: "",
          name: "",
          storing_format_units: "",
          storing_unit_format_name: "",
          transferring_format_units: "",
          transferring_unit_format_name: "",
        },
      ],
      filteredItems: [],
      selectedItems: [],
      warehouses: [],
      modalVisible: false,
      senderWarehouse: "",
      receiverWarehouse: "",
      notes: "",
      inventory_items: []
    };
  },
  computed: {
    ...mapState(["checkboxValue", "user"]),
    checked: {
      get() {
        return this.checkboxValue;
      },
    },
    filteredSenderWarehouses() {
      return this.filterWarehouses('sender');
    },
    filteredReceiverWarehouses() {
      return this.filterWarehouses('receiver');
    },
  },
  mounted() {
    this.$state.navbarTitle = "Transferencia de inventario";
    document.addEventListener("keydown", this.handleKeyDown);
    axios
        .get(`${API_URL}/warehouses/`)
        .then((response) => {
          this.warehouses = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    filterWarehouses(selectType) {
      if (selectType === 'sender') {
        return this.warehouses.filter((warehouse) => warehouse !== this.receiverWarehouse);
      } else if (selectType === 'receiver') {
        return this.warehouses.filter((warehouse) => warehouse !== this.senderWarehouse);
      }
      return this.warehouses;
    },
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    handleItemCheckboxChange(item) {
      item.isSelected = !item.isSelected;
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
        const itemId = item.item_id == null ? item.id : item.item_id.trim();
        if (itemId !== "") {
          let url = `${API_URL}/search_inventory_item?`;
          if (itemId !== "") {
            url += `item_id=${itemId}`;
          }
          axios
              .get(url)
              .then((response) => {
                const data = response.data;

                // Actualizar los valores de la fila con los datos obtenidos de la API
                item.item_id = data.item_id || "";
                item.name = data.name || "";
                item.storing_unit_format_name =
                    data.storing_unit_format_name || "";
                item.conversion_factor = data.conversion_factor || "";
                item.transferring_unit_format_name =
                    data.transferring_unit_format_name || "";

                // Realizar el cálculo de la cantidad de venta
                this.calculateSaleUnits(item);

                // Insertar el elemento en la tabla
                this.tableData.splice(1, 0, item);

                // Limpiar los campos de la primera fila
                this.tableData.splice(0, 1, {
                  item_id: "",
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
      return item.transferring_format_units !== "" || item.storing_format_units !== "";
    },
    removeItem(index) {
      if (index !== 0) {
        // Verificar si no es el primer elemento
        this.tableData.splice(index, 1);
      }
    },
    searchItem() {
      const query = this.searchQuery === undefined ? "" : this.searchQuery.trim();
      if (query !== "") {
        const url = `${API_URL}/search_items/?data=${query}`;
        axios
            .get(url)
            .then((response) => {
              console.log(response);
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
      if (
          event.key === "Tab" &&
          field === "item_id"
      ) {
        // Verificar si se está editando la última fila
        if (
            item === this.tableData[0] &&
            field === "item_id"
        ) {
          // Verificar si el campo del código está lleno en la última fila
          if (item.item_id.trim() !== "") {
            // Agregar una nueva fila vacía
            this.addItem(index, item);
          }
        }
      } else if (
          field === "storing_format_units" ||
          field === "conversion_factor"
      ) {
        // Realizar el cálculo de la cantidad de venta al cambiar la cantidad de almacenamiento o el factor de conversión
        this.calculateSaleUnits(item);
      } else if (event.key === "Enter" && this.receiverWarehouse === "") {
        toast.info(`Debe seleccionar un almacén de destino`, {
          position: "top-right",
          timeout: 2000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
        });
      } else if (event.key === "Enter") {
        // Realizar transacción
        this.saveTransaction();
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
            item.item_id.trim() !== "" &&
            item.name.trim() !== "" &&
            item.storing_format_units !== "" &&
            item.transferring_format_units !== ""
        );
      });

      if (this.selectedWarehouse === "") {
        toast.info(`Debe seleccionar un almacén`, {
          position: "top-right",
          timeout: 2000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
        });
      } else {
        // Verificar las filas que tienen todos los campos llenos
        this.inventory_items.forEach(
            (item) => {
              if (!this.checkUnits(item)) {
                toast.info(`Debe ingresar las unidades de almacenamiento a todos los artículos agregados`, {
                  position: "top-right",
                  timeout: 2000,
                  closeOnClick: true,
                  pauseOnFocusLoss: true,
                  pauseOnHover: true,
                });
                return "";
              }
            }
        )

        // Verificar si hay filas válidas
        if (this.inventory_items.length > 0) {
          const url = `${API_URL}/inventories/transfer_items`;
          const currentDate = this.getCurrentDate();
          const currentTime = this.getCurrentTime();
          const userId = this.user.id;
          const notes = this.notes;
          const sourceWarehouseId = this.senderWarehouse.id;
          const destinationWarehouseId = this.receiverWarehouse.id;

          const inventoryItems = this.inventory_items.map((item) => ({
            item_id: item.item_id,
            name: item.name,
            storing_format_units: item.storing_format_units,
            storing_unit_format_name: item.storing_unit_format_name,
            transferring_format_units: item.transferring_format_units,
            transferring_unit_format_name: item.transferring_unit_format_name,
          }));

          const data = {
            inventory_items: inventoryItems,
            currentDate,
            currentTime,
            userId,
            notes,
            sourceWarehouse_Id: sourceWarehouseId,
            destinationWarehouse_Id: destinationWarehouseId,
          };

          axios
              .post(url, data)
              .then((response) => {
                // Lógica de respuesta exitosa
                console.log(response);
                toast.success(`Transacción guardada`, {
                  position: "top-right",
                  timeout: 2000,
                  closeOnClick: true,
                  pauseOnFocusLoss: true,
                  pauseOnHover: true,
                });

                this.tableData = [
                  {
                    item_id: "",
                    name: "",
                    storing_format_units: "",
                    storing_unit_format_name: "",
                    transferring_format_units: "",
                    transferring_unit_format_name: "",
                  },
                ];
                this.tableData = [];
                this.addItem();
                this.notes = "";
                this.receiverWarehouse = "";
                this.senderWarehouse = "";
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
    getCurrentDate() {
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, "0");
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const year = String(currentDate.getFullYear()).slice(-2);
      return `${day}-${month}-${year}`;
    },
    getCurrentTime() {
      const currentDate = new Date();
      return currentDate.toLocaleTimeString("en-US", { timeStyle: "medium" });
    },
    handleKeyDown(event) {
      if (event.shiftKey && event.key === "Tab") {
        this.showModal();
      }
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
  max-width: 1200px;
  margin: 0 auto;
}

.document-header {
  margin-bottom: 20px;
}

.table-container {
  overflow-x: auto;
  max-width: 100%;
  max-height: 300px;
  overflow-y: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
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
</style>
