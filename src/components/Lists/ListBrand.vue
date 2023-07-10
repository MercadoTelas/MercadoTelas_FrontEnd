<template>
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="mb-3">
          <label for="search" class="form-label">Buscar marca:</label>
          <input type="text" id="search" class="form-control" v-model="searchQuery" placeholder="Buscar por nombre" />
        </div>
        <div class="row">
          <div class="col-md-12">
            <button @click="addBrand" class="btn btn-success">
              Agregar marca
            </button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-responsive table-bordered table-secondary">
            <thead>
              <tr>
                <th class="text-center">Nombre de Marca</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="brand in filteredBrands" :key="brand.name">
                <td class="text-center">{{ brand.name }}</td>
                <td class="text-center">
                  <router-link :to="{ name: 'EditBrand', params: { id: brand.id } }"
                    class="btn btn-secondary">Editar</router-link>
                  <button @click="deleteBrand(brand)" class="btn btn-danger">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Swal from "sweetalert2";
import axios from "axios";
import { API_URL } from "@/config";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


export default {
  name: "BrandList",
  data() {
    return {
      brands: [],
      searchQuery: "",
    };
  },
  computed: {
    ...mapState(["checkboxValue"]),
    checked: {
      get() {
        return this.checkboxValue;
      },
    },
    filteredBrands() {
      return this.brands.filter((brand) => {
        return brand.name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
      });
    },
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    addBrand() {
      // Redirigir a la página de agregar marca
      this.$router.push({ name: "AddBrand" });
    },
    deleteBrand(brand) {
      // Lógica para eliminar una marca
      Swal.fire({
        title: "¿Estás seguro?",
        text: `Se eliminará la marca ${brand.name}. Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          toast.success(`Se ha eliminado la marca correctamente`, {
            position: 'top-right',
            timeout: 2000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
          });
        }
      });
    },
  },
  mounted() {
    this.$state.navbarTitle = "Lista de Marcas";
    // Obtener todas las marcas desde la API
    axios
      .get(API_URL + "/brands")
      .then((response) => {
        this.brands = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style>
#check:checked~.container {
  padding-left: 345px;
  max-width: 1500px;
}

.container {
  padding-top: 20px;
  padding-bottom: 20px;
}

.text-primary {
  color: #007bff;
}

.table {
  margin-top: 20px;
}

.table th,
.table td {
  padding: 8px;
  vertical-align: middle;
}

.table th {
  background-color: #f2f2f2;
}

@media (max-width: 576px) {
  .table-responsive {
    overflow-x: auto;
  }
}
</style>

<!--
Componente para listar las marcas

  El componente se llama "BrandList" y muestra una lista de marcas. Permite buscar marcas, agregar nuevas marcas y eliminarlas.

Template:

<input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />: Un checkbox vinculado al dato checked mediante v-model. Cuando el estado del checkbox cambia, se invoca el método handleCheckboxChange.

<div class="container">: El contenedor principal del componente.
<div class="row">: Una fila dentro del contenedor.

<div class="col-md-8 offset-md-2">: Una columna que ocupa 8 columnas en pantallas medianas (md) y se desplaza 2 columnas hacia la derecha utilizando offset-md-2.

<div class="mb-3">: Un contenedor para el campo de búsqueda de marcas.

<label for="search" class="form-label">Buscar marca:</label>: Una etiqueta para el campo de búsqueda.

<input type="text" id="search" class="form-control"
v-model="searchQuery" placeholder="Buscar por nombre" />: Un campo de entrada de texto para ingresar el término de búsqueda, vinculado al dato searchQuery utilizando v-model.

<div class="row">: Una segunda fila dentro del contenedor.

<div class="col-md-12">: Una columna que ocupa todo el ancho en pantallas medianas.

<button @click="addBrand" class="btn btn-success">Agregar marca</button>: Un botón para agregar una nueva marca, que invoca el método addBrand cuando se hace clic.

<div class="table-responsive">: Un contenedor para la tabla de marcas, con una respuesta de diseño flexible.

<table class="table table-responsive table-bordered table-secondary">: La tabla que muestra las marcas.

<thead>: La sección de encabezado de la tabla.

<tr>: Una fila de encabezado.

<th class="text-center">Nombre de Marca</th>: La celda de encabezado que muestra el título "Nombre de Marca".

<tbody>: La sección del cuerpo de la tabla.

<tr v-for="brand in filteredBrands" :key="brand.name">: La directiva v-for itera sobre la lista de marcas filteredBrands y genera una fila por cada marca.

<td class="text-center">{{ brand.name }}</td>: Cada celda de datos muestra el nombre de la marca.

<td class="text-center">: La celda de acciones que contiene botones para editar y eliminar una marca.

<router-link :to="{ name: 'EditBrand', params: { id: brand.id } }" class="btn btn-secondary">Editar</router-link>: Un enlace de enrutamiento que redirige a la página de edición de la marca correspondiente.

<button @click="deleteBrand(brand)" class="btn btn-danger">Eliminar</button>: Un botón para eliminar una marca, que invoca el método deleteBrand cuando se hace clic.

Script:

import { mapState, mapMutations } from "vuex";: Se importan las funciones mapState y mapMutations de Vuex.

import Swal from "sweetalert2";: Se importa la biblioteca SweetAlert2 para mostrar mensajes emergentes de confirmación.
import axios from "axios";: Se importa la biblioteca axios para realizar solicitudes HTTP a la API.

import { API_URL } from "@/config";: Se importa la constante API_URL del archivo de configuración.

import { toast } from 'vue3-toastify';: Se importa la biblioteca vue3-toastify para mostrar notificaciones de éxito.

import 'vue3-toastify/dist/index.css';: Se importan los estilos CSS de vue3-toastify.

name: "BrandList": Define el nombre del componente como "BrandList".

data() { return { ... } }: Define los datos del componente. En este caso, se inicializan dos propiedades: brands, que es un arreglo vacío que almacenará las marcas obtenidas de la API, y searchQuery, que es una cadena vacía que representa el término de búsqueda ingresado por el usuario.

computed: { ... }: Define las propiedades computadas del componente. En este caso, se utiliza la función mapState de Vuex para mapear la propiedad checkboxValue del estado de la aplicación al objeto computado checked. Además, se define la propiedad filteredBrands, que filtra las marcas según el término de búsqueda ingresado por el usuario.

methods: { ... }: Define los métodos del componente. Aquí se encuentran los métodos toggleCheckboxValue, handleCheckboxChange, addBrand y deleteBrand. toggleCheckboxValue es una mutación de Vuex que cambia el valor de checkboxValue. handleCheckboxChange es invocado cuando el usuario cambia el estado del checkbox y llama a toggleCheckboxValue. addBrand redirige al usuario a la página de agregar una nueva marca. deleteBrand muestra un mensaje de confirmación utilizando SweetAlert2 y, si el usuario confirma la acción, elimina la marca y muestra una notificación de éxito utilizando vue3-toastify.

mounted() { ... }: Se ejecuta después de que el componente se haya montado en el DOM. Aquí se actualiza la propiedad navbarTitle del estado de la aplicación y se obtienen todas las marcas desde la API utilizando axios. Los datos obtenidos se asignan a la propiedad brands del componente.
Estilos:

En la sección de estilos, se definen estilos CSS para aplicar a los elementos del componente. Por ejemplo, se establece un ancho máximo y un margen izquierdo a la clase .container cuando el checkbox #check está marcado. También se definen estilos para las tablas, los encabezados y las celdas de la tabla.


-->