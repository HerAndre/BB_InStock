<template>
<div class="mx-auto overflow-visible" style="max-width: 1600px">
  <div class="container container-fluid">
    <v-data-table
      dense
      :headers="headers"
      :items="urls_clicked"
      item-key="name"
      class="elevation-1"
    >
    <template v-slot:[`item.click_percentage`]="{ item }">
      <span>{{ item.click_percentage.toFixed(2)}}</span>
    </template>
    <template v-slot:[`item.unique_click_percentage`]="{ item }" >
      <span>{{ item.unique_click_percentage.toFixed(2)}}</span>
    </template>
    <template v-slot:[`item.users`]="{ item }">
      <span><router-link :to="`/mailChimp/campaigns/${id}/click-details/${item.id}`">Users</router-link></span>
    </template>
    </v-data-table>
  </div>
  <download-csv
    :json-data="urls_clicked"
    :csv-title="`${id}`">
  </download-csv>
</div>

</template>

<script>

import axios from "axios";
import errorParser from "@/lib/errorParser";

export default {
  props: ['id'],
  data() {
    return {
      urls_clicked: [],
      headers: [
      {
        text: 'Id',
        align: 'start',
        sortable: true,
        value: 'id',
      },
      { text: 'Campaign id', value: 'campaign_id' },
      { text: 'Url', value: 'url' },
      { text: 'Total clicks', value: 'total_clicks' },
      { text: 'Click percentage', value: 'click_percentage' },
      { text: 'Unique clicks', value: 'unique_clicks' },
      { text: 'Unique click percentage', value: 'unique_click_percentage' },
      { text: 'Users', value: 'users' },
      ],
      json_fields: {
        'id': 'id',
        'Campaign id': "campaign_id",
        'Url': "url",
        'Total clicks': "total_clicks",
        'Click percentage': "click_percentage",
        'Unique clicks': "unique_clicks",
        'Unique click percentage': "unique_click_percentage",
      },
    }
  },
  async mounted() {
    try {
      const { data } = await axios.get(`public/mailChimp/campaigns/${this.id}`);
      console.log(data);
      this.urls_clicked = data.urls_clicked;
      this.urls_clicked.forEach(url => {
        delete url._links;
      })
      console.log(this.urls_clicked);
      // this.textAreaText = data;
      } catch (error) {
        console.log(errorParser(error))
        // this.textAreaText = errorParser(error);
      }
  },
  methods: {
    // calculateMinMax(a, b, ...c) {

    // },
  }

}
</script>

<style>

</style>