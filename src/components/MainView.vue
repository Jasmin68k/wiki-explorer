<template>
  <div class="page-flex-container" ref="flexcontainer">
    <input-form
      :inputs-disabled="inputsDisabled"
      :results-categories-done="resultsCategoriesDone"
      :results-redirects-done="resultsRedirectsDone"
      :filtered-results-array-length="filteredResultsArray.length"
      :number-of-pages="numberOfPages"
      :page-number="pageNumber"
      :index-start="indexStart"
      :index-end="indexEnd"
      v-model:circleButtonRadius="inputFormState.circleButtonRadius"
      @pageNumberChanged="pageNumberChanged"
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
            resultsCategoriesDone
          "
          :items="resultsCategoriesAllArray"
          :root-height="scrollboxContainerHeight"
          :checked-init="checkedCategories"
          @resultsCategoriesCheckboxChanged="resultsCategoriesCheckboxChanged"
          @categoriesAll="categoriesAll"
          @categoriesNone="resultsCategoriesCheckboxChanged"
        ></categories-checkbox-filter>
      </div>

      <outgraph
        v-if="
          !global.state.mobileMode ||
          (global.state.mobileMode && global.state.mobileDisplay === 'outgraph')
        "
        class="grid-item-graph"
        ref="outgraph"
        :inputs-disabled="inputsDisabled"
        :title="titlePage.title"
        :url="titlePage.url"
        :redirects="titlePage.redirects"
        :display-results-array="displayResultsArray"
        :categories-array="titlePage.categories"
        :results-categories-done="resultsCategoriesDone"
        :results-redirects-done="resultsRedirectsDone"
        :title-missing="titlePage.missing"
        :circle-button-radius="inputFormState.circleButtonRadius"
        :redirects-done="redirectsDone"
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
        :extract="titlePage.extract"
        :image="titlePage.image"
      ></main-title-info>
    </div>

    <div v-if="global.state.showHelp" class="help-container">
      <help></help>
    </div>
  </div>
</template>

<script>
import { reactive, inject } from 'vue'
import InputForm from './InputForm.vue'
import MainTitleInfo from './MainTitleInfo.vue'
import Outgraph from './Outgraph.vue'
import CategoriesCheckboxFilter from './CategoriesCheckboxFilter.vue'
import Help from './Help.vue'
import { TitlePage } from '../datamodels.js'
import {
  wikiFetchAddCategoriesToTitlePage,
  wikiFetchAddCategoriesToPages,
  wikiFetchAddRedirectsToTitlePage,
  wikiFetchAddRedirectsToPages,
  wikiFetchTitlePage,
  wikiFetchPages,
  wikiFetchGetRedirectTarget
} from '../wikifetch.js'

