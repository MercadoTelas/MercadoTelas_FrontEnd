<template>
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />

  <div class="container">
    <div>
      <div v-if="modalVisible">
        <div class="modal-background"></div>
        <div class="modal-content container-md">
          <h2>Búsqueda de artículos</h2>
          <div class="search-container">
            <label for="searchInput">Buscar por Nombre o Código:</label>
            <input type="text" id="searchInput" v-model="searchQuery" @keydown.enter="searchItem" class="input-field" />
            <button @click="searchItem" class="btn btn-success">Buscar</button>
          </div>
          <div class="table-container">
            <table class="table table-responsive-lg text-center">
              <thead>
                <tr>
                  <th class="text-center">Código del artículo</th>
                  <th class="text-center">Nombre del artículo</th>
                  <th class="text-center"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredItems" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td style="width: 10px">
                    <button @click="addItemToTable" class="btn btn-success">
                      <i class="bi bi-plus-circle"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button @click="closeModal">Cerrar</button>
        </div>
      </div>
    </div>
    <div class="document-header">
      <div class="header-row">
        <h1>Lista de Artículos</h1>
        <div class="form-group ms-0">
          <label for="warehouseSelect">Bodega:</label>
          <select id="warehouseSelect" class="form-select ms-2" v-model="selectedWarehouse">
            <option value="" disabled selected>Seleccionar</option>
            <option v-for="warehouse in warehouses" :value="warehouse" :key="warehouse.id">
              {{ warehouse.name }}
            </option>
          </select>
        </div>
      </div>
      <p>Fecha: {{ getCurrentDate() }}</p>
    </div>
    <div class="table-container">
      <table class="table table-responsive-lg text-center">
        <thead>
          <tr>
            <th class="text-center">Código del artículo</th>
            <th class="text-center">Nombre del artículo</th>
            <th class="text-center">
              Cantidad en unidades de inventario a agregar
            </th>
            <th class="text-center">Cantidad en unidades de venta a agregar</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            id="transactionList"
            v-for="(item, index) in tableData"
            :key="index"
          >
            <td>
              <input
                :id="'ID' + index"
                type="text"
                v-model="item.item_id"
                @keydown.enter="onCellInput(item, 'item_id', $event, index)"
                class="input"
              />
            </td>
            <td>
              <input
                :id="'ID' + index"
                type="text"
                v-model="item.name"
                @keydown.enter="onCellInput(item, 'name', $event, index)"
                class="input"
              />
            </td>
            <td>
              <div class="row align-items-center">
                <div class="col-8">
                  <input
                    type="number"
                    v-model="item.storing_format_units"
                    @input="
                      onCellInput(item, 'storing_format_units', $event, index)
                    "
                    class="input"
                  />
                </div>
                <div class="col-4">
                  {{ item.storing_unit_format_name }}
                </div>
              </div>
            </td>
            <td>
              <div class="row align-items-center">
                <div class="col-8">
                  <input
                    type="number"
                    v-model="item.transferring_format_units"
                    @input="
                      onCellInput(item, 'sale_units', $event, 'ID' + index)
                    "
                    class="input"
                  />
                </div>
                <div class="col-4">
                  {{ item.transferring_unit_format_name }}
                </div>
              </div>
            </td>
            <td>
              <button
                class="btn btn-danger"
                @click="removeItem(index), enableField('ID' + index)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="observations-section mt-4">
      <h3>Observaciones</h3>
      <textarea class="form-control" v-model="notes"></textarea>
    </div>

    <div class="form-footer text-center">
      <button class="btn btn-success" type="submit" @click="saveTransaction">
        Guardar transacción
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import { API_URL } from "@/config";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  data() {
    return {
      tableData: [
        {
          id: "",
          item_id: "",
          name: "",
          storing_format_units: "",
          conversion_factor: "",
          transferring_format_units: "",
          warehouse: "",
        },
      ],
      filteredItems: [],
      inventory_items: [],
      warehouses: [],
      modalVisible: false,
      selectedWarehouse: "",
      notes: "",
    };
  },
  mounted() {
    this.$state.navbarTitle = "Entradas de inventario";
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
    updateWarehouse(item, warehouseName) {
      item.warehouse = warehouseName;
    },
    showModal() {
      this.modalVisible = true;
    },
    closeModal() {
      this.modalVisible = false;
    },
    addItem() {
      const newItem = {
        item_id: "",
        name: "",
        storing_format_units: "",
        conversion_factor: "",
        sale_units: "",
      };
      this.tableData.push(newItem);
    },
    removeItem(index) {
      if (index != this.tableData.length - 1) {
        if (this.tableData.length > 1) {
          this.tableData.splice(index, 1);
        }
      }
    },
    searchItem() {
      const query =
        this.searchQuery === undefined ? "" : this.searchQuery.trim();
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

      // Verificar si se está editando la última fila
      if (item === this.tableData[this.tableData.length - 1]) {
        // Verificar si el campo del código está lleno en la última fila
        if (item.item_id.trim() !== "") {
          // Agregar una nueva fila vacía
          this.addItem();
        }
      }

      // Verificar si se presionó la tecla Enter en las celdas de código o nombre
      if (
        event.key === "Enter" &&
        (field === "item_id" || field === "name") &&
        this.selectedWarehouse !== ""
      ) {
        const itemId = item.item_id.trim();
        const itemName = item.name.trim();

        if (itemId !== "" || itemName !== "") {
          let url = `${API_URL}/search_inventory_item?`;
          if (itemId !== "" && itemName === "") {
            url += `item_id=${itemId}&warehouse_id=${this.selectedWarehouse.id}`;
          } else if (itemId === "" && itemName !== "") {
            url += `name=${itemName}&warehouse_id=${this.selectedWarehouse.id}`;
          }
          axios
            .get(url)
            .then((response) => {
              const data = response.data;

              // Actualizar los valores de la fila con los datos obtenidos de la API
              item.id = data.id || "";
              item.item_id = data.item_id || "";
              item.name = data.name || "";
              item.storing_unit_format_name =
                data.storing_unit_format_name || "";
              item.conversion_factor = data.conversion_factor || "";
              item.transferring_unit_format_name =
                data.transferring_unit_format_name || "";

              // Realizar el cálculo de la cantidad de venta
              this.calculateSaleUnits(item);
              this.disableFields("ID" + index);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      } else if (
        field === "storing_format_units" ||
        field === "conversion_factor"
      ) {
        // Realizar el cálculo de la cantidad de venta al cambiar la cantidad de almacenamiento o el factor de conversión
        this.calculateSaleUnits(item);
      } else if (event.key === "Enter" && this.selectedWarehouse === "") {
        toast.info(`Debe seleccionar un almacén`, {
          position: 'top-right',
          timeout: 2000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
        });
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
    disableFields(id) {
      var elements = document.querySelectorAll("#" + id);
      elements.forEach(function (element) {
        element.disabled = true;
      });
    },
    enableField(id) {
      var elements = document.querySelectorAll("#" + id);
      elements.forEach(function (element) {
        element.disabled = false;
      });
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

      // Verificar si hay filas válidas
      if (this.inventory_items.length > 0 && this.selectedWarehouse === "") {
        const url = `${API_URL}/inventories/insert_items`;
        console.log(this.$store.state.user.id);
        const data = {
          inventory_items: this.inventory_items,
          currentDate: this.getCurrentDate(),
          warehouse_id: this.selectedWarehouse.id,
          user: this.$store.state.user.id,
          notes: this.notes,
        };

        axios
          .post(url, data)
          .then((response) => {
            // Lógica de respuesta exitosa
            console.log(response);
            toast.success(`Transacción guardada`, {
              position: 'top-right',
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
            toast.error (`Error al guardar la transacción: ` + error.message, {
              position: 'top-right',
              timeout: 2000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
            });

          });
      } else {
        toast.info(`Debe llenar todos los campos en al menos una fila antes de guardar la transacción`, {
          position: 'top-right',
          timeout: 2000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
        });

      }
      this.inventory_items = [];
    },
    getCurrentDate() {
      const currentDate = new Date();
      return currentDate.toLocaleDateString();
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
#check:checked~.container {
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

.input {
  width: 100%;
  padding: 8px;
  border: none;
  outline: none;
  background-color: transparent;
}

.form-footer {
  margin-top: 16px;
}

.form-group {
  display: flex;
  align-items: center;
  padding: 8px 0;
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
  background-color: white;
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
}</style>
