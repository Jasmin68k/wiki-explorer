<template>
  <div
    class="grid-container"
    :class="{
      mobile: global.state.mobileMode
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
        @languageSwitched="languageSwitched"
      ></input-form>
    </div>

    <div
      v-if="!global.state.showHelp"
      class="grid-item-tabarea"
      :class="{
        mobile: global.state.mobileMode
      }"
    >
      <TabArea
        :categoriesAll="resultsCategoriesAllArray"
        @circleButtonClicked="circleButtonClicked"
      ></TabArea>
    </div>

    <!-- mobile mode -> outgraph in tabs -->
    <outgraph
      v-if="!global.state.showHelp && !global.state.mobileMode"
      class="grid-item-graph"
      @circleButtonClicked="circleButtonClicked"
    ></outgraph>

    <status-bar
      class="grid-item-statusbar"
      v-if="!global.state.showHelp"
    ></status-bar>

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
import { inject, computed, ref } from 'vue'
import InputForm from './InputForm.vue'

import Outgraph from './Outgraph.vue'

import StatusBar from './StatusBar.vue'

import TabArea from './TabArea.vue'
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

import { useI18n } from 'vue-i18n/index'

const { locale } = useI18n({})

const global = inject('global')

const gridcontainer = ref(null)
const inputarea = ref(null)

const resultsCategoriesAllArray = computed(function () {
  if (
    !(
      global.state.resultsCategoriesDone &&
      global.state.resultsCategoriesEnabled &&
      (!global.state.mobileMode || global.state.mobileMode)
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
      global.state.language,
      global.statefull.resultsMap
    )
  }

  global.setResultsRedirectsDone(true)
}

async function getMainInfo() {
  global.setMainInfoDone(false)

  global.statefull.titlePage = await wikiFetchTitlePage(
    global.state.title,
    global.state.language
  )

  global.setMainInfoDone(true)

  global.setRedirectsDone(false)
  global.setCategoriesDone(false)

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
  global.setCategoriesDone(true)
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
  if (!global.state.displayResults[clickData.index].missing) {
    if (!clickData.event.ctrlKey) {
      global.setTitle(
        await wikiFetchGetRedirectTarget(
          global.state.displayResults[clickData.index].title,
          global.state.language
        )
      )
      getMainInfo()
      getJson()
    }
  }
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
function languageSwitched(value) {
  // $i18n.locale = value
  locale.value = value

  global.setLanguage(value)
}

function showHelpSwitched() {
  global.setInputsDisabled(global.state.showHelp)
}
</script>

<style scoped>
.grid-container {
  display: grid;
  width: 100%;
  grid-template-columns: 3fr minmax(320px, 1fr);
  grid-template-rows: min-content min-content 1fr;
  height: 100vh;
}

.grid-container.mobile {
  grid-template-columns: 1fr;
  grid-template-rows: min-content min-content 1fr;
}

.grid-item-input {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}
.grid-item-input.mobile {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

.grid-item-tabarea {
  grid-column: 2 / 3;
  grid-row: 3 / 4;
}
.grid-item-tabarea.mobile {
  grid-column: 1 / 2;
  grid-row: 3 / 4;
}

.grid-item-graph {
  grid-column: 1 / 2;
  grid-row: 3 / 4;
}

.grid-item-statusbar {
  grid-column: 1 / 3;
  grid-row: 2 / 3;
}

.grid-item-help {
  grid-column: 1 / 3;
  grid-row: 2 / 4;
  width: 100%;
  overflow-y: auto;
}
.grid-item-help.mobile {
  grid-column: 1 / 2;
  grid-row: 2 / 4;
}
</style>
