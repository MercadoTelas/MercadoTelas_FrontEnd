<template>
    <div class="container">
        <div class="row">
            <div class="col-md-8 offset-md-2">
                <div class="mb-3">
                    <label for="search" class="form-label">Buscar usuario:</label>
                    <input type="text" id="search" class="form-control" v-model="searchQuery"
                        placeholder="Buscar por nombre o ID">
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <button @click="addUser" class="btn btn-success">Agregar usuario</button>
                    </div>
                </div>


                <div class="table-responsive">
                    <table class="table table-bordered table-secondary">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>ID</th>
                                <th>Estado</th>
                                <th>Rol</th>
                                <th>Email</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in filteredUsers" :key="user.id">
                                <td>{{ user.name }}</td>
                                <td>{{ user.id_card }}</td>
                                <td>{{ user.status }}</td>
                                <td>{{ user.role }}</td>
                                <td>{{ user.email }}</td>
                                <td>
                                    <button @click="viewUser(user)" class="btn btn-primary">Ver usuario</button>
                                    <button @click="deleteUser(user)" class="btn btn-danger">Eliminar</button>
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
import Swal from 'sweetalert2';
import axios from "axios";
import { API_URL } from "@/config";

export default {
    name: 'UserList',
    data() {
        return {
            users: [
                {
                    name: 'Steven Ramírez',
                    id_card: '123456789',
                    status: 'Activo',
                    role: 'Administrador',
                    email: 'stevenram@example.com'
                },
                {
                    name: 'Carlomagno Jesúspil',
                    id_card: '987654321',
                    status: 'Inactivo',
                    role: 'Usuario',
                    email: 'jesuspil@example.com'
                },
            ],
            searchQuery: '',
        };
    },
    computed: {
        filteredUsers() {
            return this.users.filter((user) => {
                return (
                    user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    user.id_card.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            });
        }
    },
    methods: {
        addUser() {
            // Redireccionar a la vista de registrar usuario
            this.$router.push('/userRegister');
        },
        viewUser(/*user*/) {
            // Lógica para ver los detalles de un usuario
            // ...
        },
        deleteUser(user) {
            // Lógica para eliminar un usuario
            Swal.fire({
                title: '¿Estás seguro?',
                text: `Se eliminará el usuario ${user.name}. Esta acción no se puede deshacer.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Lógica para eliminar el usuario aquí
                    // ...

                    Swal.fire({
                        title: 'Eliminado',
                        text: 'El usuario ha sido eliminado correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        },
    },
    mounted() {
        this.$state.navbarTitle = 'Lista de Usuarios';
        // Obtener todos los usuarios desde la API
        axios.get(API_URL + '/users').then(response => {
            this.users = response.data;
        }).catch(error => {
            console.log(error);
        });
    },
};
</script>
  
<style>
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
  