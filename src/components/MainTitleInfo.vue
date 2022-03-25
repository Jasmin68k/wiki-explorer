<template>
  <div>
    <div
      v-if="
        global.statefull.titlePage.extract && global.statefull.titlePage.image
      "
    >
      <div>
        <img class="image" :src="global.statefull.titlePage.image" />
      </div>
      <div v-if="global.statefull.titlePage.title">
        <h2>
          {{ global.statefull.titlePage.title }}
        </h2>
      </div>

      <div class="extract" v-html="global.statefull.titlePage.extract"></div>
      <CategoriesRedirectsTitle></CategoriesRedirectsTitle>
    </div>
    <div
      v-if="
        global.statefull.titlePage.extract && !global.statefull.titlePage.image
      "
    >
      <div v-if="global.statefull.titlePage.title">
        <h2>
          {{ global.statefull.titlePage.title }}
        </h2>
      </div>

      <div class="extract" v-html="global.statefull.titlePage.extract"></div>
      <CategoriesRedirectsTitle></CategoriesRedirectsTitle>
    </div>
    <div
      v-if="
        !global.statefull.titlePage.extract && global.statefull.titlePage.image
      "
    >
      <div v-if="global.statefull.titlePage.title">
        <h2>
          {{ global.statefull.titlePage.title }}
        </h2>
      </div>

      <div>
        <img class="imageonly" :src="global.statefull.titlePage.image" />
      </div>
      <CategoriesRedirectsTitle></CategoriesRedirectsTitle>
    </div>
  </div>
</template>
<script>
import { inject } from 'vue'
import CategoriesRedirectsTitle from './CategoriesRedirectsTitle.vue'

export default {
  name: 'MainTitleInfo',
  setup() {
    const global = inject('global')
    return { global }
  },
  components: { CategoriesRedirectsTitle }
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
