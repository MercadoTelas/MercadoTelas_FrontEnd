<template>
  <input type="checkbox" id="check" v-model="checked" @change="handleCheckboxChange" />

  <div class="container-fluid">
    <div class="row">

      <div id="contentDiv" class="col-lg-9">
        <div class="movement-table">

          <div class="centered-div">
            <h4 class="text-primary">Lista de los últimos movimientos realizados en el inventario</h4>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>Fecha de movimiento</th>
                  <th>Descripción del movimiento</th>
                  <th>Bodega</th>
                  <th>Responsable</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="movement in sortedMovements" :key="movement.id">
                  <td>{{ movement.date }}</td>
                  <td>{{ movement.description }}</td>
                  <td>{{ movement.warehouse }}</td>
                  <td>{{ movement.responsible }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
//import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import Swal from "sweetalert2";

export default {
  name: "MovementTable",
  data() {
    return {
      sortedMovements: [],
      movementsData: [
        {
          id: 1,
          date: "2023-06-01",
          description: "5 entradas de tela Brush Azul",
          warehouse: "Bodega 1",
          responsible: "Andrés Méndez",
        },
        {
          id: 2,
          date: "2023-06-02",
          description: "5 salidas de tela Brush Negra",
          warehouse: "Bodega 2",
          responsible: "Jane Alfaro",
        },
        {
          id: 3,
          date: "2023-06-03",
          description: "3 entradas de rollos de hilo Blanco",
          warehouse: "Bodega 3",
          responsible: "Silvia Castro",
        },
        // Agrega más objetos de movimiento según tu estructura de datos
      ],
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
  mounted() {
    // Llama a la función de actualización del título del navbar
    this.$router.push("/home");
    this.sortedMovements = this.sortMovements();
    this.$state.navbarTitle = "Inicio";
    const user = this.$store.state.user;
    Swal.fire({
      title: "Bienvenido",
      text: "Hola " + user.name + " bienvenido al sistema de inventario del Mercado de las Telas",
      icon: "success",
      confirmButtonText: "Ok",
    });
  },
  methods: {
    ...mapMutations(["toggleCheckboxValue"]),
    handleCheckboxChange() {
      this.toggleCheckboxValue();
    },
    sortMovements() {
      return [...this.movementsData].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    },
  },
};
</script>

<style scoped>
.centered-div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  /* Ajusta la altura según tus necesidades */
}

#check:checked~.container-fluid {
  padding-left: 345px;
}

#check:checked~#contentDiv {
  height: auto;
  display: block;
}

.container-fluid div {
  justify-content: center;
  align-items: center;
}

.movement-table {
  margin: 15px;
}

.header {
  font-size: 24px;
  color: blue;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .header {
    font-size: 18px;
  }

  .table-responsive {
    overflow-x: auto;
  }
}
</style>
