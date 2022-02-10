<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <router-link :to="'/'"><h2 style="color: white; text-decoration: none">Home</h2></router-link>
      </div>
      <v-spacer></v-spacer>
      <div class="d-flex align-center">
        <router-link :to="'/stats'"><h2 style="color: white; text-decoration: none">Stats</h2></router-link>
      </div>

    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>

<style>
 a {
   color: white;

 }
</style>