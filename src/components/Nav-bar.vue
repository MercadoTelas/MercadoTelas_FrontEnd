<template>
  <nav class="navbar navbar-expand-lg">
    <div class="logo-container">
      <img id="logotelas" src="../assets/logo_telas.jpg" @click="NavigateToAnotherPage('home')"/>
    </div>
    <div class="logo-usuario-container">
      <i id="logousuario" class="bi bi-person"></i>
    </div>
  </nav>
</template>

<style lang="scss">
.navbar {
  background-color: #15386e;
  color: white;
  height: 110px;

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
  }

  .logo-container {
    margin-left: 10px;
    margin-right: 10px;

    #logotelas {
      width: 130px;
      height: 80px;
    }

    #logotelas:hover {
      cursor: pointer;
    }

  }

  .logo-usuario-container {
    margin-top: 10px;
    margin-right: 10px;
    margin-left: auto;

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
  methods: {
    NavigateToAnotherPage(page) {
      this.$router.push("/" + page);
    },
  },
};
</script>
