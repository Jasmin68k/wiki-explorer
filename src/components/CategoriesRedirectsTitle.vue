<template>
  <!-- abusing resultsCategoriesEnabled and resultsRedirectsEnabled also for toggling visibility in MainInfo -->

  <div
    v-if="
      global.statefull.titlePage.categories.length > 0 &&
      global.state.resultsCategoriesEnabled &&
      global.state.categoriesDone
    "
    class="catsredirects"
  >
    <span
      ><b>{{ t('categories') }}</b></span
    >

    <ul class="list-horizontal">
      <li
        v-for="(category, index) in global.statefull.titlePage.categories"
        :key="index"
      >
        {{ category }}
      </li>
    </ul>
  </div>

  <div
    v-if="
      global.statefull.titlePage.redirects.length > 0 &&
      global.state.resultsRedirectsEnabled &&
      global.state.redirectsDone
    "
    class="catsredirects"
  >
    <span
      ><b>{{ t('redirects') }}</b></span
    >
    <ul class="list-horizontal">
      <li
        v-for="(redirect, index) in global.statefull.titlePage.redirects"
        :key="index"
      >
        {{ redirect }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { inject } from 'vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n({})

const global = inject('global')
</script>

<style scoped>
.catsredirects {
  font-size: 90%;
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
</style>
