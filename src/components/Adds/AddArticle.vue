<template>
  <input
      id="check"
      v-model="checked"
      type="checkbox"
      @change="handleCheckboxChange"
  />

  <div class="add-item container">
    <form class="form-estilo" @submit.prevent="onSubmit">
      <div class="mb-lg-5">
        <div class="text-center mb-lg-2">
          <h2>Detalles del artículo</h2>
        </div>
        <div class="table-responsive-lg">
          <table class="table table-bordered table-secondary">
            <tbody>
            <tr>
              <td class="table-label">Código:</td>
              <td class="table-input" colspan="5">
                <div class="input-group">
                  <span class="input-group-text"
                  ><i class="bi bi-123"></i
                  ></span>
                  <input
                      id="id"
                      v-model="id"
                      :readonly="isReadOnly"
                      class="form-control"
                      type="text"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td class="table-label">Nombre:</td>
              <td class="table-input" colspan="5">
                <div class="input-group">
                  <span class="input-group-text"
                  ><i class="bi bi-person-badge-fill"></i
                  ></span>
                  <input
                      id="name"
                      v-model="name"
                      :readonly="isReadOnly"
                      class="form-control"
                      type="text"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td class="table-label">Stock Mínimo:</td>
              <td class="table-input" colspan="2">
                <div class="input-group">
                  <span class="input-group-text"
                  ><i class="bi bi-dash-square-fill"></i
                  ></span>
                  <input
                      id="minimal_stock"
                      v-model="minimal_stock"
                      :readonly="isReadOnly"
                      class="form-control"
                      type="number"
                  />
                </div>
              </td>
              <td class="table-label">Factor de Conversión:</td>
              <td class="table-input" colspan="2">
                <div class="input-group">
                  <div
                      class="item"
                      style="margin-right: 8px; margin-top: 6px; height: 15px"
                  >
                    <i class="bi bi-info-circle" style="font-size: 15px"></i>
                    <div class="text-area">
                      <span class="text"
                      >Factor de conversión corresponde a cuántas unidades de
                        venta equivalen a 1 unidad de inventario</span
                      >
                    </div>
                  </div>
                  <span class="input-group-text"
                  ><i class="bi bi-input-cursor"></i
                  ></span>
                  <input
                      id="conversion_factor"
                      v-model="conversion_factor"
                      :readonly="isReadOnly"
                      class="form-control"
                      type="number"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td class="table-label">Unidades de Inventario:</td>
              <td class="table-input" colspan="2">
                <div class="input-group">
                  <span class="input-group-text"
                  ><i class="bi bi-postcard"></i
                  ></span>
                  <input
                      id="storing_format_units_name"
                      v-model="storing_format_units_name"
                      :readonly="isReadOnly"
                      class="form-control"
                      type="text"
                  />
                </div>
              </td>
              <td class="table-label">Unidades de Venta:</td>
              <td class="table-input" colspan="2">
                <div class="input-group">
                  <span class="input-group-text"
                  ><i class="bi bi-postcard"></i
                  ></span>
                  <input
                      id="transferring_format_units_name"
                      v-model="transferring_format_units_name"
                      :readonly="isReadOnly"
                      class="form-control"
                      type="text"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td class="table-label">Categoría:</td>
              <td class="table-input" colspan="5">
                <div class="input-group">
                  <span class="input-group-text"
                  ><i class="bi bi-tag-fill"></i
                  ></span>
                  <select
                      id="category"
                      v-model="filter.category"
                      :disabled="isReadOnly"
                      class="form-select"
                      @change="onCategoryChange"
                  >
                    <option disabled value="">Seleccionar categoría</option>
                    <option
                        v-for="category in categories"
                        :key="category.name"
                        :value="category.name"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </td>
            </tr>
            <tr>
              <td class="table-label">Subcategoría:</td>
              <td class="table-input" colspan="5">
                <div class="input-group">
                  <span class="input-group-text"
                  ><i class="bi bi-tags"></i
                  ></span>
                  <select
                      id="subcategory"
                      v-model="subcategory_id"
                      :disabled="isReadOnly"
                      class="form-select"
                  >
                    <option disabled selected value="">
                      Seleccionar subcategoría
                    </option>
                    <option
                        v-for="subcategory in filteredSubcategories"
                        :key="subcategory.name"
                        :value="subcategory.id"
                    >
                      {{ subcategory.name }}
                    </option>
                  </select>
                </div>
              </td>
            </tr>
            <tr>
              <td class="table-label">Diseño:</td>
              <td class="table-input" colspan="5">
                <div class="input-group">
                  <span class="input-group-text"
                  ><i class="bi bi-x-diamond-fill"></i
                  ></span>
                  <select
                      id="design"
                      v-model="design_id"
                      :disabled="isReadOnly"
                      class="form-select"
                  >
                    <option value="">No posee</option>
                    <option
                        v-for="design in designs"
                        :key="design.id"
                        :value="design.id"
                    >
                      {{ design.name }}
                    </option>
                  </select>
                </div>
              </td>
            </tr>
            <tr>
              <td class="table-label">Marca:</td>
              <td class="table-input" colspan="5">
                <div class="input-group">
                  <span class="input-group-text"
                  ><i class="bi bi-medium"></i
                  ></span>
                  <select
                      id="brand"
                      v-model="brand_id"
                      :disabled="isReadOnly"
                      class="form-select"
                  >
                    <option value="">No posee</option>
                    <option
                        v-for="brand in brands"
                        :key="brand.id"
                        :value="brand.id"
                    >
                      {{ brand.name }}
                    </option>
                  </select>
                </div>
              </td>
            </tr>
            <tr v-if="!isReadOnly">
              <td class="table-label">Imagen:</td>
              <td class="table-input" colspan="5">
                <!-- Mostrar la imagen si image_url está disponible -->
                <div v-if="image_url && isReadOnly">
                  <img :src="image_url" alt="Imagen del artículo" style="max-width: 100px;">
                </div>
                <div v-else-if="!image_url && isReadOnly">
                  <span>No hay imagen disponible</span>
                </div>
                <!-- Mostrar el input para subir la imagen si no está disponible -->
                <div v-else>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-card-image"></i></span>
                    <input id="image" accept="image/*" class="form-control" type="file" @change="handleImageChange">
                  </div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="isReadOnly" class="mt-lg-4 mb-lg-5">
        <div class="row">
          <div class="text-center">
            <h4>Inventario en bodegas</h4>
          </div>
          <div class="mt-lg-1 table-responsive-lg">
            <table
                :class="{ 'table-sm': isSmallScreen }"
                class="table table-hover table-secondary table-striped"
            >
              <thead>
              <tr>
                <th class="text-center">Bodega</th>
                <th class="text-center">Stock en bodega</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="inventory_item in inventory_items"
                  :key="inventory_item.id"
              >
                <td class="text-center">{{ inventory_item.warehouse }}</td>
                <td class="text-center">
                  {{ inventory_item.storing_format_units }}
                  {{ storing_format_units_name }}
                </td>
              </tr>
              <tr>
                <td class="text-center fw-bold">Total</td>
                <td class="text-center fw-bold">
                  {{ calculateStockUnits() }} {{ storing_format_units_name }}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="text-center mt-lg-4">
        <button
            v-if="!isReadOnly"
            class="btn btn-primary btn-save"
            type="submit"
        >
          Guardar
        </button>
        <router-link
            class="btn btn-danger btn-save"
            to="#"
            type="button"
            @click="goToPreviousPage()"
        >
          Volver
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import axios from "axios";
import {toast} from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import {API_URL} from "@/config";

