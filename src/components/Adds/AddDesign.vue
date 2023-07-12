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
              <td class="table-label">Ingrese el nombre del diseño:</td>
              <td class="table-input">
                <div class="input-group">
                  <span class="input-group-text"
                    ><i class="bi bi-x-diamond-fill"></i
                  ></span>
                  <input
                    type="text"
                    class="form-control"
                    id="design"
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
        <router-link to="/designs" class="btn btn-danger">Cancelar</router-link>
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
      let design = {
        design: {
          name: this.name,
        },
      };
      design.user = this.$store.state.user.id;
      if (this.type === "new") {
        this.createDesign(design);
      } else {
        this.updateDesign(design);
      }
    },
    createDesign(design) {
      axios
        .post(`${API_URL}/designs`, design)
        .then(async (response) => {
          console.log(response);
          toast.success("Diseño creado exitosamente");
          // Esperar 2 segundos antes de redirigir a "/brands"
          await new Promise(resolve => setTimeout(resolve, 2000));
          this.$router.push("/designs");
        })
        .catch(async (error) => {
          console.log(error);
          toast.error("Error al crear el diseño");
          // Esperar 2 segundos antes de redirigir a "/brands"
          await new Promise(resolve => setTimeout(resolve, 2000));
        });
    },
    updateDesign(design) {
      const designId = this.$route.params.id;
      axios
        .put(`${API_URL}/designs/${designId}`, design)
        .then(async (response) => {
          console.log(response);
          toast.success("Diseño actualizado exitosamente");
          // Esperar 2 segundos antes de redirigir a "/brands"
          await new Promise(resolve => setTimeout(resolve, 2000));
          this.$router.push("/designs");
        })
        .catch(async (error) => {
          console.log(error);
          toast.error("Error al actualizar el diseño");
          // Esperar 2 segundos antes de redirigir a "/brands"
          await new Promise(resolve => setTimeout(resolve, 2000));
        });
    },
    fetchDesignData(designId) {
      axios
        .get(`${API_URL}/designs/${designId}`)
        .then((response) => {
          const designData = response.data;
          this.name = designData.name;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.$state.navbarTitle = "Agregar Nuevo Diseño";
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
