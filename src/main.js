import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import Home from './components/Home-component.vue';
import Entrada from './components/Entrada-Inventario.vue';
import InventoryTable from './components/InventoryTable.vue';
import EditArticle from './components/EditArticle.vue';
import ViewArticle from './components/ViewArticle.vue';
import AddArticle from './components/AddArticle.vue';


import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './styles/custom-bootstrap.scss';

// Create the router instance
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/home', component: Home },
        { path: '/entrada', component: Entrada },
        { path: '/inventario', component: InventoryTable},
        { path: '/addArticulo', component: AddArticle,},
        { path: '/edit/:id', name: 'EditArticle', component: EditArticle,},
        { path: '/view/:id', name: 'ViewArticle', component: ViewArticle,},
    ]
});

createApp(App).use(router).mount('#app');
