<template>
  <div>
    <div class="form-title col-sm-12 mx-auto"></div>
    <form class="form container col-sm-8"  @submit.prevent="saveTransaction">
      <div class="row">
        <div class="col-md-7">
          <div class="form-group">
            <label for="itemID" class="form-label">
              <div class="blue-box">
                <div class="label-text">Código del artículo</div>
              </div>
            </label>
            <input v-model="itemID" type="text" class="form-control" id="itemID"
                   placeholder="Ingrese el código del artículo...">
          </div>
          <div class="form-group">
            <label for="entryAmount" class="form-label">
              <div class="blue-box">
                <div class="label-text">Cantidad a transferir</div>
              </div>
            </label>
            <input v-model="amount" type="number" class="form-control" id="entryAmount"
                   placeholder="Digite la cantidad a retirar...">
          </div>

          <div class="form-group">
            <label for="bodegaFuente" class="form-label">Seleccione la bodega de origen</label>
            <select v-model="sourceWarehouse" class="form-select" id="bodegaFuente" :disabled="isSelectDisabled">
              <option value="" selected disabled>Seleccione la bodega de origen</option>
              <option v-for="warehouse in filteredSourceWarehouses" :key="warehouse.id" :value="warehouse">
                {{ warehouse.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="bodegaDestino" class="form-label">Seleccione la bodega de destino</label>
            <select v-model="destinyWarehouse" class="form-select" id="bodegaDestino" :disabled="isSelectDisabled">
              <option value="" selected disabled>Seleccione la bodega de destino</option>
              <option v-for="warehouse in filteredDestinyWarehouses" :key="warehouse.id" :value="warehouse">
                {{ warehouse.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-sm-5">
          <div class="row">
            <div class="col-sm-12 text-center">
              <div class="form-group">
                <button class="btn btn-primary" @click.prevent="insertItem">Agregar artículo</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- Tabla -->
    <table class="table mt-4">
      <thead>
      <tr>
        <th>Código</th>
        <th>Nombre artículo</th>
        <th>Cantidad en unidades de venta transferidas</th>
        <th>Factor de Conversión</th>
        <th>Cantidad en unidades de almacenamiento transferidas</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in tableData" :key="index">
        <td>{{ item.item_id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.transferring_format_units }} {{ item.transferring_unit_format_name }}</td>
        <td>
          <input v-model="item.conversion_factor" type="number" class="form-control"> {{ item.transferring_unit_format_name }} por {{ item.storing_unit_format_name }}
        </td>
        <td>{{ item.storing_format_units }} {{ item.storing_unit_format_name }}</td>
        <td>
          <button @click.prevent="removeItem(index)" class="btn btn-danger">Eliminar</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Botones de transacción y cancelación -->
    <div class="row">
      <div class="col-sm-12 text-center">
        <div class="form-group">
          <button type="submit" class="btn btn-primary">Realizar transacción</button>
          <button @click.prevent="cancel" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import {API_URL} from "@/config";
import Swal from "sweetalert2";

export default {
  name: "InventoryTransfer",
  data() {
    return {
      itemID: "",
      amount: 0,
      warehouses: [],
      sourceWarehouse: "",
      destinyWarehouse: "",
      tableData: [],
      inventory: {
        id: "",
        inventory_items: [],
        sourceWarehouse_id: "",
        destinyWarehouse_id: "",
      },
    };
  },
  computed: {
    isSelectDisabled() {
      return this.tableData.length > 0;
    },
    filteredSourceWarehouses() {
      return this.filterWarehouses(this.warehouses, this.destinyWarehouse);
    },
    filteredDestinyWarehouses() {
      return this.filterWarehouses(this.warehouses, this.sourceWarehouse);
    },
  },
  mounted() {
    this.$state.navbarTitle = "Transferencias de inventario";
    // Obtener las bodegas
    axios
        .get(`${API_URL}/warehouses`)
        .then((response) => {
          this.warehouses = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
  },
  watch: {
    tableData: {
      deep: true,
      handler(newTableData) {
        // Recalcular los valores de transferring_format_units para cada elemento en tableData
        newTableData.forEach((item) => {
          item.storing_format_units =
              item.transferring_format_units / item.conversion_factor;
        });
      },
    },
  },
  methods: {
    filterWarehouses(warehouses, selectedWarehouse) {
      return warehouses.filter((warehouse) => {
        return (
            !selectedWarehouse ||
            (selectedWarehouse && warehouse.id !== selectedWarehouse.id)
        );
      });
    },
    cancel() {
      Swal.fire({
        title: "¿Estás seguro?",
        text:
            "Se eliminarán todos los artículos agregados. Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No, volver",
      }).then((result) => {
        if (result.isConfirmed) {
          // Reinicia los datos de la tabla o realiza alguna acción adicional
          this.tableData = [];
          Swal.fire("Cancelado", "La transacción ha sido cancelada.", "success");
        }
      });
      this.inventory = {
        id: "",
        inventory_items: [],
        warehouse_id: "",
      };
    },
    saveTransaction() {
      if (this.tableData.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Debe agregar al menos un artículo",
        });
        return;
      }
      for (let item of this.tableData) {
        const inventoryItem = {
          id: item.id,
          item_id: item.item_id,
          storing_format_units: item.storing_format_units,
          transferring_format_units: item.transferring_format_units,
          inventory_id: item.inventory_id,
          created_at: item.created_at,
          updated_at: item.updated_at,
          name: item.name,
          brand: item.brand,
          design: item.design,
          subcategory: item.subcategory,
          category: item.category,
          conversion_factor: item.conversion_factor,
          storing_unit_format_name: item.storing_unit_format_name,
          transferring_unit_format_name: item.transferring_unit_format_name,
        };
        this.inventory.inventory_items.push(inventoryItem);
        this.inventory.sourceWarehouse_id = this.sourceWarehouse.id;
        this.inventory.destinyWarehouse_id = this.destinyWarehouse.id;
      }
      console.log(this.inventory);
      axios.post(`${API_URL}/inventories/transfer_items`, this.inventory)
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: "Transacción realizada",
              text: "La transacción se ha realizado con éxito",
            });
            console.log(response);
            this.tableData = [];
          })
          .catch((error) => {
            if (error.response && error.response.status === 422) {
              Swal.fire({
                icon: "warning",
                title: "Algunos artículos no pudieron ser actualizados",
                text: "Verifica los artículos y vuelve a intentarlo",
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo realizar la transacción",
              });
            }
            console.log(error);
          });
      this.inventory.inventory_items = [];
    },
    insertItem() {
      if (this.itemID === "") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Debe ingresar el código del artículo",
        });
        return;
      }
      if (this.amount <= 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Debe ingresar una cantidad válida",
        });
        return;
      }
      if (this.sourceWarehouse === "") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Debe seleccionar una bodega de origen",
        });
        return;
      }
      if (this.destinyWarehouse === "") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Debe seleccionar una bodega de destino",
        });
        return;
      }
      // Realiza la llamada a la API para obtener los datos del artículo
      axios
          .get(`${API_URL}/inventory_items/${this.itemID}`)
          .then((response) => {
            // Procesa la respuesta de la API
            this.inventory_item = response.data;
            // Calcula la cantidad de unidades de almacenamiento
            this.inventory_item.storing_format_units = this.amount / this.inventory_item.conversion_factor;
            // Calcula la cantidad de unidades de venta
            this.inventory_item.transferring_format_units = this.amount;
            // Agrega el nuevo artículo a la tabla
            this.tableData.push(this.inventory_item);
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se encontró el artículo",
            });
            console.log(error);
          });
    },
    removeItem(index) {
      // Elimina el artículo de la tabla según el índice proporcionado
      this.tableData.splice(index, 1);
      this.inventory.inventory_items.splice(index, 1);
    },
  },
};
</script>

<style>
.form-title {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}

.container {
  margin-top: 50px;
  margin-bottom: 50px;
}

.table {
  margin-top: 30px;
}

.btn-primary {
  margin-right: 10px;
}

.btn-danger {
  margin-left: 10px;
}
</style>
