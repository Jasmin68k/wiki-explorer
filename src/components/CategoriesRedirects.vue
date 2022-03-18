<template>
  <div class="container">
    <div class="title">
      <h3>
        {{ catsredirresult.title }}
      </h3>
    </div>
    <div
      class="categories"
      v-if="
        global.state.resultsCategoriesEnabled &&
        catsredirresult.categories.length > 0
      "
    >
      <h4>{{ $t('categories') }}</h4>
      <ul>
        <li v-for="category in catsredirresult.categories" :key="category">
          {{ category }}
        </li>
      </ul>
    </div>
    <div
      class="redirects"
      v-if="
        global.state.resultsRedirectsEnabled &&
        catsredirresult.redirects.length > 0
      "
    >
      <ul>
        <h4>{{ $t('redirects') }}</h4>
        <li v-for="redirect in catsredirresult.redirects" :key="redirect">
          {{ redirect }}
        </li>
      </ul>
    </div>

    <button
      v-if="global.state.mobileMode"
      class="closebutton"
      @click="global.setShowCatsRedir(false)"
    >
      <img class="closebuttonicon" src="../assets/images/close-button.svg" />
    </button>
  </div>
</template>
<script>
import { inject } from 'vue'
export default {
  name: 'CategoriesRedirects',
  props: {
    catsredirresult: { required: true, default: {} }
  },
  setup() {
    const global = inject('global')
    return { global }
  }
}
</script>
<style scoped>
ul {
  list-style-type: none; /* Remove bullets */
  padding: 0; /* Remove padding */
  margin: 0; /* Remove margins */
  /* indent second and following lines */
  text-indent: -0.5rem;
  margin-left: 0.5rem;
}
/* ul li {
  text-align: left;
} */

.container {
  position: relative;
  font-size: 90%;
}
.closebuttonicon {
  vertical-align: middle;
}
.closebutton {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 2em;
  padding: 0;
  border: none;
  background-color: transparent;
  z-index: 1;
}
</style>
