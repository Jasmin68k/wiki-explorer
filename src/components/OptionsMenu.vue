<template>
  <div class="menu" @click="menuItemSelected($event.target.parentElement.id)">
    <div class="menuheading">
      <strong>{{ t('cache') }}</strong>
    </div>
    <div
      id="cachedisable"
      class="menuitem"
      :class="{
        disabled:
          global.state.inputsDisabled ||
          (global.state.resultsCategoriesEnabled &&
            !global.state.resultsCategoriesDone) ||
          (global.state.resultsRedirectsEnabled &&
            !global.state.resultsRedirectsDone)
      }"
    >
      <img class="menuicon" src="../assets/images/check-mark.svg" /><span>{{
        t('cachedisabled')
      }}</span>
    </div>
    <div
      id="cache1h"
      class="menuitem"
      :class="{
        disabled:
          global.state.inputsDisabled ||
          (global.state.resultsCategoriesEnabled &&
            !global.state.resultsCategoriesDone) ||
          (global.state.resultsRedirectsEnabled &&
            !global.state.resultsRedirectsDone)
      }"
    >
      <img class="menuicon" src="../assets/images/check-mark.svg" /><span>{{
        t('cache1h')
      }}</span>
    </div>
    <div
      id="cache6h"
      class="menuitem"
      :class="{
        disabled:
          global.state.inputsDisabled ||
          (global.state.resultsCategoriesEnabled &&
            !global.state.resultsCategoriesDone) ||
          (global.state.resultsRedirectsEnabled &&
            !global.state.resultsRedirectsDone)
      }"
    >
      <img class="menuicon" src="../assets/images/check-mark.svg" /><span>{{
        t('cache6h')
      }}</span>
    </div>
    <div
      id="cache1d"
      class="menuitem"
      :class="{
        disabled:
          global.state.inputsDisabled ||
          (global.state.resultsCategoriesEnabled &&
            !global.state.resultsCategoriesDone) ||
          (global.state.resultsRedirectsEnabled &&
            !global.state.resultsRedirectsDone)
      }"
    >
      <img class="menuicon" src="../assets/images/check-mark.svg" /><span>{{
        t('cache1d')
      }}</span>
    </div>
    <div
      id="cache1w"
      class="menuitem"
      :class="{
        disabled:
          global.state.inputsDisabled ||
          (global.state.resultsCategoriesEnabled &&
            !global.state.resultsCategoriesDone) ||
          (global.state.resultsRedirectsEnabled &&
            !global.state.resultsRedirectsDone)
      }"
    >
      <img class="menuicon" src="../assets/images/check-mark.svg" /><span>{{
        t('cache1w')
      }}</span>
    </div>
    <div
      id="cache4w"
      class="menuitem"
      :class="{
        disabled:
          global.state.inputsDisabled ||
          (global.state.resultsCategoriesEnabled &&
            !global.state.resultsCategoriesDone) ||
          (global.state.resultsRedirectsEnabled &&
            !global.state.resultsRedirectsDone)
      }"
    >
      <img class="menuicon" src="../assets/images/check-mark.svg" /><span>{{
        t('cache4w')
      }}</span>
    </div>
    <div
      id="cacheflush"
      class="menuitem"
      :class="{
        disabled:
          global.state.inputsDisabled ||
          (global.state.resultsCategoriesEnabled &&
            !global.state.resultsCategoriesDone) ||
          (global.state.resultsRedirectsEnabled &&
            !global.state.resultsRedirectsDone)
      }"
    >
      <img class="menuicon" src="../assets/images/check-mark.svg" /><span
        id="cacheflushtext"
        >{{ t('cacheflush') }}</span
      >
    </div>
    <div><hr /></div>
    <div id="showhelp" class="menuitem">
      <img class="menuicon helpicon" src="../assets/images/question-mark.svg" />
      <span>{{ t('help') }}</span>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted } from 'vue'
import { useI18n } from 'vue-i18n/index'
import { clearDatabase } from '../localcache.js'

