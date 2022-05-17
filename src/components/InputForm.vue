<template>
  <div
    class="inputform-flex-container"
    :class="{
      mobile: global.state.mobileMode
    }"
  >
    <div
      id="item1"
      :class="{
        mobile: global.state.mobileMode
      }"
    >
      <form>
        <input
          class="radiobutton"
          type="radio"
          id="en"
          value="en"
          name="language"
          checked="true"
          :disabled="
            !global.state.showHelp &&
            (global.state.inputsDisabled ||
              (global.state.resultsCategoriesEnabled &&
                !global.state.resultsCategoriesDone))
          "
          @change="languageSwitched($event.target.value)"
        />
        <label
          class="radiolabel"
          :class="{
            itemdisabled:
              !global.state.showHelp &&
              (global.state.inputsDisabled ||
                (global.state.resultsCategoriesEnabled &&
                  !global.state.resultsCategoriesDone))
          }"
          for="en"
          ><img class="flagicon" src="../assets/images/us-flag.svg"
        /></label>
        <input
          class="radiobutton"
          type="radio"
          id="de"
          value="de"
          name="language"
          :disabled="
            !global.state.showHelp &&
            (global.state.inputsDisabled ||
              (global.state.resultsCategoriesEnabled &&
                !global.state.resultsCategoriesDone))
          "
          @change="languageSwitched($event.target.value)"
        />
        <label
          class="radiolabel"
          :class="{
            itemdisabled:
              !global.state.showHelp &&
              (global.state.inputsDisabled ||
                (global.state.resultsCategoriesEnabled &&
                  !global.state.resultsCategoriesDone))
          }"
          for="de"
          ><img class="flagicon" src="../assets/images/de-flag.svg"
        /></label>
      </form>
    </div>
    <div
      id="item2"
      :class="{
        mobile: global.state.mobileMode
      }"
    >
      <form class="inputform" @submit.prevent="fetchData">
        <input
          type="text"
          id="title"
          class="searchinputarea"
          :placeholder="t('search-on-wikipedia')"
          :value="global.state.title"
          @input="titleChanged($event.target.value)"
          :disabled="
            global.state.inputsDisabled ||
            (global.state.resultsCategoriesEnabled &&
              !global.state.resultsCategoriesDone)
          "
        />
        <button
          class="searchbutton"
          type="submit"
          :disabled="
            global.state.inputsDisabled ||
            (global.state.resultsCategoriesEnabled &&
              !global.state.resultsCategoriesDone)
          "
        >
          <img
            class="searchiconsmall"
            :class="{
              itemdisabled:
                global.state.inputsDisabled ||
                (global.state.resultsCategoriesEnabled &&
                  !global.state.resultsCategoriesDone)
            }"
            src="../assets/images/search.svg"
          />
        </button>
      </form>
    </div>

    <div
      id="item3"
      :class="{
        mobile: global.state.mobileMode
      }"
    >
      <form class="inputform" @submit.prevent="">
        <label for="filter"
          ><img class="titleiconsmall" src="../assets/images/text-tool.svg"
        /></label>
        <input
          type="text"
          id="filter"
          class="titleinputarea"
          :placeholder="t('filter-results-titles')"
          :value="global.state.filter"
          @input="resetFirstItem(), filterChanged($event.target.value)"
          :disabled="global.state.inputsDisabled || global.state.mobileMode"
        />
      </form>
    </div>
    <div
      id="item4"
      :class="{
        mobile: global.state.mobileMode
      }"
    >
      <form class="inputform" @submit.prevent="">
        <label for="filterCategories">
          <img
            class="categoriesiconsmall"
            src="../assets/images/document.svg"
          />
        </label>
        <input
          type="text"
          id="filterCategories"
          class="categoriesinputarea"
          :placeholder="t('filter-results-categories')"
          :value="global.state.filterCategories"
          @input="
            resetFirstItem(), filterCategoriesChanged($event.target.value)
          "
          :disabled="
            global.state.inputsDisabled ||
            !global.state.resultsCategoriesDone ||
            !global.state.resultsCategoriesEnabled ||
            global.state.mobileMode
          "
        />
      </form>
    </div>

    <div
      id="item6"
      :class="{
        mobile: global.state.mobileMode
      }"
    >
      <span>
        <input
          id="resultsCategories"
          class="checkbox"
          type="checkbox"
          :checked="global.state.resultsCategoriesEnabled"
          :disabled="global.state.inputsDisabled || global.state.mobileMode"
          @change="resultsCategoriesChanged($event.target.checked)"
        />
        <label
          class="checkboxlabel"
          :class="{
            itemdisabled:
              global.state.mobileMode ||
              global.state.inputsDisabled ||
              global.state.mobileMode
          }"
          for="resultsCategories"
        >
          <img class="categoriesicon" src="../assets/images/document.svg" />
        </label>
      </span>
      <span>
        <input
          id="resultsRedirects"
          class="checkbox"
          type="checkbox"
          :disabled="global.state.inputsDisabled || global.state.mobileMode"
          :checked="global.state.resultsRedirectsEnabled"
          @change="resultsRedirectsChanged($event.target.checked)"
        />
        <label
          class="checkboxlabel"
          :class="{
            itemdisabled: global.state.inputsDisabled || global.state.mobileMode
          }"
          for="resultsRedirects"
        >
          <img
            class="redirectsicon"
            src="../assets/images/forward-hand-drawn-arrow-pointing-to-right.svg"
          />
        </label>
      </span>
    </div>

    <div
      id="item9"
      :class="{
        mobile: global.state.mobileMode
      }"
    >
      <form>
        <input
          class="radiobutton"
          type="radio"
          id="desktop"
          value="desktop"
          :checked="!global.state.mobileMode"
          :disabled="
            !global.state.showHelp &&
            (global.state.inputsDisabled ||
              (global.state.resultsCategoriesEnabled &&
                !global.state.resultsCategoriesDone))
          "
          @change="modeSwitched($event.target.value)"
        />
        <label
          class="radiolabel"
          :class="{
            itemdisabled:
              !global.state.showHelp &&
              (global.state.inputsDisabled ||
                (global.state.resultsCategoriesEnabled &&
                  !global.state.resultsCategoriesDone))
          }"
          for="desktop"
        >
          <img class="desktopicon" src="../assets/images/desktop-pc.svg" />
        </label>
        <input
          class="radiobutton"
          type="radio"
          id="mobile"
          value="mobile"
          :checked="global.state.mobileMode"
          :disabled="
            !global.state.showHelp &&
            (global.state.inputsDisabled ||
              (global.state.resultsCategoriesEnabled &&
                !global.state.resultsCategoriesDone))
          "
          @change="modeSwitched($event.target.value)"
        />

        <label
          class="radiolabel"
          :class="{
            itemdisabled:
              !global.state.showHelp &&
              (global.state.inputsDisabled ||
                (global.state.resultsCategoriesEnabled &&
                  !global.state.resultsCategoriesDone))
          }"
          for="mobile"
          ><img class="mobileicon" src="../assets/images/smartphone.svg" />
        </label>

        <span>
          <input
            id="showHelp"
            class="checkbox"
            type="checkbox"
            :checked="global.state.showHelp"
            @change="showHelpClicked($event.target.checked)"
          />
          <label class="checkboxlabel" for="showHelp">
            <img class="helpicon" src="../assets/images/question-mark.svg" />
          </label>
        </span>
      </form>
    </div>
  </div>
