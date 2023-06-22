<template>
  <div class="container">
    <div class="row">
      <input
        type="checkbox"
        id="check"
        v-model="checked"
        @change="handleCheckboxChange"
      />
      <div id="spaceDiv" class="col-lg-3"></div>
      <div id="contentDiv" class="col-md-6 mt-5">
        <div class="container mt-6">
          <div class="text-center">
            <h3>Hola de nuevo, {{ name + " " + lastName }}</h3>
          </div>
        </div>
        <fieldset>
          <legend style="padding-left: 100px; padding-top: 50px;">Información de la cuenta</legend>
          <form>
            <div class="form-group mt-5">
              <label for="email" class="form-label">Correo electrónico</label>
              <input
                v-model="email"
                type="text"
                class="form-control"
                id="email"
                disabled
                style="width: 400px"
              />
            </div>
          </form>
        </fieldset>
        <fieldset>
          <legend style="padding-left: 100px">Cambio de contraseña</legend>
          <form>
            <div class="form-group mt-5">
              <label for="newPassword" class="form-label"
                >Nueva contraseña</label
              >
              <input
                v-model="newPassword"
                type="password"
                class="form-control"
                id="newPassword"
                style="width: 400px"
              />
            </div>
            <div class="form-group mt-3">
              <label for="passwordConfirmation" class="form-label"
                >Confirme su nueva contraseña</label
              >
              <input
                v-model="passwordConfirm"
                type="password"
                class="form-control"
                id="passwordConfirmation"
                style="width: 400px"
              />
            </div>

            <div class="d-flex justify-content-center align-items-center mt-3">
              <button
                id="cambioPassword"
                type="button"
                class="form-button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                @click.prevent="cambiarPassword"
              >
                Confirmar cambio de contraseña
              </button>
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
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
      newPassword: "",
      passwordConfirm: "",
      bodegas: [1, 2, 3, 4, 5],
    };
  },
  computed: {
    ...mapState(["checkboxValue"]),
    checked: {
      get() {
        return this.checkboxValue;
      },
    },
  },
  created() {},
  mounted() {},
  unmounted() {},
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    cambiarBodega() {
      if (this.destinyWarehouse != 0) {
        this.actualWarehouse = this.destinyWarehouse;
      }
    },
    cambiarPassword() {},
  },
};
</script>

<style lang="scss">
#spaceDiv {
  display: none;
}

#check:checked ~ #spaceDiv {
  height: 100vh;
  width: 345px;
  display: block;
}

#check:checked ~ #contentDiv {
  height: 100vh;
  display: block;
}

.container div {
  justify-content: center;
  align-items: center;
}

.form-button {
  height: 35px;
  border: none;
  background-color: #3066be;
  border-radius: 10px;
  color: #ffffff;
  width: 300px;
  text-align: center;
}
</style>
