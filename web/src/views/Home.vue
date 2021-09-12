<template>
  <div class="v-responsive mx-auto overflow-visible" style="max-width: 868px">
    <div class="container container-fluid">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          :rules="rules.postalCode"
          color="purple darken-2"
          label="Postal Code"
          @change="updatePostalCode"
          :value="postalCode"
          required
        ></v-text-field>
        <v-text-field
          :rules="rules.sku"
          color="purple darken-2"
          label="Sku Id"
          @change="updateSku"
          :value="sku"
          required
        ></v-text-field>
        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="startSearch()"
        >
          Search
        </v-btn>
      </v-form>
      <v-text-field
        disabled
        label="Refresh Time"
        v-model="lastRefresh"
      ></v-text-field>
      <div class="row">
        <div class="col">
          <v-data-table
            :headers="headers"
            :items="data"
            :items-per-page="10"
            class="elevation-1"
            @click:row="handleClick"
          ></v-data-table>
        </div>
      </div>
      <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="4000">
        {{ snackbarText }}

        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      data: [],
      valid: true,
      lastRefresh: null,
      doSearch: false,
      headers: [
        {
          text: "Store name",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Address", value: "address" },
        { text: "Distance", value: "distance" },
      ],
      snackbar: false,
      rules: {
        postalCode: [
          (val) => (!!val && val >= 0) || "Must be a postive number",
        ],
        sku: [(val) => (!!val && val >= 0) || "Must be a postive number"],
      },
    };
  },
  props: ["sku", "postalCode"],
  mounted() {
    setInterval(
      function () {
        this.search();
      }.bind(this),
      20000
    );
  },
  methods: {
    updatePostalCode(val) {
      this.$router.push({
        query: { ...this.$route.query, postalCode: val },
      });
    },
    updateSku(val) {
      this.$router.push({
        query: { ...this.$route.query, sku: val },
      });
    },
    startSearch() {
      this.doSearch = true;
      this.search();
    },
    async search() {
      if (!this.doSearch) return;
      this.snackbar = false;
      if (!this.$refs.form.validate()) return;
      try {
        const { data } = await axios.get(`public/product/${this.sku}`, {
          params: { postalCode: this.postalCode },
        });
        this.lastRefresh = new Date();
        this.data = Object.values(data);
        if (this.data.length > 1) {
          this.doSearch = false;
          window.open(
            `https://www.bestbuy.com/site/${this.sku}.p?skuId=${this.sku}`
          );
        }
      } catch (error) {
        console.error(error);
      }
      this.snackbar = true;
    },
    handleClick() {
      window.open(
        `https://www.bestbuy.com/site/${this.sku}.p?skuId=${this.sku}`
      );
    },
  },
  computed: {
    snackbarText() {
      return this.data.length > 0 ? "Sku available!" : "Out of stock!";
    },
    snackbarColor() {
      return this.data.length > 0 ? "success" : "error";
    },
  },
};
</script>
