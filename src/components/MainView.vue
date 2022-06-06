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
  wikiFetchGetRedirectTarget,
  wikiFetchSinglePage
} from '../wikifetch.js'

import {
  openDatabase,
  getCacheMainInfo,
  getCacheCategories,
  getCacheRedirects,
  getCacheResults,
  getCacheResultsCategories,
  getCacheResultsRedirects,
  putCacheMainInfo,
  putCacheCategories,
  putCacheRedirects,
  putCacheResults,
  putCacheResultsCategories,
  putCacheResultsRedirects
} from '../localcache.js'

import { useI18n } from 'vue-i18n/index'
import { Page } from '../datamodels'

const { locale } = useI18n({})

const global = inject('global')

const gridcontainer = ref(null)
const inputarea = ref(null)

// ms - temp hardcoded 1 h
const cacheMaxAge = 3600000
// temp hardcoded
const cacheEnabled = true

let categoriesAddedPages = new Map()
let categoriesDeletedPages = new Set()
let redirectsAddedPages = new Set()

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

  if (cacheEnabled) {
    let cacheerror = false
    let cachedata
    try {
      cachedata = await getCacheResults(global.state.title)
    } catch (error) {
      console.error(error.message)
      cacheerror = true
    }

    // add date/max age check later / undefined on successful request, but key does not exist in database
    if (
      !cacheerror &&
      !(cachedata === undefined) &&
      cachedata.date > new Date() - cacheMaxAge
    ) {
      for (const pageId of cachedata.pages.keys()) {
        const resultPage = cachedata.pages.get(pageId)

        global.statefull.resultsPages.set(
          pageId,
          new Page({
            title: resultPage.title,
            url: resultPage.url,
            pageid: resultPage.pageid,
            missing: resultPage.missing
          })
        )
      }
    } else {
      global.statefull.resultsPages = await wikiFetchPages(
        global.state.title,
        global.state.language
      )
      try {
        await putCacheResults(global.statefull.resultsPages, global.state.title)
      } catch (error) {
        console.error(error.message)
      }
    }
  } else {
    global.statefull.resultsPages = await wikiFetchPages(
      global.state.title,
      global.state.language
    )
  }

  global.setGraphFirstItem(1)
  global.setInputsDisabled(false)

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
  // skip fetch when no results
  if (global.statefull.resultsPages.size > 0) {
    if (cacheEnabled) {
      let cacheerror = false
      let cachedata
      try {
        cachedata = await getCacheResultsCategories(global.state.title)
      } catch (error) {
        console.error(error.message)
        cacheerror = true
      }

      // add date/max age check later / undefined on successful request, but key does not exist in database
      if (
        !cacheerror &&
        !(cachedata === undefined) &&
        cachedata.date > new Date() - cacheMaxAge
      ) {
        let pageIds = new Set()

        for (const pageId of cachedata.pages.keys()) {
          pageIds.add(pageId)

          if (!global.statefull.resultsPages.get(pageId)) {
            const newpage = await wikiFetchSinglePage(
              pageId,
              global.state.language
            )

            if (newpage.missing !== '') {
              categoriesAddedPages.set(
                pageId,
                new Page({
                  title: newpage.title,
                  url: newpage.url,
                  pageid: newpage.pageid,
                  missing: false
                })
              )
            } else {
              categoriesAddedPages.set(
                pageId,
                new Page({
                  title: newpage.title,
                  url: newpage.url,
                  pageid: Number(pageId)
                })
              )
            }
          }

          const resultPage = cachedata.pages.get(pageId)

          resultPage.categories.forEach((category) => {
            if (global.statefull.resultsPages.get(pageId)) {
              global.statefull.resultsPages
                .get(pageId)
                .categories.push(category)
            } else {
              categoriesAddedPages.get(pageId).categories.push(category)
            }
          })
        }

        for (const pageId of global.statefull.resultsPages.keys()) {
          if (!pageIds.has(pageId)) {
            categoriesDeletedPages.add(pageId)
          }
        }
      } else {
        // with big pages this requires lots of api fetches, which makes up majority of the wait time

        const wikiFetchCategories = await wikiFetchAddCategoriesToPages(
          global.state.title,
          global.state.language,
          global.statefull.resultsPages
        )

        global.statefull.resultsPages = wikiFetchCategories.pages
        categoriesAddedPages = wikiFetchCategories.addedPages
        categoriesDeletedPages = wikiFetchCategories.deletedPages

        try {
          await putCacheResultsCategories(
            global.statefull.resultsPages,
            global.state.title
          )
        } catch (error) {
          console.error(error.message)
        }
      }
    } else {
      const wikiFetchCategories = await wikiFetchAddCategoriesToPages(
        global.state.title,
        global.state.language,
        global.statefull.resultsPages
      )

      global.statefull.resultsPages = wikiFetchCategories.pages
      categoriesAddedPages = wikiFetchCategories.addedPages
      categoriesDeletedPages = wikiFetchCategories.deletedPages
    }
  }

  // leave this here, added/deleted pages can happen with categories, even if all is being fetched from wikipedia
  // (getting new list)

  // execute cache discrepancy cleanup if both categories and redirects are done
  // this fails in EXTREMELY(!!!) unlikely case that there is actually something to execute (which won't happen too often)
  // AND getResultsCategories() and getResultsRedirects() arrive here at EXACTLY(!!!)
  // the same time. In that case, cache changes get lost and some discrepancy stays for the few entries.
  if (
    !global.state.resultsRedirectsEnabled ||
    (global.state.resultsRedirectsEnabled && global.state.resultsRedirectsDone)
  ) {
    await executeCacheDeferred()
  }

  global.setResultsCategoriesDone(true)

  global.statefull.checkedCategories = new Set(
    resultsCategoriesAllUnfiltered.value
  )
}

