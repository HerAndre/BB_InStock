import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import vuetify from './plugins/vuetify';
import VueGtag from 'vue-gtag';

Vue.config.productionTip = false;

axios.defaults.baseURL = '/api/';

Vue.use(VueGtag, {
  config: { id: "UA-219199426-2" }
}, router);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
