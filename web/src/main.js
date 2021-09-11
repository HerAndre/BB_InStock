import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import 'mdb-vue-ui-kit/css/mdb.min.css';

Vue.config.productionTip = false;

axios.defaults.baseURL = '/api/';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
