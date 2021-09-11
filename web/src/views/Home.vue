<template>
  <div class="home"></div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      data: {},
    };
  },
  async mounted() {
    const { data } = await axios.get("public/product");
    console.log(data);
    this.data = data;
  },
};
</script>
