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
    createBrand(brand) {
      axios
        .post(`${API_URL}/brands`, brand)
        .then((response) => {
          console.log(response);
          toast.success("Marca creada exitosamente", { timeout: 5000 });
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
        .then((response) => {
          console.log(response);
          toast.success("Marca actualizada exitosamente", {
            closeOnClick: false,
          });
          this.$router.push("/brands");
        })
        .catch((error) => {
          toast.error("Error al actualizar la marca", { closeOnClick: false });
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

<!--
Componente para agregar nuevas marcas

**Template:**

- `<input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange">`: Es un checkbox que se utiliza para controlar el estado del menú desplegable. Su estado está vinculado a la propiedad `checked` utilizando `v-model`, y cuando cambia, se invoca el método `handleCheckboxChange`.

- `<div class="container">`: Es un contenedor que envuelve el formulario para agregar o editar una marca.

- `<form @submit.prevent="onSubmit">`: Es un formulario que se utiliza para agregar o editar una marca. Se invoca el método `onSubmit` cuando se envía el formulario.

- `<table class="table table-bordered table-secondary">`: Es una tabla que muestra los campos de la marca que se pueden editar.

- `<tr>`: Representa una fila en la tabla.

- `<td class="table-label">`: Representa una celda de etiqueta en la tabla.

- `<td class="table-input" colspan="5">`: Representa una celda de entrada en la tabla que ocupa 5 columnas.

- `<input type="text" class="form-control" id="brand" name="brand" v-model="name" :disabled="isReadOnly">`: Es un campo de entrada de texto que está vinculado a la propiedad `name` utilizando `v-model`. El atributo `:disabled` se establece dinámicamente según el valor de `isReadOnly`.

**Script:**

- `import { mapState, mapMutations } from "vuex";`: Importa las funciones `mapState` y `mapMutations` de Vuex para mapear el estado y las mutaciones del store a las propiedades y métodos del componente.

- `import axios from "axios";`: Importa Axios, una biblioteca para realizar solicitudes HTTP.

- `import { API_URL } from "@/config";`: Importa la URL de la API desde el archivo de configuración.

- `import { toast } from "vue3-toastify";`: Importa la función `toast` de la biblioteca vue3-toastify para mostrar notificaciones en el formulario.

- `import "vue3-toastify/dist/index.css";`: Importa los estilos CSS de vue3-toastify.

- `data() { return { ... } }`: Define los datos del componente. Inicializa las propiedades `name` con una cadena vacía, `isReadOnly` como falso y `type` como una cadena vacía.

- `created() { ... }`: Se ejecuta cuando se crea el componente. Obtiene el parámetro de ID de la URL y establece `type` en "edit" si existe el parámetro. Luego, llama al método `fetchBrandData` para obtener los datos de la marca o establece `isReadOnly` en falso y `type` en "new" si no hay un ID de marca en la URL.

- `mounted() { ... }`: Se ejecuta después de que se haya montado el componente en el DOM. Establece el título de la barra de navegación en "Agregar Nueva Marca".

- `computed: { ... }`: Define las propiedades computadas del componente. Incluye la propiedad `checked` que obtiene y establece el valor del checkbox principal utilizando `mapState`.

- `methods: { ... }`: Define los métodos del componente.

El método `handleCheckboxChange` invoca la mutación
`toggleCheckboxValue` cuando el estado del checkbox principal
cambia.

El método `onSubmit` se ejecuta cuando se envía el formulario y guarda o actualiza la marca en la API utilizando las solicitudes HTTP correspondientes.

Los métodos `createBrand`, `updateBrand` y `fetchBrandData` se utilizan para interactuar con la API y manejar las respuestas.

**Estilos:**

- `.container`: Establece el ancho máximo y el margen del contenedor del formulario.

- `.table`: Establece el ancho de la tabla y el margen inferior.

- `.table-bordered`: Define el estilo de las celdas de la tabla con bordes colapsados y un color de borde específico.

- `.table-label`: Establece el ancho de las celdas de etiqueta en la tabla y el color de borde.

- `.table-input`: Establece el estilo de las celdas de entrada en la tabla, incluido el relleno y el color de borde.

- `.input-group`: Define el estilo del grupo de entrada, incluida la alineación y el ancho.

- `.input-group-text`: Establece el estilo del texto del grupo de entrada, incluido el relleno, el tamaño de fuente y el color.
-->