import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: () => import("../views/Home.vue")},
        { path: "/login", component: () => import("../views/Login.vue")},
        { path: "/register", component: () => import("../views/Register.vue")},
        { path: "/profile", component: () => import("../views/profile/Profile.vue")},
        { path: "/editProfile", component: () => import("../views/profile/EditProfile.vue")},
    ],
});

export default router;