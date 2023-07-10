<template>
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />

  <div class="container">
    <form @submit.prevent="changePassword">
      <div class="row">
        <div id="contentDiv" class="col-md-6 mt-8">
          <div class="d-flex justify-content-center" style="width: 600px">
            <h3 style="width: fit-content; margin: 0 auto">
              Hola de nuevo, {{ user.name }}
            </h3>
          </div>

          <legend style="margin-top: 50px; padding-left: 100px; width: fit-content">
            Información de la cuenta
          </legend>

          <div class="form-group mb-8">
            <label for="email" class="form-label">Correo electrónico</label>
            <input v-model="user.email" type="text" class="form-control" id="email" disabled style="width: 400px" />
          </div>

          <legend style="padding-left: 100px; width: fit-content">
            Cambio de contraseña
          </legend>
          <div class="form-group mt-5">
            <label for="currentPassword" class="form-label">Contraseña actual</label>
            <input v-model="current_password" type="password" class="form-control" id="currentPassword"
              style="width: 400px" />
          </div>
          <div class="form-group mt-3">
            <label for="newPassword" class="form-label">Nueva contraseña</label>
            <input v-model="new_password" type="password" class="form-control" id="newPassword" style="width: 400px" />
          </div>
          <div class="form-group mt-3">
            <label for="passwordConfirmation" class="form-label">Confirme su nueva contraseña</label>
            <input v-model="new_password_confirmation" type="password" class="form-control" id="passwordConfirmation"
              style="width: 400px" />
          </div>
          <div class="d-flex justify-content-center" style="width: 600px">
            <button id="changePassword" type="submit" class="form-button" style="margin-top: 30px"
              data-bs-toggle="tooltip" data-bs-placement="top">
              Confirmar cambio de contraseña
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import { API_URL } from "@/config";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


export default {
  name: "Perfil-Component",
  data() {
    return {
      user: "",
      sessionToken: "",
      current_password: "",
      new_password: "",
      new_password_confirmation: ""
    };
  },
  computed: {
    ...mapState(["checkboxValue"]),
    checked: {
      get() {
        return this.checkboxValue;
      }
    }
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.sessionToken = localStorage.getItem("sessionToken");
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    changePassword() {
      if (this.new_password === this.new_password_confirmation) {
        const config = {
          headers: { Authorization: `${this.token}` }
        };
        let data = {
          email: this.user.email,
          current_password: this.current_password,
          new_password: this.new_password,
          password_confirmation: this.new_password_confirmation
        };
        axios
          .put(`${API_URL}/users/password`, data, config)
          .then(response => {
            toast.success(`Contraseña actualizada`, {
              position: 'top-right',
              timeout: 2000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
            });

            console.log(response);
          })
          .catch(error => {
            toast.error(`No se pudo actualizar la contraseña`, {
              position: 'top-right',
              timeout: 2000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
            });

            console.log(error);
          });
      } else {
        toast.success(`Las contraseñas no coinciden`, {
          position: 'top-right',
          timeout: 2000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
        });

      }
    }
  }
};
</script>

<style lang="scss">
#check:checked~.container .row #contentDiv {
  margin-left: 345px;
}

.container .row {
  justify-content: center;
  align-items: center;
}

.form-group {
  width: fit-content;
}

.container .row .div h3 {
  text-align: center;
}

.form-button {
  height: 35px;
  border: none;
  background-color: #3066be;
  border-radius: 10px;
  color: #ffffff;
  width: 300px;
  text-align: center;
}
</style>

<!----
Componente para el manejo de la cuenta de usuario
--------------------------

Este componente representa un formulario de cambio de contraseña en una página de perfil de usuario. Proporciona una interfaz para que los usuarios ingresen su contraseña actual, nueva contraseña y confirmen la nueva contraseña.

Estructura del Template
-----------------------

El bloque `<template>` define la estructura del formulario utilizando elementos HTML.

- `<input>`: Representa un checkbox que permite a los usuarios activar o desactivar una opción. Utiliza la directiva `v-model` para enlazar su estado al valor de la propiedad `checked` en los datos del componente. También tiene un listener `@change` que invoca el método `handleCheckboxChange` cuando el estado del checkbox cambia.

- `<div class="container">`: Actúa como un contenedor principal para el formulario.

- `<form>`: Representa el formulario en sí. Utiliza la directiva `@submit.prevent` para prevenir el comportamiento de envío predeterminado y en su lugar activar el método `changePassword` definido en el componente cuando se envía el formulario.

- `<div class="row">`: Representa una fila dentro del formulario. Contiene los elementos relacionados con la información de la cuenta y el cambio de contraseña.

- `<div id="contentDiv" class="col-md-6 mt-8">`: Representa un div que actúa como un contenedor para los elementos del formulario. Tiene una clase de CSS `col-md-6` que establece su ancho y una clase de CSS `mt-8` que establece el margen superior.

- `<div class="d-flex justify-content-center" style="width: 600px">`: Representa un div con una clase de CSS que aplica estilos para centrar su contenido. También tiene un atributo de estilo en línea `style` que establece su ancho en 600px.

- `<h3 style="width: fit-content; margin: 0 auto">`: Representa un encabezado de nivel 3 que muestra un saludo personalizado al usuario. Utiliza la interpolación de Vue.js `{{ user.name }}` para mostrar el nombre del usuario.

