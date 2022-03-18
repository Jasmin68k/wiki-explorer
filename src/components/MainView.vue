<template>
  <div
    class="grid-container-base"
    :class="{
      mobile: global.state.mobileMode,
      'grid-container':
        ((global.state.checkboxFilterEnabled &&
          global.state.resultsCategoriesEnabled) ||
          global.state.showCatsRedir) &&
        !global.state.mobileMode,
      'grid-container-nocategoriesredirectscheckbox':
        (!global.state.checkboxFilterEnabled ||
          !global.state.resultsCategoriesEnabled) &&
        !global.state.showCatsRedir &&
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
      class="inputcategoriescontainer grid-item-checkbox"
      :class="{
        mobile: global.state.mobileMode,
        categoriesredirects: global.state.showCatsRedir
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
      ></categories-checkbox-filter>
    </div>

    <outgraph
      v-if="
        (!global.state.showHelp && !global.state.mobileMode) ||
        (!global.state.showHelp &&
          !global.state.showCatsRedir &&
          global.state.mobileMode &&
          global.state.mobileDisplay === 'outgraph')
      "
      class="grid-item-graph"
      @circleButtonClicked="circleButtonClicked"
      @titleButtonClicked="titleButtonClicked"
    ></outgraph>

    <div
      v-if="
        (!global.state.showHelp && !global.state.mobileMode) ||
        (!global.state.showHelp &&
          !global.state.showCatsRedir &&
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
          (!global.state.showCatsRedir &&
            global.state.mobileMode &&
            global.state.mobileDisplay === 'outgraph'))
      "
    ></status-bar>

    <categories-redirects
      v-if="!global.state.showHelp && global.state.showCatsRedir"
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

<script>
import { inject } from 'vue'
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

