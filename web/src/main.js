import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import vuetify from './plugins/vuetify';
import JsonExcel from "vue-json-excel";
import VueJsonToCsv from 'vue-json-to-csv';


Vue.config.productionTip = false;

axios.defaults.baseURL = '/api/';


Vue.component("downloadCsv", VueJsonToCsv);
Vue.component("downloadExcel", JsonExcel);


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
