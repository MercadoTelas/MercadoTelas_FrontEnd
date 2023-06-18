import { createApp, reactive } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import store from './store';
import App from './App.vue';
import Home from './components/Home-component.vue';
import UserProfile from './components/UserProfile.vue';
import Entry from './components/Inventory-Entry.vue';
import Transfer from './components/Inventory-Transfer.vue';
import InventoryTable from './components/Lists/InventoryTableCopy.vue';
import RegisterUser from './components/RegisterUser.vue';

//--Editar--
//import EditCategory from './components/Edits/EditCategory.vue';
//import EditSubcategory from './components/Edits/EditSubcategory.vue';
//import EditBrand from './components/Edits/EditBrand.vue';
//import EditDesign from './components/Edits/EditDesign.vue';
//import EditWareHouse from './components/Edits/EditWareHouse.vue';

//--Enlistar--
import ListCategory from './components/Lists/ListCategory.vue';
import ListSubcategory from './components/Lists/ListSubcategory.vue';
import ListBrand from './components/Lists/ListBrand.vue';
import ListDesign from './components/Lists/ListDesign.vue';
import ListWareHouse from './components/Lists/ListWarehouse.vue';
import ListArticle from './components/Lists/ListArticle.vue';

//--Articulos relacionadas--
import ViewArticle from './components/ViewArticle.vue';
import AddArticle from './components/Adds/AddArticle.vue';
import AddCategory from './components/Adds/AddCategory.vue';
import AddBrand from './components/Adds/AddBrand.vue';
import AddSubcategory from './components/Adds/AddSubcategory.vue';
import AddDesign from './components/Adds/AddDesign.vue';
import AddWareHouse from './components/Adds/AddWareHouse.vue';
import EditArticle from './components/Edits/EditArticle.vue';

//--Login--
//import LoginUser from './components/Login/LoginUser.vue';
//import SendEmail from './components/Login/SendEail.vue';
//import ResetPassword from './components/Login/ResetPassword.vue';

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
        { path: '/items/list', component: ListArticle,},
        { path: '/categories/list', component: ListCategory,},
        { path: '/subcategories/list', component: ListSubcategory,},
        { path: '/brands/list', component: ListBrand,},
        { path: '/designs/list', component: ListDesign,},
        { path: '/warehouses/list', component: ListWareHouse,},
        { path: '/userRegister', component: RegisterUser,},
        //{ path: '/login', component: Login,},
        //{ path: '/sendEmail', component: SendEmail,},
        { path: '/edit/:id', name: 'EditArticle', component: EditArticle,},
        { path: '/view/:id', name: 'ViewArticle', component: ViewArticle,},
    ]
});

const app = createApp(App);
app.use(router);
app.use(store);

const state = reactive({
    navbarTitle: 'Inicio'
});

app.config.globalProperties.$state = state;

app.mount('#app');
