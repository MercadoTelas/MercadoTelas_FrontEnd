import { container } from 'webpack';
<template>
  <!--Sidebar Prinicipal-->
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />
  <label for="check">
    <i class="fas fa-bars" id="btn">
      <i class="bi bi-list"></i>
    </i>
    <i class="fas fa-times" id="cancel">
      <i class="bi bi-x-lg"></i>
    </i>
  </label>
  <div class="sidebar">
    <a v-for="(page, index) in pages" :id="page.link.id" :key="index" :class="{ active: activePage === index }"
      :href="`./${page.link.linkTo}`" :title="`Ir a la página de ${page.link.title}`"
      @click="manageClick(page.link.id, page.link.linkTo)" @click.prevent="activePage = index">
      <i id="mobileIcon" :class="page.link.bootstrapIcon.class"><span>{{ page.link.text }}</span></i>
      <span id="desktopText">
        <i id="desktopIcon" :class="page.link.bootstrapIcon.class"></i>
        {{ page.link.text }}
      </span>
    </a>
  </div>

  <!--Sidebar Elementos-->
  <input type="checkbox" id="checkElements" />
  <label for="checkElements">
    <i class="fas fa-times" id="cancelElements">
      <i class="bi bi-arrow-return-left"></i>
    </i>
  </label>

  <div id="sidebarElements" class="sidebarElements">
    <a v-for="(option, index) in adminElementsList" :id="option.element" :key="index"
      :class="{ active: activePage === index }" @click="performElementsAction(option.urlParam)"
      @click.prevent="activePage = index">
      <span id="option">
        <i :class="option.bootstrapIconClass"></i>
        {{ option.element }}
      </span>
    </a>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Swal from "sweetalert2";
import axios from "axios";
import { API_URL } from "@/config";

