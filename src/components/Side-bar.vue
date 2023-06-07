<template>
    <div class="sidebar">
        <div class="nav-item">
            <a class="nav-link" href="#">
                <div class="sidebar-icon-wrapper">
                    <img src="../assets/home.svg" class="sidebar-icon">
                </div>
                <div class="sidebar-title">Inicio</div>
            </a>
        </div>
        <div class="nav-item">
            <a class="nav-link" href="#">
                <div class="sidebar-icon-wrapper">
                    <img class="sidebar-icon" src="../assets/micuenta.svg" alt="Mi cuenta">
                </div>
                <div class="sidebar-title">Mi cuenta</div>
            </a>
        </div>
        <div class="nav-item">
            <a class="nav-link" href="#">
                <div class="sidebar-icon-wrapper">
                    <img src="../assets/verarticulos.svg" alt="Ver articulos" class="sidebar-icon">
                </div>
                <div class="sidebar-title">Ver articulos</div>
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
        <div class="nav-item">
            <a class="nav-link" href="#">
                <div class="sidebar-icon-wrapper">
                    <img src="../assets/gestionarusuarios.svg" alt="Gestionar usuarios" class="sidebar-icon">
                </div>
                <div class="sidebar-title">Gestionar usuarios</div>
            </a>
        </div>
        <div class="nav-item">
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
    position: fixed;
    height: 100vh;
    color: white;
    background-color: #15386E;

    .nav-item {

        width: 87px;

        .nav-link {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: white;
            transition: background-color 0.3s ease-in-out;
            text-align: center;

            .sidebar-icon-wrapper {

                margin-top: 10px;

                .sidebar-icon {
                    filter: invert(100%);
                    height: 42px;
                }
            }

            .sidebar-title {
                font-size: 12px;
            }

        }
    }

    #exit-item {
        margin-top: 10px;
        background-color: #D72638;
    }
}
</style>

<script>
export default {
    data() {
        return {};
    },
    methods: {}
};
</script>
