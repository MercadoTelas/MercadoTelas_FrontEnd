<template>
    <div class="form container col-sm-6">
        <div class="form-title">
            <h3>Entrada de inventario</h3>
        </div>
        <div class="form-group row">

            <div class="form-group">
                <label for="codigoArticulo" class="form-label mt-4">Código del artículo</label>
                <input v-model="articleId" type="text" class="form-control" id="codigoArticulo"
                    placeholder="Ingrese el código del artículo...">
            </div>

            <div class="form-group">
                <label for="cantidadIngresar" class="form-label mt-4">Cantidad a ingresar</label>
                <input v-model="amount" type="number" class="form-control" id="cantidadIngresar"
                    placeholder="Digite la cantidad a ingresar...">
            </div>

            <div class="form-group">
                <label for="cantidadIngresar" class="form-label mt-4">Número de bodega destino</label>
                <input type="number" class="form-control" id="cantidadIngresar"
                    placeholder="Seleccione la bodega destino...">
            </div>

            <div class="form-group">
                <label for="bodega" class="form-label mt-4">Seleccione la bodega destino..</label>
                <select v-model="destinyWarehouse" class=" form-select" id="bodega">
                    <option v-for="b in bodegas" :key="b.id"> {{ b }}</option>
                </select>
            </div>

            <div class="review">
                <label for="bodega" class="form-label mt-4">Seleccione la bodega destino..</label>
                <select v-model="destinyWarehouse" class=" form-select" id="bodega">
                    <option v-for="b in bodegas" :key="b.id"> {{ b }}</option>
                </select>
            </div>

        </div>
    </div>
</template>


<style lang="scss">
.form {

    .form-title {
        margin-top: 40px;
        text-align: center;
    }
}
</style>


<script>
export default {
    name: "Entrada-Invetario",
    data() {
        return {
            bodegas: [1, 2, 3, 4, 5],
            articleId: '',
            amount: 0,
            destinyWarehouse: 0
        }
    },
    created() {
        document.getElementById('entrada').style.backgroundColor = "#3066BE"
    },
    unmounted() {
        document.getElementById('entrada').style.backgroundColor = '#15386E';
    },
    methods: {
    }
};
</script>

