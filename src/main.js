import {createApp, reactive} from 'vue';
import {createRouter, createWebHistory} from 'vue-router';

//-- Archivo JavaScript para guardar parámetros durante sesión
import store from './store';

//--Inicio--
import Home from './components/Home/Home-component.vue';

//Vistas del diseño
import UserProfile from './components/GeneralLayout/UserProfile.vue';
import App from './App.vue';


//--Vistas transaccionales--
import Entry from './components/Transactional/Inventory-Entry.vue';
import Transfer from './components/Transactional/Inventory-Transfer.vue';
import Output from './components/Transactional/Inventory-Output.vue'

//--Enlistar--
import InventoryTable from './components/Lists/ListInventory.vue';
import ListCategory from './components/Lists/ListCategory.vue';
import ListSubcategory from './components/Lists/ListSubcategory.vue';
import ListBrand from './components/Lists/ListBrand.vue';
import ListDesign from './components/Lists/ListDesign.vue';
import ListWareHouse from './components/Lists/ListWarehouse.vue';
import ListArticle from './components/Lists/ListArticle.vue';
import ListUser from './components/Lists/ListUsers.vue';
import ListTransaction from "./components/Lists/ListTransaction.vue";

//--Articulos relacionadas--
import AddArticle from './components/Adds/AddArticle.vue';
import AddCategory from './components/Adds/AddCategory.vue';
import AddBrand from './components/Adds/AddBrand.vue';
import AddSubcategory from './components/Adds/AddSubcategory.vue';
import AddDesign from './components/Adds/AddDesign.vue';
import AddWareHouse from './components/Adds/AddWareHouse.vue';

//--Login--
import LoginUser from './components/Login/LoginUser.vue';
import RegisterUser from './components/Login/RegisterUser.vue';
import SendEmail from './components/Login/SendEmail.vue';
import ResetPassword from './components/Login/ResetPassword.vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/custom-bootstrap.scss';


const router = createRouter({
    history: createWebHistory('/MercadoTelas_FrontEnd/'),
    routes: [
        {
            path: '',
            redirect: '/login',
        },
        {
            path: '/',
            component: '/login',
        },
        {
            path: '/login',
            component: LoginUser,
        },
        {
            component: App,
            meta: {requiresAuth: true},
        },
        {
      path: '/home',
      component: Home,
      meta: { requiresAuth: true },
        },
        {path: '/userProfile', component: UserProfile, meta: {requiresAuth: true},},
        {path: '/entry', name:'Entry', component: Entry, meta: {requiresAuth: true}},
        {path: '/Entry-from-home/:warehouse', name:'Entry-from-home', component: Entry, meta: {requiresAuth: true}},
        {path: '/transfer', component: Transfer, meta: {requiresAuth: true}},
        {path: '/output', component: Output, meta: {requiresAuth: true}},
        { path: '/inventory', component: InventoryTable, meta: { requiresAuth: true }, },
        { path: '/items/new/', name: 'AddArticle', component: AddArticle, meta: { requiresAuth: true },},
        { path: '/items/edit/:id', name: 'EditArticle', component: AddArticle, meta: { requiresAuth: true },},
        { path: '/items/details/:id', name: 'ArticleDetails', component: AddArticle, meta: { requiresAuth: true },},
        { path: '/categories/new', name: 'AddCategory', component: AddCategory, meta: { requiresAuth: true },},
        { path: '/categories/edit/:id', name: 'EditCategory', component: AddCategory, meta: { requiresAuth: true },},
        { path: '/subcategories/new', name: 'AddSubcategory', component: AddSubcategory, meta: { requiresAuth: true },},
        { path: '/subcategories/edit/:id', name: 'EditSubcategory', component: AddSubcategory, meta: { requiresAuth: true },},
        { path: '/brands/new', name: 'AddBrand', component: AddBrand, meta: { requiresAuth: true },},
        { path: '/brands/edit/:id', name: 'EditBrand', component: AddBrand, meta: { requiresAuth: true },},
        { path: '/designs/new', name: 'AddDesign', component: AddDesign, meta: { requiresAuth: true },},
        { path: '/designs/edit/:id', name: 'EditDesign', component: AddDesign, meta: { requiresAuth: true },},
        { path: '/warehouses/new', name: 'AddWarehouse', component: AddWareHouse, meta: { requiresAuth: true },},
        { path: '/warehouses/edit/id', name: 'EditWarehouse', component: AddWareHouse, meta: { requiresAuth: true },},
        { path: '/items', name: "Items" , component: ListArticle, meta: { requiresAuth: true },},
        { path: '/categories', component: ListCategory, meta: { requiresAuth: true },},
        { path: '/subcategories', component: ListSubcategory, meta: { requiresAuth: true },},
        { path: '/brands', component: ListBrand, meta: { requiresAuth: true },},
        { path: '/designs', component: ListDesign, meta: { requiresAuth: true },},
        { path: '/warehouses', component: ListWareHouse, meta: { requiresAuth: true },},
        {path: '/users', component: ListUser, meta: {requiresAuth: true},},
        {path: '/users/new', name: 'AddUser', component: RegisterUser, meta: {requiresAuth: true},},
        {path: '/login', component: LoginUser,},
        {path: '/sendEmail', component: SendEmail,},
        {path: '/resetPassword', component: ResetPassword,},
        {path: '/transactions', name: 'ListTransaction', component: ListTransaction, meta: {requiresAuth: true},},
    ]
});

const app = createApp(App);
app.use(store);
app.use(router);
//app.use(Toasted);


// Agregar un guardia de navegación para verificar la autenticación en las rutas con requiresAuth: true
router.beforeResolve((to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

    if (!store.state.isLoggedIn && requiresAuth) {
        next('/login');
    } else {
        next();
    }
});

const state = reactive({
    navbarTitle: 'Inicio'
});

app.config.globalProperties.$state = state;

app.mount('#app');
