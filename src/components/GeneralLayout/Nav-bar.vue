<!--suppress JSPotentiallyInvalidConstructorUsage -->
<template>
  <div class="nav-wrapper" style="height: 110px">
    <nav class="navbar navbar-expand-lg" :class="{ sticky: isSticky }">
      <div class="logo-container">
        <img
          id="logotelas"
          src="../../assets/logo_telas.jpg"
          @click="NavigateToAnotherPage('home')"
          alt="logo"
        />
      </div>

      <div class="title-wrapper">
        <h1 class="navbar-title">{{ $state.navbarTitle }}</h1>
      </div>

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
