<template>
  <div class="form-container">
    <div class="form-title col-sm-12 mx-auto">
    </div>
    <form class="form container col-sm-8">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="codigoArticulo" class="form-label">
              <div class="blue-box">
                <div class="label-text">Código del artículo</div>
              </div>
            </label>
            <input v-model="articleId" type="text" class="form-control" id="codigoArticulo"
              placeholder="Ingrese el código del artículo...">
          </div>

          <div class="form-group">
            <label for="cantidadIngresar" class="form-label">
              <div class="blue-box">
                <div class="label-text">Cantidad a ingresar</div>
              </div>
            </label>
            <input v-model="amount" type="number" class="form-control" id="cantidadIngresar"
              placeholder="Digite la cantidad a ingresar...">
          </div>

          <div class="form-group">
            <label for="bodega" class="form-label">
              <div class="blue-box">
                <div class="label-text">Seleccione la bodega destino</div>
              </div>
            </label>
            <select v-model="destinyWarehouse" class="form-select" id="bodega">
              <option v-for="bodega in bodegas" :key="bodega">{{ bodega }}</option>
            </select>
          </div>
        </div>

        <div class="col-sm-6">
          <div class="row">
            <div class="col-sm-12 text-center">
              <div class="form-group">
                <button @click.prevent="addArticle" class="submit">Agregar artículo</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

    <table class="table table-responsive">
      <thead>
        <tr>
          <th>Código</th>
          <th>Nombre artículo</th>
          <th>Cantidad formato de entrada</th>
          <th>Factor de Conversión</th>
          <th>Cantidad formato Salida</th>
          <th>Bodega</th>
          <th></th>
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

    <div class="row">
      <div class="col-sm-12 text-center">
        <div class="form-group">
          <button @click.prevent="realizarTransaccion" type="submit" class="btn btn-primary">Realizar transacción</button>
          <button @click.prevent="cancelarTransaccion" class="btn btn-danger">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

  
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
  
<script>
import axios from "axios";

export default {
  name: "EntradaInventario",
  data() {
    return {
      bodegas: [1, 2, 3, 4, 5],
      articleId: '',
      amount: 0,
      destinyWarehouse: 0,
      tableData: [],
    };
  },
  mounted() {
    this.$state.navbarTitle = 'Entradas de inventario';
  },
  methods: {
    methods: {
      addArticle() {
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
  },
};
</script>
  