const { t } = useI18n({})
const global = inject('global')
const emit = defineEmits(['hideMenu'])
defineExpose({ cacheSettingsUpdated })
const cacheids = [
  'cachedisable',
  'cache1h',
  'cache6h',
  'cache1d',
  'cache1w',
  'cache4w'
]
async function menuItemSelected(id) {
  if (cacheids.includes(id)) {
    cacheids.forEach(
      (id) =>
        (document
          .getElementById(id)
          .getElementsByTagName('img')[0].style.visibility = 'hidden')
    )
    document
      .getElementById(id)
      .getElementsByTagName('img')[0].style.visibility = 'visible'
  }

  switch (id) {
    case 'cachedisable':
      global.setCacheEnabled(false)
      break
    case 'cache1h':
      global.setCacheEnabled(true)
      global.setCacheMaxAge(global.constants.cachemaxage1h)
      break
    case 'cache6h':
      global.setCacheEnabled(true)
      global.setCacheMaxAge(global.constants.cachemaxage6h)
      break
    case 'cache1d':
      global.setCacheEnabled(true)
      global.setCacheMaxAge(global.constants.cachemaxage1d)
      break
    case 'cache1w':
      global.setCacheEnabled(true)
      global.setCacheMaxAge(global.constants.cachemaxage1w)
      break
    case 'cache4w':
      global.setCacheEnabled(true)
      global.setCacheMaxAge(global.constants.cachemaxage4w)
      break
    case 'cacheflush':
      try {
        await clearDatabase()
      } catch (error) {
        console.error(error.message)
      }

      document.getElementById('cacheflushtext').innerText = t('cacheflushed')
      setTimeout(() => {
        document.getElementById('cacheflushtext').innerText = t('cacheflush')
      }, 2000)
      break

    case 'showhelp':
      global.setShowHelp(true)
      global.setInputsDisabled(true)
      emit('hideMenu')
      break
  }
}

function cacheSettingsUpdated() {
  cacheids.forEach(
    (id) =>
      (document
        .getElementById(id)
        .getElementsByTagName('img')[0].style.visibility = 'hidden')
  )

  if (!global.state.cacheEnabled) {
    document
      .getElementById('cachedisable')
      .getElementsByTagName('img')[0].style.visibility = 'visible'
  } else {
    switch (global.state.cacheMaxAge) {
      case global.constants.cachemaxage1h:
        document
          .getElementById('cache1h')
          .getElementsByTagName('img')[0].style.visibility = 'visible'

        break
      case global.constants.cachemaxage6h:
        document
          .getElementById('cache6h')
          .getElementsByTagName('img')[0].style.visibility = 'visible'

        break
      case global.constants.cachemaxage1d:
        document
          .getElementById('cache1d')
          .getElementsByTagName('img')[0].style.visibility = 'visible'

        break
      case global.constants.cachemaxage1w:
        document
          .getElementById('cache1w')
          .getElementsByTagName('img')[0].style.visibility = 'visible'

        break
      case global.constants.cachemaxage4w:
        document
          .getElementById('cache4w')
          .getElementsByTagName('img')[0].style.visibility = 'visible'
    }
  }
}

onMounted(() => {
  cacheSettingsUpdated()
})
</script>

<style scoped>
.menu {
  /* don't know, why resetting cursor is necessary to prevent changing to text cursor, when not disabled */
  cursor: default;
  font-size: 85%;
  position: absolute;
  margin-right: 3px;
  background-color: #ddd;
  right: 0;
  z-index: 10;
  border: 1px solid black;
}
.menuitem {
  height: 25px;
  line-height: 25px;
  display: flex;
  align-items: center;
  padding-right: 0.45em;
}
.menuicon {
  visibility: hidden;
  height: 0.9em;
  margin-right: 0.45em;
  padding-left: 0.45em;
}
.menuheading {
  margin-left: 5px;
  margin-right: 5px;
}
@media (hover: hover) and (pointer: fine) {
  .menuitem:hover {
    /* equals filter: invert(0.25) on #ddd */
    background-color: #aeaeae;
  }
}

.helpicon {
  visibility: visible;
}
.disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>
