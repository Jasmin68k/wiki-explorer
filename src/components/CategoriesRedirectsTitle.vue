<template>
  <!-- abusing resultsCategoriesEnabled and resultsRedirectsEnabled also for toggling visibility in MainInfo -->

  <div
    v-if="
      global.statefull.titlePage.categories.length > 0 &&
      global.state.resultsCategoriesEnabled
    "
    class="catsredirects"
  >
    <span
      ><b>{{ $t('categories') }}</b></span
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
      global.state.resultsRedirectsEnabled
    "
    class="catsredirects"
  >
    <span
      ><b>{{ $t('redirects') }}</b></span
    >
    <ul class="list-horizontal">
      <li
        v-for="redirect in global.statefull.titlePage.redirects"
        :key="redirect"
      >
        {{ redirect }}
      </li>
    </ul>
  </div>
</template>
<script>
import { inject } from 'vue'
export default {
  name: 'CategoriesRedirectsTitle',
  setup() {
    const global = inject('global')
    return { global }
  }
}
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
