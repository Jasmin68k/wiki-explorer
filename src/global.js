import { reactive, readonly } from 'vue'

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
  inputsDisabled: false
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

export default {
  state: readonly(state),
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
  setInputsDisabled
}
