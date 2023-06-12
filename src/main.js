import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import Home from './components/Home-component.vue';
import Entrada from './components/Entrada-Inventario.vue';
import InventoryTable from './components/InventoryTable.vue';
import EditArticle from './components/EditArticle.vue';
import ViewArticle from './components/ViewArticle.vue';
import AddArticle from './components/AddArticle.vue';
import AddCategory from './components/AddCategory.vue';
import AddBrand from './components/AddBrand.vue';
import AddSubcategory from './components/AddSubcategory.vue';
import AddDesign from './components/AddDesign.vue';
import AddWareHouse from './components/AddWareHouse.vue';


import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/custom-bootstrap.scss';


// Create the router instance
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/home', component: Home },
        { path: '/entry', component: Entrada },
        { path: '/inventory', component: InventoryTable},
        { path: '/items/new', component: AddArticle,},
        { path: '/categories/new', component: AddCategory,},
        { path: '/subcategories/new', component: AddSubcategory,},
        { path: '/brands/new', component: AddBrand,},
        { path: '/designs/new', component: AddDesign,},
        { path: '/warehouses/new', component: AddWareHouse,},
        { path: '/edit/:id', name: 'EditArticle', component: EditArticle,},
        { path: '/view/:id', name: 'ViewArticle', component: ViewArticle,},
    ]
});

createApp(App).use(router).mount('#app');