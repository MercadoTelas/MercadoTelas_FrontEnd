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
                    <label for="cantidadTransferir" class="form-label">Cantidad a transferir</label>
                    <input v-model="amount" type="number" class="form-control" id="cantidadTransferir">
                </div>

            </div>

            <div class="col-md-6">

                <div class="form-group">
                    <label for="bodegaFuente" class="form-label">Seleccione la bodega fuente</label>
                    <select v-model="sourceWarehouse" class="form-select" id="bodegaFuente">
                        <option class="option" v-for="b in bodegas" :key="b.id">{{ b }}</option>
                    </select>
                </div>


                <div class="form-group">
                    <label for="bodegaDestino" class="form-label">Seleccione la bodega destino</label>
                    <select v-model="destinyWarehouse" class="form-select" id="bodegaDestino">
                        <option class="option" v-for="b in bodegas" :key="b.id">{{ b }}</option>
                    </select>
                </div>

            </div>

            <div class="col-sm-8">
                <div class="row">

                    <div class="resumen col-md-9">
                        <p>Resumen de la transacción</p>
                        <span>Se van a transferir {{ amount }} unidades del artículo {{ articleId }} desde la bodega número
                            {{ sourceWarehouse }} a la bodega número {{
                                destinyWarehouse }}.</span>
                    </div>

                    <div class="form-group text-center col-md-2">
                        <button @click.prevent="transferArticle" id="transfer" class="submit">Transferir artículo</button>
                    </div>

                </div>
            </div>
        </div>
    </form>
</template>

<style lang="scss">
.form-title {
    margin-top: 40px;
    text-align: center;
    color: #15386E;
    margin-bottom: 20px;
}

.form {

    .form-group {

        margin-top: 10px;
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

            @media(max-width: 800px) {
                font-size: 11px;
                width: 100px;
            }

        }

        .submit {
            background-color: #3066BE;
            color: white;
            height: 40px;
            width: 200px;
            margin-top: 30px;
            text-align: center;
            border-radius: 10px;
            border: #3066BE;
        }
    }
}

.resumen {

    p {
        margin-top: 10px;
        font-size: 20px;
    }

    color: #E26D5A;
    font-size: 17px;
}
</style>

<script>
export default {
    name: "Entrada-Inventario",
    data() {
        return {
            bodegas: [1, 2, 3, 4, 5],
            articleId: "",
            amount: 0,
            sourceWarehouse: 0,
            destinyWarehouse: 0,
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
        transferArticle() { },
    },
};
</script>