export default {
  data() {
    return {
      filter: {
        category: "",
      },
      complete_id: "",
      id: "",
      name: "",
      minimal_stock: "",
      storing_format_units_name: "",
      transferring_format_units_name: "",
      conversion_factor: "",
      subcategory_id: "",
      design_id: "",
      brand_id: "",
      categories: [],
      designs: [],
      brands: [],
      inventory_items: [],
      isReadOnly: false,
      mode: "",
      isSmallScreen: false,
      image_url: null,
    };
  },
  computed: {
    ...mapState(["checkboxValue"]),
    checked: {
      get() {
        return this.checkboxValue;
      },
    },
    filteredSubcategories() {
      const selectedCategory = this.categories.find(
          (category) => category.name === this.filter.category
      );
      if (selectedCategory) {
        return selectedCategory.subcategories;
      }
      return [];
    },
  },
  created() {
    const idParam = this.$route.params.id;
    if (idParam) {
      this.fetchItemData(idParam);
    } else {
      this.fetchNewItemData();
    }
    if (window.location.href.includes("details")) {
      this.isReadOnly = true;
      this.$state.navbarTitle = "Detalles";
    }
  },
  mounted() {
    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkScreenSize);
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    handleImageChange(event) {
      this.image = event.target.files[0];
    },
    onCategoryChange() {
      this.filter.subcategory = "";
    },
    calculateStockUnits() {
      let totalUnits = 0;
      this.inventory_items.forEach((inventoryItem) => {
        const units = parseFloat(inventoryItem.storing_format_units);
        if (!isNaN(units)) {
          totalUnits += units;
        }
      });
      return totalUnits;
    },
    fetchNewItemData() {
      this.$state.navbarTitle = "Agregar Nuevo Artículo";
      this.mode = "new";
      axios
          .get(`${API_URL}/new_item`)
          .then((response) => {
            this.categories = response.data.categories;
            this.designs = response.data.designs;
            this.brands = response.data.brands;
          })
          .catch((error) => {
            console.log(error);
          });
    },
    fetchItemData(itemId) {
      this.mode = "edit";
      this.$state.navbarTitle = "Editar Artículo";
      axios
          .get(`${API_URL}/new_item`)
          .then((response) => {
            this.categories = response.data.categories;
            this.designs = response.data.designs;
            this.brands = response.data.brands;
          })
          .catch((error) => {
            console.log(error);
          });
      axios
          .get(`${API_URL}/items/${itemId}`)
          .then((response) => {
            const itemData = response.data;
            this.complete_id = itemData.item.id;
            this.id = itemData.item.id.substring(0, itemData.item.id.indexOf("_"));
            this.name = itemData.item.name;
            this.minimal_stock = itemData.item.minimal_stock;
            this.storing_format_units_name =
                itemData.item.storing_format_units_name;
            this.transferring_format_units_name =
                itemData.item.transferring_format_units_name;
            this.conversion_factor = itemData.item.conversion_factor;
            this.filter.category = itemData.item.category_name;
            this.subcategory_id = itemData.item.subcategory_id;
            this.design_id = itemData.item.design_id || "";
            this.brand_id = itemData.item.brand_id || "";
            this.inventory_items = itemData.inventory_items;
            this.image_url = response.data.image_url;
          })
          .catch((error) => {
            console.log(error);
          });
    },
    onSubmit() {
      let item = {
        id: this.$route.params.id !== undefined ? this.complete_id : this.id,
        name: this.name,
        minimal_stock: this.minimal_stock,
        storing_format_units_name: this.storing_format_units_name,
        transferring_format_units_name: this.transferring_format_units_name,
        conversion_factor: this.conversion_factor,
        subcategory_id: this.subcategory_id,
        design_id: this.design_id,
        brand_id: this.brand_id,
        image: this.image,
      };
      item.user = this.$store.state.user.id;
      if (this.mode === "edit") {
        this.updateItem(item);
      } else {
        this.createItem(item);
      }
    },
    updateItem(item) {
      let formData = new FormData();
      for (let key in item) {
        formData.append(key, item[key]);
      }
      axios
          .put(`${API_URL}/items/${this.complete_id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(async () => {
            toast.success("Artículo actualizado exitosamente", {timeout: 2000});
            await new Promise((resolve) => setTimeout(resolve, 2000));
            this.$router.push("/items");
          })
          .catch(async (error) => {
            console.log(error);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            toast.error("Error al actualizar artículo", {closeOnClick: false});
          });
    },
    goToPreviousPage() {
      this.$router.go(-1);
    },
    createItem(item) {
      let formData = new FormData();
      for (let key in item) {
        formData.append(key, item[key]);
      }
      axios
          .post(`${API_URL}/items`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(async () => {
            toast.success("Artículo creado exitosamente", {timeout: 2000});
            await new Promise((resolve) => setTimeout(resolve, 2000));
            this.$router.push("/items");
          })
          .catch(async (error) => {
            console.log(error);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            toast.error("Error al crear artículo", {closeOnClick: false});
          });
    },
    checkScreenSize() {
      this.isSmallScreen = window.innerWidth < 1000;
    },
  },
};
</script>

<style scoped>
#check:checked ~ .container {
  padding-left: 345px;
  max-width: 1000px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.text-area {
  position: absolute;
  z-index: 1;
  bottom: 110%;
  left: 2%;
  transform: translateX(-50%);
  width: 250px;
  height: 100px;
  background-color: #15386e;
  border-radius: 10px;
  opacity: 0;
  transition: opacity 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.text {
  font-size: 15px;
  color: white;
  text-align: center;
  padding: 10px;
  opacity: 0;
  transition: opacity 0.3s;
}

.item:hover .text-area {
  opacity: 1;
  animation: emerge 0.5s linear forwards;
}

.item:hover .text {
  opacity: 1;
  animation: fade-in 0.5s linear forwards;
}

@keyframes emerge {
  0% {
    transform: translateX(-50%) scale(0);
  }
  100% {
    transform: translateX(-50%) scale(1);
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.table-responsive-lg {
  overflow-x: auto;
}

.table-sm td,
.table-sm th {
  padding: 0.5rem;
}

@media (max-width: 1000px) {
  #check:checked ~ .container {
    padding-left: 100px;
  }

  .container {
    padding-left: 40px;
    overflow-x: auto;
    max-width: 600px;
  }

  .table {
    min-width: 1000px;
    overflow-x: auto;
  }
}
</style>