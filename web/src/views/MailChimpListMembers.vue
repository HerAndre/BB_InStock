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
    </v-data-table>
  </div>
  <download-excel :data="members" :fields="json_fields">
    Download Data
  </download-excel>
</div>

</template>

<script>

import axios from "axios";
import errorParser from "@/lib/errorParser";

export default {
  props: ['id'],
  data() {
    return {
      members: [],
      headers: [
      {
        text: 'Email',
        align: 'start',
        sortable: true,
        value: 'email_address',
      },
      { text: 'Timezone', value: 'location.timezone' },
      { text: 'Member rating', value: 'member_rating' },
      { text: 'Average click rate', value: 'stats.avg_click_rate' },
      { text: 'Average open rate', value: 'stats.avg_open_rate' },
      { text: '00c834db7c', value: 'interests.00c834db7c' },
      { text: '5d05d19f96', value: 'interests.5d05d19f96' },
      { text: '8e207b4609', value: 'interests.8e207b4609' },
      { text: '806c9185d5', value: 'interests.806c9185d5' },
      { text: 'df55662b3b', value: 'interests.df55662b3b' },
      { text: 'f49f4dca27', value: 'interests.f49f4dca27' },
      ],
      json_fields: {
        'Email': "email_address",
        'Timezone': "location.timezone",
        "Member rating": 'member_rating',
        "Average click rate": "stats.avg_click_rate",
        "Average open rate": "stats.avg_open_rate",
        '00c834db7c':'interests.00c834db7c',
        '5d05d19f96':'interests.5d05d19f96',
        '8e207b4609':'interests.8e207b4609',
        '806c9185d5':'interests.806c9185d5',
        'df55662b3b':'interests.df55662b3b',
        'f49f4dca27':'interests.f49f4dca27',
      },
    }
  },
  async mounted() {
    try {
      const { data } = await axios.get(`public/mailChimp/lists/${this.id}/members`);

      this.members = data;
      console.log(this.members)
      // this.textAreaText = data;
      } catch (error) {
        console.log(errorParser(error))
        // this.textAreaText = errorParser(error);
      }
  },
  methods: {
  }

}
</script>

<style>

</style>