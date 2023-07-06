<template>
  <div class="container">
    <form @submit.prevent="onCreateWarehouse">
      <div class="table-responsive">
        <table class="table table-bordered">
          <tbody>
            <tr>
              <td class="table-label">Ingrese el nombre de la bodega:</td>
              <td class="table-input">
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-box-seam-fill"></i></span>
                <input type="text" class="form-control" id="warehouse" name="warehouse" v-model="name" :disabled="isReadOnly">
              </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary" type="submit" v-if="!isReadOnly">Guardar cambios</button>
        <router-link to="/warehouses" class="btn btn-danger">Cancelar</router-link>
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
    onCreateWarehouse(){
      const warehouse = {
        warehouse: {
          name: this.name
        }
      };
      axios.post(API_URL + '/warehouses', warehouse).then(response => {
        Swal.fire({
          title: 'Bodega creada exitosamente',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
        console.log(response);
      }).catch(error => {
        Swal.fire({
          title: 'Error al crear la bodega',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        });
        console.log(error.response.data);
      });
    },
  }, 
  mounted() {
    this.$state.navbarTitle = 'Agregar Nueva Bodega';
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
