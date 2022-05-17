<template>
  <div class="container">
    <div v-for="(page, index) in global.state.displayResultsArray" :key="index">
      <div class="title">
        <h3>
          {{ page.title }}
        </h3>
      </div>

      <div
        class="catsredirects"
        v-if="
          global.state.resultsCategoriesEnabled && page.categories.length > 0
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
        v-if="global.state.resultsRedirectsEnabled && page.redirects.length > 0"
      >
        <h4>{{ t('redirects') }}</h4>
        <ul class="list-horizontal">
          <li v-for="(redirect, index) in page.redirects" :key="index">
            {{ redirect }}
          </li>
        </ul>
      </div>
    </div>

    <button class="closebutton" @click="closeButtonClicked">
      <img class="closebuttonicon" src="../assets/images/close-button.svg" />
    </button>
  </div>
</template>

<script setup>
import { inject } from 'vue'

import { useI18n } from 'vue-i18n/index'
const { t } = useI18n({})

const global = inject('global')
const emit = defineEmits(['closeButtonClicked'])
function closeButtonClicked() {
  emit('closeButtonClicked')
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