</template>
<script setup>
import { inject, onMounted } from 'vue'

import { useI18n } from 'vue-i18n/index'
const { t } = useI18n({})

const global = inject('global')

const emit = defineEmits([
  'fetchDataClicked',
  'resultsRedirectsChanged',
  'showHelpClicked',
  'resultsCategoriesChanged',
  'languageSwitched',
  'mode-switched',
  'closeCatsRedir'
])

// can this be done more elegantly?
function fetchData(submitEvent) {
  let value = ''
  for (let element of submitEvent.target.elements) {
    if (element.id === 'title') {
      value = element.value
      break
    }
  }
  emit('fetchDataClicked', value)
}

function resultsCategoriesChanged(value) {
  global.setResultsCategoriesEnabled(value)
  resetFirstItem()
  emit('resultsCategoriesChanged', value)

  if (value === false && !global.state.resultsRedirectsEnabled) {
    emit('closeCatsRedir')
  }
}
function resultsRedirectsChanged(value) {
  global.setResultsRedirectsEnabled(value)
  emit('resultsRedirectsChanged', value)

  if (value === false && !global.state.resultsCategoriesEnabled) {
    emit('closeCatsRedir')
  }
}
function titleChanged(value) {
  global.setTitle(value)
}
function filterChanged(value) {
  global.setFilter(value)
}
function filterCategoriesChanged(value) {
  global.setFilterCategories(value)
}
function resetFirstItem() {
  global.setGraphFirstItem(1)
}
function languageSwitched(value) {
  emit('languageSwitched', value)
}
async function modeSwitched(value) {
  if (value === 'mobile') {
    global.setMobileMode(true)
  } else {
    global.setMobileMode(false)
  }
}
function showHelpClicked(value) {
  global.setShowHelp(value)
  emit('showHelpClicked', value)
}
onMounted(() => {
  // init
  languageSwitched('en')

  if (window.matchMedia('(orientation: landscape)').matches) {
    if (window.innerWidth < 950) {
      modeSwitched('mobile')
    }
  } else {
    if (window.innerWidth < 800) {
      modeSwitched('mobile')
    }
  }

  // handle parameters from URL
  /**
   * URL Parameters
   * @param {String} mode - Enable mobile/desktop mode, desktop or mobile valid (-> gloabl.state.mobileMode true/false)
   * @param {String} lang - UI and Wikipedia language, en or de valid (-> global.state.language)
   * @param {String} categories - Enable/disable results categories, on or off valid (boolean to global.state.resultsCategoriesEnabled)
   * @param {String} titlefilter - String to filter results titles with (global.state.filter)
   * @param {String} categoriesfilter - String to filter results categories with (global.state.filterCategories)
   * @param {String} redirects - Enable/disable redirects, on or off valid (boolean to global.state.resultsRedirectsEnabled)
   * @param {String} search - Wikipedia page to search for (global.state.title)
   */

  const urlParameters = new URLSearchParams(window.location.search)

  const mode = urlParameters.get('mode')
  const lang = urlParameters.get('lang')
  const titlefilter = urlParameters.get('titlefilter')
  const categoriesfilter = urlParameters.get('categoriesfilter')
  const categories = urlParameters.get('categories')
  const redirects = urlParameters.get('redirects')
  const search = urlParameters.get('search')

  if (mode === 'desktop' || mode === 'mobile') {
    modeSwitched(mode)
  }

  if (lang === 'en' || lang === 'de') {
    languageSwitched(lang)
  }

  if (categories === 'on' || categories === 'off') {
    switch (categories) {
      case 'on':
        resultsCategoriesChanged(true)
        break

      case 'off':
        resultsCategoriesChanged(false)
        break
    }
  }

  if (titlefilter && titlefilter.length > 0) {
    resetFirstItem()
    filterChanged(titlefilter)
  }

  if (
    categoriesfilter &&
    categoriesfilter.length > 0 &&
    global.state.resultsCategoriesEnabled
  ) {
    resetFirstItem()
    filterCategoriesChanged(categoriesfilter)
  }

  if (redirects === 'on' || redirects === 'off') {
    switch (redirects) {
      case 'on':
        resultsRedirectsChanged(true)
        break
      case 'off':
        resultsRedirectsChanged(false)
    }
  }

  // do search last after evaluating all other parameters
  if (search && search.length > 0) {
    emit('fetchDataClicked', search)
  }
})
</script>
<style scoped>
.inputform-flex-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

