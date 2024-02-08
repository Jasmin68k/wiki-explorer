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
        <span v-show="global.state.filteredResults.length > 0"
          >{{ $t('results') }}{{ global.state.filteredResults.length }}</span
        >
        <span
          v-if="
            global.state.filteredResults.length > 0 &&
            (!global.state.mobileMode ||
              (global.state.mobileMode && global.state.activeTab === 'tab1'))
          "
        >
          ({{ global.state.indexStart + 1 }} -
          {{
            global.state.indexEnd + 1 > global.state.filteredResults.length
              ? global.state.indexEnd + 1 - global.state.filteredResults.length
              : global.state.indexEnd + 1
          }})
        </span>

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
    </div>
  </div>
</template>
<script setup>
import { inject } from 'vue'

const global = inject('global')
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
}
.fetchingicon {
  filter: invert(86%) sepia(33%) saturate(941%) hue-rotate(250deg)
    brightness(120%) contrast(124%);
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
  margin-bottom: 3px;
  height: 1.25em;
}
</style>
