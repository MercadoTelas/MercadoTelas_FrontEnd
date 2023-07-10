<template>
  <div class="background-image">
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="overlay">
        <form @submit.prevent="resetPassword" class="text-center">
          <div class="mb-4">
            <div class="logo-container">
              <img src="../../assets/logo_telas.jpg" alt="Logo" class="logo">
              <h3 class="h3">Restablecimiento de Contraseña</h3>
            </div>
          </div>

          <!-- Nueva contraseña input -->
          <div class="form-outline mb-4">
            <input type="password" id="new-password" class="form-control" v-model="new_password" required>
            <label class="form-label" for="new-password">Nueva Contraseña</label>
          </div>

          <!-- Confirmar contraseña input -->
          <div class="form-outline mb-4">
            <input type="password" id="confirm-password" class="form-control" v-model="new_password_confirmation"
              required>
            <label class="form-label" for="confirm-password">Confirmar Contraseña</label>
          </div>

          <!-- Submit button -->
          <button type="submit" class="btn btn-primary full-width d-block">Restaurar Contraseña</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from "@/config";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  data() {
    return {
      new_password: '',
      new_password_confirmation: '',
      token: ''
    };
  },
  methods: {
    resetPassword() {
      if (this.new_password === this.new_password_confirmation) {
        const data = {
          new_password: this.new_password,
          password_confirmation: this.new_password_confirmation,
          reset_password_token: this.token
        };
        axios
          .put(`${API_URL}/users/password`, data)
          .then(response => {
            toast.success(`Contraseña actualizada`, {
              position: 'bottom-right',
              timeout: 2000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
            });
            console.log(response);
            this.$router.push('/login');
          })
          .catch(error => {
            toast.error(`No se pudo actualizar la contraseña`, {
              position: 'bottom-right',
              timeout: 2000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
            });
            console.log(error);
          });
      } else {
        toast.error(`Las contraseñas no coinciden`, {
          position: 'bottom-right',
          timeout: 2000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
        });
      }
    },
  },
  mounted() {
    this.$state.navbarTitle = 'Restablecimiento de Contraseña';
    this.token = this.$route.query.reset_password_token;
    console.log(this.token);
  }
};
</script>

