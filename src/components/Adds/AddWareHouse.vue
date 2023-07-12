<template>
  <input
    type="checkbox"
    id="check"
    v-model="checked"
    @change="handleCheckboxChange"
  />

  <div class="container">
    <form @submit.prevent="onSubmit">
      <div class="table-responsive">
        <table class="table table-bordered table-secondary">
          <tbody>
            <tr>
              <td class="table-label">Ingrese el nombre de la bodega:</td>
              <td class="table-input">
                <div class="input-group">
                  <span class="input-group-text"
                    ><i class="bi bi-box-seam-fill"></i
                  ></span>
                  <input
                    type="text"
                    class="form-control"
                    id="warehouse"
                    name="warehouse"
                    v-model="name"
                    :disabled="isReadOnly"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary" type="submit" v-if="!isReadOnly">
          Guardar cambios
        </button>
        <button class="btn btn-danger" type="submit" v-if="isReadOnly">
          Volver
        </button>
        <router-link to="/warehouses" class="btn btn-danger"
          >Cancelar</router-link
        >
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import { API_URL } from "@/config";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  data() {
    return {
      name: "",
      isReadOnly: false,
      type: "",
    };
  },
  created() {
    const idParam = this.$route.params.id;
    if (idParam) {
      this.type = "edit";
      this.fetchCategoryData(idParam);
    } else {
      this.type = "new";
      this.isReadOnly = false;
    }
  },
  computed: {
    ...mapState(["checkboxValue"]),
    checked: {
      get() {
        return this.checkboxValue;
      },
    },
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    onSubmit() {
      let warehouse = {
        warehouse: {
          name: this.name,
        },
      };
      warehouse.user = this.$store.state.user.id;
      if (this.type === "new") {
        this.createWarehouse(warehouse);
      } else {
        this.updateWarehouse(warehouse);
      }
    },
    createWarehouse(warehouse) {
      axios
        .post(`${API_URL}/warehouses`, warehouse)
        .then(async (response) => {
          console.log(response);
          toast.success("Bodega creada exitosamente");
          // Esperar 2 segundos antes de redirigir a "/brands"
          await new Promise(resolve => setTimeout(resolve, 2000));
          this.$router.push("/warehouses");
        })
        .catch(async (error) => {
          console.log(error);
          toast.error("Error al crear la bodega");
          // Esperar 2 segundos antes de redirigir a "/brands"
          await new Promise(resolve => setTimeout(resolve, 2000));
        });
    },
    updateWarehouse(warehouse) {
      const warehouseId = this.$route.params.id;
      axios
        .put(`${API_URL}/warehouses/${warehouseId}`, warehouse)
        .then(async (response) => {
          console.log(response);
          toast.success("Bodega actualizada exitosamente");
          // Esperar 2 segundos antes de redirigir a "/brands"
          await new Promise(resolve => setTimeout(resolve, 2000));
          this.$router.push("/warehouses");
        })
        .catch(async (error) => {
          console.log(error);
          toast.error("Error al actualizar la bodega");
          // Esperar 2 segundos antes de redirigir a "/brands"
          await new Promise(resolve => setTimeout(resolve, 2000));
        });
    },
    fetchWarehouseData(warehouseId) {
      axios
        .get(`${API_URL}/warehouses/${warehouseId}`)
        .then((response) => {
          const warehouseData = response.data;
          this.name = warehouseData.name;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.$state.navbarTitle = "Agregar Nueva Bodega";
  },
};
</script>

<style scoped>
#check:checked ~ .container {
  padding-left: 345px;
  max-width: 1000px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.table {
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
}

.table-bordered {
  border-collapse: collapse;
  border-color: #dee2e6;
}

.table-label {
  width: 50%;
  vertical-align: middle;
  border-color: #dee2e6;
  padding: 0.75rem;
}

.table-input {
  vertical-align: middle;
  border-color: #dee2e6;
  padding: 0.75rem;
}

.btn-primary {
  margin-left: 10px;
}
</style>
