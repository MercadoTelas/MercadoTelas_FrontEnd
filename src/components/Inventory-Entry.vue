<template>
  <div class="form-title col-sm-12 mx-auto">
  </div>
  <form class="form container col-sm-8">
    <div class="row">

      <div class="col-md-6">


        <div class="form-group">
          <label for="codigoArticulo" class="form-label">Código del artículo</label>
          <input v-model="articleId" type="text" class="form-control" id="codigoArticulo"
            placeholder="Ingrese el código del artículo...">
        </div>

        <div class="form-group">
          <label for="cantidadIngresar" class="form-label">Cantidad a ingresar</label>
          <input v-model="amount" type="number" class="form-control" id="cantidadIngresar"
            placeholder="Digite la cantidad a ingresar...">
        </div>

        <div class="form-group">
          <label for="bodega" class="form-label">Seleccione la bodega destino</label>
          <select v-model="destinyWarehouse" class="form-select" id="bodega">
            <option v-for="bodega in bodegas" :key="bodega">{{ bodega }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="formatoSalida" class="form-label">Formato de salida</label>
          <input v-model="destinyFormat" type="number" class="form-control" id="formatoSalida"
            placeholder="Digite el formato de salida...">
        </div>

      </div>

        <div class="col-sm-6">
          <div class="row">
            <div class="col-sm-12">
              <div class="resumen">
                <p>Resumen de la transacción</p>
                <span>Se van a transferir {{ amount }} unidades del artículo {{ articleId }} desde la bodega número {{
                  sourceWarehouse }} a la bodega número {{ destinyWarehouse }}.</span>
              </div>
            </div>

            <div class="col-sm-12 text-center">
              <div class="form-group">
                <button @click.prevent="addArticle" class="submit">Agregar artículo</button>
              </div>
            </div>

          </div>
        </div>
      
    </div>
  </form>
</template>
  
<style lang="scss">
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
export default {
  name: "EntradaInventario",
  data() {
    return {
      bodegas: [1, 2, 3, 4, 5],
      articleId: "",
      amount: 0,
      destinyWarehouse: 0,
      destinyFormat: 0,
    };
  },
  mounted() {
    this.$state.navbarTitle = 'Entradas de inventario';
  },
  methods: {
    addArticle() {
      // Lógica para agregar el artículo
    },
  },
};
</script>
  