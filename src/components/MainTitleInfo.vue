<template>
  <!-- abusing resultsCategoriesEnabled and resultsRedirectsEnabled also for waiting on finish before display -->
  <div>
    <div
      v-if="
        (!global.state.resultsCategoriesEnabled &&
          !global.state.resultsRedirectsEnabled) ||
        (global.state.resultsCategoriesEnabled &&
          global.state.categoriesDone &&
          !global.state.resultsRedirectsEnabled) ||
        (!global.state.resultsCategoriesEnabled &&
          global.state.resultsRedirectsEnabled &&
          global.state.redirectsDone) ||
        (global.state.resultsCategoriesEnabled &&
          global.state.categoriesDone &&
          global.state.resultsRedirectsEnabled &&
          global.state.redirectsDone)
      "
    >
      <div
        v-if="
          global.statefull.titlePage.extract && global.statefull.titlePage.image
        "
      >
        <div>
          <img class="image" :src="global.statefull.titlePage.image" />
        </div>
        <div v-if="global.statefull.titlePage.title">
          <h4 class="heading">
            {{ global.statefull.titlePage.title }}
          </h4>

          <button class="wikibutton" @click.prevent="wikiClicked">
            {{ t('open') }}
            <img class="wikipediaicon" src="../assets/images/wikipedia.svg" />
          </button>
        </div>
        <CategoriesRedirectsTitle></CategoriesRedirectsTitle>
        <div class="extract" v-html="global.statefull.titlePage.extract"></div>
      </div>
      <div
        v-if="
          global.statefull.titlePage.extract &&
          !global.statefull.titlePage.image
        "
      >
        <div v-if="global.statefull.titlePage.title">
          <h4 class="heading">
            {{ global.statefull.titlePage.title }}
          </h4>
          <button class="wikibutton" @click.prevent="wikiClicked">
            {{ t('open') }}
            <img class="wikipediaicon" src="../assets/images/wikipedia.svg" />
          </button>
        </div>
        <CategoriesRedirectsTitle></CategoriesRedirectsTitle>
        <div class="extract" v-html="global.statefull.titlePage.extract"></div>
      </div>
      <div
        v-if="
          !global.statefull.titlePage.extract &&
          global.statefull.titlePage.image
        "
      >
        <div v-if="global.statefull.titlePage.title">
          <h4 class="heading">
            {{ global.statefull.titlePage.title }}
          </h4>
          <button class="wikibutton" @click.prevent="wikiClicked">
            {{ t('open') }}
            <img class="wikipediaicon" src="../assets/images/wikipedia.svg" />
          </button>
        </div>
        <CategoriesRedirectsTitle></CategoriesRedirectsTitle>
        <div>
          <img class="imageonly" :src="global.statefull.titlePage.image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import CategoriesRedirectsTitle from './CategoriesRedirectsTitle.vue'

import { useI18n } from 'vue-i18n/index'
const { t } = useI18n({})

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
  width: 50%;
  margin: 0 0 10px 10px;
  padding-right: 10px;
}
.imageonly {
  width: 100%;
}
.heading {
  vertical-align: middle;
}
.wikibutton {
  font-size: 90%;
  vertical-align: middle;
  background-color: #ddd;
  border-radius: 0;
  border: 1px solid black;
  margin-bottom: 1.5em;
}
.wikibutton:hover {
  filter: invert(0.25);
}
.wikipediaicon {
  height: 1.5em;
  vertical-align: top;
}
</style>
