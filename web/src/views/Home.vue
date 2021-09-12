<template>
  <div class="mx-auto overflow-visible" style="max-width: 868px">
    <div class="container container-fluid">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          :rules="rules.postalCode"
          color="purple darken-2"
          label="Postal Code"
          @change="setPostalCode"
          :value="getStateKey('postalCode')"
          required
        ></v-text-field>
        <v-text-field
          :rules="rules.sku"
          color="purple darken-2"
          label="Sku Id"
          @change="setSku"
          :value="getStateKey('sku')"
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
import { mapActions, mapGetters } from "vuex";
import errorParser from "../lib/errorParser";

export default {
  name: "Home",
  data() {
    return {
      data: [],
      valid: true,
      lastRefresh: null,
      doSearch: false,
      snackbarText: "",
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
  mounted() {
    if (
      this.$route.query.postalCode &&
      this.$route.query.postalCode !== this.getStateKey("postalCode")
    ) {
      this.setPostalCode(this.$route.query.postalCode);
    }
    if (
      this.$route.query.sku &&
      this.$route.query.sku !== this.getStateKey("sku")
    ) {
      this.setSku(this.$route.query.sku);
    }
    if (this.getStateKey("sku")) {
      this.$router
        .replace({
          query: { ...this.$route.query, sku: this.getStateKey("sku") },
        })
        .catch((err) => {
          // Ignore the vuex err regarding  navigating to the page they are already on.
          if (
            err.name !== "NavigationDuplicated" &&
            !err.message.includes(
              "Avoided redundant navigation to current location"
            )
          ) {
            // But print any other errors to the console
            console.error(err);
          }
        });
    }
    if (this.getStateKey("postalCode")) {
      this.$router
        .replace({
          query: {
            ...this.$route.query,
            postalCode: this.getStateKey("postalCode"),
          },
        })
        .catch((err) => {
          // Ignore the vuex err regarding  navigating to the page they are already on.
          if (
            err.name !== "NavigationDuplicated" &&
            !err.message.includes(
              "Avoided redundant navigation to current location"
            )
          ) {
            // But print any other errors to the console
            console.error(err);
          }
        });
    }
    setInterval(
      function () {
        this.search();
      }.bind(this),
      20000
    );
  },
  methods: {
    ...mapActions(["setSku", "setPostalCode"]),
    startSearch() {
      this.doSearch = true;
      this.search();
    },
    async search() {
      if (!this.doSearch) return;
      this.snackbar = false;
      this.snackbarText = "";
      if (!this.$refs.form.validate()) return;
      try {
        const { data } = await axios.get(
          `public/product/${this.getStateKey("sku")}`,
          {
            params: { postalCode: this.getStateKey("postalCode") },
          }
        );
        this.lastRefresh = new Date();
        this.data = Object.values(data);
        if (this.data.length > 1) {
          this.snackbarText = `Found ${this.data.length} stores!`;
          this.doSearch = false;
          window.open(
            `https://www.bestbuy.com/site/${this.getStateKey(
              "sku"
            )}.p?skuId=${this.getStateKey("sku")}`
          );
        } else {
          this.snackbarText = `Out of stock!`;
        }
      } catch (error) {
        if ([400, 500].includes(error.response.status)) this.doSearch = false;
        this.snackbarText = errorParser(error);
      }
      this.snackbar = true;
    },
    handleClick() {
      window.open(
        `https://www.bestbuy.com/site/${this.getStateKey(
          "sku"
        )}.p?skuId=${this.getStateKey("sku")}`
      );
    },
  },
  computed: {
    ...mapGetters(["getStateKey"]),
    snackbarColor() {
      return this.data.length > 0 ? "success" : "error";
    },
  },
};
</script>
