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
        <h2 class="heading">
          {{ global.statefull.titlePage.title }}
        </h2>

        <button class="wikibutton" @click="wikiClicked">
          {{ $t('open') }}
          <img class="wikipediaicon" src="../assets/images/wikipedia.svg" />
        </button>
      </div>
      <CategoriesRedirectsTitle></CategoriesRedirectsTitle>
      <div class="extract" v-html="global.statefull.titlePage.extract"></div>
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
      <CategoriesRedirectsTitle></CategoriesRedirectsTitle>
      <div class="extract" v-html="global.statefull.titlePage.extract"></div>
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
      <CategoriesRedirectsTitle></CategoriesRedirectsTitle>
      <div>
        <img class="imageonly" :src="global.statefull.titlePage.image" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import CategoriesRedirectsTitle from './CategoriesRedirectsTitle.vue'

const global = inject('global')

function wikiClicked() {
  window.open(global.statefull.titlePage.url, '_blank')
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
.heading {
  display: inline;
  vertical-align: middle;
}
.heading {
  display: inline;
}
.wikibutton {
  font-size: 90%;
  vertical-align: middle;
  margin-left: 1em;
  border-radius: 0;
  border: 1px solid black;
}
.wikipediaicon {
  height: 1.5em;
  vertical-align: top;
}
</style>
