<template>
    <div>
      <div class="form-title col-sm-12 mx-auto"></div>
      <form class="form container col-sm-8">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="codigoArticulo" class="form-label">Código del artículo</label>
              <input v-model="articleId" type="text" class="form-control" id="codigoArticulo" placeholder="Ingrese el código del artículo...">
            </div>
  
            <div class="form-group">
              <label for="cantidadTransferir" class="form-label">Cantidad a retirar</label>
              <input v-model="amount" type="number" class="form-control" id="cantidadTransferir">
            </div>
  
            <div class="form-group">
              <label for="bodegaFuente" class="form-label">Seleccione la bodega fuente</label>
              <select v-model="sourceWarehouse" class="form-select" id="bodegaFuente">
                <option class="option" v-for="b in bodegas" :key="b.id">{{ b }}</option>
              </select>
            </div>
          </div>
  
          <div class="col-sm-6">
            <div class="row">
              <div class="col-sm-12 text-center">
                <div class="form-group">
                  <button @click.prevent="transferArticle" id="transfer" type="submit" class="btn btn-primary">Retirar artículo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
  
      <!-- Tabla -->
      <table class="table mt-4">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre artículo</th>
            <th>Cantidad formato de entrada</th>
            <th>Factor de Conversión</th>
            <th>Cantidad formato Salida</th>
            <th>Bodega</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index">
            <td>{{ item.codigo }}</td>
            <td>{{ item.nombre }}</td>
            <td>{{ item.cantidadEntrada }}</td>
            <td>{{ item.factorConversion }}</td>
            <td>{{ item.cantidadSalida }}</td>
            <td>{{ item.bodega }}</td>
            <td><button @click="removeItem(index)" class="btn btn-danger">Eliminar</button></td>
          </tr>
        </tbody>
      </table>
  
      <!-- Botones de transacción y cancelación -->
      <div class="row mt-4">
        <div class="col-sm-12 text-center">
          <button @click="realizarTransaccion" class="btn btn-primary">Realizar transacción</button>
          <button @click="cancelarTransaccion" class="btn btn-danger">Cancelar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: "Entrada-Inventario",
    data() {
      return {
        bodegas: [1, 2, 3, 4, 5],
        articleId: "",
        amount: 0,
        sourceWarehouse: 0,
        destinyWarehouse: 0,
        tableData: [], // Array para almacenar los datos de la tabla
      };
    },
    created() {
  
    },
    unmounted() {
  
    },
    mounted() {
      this.$state.navbarTitle = 'Salidas de inventario';
    },
    methods: {
      transferArticle() {
        // Realiza la llamada a la API para obtener los datos del artículo
        axios.get(`/api/articulos/${this.articleId}`)
          .then(response => {
            const articleData = response.data;
            const newItem = {
              codigo: articleData.codigo,
              nombre: articleData.nombre,
              cantidadEntrada: this.amount,
              factorConversion: articleData.factorConversion,
              cantidadSalida: this.amount * articleData.factorConversion,
              bodega: this.destinyWarehouse,
            };
  
            // Agrega el nuevo artículo a la tabla
            this.tableData.push(newItem);
          })
          .catch(error => {
            console.log(error);
          });
      },
      removeItem(index) {
        // Elimina el artículo de la tabla según el índice proporcionado
        this.tableData.splice(index, 1);
      },
      realizarTransaccion() {
        // Realiza la transacción de los datos en la tabla enviando la información a la API
        axios.post('/api/transacciones', this.tableData)
          .then(response => {
            // Procesa la respuesta de la transacción exitosa
            console.log(response.data);
            // Reinicia los datos de la tabla o realiza alguna acción adicional
            this.tableData = [];
          })
          .catch(error => {
            console.log(error);
          });
      },
      cancelarTransaccion() {
        // Realiza la lógica de cancelación de la transacción
        // Reinicia los datos de la tabla o realiza alguna acción adicional
        this.tableData = [];
      },
    },
  };
  </script>
  
  <style lang="scss">
  /* Estilos existentes */
  </style>
  