#item2,
#item3,
#item4 {
  flex-grow: 1;
}

@media only screen and (max-width: 1160px) {
  #item2,
  #item3,
  #item4 {
    flex-basis: 30%;
  }
}

@media only screen and (max-width: 950px) {
  #item2,
  #item3,
  #item4 {
    flex-basis: 50%;
  }
}

@media only screen and (max-width: 550px) {
  #item5.mobile,
  #item6,
  #item7 {
    flex-basis: 50%;
  }
}

.inputform {
  display: flex;
}
#title,
#filter,
#filterCategories {
  flex-grow: 1;
}
.fontsize70 {
  font-size: 70%;
}

.radiobutton,
.checkbox {
  opacity: 0;
  width: 0;
  position: fixed;
}
.radiobutton:checked + label,
.checkbox:checked + label {
  background-color: mistyrose;
}
.radiobutton:focus + label,
.checkbox:focus + label {
  border: 1px dashed black;
}

.radiolabel,
.checkboxlabel {
  display: inline-block;
  background-color: #ddd;
  padding: 1px 1px;
  border: 1px solid black;
  font-size: 85%;
  margin: 3px;
}
@media (hover: hover) and (pointer: fine) {
  .radiobutton:hover + label,
  .checkbox:hover + label {
    filter: invert(0.25);
  }
}
.itemdisabled {
  filter: invert(0.75);
}

.searchbutton {
  border: none;
  background-color: transparent;
}
.categoriesicon,
.titleicon,
.checkboxfiltericon,
.redirectsicon,
.graphicon,
.desktopicon,
.mobileicon,
.flagicon,
.clickicon,
.hovericon,
.helpicon,
.searchicon,
.wikipediaiconcontainer,
.catsredircontainer {
  width: 2.66em;
  height: 1.4em;
  vertical-align: middle;
}

.flagicon {
  padding: 2px;
}

.searchiconsmall,
.titleiconsmall,
.categoriesiconsmall,
.wikipediaiconsmall {
  width: 1.4em;
  height: 1.4em;
  vertical-align: middle;
}

.catsrediricon {
  width: 1.3em;
  height: 1.3em;
  vertical-align: middle;
}

.searchinputarea,
.titleinputarea,
.categoriesinputarea {
  margin-top: 3px;
  margin-bottom: 3px;
  width: 150px;
}
.searchinputarea:focus,
.titleinputarea:focus,
.categoriesinputarea:focus {
  outline: none;
  background-color: lavender;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
}
.fetchingicon {
  filter: invert(16%) sepia(63%) saturate(7441%) hue-rotate(0deg)
    brightness(105%) contrast(124%);
  animation: fadeIn 0.35s infinite alternate;
  height: 1em;
  vertical-align: middle;
  margin-left: 0.2em;
  margin-right: 0.2em;
}
</style>
