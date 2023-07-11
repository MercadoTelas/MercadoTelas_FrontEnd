<!--suppress JSPotentiallyInvalidConstructorUsage -->
<template>
  <div class="nav-wrapper" style="height: 110px">
    <nav class="navbar navbar-expand-lg" :class="{ sticky: isSticky }">
      <div class="logo-container">
        <img id="logotelas" src="../../assets/logo_telas.jpg" @click="NavigateToAnotherPage('home')" alt="logo" />
      </div>

      <div class="title-wrapper">
        <h1 class="navbar-title">{{ $state.navbarTitle }}</h1>
      </div>

      <div class="logo-usuario-container">
        <i id="logousuario" class="bi bi-person-circle" @click="NavigateToAnotherPage('userProfile')"></i>
      </div>
    </nav>
  </div>
</template>

<style lang="scss">
.navbar.sticky {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.navbar {
  background-color: #15386e;
  color: white;
  height: 110px;

  .logo-container {
    margin-left: 15px;
    margin-right: auto;

    #logotelas {
      width: 130px;
      height: 80px;
    }

    #logotelas:hover {
      cursor: pointer;
    }
  }


  .title-wrapper {
    width: 100%;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .title-wrapper .navbar-title {
    width: fit-content;
    font-size: 34px;
    font-weight: bold;
    flex-grow: 1;
    margin-left: auto;
    margin-right: auto;
  }

  .warehouse-select-container {
    position: relative;

    .warehouse-select-button {
      padding: 10px;
      font-size: 16px;
      border: none;
      background-color: #f2f2f2;
      color: #15386e;
      border-radius: 5px;
      cursor: pointer;
    }

    .warehouse-dropdown {
      position: absolute;
      top: calc(100% + 10px);
      left: 0;
      width: 100%;
      background-color: #2f18a4;
      border-radius: 5px;
      padding: 10px;
      display: none;
      z-index: 999;

      ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
      }

      li {
        padding: 5px 0;
        cursor: pointer;
      }
    }

    .warehouse-dropdown.show {
      display: block;
    }
  }

  .logo-usuario-container {
    margin-left: auto;
    margin-right: 15px;

    #logousuario {
      width: 90px;
      height: 80px;
      font-size: 70px;
    }

    #logousuario:hover {
      cursor: pointer;
    }
  }
}
</style>

<script>
import axios from "axios";
import { API_URL } from "@/config";
export default {
  data() {
    return {
      isSticky: false,
      showWarehouseDropdown: false,
      selectedWarehouse: null,
      warehouses: "",
    };
  },
  mounted() {
    axios.get(API_URL + "/warehouses").then((response) => {
      this.warehouses = response.data;
    });
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    NavigateToAnotherPage(page) {
      this.$router.push("/" + page);
    },
    toggleWarehouseDropdown() {
      this.showWarehouseDropdown = !this.showWarehouseDropdown;
    },
    selectWarehouse(warehouse) {
      this.selectedWarehouse = warehouse;
      this.showWarehouseDropdown = false;
    },
    updateNavbarTitle(newTitle) {
      // Utilizamos la mutación del store para actualizar el título del navbar
      this.$store.commit("updateNavbarTitle", newTitle);
    },
    handleScroll() {
      this.isSticky = window.scrollY > 0;
    },
  },
};
</script>

<!--
Componente de barra de navegación horizontal NAVBAR

**Template:**

- `<div class="nav-wrapper" style="height: 110px">`: Es el contenedor principal del componente de la barra de navegación.

- `<nav class="navbar navbar-expand-lg" :class="{ sticky: isSticky }">`: Es la barra de navegación. La clase `navbar` se expande en pantallas grandes (`navbar-expand-lg`). Se aplica la clase `sticky` condicionalmente según el valor de la propiedad `isSticky`.

- `<div class="logo-container">`: Contenedor para el logotipo de la empresa.

- `<img id="logotelas" src="../../assets/logo_telas.jpg" @click="NavigateToAnotherPage('home')" alt="logo" />`: Es la imagen del logotipo de la empresa. Al hacer clic en la imagen, se invoca el método `NavigateToAnotherPage` para redirigir al usuario a la página de inicio.

