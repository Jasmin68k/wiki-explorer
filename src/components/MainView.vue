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
      <!-- <categories-checkbox-filter
        v-if="
          ((!global.state.mobileMode &&
            global.state.resultsCategoriesEnabled) ||
            global.state.mobileMode) &&
          resultsCategoriesAllArray.length > 0 &&
          global.state.resultsCategoriesDone
        "
        :items="resultsCategoriesAllArray"
        :root-height="scrollboxContainerHeight"
        @windowResize="windowResized"
      ></categories-checkbox-filter> -->

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

    <!-- <div
      v-if="
        (!global.state.showHelp && !global.state.mobileMode) ||
        (!global.state.showHelp && global.state.mobileMode)
      "
      class="grid-item-maininfo"
      :class="{
        mobile: global.state.mobileMode
      }"
      ref="maininfo"
    >
      <main-title-info></main-title-info>
    </div> -->

    <status-bar
      class="grid-item-statusbar"
      v-if="!global.state.showHelp"
    ></status-bar>
    <!-- 
    <categories-redirects
      v-if="!global.state.showHelp"
      class="grid-item-categoriesredirects"
      :class="{
        mobile: global.state.mobileMode,
        checkbox:
          global.state.resultsCategoriesEnabled && !global.state.mobileMode
      }"
    ></categories-redirects> -->

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
  // nextTick,
  // onMounted,
  // onBeforeUnmount,
  ref
} from 'vue'
import InputForm from './InputForm.vue'
// import MainTitleInfo from './MainTitleInfo.vue'
import Outgraph from './Outgraph.vue'
// import CategoriesCheckboxFilter from './CategoriesCheckboxFilter.vue'
import StatusBar from './StatusBar.vue'
// import CategoriesRedirects from './CategoriesRedirects.vue'
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

const { locale } = useI18n({})

const global = inject('global')

const gridcontainer = ref(null)
const inputarea = ref(null)
// const maininfo = ref(null)

// const scrollboxContainerHeight = ref(300)

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
  if (!global.state.displayResultsArray[clickData.index].missing) {
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

// function modeSwitched() {
// windowResized()
// }
function showHelpSwitched() {
  global.setInputsDisabled(global.state.showHelp)
}
// async function windowResized() {
//   await nextTick()
//   if (!global.state.mobileMode) {
//     scrollboxContainerHeight.value =
//       gridcontainer.value.getBoundingClientRect().height -
//       inputarea.value.getBoundingClientRect().height
//   } else {
//     scrollboxContainerHeight.value =
//       gridcontainer.value.getBoundingClientRect().height -
//       inputarea.value.getBoundingClientRect().height
//   }
// }

// onMounted(() => {
//   window.addEventListener('resize', windowResized)
//   windowResized()
// })

// onBeforeUnmount(() => {
//   window.removeEventListener('resize', windowResized)
// })
</script>

<style scoped>
/* .inputcategoriescontainer {
  position: relative;
} */

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

/* .grid-item-checkbox {
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
} */

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
/* .grid-item-categoriesredirects {
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
} */
</style>
