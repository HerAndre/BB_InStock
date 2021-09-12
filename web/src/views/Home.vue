<template>
  <div>
    <div class="v-responsive mx-auto overflow-visible" style="max-width: 868px">
      <div class="container container-fluid">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="postalCode"
            :rules="rules.postalCode"
            color="purple darken-2"
            label="Postal Code"
            required
          ></v-text-field>
          <v-text-field
            v-model="sku"
            :rules="rules.sku"
            color="purple darken-2"
            label="Sku Id"
            required
          ></v-text-field>
          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="search()"
          >
            Search
          </v-btn>
        </v-form>
        <v-text-field disabled label="Refresh Time" v-model="lastRefresh"
          >}</v-text-field
        >
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
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      data: [],
      sku: "",
      valid: true,
      postalCode: "",
      lastRefresh: null,
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
    setInterval(
      function () {
        this.search();
      }.bind(this),
      20000
    );
  },
  methods: {
    async search() {
      try {
        this.snackbar = false;
        if (!this.$refs.form.validate()) return;
        const { data } = await axios.get(`public/product/${this.sku}`, {
          params: { postalCode: this.postalCode },
        });
        this.lastRefresh = new Date();
        this.snackbar = true;
        this.data = Object.values(data);
      } catch (error) {
        console.error(error);
      }
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
