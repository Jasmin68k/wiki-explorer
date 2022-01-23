<template>
  <div>
    <div
      v-show="global.state.titlePage.extract && global.state.titlePage.image"
    >
      <div>
        <img class="image" :src="global.state.titlePage.image" />
      </div>
      <div class="extract" v-html="global.state.titlePage.extract"></div>
    </div>
    <div
      v-show="global.state.titlePage.extract && !global.state.titlePage.image"
    >
      <div class="extract" v-html="global.state.titlePage.extract"></div>
    </div>
    <div
      v-show="!global.state.titlePage.extract && global.state.titlePage.image"
    >
      <div>
        <img class="imageonly" :src="global.state.titlePage.image" />
      </div>
    </div>
  </div>
</template>
<script>
import { inject } from 'vue'
export default {
  name: 'MainTitleInfo',
  setup() {
    const global = inject('global')
    return { global }
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
