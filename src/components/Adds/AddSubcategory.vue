<template>
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />

  <div class="container">
    <form @submit.prevent="onCreateSubcategory">
      <div class="table-responsive">
        <table class="table table-bordered table-secondary">
          <tbody>
            <tr>
              <td class="table-label">Ingrese el nombre de la subcategoría:</td>
              <td class="table-input">
                <input type="text" class="form-control" id="subcategory" v-model="name" :disabled="isReadOnly" />
              </td>
            </tr>
            <tr>
              <td class="table-label">
                Seleccione la categoría a la que se asociará esta subcategoría:
              </td>
              <td class="table-input">
                <select class="form-control" id="category" v-model="category" :disabled="isReadOnly">
                  <option value="" disabled selected>
                    Seleccione una categoría
                  </option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
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
        <router-link to="/subcategories" class="btn btn-danger">Cancelar</router-link>
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
      category: "",
      categories: [],
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
  mounted() {
    this.$state.navbarTitle = "Agregar Nueva Subcategoría";
    axios
      .get(API_URL + "/categories")
      .then((response) => {
        this.categories = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
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
    onCreateSubcategory() {
      let subcategory = {
        subcategory: {
          name: this.name,
          category_id: this.category,
        },
      };
      subcategory.user = this.$store.state.user.id;
      if (this.type === "new") {
        this.createSubcategory(subcategory);
      } else {
        this.updateSubcategory(subcategory);
      }
    },
    createSubcategory(subcategory) {
      axios
        .post(API_URL + "/subcategories", subcategory)
        .then((response) => {
          console.log(response);
          toast.success("Subcategoría creada exitosamente");
          this.$router.push("/subcategories");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error al crear la subcategoría");
        });
    },
    updateSubcategory(subcategory) {
      const subcategoryId = this.$route.params.id;
      axios
        .put(`${API_URL}/subcategories/${subcategoryId}`, subcategory)
        .then((response) => {
          console.log(response);
          toast.success("Subcategoría actualizada exitosamente");
          this.$router.push("/subcategories");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error al actualizar la subcategoría");
        });
    },
    fetchSubcategoryData(subcategoryId) {
      axios
        .get(`${API_URL}/subcategories/${subcategoryId}`)
        .then((response) => {
          const subcategoryData = response.data;
          this.name = subcategoryData.name;
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

<!--
Componente para agregar subcategorías

**Template:**

- `<input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange">`: Es un checkbox que se utiliza para controlar el estado del menú desplegable. Su estado está vinculado a la propiedad `checked` utilizando `v-model`, y cuando cambia, se invoca el método `handleCheckboxChange`.

- `<div class="container">`: Es un contenedor que envuelve el formulario para agregar o editar una subcategoría.

- `<form @submit.prevent="onCreateSubcategory">`: Es un formulario que se utiliza para agregar o editar una subcategoría. Se invoca el método `onCreateSubcategory` cuando se envía el formulario.

- `<table class="table table-bordered table-secondary">`: Es una tabla que muestra los campos de la subcategoría que se pueden editar.

- `<tr>`: Representa una fila en la tabla.

- `<td class="table-label">`: Representa una celda de etiqueta en la tabla.

- `<td class="table-input">`: Representa una celda de entrada en la tabla.

- `<input type="text" class="form-control" id="subcategory" v-model="name" :disabled="isReadOnly">`: Es un campo de entrada de texto que está vinculado a la propiedad `name` utilizando `v-model`. El atributo `:disabled` se establece dinámicamente según el valor de `isReadOnly`.

- `<select class="form-control" id="category" v-model="category" :disabled="isReadOnly">`: Es un campo de selección que muestra las categorías disponibles. Está vinculado a la propiedad `category` utilizando `v-model`. El atributo `:disabled` se establece dinámicamente según el valor de `isReadOnly`.

- `<option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>`: Genera opciones dinámicas para el campo de selección de categoría utilizando un bucle `v-for`. Cada opción tiene un valor basado en el ID de la categoría y muestra el nombre de la categoría.

**Script:**

- `import { mapState, mapMutations } from "vuex";`: Importa las funciones `mapState` y `mapMutations` de Vuex para mapear el estado y las mutaciones del store a las propiedades y métodos del componente.

- `import axios from "axios";`: Importa Axios, una biblioteca para realizar solicitudes HTTP.

- `import { API_URL } from "@/config";`: Importa la URL de la API desde el archivo de configuración.

- `import { toast } from "vue3-toastify";`: Importa la función `toast` de la biblioteca vue3-toastify para mostrar notificaciones en el formulario.

- `import "vue3-toastify/dist/index.css";`: Importa los estilos CSS de vue3-toastify.

- `data() { return { ... } }`: Define los datos del componente. Inicializa las propiedades `name` y `category` como cadenas vacías, `categories` como un array vacío, `isReadOnly` como falso y `type` como una cadena vacía.

- `created() { ... }`: Se ejecuta cuando se crea el componente. Obtiene el parámetro de ID de la URL y establece `type` en "edit" si existe el parámetro. Luego, llama al método `fetchSubcategoryData` para obtener los datos de la subcategoría o establece `isReadOnly` en falso y `type` en "new" si no hay un ID de subcategoría en la URL.

- `mounted() { ... }`: Se ejecuta cuando el componente está montado en el DOM. Establece el título de la barra de navegación y realiza una solicitud HTTP para obtener las categorías disponibles y almacenarlas en la propiedad `categories`.

- `computed: { ... }`: Define las propiedades computadas del componente. Incluye la propiedad `checked` que obtiene y establece el valor del checkbox principal utilizando `mapState`.

- `methods: { ... }`: Define los métodos del componente.

El método `handleCheckboxChange` invoca la mutación `toggleCheckboxValue` cuando el estado del checkbox principal cambia. El método `onCreateSubcategory` se ejecuta cuando se envía el formulario y guarda o actualiza la subcategoría en la API utilizando las solicitudes HTTP correspondientes.

os métodos `createSubcategory`, `updateSubcategory` y `fetchSubcategoryData` se utilizan para interactuar con la API y manejar las respuestas.

**Estilos:**

- `.container`: Establece el ancho máximo y el margen del contenedor del formulario.

- `.table`: Establece el ancho de la tabla y el margen inferior.

- `.table-bordered`: Define el estilo de las celdas de la tabla con bordes colapsados y un color de borde específico.

- `.table-label`: Establece el ancho de las celdas de etiqueta en la tabla y el color de borde.

- `.table-input`: Establece el estilo de las celdas de entrada en la tabla, incluido el relleno y el color de borde.
-->