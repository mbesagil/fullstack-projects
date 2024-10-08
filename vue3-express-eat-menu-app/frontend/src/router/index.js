import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth/authStore";
import ApiService from "@/core/services/ApiService";

const routes = [
  {
    path: "/",
    // redirect: "/",
    component: () => import("../layouts/main-1/MainLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/company",
        // redirect: "/",
        component: () => import("@/views/pages/company/Index.vue"),
      },
      {
        path: "/company/detail/:companyId",
        // redirect: "/",
        component: () => import("@/views/pages/company/Details.vue"),
        props: true,
      },
      {
        path: "/category",
        // redirect: "/",
        component: () => import("@/views/pages/category/Index.vue"),
      },
      {
        path: "/product",
        // redirect: "/",
        component: () => import("@/views/pages/product/Index.vue"),
      },
    ],
  },

  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        path: "/menu/:companyId",
        // redirect: "/",
        component: () => import("@/views/pages/menu/BaseMenu.vue"),
        props: true,
      },
      {
        path: "/menu/products/:categoryId",
        // redirect: "/",
        component: () => import("@/views/pages/menu/Products.vue"),
        props: true,
      },
    ],
  },

  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "/login",
        // redirect: "/",
        component: () =>
          import("../views/authentication/basic-flow/SignIn.vue"),
      },
      {
        path: "/register",
        // redirect: "/",
        component: () =>
          import("../views/authentication/basic-flow/SignUp.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // current page view title
  document.title = `${to.meta.pageTitle || ""} - ${
    import.meta.env.VITE_APP_NAME
  }`;

  // verify auth token before each page change
  // authStore.verifyAuth();

  // before page access check if page requires authentication
  if (to.meta.middleware == "auth") {
    if (authStore.isAuthenticated) {
      ApiService.setHeader(); // egerr authenticated ise barear tokeni set et
      const userData = window.localStorage.getItem("ID_USER");
      if (userData) {
        authStore.user = JSON.parse(userData);
      }

      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
