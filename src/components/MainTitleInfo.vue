<template>
  <div class="container">
    <div v-show="image">
      <img class="image" :src="image" />
    </div>
    <div v-show="extract">
      <p class="extract" v-html="extract"></p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MainTitleInfo',
  props: {
    extract: { required: false, default: '', type: String },
    image: { required: false, default: '', type: String }
  }
}
</script>
<style scoped>
.container {
  width: 100%;
}
.extract {
  text-align: left;
}
.image {
  margin: auto;
  position: relative;
  width: 100%;
  height: auto;
}
</style>
