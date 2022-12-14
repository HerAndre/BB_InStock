import Vue from 'vue';
import VueRouter from 'vue-router';
// import Home from '@/views/Home.vue';
// import GoogleAnalytics from '@/views/GoogleAnalytics.vue';
import MailChimp from '@/views/MailChimp.vue';
// import MailChimpListMembers from '@/views/MailChimpListMembers.vue';
import MailChimpCampaigns from '@/views/MailChimpCampaigns.vue';
import MailChimpCampaignsReport from '@/views/MailChimpCampaignsReport.vue';
import MailChimpCampaignsReportMembers from '@/views/MailChimpCampaignsReportMembers.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MailChimpCampaigns,
    props: true
  },
  // {
  //   path: '/stats',
  //   name: 'Statistics',
  //   component: GoogleAnalytics,
  //   props: true
  // },
  {
    path: '/mailChimp',
    name: 'MailChimp',
    component: MailChimp,
    props: true
  },
  // {
  //   path: '/mailChimp/lists',
  //   name: 'MailChimpMembers',
  //   component: MailChimpListMembers,
  //   props: (route) => {
  //     return {id : route.query.id};
  //   },
  // },
  {
    path: '/mailChimp/campaigns',
    name: 'MailChimpCampaigns',
    component: MailChimpCampaigns,
    props: true
  },
  {
    path: '/mailChimp/campaigns/:id',
    name: 'MailChimpCampaignsReport',
    component: MailChimpCampaignsReport,
    props: true
  },
  {
    path: '/mailChimp/campaigns/:id/click-details/:urlId',
    name: 'MailChimpCampaignsReportMembers',
    component: MailChimpCampaignsReportMembers,
    props: true
  },



];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
