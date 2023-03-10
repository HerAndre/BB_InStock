import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import GoogleAnalytics from '@/views/GoogleAnalytics.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: (route) => {
      const { sku, postalCode } = route.query;
      return {
        sku: Number.parseInt(sku, 0) || "",
        postalCode: Number.parseInt(postalCode, 0) || "",
      };
    },
  },
  {
    path: '/stats',
    name: 'Statistics',
    component: GoogleAnalytics,
    props: true
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
