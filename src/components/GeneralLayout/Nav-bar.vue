<template>
  <div class="nav-wrapper" style="height:110px;">
    <nav class="navbar navbar-expand-lg" :class="{ 'sticky': isSticky }">
      <div class="logo-container">
        <img
          id="logotelas"
          src="../../assets/logo_telas.jpg"
          @click="NavigateToAnotherPage('home')"
        />
      </div>

      <div class="bodega-select-container">
        <button class="bodega-select-button" @click="toggleBodegaDropdown">
          {{ selectedBodega ? selectedBodega : "Seleccionar Bodega" }}
        </button>
        <div class="bodega-dropdown" :class="{ show: showBodegaDropdown }">
          <ul>
            <li @click="selectBodega('Bodega 1')">Bodega 1</li>
            <li @click="selectBodega('Bodega 2')">Bodega 2</li>
            <li @click="selectBodega('Bodega 3')">Bodega 3</li>
          </ul>
        </div>
      </div>
      <h1 class="navbar-title">{{ $state.navbarTitle }}</h1>
      <div class="logo-usuario-container">
        <i
          id="logousuario"
          class="bi bi-person-circle"
          @click="NavigateToAnotherPage('userProfile')"
        ></i>
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
    margin-right: 15px;
    margin-left: 15px;

    #logotelas {
      width: 130px;
      height: 80px;
    }

    #logotelas:hover {
      cursor: pointer;
    }
  }

  .navbar-title {
    font-size: 34px;
    font-weight: bold;
    text-align: center;
    margin-right: 10%;
    flex-grow: 1;
  }

  .bodega-select-container {
    position: relative;

    .bodega-select-button {
      padding: 10px;
      font-size: 16px;
      border: none;
      background-color: #f2f2f2;
      color: #15386e;
      border-radius: 5px;
      cursor: pointer;
    }

    .bodega-dropdown {
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

    .bodega-dropdown.show {
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
export default {
  data() {
    return {
      isSticky: false,
      showBodegaDropdown: false,
      selectedBodega: null,
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    NavigateToAnotherPage(page) {
      this.$router.push("/" + page);
    },
    toggleBodegaDropdown() {
      this.showBodegaDropdown = !this.showBodegaDropdown;
    },
    selectBodega(bodega) {
      this.selectedBodega = bodega;
      this.showBodegaDropdown = false;
    },
    updateNavbarTitle(newTitle) {
      // Utilizamos la mutación del store para actualizar el título del navbar
      this.$store.commit("updateNavbarTitle", newTitle);
    },
    handleScroll() {
      this.isSticky = window.scrollY > 0;
    }
  },
};
</script>