async function getResultsRedirects() {
  // skip fetch when no results
  if (global.statefull.resultsPages.size > 0) {
    if (cacheEnabled) {
      let cacheerror = false
      let cachedata
      try {
        cachedata = await getCacheResultsRedirects(global.state.title)
      } catch (error) {
        console.error(error.message)
        cacheerror = true
      }

      // add date/max age check later / undefined on successful request, but key does not exist in database
      if (
        !cacheerror &&
        !(cachedata === undefined) &&
        cachedata.date > new Date() - cacheMaxAge
      ) {
        let pageIds = new Set()

        // add all pages
        for (const pageId of global.statefull.resultsPages.keys()) {
          pageIds.add(pageId)
        }

        for (const pageId of cachedata.pages.keys()) {
          // remove pages hit with cache
          pageIds.delete(pageId)

          const resultPage = cachedata.pages.get(pageId)
          // redirects are added only to existing pages individually
          if (global.statefull.resultsPages.get(pageId)) {
            resultPage.redirects.forEach((redirect) =>
              global.statefull.resultsPages.get(pageId).redirects.push(redirect)
            )
          }
        }

        //pageIds set has missing pageids

        if (pageIds.size > 0) {
          pageIds.forEach((pageId) => {
            redirectsAddedPages.add(pageId)
          })
        }
      } else {
        global.statefull.resultsPages = await wikiFetchAddRedirectsToPages(
          global.state.language,
          global.statefull.resultsPages
        )

        try {
          await putCacheResultsRedirects(
            global.statefull.resultsPages,
            global.state.title
          )
        } catch (error) {
          console.error(error.message)
        }
      }
    } else {
      global.statefull.resultsPages = await wikiFetchAddRedirectsToPages(
        global.state.language,
        global.statefull.resultsPages
      )
    }
  }

  // leave this here, added/deleted pages can happen with categories, even if all is being fetched from wikipedia
  // (getting new list)

  // execute cache discrepancy cleanup if both categories and redirects are done
  // this fails in EXTREMELY(!!!) unlikely case that there is actually something to execute (which won't happen too often)
  // AND getResultsCategories() and getResultsRedirects() arrive here at EXACTLY(!!!)
  // the same time. In that case, cache changes get lost and some discrepancy stays for the few entries.
  if (
    !global.state.resultsCategoriesEnabled ||
    (global.state.resultsCategoriesEnabled &&
      global.state.resultsCategoriesDone)
  ) {
    await executeCacheDeferred()
  }

  global.setResultsRedirectsDone(true)
}

