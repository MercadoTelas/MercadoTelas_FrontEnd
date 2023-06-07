<template>
    <nav class="navbar navbar-expand-lg">
        <div class="logo-container">
            <img id="logotelas" src="../assets/logo_telas.jpg">
        </div>
        <div class="logo-usuario-container">
            <img id="logousuario" src="../assets/micuenta.svg">
        </div>
    </nav>
</template>

<style lang="scss">
.navbar {

    background-color: #15386E;
    color: white;
    height: 110px;

    .container {
        display: flex;
        align-items: center;
    }

    .logo-container {

        margin-left: 10px;
        margin-right: 10px;

        #logotelas {
            width: 110px;
            height: 100px;
        }

    }

    .logo-usuario-container {

        width: 100px;
        margin-left: auto;

        #logousuario {
            width: 90px;
            height: 80px;
        }

    }

}
</style>
