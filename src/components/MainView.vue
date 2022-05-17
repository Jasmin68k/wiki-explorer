<template>
  <div
    class="grid-container-base"
    :class="{
      mobile: global.state.mobileMode,
      'grid-container':
        global.state.checkboxFilterEnabled &&
        global.state.resultsCategoriesEnabled &&
        !global.state.mobileMode,
      'grid-container-nocategoriesredirectscheckbox':
        (!global.state.checkboxFilterEnabled ||
          !global.state.resultsCategoriesEnabled) &&
        !global.state.mobileMode
    }"
    ref="gridcontainer"
  >
    <div
      class="grid-item-input"
      :class="{
        mobile: global.state.mobileMode
      }"
      ref="inputarea"
    >
      <input-form
        @fetchDataClicked="fetchDataClicked"
        @showHelpClicked="showHelpSwitched"
        @resultsCategoriesChanged="resultsCategoriesChanged"
        @resultsRedirectsChanged="resultsRedirectsChanged"
        @checkboxFilterEnabledChanged="checkboxFilterEnabledChanged"
        @languageSwitched="languageSwitched"
        @modeSwitched="modeSwitched"
        @mobileDisplaySwitched="mobileDisplaySwitched"
        @buttonModeSwitched="buttonModeSwitched"
        @categoriesOnHoverChanged="categoriesOnHoverChanged"
      ></input-form>
    </div>
    <div
      v-if="
        (!global.state.showHelp &&
          !global.state.mobileMode &&
          global.state.checkboxFilterEnabled) ||
        (!global.state.showHelp &&
          global.state.mobileMode &&
          global.state.mobileDisplay === 'categories')
      "
      class="inputcategoriescontainer grid-item-checkbox categoriesredirects"
      :class="{
        mobile: global.state.mobileMode
      }"
    >
      <categories-checkbox-filter
        v-if="
          ((!global.state.mobileMode &&
            global.state.resultsCategoriesEnabled) ||
            (global.state.mobileMode &&
              global.state.mobileDisplay === 'categories')) &&
          resultsCategoriesAllArray.length > 0 &&
          global.state.resultsCategoriesDone
        "
        :items="resultsCategoriesAllArray"
        :root-height="scrollboxContainerHeight"
        @windowResize="windowResized"
      ></categories-checkbox-filter>
    </div>

    <outgraph
      v-if="
        (!global.state.showHelp && !global.state.mobileMode) ||
        (!global.state.showHelp &&
          global.state.mobileMode &&
          global.state.mobileDisplay === 'outgraph')
      "
      class="grid-item-graph"
      @circleButtonClicked="circleButtonClicked"
    ></outgraph>

    <div
      v-if="
        (!global.state.showHelp && !global.state.mobileMode) ||
        (!global.state.showHelp &&
          global.state.mobileMode &&
          global.state.mobileDisplay === 'maininfo')
      "
      class="grid-item-maininfo"
      :class="{
        mobile: global.state.mobileMode
      }"
      ref="maininfo"
    >
      <main-title-info></main-title-info>
    </div>

    <status-bar
      class="grid-item-statusbar"
      v-if="
        !global.state.showHelp &&
        global.state.filteredResultsArray.length > 0 &&
        (!global.state.mobileMode ||
          (global.state.mobileMode &&
            global.state.mobileDisplay === 'outgraph'))
      "
    ></status-bar>

    <categories-redirects
      v-if="!global.state.showHelp"
      class="grid-item-categoriesredirects"
      :class="{
        mobile: global.state.mobileMode,
        checkbox:
          global.state.checkboxFilterEnabled &&
          global.state.resultsCategoriesEnabled &&
          !global.state.mobileMode
      }"
    ></categories-redirects>

    <help
      v-if="global.state.showHelp"
      class="grid-item-help"
      :class="{
        mobile: global.state.mobileMode
      }"
    >
    </help>
  </div>
</template>

