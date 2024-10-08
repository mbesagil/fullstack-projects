import { createApp } from "vue";
import App from "./App.vue";

// vue-router
import router from "./router/index";

//pinia
import { createPinia } from "pinia";
const pinia = createPinia();

//element plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css"; // for change theme mode ('dark' \\ 'light')

//apex chart
import VueApexCharts from "vue3-apexcharts";

import GlobalProperties from "./core/global/GlobalProperties";
import { initKtIcon } from "./core/plugins/keenthemes";

//sweat alert
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

//toastify
import Vue3Toasity, { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";



const app = createApp(App);

GlobalProperties.init(app);
initKtIcon(app);

app.use(router);
app.use(pinia);
app.use(ElementPlus);
app.use(VueApexCharts);
app.use(VueSweetalert2);
app.use(Vue3Toasity, {
  autoClose: 3000,
  theme:
    window.localStorage.getItem("data-theme") != null
      ? window.localStorage.getItem("data-theme")
      : "light",
});
app.mount("#app");