let resultsMap = new Map()

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

    // state of inputForm in composition API style
    const inputFormState = reactive({
      circleButtonRadius: 260
    })
    return { inputFormState, global }
  },
  data() {
    return {
      checkedCategories: new Set(),
      resultsCategoriesDone: true,
      resultsRedirectsDone: true,
      inputsDisabled: false,
      gridWidthNocategories: 1520,
      gridHeightSubtract: 0,
      scrollboxContainerHeight: 300,
      titlePage: new TitlePage(),
      redirectsDone: false,
      pageNumber: 0
    }
  },
  computed: {
    indexStart() {
      let indexStart = this.pageNumber * this.global.state.sizePerPage
      if (indexStart > this.filteredResultsArray.length - 1) {
        indexStart = this.filteredResultsArray.length - 1
      }

      return indexStart
    },
    indexEnd() {
      let indexEnd = (this.pageNumber + 1) * this.global.state.sizePerPage - 1

      if (indexEnd > this.filteredResultsArray.length - 1) {
        indexEnd = this.filteredResultsArray.length - 1
      }

      if (indexEnd < 0) {
        indexEnd = 0
      }

      return indexEnd
    },
    numberOfPages() {
      return Math.ceil(
        this.filteredResultsArray.length / this.global.state.sizePerPage
      )
    },
    filteredResultsArray() {
      if (this.inputsDisabled) {
        return []
      }

      let filteredArray = Array.from(resultsMap.values())

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
        this.resultsCategoriesDone &&
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
        this.resultsCategoriesDone &&
        ((!this.global.state.mobileMode &&
          this.global.state.checkboxFilterEnabled) ||
          this.global.state.mobileMode)
      ) {
        filteredArray = filteredArray.filter((page) =>
          page.categories
            ? page.categories.find((item) => this.checkedCategories.has(item))
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
      if (this.inputsDisabled) {
        return []
      }
      return this.filteredResultsArray.slice(this.indexStart, this.indexEnd + 1)
    },
    resultsCategoriesAllArray() {
      if (
        !(
          this.resultsCategoriesDone &&
          this.global.state.resultsCategoriesEnabled &&
          ((!this.global.state.mobileMode &&
            this.global.state.checkboxFilterEnabled) ||
            this.global.state.mobileMode)
        )
      ) {
        return []
      }
      let allCategoriesSet = new Set()

      for (const pageId of resultsMap.keys()) {
        const resultPage = resultsMap.get(pageId)
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
          this.resultsCategoriesDone &&
          this.global.state.resultsCategoriesEnabled
        )
      ) {
        return []
      }
      let allCategoriesSet = new Set()

      for (const pageId of resultsMap.keys()) {
        const resultPage = resultsMap.get(pageId)
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
      this.inputsDisabled = true

      resultsMap.clear()
      resultsMap = await wikiFetchPages(
        this.global.state.title,
        this.global.state.language
      )

      this.resultsCategoriesDone = false

      if (this.global.state.resultsCategoriesEnabled) {
        this.getResultsCategories()
      }

      this.resultsRedirectsDone = false

      if (this.global.state.resultsRedirectsEnabled) {
        this.getResultsRedirects()
      }

      this.pageNumber = 0

      this.inputsDisabled = false
    },

    async getResultsCategories() {
      // with big pages this requires lots of api fetches, which makes up majority of the wait time

      // skip fetch when no results
      if (resultsMap.size > 0) {
        resultsMap = await wikiFetchAddCategoriesToPages(
          this.global.state.title,
          this.global.state.language,
          resultsMap
        )
      }

      this.resultsCategoriesDone = true

      this.checkedCategories = new Set(this.resultsCategoriesAllArrayUnfiltered)
    },

    async getResultsRedirects() {
      // skip fetch when no results
      if (resultsMap.size > 0) {
        resultsMap = await wikiFetchAddRedirectsToPages(
          this.global.state.title,
          this.global.state.language,
          resultsMap
        )
      }

      this.resultsRedirectsDone = true
    },

    async getMainInfo() {
      this.titlePage = await wikiFetchTitlePage(
        this.global.state.title,
        this.global.state.language
      )

      this.redirectsDone = false

      if (!this.titlePage.missing) {
        this.getCategories()
        this.getRedirects()
      }
    },
    async getCategories() {
      this.titlePage = await wikiFetchAddCategoriesToTitlePage(
        this.global.state.title,
        this.global.state.language,
        this.titlePage
      )
    },

    async getRedirects() {
      this.titlePage = await wikiFetchAddRedirectsToTitlePage(
        this.global.state.title,
        this.global.state.language,
        this.titlePage
      )

      this.redirectsDone = true
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
    resultsCategoriesChanged() {
      if (
        this.global.state.resultsCategoriesEnabled &&
        !this.resultsCategoriesDone
      ) {
        this.getResultsCategories()
      }
      if (
        this.global.state.resultsCategoriesEnabled &&
        this.resultsCategoriesDone
      ) {
        this.checkedCategories = new Set(
          this.resultsCategoriesAllArrayUnfiltered
        )
      }
    },
    resultsRedirectsChanged() {
      if (
        this.global.state.resultsRedirectsEnabled &&
        !this.resultsRedirectsDone
      ) {
        this.getResultsRedirects()
      }
    },
    pageNumberChanged(value) {
      this.pageNumber = value
    },
    resultsCategoriesCheckboxChanged(value) {
      this.pageNumber = 0

      if (!this.global.state.checkboxFilterEnabled) {
        // enable in desktop when changed in mobile
        this.global.setCheckboxFilterEnabled(true)
      }

      this.checkedCategories = value
    },
    categoriesAll(value) {
      this.pageNumber = 0

      this.checkedCategories = value
    },
    checkboxFilterEnabledChanged() {
      // for switch from desktop to mobile
      if (!this.global.state.checkboxFilterEnabled) {
        this.checkedCategories = new Set(
          this.resultsCategoriesAllArrayUnfiltered
        )
      }

      if (this.global.state.checkboxFilterEnabled) {
        this.checkedCategories = new Set(
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
      this.inputsDisabled = this.global.state.showHelp
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
