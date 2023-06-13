<template>
    <div class="container mt-5">
        <div class="text-center">
            <h3>Hola de nuevo, {{ name + " " + lastName }}</h3>
        </div>
    </div>
    <div class="container">
        <div class="row">
            <div class="col-md-6 mt-5">
                <fieldset>
                    <legend style="padding-left: 100px;">Información de la cuenta</legend>
                    <form>
                        <div class="form-group mt-5">
                            <label for="email" class="form-label">Correo electrónico</label>
                            <input v-model="email" type="text" class="form-control" id="email" disabled
                                style="width: 400px;">
                        </div>

                        <div class="form-group mt-3">
                            <label for="email" class="form-label">Bodega conectada a la sesión actual</label>
                            <input v-model="actualWarehouse" type="text" class="form-control" id="warehouse" disabled
                                style="width: 50px;">
                        </div>

                        <div class="form-group">
                            <label for="bodegaDestino" class="form-label">Seleccione la bodega destino</label>
                            <select v-model="destinyWarehouse" class="form-select" id="bodegaDestino" style="width: 400px;">
                                <option class="option" v-for="b in bodegas" :key="b.id">{{ b }}</option>
                            </select>
                        </div>

                        <div class="d-flex justify-content-center align-items-center mt-3">
                            <button id="cambioBodega" class="form-button" @click.prevent="cambiarBodega">Confirmar cambio de
                                bodega</button>
                        </div>

                    </form>
                </fieldset>
            </div>
            <div class="col-md-6 mt-5">
                <fieldset>
                    <legend style="padding-left: 100px;">Cambio de contraseña</legend>
                    <form>
                        <div class="form-group mt-5">
                            <label for="newPassword" class="form-label">Nueva contraseña</label>
                            <input v-model="newPassword" type="password" class="form-control" id="newPassword"
                                style="width: 400px;">
                        </div>
                        <div class="form-group mt-3">
                            <label for="passwordConfirmation" class="form-label">Confirme su nueva contraseña</label>
                            <input v-model="passwordConfirm" type="password" class="form-control" id="passwordConfirmation"
                                style="width: 400px;">
                        </div>

                        <div class="d-flex justify-content-center align-items-center mt-3">
                            <button id="cambioPassword" type="button" class="form-button" data-bs-toggle="tooltip"
                                data-bs-placement="top" @click.prevent="cambiarPassword">Confirmar
                                cambio de
                                contraseña</button>
                        </div>
                    </form>
                </fieldset>
            </div>

        </div>
    </div>
</template>

<script>

export default {
    name: "Perfil-Component",
    data() {
        return {
            userId: 208320992,
            name: "Juan",
            lastName: "Orozco",
            email: "aegoncold2002@gmail.com",
            role: "admin",
            actualWarehouse: 1,
            destinyWarehouse: 0,
            newPassword: '',
            passwordConfirm: '',
            bodegas: [1, 2, 3, 4, 5]
        };
    },
    created() {
    },
    mounted() {
    },
    unmounted() {
    },
    methods: {
        cambiarBodega() {
            if (this.destinyWarehouse != 0) {
                this.actualWarehouse = this.destinyWarehouse;
            }
        },
        cambiarPassword() {
        }
    },
};
</script>

<style lang="scss">
.form-button {
    height: 35px;
    border: none;
    background-color: #3066BE;
    border-radius: 10px;
    color: #FFFFFF;
    width: 300px;
    text-align: center;
}
</style>