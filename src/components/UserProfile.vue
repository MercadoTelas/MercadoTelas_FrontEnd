<template>
  <input
    type="checkbox"
    id="check"
    v-model="checked"
    @change="handleCheckboxChange"
  />

  <div class="container">
    <div class="row">
      <div id="contentDiv" class="col-md-6 mt-8">
        <div class="d-flex justify-content-center" style="width: 600px">
          <h3 style="width: fit-content; margin: 0 auto">
            Hola de nuevo, {{ name + " " + lastName }}
          </h3>
        </div>

        <legend
          style="margin-top: 50px; padding-left: 100px; width: fit-content"
        >
          Información de la cuenta
        </legend>

        <div class="form-group mb-8">
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

        <legend style="padding-left: 100px; width: fit-content">
          Cambio de contraseña
        </legend>
        <div class="form-group mt-5">
          <label for="newPassword" class="form-label">Nueva contraseña</label>
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
        <div class="d-flex justify-content-center" style="width: 600px">
          <button
            id="cambioPassword"
            type="button"
            class="form-button"
            style="margin-top: 30px"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            @click.prevent="cambiarPassword"
          >
            Confirmar cambio de contraseña
          </button>
        </div>
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
#check:checked ~ .container .row #contentDiv {
  margin-left: 345px;
}

.container .row {
  justify-content: center;
  align-items: center;
}

.form-group {
  width: fit-content;
}

.container .row .div h3 {
  text-align: center;
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