- `<div class="title-wrapper">`: Contenedor para el título de la barra de navegación.

- `<h1 class="navbar-title">{{ $state.navbarTitle }}</h1>`: Muestra el título de la barra de navegación, que se obtiene del estado de la aplicación utilizando `$state.navbarTitle`.

- `<div class="logo-usuario-container">`: Contenedor para el icono de usuario.

- `<i id="logousuario" class="bi bi-person-circle" @click="NavigateToAnotherPage('userProfile')"></i>`: Es el icono de usuario. Al hacer clic en el icono, se invoca el método `NavigateToAnotherPage` para redirigir al usuario al perfil de usuario.

**Estilos:**

- `.navbar.sticky`: Define los estilos para la barra de navegación cuando tiene la clase `sticky`. Esta clase se aplica cuando la propiedad `isSticky` es `true`. Los estilos incluyen la posición fija en la parte superior de la página y un alto de 110 píxeles.

- `.navbar`: Define los estilos generales para la barra de navegación. Establece el color de fondo y el color de texto en blanco. También define los estilos para los contenedores de logotipo y de usuario.

- `.logo-container`: Define los estilos para el contenedor del logotipo. Establece los márgenes y el tamaño del logotipo.

- `.title-wrapper`: Define los estilos para el contenedor del título de la barra de navegación. Centra el contenido horizontalmente.

- `.title-wrapper .navbar-title`: Define los estilos para el título de la barra de navegación. Establece el tamaño de fuente, el peso de fuente y el ancho del título.

- `.warehouse-select-container`: Define los estilos para el contenedor de selección de almacén. Contiene estilos para el botón de selección de almacén y el menú desplegable de almacén.

- `.warehouse-select-button`: Define los estilos para el botón de selección de almacén. Establece el tamaño del padding, el tamaño de fuente, el color de fondo y el color de texto.

- `.warehouse-dropdown`: Define los estilos para el menú desplegable de almacén. Establece la posición absoluta, el color de fondo, el borde redondeado, el padding y la visibilidad inicialmente oculta.

- `.warehouse-dropdown.show`: Define los estilos para mostrar el menú desplegable de almacén cuando `showWarehouseDropdown` es `true`.

- `.logo-usuario-container`: Define los estilos para el contenedor del icono de usuario. Establece los márgenes y el tamaño del icono.

**Script:**

- `import axios from "axios";`: Importa Axios, una biblioteca para realizar solicitudes HTTP.

- `import { API_URL } from "@/config";`: Importa la URL de la API desde el archivo de configuración.

- `data() { return { ... } }`: Define los datos del componente. Inicializa las propiedades `isSticky` como `false` para controlar si la barra de navegación es pegajosa, `showWarehouseDropdown` como `false` para controlar la visibilidad del menú desplegable de almacén, `selectedWarehouse` como `null` para almacenar el almacén seleccionado y `warehouses` como una cadena vacía para almacenar los almacenes obtenidos de la API.

- `mounted() { ... }`: Se ejecuta después de que el componente se haya montado en el DOM. Utiliza Axios para obtener los almacenes de la API y registra un evento de desplazamiento para controlar la propiedad `isSticky` basada en la posición de desplazamiento de la ventana.

- `beforeUnmount() { ... }`: Se ejecuta antes de que el componente se desmonte. Elimina el evento de desplazamiento para evitar posibles fugas de memoria.

- `methods: { ... }`:
Define los métodos del componente.

 El método `NavigateToAnotherPage` redirige al usuario a otra página según la ruta proporcionada.

El método `toggleWarehouseDropdown` alterna la visibilidad del menú desplegable de almacén. El método `selectWarehouse` establece el almacén seleccionado y oculta el menú desplegable.

El método `updateNavbarTitle` actualiza el título de la barra de navegación utilizando la mutación `updateNavbarTitle` del store. El método `handleScroll` controla la propiedad `isSticky` basada en la posición de desplazamiento de la ventana.
-->