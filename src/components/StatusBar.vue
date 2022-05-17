<template>
  <div>
    <div class="statusbar-container">
      <span>
        <span
          v-show="
            global.state.resultsCategoriesEnabled &&
            !global.state.resultsCategoriesDone
          "
          ><img class="fetchingicon" src="../assets/images/document.svg"
        /></span>
        <span
          v-show="
            global.state.resultsRedirectsEnabled &&
            !global.state.resultsRedirectsDone
          "
          ><img
            class="fetchingicon"
            src="../assets/images/forward-hand-drawn-arrow-pointing-to-right.svg"
        /></span>
        <span
          >{{ t('results')
          }}{{ global.state.filteredResultsArray.length }}</span
        >
        <span
          v-show="
            global.state.resultsRedirectsEnabled &&
            !global.state.resultsRedirectsDone
          "
          ><img
            class="fetchingicon"
            src="../assets/images/forward-hand-drawn-arrow-pointing-to-right.svg"
        /></span>
        <span
          v-show="
            global.state.resultsCategoriesEnabled &&
            !global.state.resultsCategoriesDone
          "
          ><img class="fetchingicon" src="../assets/images/document.svg"
        /></span>
      </span>
      <span
        :style="{
          visibility:
            global.state.filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
      >
        {{ t('showing') }}{{ global.state.indexStart + 1 }}{{ t('to')
        }}{{
          global.state.indexEnd + 1 > global.state.filteredResultsArray.length
            ? global.state.indexEnd +
              1 -
              global.state.filteredResultsArray.length
            : global.state.indexEnd + 1
        }}
      </span>
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
@keyframes fadeIn {
  from {
    opacity: 0;
  }
}
.fetchingicon {
  filter: invert(16%) sepia(63%) saturate(7441%) hue-rotate(0deg)
    brightness(105%) contrast(124%);
  animation: fadeIn 0.35s infinite alternate;
  height: 1em;
  vertical-align: middle;
  margin-left: 0.2em;
  margin-right: 0.2em;
}
.statusbar-container {
  display: flex;
  justify-content: space-around;
  font-size: 85%;
}
</style>
