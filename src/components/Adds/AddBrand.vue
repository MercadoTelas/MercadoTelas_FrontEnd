<template>
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />

  <div class="container">
    <form @submit.prevent="onSubmit">
      <div class="table-responsive">
        <table class="table table-bordered table-secondary">
          <tbody>
            <tr>
              <td class="table-label">Marca:</td>
              <td class="table-input" colspan="5">
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-medium"></i></span>
                  <input type="text" class="form-control" id="brand" name="brand" v-model="name" :disabled="isReadOnly" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary" type="submit" v-if="!isReadOnly">
          Guardar
        </button>
        <button class="btn btn-primary" type="submit" v-if="isReadOnly">
          Guardar cambios
        </button>
        <router-link to="/brands" class="btn btn-danger">Cancelar</router-link>
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
      this.fetchBrandData(idParam);
    } else {
      this.isReadOnly = false;
      this.type = "new";
    }
  },
  mounted() {
    this.$state.navbarTitle = "Agregar Nueva Marca";
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
      let brand = {
        brand: {
          name: this.name,
        },
      };
      brand.user = this.$store.state.user.id;
      if (this.type === "new") {
        this.createBrand(brand);
      } else {
        this.updateBrand(brand);
      }
    },
    async createBrand(brand) {
      axios
        .post(`${API_URL}/brands`, brand)
        .then(async (response) => {
          console.log(response);
          toast.success("Marca creada exitosamente", { timeout: 2000 });
          // Esperar 2 segundos antes de redirigir a "/brands"
          await new Promise(resolve => setTimeout(resolve, 2000));
          this.$router.push("/brands");
        })
        .catch((error) => {
          toast.error("Error al crear la marca", { closeOnClick: false });
          console.log(error);
        });
    },
    updateBrand(brand) {
      const brandId = this.$route.params.id;
      axios
        .put(`${API_URL}/brands/${brandId}`, brand)
        .then(async (response) => {
          console.log(response);
          toast.success("Marca actualizada exitosamente", {
            closeOnClick: false,
          });
          // Esperar 2 segundos antes de redirigir a "/brands"
          await new Promise(resolve => setTimeout(resolve, 2000));
          this.$router.push("/brands");
        })
        .catch(async (error) => {
          toast.error("Error al actualizar la marca", { closeOnClick: false });
          // Esperar 2 segundos antes de redirigir a "/brands"
          await new Promise(resolve => setTimeout(resolve, 2000));
          console.log(error);
        });
    },
    fetchBrandData(brandId) {
      axios
        .get(`${API_URL}/brands/${brandId}`)
        .then((response) => {
          const brandData = response.data;
          this.name = brandData.name;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
#check:checked~.container {
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
  width: 40%;
  vertical-align: middle;
  border-color: #dee2e6;
  padding: 0.75rem;
}

.table-input {
  vertical-align: middle;
  border-color: #dee2e6;
  padding: 0.75rem;
}

.input-group {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;
}

.input-group-text {
  display: flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  margin-bottom: 0;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  text-align: center;
  white-space: nowrap;
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}
</style>
