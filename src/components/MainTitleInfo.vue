<template>
  <div v-show="extract">
    <p class="extract" v-html="extract"></p>
  </div>
  <div v-show="image">
    <img class="image" :src="image" />
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
.extract {
  text-align: left;
}
.image {
  margin: auto;
  position: relative;
  max-width: 1200px;
  max-height: 600px;
  width: auto;
  height: auto;
}
</style>