// deferred to allow parallel fetching of categories and redirects
// this is called from getResultsCategories() or getResultsRedirects(),
// whichever finishes last
async function executeCacheDeferred() {
  // deleted categories
  if (categoriesDeletedPages.size > 0) {
    categoriesDeletedPages.forEach((pageId) => {
      global.statefull.resultsPages.delete(pageId)
      // not needed anymore
      redirectsAddedPages.delete(pageId)
    })
    categoriesDeletedPages = new Set()
  }

  // added categories
  if (categoriesAddedPages.size > 0) {
    // first add redirects, if active
    if (global.state.resultsCategoriesEnabled) {
      await wikiFetchAddRedirectsToPages(
        global.state.language,
        categoriesAddedPages
      )
    }
    // add to resultsPages
    for (const pageId of categoriesAddedPages.keys()) {
      global.statefull.resultsPages.set(
        pageId,
        new Page({
          title: categoriesAddedPages.get(pageId).title,
          url: categoriesAddedPages.get(pageId).url,
          pageid: categoriesAddedPages.get(pageId).pageid,
          missing: categoriesAddedPages.get(pageId).missing,
          categories: categoriesAddedPages.get(pageId).categories,
          redirects: categoriesAddedPages.get(pageId).redirects
        })
      )
    }
    categoriesAddedPages = new Map()
  }

  // added redirects
  if (redirectsAddedPages.size > 0) {
    let resultsPagesMissing = new Map()

    redirectsAddedPages.forEach((pageId) => {
      resultsPagesMissing.set(
        pageId,
        new Page({
          title: global.statefull.resultsPages.get(pageId).title
          // url: global.statefull.resultsPages.get(pageId).url,
          // pageid: global.statefull.resultsPages.get(pageId).pageid,
          // missing: global.statefull.resultsPages.get(pageId).missing,
          // categories: global.statefull.resultsPages.get(pageId).categories
        })
      )
    })

    // fetch missing redirects
    resultsPagesMissing = await wikiFetchAddRedirectsToPages(
      global.state.language,
      resultsPagesMissing
    )

    // add to resultsPages
    redirectsAddedPages.forEach((pageId) => {
      global.statefull.resultsPages.get(pageId).redirects =
        resultsPagesMissing.get(pageId).redirects
    })
    redirectsAddedPages = new Set()
  }
}

async function getMainInfo() {
  global.setMainInfoDone(false)

  if (cacheEnabled) {
    let cacheerror = false
    let cachedata
    try {
      cachedata = await getCacheMainInfo(global.state.title)
    } catch (error) {
      console.error(error.message)
      cacheerror = true
    }

    // add date/max age check later / undefined on successful request, but key does not exist in database
    if (
      !cacheerror &&
      !(cachedata === undefined) &&
      cachedata.date > new Date() - cacheMaxAge
    ) {
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
  } else {
    global.statefull.titlePage = await wikiFetchTitlePage(
      global.state.title,
      global.state.language
    )
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
  if (cacheEnabled) {
    let cacheerror = false
    let cachedata
    try {
      cachedata = await getCacheCategories(global.state.title)
    } catch (error) {
      console.error(error.message)
      cacheerror = true
    }

    // add date/max age check later / undefined on successful request, but key does not exist in database
    if (
      !cacheerror &&
      !(cachedata === undefined) &&
      cachedata.date > new Date() - cacheMaxAge
    ) {
      global.statefull.titlePage.categories = cachedata.categories
    } else {
      global.statefull.titlePage = await wikiFetchAddCategoriesToTitlePage(
        global.state.title,
        global.state.language,
        global.statefull.titlePage
      )
    }

    try {
      await putCacheCategories(global.statefull.titlePage)
    } catch (error) {
      console.error(error.message)
    }
  } else {
    global.statefull.titlePage = await wikiFetchAddCategoriesToTitlePage(
      global.state.title,
      global.state.language,
      global.statefull.titlePage
    )
  }
  global.setCategoriesDone(true)
}

async function getRedirects() {
  if (cacheEnabled) {
    let cacheerror = false
    let cachedata
    try {
      cachedata = await getCacheRedirects(global.state.title)
    } catch (error) {
      console.error(error.message)
      cacheerror = true
    }

    // add date/max age check later / undefined on successful request, but key does not exist in database
    if (
      !cacheerror &&
      !(cachedata === undefined) &&
      cachedata.date > new Date() - cacheMaxAge
    ) {
      global.statefull.titlePage.redirects = cachedata.redirects
    } else {
      global.statefull.titlePage = await wikiFetchAddRedirectsToTitlePage(
        global.state.title,
        global.state.language,
        global.statefull.titlePage
      )
    }

    try {
      await putCacheRedirects(global.statefull.titlePage)
    } catch (error) {
      console.error(error.message)
    }
  } else {
    global.statefull.titlePage = await wikiFetchAddRedirectsToTitlePage(
      global.state.title,
      global.state.language,
      global.statefull.titlePage
    )
  }

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
