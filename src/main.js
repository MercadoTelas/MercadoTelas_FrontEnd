import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import Home from './components/Home-component.vue';
import Entrada from './components/Entrada-Inventario.vue';
import InventoryTable from './components/InventoryTable.vue';


import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './styles/custom-bootstrap.scss';

// Create the router instance
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/home', component: Home },
        { path: '/entrada', component: Entrada },
        { path: '/inventario', component: InventoryTable}
    ]
});

createApp(App).use(router).mount('#app');
