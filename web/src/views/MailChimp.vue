<template>
<div class="mx-auto overflow-visible" style="max-width: 868px">
  <div class="container container-fluid">
    <v-data-table
      dense
      :headers="headers"
      :items="lists"
      item-key="name"
      class="elevation-1"

    >
    <template v-slot:[`item.stats.click_rate`]="{ item }">
      <span>{{ item.stats.click_rate.toFixed(2)}}</span>
    </template>
    <template v-slot:[`item.stats.open_rate`]="{ item }">
      <span>{{ item.stats.open_rate.toFixed(2)}}</span>
    </template>
    <template v-slot:[`item.stats.member_count`]="{ item }">
      <span><router-link :to="`/mailChimp/lists?id=${item.id}`">{{item.stats.member_count}}</router-link></span>
    </template>
    </v-data-table>
  </div>
  <download-excel :data="lists" :fields="json_fields">
    Download Data
  </download-excel>
</div>

</template>

<script>

import axios from "axios";
import errorParser from "@/lib/errorParser";

export default {
  data() {
    return {
      lists: [],
      headers: [
      {
        text: 'List Id',
        align: 'start',
        sortable: true,
        value: 'id',
      },
      { text: 'Name', value: 'name' },
      { text: 'Member Count', value: 'stats.member_count' },
      { text: 'Click rate', value: 'stats.click_rate' },
      { text: 'Open rate', value: 'stats.open_rate' },
      { text: 'Average sub rate', value: 'stats.avg_sub_rate' },
      { text: 'Average unsub rate', value: 'stats.avg_unsub_rate' },
      ],
      json_fields: {
        id: "id",
        Name: "name",
        "Member count": "stats.member_count",
        "Click rate": "stats.click_rate",
        "Open rate": "stats.open_rate",
        "Average sub rate": "stats.avg_sub_rate",
        "Average unsub rate": "stats.avg_unsub_rate",

      },
    }
  },
  async mounted() {
    try {
      const { data } = await axios.get(`public/mailChimp/`);
      for (const key in data) {
        data[key] = (({ id, name, stats }) =>
        ({ id, name, stats }))(data[key]);
      }
      this.lists = data;
      console.log(this.lists)
      // this.textAreaText = data;
      } catch (error) {
        console.log(errorParser(error))
        // this.textAreaText = errorParser(error);
      }
  },
  methods: {
    exportToCsv(filename, rows) {
      var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            }
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
          }
        return finalVal + '\n';
      };

      var csvFile = '';
      for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
      }

      var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
      } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    }
  }

}
</script>

<style>

</style>