<style scoped>
.background-image {
  background-image: url('../../assets/background_image.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.overlay {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 20px;
  border-radius: 10px;
  width: 450px;
}

.d-flex {
  display: flex;
}

.justify-content-center {
  justify-content: center;
}

.align-items-center {
  align-items: center;
}

.full-width {
  width: 100%;
}

.vh-100 {
  min-height: 100vh;
}

.logo-container {
  margin-right: 20px;
}

.logo {
  width: 300px;
  height: 250px;
  margin-bottom: 60px;
  border-radius: 20%;
}
</style>

<!--
 Componente para el cambio de contraseña

Estructura del Template
-----------------------

El bloque `<template>` define la estructura del componente utilizando elementos HTML y directivas de Vue.js. A continuación se explica cada elemento en el componente:

- `<div class="background-image">`: Contenedor principal del formulario de restablecimiento de contraseña. Utiliza la clase `background-image` para establecer una imagen de fondo.

- `<div class="d-flex justify-content-center align-items-center vh-100">`: Contenedor flex que centra vertical y horizontalmente el contenido. Utiliza las clases `justify-content-center` y `align-items-center`.

- `<div class="overlay">`: Contenedor de la tarjeta que muestra el formulario de restablecimiento de contraseña. Utiliza la clase `overlay` para aplicar un fondo semitransparente.

- `<form @submit.prevent="resetPassword" class="text-center">`: Formulario que se envía cuando se realiza un envío. Invoca el método `resetPassword` cuando se envía el formulario.

- `<div class="mb-4">`: Contenedor para el logo y el título del formulario.

- `<div class="logo-container">`: Contenedor para el logo.

- `<img src="../../assets/logo_telas.jpg" alt="Logo" class="logo">`: Imagen del logo.

- `<h3 class="h3">Restablecimiento de Contraseña</h3>`: Título del formulario.

- `<div class="form-outline mb-4">`: Contenedor para el campo de entrada de la nueva contraseña.

- `<input type="password" id="new-password" class="form-control" v-model="new_password" required>`: Campo de entrada de texto para la nueva contraseña. Utiliza la directiva `v-model` para vincular su valor a la propiedad `new_password` en el componente.

- `<div class="form-outline mb-4">`: Contenedor para el campo de entrada de confirmación de contraseña.

- `<input type="password" id="confirm-password" class="form-control" v-model="new_password_confirmation" required>`: Campo de entrada de texto para la confirmación de la contraseña. Utiliza la directiva `v-model` para vincular su valor a la propiedad `new_password_confirmation` en el componente.

- `<button type="submit" class="btn btn-primary full-width d-block">Restaurar Contraseña</button>`: Botón de envío del formulario. Utiliza las clases de Bootstrap para aplicar estilos y la clase `full-width` para ocupar todo el ancho disponible.

Estructura del Script
---------------------

El bloque `<script>` contiene la lógica del componente y define los datos y métodos utilizados en el template. A continuación se explica cada sección del script:

- `import axios from "axios";`: Importa el módulo `axios` para realizar solicitudes HTTP.

- `import { API_URL } from "@/config";`: Importa la variable `API_URL` desde el módulo de configuración.

- `import { toast } from 'vue3-toastify';`: Importa el módulo `toast` de 'vue3-toastify' para mostrar notificaciones.

- `export default { ... }`: Exporta el objeto que define el componente.

- `data() { ... }`: Método que devuelve un objeto con los datos del componente.

  - `new_password`: Propiedad que almacena el valor de la nueva contraseña ingresada por el usuario.

  - `new_password_confirmation`: Propiedad que almacena el valor de la confirmación de la contraseña ingresada por el usuario.

  - `token`: Propiedad que almacena el token de restablecimiento de contraseña obtenido de la ruta.

- `methods: { ... }`: Sección que contiene los métodos utilizados en el componente.

  - `resetPassword() { ... }`: Método que se invoca cuando se envía el formulario de restablecimiento de contraseña. Verifica que las contraseñas coincidan y realiza una solicitud PUT a la API para restablecer la contraseña. Muestra una notificación de éxito o error según el resultado y redirige al usuario a la página de inicio de sesión.

- `mounted() { ... }`: Método que se ejecuta después de que el componente se haya montado en el DOM. Establece el título de la barra de navegación y obtiene el token de restablecimiento de contraseña de la ruta.

Estilos CSS
-----------

El bloque `<style scoped>` contiene estilos CSS para dar formato al componente. Los estilos están definidos dentro del atributo `scoped`, lo que significa que solo se aplican al componente actual y no se propagan a otros componentes. A continuación se explica cada estilo:

- `.background-image { ... }`: Estilos para el contenedor principal del formulario de restablecimiento de contraseña que establecen una imagen de fondo.

- `.overlay { ... }`: Estilos para el contenedor de la tarjeta que aplican un fondo semitransparente, establecen el tamaño y el margen de la tarjeta y aplican una sombra.

- `.d-flex { ... }`: Estilos para el contenedor flex que utiliza flexbox para centrar vertical y horizontalmente el contenido.

- `.justify-content-center { ... }`: Estilos para centrar el contenido horizontalmente dentro del contenedor flex.

- `.align-items-center { ... }`: Estilos para centrar el contenido verticalmente dentro del contenedor flex.

- `.full-width { ... }`: Estilos para establecer el ancho del botón de envío al 100% del contenedor.

- `.vh-100 { ... }`: Estilos para establecer la altura mínima del contenedor al 100% del viewport.

- `.logo-container { ... }`: Estilos para el contenedor del logo que establecen un margen derecho.

- `.logo { ... }`: Estilos para el logo que establecen el ancho, la altura, el margen inferior y el radio de borde.
-->