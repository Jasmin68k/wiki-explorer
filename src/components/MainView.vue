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
        :categoriesAll="resultsCategoriesAll"
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
import { inject, computed, ref, onMounted } from 'vue'
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

import {
  openDatabase,
  getCacheMainInfo,
  getCacheCategories,
  getCacheRedirects,
  putCacheMainInfo,
  putCacheCategories,
  putCacheRedirects,
  putCacheResults,
  putCacheResultsCategories,
  putCacheResultsRedirects
} from '../localcache.js'

import { useI18n } from 'vue-i18n/index'

const { locale } = useI18n({})

const global = inject('global')

const gridcontainer = ref(null)
const inputarea = ref(null)

const resultsCategoriesAll = computed(function () {
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

  for (const pageId of global.statefull.resultsPages.keys()) {
    const resultPage = global.statefull.resultsPages.get(pageId)
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

const resultsCategoriesAllUnfiltered = computed(function () {
  if (
    !(
      global.state.resultsCategoriesDone &&
      global.state.resultsCategoriesEnabled
    )
  ) {
    return []
  }
  let allCategoriesSet = new Set()

  for (const pageId of global.statefull.resultsPages.keys()) {
    const resultPage = global.statefull.resultsPages.get(pageId)
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

async function getResults() {
  global.setInputsDisabled(true)
  global.statefull.resultsPages = await wikiFetchPages(
    global.state.title,
    global.state.language
  )
  global.setGraphFirstItem(1)
  global.setInputsDisabled(false)
  try {
    await putCacheResults(global.statefull.resultsPages, global.state.title)
  } catch (error) {
    console.error(error.message)
  }

  global.setResultsCategoriesDone(false)
  if (global.state.resultsCategoriesEnabled) {
    getResultsCategories()
  }

  global.setResultsRedirectsDone(false)
  if (global.state.resultsRedirectsEnabled) {
    getResultsRedirects()
  }
}

async function getResultsCategories() {
  // with big pages this requires lots of api fetches, which makes up majority of the wait time

  // skip fetch when no results
  if (global.statefull.resultsPages.size > 0) {
    global.statefull.resultsPages = await wikiFetchAddCategoriesToPages(
      global.state.title,
      global.state.language,
      global.statefull.resultsPages
    )
  }

  global.setResultsCategoriesDone(true)
  try {
    await putCacheResultsCategories(
      global.statefull.resultsPages,
      global.state.title
    )
  } catch (error) {
    console.error(error.message)
  }

  global.statefull.checkedCategories = new Set(
    resultsCategoriesAllUnfiltered.value
  )
}

async function getResultsRedirects() {
  // skip fetch when no results
  if (global.statefull.resultsPages.size > 0) {
    global.statefull.resultsPages = await wikiFetchAddRedirectsToPages(
      global.state.language,
      global.statefull.resultsPages
    )
  }

  global.setResultsRedirectsDone(true)
  try {
    await putCacheResultsRedirects(
      global.statefull.resultsPages,
      global.state.title
    )
  } catch (error) {
    console.error(error.message)
  }
}

async function getMainInfo() {
  global.setMainInfoDone(false)

  let cacheerror = false
  let cachedata
  try {
    cachedata = await getCacheMainInfo(global.state.title)
  } catch (error) {
    console.error(error.message)
    cacheerror = true
  }

  // add date/max age check later / undefined on successful request, but key does not exist in database
  if (!cacheerror && !(cachedata === undefined)) {
    global.statefull.titlePage.extract = cachedata.extract
    global.statefull.titlePage.image = cachedata.image
    global.statefull.titlePage.title = cachedata.title
    global.statefull.titlePage.url = cachedata.url
    global.statefull.titlePage.pageid = cachedata.pageid
    global.statefull.titlePage.missing = cachedata.missing

    // don't do this, deletes categories and redirects property
    // then legnth not defined in CategoriesRedirectsTitle.vue
    // global.statefull.titlePage = cachedata
    // delete global.statefull.titlePage['date']
  } else {
    global.statefull.titlePage = await wikiFetchTitlePage(
      global.state.title,
      global.state.language
    )

    try {
      await putCacheMainInfo(global.statefull.titlePage)
    } catch (error) {
      console.error(error.message)
    }
  }
  global.setMainInfoDone(true)

  global.setRedirectsDone(false)
  global.setCategoriesDone(false)

  if (!global.statefull.titlePage.missing) {
    getCategories()
    getRedirects()
  }
}
async function getCategories() {
  let cacheerror = false
  let cachedata
  try {
    cachedata = await getCacheCategories(global.state.title)
  } catch (error) {
    console.error(error.message)
    cacheerror = true
  }

  // add date/max age check later / undefined on successful request, but key does not exist in database
  if (!cacheerror && !(cachedata === undefined)) {
    global.statefull.titlePage.categories = cachedata.categories
  } else {
    global.statefull.titlePage = await wikiFetchAddCategoriesToTitlePage(
      global.state.title,
      global.state.language,
      global.statefull.titlePage
    )
  }

  global.setCategoriesDone(true)
  try {
    await putCacheCategories(global.statefull.titlePage)
  } catch (error) {
    console.error(error.message)
  }
}

async function getRedirects() {
  let cacheerror = false
  let cachedata
  try {
    cachedata = await getCacheRedirects(global.state.title)
  } catch (error) {
    console.error(error.message)
    cacheerror = true
  }

  // add date/max age check later / undefined on successful request, but key does not exist in database
  if (!cacheerror && !(cachedata === undefined)) {
    global.statefull.titlePage.redirects = cachedata.redirects
  } else {
    global.statefull.titlePage = await wikiFetchAddRedirectsToTitlePage(
      global.state.title,
      global.state.language,
      global.statefull.titlePage
    )
  }

  global.setRedirectsDone(true)
  try {
    await putCacheRedirects(global.statefull.titlePage)
  } catch (error) {
    console.error(error.message)
  }
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
      getResults()
    }
  }
}

async function fetchDataClicked(value) {
  if (value) {
    global.setTitle(
      await wikiFetchGetRedirectTarget(value, global.state.language)
    )

    getMainInfo()
    getResults()
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
      resultsCategoriesAllUnfiltered.value
    )
  }
}
async function resultsRedirectsChanged() {
  if (
    global.state.resultsRedirectsEnabled &&
    !global.state.resultsRedirectsDone
  ) {
    getResultsRedirects()
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

onMounted(async () => {
  try {
    await openDatabase()
  } catch (error) {
    console.error(error.message)
  }
})
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
