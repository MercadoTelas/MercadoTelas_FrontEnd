<template>
  <input
    type="checkbox"
    id="check"
    v-model="checked"
    @change="handleCheckboxChange"
  />
  <div class="container">
    <div class="row">
      <div class="mt-3 mb-4">
        <h3>Salidas</h3>
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Código</th>
                <th>Usuario</th>
                <th>Artículos ingresados</th>
                <th>Bodega</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="transaction in filteredTransactions('S')"
                :key="transaction.id"
              >
                <td>{{ transaction.identifier }}</td>
                <td>{{ transaction.user.name }}</td>
                <td>{{ transaction.items_moved }}</td>
                <td>{{ transaction.to_warehouse.name }}</td>
                <td>{{ transaction.created_at }}</td>
                <td>
                  <a
                    :href="transaction.pdf_url"
                    target="_blank"
                    class="btn btn-success"
                    >Descargar PDF</a
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-3 mb-4">
        <h3>Entradas</h3>
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Código</th>
                <th>Usuario</th>
                <th>Artículos removidos</th>
                <th>Bodega</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="transaction in filteredTransactions('E')"
                :key="transaction.id"
              >
                <td>{{ transaction.identifier }}</td>
                <td>{{ transaction.user.name }}</td>
                <td>{{ transaction.items_moved }}</td>
                <td>{{ transaction.to_warehouse.name }}</td>
                <td>{{ transaction.created_at }}</td>
                <td>
                  <a
                    :href="transaction.pdf_url"
                    target="_blank"
                    class="btn btn-success"
                    >Descargar PDF</a
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-3 mb-4">
        <h3>Transferencias</h3>
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Código</th>
                <th>Usuario</th>
                <th>Artículos Tranferidos</th>
                <th>Bodega emisora</th>
                <th>Bodega receptora</th>
                <th>Fecha de Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="transaction in filteredTransactions('T')"
                :key="transaction.id"
              >
                <td>{{ transaction.identifier }}</td>
                <td>{{ transaction.user.name }}</td>
                <td>{{ transaction.items_moved }}</td>
                <td>{{ transaction.from_warehouse.name }}</td>
                <td>{{ transaction.to_warehouse.name }}</td>
                <td>{{ transaction.created_at }}</td>
                <td>
                  <a
                    :href="transaction.pdf_url"
                    target="_blank"
                    class="btn btn-success"
                    >Descargar PDF</a
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import { API_URL } from "@/config";
//import { toast } from 'vue3-toastify';
//import 'vue3-toastify/dist/index.css';


export default {
  name: "TransactionList",
  data() {
    return {
      transactions: [],
      searchIdentifier: "",
      searchDate: "",
    };
  },
  computed: {
    ...mapState(["checkboxValue"]),
    checked: {
      get() {
        return this.checkboxValue;
      },
    },
    filteredTransactions() {
      return (type) => {
        return this.transactions.filter((transaction) => {
          return (
            transaction.identifier.includes(this.searchIdentifier) &&
            (this.searchDate
              ? transaction.created_at.includes(this.searchDate)
              : true) &&
            transaction.type === type
          );
        });
      };
    },
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    fetchTransactions() {
      axios
        .get(`${API_URL}/transactions`)
        .then((response) => {
          this.transactions = response.data.transactions.map((transaction) => {
            return {
              ...transaction,
              pdf_url: `${API_URL}/transactions/${transaction.id}`, // URL del PDF para cada transacción
            };
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.fetchTransactions();
    this.$state.navbarTitle = "Registro de movimientos";
  },
};
</script>

<style>
#check:checked ~ .container {
  padding-left: 345px;
  max-width: 1500px;
}

.container {
  padding-top: 20px;
  padding-bottom: 20px;
}

.table th,
.table td {
  padding: 8px;
  vertical-align: middle;
}

.table th {
  background-color: #f2f2f2;
}

.table-responsive {
  overflow-x: auto;
}
</style>