<script setup>
import {
  inject,
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount,
  ref
} from 'vue'
import InputForm from './InputForm.vue'
import MainTitleInfo from './MainTitleInfo.vue'
import Outgraph from './Outgraph.vue'
import CategoriesCheckboxFilter from './CategoriesCheckboxFilter.vue'
import StatusBar from './StatusBar.vue'
import CategoriesRedirects from './CategoriesRedirects.vue'
import Help from './Help.vue'
import {
  wikiFetchAddCategoriesToTitlePage,
  wikiFetchAddCategoriesToPages,
  wikiFetchAddRedirectsToTitlePage,
  wikiFetchAddRedirectsToPages,
  wikiFetchTitlePage,
  wikiFetchPages,
  wikiFetchGetRedirectTarget
} from '../wikifetch.js'

// import { createI18n, useI18n } from 'vue-i18n/index'
// import en from '../locales/en.json'
// import de from '../locales/de.json'
// createI18n({
//   locale: import.meta.env.VUE_APP_I18N_LOCALE || 'en',
//   fallbackLocale: import.meta.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
//   legacy: false,
//   messages: {
//     en,
//     de
//   }
// })

import { useI18n } from 'vue-i18n/index'
const { t, locale } = useI18n({})

const global = inject('global')

const gridcontainer = ref(null)
const inputarea = ref(null)
const maininfo = ref(null)

const scrollboxContainerHeight = ref(300)

const resultsCategoriesAllArray = computed(function () {
  if (
    !(
      global.state.resultsCategoriesDone &&
      global.state.resultsCategoriesEnabled &&
      ((!global.state.mobileMode && global.state.checkboxFilterEnabled) ||
        global.state.mobileMode)
    )
  ) {
    return []
  }
  let allCategoriesSet = new Set()

  for (const pageId of global.statefull.resultsMap.keys()) {
    const resultPage = global.statefull.resultsMap.get(pageId)
    if (
      resultPage.categories &&
      resultPage.title.toLowerCase().includes(global.state.filter.toLowerCase())
    ) {
      resultPage.categories.forEach((category) =>
        // no duplicate check needed in Set
        category
          .toLowerCase()
          .includes(global.state.filterCategories.toLowerCase())
          ? allCategoriesSet.add(category)
          : null
      )
    }
  }

  let allCategories = Array.from(allCategoriesSet)

  allCategories = allCategories.sort((a, b) => {
    return a.localeCompare(b)
  })

  return allCategories
})

const resultsCategoriesAllArrayUnfiltered = computed(function () {
  if (
    !(
      global.state.resultsCategoriesDone &&
      global.state.resultsCategoriesEnabled
    )
  ) {
    return []
  }
  let allCategoriesSet = new Set()

  for (const pageId of global.statefull.resultsMap.keys()) {
    const resultPage = global.statefull.resultsMap.get(pageId)
    if (resultPage.categories) {
      // Set doesn't allow duplicate values, so no check needed
      resultPage.categories.forEach((category) =>
        allCategoriesSet.add(category)
      )
    }
  }

  let allCategories = Array.from(allCategoriesSet)

  allCategories = allCategories.sort((a, b) => {
    return a.localeCompare(b)
  })

  return allCategories
})

async function getJson() {
  global.setInputsDisabled(true)
  global.statefull.resultsMap = await wikiFetchPages(
    global.state.title,
    global.state.language
  )

  global.setResultsCategoriesDone(false)

  if (global.state.resultsCategoriesEnabled) {
    getResultsCategories()
  }

  global.setResultsRedirectsDone(false)

  if (global.state.resultsRedirectsEnabled) {
    getResultsRedirects()
  }

  global.setGraphFirstItem(1)
  global.setInputsDisabled(false)
}

async function getResultsCategories() {
  // with big pages this requires lots of api fetches, which makes up majority of the wait time

  // skip fetch when no results
  if (global.statefull.resultsMap.size > 0) {
    global.statefull.resultsMap = await wikiFetchAddCategoriesToPages(
      global.state.title,
      global.state.language,
      global.statefull.resultsMap
    )
  }

  global.setResultsCategoriesDone(true)

  global.statefull.checkedCategories = new Set(
    resultsCategoriesAllArrayUnfiltered.value
  )
}

