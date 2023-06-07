<template>
    <div class="sidebar">
        <div class=" nav-item">
            <router-link to='/home' class="nav-link">
                <div class=" sidebar-icon-wrapper">
                    <img src="../assets/home.svg" class="sidebar-icon">
                </div>
                <div class="sidebar-title">Inicio</div>
            </router-link>
        </div>
        <div class="nav-item">
            <a class="nav-link" href="#">
                <div class="sidebar-icon-wrapper">
                    <img class="sidebar-icon" src="../assets/micuenta.svg" alt="Mi cuenta">
                </div>
                <div class="sidebar-title">Mi cuenta</div>
            </a>
        </div>
        <div v-if="isDesktop" class="nav-item">
            <a class="nav-link" href="#">
                <div class="sidebar-icon-wrapper">
                    <img src="../assets/verarticulos.svg" alt="Ver articulos" class="sidebar-icon">
                </div>
                <div class="sidebar-title">Ver articulos</div>
            </a>
        </div>
        <div v-if="isDesktop" class="nav-item">
            <a class="nav-link" href="#">
                <div class="sidebar-icon-wrapper">
                    <img src="../assets/nuevos.svg" alt="Agregar nuevos artículos" class="sidebar-icon">
                </div>
                <div class="sidebar-title">Agregar nuevos artículos</div>
            </a>
        </div>
        <div class="nav-item">
            <a class="nav-link" href="#">
                <div class="sidebar-icon-wrapper">
                    <img src="../assets/entradainventario.svg" alt="Entradas de inventario" class="sidebar-icon">
                </div>
                <div class="sidebar-title">Entradas de inventario</div>
            </a>
        </div>
        <div class="nav-item">
            <a class="nav-link" href="#">
                <div class="sidebar-icon-wrapper">
                    <img src="../assets/salidainventario.svg" alt="Salidas de Inventario" class="sidebar-icon">
                </div>
                <div class="sidebar-title">Salidas de Inventario</div>
            </a>
        </div>
        <div v-if="isDesktop" class="nav-item">
            <a class="nav-link" href="#">
                <div class="sidebar-icon-wrapper">
                    <img src="../assets/gestionarusuarios.svg" alt="Gestionar usuarios" class="sidebar-icon">
                </div>
                <div class="sidebar-title">Gestionar usuarios</div>
            </a>
        </div>
        <div v-if="isDesktop" class="nav-item">
            <a class="nav-link" href="#">
                <div class="sidebar-icon-wrapper">
                    <img src="../assets/registro.svg" alt="Registro de movimientos" class="sidebar-icon">
                </div>
                <div class="sidebar-title">Registro de movimientos</div>
            </a>
        </div>
        <div id="exit-item" class="nav-item">
            <a class="nav-link" href="#">
                <div id="exit-wrapper" class="sidebar-icon-wrapper">
                    <img id="exit" src="../assets/salir.svg" alt="Salir" class="sidebar-icon">
                </div>
                <div class="sidebar-title">Salir</div>
            </a>
        </div>
    </div>
</template>

<style lang="scss">
.sidebar {

    background-color: #15386E;
    color: white;

    //mobile version
    @media (max-width: 700px) {

        position: fixed;
        bottom: 0;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        text-align: center;

        .nav-item {

            width: 100px;
            height: 90px;

            .nav-link {

                .sidebar-icon-wrapper {

                    margin-top: 15px;

                    .sidebar-icon {
                        margin-top: 5px;
                        height: 40px;
                        width: auto;
                    }
                }

                .sidebar-title {
                    margin-top: 2.5px;
                    font-size: 10px;
                }
            }
        }

    }

    //desktop version
    @media (min-width: 700px) {

        position: fixed;
        height: 100%;
        width: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        .nav-item {

            height: auto;
            width: 130px;

            .nav-link {

                .sidebar-icon-wrapper {


                    .sidebar-icon {
                        margin-top: 10px;
                        height: 40px;
                    }
                }

                .sidebar-title {
                    margin-top: 10px;
                    font-size: 12px;
                }
            }
        }

    }

    #exit-item {
        background-color: #AE0214;

        :hover {
            background-color: #D72638;
        }
    }

    .nav-item {

        background-color: inherit;

        :hover {
            background-color: #3066BE;
        }
    }

}
</style>

<script>
export default {
    data() {
        return {
            limit: 700,
            screenWidth: 0,
            screenHeight: 0,
            isDesktop: false
        };
    },
    created() {
        this.updateScreenSize();
        window.addEventListener('resize', this.updateScreenSize);
    },
    unmounted() {
        window.removeEventListener('resize', this.updateScreenSize);
    },
    methods: {
        updateScreenSize() {
            this.screenWidth = window.innerWidth;
            this.screenHeight = window.innerHeight;
            this.Desktop();
        },
        Desktop() {
            this.isDesktop = this.screenWidth >= this.limit;
        }
    }
};
</script>
