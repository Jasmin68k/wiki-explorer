<template>
  <div class="container">
    <div class="title">
      <h3>
        {{ global.state.catsRedirResult.title }}
      </h3>
    </div>
    <div
      class="catsredirects"
      v-if="
        global.state.resultsCategoriesEnabled &&
        global.state.catsRedirResult.categories.length > 0
      "
    >
      <h4>{{ $t('categories') }}</h4>
      <ul class="list-horizontal">
        <li
          v-for="category in global.state.catsRedirResult.categories"
          :key="category"
        >
          {{ category }}
        </li>
      </ul>
    </div>
    <div
      class="catsredirects"
      v-if="
        global.state.resultsRedirectsEnabled &&
        global.state.catsRedirResult.redirects.length > 0
      "
    >
      <h4>{{ $t('redirects') }}</h4>
      <ul class="list-horizontal">
        <li
          v-for="redirect in global.state.catsRedirResult.redirects"
          :key="redirect"
        >
          {{ redirect }}
        </li>
      </ul>
    </div>

    <button class="closebutton" @click="closeButtonClicked">
      <img class="closebuttonicon" src="../assets/images/close-button.svg" />
    </button>
  </div>
</template>
<script>
import { inject } from 'vue'
export default {
  name: 'CategoriesRedirects',
  emits: ['closeButtonClicked'],
  setup() {
    const global = inject('global')
    return { global }
  },
  methods: {
    closeButtonClicked() {
      this.$emit('closeButtonClicked')
    }
  }
}
</script>
<style scoped>
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