async function getResultsRedirects() {
  // skip fetch when no results
  if (global.statefull.resultsMap.size > 0) {
    global.statefull.resultsMap = await wikiFetchAddRedirectsToPages(
      global.state.title,
      global.state.language,
      global.statefull.resultsMap
    )
  }

  global.setResultsRedirectsDone(true)
}

async function getMainInfo() {
  global.statefull.titlePage = await wikiFetchTitlePage(
    global.state.title,
    global.state.language
  )

  global.setRedirectsDone(false)

  if (!global.statefull.titlePage.missing) {
    // needs await, otherwise one will overwrite the other
    await getCategories()
    await getRedirects()
  }
}
async function getCategories() {
  global.statefull.titlePage = await wikiFetchAddCategoriesToTitlePage(
    global.state.title,
    global.state.language,
    global.statefull.titlePage
  )
}

async function getRedirects() {
  global.statefull.titlePage = await wikiFetchAddRedirectsToTitlePage(
    global.state.title,
    global.state.language,
    global.statefull.titlePage
  )

  global.setRedirectsDone(true)
}

async function circleButtonClicked(clickData) {
  if (!global.state.displayResultsArray[clickData.index].missing) {
    switch (global.state.buttonMode) {
      case 'search':
        if (!clickData.event.ctrlKey) {
          global.setTitle(
            await wikiFetchGetRedirectTarget(
              global.state.displayResultsArray[clickData.index].title,
              global.state.language
            )
          )
          getMainInfo()
          getJson()
        }

        break

      case 'catsredir':
        if (clickData.event.ctrlKey) {
          global.setTitle(
            await wikiFetchGetRedirectTarget(
              global.state.displayResultsArray[clickData.index].title,
              global.state.language
            )
          )
          getMainInfo()
          getJson()
        }
        break

      case 'wiki':
        window.open(
          global.state.displayResultsArray[clickData.index].url,
          '_blank'
        )
        break
    }
  }
}

function buttonModeSwitched() {
  windowResized()
  updateButtonModeString()
}

async function fetchDataClicked(value) {
  if (value) {
    global.setTitle(
      await wikiFetchGetRedirectTarget(value, global.state.language)
    )

    getMainInfo()
    getJson()
  }
}
async function resultsCategoriesChanged() {
  if (
    global.state.resultsCategoriesEnabled &&
    !global.state.resultsCategoriesDone
  ) {
    getResultsCategories()
  }
  if (
    global.state.resultsCategoriesEnabled &&
    global.state.resultsCategoriesDone
  ) {
    global.statefull.checkedCategories = new Set(
      resultsCategoriesAllArrayUnfiltered.value
    )
  }
}
async function resultsRedirectsChanged() {
  if (
    global.state.resultsRedirectsEnabled &&
    !global.state.resultsRedirectsDone
  ) {
    await getResultsRedirects()
  }
}
function checkboxFilterEnabledChanged() {
  // for switch from desktop to mobile
  if (!global.state.checkboxFilterEnabled) {
    global.statefull.checkedCategories = new Set(
      resultsCategoriesAllArrayUnfiltered.value
    )
  }

  if (global.state.checkboxFilterEnabled) {
    global.statefull.checkedCategories = new Set(
      resultsCategoriesAllArrayUnfiltered.value
    )
  }
}
function languageSwitched(value) {
  // $i18n.locale = value
  locale.value = value

  global.setLanguage(value)
  updateButtonModeString()
}
function categoriesOnHoverChanged() {
  updateButtonModeString()
}
function updateButtonModeString() {
  switch (global.state.buttonMode) {
    case 'search':
      if (!global.state.categoriesOnHover) {
        global.setButtonModeString(
          t('lmb') +
            t('search') +
            ' - ' +
            t('ctrllmb') +
            t('showcatsredir') +
            ' - ' +
            t('mmb') +
            t('openwiki')
        )
      } else {
        global.setButtonModeString(
          t('lmb') +
            t('search') +
            ' - ' +
            t('hover') +
            t('showcatsredir') +
            ' - ' +
            t('mmb') +
            t('openwiki')
        )
      }

      break
    case 'catsredir':
      if (!global.state.categoriesOnHover) {
        global.setButtonModeString(
          t('lmb') +
            t('showcatsredir') +
            ' - ' +
            t('ctrllmb') +
            t('search') +
            ' - ' +
            t('mmb') +
            t('openwiki')
        )
      } else {
        global.setButtonModeString(
          t('hover') +
            t('showcatsredir') +
            ' - ' +
            t('ctrllmb') +
            t('search') +
            ' - ' +
            t('mmb') +
            t('openwiki')
        )
      }
      break
    case 'wiki':
      if (!global.state.categoriesOnHover) {
        global.setButtonModeString(t('lmb') + t('openwiki'))
      } else {
        global.setButtonModeString(
          t('lmb') + t('openwiki') + ' - ' + t('hover') + t('showcatsredir')
        )
      }
      break
  }
}

