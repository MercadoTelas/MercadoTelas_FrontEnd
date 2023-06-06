<template>
    <div class="sidebar">
        <ul class="nav flex-column">
            <li class="nav-item">
                <a class="nav-link" href="#">
                    <img src="/assets/home.png" alt="Inicio" class="sidebar-icon">
                    <span class="sidebar-title">Inicio</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">
                    <img src="/assets/micuenta.png" alt="Mi cuenta" class="sidebar-icon">
                    <span class="sidebar-title">Mi cuenta</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">
                    <img src="/assets/articles.png" alt="Ver articulos" class="sidebar-icon">
                    <span class="sidebar-title">Ver articulos</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">
                    <img src="/assets/inventory-in.png" alt="Entradas de inventario" class="sidebar-icon">
                    <span class="sidebar-title">Entradas de inventario</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">
                    <img src="/assets/inventory-out.png" alt="Salidas de Inventario" class="sidebar-icon">
                    <span class="sidebar-title">Salidas de Inventario</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">
                    <img src="/assets/users.png" alt="Gestionar usuarios" class="sidebar-icon">
                    <span class="sidebar-title">Gestionar usuarios</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">
                    <img src="/assets/movements.png" alt="Registro de movimientos" class="sidebar-icon">
                    <span class="sidebar-title">Registro de movimientos</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">
                    <img src="/assets/logout.png" alt="Salir" class="sidebar-icon">
                    <span class="sidebar-title">Salir</span>
                </a>
            </li>
        </ul>
    </div>
</template>

<style>
.sidebar {
    width: 250px;
    background-color: #f8f9fa;
    padding: 20px;
}

.nav-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: #333;
    text-decoration: none;
    padding: 10px;
}

.sidebar-icon {
    width: 50px;
    height: 50px;
}

.sidebar-title {
    font-size: 14px;
    margin-top: 5px;
}
</style>

<script>
export default {
    data() {
        return {

        };
    },
    methods: {
    }
};
</script>
