<template>
  <div class="mx-auto overflow-visible" style="max-width: 1600px">
    <div v-if="dataLoaded" class="text-right mt-2"> <v-btn color="blue" @click="togglePredictOpenRateView">{{togglePredictOpenRateViewButton}}</v-btn></div>
    <div v-if="predictOpenRateViewVisible">
      <div class="container">
        <div class="row" style="margin-top:2cm;">
          <div class="col-6 mx-auto">
            <v-text-field
                v-model="subject"
                label="Enter Sample Subject"
                :rules="rules"
                hide-details="auto"
              ></v-text-field>
          </div>
        </div>
        <div class="row text-left">
          <div class="col-6 mx-auto">
            <div class="mt-2" v-if="open_rate_probability && !predicting">
              <h3 >The subject line is projected to be {{ betterOrWorse }} than the average</h3>
              <h4>Subject strength: {{averageCoeff.toFixed(3)}}</h4>
            </div>
          </div>
        </div>
        <div class="row text-right">
          <div class="col-6 mx-auto">
            <v-btn
              color="primary"
              :disabled="subject.length === 0"
              @click="predictSubject()"
            >
              Submit
            </v-btn>
          </div>
        </div>
        <div class="row">
          <div class="col-6 mx-auto mb-5">
          <h3 class="mb-3">Subject Matched Words</h3>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      Word
                    </th>
                    <th class="text-left">
                      Coefficient
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in matchingCoeffWords"
                    :key="i">
                    <td>
                      <h3 style="color:green">{{ Object.keys(item)[0] }}</h3>
                      <!-- <h3 v-else>{{ Object.keys(item)[0] }}</h3> -->
                    </td>
                    <td><h3>{{ Object.values(item)[0].toFixed(3) }}</h3></td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </div>
      <div class="row mt-5">
        <div class="col-6 mx-auto">
        <hr>
          <h3 class="my-3">All Words</h3>
          <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      Word
                    </th>
                    <th class="text-left">
                      Coefficient
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in coeffs"
                    :key="i">
                    <td>
                      <h3 v-if="subject.toLowerCase().includes(Object.keys(item)[0])" style="color:green">{{ Object.keys(item)[0] }}</h3>
                      <h3 v-else>{{ Object.keys(item)[0] }}</h3>
                    </td>
                    <td><h3>{{ Object.values(item)[0].toFixed(3) }}</h3></td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
        </div>
      </div>
      </div>
    </div>
    <div v-if="!predictOpenRateViewVisible" class="container container-fluid">
      <v-data-table
        v-if="campaigns.length >= 1"
        dense
        :headers="headers"
        :items="campaigns"
        :items-per-page="4"
        item-key="name"
        class="elevation-1"
      >
        <template v-slot:[`item.id`]="{ item }">
          <span>
            <!-- <router-link :to="`/mailChimp/campaigns/${item.id}`">{{
              item.id
            }}</router-link> -->
            {{item.id}}
          </span>
        </template>
        <template v-slot:[`item.opens.open_rate`]="{ item }">
          <span v-if="item.opens"
            >{{ (item.opens.open_rate * 100).toFixed(2) }}%</span
          >
        </template>
        <template v-slot:[`item.campaign_title`]="{ item }">
          <span
            :style="`background-color: ${pSBC(
              percentOfMax(item.clicks.click_rate),
              'rgb(255,255,255)',
              'rgb(0,195,0)'
            )}`"
            v-if="item"
            >{{ item.campaign_title }}</span
          >
        </template>
        <template v-slot:[`item.clicks.click_rate`]="{ item }">
          <span
            :style="`background-color: ${pSBC(
              percentOfMax(item.clicks.click_rate),
              'rgb(255,255,255)',
              'rgb(0,195,0)'
            )}`"
            v-if="item.clicks"
            >{{ (item.clicks.click_rate * 100).toFixed(2) }}%</span
          >
        </template>
      </v-data-table>
      <div v-else>
        <v-skeleton-loader
          class="mx-auto"
          max-width="1920"
          :loading="true"
          type="table"
        ></v-skeleton-loader>
      </div>
    </div>
    <div v-if="!predictOpenRateViewVisible" class="container">
      <div class="row">
        <div class="col-12 mx-auto">
          <v-expansion-panels v-model="panel" :inset="true" multiple>
            <v-expansion-panel>

              <v-expansion-panel-header>Open Rate Graphs</v-expansion-panel-header>
                <v-expansion-panel-content>
                    <div class="container container-fluid">
                      <div class="row">
                        <div class="col-6">
                          <div v-if="graphData.chart_open_rate_vs_week_day.data">
                            <Plotly
                              :data="graphData.chart_open_rate_vs_week_day.data"
                              :layout="graphData.chart_open_rate_vs_week_day.data[0].layout"
                              :display-mode-bar="false"
                            ></Plotly>
                          </div>
                          <div v-else>
                            <v-skeleton-loader
                              class="mx-auto"
                              max-width="1920"
                              :loading="true"
                              type="image"
                            ></v-skeleton-loader>
                          </div>
                        </div>
                        <div class="col-6">
                          <div v-if="graphData.chart_open_rate_distribution.data">
                            <Plotly
                              :data="graphData.chart_open_rate_distribution.data"
                              :layout="graphData.chart_open_rate_distribution.data[0].layout"
                              :display-mode-bar="false"
                            ></Plotly>
                          </div>
                          <div v-else>
                            <v-skeleton-loader
                              class="mx-auto"
                              max-width="1920"
                              :loading="true"
                              type="image"
                            ></v-skeleton-loader>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-6">
                          <div v-if="graphData.chart_open_rate_vs_month.data">
                            <Plotly
                              :data="graphData.chart_open_rate_vs_month.data"
                              :layout="graphData.chart_open_rate_vs_month.data[0].layout"
                              :display-mode-bar="false"
                            ></Plotly>
                          </div>
                          <div v-else>
                            <v-skeleton-loader
                              class="mx-auto"
                              max-width="1920"
                              :loading="true"
                              type="image"
                            ></v-skeleton-loader>
                          </div>
                        </div>
                        <div class="col-6">
                          <div v-if="graphData.chart_open_rate_vs_subject_line_length.data">
                            <Plotly
                              :data="graphData.chart_open_rate_vs_subject_line_length.data"
                              :layout="graphData.chart_open_rate_vs_subject_line_length.data[0].layout"
                              :display-mode-bar="false"
                            ></Plotly>
                          </div>
                          <div v-else>
                            <v-skeleton-loader
                              class="mx-auto"
                              max-width="1920"
                              :loading="true"
                              type="image"
                            ></v-skeleton-loader>
                          </div>
                        </div>
                      </div>
                    </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import errorParser from "@/lib/errorParser";
import { Plotly } from "vue-plotly";

export default {
  props: ["id"],
  components: { Plotly },
  data() {
    return {
      matchingCoeffWords: [],
      coeffWordList: [],
      predicting: false,
      predictOpenRateViewVisible: false,
      togglePredictOpenRateViewButton: 'Predict Open Rate',
      open_rate_probability: null,
      subject: 'Here are the Most Popular G&F Amazon Prime Early Access Deals + New Finds',
      rules: [
        value => !!value || 'Required',
        value => (value && value.length >= 3) || 'Min 3 characters',
        value => (value && value.length < 120) || 'Max 120 characters',
      ],
      dialog: false,
      panel: [],
      dataLoaded: false,
      graphData: {
        chart_open_rate_vs_week_day: { data: null },
        chart_open_rate_vs_month: { data: null },
        chart_open_rate_vs_subject_line_length: { data: null },
        chart_open_rate_distribution: { data: null },
      },
      campaigns: [],
      headersCoeffs: [
        {
          text: 'Word',
        }
      ],
      coeffs: [],
      headers: [
        {
          text: "Id",
          align: "start",
          sortable: true,
          value: "id",
        },
        { text: "Campaign title", value: "campaign_title" },
        { text: "Subject", value: "subject_line" },
        { text: "Audience", value: "list_name" },
        { text: "Send Date", value: "send_time" },
        { text: "Send Weekday", value: "send_day" },
        { text: "Total Recipients", value: "emails_sent" },
        { text: "Total Bounces", value: "total_bounces" },
        { text: "Unique Opens", value: "opens.unique_opens" },
        { text: "Open rate", value: "opens.open_rate" },
        { text: "Total Opens", value: "opens.opens_total" },
        { text: "Unique Clicks", value: "clicks.unique_clicks" },
        { text: "Click Rate", value: "clicks.click_rate" },
        { text: "Total Clicks", value: "clicks.clicks_total" },
        { text: "Unsubscribed", value: "unsubscribed" },
        { text: "Abuse Complaints", value: "abuse_reports" },
        { text: "Total Revenue", value: "ecommerce.total_revenue" },
      ],
      json_fields: {
        "id": "id",
        "Campaign title": "campaign_title",
        "Subject": "subject_line",
        "Audience": "list_name",
        "Send Date": "send_time",
        "Send Day": "send_day",
        "Total Recipients": "emails_sent",
        "Total Bounces": "total_bounces",
        "Unique Opens": "opens.unique_opens",
        "Open Rate": "opens.open_rate",
        "Total Opens": "opens.opens_total",
        "Unique Clicks": "clicks.unique_clicks",
        "Click Rate": "clicks.click_rate",
        "Total Clicks": "clicks.clicks_total",
        "Unsubscribed": "unsubscribed",
        "Abuse Complaints": "abuse_reports",
        "Total Revenue": "ecommerce.total_revenue",
      },
      max: 1,
    };
  },
  computed: {
    betterOrWorse() {
      return this.open_rate_probability >= 0.5 ? "BETTER" : "WORSE"
    },
    averageCoeff() {
      let sum = 0;
      this.matchingCoeffWords.forEach(object => {
        sum += Object.values(object)[0];
      })
      return sum/this.matchingCoeffWords.length;
    }
  },
  async mounted() {
    try {
      const { data } = await axios.get(`public/mailChimp/reports`);
      this.campaigns = data.reports;
      const clickRates = [];
      this.campaigns.forEach((campaign) => {
        if (campaign.clicks && campaign.clicks.click_rate) {
          clickRates.push(campaign.clicks.click_rate);
        }
      });
      this.computeGraphs();
      this.calculateMax(clickRates);
      this.predictSubject();
      this.textAreaText = data;
      this.dataLoaded = true;
    } catch (error) {
      console.log(errorParser(error));
      this.textAreaText = errorParser(error);
    }
  },
  methods: {
    togglePredictOpenRateView() {
      this.predictOpenRateViewVisible = !this.predictOpenRateViewVisible;
      if (this.predictOpenRateViewVisible) {
        this.togglePredictOpenRateViewButton = 'View Open Rate Data';
      } else
        this.togglePredictOpenRateViewButton = 'Predict Open Rate';
    },
    async predictSubject() {
      this.predicting = true;
      const { data } = await axios.post(`public/python/word_coeff_prediction`, {subject: this.subject});
      this.open_rate_probability = data.prediction.above_average_probability.toFixed(4);
      // split key value pair into separate objects in an array
      this.coeffWordList = data.prediction.words;
      const result = Object
        .keys(data.prediction.object.Coefficient)
        .map(k => ({ [k]: data.prediction.object.Coefficient[k] }));
      this.coeffs = result;
      this.predicting = false;
      this.assignCoeffWords()
    },
    assignCoeffWords() {
      this.matchingCoeffWords = [];
      const words = this.subject.split(" ");
      const coeffs = JSON.parse(JSON.stringify(this.coeffs))
      words.forEach(element => {
        coeffs.forEach(coeffObject => {
          // console.log({key: Object.keys(coeffObject)[0], element: element.toLowerCase()})
          if (Object.keys(coeffObject)[0] === element.toLowerCase())
            this.matchingCoeffWords.push(coeffObject)
        });
      });
      console.log({words: this.matchingCoeffWords })
    },
    async computeGraphs() {
      // Open rate vs week day
      const response_chart_open_rate_vs_week_day = await axios.post(
        `public/python/chart_open_rate_vs_week_day`
      );
      this.graphData['chart_open_rate_vs_week_day'].data = [response_chart_open_rate_vs_week_day.data];

      // Open rate vs month
      const response_chart_open_rate_vs_month = await axios.post(
        `public/python/chart_open_rate_vs_month`
      );
      this.graphData['chart_open_rate_vs_month'].data = [response_chart_open_rate_vs_month.data];

      // Open rate vs subject line length
      const response_chart_open_rate_vs_subject_line_length = await axios.post(
        `public/python/chart_open_rate_vs_subject_line_length`
      );
      this.graphData['chart_open_rate_vs_subject_line_length'].data = [response_chart_open_rate_vs_subject_line_length.data];

      // Open rate distrubution
      const response_chart_open_rate_distribution = await axios.post(
        `public/python/chart_open_rate_distribution`,
        this.campaigns
      );
      this.graphData['chart_open_rate_distribution'].data = [response_chart_open_rate_distribution.data];
    },
    // COLOR FUNCTIONS
    calculateMax(nums) {
      const max = Math.max(...nums);
      this.max = max;
    },
    // COLOR FUNCTIONS
    percentOfMax(num) {
      return num / this.max;
    },
    // COLOR FUNCTIONS
    pSBC(p, c0, c1, l) {
      let r,
        g,
        b,
        P,
        f,
        t,
        h,
        m = Math.round,
        a = typeof c1 == "string";
      if (
        typeof p != "number" ||
        p < -1 ||
        p > 1 ||
        typeof c0 != "string" ||
        (c0[0] != "r" && c0[0] != "#") ||
        (c1 && !a)
      )
        return null;
      (h = c0.length > 9),
        (h = a ? (c1.length > 9 ? true : c1 == "c" ? !h : false) : h),
        (f = this.pSBCr(c0)),
        (P = p < 0),
        (t =
          c1 && c1 != "c"
            ? this.pSBCr(c1)
            : P
            ? { r: 0, g: 0, b: 0, a: -1 }
            : { r: 255, g: 255, b: 255, a: -1 }),
        (p = P ? p * -1 : p),
        (P = 1 - p);
      if (!f || !t) return null;
      if (l)
        (r = m(P * f.r + p * t.r)),
          (g = m(P * f.g + p * t.g)),
          (b = m(P * f.b + p * t.b));
      else
        (r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5)),
          (g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5)),
          (b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5));
      (a = f.a),
        (t = t.a),
        (f = a >= 0 || t >= 0),
        (a = f ? (a < 0 ? t : t < 0 ? a : a * P + t * p) : 0);
      if (h)
        return (
          "rgb" +
          (f ? "a(" : "(") +
          r +
          "," +
          g +
          "," +
          b +
          (f ? "," + m(a * 1000) / 1000 : "") +
          ")"
        );
      else
        return (
          "#" +
          (
            4294967296 +
            r * 16777216 +
            g * 65536 +
            b * 256 +
            (f ? m(a * 255) : 0)
          )
            .toString(16)
            .slice(1, f ? undefined : -2)
        );
    },
    // COLOR FUNCTIONS
    pSBCr(d) {
      const i = parseInt;
      let n = d.length,
        x = {};
      if (n > 9) {
        const [r, g, b, a] = (d = d.split(","));
        n = d.length;
        if (n < 3 || n > 4) return null;
        (x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4))),
          (x.g = i(g)),
          (x.b = i(b)),
          (x.a = a ? parseFloat(a) : -1);
      } else {
        if (n == 8 || n == 6 || n < 4) return null;
        if (n < 6)
          d =
            "#" +
            d[1] +
            d[1] +
            d[2] +
            d[2] +
            d[3] +
            d[3] +
            (n > 4 ? d[4] + d[4] : "");
        d = i(d.slice(1), 16);
        if (n == 9 || n == 5)
          (x.r = (d >> 24) & 255),
            (x.g = (d >> 16) & 255),
            (x.b = (d >> 8) & 255),
            (x.a = Math.round((d & 255) / 0.255) / 1000);
        else
          (x.r = d >> 16), (x.g = (d >> 8) & 255), (x.b = d & 255), (x.a = -1);
      }
      return x;
    },
  },
};
</script>

<style>
</style>