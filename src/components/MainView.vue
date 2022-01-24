<template>
  <div class="page-flex-container" ref="flexcontainer">
    <input-form
      :filtered-results-array-length="filteredResultsArray.length"
      :index-start="indexStart"
      :index-end="indexEnd"
      @fetchDataClicked="fetchDataClicked"
      @showHelpClicked="showHelpSwitched"
      @resultsCategoriesChanged="resultsCategoriesChanged"
      @resultsRedirectsChanged="resultsRedirectsChanged"
      @checkboxFilterEnabledChanged="checkboxFilterEnabledChanged"
      @languageSwitched="languageSwitched"
      @gridWidthNocategoriesChanged="gridWidthNocategoriesChanged"
      @gridHeightChanged="gridHeightChanged"
      @modeSwitched="modeSwitched"
      @mobileDisplaySwitched="mobileDisplaySwitched"
      ref="inputForm"
    ></input-form>

    <div
      v-if="!global.state.showHelp"
      class="grid-container-base"
      :class="{
        mobile: global.state.mobileMode,
        'grid-container':
          global.state.checkboxFilterEnabled &&
          global.state.resultsCategoriesEnabled &&
          !global.state.mobileMode,
        'grid-container-nocategories':
          (!global.state.checkboxFilterEnabled ||
            !global.state.resultsCategoriesEnabled) &&
          !global.state.mobileMode
      }"
      :style="{
        '--gridwidthnocategories': gridWidthNocategories + 'px',
        '--gridheightsubtract': gridHeightSubtract + 'px',
        '--gridmobileheight': scrollboxContainerHeight + 'px'
      }"
      ref="gridcontainer"
    >
      <div
        v-if="
          (!global.state.mobileMode && global.state.checkboxFilterEnabled) ||
          (global.state.mobileMode &&
            global.state.mobileDisplay === 'categories')
        "
        class="inputcategoriescontainer grid-item-categories"
        :class="{
          mobile: global.state.mobileMode
        }"
        :style="{
          '--categoriesmobileheight': scrollboxContainerHeight + 'px'
        }"
        ref="inputcategoriescontainer"
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
          !global.state.mobileMode ||
          (global.state.mobileMode && global.state.mobileDisplay === 'outgraph')
        "
        class="grid-item-graph"
        ref="outgraph"
        :display-results-array="displayResultsArray"
        @circleButtonClicked="circleButtonClicked"
      ></outgraph>

      <main-title-info
        v-if="
          !global.state.mobileMode ||
          (global.state.mobileMode && global.state.mobileDisplay === 'maininfo')
        "
        class="grid-item-maininfo"
        :class="{
          mobile: global.state.mobileMode
        }"
      ></main-title-info>
    </div>

    <div v-if="global.state.showHelp" class="help-container">
      <help></help>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue'
