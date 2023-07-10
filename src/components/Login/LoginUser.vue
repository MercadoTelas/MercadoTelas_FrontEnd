<template>
  <div class="background-image">
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="overlay">
        <form @submit.prevent="login" class="text-center">
          <div class="mb-4">
            <div class="logo-container">
              <img src="../../assets/logo_telas.jpg" alt="Logo" class="logo">
              <h2 class="h2">Iniciar sesión</h2>
            </div>
          </div>

          <!-- Email input -->
          <div class="form-outline mb-4">
            <input type="email" id="email" class="form-control" required />
            <label class="form-label" for="email">Correo electrónico</label>
          </div>

          <!-- Password input -->
          <div class="form-outline mb-4">
            <input type="password" id="password" class="form-control" required />
            <label class="form-label" for="password">Contraseña</label>
          </div>

          <!-- 2 column grid layout for inline styling -->
          <div class="row mb-4">
            <div class="col d-flex justify-content-center">
              <!-- Checkbox -->
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="remind_me" checked />
                <label class="form-check-label" for="remind_me">Recordarme</label>
              </div>
            </div>

            <div class="col">
              <!-- Simple link -->
              <a href="" @click="forgotPass">¿Olvidaste tu contraseña?</a>
            </div>
          </div>

          <!-- Submit button -->
          <button type="submit" class="btn btn-primary full-width d-block" @click="log">Iniciar sesión</button>
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
  methods: {
    forgotPass() {
      this.$router.push('/sendEmail');
    },
    login() {
      // Obtener los valores de email electrónico y contraseña
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      let user = {
        email,
        password,
        current_warehouse_logged_id: 1
      };

      axios.post(`${API_URL}/users/sign_in`, user)
        .then(response => {
          const headers = response.headers;
          const token = headers['authorization'];
          console.log(response);
          user = response.data.data;
          if (response.data.status === 'success') {
            this.$store.commit('setLoggedIn', true);
            //this.$store.commit('incrementLogAttempts');
            this.$store.commit('setUser', user);
            this.$store.commit('setSessionToken', token);
            this.$router.push('/home');
          }
        }).catch(
          error => {
            const { response } = error;
            console.log(response);
            toast.error(`Error al iniciar sesión`, {
              position: 'bottom-right',
              timeout: 2000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
            });
          });

    }
  },
  mounted() {
    this.$store.commit('setCheck', false);
    this.$store.commit('setLoggedIn', false);
    this.$store.commit('setLogAttempt', false);
  },
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

  Componente para el Inicio de sesion de los usuarios

Estructura del Template
-----------------------

El bloque `<template>` define la estructura del componente utilizando elementos HTML y directivas de Vue.js. A continuación se explica cada elemento en el componente:

- `<div class="background-image">`: Actúa como un contenedor principal y establece una imagen de fondo utilizando CSS.

- `<div class="d-flex justify-content-center align-items-center vh-100">`: Contenedor flex que centra vertical y horizontalmente su contenido. Establece la altura mínima al 100% del viewport.

- `<div class="overlay">`: Contenedor que se superpone al contenido principal. Tiene un fondo semitransparente y bordes redondeados.

- `<form @submit.prevent="login" class="text-center">`: Formulario que se envía cuando se realiza un envío. Invoca el método `login` cuando se envía el formulario.

- `<div class="mb-4">`: Contenedor para el logotipo y el título del formulario.

- `<div class="logo-container">`: Contenedor para el logotipo. Tiene un margen derecho.

- `<img src="../../assets/logo_telas.jpg" alt="Logo" class="logo">`: Imagen del logotipo. Utiliza una ruta relativa para cargar la imagen desde la carpeta "assets" del proyecto. Tiene una clase `logo` para aplicar estilos personalizados.

- `<h2 class="h2">Iniciar sesión</h2>`: Título del formulario. Utiliza una clase `h2` para aplicar estilos personalizados.

- `<div class="form-outline mb-4">`: Contenedor para el campo de entrada de correo electrónico. Tiene un margen inferior.

