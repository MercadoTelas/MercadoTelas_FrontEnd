<template>
  <input
    type="checkbox"
    id="check"
    v-model="checked"
    @change="handleCheckboxChange"
  />
  <div class="container">
    <div class="row">
      <div class="row border rounded-3 p-3 mb-lg-5">
        <h4 class="filter-title">Filtros</h4>
        <div
          class="filters-container"
          style="display: flex; align-items: center; justify-content: center"
        >
          <div class="col-md-2" style="margin: 10px">
            <label for="code">Código</label>
            <input
              type="text"
              class="form-control"
              id="code"
              v-model="searchIdentifier"
            />
          </div>
          <div class="col-md-2" style="margin: 10px">
            <label for="articleCode">Código del artículo</label>
            <input
              type="text"
              class="form-control"
              id="articleCode"
              v-model="searchArticleCode"
            />
          </div>
          <div class="col-md-2" style="margin: 10px">
            <label for="articleCode">Nombre del artículo</label>
            <input
                type="text"
                class="form-control"
                id="articleCode"
                v-model="searchArticleName"
            />
          </div>
          <div class="col-md-2" style="margin: 10px">
            <label for="fromDate">Fecha (desde)</label>
            <input
              type="date"
              class="form-control"
              id="fromDate"
              v-model="searchFromDate"
            />
          </div>
          <div class="col-md-2" style="margin: 10px">
            <label for="toDate">Fecha (hasta)</label>
            <input
              type="date"
              class="form-control"
              id="toDate"
              v-model="searchToDate"
            />
          </div>
        </div>
      </div>
      <div class="mt-3 mb-4">
        <h3>Salidas</h3>
        <div class="table-container">
          <table class="table table-striped table-hover">
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
                v-for="transaction in filteredTransactions('S')"
                :key="transaction.id"
              >
                <td>{{ transaction.identifier }}</td>
                <td>{{ transaction.user.name }}</td>
                <td>{{ transaction.items_moved }}</td>
                <td>{{ transaction.to_warehouse.name }}</td>
                <td>{{ formatDate(transaction.created_at) }}</td>
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
        <div class="table-container">
          <table class="table table-hover table-striped">
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
                v-for="transaction in filteredTransactions('E')"
                :key="transaction.id"
              >
                <td>{{ transaction.identifier }}</td>
                <td>{{ transaction.user.name }}</td>
                <td>{{ transaction.items_moved }}</td>
                <td>{{ transaction.to_warehouse.name }}</td>
                <td>{{ formatDate(transaction.created_at) }}</td>
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
        <div class="table-container">
          <table class="table">
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
                <td>{{ formatDate(transaction.created_at) }}</td>
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

export default {
  name: "TransactionList",
  data() {
    return {
      transactions: [],
      searchIdentifier: "",
      searchArticleCode: "",
      searchArticleName: "",
      searchFromDate: "",
      searchToDate: "",
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
          const isMatchedIdentifier = transaction.identifier.includes(
            this.searchIdentifier
          );

          const isMatchedArticleCode = transaction.movements.some(
            (movement) =>
              movement.item.id.includes(this.searchArticleCode) ||
              movement.item.name.includes(this.searchArticleName)
          );

          const isMatchedDate =
            (!this.searchFromDate ||
              transaction.created_at >= this.searchFromDate) &&
            (!this.searchToDate || transaction.created_at <= this.searchToDate);

          return (
            isMatchedIdentifier &&
            isMatchedArticleCode &&
            isMatchedDate &&
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
              pdf_url: `${API_URL}/transactions/${transaction.id}`,
            };
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    },
  },
  mounted() {
    this.fetchTransactions();
    this.$state.navbarTitle = "Registro de movimientos";
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
}

.table th,
.table td {
  padding: 8px;
  vertical-align: middle;
}

.table th {
  background-color: #f2f2f2;
}

.table-container {
  overflow-x: auto;
  max-width: 100%;
  max-height: 300px;
  overflow-y: auto;
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
}
</style>
