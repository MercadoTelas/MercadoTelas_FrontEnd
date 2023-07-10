<template>
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />

  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <form @submit.prevent="OnCreateUser">
          <div class="form-group">
            <label for="nombre">Nombre Completo:</label>
            <input type="text" class="form-control" v-model="name" required>
          </div>
          <div class="form-group">
            <label for="id_card">Cédula:</label>
            <input type="text" class="form-control" v-model="idCard" required>
          </div>
          <div class="form-group">
            <label for="correo">Correo Electrónico:</label>
            <input type="email" class="form-control" v-model="email" required>
          </div>
          <div class="form-group">
            <label for="role">Rol:</label>
            <select class="form-control" v-model="role" required>
              <option value="" disabled selected>Seleccionar rol</option>
              <option value="admin">Administrador</option>
              <option value="user">Usuario Regular</option>
            </select>
          </div>
          <br>
          <button type="submit" class="btn btn-primary">Registrar Usuario</button>
          <router-link to="/users" class="btn btn-danger">Cancelar</router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { API_URL } from '@/config';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  data() {
    return {
      name: '',
      idCard: '',
      email: '',
      role: '',
      current_user_id: ''
    };
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
    OnCreateUser() {
      const user = {
        name: this.name,
        id_card: this.idCard,
        email: this.email,
        role: this.role
      };
      axios.post(`${API_URL}/users`, { user, creator_user_id: this.current_user_id })
        .then(() => {
          toast.success(`El usuario ha sido registrado exitosamente`, {
            position: 'bottom-right',
            timeout: 2000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
          }).then(() => {
            this.name = '';
            this.idCard = '';
            this.email = '';
            this.role = '';
          });
        })
        .catch((error) => {
          console.log(error);
          toast.error(`Error al registrar el usuario`, {
            position: 'bottom-right',
            timeout: 2000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
          });
        });
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Registro de usuario';
    this.current_user_id = this.$store.state.user.id;
  },
};
</script>

<style scoped>
#check:checked~.container {
  padding-left: 345px;
  max-width: 1800px;
}

.container {
  margin-top: 50px;
}

.btn {
  margin-right: 5px;
}
</style>

<!--

  Componente para el registro de nuevos usuarios

Estructura del Template
-----------------------

El bloque `<template>` define la estructura del componente utilizando elementos HTML y directivas de Vue.js. A continuación se explica cada elemento en el componente:

- `<input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />`: Checkbox que utiliza la directiva `v-model` para vincular su estado al valor `checked` en el componente. También utiliza el evento `@change` para invocar el método `handleCheckboxChange` cuando se cambia el estado del checkbox.

- `<div class="container">`: Contenedor principal del formulario.

- `<div class="row justify-content-center">`: Contenedor de fila que utiliza flexbox para centrar el contenido horizontalmente.

- `<div class="col-md-8">`: Columna que ocupa 8 columnas en la rejilla Bootstrap.

- `<form @submit.prevent="OnCreateUser">`: Formulario que se envía cuando se realiza un envío. Invoca el método `OnCreateUser` cuando se envía el formulario.

- `<div class="form-group">`: Contenedor para cada campo de entrada del formulario.

- `<label for="nombre">Nombre Completo:</label>`: Etiqueta para el campo de entrada del nombre completo.

- `<input type="text" class="form-control" v-model="name" required>`: Campo de entrada de texto para el nombre completo. Utiliza la directiva `v-model` para vincular su valor a la propiedad `name` en el componente. También tiene el atributo `required` para requerir entrada del usuario.

- `<label for="id_card">Cédula:</label>`: Etiqueta para el campo de entrada de la cédula.

- `<input type="text" class="form-control" v-model="idCard" required>`: Campo de entrada de texto para la cédula. Utiliza la directiva `v-model` para vincular su valor a la propiedad `idCard` en el componente. También tiene el atributo `required` para requerir entrada del usuario.

- `<label for="correo">Correo Electrónico:</label>`: Etiqueta para el campo de entrada del correo electrónico.

- `<input type="email" class="form-control" v-model="email" required>`: Campo de entrada de texto para el correo electrónico. Utiliza la directiva `v-model` para vincular su valor a la propiedad `email` en el componente. También tiene el atributo `required` para requerir entrada del usuario.

- `<label for="role">Rol:</label>`: Etiqueta para el campo de selección del rol.

- `<select class="form-control" v-model="role" required>`: Campo de selección para el rol. Utiliza la directiva `v-model` para vincular su valor a la propiedad `role` en el componente. También tiene el atributo `required` para requerir selección del usuario.

- `<option value="" disabled selected>Seleccionar rol</option>`: Opción deshabilitada y seleccionada por defecto para el campo de selección del rol.