- `<legend>`: Representa una leyenda para agrupar elementos relacionados. Se utiliza para mostrar "Información de la cuenta" y "Cambio de contraseña" respectivamente.

- `<div class="form-group mb-8">`: Representa un contenedor para un campo de entrada y una etiqueta relacionada. Utiliza una clase de CSS `form-group` para aplicar estilos y una clase de CSS `mb-8` para establecer el margen inferior.

- `<label for="email" class="form-label">`: Representa una etiqueta para el campo de entrada de correo electrónico. Utiliza el atributo `for` para vincularlo al campo de entrada mediante el ID.

- `<input v-model="user.email" type="text" class="form-control" id="email" disabled style="width: 400px">`: Representa un campo de entrada de texto para el correo electrónico del usuario. Utiliza la directiva `v-model` para enlazar su valor a la propiedad `user.email` en los datos del componente. También tiene una clase de CSS `form-control` que proporciona estilos y está deshabilitado (`disabled`) para que el usuario no pueda editar su dirección de correo electrónico. El atributo `style` establece el ancho del campo en 400px.

- Elementos similares existen para los campos de contraseña actual, nueva contraseña y confirmación de contraseña.

- `<button id="changePassword" type="submit" class="form-button" style="margin-top: 30px" data-bs-toggle="tooltip" data-bs-placement="top">`: Representa un botón para confirmar el cambio de contraseña. Tiene un ID de `changePassword`, una clase de CSS `form-button` y un atributo `style` para establecer estilos personalizados. También tiene atributos de datos (`data-bs-toggle` y `data-bs-placement`) que podrían usarse para mostrar información adicional en forma de tooltip.

Lógica del Script
-----------------

El bloque `<script>` contiene la lógica y el comportamiento del componente. A continuación se explica cada sección del script:

- Se importan varias dependencias y utilidades necesarias para el componente. Estos incluyen las funciones `mapState` y `mapMutations` de Vuex para mapear el estado y las mutaciones en el componente, el módulo `axios` para realizar solicitudes HTTP, la constante `API_URL` desde el archivo de configuración config.js y la biblioteca `vue3-toastify` para mostrar notificaciones.

-Se exporta un objeto que define las opciones y los métodos del componente:

  -`name`: Define el nombre del componente como "Perfil-Component".

  -`data()`: Es un método que devuelve un objeto que define la estructura de datos del componente. Contiene propiedades como `user`, `sessionToken`, `current_password`, `new_password` y `new_password_confirmation`. Estas propiedades se inicializan con valores vacíos o predeterminados.

  -`computed`: Es una sección que contiene propiedades calculadas. En este caso, utiliza la función `mapState` para mapear el estado "checkboxValue" de la tienda en la propiedad calculada `checked`. Esto permite acceder y manipular el estado desde el componente de forma más conveniente.

  -`mounted()`: Es un método del ciclo de vida que se ejecuta automáticamente después de que el componente se haya montado en el DOM. En este caso, se utiliza para obtener los datos del usuario y el token de sesión del almacenamiento local y asignarlos a las propiedades correspondientes del componente.

  - `methods`: Es una sección que contiene los métodos del componente. A continuación se explica cada método:

    -`handleCheckboxChange()`: Es un método que se activa cuando cambia el estado del checkbox. Su propósito es invocar la mutación `toggleCheckboxValue` de la tienda para cambiar el valor del estado "checkboxValue".

    -`changePassword()`: Es un método que se activa cuando se envía el formulario de cambio de contraseña. Comprueba si la nueva contraseña y la confirmación de la contraseña coinciden. Si coinciden, construye una configuración de encabezados con el token de sesión y envía una solicitud PUT a la API utilizando la biblioteca `axios` para cambiar la contraseña del usuario. Dependiendo de la respuesta de la API, muestra notificaciones de éxito o error utilizando la biblioteca `vue3-toastify`.

Estilos del Componente
----------------------

El bloque `<style>` contiene estilos CSS para dar formato a los elementos HTML dentro del componente. Utiliza el lenguaje SASS/SCSS para escribir estilos más avanzados.

A continuación se explican las reglas de estilo definidas en el componente:

- `#check:checked ~ .container .row #contentDiv`: Establece un margen izquierdo de

345px para el elemento con `id="contentDiv"` cuando el checkbox `#check` está marcado. Esta regla utiliza selectores de CSS combinados para aplicar estilos específicos a elementos secundarios basados en el estado del checkbox.

- `.container .row`: Establece la alineación y centrado de los elementos dentro de las filas del formulario. Utiliza las clases CSS `justify-content-center` y `align-items-center` para lograr este efecto.

- `.form-group`: Define el ancho de los elementos de grupo de formulario para que se ajusten al contenido. Utiliza la propiedad `width` con el valor `fit-content`.

- `.container .row .div h3`: Establece el estilo de los encabezados de nivel 3 dentro de las filas del formulario. En este caso, establece el texto alineado al centro utilizando la propiedad `text-align: center`.

- `.form-button`: Establece el estilo del botón de confirmación de cambio de contraseña. Define el color de fondo, el tamaño, el borde, el color del texto y el ancho del botón.

-->
