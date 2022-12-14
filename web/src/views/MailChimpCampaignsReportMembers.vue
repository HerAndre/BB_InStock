<template>
<div class="mx-auto overflow-visible" style="max-width: 1600px">
  <div class="container container-fluid">
    <v-data-table
      dense
      :headers="headers"
      :items="members"
      item-key="name"
      class="elevation-1"
    >

    <template v-slot:[`item.users`]="{ item }">
      <span><router-link :to="`/mailChimp/campaigns/${id}/click-details/${item.id}`">Users</router-link></span>
    </template>
    </v-data-table>
  </div>
  <download-csv
    :json-data="members"
    :csv-title="`${urlId}_${offset}`">
  </download-csv>
  <v-text-field type="number" v-model="count" label="count"/>
  <v-text-field type="number" v-model="offset" label="offset"/>
  <v-btn @click="reloadData()" elevation="2">Refresh</v-btn>
</div>

</template>

<script>

import axios from "axios";
import errorParser from "@/lib/errorParser";

export default {
  props: ['id', 'urlId'],
  data() {
    return {
      offset: 0,
      count: 1000,
      members: [],
      headers: [
      {
        text: 'Email id',
        align: 'start',
        sortable: true,
        value: 'email_id',
      },
      { text: 'Clicks', value: 'clicks' },
      { text: 'Url id', value: 'url_id' },
      ],
      json_fields: {
        'Email': "email_id",
        'Clicks': "clicks",
        'Url id': "url_id",
      },
    }
  },
  async mounted() {
    try {
      const params = { count: this.count, offset: this.offset}
      const { data } = await axios.get(`public/mailChimp/campaigns/${this.id}/click-details/${this.urlId}`, { params } );
      console.log(data)
      this.members = data.members;
      // this.textAreaText = data;
      } catch (error) {
        console.log(errorParser(error))
        // this.textAreaText = errorParser(error);
      }
  },
  methods: {
    async reloadData() {
      const params = { count: this.count, offset: this.offset}
      const { data } = await axios.get(`public/mailChimp/campaigns/${this.id}/click-details/${this.urlId}`, { params } );
      console.log(data)
      this.members = data.members;
    }
  }

}
</script>

<style>

</style>