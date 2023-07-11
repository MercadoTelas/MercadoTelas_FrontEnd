<template>
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />

  <div class="container">
    <form @submit.prevent="onSubmit">
      <div class="table-responsive">
        <table class="table table-bordered table-secondary">
          <tbody>
            <tr>
              <td class="table-label">Ingrese el nombre de la bodega:</td>
              <td class="table-input">
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-box-seam-fill"></i></span>
                  <input type="text" class="form-control" id="warehouse" name="warehouse" v-model="name"
                    :disabled="isReadOnly" />
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
        <router-link to="/warehouses" class="btn btn-danger">Cancelar</router-link>
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
        .then((response) => {
          console.log(response);
          toast.success("Bodega creada exitosamente");
          this.$router.push("/warehouses");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error al crear la bodega");
        });
    },
    updateWarehouse(warehouse) {
      const warehouseId = this.$route.params.id;
      axios
        .put(`${API_URL}/warehouses/${warehouseId}`, warehouse)
        .then((response) => {
          console.log(response);
          toast.success("Bodega actualizada exitosamente");
          this.$router.push("/warehouses");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error al actualizar la bodega");
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

<!--
Componente para agregar bodegas

**Template:**

- `<input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange">`: Es un checkbox que se utiliza para controlar el estado del menú desplegable. Su estado está vinculado a la propiedad `checked` utilizando `v-model`, y cuando cambia, se invoca el método `handleCheckboxChange`.

- `<div class="container">`: Es un contenedor que envuelve el formulario para agregar o editar una bodega.

- `<form @submit.prevent="onSubmit">`: Es un formulario que se utiliza para agregar o editar una bodega. Se invoca el método `onSubmit` cuando se envía el formulario.

- `<table class="table table-bordered table-secondary">`: Es una tabla que muestra los campos de la bodega que se pueden editar.

- `<tr>`: Representa una fila en la tabla.

- `<td class="table-label">`: Representa una celda de etiqueta en la tabla.

- `<td class="table-input">`: Representa una celda de entrada en la tabla.

- `<input type="text" class="form-control" id="warehouse" name="warehouse" v-model="name" :disabled="isReadOnly">`: Es un campo de entrada de texto que está vinculado a la propiedad `name` utilizando `v-model`. El atributo `:disabled` se establece dinámicamente según el valor de `isReadOnly`.

**Script:**

- `import { mapState, mapMutations } from "vuex";`: Importa las funciones `mapState` y `mapMutations` de Vuex para mapear el estado y las mutaciones del store a las propiedades y métodos del componente.

- `import axios from "axios";`: Importa Axios, una biblioteca para realizar solicitudes HTTP.

- `import { API_URL } from "@/config";`: Importa la URL de la API desde el archivo de configuración.

- `import { toast } from "vue3-toastify";`: Importa la función `toast` de la biblioteca vue3-toastify para mostrar notificaciones en el formulario.

- `import "vue3-toastify/dist/index.css";`: Importa los estilos CSS de vue3-toastify.

- `data() { return { ... } }`: Define los datos del componente. Inicializa las propiedades `name` como una cadena vacía, `isReadOnly` como falso y `type` como una cadena vacía.

- `created() { ... }`: Se ejecuta cuando se crea el componente. Obtiene el parámetro de ID de la URL y establece `type` en "edit" si existe el parámetro. Luego, llama al método `fetchWarehouseData` para obtener los datos de la bodega o establece `isReadOnly` en falso y `type` en "new" si no hay un ID de bodega en la URL.

- `mounted() { ... }`: Se ejecuta cuando el componente está montado en el DOM. Establece el título de la barra de navegación.

- `computed: { ... }`: Define las propiedades computadas del
componente. Incluye la propiedad `checked` que obtiene y establece el valor del checkbox principal utilizando `mapState`.

- `methods: { ... }`: Define los métodos del componente.

El método `handleCheckboxChange` invoca la mutación `toggleCheckboxValue` cuando el estado del checkbox principal cambia.

El método `onSubmit` se ejecuta cuando se envía el formulario y guarda o actualiza la bodega en la API utilizando las solicitudes HTTP correspondientes.

Los métodos `createWarehouse`, `updateWarehouse` y `fetchWarehouseData` se utilizan para interactuar con la API y manejar las respuestas.

**Estilos:**

- `.container`: Establece el ancho máximo y el margen del contenedor del formulario.

- `.table`: Establece el ancho de la tabla y el margen inferior.

- `.table-bordered`: Define el estilo de las celdas de la tabla con bordes colapsados y un color de borde específico.

- `.table-label`: Establece el ancho de las celdas de etiqueta en la tabla y el color de borde.

- `.table-input`: Establece el estilo de las celdas de entrada en la tabla, incluido el relleno y el color de borde.

- `.btn-primary`: Establece el margen izquierdo del botón primario.
-->
