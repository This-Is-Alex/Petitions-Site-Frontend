import Vue from 'vue';
import App from './App.vue';

import Register from './components/Register.vue';
import Homepage from './components/Homepage.vue';
import Login from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';
import SearchPetitions from './components/SearchPetitions.vue';
import ManagePetition from './components/ManagePetition.vue';
import DisplayOnePetition from './components/DisplayOnePetition.vue';

import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.config.productionTip = false


Vue.use(VueRouter);
Vue.use(VueAxios, axios);

const routes = [{
        path: "/",
        name: "rootPage",
        component: Homepage
    }, {
        path: "/login",
        name: "loginPage",
        component: Login
    },
    {
        path: "/search",
        name: "searchPage",
        component: SearchPetitions
    },
    {
        path: "/petition/create",
        name: "createPetition",
        component: ManagePetition
    },
    {
        path: "/petition/:petitionId/edit",
        name: "editPetition",
        component: ManagePetition
    },
    {
        path: "/petition/:petitionId",
        name: "displayPetition",
        component: DisplayOnePetition
    },
    {
        path: "/register",
        name: "registerPage",
        component: Register
    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: Dashboard
    }
];

const router = new VueRouter({
    routes: routes,
    mode: 'history'
});

new Vue({
    vuetify,
    el: '#app',
    router: router,
    render: h => h(App)
})