function modeSwitched() {
  windowResized()
}
function mobileDisplaySwitched() {
  windowResized()
}
function showHelpSwitched() {
  global.setInputsDisabled(global.state.showHelp)
}
async function windowResized() {
  await nextTick()
  if (!global.state.mobileMode) {
    scrollboxContainerHeight.value =
      gridcontainer.value.getBoundingClientRect().height -
      inputarea.value.getBoundingClientRect().height -
      maininfo.value.getBoundingClientRect().height
  } else {
    scrollboxContainerHeight.value =
      gridcontainer.value.getBoundingClientRect().height -
      inputarea.value.getBoundingClientRect().height
  }
}

onMounted(() => {
  window.addEventListener('resize', windowResized)
  windowResized()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', windowResized)
})
</script>

<style scoped>
.inputcategoriescontainer {
  position: relative;
}

.grid-container-base {
  display: grid;
}

.grid-container {
  width: 100%;
  grid-template-columns: 3fr minmax(320px, 1fr);
  grid-template-rows: min-content min-content 3fr 1fr;
  height: 100vh;
}

.grid-container-nocategoriesredirectscheckbox {
  width: 100%;
  grid-template-columns: 1fr;
  grid-template-rows: min-content min-content 2fr 1fr;
  height: 100vh;
}

.grid-container-base.mobile {
  grid-template-columns: 1fr;
  grid-template-rows: min-content min-content 1fr;
  height: 100vh;
}

.grid-item-input {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}
.grid-item-input.mobile {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

.grid-item-graph {
  grid-column: 1 / 2;
  grid-row: 3 / 4;
}

.grid-item-checkbox {
  grid-column: 2 / 3;
  grid-row: 2 / 5;
}
.grid-item-checkbox.mobile {
  grid-column: 1 / 2;
  grid-row: 2 / 4;
}
.grid-item-checkbox.categoriesredirects {
  grid-column: 2 / 3;
  grid-row: 2 / 4;
}

.grid-item-maininfo {
  grid-column: 1 / 2;
  grid-row: 4 / 5;
  overflow-y: auto;
}

.grid-item-maininfo.mobile {
  grid-column: 1 / 2;
  grid-row: 2 / 4;
  overflow-y: auto;
}

.grid-item-statusbar {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}

.grid-item-help {
  grid-column: 1 / 3;
  grid-row: 2 / 5;
  width: 100%;
  overflow-y: auto;
}
.grid-item-help.mobile {
  grid-column: 1 / 2;
  grid-row: 2 / 4;
}
.grid-item-categoriesredirects {
  grid-column: 2 / 3;
  grid-row: 2 / 5;
  width: 100%;
  overflow-y: auto;
}
.grid-item-categoriesredirects.mobile {
  grid-column: 1 / 2;
  grid-row: 2 / 4;
}
.grid-item-categoriesredirects.checkbox {
  grid-row: 4 / 5;
  width: 100%;
  overflow-y: auto;
}
</style>
