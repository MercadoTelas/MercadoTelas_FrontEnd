<template>
  <div class="container">
    <form @submit.prevent="onCreateDesign">
      <div class="table-responsive">
        <table class="table table-bordered">
          <tbody>
            <tr>
              <td class="table-label">Ingrese el nombre del diseño:</td>
              <td class="table-input">
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-x-diamond-fill"></i></span>
                <input type="text" class="form-control" id="design" v-model="name" :disabled="isReadOnly">
              </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary" type="submit" v-if="!isReadOnly">Guardar cambios</button>
        <router-link to="/designs" class="btn btn-danger">Cancelar</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/config';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  data() {
    return {
      name: '',
      isReadOnly: false
    };
  },
  methods: {
    onCreateDesign() {
      const design = {
        design: {
          name: this.name
        }
      };
      axios.post(API_URL + '/designs', design).then(response => {
        // Mostrar Toast de éxito
      toast.success('Diseño agregado correctamente', {
        autoClose: 2000, // Duración en milisegundos
      });
        console.log(response);
        this.$router.go(-1);
      }).catch(error => {
        toast.error('Error al agregar el Diseño', {
        autoClose: 2000, // Duración en milisegundos
      });
        console.log(error);
      });
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Agregar Nuevo Diseño';
  },
};
</script>

<style scoped>
.container {
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