import InputForm from './InputForm.vue'
import MainTitleInfo from './MainTitleInfo.vue'
import Outgraph from './Outgraph.vue'
import CategoriesCheckboxFilter from './CategoriesCheckboxFilter.vue'
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
    Help
  },
  setup() {
    const global = inject('global')

    return { global }
  },
  data() {
    return {
      gridWidthNocategories: 1520,
      gridHeightSubtract: 0,
      scrollboxContainerHeight: 300
    }
  },
  computed: {
    indexStart() {
      let indexStart =
        this.global.state.pageNumber * this.global.state.sizePerPage
      if (indexStart > this.filteredResultsArray.length - 1) {
        indexStart = this.filteredResultsArray.length - 1
      }

      return indexStart
    },
    indexEnd() {
      let indexEnd =
        (this.global.state.pageNumber + 1) * this.global.state.sizePerPage - 1

      if (indexEnd > this.filteredResultsArray.length - 1) {
        indexEnd = this.filteredResultsArray.length - 1
      }

      if (indexEnd < 0) {
        indexEnd = 0
      }

      return indexEnd
    },
    filteredResultsArray() {
      if (this.global.state.inputsDisabled) {
        return []
      }

      let filteredArray = Array.from(this.global.statefull.resultsMap.values())

      // apply titles filter
      filteredArray = filteredArray.filter((page) =>
        page.title
          .toLowerCase()
          .includes(this.global.state.filter.toLowerCase())
      )

      // good - maybe rewrite without ternary
      // needs to check this.global.state.filterCategories, otherwise -> when categoryfilter = '' this only shows pages, which have at least one non empty category!! and thereby ALSO excludes missing!
      if (
        this.global.state.resultsCategoriesEnabled &&
        this.global.state.resultsCategoriesDone &&
        this.global.state.filterCategories
      ) {
        filteredArray = filteredArray.filter((page) =>
          page.categories
            ? page.categories.find((item) =>
                item
                  .toLowerCase()
                  .includes(this.global.state.filterCategories.toLowerCase())
              )
            : null
        )
      }

      if (
        this.global.state.resultsCategoriesEnabled &&
        this.global.state.resultsCategoriesDone &&
        ((!this.global.state.mobileMode &&
          this.global.state.checkboxFilterEnabled) ||
          this.global.state.mobileMode)
      ) {
        filteredArray = filteredArray.filter((page) =>
          page.categories
            ? page.categories.find((item) =>
                this.global.statefull.checkedCategories.has(item)
              )
            : null
        )
      }

      // sort
      filteredArray = filteredArray.sort((a, b) => {
        return a.title.localeCompare(b.title)
      })

      return filteredArray
    },

    displayResultsArray() {
      if (this.global.state.inputsDisabled) {
        return []
      }
      return this.filteredResultsArray.slice(this.indexStart, this.indexEnd + 1)
    },
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

      this.global.setPageNumber(0)
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
      this.global.setTitle(
        await wikiFetchGetRedirectTarget(
          this.displayResultsArray[index].title,
          this.global.state.language
        )
      )

      this.getMainInfo()
      this.getJson()
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
    gridWidthNocategoriesChanged(value) {
      this.gridWidthNocategories = value
    },
    gridHeightChanged(value) {
      this.gridHeightSubtract = value
      // needed for init, first display, otherwise --gridmobileheight wrong
      if (this.global.state.mobileMode) {
        this.scrollboxContainerHeight =
          this.$refs.flexcontainer.getBoundingClientRect().height -
          this.gridHeightSubtract
      }
    },
    modeSwitched() {
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
        if (!this.global.state.mobileMode) {
          if (this.$refs.inputcategoriescontainer) {
            this.scrollboxContainerHeight =
              this.$refs.inputcategoriescontainer.getBoundingClientRect().height
          }
        } else {
          this.scrollboxContainerHeight =
            this.$refs.flexcontainer.getBoundingClientRect().height -
            this.gridHeightSubtract

          this.$refs.inputForm.windowResized()
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
.page-flex-container {
  display: flex;
  height: 100vh;

  /* only needed in mobile portrait mode - workaround scrollbars */
  overflow: hidden;
}

@media (orientation: landscape) {
  .page-flex-container {
    flex-direction: row;
  }
}

@media (orientation: portrait) {
  .page-flex-container {
    flex-direction: column;
  }
}

.grid-container-base {
  flex: 1 0 auto;
  display: grid;
}

.grid-container {
  grid-template-columns: min-content minmax(320px, 1fr);
  grid-template-rows: min-content minmax(0, 1fr);
  height: calc(100% - var(--gridheightsubtract));
}

.grid-container-nocategories {
  grid-template-columns: var(--gridwidthnocategories);
  grid-template-rows: min-content minmax(0, 1fr);
  height: calc(100% - var(--gridheightsubtract));
}

.grid-container-base.mobile {
  grid-template-columns: var(--gridwidthnocategories);
  grid-template-rows: var(--gridmobileheight);
}

.grid-item-graph {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

.grid-item-categories {
  grid-column: 2 / 3;
  grid-row: 1 / 3;
}

.grid-item-maininfo {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  overflow-y: auto;
}

.grid-item-categories.mobile {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  height: var(--categoriesmobileheight);
}

.grid-item-maininfo.mobile {
  grid-column: 1 / 2;
  grid-row: 1 / 2;

  overflow-y: auto;
}
.help-container {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  width: 100%;
  overflow-y: auto;
}
</style>
