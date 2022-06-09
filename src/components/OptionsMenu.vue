<template>
  <div class="menu">
    <div class="menuheading">
      <span class="menutext">
        <strong>{{ t('cache') }}</strong></span
      >
    </div>
    <div
      @click.prevent="cacheDisabledClicked"
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
      <img class="menuicon" src="../assets/images/check-mark.svg" /><span
        class="menutext"
        >{{ t('cachedisabled') }}</span
      >
    </div>
    <div
      @click.prevent="cache1hClicked"
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
      <img class="menuicon" src="../assets/images/check-mark.svg" /><span
        class="menutext"
        >{{ t('cache1h') }}</span
      >
    </div>
    <div
      @click.prevent="cache6hClicked"
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
      <img class="menuicon" src="../assets/images/check-mark.svg" /><span
        class="menutext"
        >{{ t('cache6h') }}</span
      >
    </div>
    <div
      @click.prevent="cache1dClicked"
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
      <img class="menuicon" src="../assets/images/check-mark.svg" /><span
        class="menutext"
        >{{ t('cache1d') }}</span
      >
    </div>
    <div
      @click.prevent="cache1wClicked"
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
      <img class="menuicon" src="../assets/images/check-mark.svg" /><span
        class="menutext"
        >{{ t('cache1w') }}</span
      >
    </div>
    <div
      @click.prevent="cache4wClicked"
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
      <img class="menuicon" src="../assets/images/check-mark.svg" /><span
        class="menutext"
        >{{ t('cache4w') }}</span
      >
    </div>
    <div
      @click.prevent="cacheFlushClicked"
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
        class="menutext"
        id="cacheflushtext"
        >{{ t('cacheflush') }}</span
      >
    </div>
    <div><hr /></div>
    <div @click.prevent="showHelpClicked" id="showhelp" class="menuitem">
      <img class="menuicon helpicon" src="../assets/images/question-mark.svg" />
      <span class="menutext">{{ t('help') }}</span>
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

function cacheDisabledClicked() {
  allItemsUnchecked()
  document
    .getElementById('cachedisable')
    .getElementsByTagName('img')[0].style.visibility = 'visible'
  global.setCacheEnabled(false)
}

function cache1hClicked() {
  allItemsUnchecked()
  document
    .getElementById('cache1h')
    .getElementsByTagName('img')[0].style.visibility = 'visible'
  global.setCacheEnabled(true)
  global.setCacheMaxAge(global.constants.cachemaxage1h)
}
function cache6hClicked() {
  allItemsUnchecked()
  document
    .getElementById('cache6h')
    .getElementsByTagName('img')[0].style.visibility = 'visible'
  global.setCacheEnabled(true)
  global.setCacheMaxAge(global.constants.cachemaxage6h)
}
function cache1dClicked() {
  allItemsUnchecked()
  document
    .getElementById('cache1d')
    .getElementsByTagName('img')[0].style.visibility = 'visible'
  global.setCacheEnabled(true)
  global.setCacheMaxAge(global.constants.cachemaxage1d)
}
function cache1wClicked() {
  allItemsUnchecked()
  document
    .getElementById('cache1w')
    .getElementsByTagName('img')[0].style.visibility = 'visible'
  global.setCacheEnabled(true)
  global.setCacheMaxAge(global.constants.cachemaxage1w)
}
function cache4wClicked() {
  allItemsUnchecked()
  document
    .getElementById('cache4w')
    .getElementsByTagName('img')[0].style.visibility = 'visible'
  global.setCacheEnabled(true)
  global.setCacheMaxAge(global.constants.cachemaxage4w)
}

async function cacheFlushClicked() {
  try {
    await clearDatabase()
  } catch (error) {
    console.error(error.message)
  }

  document.getElementById('cacheflushtext').innerText = t('cacheflushed')
  setTimeout(() => {
    document.getElementById('cacheflushtext').innerText = t('cacheflush')
  }, 2000)
}

function showHelpClicked() {
  global.setShowHelp(true)
  global.setInputsDisabled(true)
  emit('hideMenu')
}

function allItemsUnchecked() {
  cacheids.forEach(
    (id) =>
      (document
        .getElementById(id)
        .getElementsByTagName('img')[0].style.visibility = 'hidden')
  )
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
}
.menuicon {
  visibility: hidden;
  height: 0.9em;
  margin-right: 0.45em;
  padding-left: 0.45em;
}
.menuheading {
  margin-left: 0.45em;
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
.menutext {
  margin-right: 0.45em;
}
</style>
