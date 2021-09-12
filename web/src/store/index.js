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
    searchCount: 0,
    errorCount: 0,
  },
  mutations: {
    commitSku(state, sku) {
      state.sku = sku;
    },
    commitPostalCode(state, postalCode) {
      state.postalCode = postalCode;
    },
    commitIncrementSearchCount(state) {
      state.searchCount = state.searchCount + 1;
    },
    commitIncrementErrorCount(state) {
      state.errorCount = state.errorCount + 1;
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
    incrementSearchCount({ commit }) {
      commit('commitIncrementSearchCount');
    },
    incrementErrorCount({ commit }) {
      commit('commitIncrementErrorCount');
    }
  },
  modules: {},
  plugins: [vuexLocal.plugin],
  getters: {
    getStateKey: (state) => (key) => state[key],
  },
});