- `<option value="admin">Administrador</option>`: Opción para seleccionar el rol de Administrador.

- `<option value="user">Usuario Regular</option>`: Opción para seleccionar el rol de Usuario Regular.

- `<button type="submit" class="btn btn-primary">Registrar Usuario</button>`: Botón de envío del formulario. Utiliza las clases de Bootstrap para aplicar estilos.

- `<router-link to="/users" class="btn btn-danger">Cancelar</router-link>`: Enlace de enrutamiento a la ruta "/users" que se muestra como un botón de cancelación. Utiliza las clases de Bootstrap para aplicar estilos.

Estructura del Script
---------------------

El bloque `<script>` contiene la lógica del componente y define los datos y métodos utilizados en el template. A continuación se explica cada sección del script:

- `import { mapState, mapMutations } from "vuex";`: Importa las funciones `mapState` y `mapMutations` del módulo `vuex` para utilizar el estado global y las mutaciones en el componente.

- `import { API_URL } from '@/config';`: Importa la variable `API_URL` desde el módulo de configuración.

- `import axios from 'axios';`: Importa el módulo `axios` para realizar solicitudes HTTP.

- `import { toast } from 'vue3-toastify';`: Importa el módulo `toast` de 'vue3-toastify' para mostrar notificaciones.

- `data()`: Método que devuelve un objeto con los datos del componente.

  - `name`: Propiedad que almacena el valor del nombre completo del usuario.

  - `idCard`: Propiedad que almacena el valor de la cédula del usuario.

  - `email`: Propiedad que almacena el valor del correo electrónico del usuario.

  - `role`: Propiedad que almacena el valor del rol del usuario.

  - `current_user_id`: Propiedad que almacena el ID del usuario actualmente autenticado.

- `computed`: Sección que contiene los computeds utilizados en el componente.

  - `...mapState(["checkboxValue"])`: Obtiene el valor del checkbox del estado global utilizando la función `mapState`.

  - `checked`: Computed que obtiene el valor del checkbox. Utiliza la función `get` para obtener el valor del checkbox del estado global.

- `methods`: Sección que contiene los métodos utilizados en el componente.

  - `...mapMutations(["toggleCheckboxValue"])`: Obtiene la mutación `toggleCheckboxValue` del estado global utilizando la función `mapMutations`.

  - `handleCheckboxChange()`: Método que se invoca cuando se cambia el estado del checkbox. Invoca la mutación `toggleCheckboxValue` para actualizar el estado global del checkbox.

  - `OnCreateUser()`: Método que se invoca cuando se envía el formulario de registro de usuario. Crea un objeto `user` con los datos del usuario, realiza una solicitud POST a la API para crear el usuario y muestra una notificación de éxito o error según el resultado.

- `mounted()`: Gancho de ciclo de vida que se ejecuta después de que el componente se ha montado en el DOM. Establece el título de la barra de navegación y obtiene el ID del usuario actualmente autenticado desde el estado global.

Estilos CSS
-----------

El bloque `<style scoped>` contiene estilos CSS para dar formato al componente. Los estilos están definidos dentro del atributo `scoped`, lo que significa que solo se aplican al componente actual y no se propagan a otros componentes. A continuación se explica cada estilo:

- `#check:checked ~ .container`: Estilo que ajusta el espacio del contenedor principal cuando el checkbox está marcado. Utiliza el selector `~` para seleccionar el contenedor principal hermano del checkbox.

- `.container`:

El código que proporcionaste es otro componente de Vue.js. A continuación se muestra una descripción de cada elemento y estilo en el código:

Estructura del Template
-----------------------

El bloque `<template>` define la estructura del componente utilizando elementos HTML y directivas de Vue.js. A continuación se explica cada elemento en el componente:

- `<input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />`: Checkbox que utiliza la directiva `v-model` para vincular su estado al valor `checked` en el componente. También utiliza el evento `@change` para invocar el método `handleCheckboxChange` cuando se cambia el estado del checkbox.

- `<div class="container">`: Contenedor principal del formulario.

- `<div class="row justify-content-center">`: Contenedor de fila que utiliza flexbox para centrar el contenido horizontalmente.

- `<div class="col-md-8">`: Columna que ocupa 8 columnas en la rejilla Bootstrap.

- `<form @submit.prevent="OnCreateUser">`: Formulario que se envía cuando se realiza un envío. Invoca el método `OnCreateUser` cuando se envía el formulario.

- `<div class="form-group">`: Contenedor para cada campo de entrada del formulario.

- `<label for="nombre">Nombre Completo:</label>`: Etiqueta para el campo de entrada del nombre completo.

