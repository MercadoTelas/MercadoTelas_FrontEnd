<template>
  <div class="container">
    <form @submit.prevent="onCreateSubcategory">
      <div class="table-responsive">
        <table class="table table-bordered table-secondary">
          <tbody>
            <tr>
              <td class="table-label">Ingrese el nombre de la subcategoría:</td>
              <td class="table-input">
                <input type="text" class="form-control" id="subcategory" v-model="name" :disabled="isReadOnly">
              </td>
            </tr>
            <tr>
              <td class="table-label">Seleccione la categoría a la que se asociará esta subcategoría:</td>
              <td class="table-input">
                <select class="form-control" id="category" v-model="category" :disabled="isReadOnly">
                  <option value="" disabled selected>Seleccione una categoría</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}
                  </option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary" type="submit" v-if="!isReadOnly">Guardar cambios</button>
        <button class="btn btn-danger" type="submit" v-if="isReadOnly">Volver</button>
        <router-link to="/subcategories" class="btn btn-danger">Cancelar</router-link>
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
      category: '',
      categories: [],
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
  mounted() {
    this.$state.navbarTitle = 'Agregar Nueva Subcategoría';
    axios.get(API_URL + '/categories').then(response => {
      this.categories = response.data;
    }).catch(error => {
      console.log(error);
    });
  },
  methods: {
    onCreateSubcategory() {
      let subcategory = {
        subcategory: {
          name: this.name,
          category_id: this.category
        }
      };
      subcategory.user = this.$store.state.user.id;
      axios.post(API_URL + '/subcategories', subcategory).then(response => {
        // Mostrar Toast de éxito
        toast.success('Subcategoría agregada correctamente', {
          autoClose: 2000, // Duración en milisegundos
        });
        console.log(response);
      }).catch(error => {
        toast.error('Error al agregar la Subcategoría', {
          autoClose: 2000, // Duración en milisegundos
        });
        const errors = error.response.data;
        console.log(errors);
      });
    },
    methods: {
      fetchSubcategoryData(subcategoryId) {
        axios.get(`${API_URL}/subcategories/${subcategoryId}`)
          .then(response => {
            const subcategoryData = response.data;
            this.name = subcategoryData.name;
            // Asigna otros datos de la subcategoría a las propiedades correspondientes si es necesario
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
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
</style>