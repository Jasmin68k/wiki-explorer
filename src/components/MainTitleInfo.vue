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
            {{ $t('open') }}
            <img
              class="wikipediaicon svg-icon"
              src="@/assets/images/wikipedia.svg"
            />
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
            {{ $t('open') }}
            <img
              class="wikipediaicon svg-icon"
              src="@/assets/images/wikipedia.svg"
            />
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
            {{ $t('open') }}
            <img
              class="wikipediaicon svg-icon"
              src="@/assets/images/wikipedia.svg"
            />
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

const global = inject('global')

function wikiClicked() {
  window.open(global.statefull.titlePage.url, '_blank')
}
</script>

<style scoped>
img.svg-icon {
  filter: invert(100%) brightness(90%);
}
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
  background-color: #ffffff;
  background-clip: content-box;
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
  background-color: #555;
  border-radius: 0;
  border: 1px solid #666;
  margin-bottom: 1.5em;
}
@media (hover: hover) and (pointer: fine) {
  .wikibutton:hover {
    filter: brightness(1.2);
  }
}
.wikipediaicon {
  height: 1.5em;
  vertical-align: top;
}
</style>
