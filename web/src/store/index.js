import Vue from 'vue';
import VuexPersistence from 'vuex-persist';
import Vuex from 'vuex';
import router from '../router';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sku: "",
    postalCode: "",
  },
  mutations: {
    commitSku(state, sku) {
      state.sku = sku;
    },
    commitPostalCode(state, postalCode) {
      state.postalCode = postalCode;
    },
  },
  actions: {
    setSku({ commit }, sku) {
      router.replace({
        query: { ...router.currentRoute.query, sku },
      }).catch(err => {
        // Ignore the vuex err regarding  navigating to the page they are already on.
        if (
          err.name !== 'NavigationDuplicated' &&
          !err.message.includes('Avoided redundant navigation to current location')
        ) {
          // But print any other errors to the console
          console.error(err);
        }
      });
      commit('commitSku', sku);
    },
    setPostalCode({ commit }, postalCode) {
      router.replace({
        query: { ...router.currentRoute.query, postalCode },
      }).catch(err => {
        // Ignore the vuex err regarding  navigating to the page they are already on.
        if (
          err.name !== 'NavigationDuplicated' &&
          !err.message.includes('Avoided redundant navigation to current location')
        ) {
          // But print any other errors to the console
          console.error(err);
        }
      });
      commit('commitPostalCode', postalCode);
    },
  },
  modules: {},
  plugins: [vuexLocal.plugin],
  getters: {
    getStateKey: (state) => (key) => state[key],
  },
});
