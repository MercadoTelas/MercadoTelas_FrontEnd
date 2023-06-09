import { container } from 'webpack';
<template>
  <div class="sidebar">
    <ul id="buttonsList" class="navbar-nav me-auto">
      <li v-for="(page, index) in pages" :key="index">
        <div :id="page.link.id" v-if="isDesktop" class="nav-item">
          <router-link :to="`/${page.link.linkTo}`" class="nav-link">
            <a
              class="nav-link"
              :class="{ active: activePage == index }"
              :href="page.link.url"
              :title="`Ir a la página de ${page.link.title}`"
              @click.prevent="activePage = index"
            >
              <router-link :to="`/${page.link.linkTo}`" class="nav-link">
                <div class="sidebar-icon-wrapper">
                  <svg
                    :xmlns="page.link.bootstrapIcon.svg.xmlns"
                    :width="page.link.bootstrapIcon.svg.width"
                    :height="page.link.bootstrapIcon.svg.height"
                    :fill="page.link.bootstrapIcon.svg.fill"
                    :class="page.link.bootstrapIcon.svg.class"
                    :viewBox="page.link.bootstrapIcon.svg.viewBox"
                  >
                    <path :d="page.link.bootstrapIcon.path.d" />
                    <path :d="page.link.bootstrapIcon.path.d2" />
                  </svg>
                </div>
                <div class="sidebar-title">{{ page.link.text }}</div>
              </router-link>
            </a>
          </router-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.sidebar {
  background-color: #15386e;
  color: white;

  //mobile version
  @media (max-width: 700px) {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;

    .nav-item {
      width: 100px;
      height: 90px;

      .nav-link {
        .sidebar-icon-wrapper {
          margin-top: 15px;
        }

        .sidebar-title {
          margin-top: 2.5px;
          font-size: 10px;
        }
      }
    }
  }

  //desktop version
  @media (min-width: 700px) {
    position: fixed;
    width: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    height: 100vh;
    

    .nav-item {
      :hover {
        background-color: #3066be;
    }

      height: fit-content;
      width: 130px;

      .nav-link {
        .sidebar-icon-wrapper {
          .sidebar-icon {
            margin-top: 9.5px;
            height: auto;
          }
        }

        .sidebar-title {
          margin-top: auto;
          font-size: 12px;
        }
      }
    }
  }

  #exit-item {
    background-color: #ae0214;

    :hover {
      background-color: #d72638;
    }
  }
}
</style>

<script>
export default {
  data() {
    return {
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
            url: "inicio.html",
            title: "inicio",
            linkTo: "home",
            bootstrapIcon: {
              svg: {
                xmlns: "http://www.w3.org/2000/svg",
                width: "50",
                height: "50",
                fill: "currentColor",
                class: "bi bi-house-fill",
                viewBox: "0 0 16 16",
              },
              path: {
                d: "M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z",
                d2: "m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z",
              },
            },
          },
        },
        {
          link: {
            id: "inventario",
            text: "Ver artículos",
            url: "articulos.html",
            title: "articulos",
            linkTo: "inventario",
            bootstrapIcon: {
              svg: {
                xmlns: "http://www.w3.org/2000/svg",
                width: "50",
                height: "50",
                fill: "currentColor",
                class: "bi bi-box-seam",
                viewBox: "0 0 16 16",
              },
              path: {
                d: "M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z",
                d2: "",
              },
            },
          },
        },
        {
          link: {
            id: "entrada",
            text: "Entradas de Inventario",
            url: "entradas.html",
            title: "entradas de inventario",
            linkTo: "entrada",
            bootstrapIcon: {
              svg: {
                xmlns: "http://www.w3.org/2000/svg",
                width: "50",
                height: "50",
                fill: "currentColor",
                class: "bi bi-box-arrow-in-left",
                viewBox: "0 0 16 16",
              },
              path: {
                d: "M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0v-2z",
                d2: "M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z",
              },
            },
          },
        },
        {
          link: {
            id: "salida",
            text: "Salidas de Inventario",
            url: "salidas.html",
            title: "salidas de inventario",
            linkTo: "salida",
            bootstrapIcon: {
              svg: {
                xmlns: "http://www.w3.org/2000/svg",
                width: "50",
                height: "50",
                fill: "currentColor",
                class: "bi bi-box-arrow-in-right",
                viewBox: "0 0 16 16",
              },
              path: {
                d: "M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z",
                d2: "M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z",
              },
            },
          },
        },
        {
          link: {
            id: "usuarios",
            text: "Registrar usuarios",
            url: "registrar.html",
            title: "registrar usuarios",
            linkTo: "usuarios",
            bootstrapIcon: {
              svg: {
                xmlns: "http://www.w3.org/2000/svg",
                width: "50",
                height: "50",
                fill: "currentColor",
                class: "bi bi-people-fill",
                viewBox: "0 0 16 16",
              },
              path: {
                d: "M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
                d2: "",
              },
            },
          },
        },
        {
          link: {
            id: "movimientos",
            text: "Registro de movimientos",
            url: "registro.html",
            title: "registro de movimientos",
            linkTo: "movimientos",
            bootstrapIcon: {
              svg: {
                xmlns: "http://www.w3.org/2000/svg",
                width: "50",
                height: "50",
                fill: "currentColor",
                class: "bi bi-folder-fill",
                viewBox: "0 0 16 16",
              },
              path: {
                d: "M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z",
                d2: "",
              },
            },
          },
        },
        {
          link: {
            id: "nuevosElementos",
            text: "Agregar nuevos elementos",
            url: "nuevoElemento.html",
            title: "agregar nuevos elementos",
            linkTo: "addCategoria",
            bootstrapIcon: {
              svg: {
                xmlns: "http://www.w3.org/2000/svg",
                width: "50",
                height: "50",
                fill: "currentColor",
                class: "bi bi-pencil-square",
                viewBox: "0 0 16 16",
              },
              path: {
                d: "M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z",
                d2: "M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z",
              },
            },
          },
        },
        {
          link: {
            id: "exit-item",
            text: "Cerrar sesión",
            url: "inicioSesion.html",
            title: "Salir",
            linkTo: "inicioSesion",
            bootstrapIcon: {
              svg: {
                xmlns: "http://www.w3.org/2000/svg",
                width: "50",
                height: "50",
                fill: "currentColor",
                class: "bi bi-door-closed-fill",
                viewBox: "0 0 16 16",
              },
              path: {
                d: "M12 1a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2a1 1 0 0 1 1-1h8zm-2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
                d2: "",
              },
            },
          },
        },
      ],
    };
  },
  created() {
    this.updateScreenSize();
    window.addEventListener("resize", this.updateScreenSize);
  },
  unmounted() {
    window.removeEventListener("resize", this.updateScreenSize);
  },
  methods: {
    updateScreenSize() {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      this.Desktop();
    },
    Desktop() {
      this.isDesktop = this.screenWidth >= this.limit;
    },
  },
};
</script>