export default {
  data() {
    return {
      token: "",
      limit: 700,
      screenWidth: 0,
      screenHeight: 0,
      isDesktop: false,
      activePage: 0,
      pages: [
        {
          link: {
            id: "home",
            text: "Inicio",
            title: "inicio",
            linkTo: "home",
            bootstrapIcon: {
              class: "bi bi-house-fill",
            },
          },
        },
        {
          link: {
            id: "inventario",
            text: "Ver Inventario",
            title: "articulos",
            linkTo: "inventory",
            bootstrapIcon: {
              class: "bi bi-box-seam",
            },
          },
        },
        {
          link: {
            id: "entrada",
            text: "Entradas de Inventario",
            title: "entradas de inventario",
            linkTo: "entry",
            bootstrapIcon: {
              class: "bi bi-box-arrow-in-left",
            },
          },
        },
        {
          link: {
            id: "salida",
            text: "Salidas de Inventario",
            title: "salidas de inventario",
            linkTo: "output",
            bootstrapIcon: {
              class: "bi bi-trash2",
            },
          },
        },
        {
          link: {
            id: "transferencia",
            text: "Transferencias de Inventario",
            title: "Transferencias de inventario",
            linkTo: "transfer",
            bootstrapIcon: {
              class: "bi bi-box-arrow-in-right",
            },
          },
        },
        {
          link: {
            id: "usuarios",
            text: "Administrar usuarios",
            title: "administrar usuarios",
            linkTo: "users",
            bootstrapIcon: {
              class: "bi bi-people-fill",
            },
          },
        },
        {
          link: {
            id: "transactions",
            text: "Registro de movimientos",
            title: "registro de movimientos",
            linkTo: "transactions",
            bootstrapIcon: {
              class: "bi bi-folder-fill",
            },
          },
        },
        {
          link: {
            id: "administrarElementos",
            text: "Catalogo",
            title: "administrar elementos",
            linkTo: "adminElementos",
            bootstrapIcon: {
              class: "bi bi-pencil-square",
            },
          },
        },
        {
          link: {
            id: "exit-item",
            text: "Cerrar sesión",
            title: "Salir",
            linkTo: "login",
            bootstrapIcon: {
              class: "bi bi-door-closed-fill",
            },
          },
        },
      ],
      adminElementsList: [
        {
          element: "Artículo",
          bootstrapIconClass: "bi bi-bag-fill",
          urlParam: "items",
        },
        {
          element: "Categoría",
          bootstrapIconClass: "bi bi-bookmark-fill",
          urlParam: "categories",
        },
        {
          element: "Subcategoría",
          bootstrapIconClass: "bi bi-bookmarks-fill",
          urlParam: "subcategories",
        },
        {
          element: "Diseño",
          bootstrapIconClass: "bi bi-brush-fill",
          urlParam: "designs",
        },
        {
          element: "Marca",
          bootstrapIconClass: "bi bi-tag-fill",
          urlParam: "brands",
        },
        {
          element: "Bodega",
          bootstrapIconClass: "bi bi-buildings-fill",
          urlParam: "warehouses",
        },
      ],
    };
  },
  mounted() {
    this.token = localStorage.getItem("sessionToken");
  },
  computed: {
    ...mapState(["checkboxValue"]),
    checked: {
      get() {
        return this.checkboxValue;
      },
    },
  },
  created() {
    this.updateScreenSize();
    window.addEventListener("resize", this.updateScreenSize);
  },
  unmounted() {
    window.removeEventListener("resize", this.updateScreenSize);
  },
  methods: {
    manageClick(id, param) {
      if (id === "exit-item") {
        this.logout();
      } else {
        this.action(param);
      }
    },
    logout() {
      Swal.fire({
        icon: "question",
        title: "Cerrar sesión",
        text: "¿Estás seguro de que deseas cerrar sesión?",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          const config = {
            headers: { Authorization: `${this.token}` },
          };

          axios
            .delete(`${API_URL}/users/sign_out`, config)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
        }
        localStorage.removeItem("token");
        this.$store.commit("setLoggedIn", false);
        this.$router.push("/login");
      });
    },

    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    updateScreenSize() {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      this.Desktop();
    },
    Desktop() {
      this.isDesktop = this.screenWidth >= this.limit;
    },
    action(param) {
      if (param === "adminElementos") {
        document.getElementById("checkElements").checked = true;
      } else {
        this.$router.push("/" + param);
      }
    },
    performElementsAction(param) {
      this.$router.push("/" + param);
      document.getElementById("checkElements").checked = false;
    },
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Montserrat:600|Open+Sans:600&display=swap");

* {
  margin: 0;
  padding: 0;
  text-decoration: none;
}

.sticky {
  position: fixed;
  top: 0;
}

.sidebar,
.sidebarElements {
  position: fixed;
  width: 345px;
  left: -345px;
  height: 100%;
  top: 110px;

  background: #15386e;
  color: white;
  transition: all 0.5s ease;
}

.sidebar a,
.sidebarElements a {
  cursor: pointer;
  display: block;
  height: 65px;
  width: 100%;
  color: white;
  line-height: 65px;
  padding-left: 30px;
  box-sizing: border-box;
  border-bottom: 1px solid black;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-left: 5px solid transparent;
  font-family: "Open Sans", sans-serif;
  transition: all 0.5s ease;
}

a:hover {
  background: #3066be;
  border-left: 5px solid white;
  color: white;
}

a:active {
  background: #3066be;
  border-left: 5px solid white;
  color: white;
}

#option {
  cursor: pointer;
}

#mobileIcon {
  display: none;
}

#mobileText {
  display: none;
}

#exit-item {
  background-color: #ae0214;
}

#exit-item:hover {
  background-color: #d72638;
  border-left: 5px solid white;
  color: white;
}

#exit-item:active {
  background-color: #d72638;
  border-left: 5px solid white;
  color: white;
}

.sidebar a i,
.sidebarElements a i {
  font-size: 23px;
  margin-right: 16px;
}

.sidebar a span,
.sidebarElements a span {
  letter-spacing: 1px;
  text-transform: uppercase;
  display: inline-block;
  max-width: 100%;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#check,
#checkElements {
  display: none;
}

