import { reactive, computed, readonly } from 'vue'
import { TitlePage } from './datamodels.js'

const state = reactive({
  filter: '',
  filterCategories: '',
  title: '',
  showHelp: false,
  mobileMode: false,
  language: 'en',
  resultsCategoriesEnabled: true,
  resultsRedirectsEnabled: false,
  sizePerPage: 16,
  inputsDisabled: false,
  resultsCategoriesDone: true,
  resultsRedirectsDone: true,
  redirectsDone: false,
  categoriesDone: false,
  graphFirstItem: 1,
  pieAngleSaved: 0,
  activeTab: 'tab2',
  mainInfoDone: false,
  filteredResults: computed(function () {
    if (state.inputsDisabled) {
      return []
    }

    let filtered = Array.from(statefull.resultsMap.values())

    // apply titles filter
    filtered = filtered.filter((page) =>
      page.title.toLowerCase().includes(state.filter.toLowerCase())
    )

    // good - maybe rewrite without ternary
    // needs to check state.filterCategories, otherwise -> when categoryfilter = '' this only shows pages, which have at least one non empty category!! and thereby ALSO excludes missing!
    if (
      state.resultsCategoriesEnabled &&
      state.resultsCategoriesDone &&
      state.filterCategories
    ) {
      filtered = filtered.filter((page) =>
        page.categories
          ? page.categories.find((item) =>
              item.toLowerCase().includes(state.filterCategories.toLowerCase())
            )
          : null
      )
    }

    if (
      state.resultsCategoriesEnabled &&
      state.resultsCategoriesDone &&
      (!state.mobileMode || state.mobileMode)
    ) {
      filtered = filtered.filter((page) =>
        page.categories
          ? page.categories.find((item) =>
              statefull.checkedCategories.has(item)
            )
          : null
      )
    }

    // sort
    filtered = filtered.sort((a, b) => {
      return a.title.localeCompare(b.title)
    })

    return filtered
  }),
  displayResults: computed(function () {
    let array = []
    if (state.inputsDisabled) {
      return array
    }

    if (!(state.indexEnd + 1 > state.filteredResults.length)) {
      array = state.filteredResults.slice(state.indexStart, state.indexEnd + 1)
    } else {
      array = state.filteredResults
        .slice(state.indexStart)
        .concat(
          state.filteredResults.slice(
            0,
            state.indexEnd - state.filteredResults.length + 1
          )
        )
    }

    return array
  }),
  indexStart: computed(function () {
    let indexStart = state.graphFirstItem - 1

    return indexStart
  }),
  indexEnd: computed(function () {
    // this can be higher than last index, wrap around is done in displayResults
    let indexEnd

    // handle less results than max possible
    if (!(state.sizePerPage > state.filteredResults.length)) {
      indexEnd = state.graphFirstItem - 1 + state.sizePerPage - 1
    } else {
      indexEnd = state.graphFirstItem - 1 + state.filteredResults.length - 1
    }

    return indexEnd
  })
})

// titlePage and resultsMap kept directly writable without setter
// to keep wikifetch.js modular and simplify their handling
// checkedCategories kept directly writable without setter
// to simplify its handling in MainView.vue and CategoriesCheckboxFilter.vue (v-model)
const statefull = reactive({
  titlePage: new TitlePage(),
  resultsMap: new Map(),
  checkedCategories: new Set()
})

const setFilter = (value) => {
  state.filter = value
}
const setFilterCategories = (value) => {
  state.filterCategories = value
}
const setTitle = (value) => {
  state.title = value
}
const setShowHelp = (value) => {
  state.showHelp = value
}
const setMobileMode = (value) => {
  state.mobileMode = value
}
const setLanguage = (value) => {
  state.language = value
}
const setResultsCategoriesEnabled = (value) => {
  state.resultsCategoriesEnabled = value
}
const setResultsRedirectsEnabled = (value) => {
  state.resultsRedirectsEnabled = value
}
const setSizePerPage = (value) => {
  state.sizePerPage = value
}
const setInputsDisabled = (value) => {
  state.inputsDisabled = value
}
const setResultsCategoriesDone = (value) => {
  state.resultsCategoriesDone = value
}
const setResultsRedirectsDone = (value) => {
  state.resultsRedirectsDone = value
}
const setRedirectsDone = (value) => {
  state.redirectsDone = value
}
const setGraphFirstItem = (value) => {
  state.graphFirstItem = value
}
const setPieAngleSaved = (value) => {
  state.pieAngleSaved = value
}
const setActiveTab = (value) => {
  state.activeTab = value
}
const setCategoriesDone = (value) => {
  state.categoriesDone = value
}
const setMainInfoDone = (value) => {
  state.mainInfoDone = value
}

export default {
  state: readonly(state),
  statefull,
  setFilter,
  setFilterCategories,
  setTitle,
  setShowHelp,
  setMobileMode,
  setLanguage,
  setResultsCategoriesEnabled,
  setResultsRedirectsEnabled,
  setSizePerPage,
  setInputsDisabled,
  setResultsCategoriesDone,
  setResultsRedirectsDone,
  setRedirectsDone,
  setGraphFirstItem,
  setPieAngleSaved,
  setActiveTab,
  setCategoriesDone,
  setMainInfoDone
}
