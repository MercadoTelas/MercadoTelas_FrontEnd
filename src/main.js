import { createApp, reactive } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import store from './store';
import App from './App.vue';
import Home from './components/Home-component.vue';
import UserProfile from './components/UserProfile.vue';
import Entry from './components/Inventory-Entry.vue';
import Transfer from './components/Inventory-Transfer.vue';
import InventoryTable from './components/InventoryTable.vue';
import EditArticle from './components/EditArticle.vue';
import ViewArticle from './components/ViewArticle.vue';
import AddArticle from './components/AddArticle.vue';
import AddCategory from './components/AddCategory.vue';
import AddBrand from './components/AddBrand.vue';
import AddSubcategory from './components/AddSubcategory.vue';
import AddDesign from './components/AddDesign.vue';
import AddWareHouse from './components/AddWareHouse.vue';
//import RegisterUser from './components/RegisterUser.vue';
//import LoginUser from './components/LoginUser.vue';
//import SendEMail from './components/SendEail.vue';
import ResetPassword from './components/ResetPassword.vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/custom-bootstrap.scss';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/home', component: Home },
        { path: '/userProfile', component: UserProfile },
        { path: '/entry', component: Entry },
        { path: '/transfer', component: Transfer },
        { path: '/inventory', component: InventoryTable},
        { path: '/items/new', component: AddArticle,},
        { path: '/categories/new', component: AddCategory,},
        { path: '/subcategories/new', component: AddSubcategory,},
        { path: '/brands/new', component: AddBrand,},
        { path: '/designs/new', component: AddDesign,},
        { path: '/warehouses/new', component: AddWareHouse,},
        { path: '/userRegister', component: ResetPassword,},
        //{ path: '/login', component: Login,},
        //{ path: '/sendEmail', component: SendEMail,},
        { path: '/edit/:id', name: 'EditArticle', component: EditArticle,},
        { path: '/view/:id', name: 'ViewArticle', component: ViewArticle,},
    ]
});

const app = createApp(App);
app.use(router);

const state = reactive({
    navbarTitle: 'Inicio'
});

app.config.globalProperties.$state = state;

app.mount('#app');