label #btn,
label #cancel,
label #cancelElements {
  position: fixed;
  cursor: pointer;
  color: white;
  border-radius: 5px;
  border: 1px solid #15386e;
  top: 105px;
  margin: 15px 30px;
  font-size: 29px;
  background: #15386e;
  height: 45px;
  width: 45px;
  text-align: center;
  line-height: 45px;
  transition: all 0.5s ease;
}

label #cancel,
label #cancelElements {
  opacity: 0;
  visibility: hidden;
}

#check:checked~.sidebar {
  left: 0;
}

#checkElements:checked~.sidebarElements {
  left: 0;
}

#check:checked~label #btn {
  margin-left: 245px;
  opacity: 0;
  visibility: hidden;
}

//Boton de cancelar activado
#check:checked~label #cancel {
  margin-left: 350px;
  opacity: 1;
  visibility: visible;
}

#checkElements:checked~label #cancelElements {
  margin-left: 350px;
  opacity: 1;
  visibility: visible;
}

//Mobile
@media (max-width: 860px) {
  .sidebar {
    height: auto;
    width: 70px;
    left: 0;
    top: 110px;
  }

  #inventario,
  #usuarios,
  #movimientos,
  #administrarElementos {
    display: none;
  }

  a:hover {
    width: 100vh;
    background: inherit;
  }

  .sidebar a:hover span {
    opacity: 1;
    visibility: visible;
  }

  label #btn,
  label #cancel {
    position: absolute;
    cursor: pointer;
    color: white;
    border-radius: 5px;
    border: 1px solid #15386e;
    top: 98px;
    left: -25px;
    margin: 15px 30px;
    font-size: 29px;
    background: #15386e;
    height: 45px;
    width: 45px;
    text-align: center;
    line-height: 45px;
    transition: all 0.5s ease;
  }

  .sidebar {
    position: fixed;
    width: 70px;
    left: -70px;
    top: 110px;

    background: #15386e;
    color: white;
    transition: all 0.5s ease;
  }

  #desktopText {
    display: none;
  }

  #mobileIcon {
    display: block;
    margin-left: -11.5px;
  }

  span {
    position: absolute;
    margin-left: 23px;
    opacity: 0;
    visibility: hidden;
  }

  .sidebar a {
    height: 60px;
  }
}
</style>

<!--
Componente de barra de navegación vertical SIDEBAR

**Template:**

- `<input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange">`: Es un checkbox que se utiliza para controlar el estado del menú desplegable principal. Su estado está vinculado a la propiedad `checked` utilizando `v-model`, y cuando cambia, se invoca el método `handleCheckboxChange`.

- `<label for="check">`: Es una etiqueta que se utiliza como botón para abrir y cerrar el menú desplegable principal. Está asociada al checkbox mediante el atributo `for` que tiene el mismo valor que el atributo `id` del checkbox.

- `<i class="fas fa-bars" id="btn">`: Es un icono que se muestra cuando el menú está cerrado. Al hacer clic en este icono, se activa el menú desplegable.

- `<i class="fas fa-times" id="cancel">`: Es un icono que se muestra cuando el menú está abierto. Al hacer clic en este icono, se cierra el menú desplegable.

- `<div class="sidebar">`: Es el contenedor del menú desplegable principal.

- `<a v-for="(page, index) in pages" ... >`: Se utiliza para iterar sobre el array `pages` y mostrar los enlaces del menú. Cada enlace se representa como un elemento `<a>`. Los atributos y eventos se establecen dinámicamente utilizando `v-bind` y `v-on`. Se muestra un ícono y un texto para cada enlace.

- `<input type="checkbox" id="checkElements" />`: Es otro checkbox que se utiliza para controlar el estado del menú desplegable de elementos. Su estado está vinculado a la propiedad `checked` utilizando `v-model`.

- `<label for="checkElements">`: Es una etiqueta que se utiliza como botón para abrir y cerrar el menú desplegable de elementos. Está asociada al checkbox mediante el atributo `for` que tiene el mismo valor que el atributo `id` del checkbox.