- `<input type="text" class="form-control" v-model="name" required>`: Campo de entrada de texto para el nombre completo. Utiliza la directiva `v-model` para vincular su valor a la propiedad `name` en el componente. También tiene el atributo `required` para requerir entrada del usuario.

- `<label for="id_card">Cédula:</label>`: Etiqueta para el campo de entrada de la cédula.

- `<input type="text" class="form-control" v-model="idCard" required>`: Campo de entrada de texto para la cédula. Utiliza la directiva `v-model` para vincular su valor a la propiedad `idCard` en el componente. También tiene el atributo `required` para requerir entrada del usuario.

- `<label for="correo">Correo Electrónico:</label>`: Etiqueta para el campo de entrada del correo electrónico.

- `<input type="email" class="form-control" v-model="email" required>`: Campo de entrada de texto para el correo electrónico. Utiliza la directiva `v-model` para vincular su valor a la propiedad `email` en el componente. También tiene el atributo `required` para requerir entrada del usuario.

- `<label for="role">Rol:</label>`: Etiqueta para el campo de selección del rol.

- `<select class="form-control" v-model="role" required>`: Campo de selección para el rol. Utiliza la directiva `v-model` para vincular su valor a la propiedad `role` en el componente. También tiene el atributo `required` para requerir selección del usuario.

- `<option value="" disabled selected>Seleccionar rol</option>`: Opción deshabilitada y seleccionada por defecto para el campo de selección del rol.

- `<option value="admin">Administrador</option>`: Opción para seleccionar el rol de Administrador.

- `<option value="user">Usuario Regular</option>`: Opción para seleccionar el rol de Usuario Regular.

- `<button type="submit" class="btn btn-primary">Registrar Usuario</button>`: Botón de envío del formulario. Utiliza las clases de Bootstrap para aplicar estilos.

- `<router-link to="/users" class="btn btn-danger">Cancelar</router-link>`: Enlace de enrutamiento a la ruta "/users" que se muestra como un botón de cancelación. Utiliza las clases de Bootstrap para aplicar estilos.

Estructura del Script
---------------------

El bloque `<script>` contiene la lógica del componente y define los datos y métodos utilizados en el template. A continuación se explica cada sección del script:

- `import { mapState, mapMutations } from "vuex";`: Importa las funciones `mapState` y `mapMutations` del módulo `vuex` para utilizar el estado global y las mutaciones en el componente.

- `import { API_URL } from '@/config';`: Importa la variable `API_URL` desde el módulo de configuración.

- `import axios from 'axios';`: Importa el módulo `axios` para realizar solicitudes HTTP.

- `import { toast } from 'vue3-toastify';`: Importa el módulo `toast` de 'vue3-toastify' para mostrar notificaciones.

- `export default { ... }`: Exporta el objeto que define el componente.

- `data() { ... }`: Método que devuelve un objeto con los datos del componente.

  - `name`: Propiedad que almacena el valor del nombre completo del usuario.

  - `idCard`: Propiedad que almacena el valor de la cédula del usuario.

  - `email`: Propiedad que almacena el valor del correo electrónico del usuario.

  - `role`: Propiedad que almacena el valor del rol del usuario.

  - `current_user_id`: Propiedad que almacena el ID del usuario actualmente autenticado.

- `computed: { ... }`: Sección que contiene los computeds utilizados en el componente.

  - `...mapState(["checkboxValue"])`: Obtiene el valor del checkbox del estado global utilizando la función `mapState`.

  - `checked`: Computed que obtiene el valor del checkbox. Utiliza la función `get` para obtener el valor del checkbox del estado global.

- `methods: { ... }`: Sección que contiene los métodos utilizados en el componente.

  - `...mapMutations(["toggleCheckboxValue"])`: Obtiene la mutación `toggleCheckboxValue` del estado global utilizando la función `mapMutations`.

  - `handleCheckboxChange() { ... }`: Método que se invoca cuando se cambia el estado del checkbox. Invoca la mutación `toggleCheckboxValue` para actualizar el estado global del checkbox.

  - `OnCreateUser() { ... }`: Método que se invoca cuando se envía el formulario de registro de usuario. Crea un objeto `user` con los datos del usuario, realiza una solicitud POST a la API para crear el usuario y muestra una notificación de éxito o error según el resultado.

- `mounted() { ... }`: Gancho de ciclo de vida que se ejecuta después de que el componente se ha montado en el DOM. Establece el título de la barra de navegación y obtiene el ID del usuario actualmente autenticado desde el estado global.

Estilos CSS
-----------

El bloque `<style scoped>` contiene estilos CSS para dar formato al componente. Los estilos están definidos dentro del atributo `scoped`, lo que significa que solo se aplican al componente actual y no se propagan a otros componentes. A continuación se explica cada estilo:

-->