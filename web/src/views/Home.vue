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
        <div class="row">
          <div class="col-2">
            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="startSearch()"
            >
              Search
            </v-btn>
          </div>
          <div class="col px-0">
            <span class="d-block"
              >Search Count: {{ getStateKey("searchCount") }}</span
            >
            <span class="d-block"
              >Error Count: {{ getStateKey("errorCount") }}</span
            >
          </div>
        </div>
      </v-form>
      <v-text-field
        disabled
        label="Refresh Time"
        v-model="lastRefresh"
      ></v-text-field>
      <div class="row">
        <div class="col">
          <v-data-table
            :loading="doSearch"
            loading-text="Searching..."
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
import errorParser from "@/lib/errorParser";

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
    ...mapActions([
      "setSku",
      "setPostalCode",
      "incrementSearchCount",
      "incrementErrorCount",
    ]),
    startSearch() {
      this.doSearch = true;
      this.search();
    },
    async search() {
      if (!this.doSearch) return;
      if (!this.$refs.form.validate()) return;
      this.data = [];
      this.snackbar = false;
      this.snackbarText = "";
      try {
        const { data } = await axios.get(
          `public/product/${this.getStateKey("sku")}`,
          {
            params: { postalCode: this.getStateKey("postalCode") },
          }
        );
        this.lastRefresh = new Date();
        this.incrementSearchCount();
        this.data = Object.values(data);
        if (this.data.length > 1) {
          this.snackbarText = `Found ${this.data.length} stores!`;
          const snd = new Audio(
            "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
          );
          snd.play();
          snd.play();
          snd.play();
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
        this.incrementErrorCount();
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

<style>
td:hover {
  cursor: pointer;
}
</style>
