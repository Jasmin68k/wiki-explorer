<template>
  <div class="container">
    <div
      v-for="(page, index) in global.state.filteredResultsArray"
      :key="index"
    >
      <div class="title">
        <h3>
          {{ page.title }}
        </h3>
      </div>

      <div
        class="catsredirects"
        v-if="
          global.state.resultsCategoriesEnabled &&
          global.state.resultsCategoriesDone &&
          page.categories.length > 0
        "
      >
        <h4>{{ t('categories') }}</h4>
        <ul class="list-horizontal">
          <li v-for="(category, index) in page.categories" :key="index">
            {{ category }}
          </li>
        </ul>
      </div>

      <div
        class="catsredirects"
        v-if="
          global.state.resultsRedirectsEnabled &&
          global.state.resultsRedirectsDone &&
          page.redirects.length > 0
        "
      >
        <h4>{{ t('redirects') }}</h4>
        <ul class="list-horizontal">
          <li v-for="(redirect, index) in page.redirects" :key="index">
            {{ redirect }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

import { useI18n } from 'vue-i18n/index'
const { t } = useI18n({})

const global = inject('global')
</script>

<style scoped>
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
</style>
