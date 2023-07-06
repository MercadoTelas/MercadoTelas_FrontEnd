<template>
  <div class="container">
    <form @submit.prevent="onBrandCreate">
      <div class="table-responsive">
        <table class="table table-bordered">
          <tbody>
            <tr>
              <td class="table-label">Nombre de la marca:</td>
              <td class="table-input" colspan="5">
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-medium"></i></span>
                  <input type="text" class="form-control" id="brand" name="brand" v-model="name" :disabled="isReadOnly">
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary" type="submit" v-if="!isReadOnly">Guardar cambios</button>
        <router-link to="/brands" class="btn btn-danger">Cancelar</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from "sweetalert2";
import { API_URL } from '@/config'

export default {
  data() {
    return {
      name: '',
      isReadOnly: false
    };
  },
  methods: {
    onBrandCreate() {
      const brand = {
        brand: {
          name: this.name
        }
      };
      axios.post(API_URL + '/brands', brand).then(response => {
        Swal.fire({
          title: 'Marca creada exitosamente',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
        console.log(response);
        this.$router.go(-1);
      }).catch(error => {
        Swal.fire({
          title: 'Error al crear la marca',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        });
        console.log(error);
      });
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Agregar Nueva Marca';
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
  