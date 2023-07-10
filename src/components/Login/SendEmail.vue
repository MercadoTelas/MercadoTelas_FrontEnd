<template>
  <div class="password-reset-form background-image">
    <div class="card text-center overlay">
      <div class="card-header h4 text-white bg-primary">Restablecimiento de Contraseña</div>
      <div class="card-body">
        <p class="card-text py-3">
          Ingrese su dirección de correo electrónico y le enviaremos un correo electrónico con las instrucciones para
          restablecer su contraseña.
        </p>
        <form @submit.prevent="resetPassword" class="text-center">
          <div class="form-group">
            <label class="form-label" for="typeEmail">Correo electrónico</label>
            <input type="email" id="typeEmail" class="form-control" v-model="email" />
          </div>
          <button type="submit" class="btn btn-primary w-100 mt-3">Restablecer contraseña</button>
        </form>
        <div class="d-flex justify-content-between mt-4">
          <a class="text-decoration-none" href="" @click="goToLogin">O Inicia sesión</a>
        </div>
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
      email: '',
    };
  },
  methods: {
    resetPassword() {
      const user = {
        user: {
          email: this.email,
        }
      };
      axios.post(`${API_URL}/users/password/`, user)
        .then((response) => {
          console.log(response);
          toast.success(`Se ha enviado un correo electrónico con las instrucciones para restablecer su contraseña`, {
            position: 'bottom-right',
            timeout: 2000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
          });
        })
        .catch((error) => {
          console.log(error);
          toast.error(`Error en el restablecimiento de contraseña`, {
            position: 'bottom-right',
            timeout: 2000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
          });
        });
    },
    goToLogin() {
      this.$router.push('/login');
    }
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
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.password-reset-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.card-header {
  font-size: 2rem;
}

.card-body {
  font-size: 1.2rem;
}

.btn-primary {
  margin-top: 1rem;
}
</style>

<!---
Componente para los envios Email de cambio de contraseña

Estructura del Template
-----------------------

El bloque `<template>` define la estructura del componente utilizando elementos HTML y directivas de Vue.js. A continuación se explica cada elemento en el componente:

- `<div class="password-reset-form background-image">`: Contenedor principal del formulario de restablecimiento de contraseña. Utiliza la clase `background-image` para establecer una imagen de fondo.

- `<div class="card text-center overlay">`: Contenedor de tarjeta que muestra el formulario de restablecimiento de contraseña. Utiliza la clase `overlay` para aplicar un fondo semitransparente.

- `<div class="card-header h4 text-white bg-primary">Restablecimiento de Contraseña</div>`: Encabezado de la tarjeta que indica el propósito del formulario.

- `<div class="card-body">`: Cuerpo de la tarjeta que contiene el contenido principal del formulario.

- `<p class="card-text py-3">...</p>`: Párrafo que proporciona instrucciones sobre cómo restablecer la contraseña.

- `<form @submit.prevent="resetPassword" class="text-center">`: Formulario que se envía cuando se realiza un envío. Invoca el método `resetPassword` cuando se envía el formulario.

- `<div class="form-group">`: Contenedor para el campo de entrada del correo electrónico.

- `<label class="form-label" for="typeEmail">Correo electrónico</label>`: Etiqueta para el campo de entrada del correo electrónico.

- `<input type="email" id="typeEmail" class="form-control" v-model="email" />`: Campo de entrada de texto para el correo electrónico. Utiliza la directiva `v-model` para vincular su valor a la propiedad `email` en el componente.

- `<button type="submit" class="btn btn-primary w-100 mt-3">Restablecer contraseña</button>`: Botón de envío del formulario. Utiliza las clases de Bootstrap para aplicar estilos y la clase `w-100` para que ocupe todo el ancho disponible.

- `<div class="d-flex justify-content-between mt-4">`: Contenedor para los enlaces adicionales.

- `<a class="text-decoration-none" href="" @click="goToLogin">O Inicia sesión</a>`: Enlace que invoca el método `goToLogin` cuando se hace clic en él para redirigir al usuario a la página de inicio de sesión.

Estructura del Script
---------------------

El bloque `<script>` contiene la lógica del componente y define los datos y métodos utilizados en el template. A continuación se explica cada sección del script:

- `import axios from "axios";`: Importa el módulo `axios` para realizar solicitudes HTTP.

- `import { API_URL } from "@/config";`: Importa la variable `API_URL` desde el módulo de configuración.

- `import { toast } from 'vue3-toastify';`: Importa el módulo `toast` de 'vue3-toastify' para mostrar notificaciones.

- `export default { ... }`: Exporta el objeto que define el componente.

- `data() { ... }`: Método que devuelve un objeto con los datos del componente.

  - `email`: Propiedad que almacena el valor del correo electrónico ingresado por el usuario.

- `methods: { ... }`: Sección que contiene los métodos utilizados en el componente.

  - `resetPassword() { ... }`: Método que se invoca cuando se envía el formulario de restablecimiento de contraseña. Crea un objeto `user` con el correo electrónico ingresado, realiza una solicitud POST a la API para restablecer la contraseña y muestra una notificación de éxito o error según el resultado.

  - `goToLogin() { ... }`: Método que se invoca cuando se hace clic en el enlace "O Inicia sesión". Redirige al usuario a la página de inicio de sesión.

Estilos CSS
-----------

El bloque `<style scoped>` contiene estilos CSS para dar formato al componente. Los estilos están definidos dentro del atributo `scoped`, lo que significa que solo se aplican al componente actual y no se propagan a otros componentes. A continuación se explica cada estilo:

- `.background-image { ... }`: Estilos para el contenedor principal del formulario de restablecimiento de contraseña que establecen una imagen de fondo.

- `.overlay { ... }`: Estilos para el contenedor de la tarjeta que aplican un fondo semitransparente, establecen el tamaño y el margen de la tarjeta y aplican una sombra.

- `.password-reset-form { ... }`: Estilos para el contenedor principal del formulario de restablecimiento de contraseña que utilizan flexbox para centrar vertical y horizontalmente el contenido.

- `.card-header { ... }`: Estilos para el encabezado de la tarjeta que establecen el tamaño de fuente.

- `.card-body { ... }`: Estilos para el cuerpo de la tarjeta que establecen el tamaño de fuente.

- `.btn-primary { ... }`: Estilos para el botón de envío del formulario que establecen un margen superior.

-->