- `<i class="fas fa-times" id="cancelElements">`: Es un icono que se muestra cuando el menú de elementos está abierto. Al hacer clic en este icono, se cierra el menú desplegable de elementos.

- `<div id="sidebarElements" class="sidebarElements">`: Es el contenedor del menú desplegable de elementos.

- `<a v-for="(option, index) in adminElementsList" ... >`: Se utiliza para iterar sobre el array `adminElementsList` y mostrar los enlaces del menú de elementos. Cada enlace se representa como un elemento `<a>`. Se muestra un ícono y un texto para cada enlace.

**Script:**

- `import { mapState, mapMutations } from "vuex";`: Importa las funciones `mapState` y `mapMutations` de Vuex para mapear el estado y las mutaciones del store a las propiedades y métodos del componente.

- `import Swal from "sweetalert2";`: Importa SweetAlert2, una biblioteca para mostrar mensajes de alerta.

- `import axios from "axios";`: Importa Axios, una biblioteca para realizar solicitudes HTTP.

- `import { API_URL } from "@/config";`: Importa la URL de la API desde el archivo de configuración.

- `data() { return { ... } }`: Define los datos del componente. Inicializa las propiedades `token` con una cadena vacía, `limit` con el valor 700, `screenWidth` y `screenHeight` con 0, `isDesktop` con `false`, `activePage` con 0, `pages` con un array de objetos que representan los enlaces del menú principal, y `adminElementsList` con un array de objetos que representan los enlaces del menú de elementos.

- `mounted() { ... }`: Se ejecuta después de que el componente se haya montado en el DOM. Obtiene el token de sesión del almacenamiento local.

- `computed: { ... }`: Define las propiedades computadas del componente. Incluye la propiedad `checked` que obtiene y
establece el valor del checkbox principal utilizando `mapState`.

- `created() { ... }`: Se ejecuta cuando se crea el componente. Registra un evento de cambio de tamaño de ventana y lo asocia al método `updateScreenSize`.

- `unmounted() { ... }`: Se ejecuta antes de que el componente se desmonte. Elimina el evento de cambio de tamaño de ventana para evitar posibles fugas de memoria.

- `methods: { ... }`: Define los métodos del componente. El método `manageClick` se utiliza para controlar el clic en los enlaces del menú. Si el enlace es "Cerrar sesión", se muestra una confirmación utilizando SweetAlert2 y se realiza una solicitud HTTP para cerrar la sesión del usuario. El método `logout` se utiliza para cerrar la sesión del usuario y redirigirlo a la página de inicio de sesión.

- `...mapMutations(["toggleCheckboxValue"])`: Mapea la mutación `toggleCheckboxValue` del store a la propiedad `toggleCheckboxValue` del componente.

- `handleCheckboxChange()`: Invoca la mutación
`toggleCheckboxValue` cuando el estado del checkbox principal cambia.

- `updateScreenSize()`: Actualiza el tamaño de la pantalla y establece la propiedad `isDesktop` en función del ancho de la pantalla. Este método se invoca cuando cambia el tamaño de la ventana.

- `Desktop()`: Comprueba si la pantalla es de escritorio según el valor de `screenWidth` y `limit`, y establece la propiedad `isDesktop` en consecuencia.

- `action(param)`: Realiza una acción según el parámetro proporcionado. Si el parámetro es "adminElementos", se marca el checkbox del menú de elementos. De lo contrario, se redirige al usuario a la página correspondiente utilizando `this.$router.push`.

- `performElementsAction(param)`: Redirige al usuario a la página correspondiente según el parámetro proporcionado y cierra el menú desplegable de elementos.

**Estilos:**

- Se definen varios estilos para los elementos del menú desplegable principal y el menú de elementos. Los estilos incluyen la posición fija, el ancho, el color de fondo, los colores de texto y de borde, la transición, el espaciado, el tamaño de fuente y la visibilidad.

- Se utilizan media queries para estilos específicos en dispositivos móviles con un ancho máximo de 860px. Los estilos incluyen cambios en la posición, el ancho y la visibilidad de los elementos del menú en dispositivos móviles.
-->