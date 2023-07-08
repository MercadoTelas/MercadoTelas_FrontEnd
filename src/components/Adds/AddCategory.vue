<template>
  <div class="container">
    <form @submit.prevent="onCategoryCreate">
      <div class="table-responsive">
        <table class="table table-bordered table-secondary">
          <tbody>
            <tr>
              <td class="table-label">Nombre de la categoría:</td>
              <td class="table-input" colspan="5">
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-tag-fill"></i></span>
                  <input type="text" class="form-control" id="category" name="category" v-model="name"
                    :disabled="isReadOnly">
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary" type="submit" v-if="!isReadOnly">Guardar cambios</button>
        <button class="btn btn-danger" type="submit" v-if="isReadOnly">Volver</button>
        <router-link to="/categories" class="btn btn-danger">Cancelar</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/config'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  data() {
    return {
      name: '',
      isReadOnly: false
    };
  },
  created() {
    const idParam = this.$route.params.id;
    if (idParam) {
      this.fetchCategoryData(idParam);
    } else {
      this.isReadOnly = false;
    }
  },
  methods: {
    onCategoryCreate() {
      const category = {
        category: {
          name: this.name
        }
      };
      axios.post(API_URL + '/categories', category).then(response => {
        // Mostrar Toast de éxito
        toast.success('Categoría añadida correctamente', {
          autoClose: 2000, // Duración en milisegundos
        });
        console.log(response);

      }).catch(error => {
        // Show error message
        toast.error('Error al agregar la Categoría', {
          autoClose: 2000, // Duración en milisegundos
        });
        // Shows why the error was thrown using sweetalert2
        const errors = error.response.data;
        console.log(errors);

      });
    },
    fetchCategoryData(categoryId) {
      axios.get(`${API_URL}/categories/${categoryId}`)
        .then(response => {
          const categoryData = response.data;
          this.name = categoryData.name;
          // Asigna otros datos de la categoría a las propiedades correspondientes si es necesario
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Agregar Nueva Categoría';
  },
};
</script>

<style scoped>
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