export default {
  name: 'MainView',
  components: {
    InputForm,
    MainTitleInfo,
    Outgraph,
    CategoriesCheckboxFilter,
    Help,
    StatusBar,
    CategoriesRedirects
  },
  setup() {
    const global = inject('global')
    return { global }
  },
  data() {
    return {
      scrollboxContainerHeight: 300
    }
  },
  computed: {
    resultsCategoriesAllArray() {
      if (
        !(
          this.global.state.resultsCategoriesDone &&
          this.global.state.resultsCategoriesEnabled &&
          ((!this.global.state.mobileMode &&
            this.global.state.checkboxFilterEnabled) ||
            this.global.state.mobileMode)
        )
      ) {
        return []
      }
      let allCategoriesSet = new Set()

      for (const pageId of this.global.statefull.resultsMap.keys()) {
        const resultPage = this.global.statefull.resultsMap.get(pageId)
        if (
          resultPage.categories &&
          resultPage.title
            .toLowerCase()
            .includes(this.global.state.filter.toLowerCase())
        ) {
          resultPage.categories.forEach((category) =>
            // no duplicate check needed in Set
            category
              .toLowerCase()
              .includes(this.global.state.filterCategories.toLowerCase())
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
    },
    resultsCategoriesAllArrayUnfiltered() {
      if (
        !(
          this.global.state.resultsCategoriesDone &&
          this.global.state.resultsCategoriesEnabled
        )
      ) {
        return []
      }
      let allCategoriesSet = new Set()

      for (const pageId of this.global.statefull.resultsMap.keys()) {
        const resultPage = this.global.statefull.resultsMap.get(pageId)
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
    }
  },

  methods: {
    async getJson() {
      this.global.setInputsDisabled(true)
      this.global.statefull.resultsMap = await wikiFetchPages(
        this.global.state.title,
        this.global.state.language
      )

      this.global.setResultsCategoriesDone(false)

      if (this.global.state.resultsCategoriesEnabled) {
        this.getResultsCategories()
      }

      this.global.setResultsRedirectsDone(false)

      if (this.global.state.resultsRedirectsEnabled) {
        this.getResultsRedirects()
      }

      this.global.setGraphFirstItem(1)
      this.global.setInputsDisabled(false)
    },

    async getResultsCategories() {
      // with big pages this requires lots of api fetches, which makes up majority of the wait time

      // skip fetch when no results
      if (this.global.statefull.resultsMap.size > 0) {
        this.global.statefull.resultsMap = await wikiFetchAddCategoriesToPages(
          this.global.state.title,
          this.global.state.language,
          this.global.statefull.resultsMap
        )
      }

      this.global.setResultsCategoriesDone(true)

      this.global.statefull.checkedCategories = new Set(
        this.resultsCategoriesAllArrayUnfiltered
      )
    },

    async getResultsRedirects() {
      // skip fetch when no results
      if (this.global.statefull.resultsMap.size > 0) {
        this.global.statefull.resultsMap = await wikiFetchAddRedirectsToPages(
          this.global.state.title,
          this.global.state.language,
          this.global.statefull.resultsMap
        )
      }

      this.global.setResultsRedirectsDone(true)
    },

    async getMainInfo() {
      this.global.statefull.titlePage = await wikiFetchTitlePage(
        this.global.state.title,
        this.global.state.language
      )

      this.global.setRedirectsDone(false)

      if (!this.global.statefull.titlePage.missing) {
        // needs await, otherwise one will overwrite the other
        await this.getCategories()
        await this.getRedirects()
        this.global.setCatsRedirResult(this.global.statefull.titlePage)
      }
    },
    async getCategories() {
      this.global.statefull.titlePage = await wikiFetchAddCategoriesToTitlePage(
        this.global.state.title,
        this.global.state.language,
        this.global.statefull.titlePage
      )
    },

    async getRedirects() {
      this.global.statefull.titlePage = await wikiFetchAddRedirectsToTitlePage(
        this.global.state.title,
        this.global.state.language,
        this.global.statefull.titlePage
      )

      this.global.setRedirectsDone(true)
    },

    async circleButtonClicked(index) {
      if (!this.global.state.displayResultsArray[index].missing) {
        switch (this.global.state.buttonMode) {
          case 'search':
            this.global.setTitle(
              await wikiFetchGetRedirectTarget(
                this.global.state.displayResultsArray[index].title,
                this.global.state.language
              )
            )
            this.getMainInfo()
            this.getJson()
            break
          case 'catsredir':
            if (!this.global.state.categoriesOnHover) {
              this.global.setCatsRedirResult(
                this.global.state.displayResultsArray[index]
              )
              this.global.setShowCatsRedir(true)
              this.windowResized()
            }
            break
          case 'wiki':
            window.open(
              this.global.state.displayResultsArray[index].url,
              '_blank'
            )
            break
        }
      }
    },

    titleButtonClicked() {
      switch (this.global.state.buttonMode) {
        case 'search':
          break
        case 'catsredir':
          if (!this.global.state.categoriesOnHover) {
            this.global.setCatsRedirResult(this.global.statefull.titlePage)
            if (this.global.state.mobileMode) {
              this.global.setShowCatsRedir(true)
            }
          }
          break
        case 'wiki':
          // window.location = this.global.statefull.titlePage.url
          window.open(this.global.statefull.titlePage.url, '_blank')
          break
      }
    },

    buttonModeSwitched() {
      this.windowResized()
    },

    async fetchDataClicked(value) {
      if (value) {
        this.global.setTitle(
          await wikiFetchGetRedirectTarget(value, this.global.state.language)
        )

        this.getMainInfo()
        this.getJson()
      }
    },
    async resultsCategoriesChanged() {
      if (
        this.global.state.resultsCategoriesEnabled &&
        !this.global.state.resultsCategoriesDone
      ) {
        this.getResultsCategories()
      }
      if (
        this.global.state.resultsCategoriesEnabled &&
        this.global.state.resultsCategoriesDone
      ) {
        this.global.statefull.checkedCategories = new Set(
          this.resultsCategoriesAllArrayUnfiltered
        )
      }
    },
    async resultsRedirectsChanged() {
      if (
        this.global.state.resultsRedirectsEnabled &&
        !this.global.state.resultsRedirectsDone
      ) {
        await this.getResultsRedirects()
      }
    },
    checkboxFilterEnabledChanged() {
      // for switch from desktop to mobile
      if (!this.global.state.checkboxFilterEnabled) {
        this.global.statefull.checkedCategories = new Set(
          this.resultsCategoriesAllArrayUnfiltered
        )
      }

      if (this.global.state.checkboxFilterEnabled) {
        this.global.statefull.checkedCategories = new Set(
          this.resultsCategoriesAllArrayUnfiltered
        )
      }
    },
    languageSwitched(value) {
      this.$i18n.locale = value
      this.global.setLanguage(value)
    },
    modeSwitched() {
      this.global.setCatsRedirResult(this.global.statefull.titlePage)
      this.windowResized()
    },
    mobileDisplaySwitched() {
      this.windowResized()
    },
    showHelpSwitched() {
      this.global.setInputsDisabled(this.global.state.showHelp)
    },
    windowResized() {
      this.$nextTick(() => {
        if (this.global.state.showCatsRedir && !this.global.state.mobileMode) {
          this.scrollboxContainerHeight =
            this.$refs.gridcontainer.getBoundingClientRect().height -
            this.$refs.inputarea.getBoundingClientRect().height -
            this.$refs.maininfo.getBoundingClientRect().height
        } else {
          this.scrollboxContainerHeight =
            this.$refs.gridcontainer.getBoundingClientRect().height -
            this.$refs.inputarea.getBoundingClientRect().height
        }
      })
    }
  },
  mounted() {
    window.addEventListener('resize', this.windowResized)
    this.windowResized()
  },
  beforeUnMount() {
    window.removeEventListener('resize', this.windowResized)
  }
}
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
