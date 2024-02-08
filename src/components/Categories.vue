<template>
  <div
    v-if="
      global.state.resultsCategoriesEnabled &&
      global.state.resultsCategoriesDone
    "
    class="container"
  >
    <div v-for="(page, index) in global.state.filteredResults" :key="index">
      <div class="title">
        <h3
          :class="{
            titlemissing: page.missing
          }"
        >
          {{ page.title }}
        </h3>
        <button
          v-if="!page.missing"
          class="wikibutton"
          @click.prevent="wikiClicked(page.url)"
        >
          {{ $t('open') }}
          <img
            class="wikipediaicon svg-icon"
            src="../assets/images/wikipedia.svg"
          />
        </button>
      </div>

      <div
        class="catsredirects"
        v-if="
          global.state.resultsCategoriesEnabled &&
          global.state.resultsCategoriesDone &&
          page.categories.length > 0
        "
      >
        <h4>{{ $t('categories') }}</h4>
        <ul class="list-horizontal">
          <li v-for="(category, index) in page.categories" :key="index">
            {{ category }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const global = inject('global')

function wikiClicked(url) {
  window.open(url, '_blank')
}
</script>

<style scoped>
img.svg-icon {
  filter: invert(100%) brightness(90%);
}
.container {
  position: relative;
  font-size: 90%;
}
.catsredirects {
  /* font-size: 90%; */
  text-align: left;
  padding-right: 10px;
  padding-left: 5px;
}

ul {
  padding: 0;
}
.list-horizontal li {
  display: inline-block;
}
.list-horizontal li:before {
  content: '\00a0\2022\00a0';
}

/* .list-horizontal li:first-child:before {
  content: '';
} */

.wikibutton {
  font-size: 100%;
  vertical-align: middle;
  background-color: #555;
  border-radius: 0;
  border: 1px solid #666;
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
.titlemissing {
  color: red;
}
</style>
