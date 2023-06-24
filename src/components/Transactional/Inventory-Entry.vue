<template>
  <div class="form-container">
    <form class="form container" @submit.prevent="saveTransaction">
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
                <div class="label-text">Cantidad a ingresar</div>
              </div>
            </label>
            <input v-model="amount" type="number" class="form-control" id="entryAmount"
                   placeholder="Digite la cantidad a ingresar...">
          </div>
          <div class="form-group">
            <label for="bodegaFuente" class="form-label">Seleccione la bodega de destino</label>
            <select v-model="recieverWarehouse" class="form-select" id="bodegaFuente" :disabled="isSelectDisabled">
              <option value="" selected disabled>Seleccione la bodega</option>
              <option  v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse">{{ warehouse.name }}</option>
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

      <table class="table table-responsive">
        <thead>
        <tr>
          <th>Código</th>
          <th>Nombre artículo</th>
          <th>Cantidad en unidades de almacenamiento</th>
          <th>Factor de Conversión</th>
          <th>Cantidad en unidades de venta</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in tableData" :key="index">
          <td>{{ item.item_id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.storing_format_units }} {{ item.storing_unit_format_name }}</td>
          <td>
            <input v-model="item.conversion_factor" type="number" class="form-control"> {{ item.transferring_unit_format_name }} por {{ item.storing_unit_format_name }}
          </td>
          <td>{{ item.transferring_format_units }} {{ item.transferring_unit_format_name }}</td>
          <td>
            <button @click.prevent="removeItem(index)" class="btn btn-danger">Eliminar</button>
          </td>
        </tr>
        </tbody>
      </table>

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
  name: "EntradaInventario",
  data() {
    return {
      itemID: '',
      amount: 0,
      inventory_item: [],
      warehouses: [],
      recieverWarehouse: '',
      tableData: [],
      inventory: {
        id: '',
        inventory_items: [],
        warehouse_id: '',
      }
    };
  },
  computed: {
    isSelectDisabled() {
      return this.tableData.length > 0;
    }
  },
  mounted() {
    this.$state.navbarTitle = 'Entradas de inventario';
    // Obtener las bodegas
    axios.get(`${API_URL}/warehouses`)
      .then(response => {
        this.warehouses = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  watch: {
    tableData: {
      deep: true,
      handler(newTableData) {
        // Recalcular los valores de transferring_format_units para cada elemento en tableData
        newTableData.forEach(item => {
          item.transferring_format_units = item.storing_format_units * item.conversion_factor;
        });
      }
    }
  },
  methods: {
    cancel() {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Se eliminarán todos los artículos agregados. Esta acción no se puede deshacer.",
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
    },
    saveTransaction() {
      if (this.tableData.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debe agregar al menos un artículo',
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
          transferring_unit_format_name: item.transferring_unit_format_name
        };
        this.inventory.inventory_items.push(inventoryItem);
        this.inventory.warehouse_id = this.recieverWarehouse.id;
      }
      console.log(this.inventory);
      axios.post(`${API_URL}/inventories/insert_items`, this.inventory)
          .then(response => {
            Swal.fire({
              icon: 'success',
              title: 'Transacción realizada',
              text: 'La transacción se ha realizado con éxito',
            });
            console.log(response);
            this.tableData = [];
          })
          .catch(error => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo realizar la transacción',
            });
            console.log(error);
          });
    },
    insertItem() {
      if (this.itemID === '') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debe ingresar el código del artículo',
        });
        return;
      }
      if (this.amount <= 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debe ingresar una cantidad válida',
        });
        return;
      }
      if (this.recieverWarehouse === '') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debe seleccionar una bodega',
        });
        return;
      }
      // Realiza la llamada a la API para obtener los datos del artículo
      axios.get(`${API_URL}/inventory_items/${this.itemID}`)
          .then(response => {
            // Procesa la respuesta de la API
            this.inventory_item = response.data;
            // Calcula la cantidad de unidades de almacenamiento
            this.inventory_item.storing_format_units = this.amount;
            // Calcula la cantidad de unidades de venta
            this.inventory_item.transferring_format_units = this.amount * this.inventory_item.conversion_factor;
            // Agrega el nuevo artículo a la tabla
            this.tableData.push(this.inventory_item);
          })
          .catch(error => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se encontró el artículo',
            });
            console.log(error);
          });
    },
    removeItem(index) {
      // Elimina el artículo de la tabla según el índice proporcionado
      this.tableData.splice(index, 1);
    },
  },
};
</script>

<style lang="scss">
.table-responsive {
  overflow-x: auto;
}

.form-container {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-title {
  color: #15386E;
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  max-width: 600px;

  .form-column {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    flex: 1;

    .form-group {
      margin-bottom: 10px;

      .form-label {
        color: #15386E;
        font-size: 20px;
      }

      .form-control {
        border-radius: 10px;
        font-size: 17px;
      }

      .form-select {
        font-size: 17px;
      }
    }
  }

  .resumen {
    margin-top: 10px;
    color: #E26D5A;
    font-size: 17px;
    text-align: center;

    p {
      font-size: 20px;
    }
  }

  .form-group.text-center {
    margin-top: 10px;
    text-align: center;

    .submit {
      background-color: #3066BE;
      color: white;
      height: 40px;
      width: 200px;
      text-align: center;
      border-radius: 10px;
      border: #3066BE;
    }
  }
}
</style>