- `<input type="email" id="email" class="form-control" required />`: Campo de entrada de correo electrónico. Utiliza el tipo de entrada "email" y tiene un atributo `required` para requerir entrada del usuario.

- `<label class="form-label" for="email">Correo electrónico</label>`: Etiqueta para el campo de entrada de correo electrónico.

- `<div class="form-outline mb-4">`: Contenedor para el campo de entrada de contraseña. Tiene un margen inferior.

- `<input type="password" id="password" class="form-control" required />`: Campo de entrada de contraseña. Utiliza el tipo de entrada "password" y tiene un atributo `required` para requerir entrada del usuario.

- `<label class="form-label" for="password">Contraseña</label>`: Etiqueta para el campo de entrada de contraseña.

- `<div class="row mb-4">`: Contenedor para la disposición en columnas.

- `<div class="col d-flex justify-content-center">`: Columna que utiliza flex para centrar el contenido horizontalmente.

- `<div class="form-check">`: Contenedor para el campo de entrada de checkbox.

- `<input class="form-check-input" type="checkbox" value="" id="remind_me" checked />`: Campo de entrada de checkbox. Tiene una clase `form-check-input` y está marcado por defecto.

- `<label class="form-check-label" for="remind_me">Recordarme</label>`: Etiqueta para el campo de entrada de checkbox.

- `<div class="col">`: Otra columna.

- `<a href="" @click="forgotPass">¿Olvidaste tu contraseña?</a>`: Enlace que invoca el método `forgotPass` cuando se hace clic en él.

- `<button type="submit" class="btn btn-primary full-width d-block" @click="log">Iniciar sesión</button>`: Botón de envío del formulario. Tiene clases para aplicar estilos de Bootstrap y una clase `full-width` para establecer el ancho completo.

Estructura del Script
---------------------

El bloque `<script>` contiene la lógica del componente y define los datos y métodos utilizados en el template. A continuación se explica cada sección del script:

- `import axios from "axios";`: Importa el módulo `axios` para realizar solicitudes HTTP.

- `import { API_URL } from "@/config";`: Importa la variable `API_URL` desde el módulo de configuración.

- `import { toast } from 'vue3-toastify';`: Importa el módulo `toast` de 'vue3-toastify' para mostrar notificaciones.

- `methods`: Sección que contiene los métodos utilizados en el componente.

  - `forgotPass`: Método que se invoca cuando se hace clic en el enlace "¿Olvidaste tu contraseña?". Redirige al usuario a la ruta '/sendEmail'.

  - `login`: Método que se invoca cuando se envía el formulario de inicio de sesión. Obtiene los valores de correo electrónico y contraseña, crea un objeto de usuario con esos valores y realiza una solicitud POST a la API para iniciar sesión. Si la respuesta es exitosa, se actualizan los datos de inicio de sesión en el estado global y se redirige al usuario a la ruta '/home'. Si la respuesta es fallida, se muestra una notificación de error.

- `mounted()`: Gancho de ciclo de vida que se ejecuta después de que el componente se ha montado en el DOM. Establece las variables de estado global a sus valores iniciales.

Estilos CSS
-----------

El bloque `<style scoped>` contiene estilos CSS para dar formato al componente. Los estilos están definidos dentro del atributo `scoped`, lo que significa que solo se aplican al componente actual y no se propagan a otros componentes. A continuación se explica cada estilo:

- `.background-image`: Establece la imagen de fondo para el componente. Utiliza propiedades CSS relacionadas con imágenes de fondo, como `background-image`, `background-size`, `background-repeat` y `background-position`.

- `.overlay`: Establece el color de fondo, el relleno y los bordes redondeados para el contenedor de superposición.

- `.d-flex`, `.justify-content-center`, `.align-items-center`: Estilos relacionados con flexbox para centrar el contenido vertical y horizontalmente.

- `.full-width`: Establece el ancho al 100% del contenedor.

- `.vh-100`: Establece la altura mínima al 100% del viewport.

- `.logo-container`: Establece el margen derecho para el contenedor del logotipo.

- `.logo`: Establece el ancho, alto, margen inferior y borde redondeado para el logotipo.
-->