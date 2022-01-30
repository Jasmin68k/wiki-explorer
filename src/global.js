import { reactive, computed, readonly } from 'vue'
import { TitlePage } from './datamodels.js'

const state = reactive({
  filter: '',
  filterCategories: '',
  title: '',
  showHelp: false,
  mobileMode: false,
  language: 'en',
  mobileDisplay: 'outgraph',
  resultsCategoriesEnabled: true,
  resultsRedirectsEnabled: false,
  checkboxFilterEnabled: true,
  categoriesOnHover: true,
  sizePerPage: 16,
  scalingFactor: 1.0,
  circleButtonRadius: 260,
  inputsDisabled: false,
  resultsCategoriesDone: true,
  resultsRedirectsDone: true,
  redirectsDone: false,
  graphFirstItem: 1,
  filteredResultsArray: computed(function () {
    if (state.inputsDisabled) {
      return []
    }

    let filteredArray = Array.from(statefull.resultsMap.values())

    // apply titles filter
    filteredArray = filteredArray.filter((page) =>
      page.title.toLowerCase().includes(state.filter.toLowerCase())
    )

    // good - maybe rewrite without ternary
    // needs to check state.filterCategories, otherwise -> when categoryfilter = '' this only shows pages, which have at least one non empty category!! and thereby ALSO excludes missing!
    if (
      state.resultsCategoriesEnabled &&
      state.resultsCategoriesDone &&
      state.filterCategories
    ) {
      filteredArray = filteredArray.filter((page) =>
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
      ((!state.mobileMode && state.checkboxFilterEnabled) || state.mobileMode)
    ) {
      filteredArray = filteredArray.filter((page) =>
        page.categories
          ? page.categories.find((item) =>
              statefull.checkedCategories.has(item)
            )
          : null
      )
    }

    // sort
    filteredArray = filteredArray.sort((a, b) => {
      return a.title.localeCompare(b.title)
    })

    return filteredArray
  }),
  displayResultsArray: computed(function () {
    if (state.inputsDisabled) {
      return []
    }
    return state.filteredResultsArray.slice(
      state.indexStart,
      state.indexEnd + 1
    )
  }),
  indexStart: computed(function () {
    let indexStart = state.graphFirstItem - 1

    return indexStart
  }),
  indexEnd: computed(function () {
    let indexEnd = state.graphFirstItem - 1 + state.sizePerPage - 1
    if (indexEnd > state.filteredResultsArray.length - 1) {
      indexEnd = state.filteredResultsArray.length - 1
    }
    return indexEnd
  })
})
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
const setMobileDisplay = (value) => {
  state.mobileDisplay = value
}
const setResultsCategoriesEnabled = (value) => {
  state.resultsCategoriesEnabled = value
}
const setResultsRedirectsEnabled = (value) => {
  state.resultsRedirectsEnabled = value
}
const setCheckboxFilterEnabled = (value) => {
  state.checkboxFilterEnabled = value
}
const setCategoriesOnHover = (value) => {
  state.categoriesOnHover = value
}
const setSizePerPage = (value) => {
  state.sizePerPage = value
}
const setScalingFactor = (value) => {
  state.scalingFactor = value
}
const setCircleButtonRadius = (value) => {
  state.circleButtonRadius = value
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

export default {
  state: readonly(state),
  statefull,
  setFilter,
  setFilterCategories,
  setTitle,
  setShowHelp,
  setMobileMode,
  setLanguage,
  setMobileDisplay,
  setResultsCategoriesEnabled,
  setResultsRedirectsEnabled,
  setCheckboxFilterEnabled,
  setCategoriesOnHover,
  setSizePerPage,
  setScalingFactor,
  setCircleButtonRadius,
  setInputsDisabled,
  setResultsCategoriesDone,
  setResultsRedirectsDone,
  setRedirectsDone,
  setGraphFirstItem
}
