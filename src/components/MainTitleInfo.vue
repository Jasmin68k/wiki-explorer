<template>
  <div>
    <div v-show="extract && image">
      <div>
        <img class="image" :src="image" />
      </div>
      <div class="extract" v-html="extract"></div>
    </div>
    <div v-show="extract && !image">
      <div class="extract" v-html="extract"></div>
    </div>
    <div v-show="!extract && image">
      <div>
        <img class="imageonly" :src="image" />
      </div>
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
.extract {
  text-align: justify;
  width: 100%;
  padding-right: 10px;
  padding-left: 5px;
}
.image {
  float: right;
  width: 33%;
  margin: 0 0 10px 10px;
  padding-right: 10px;
}
.imageonly {
  width: 100%;
}
</style>
