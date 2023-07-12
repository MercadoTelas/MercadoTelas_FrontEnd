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
              <td class="table-label">Nombre de la categoría:</td>
              <td class="table-input" colspan="5">
                <div class="input-group">
                  <span class="input-group-text"
                    ><i class="bi bi-tag-fill"></i
                  ></span>
                  <input
                    type="text"
                    class="form-control"
                    id="category"
                    name="category"
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
        <router-link to="/categories" class="btn btn-danger"
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
      let category = {
        category: {
          name: this.name,
        },
      };
      category.user = this.$store.state.user.id;
      if (this.type === "new") {
        this.createCategory(category);
      } else {
        this.updateCategory(category);
      }
    },
    createCategory(category) {
      axios
        .post(`${API_URL}/categories`, category)
        .then(async (response) => {
          console.log(response);
          toast.success("Categoría creada exitosamente", { timeout: 2000 });
          // Esperar 2 segundos antes de redirigir a "/brands"
          await new Promise(resolve => setTimeout(resolve, 2000));
          this.$router.push("/categories");
        })
        .catch(async (error) => {
          console.log(error);
          toast.error("Error al crear la categoría", { closeOnClick: false });
          // Esperar 2 segundos antes de redirigir a "/brands"
          await new Promise(resolve => setTimeout(resolve, 2000));
        });
    },
    updateCategory(category) {
      const categoryId = this.$route.params.id;
      axios
        .put(`${API_URL}/categories/${categoryId}`, category)
        .then(async (response) => {
          console.log(response);
          toast.success("Categoría actualizada exitosamente", {
            timeout: 5000,
          });
          // Esperar 2 segundos antes de redirigir a "/brands"
          await new Promise(resolve => setTimeout(resolve, 2000));
          this.$router.push("/categories");
        })
        .catch(async (error) => {
          console.log(error);
          toast.error("Error al actualizar la categoría", {
            closeOnClick: false,
          });
          // Esperar 2 segundos antes de redirigir a "/brands"
          await new Promise(resolve => setTimeout(resolve, 2000));
        });
    },
    fetchCategoryData(categoryId) {
      axios
        .get(`${API_URL}/categories/${categoryId}`)
        .then((response) => {
          const categoryData = response.data;
          this.name = categoryData.name;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.$state.navbarTitle = "Agregar Nueva Categoría";
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
}
</style>
