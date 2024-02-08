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
          :checked="locale === 'en'"
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
          :checked="locale === 'de'"
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
          :placeholder="$t('search-on-wikipedia')"
          :value="global.state.title"
          @input="titleChanged($event.target.value)"
          :disabled="
            global.state.inputsDisabled ||
            (global.state.resultsCategoriesEnabled &&
              !global.state.resultsCategoriesDone) ||
            (global.state.resultsRedirectsEnabled &&
              !global.state.resultsRedirectsDone)
          "
        />
        <button
          class="searchbutton"
          type="submit"
          :disabled="
            global.state.inputsDisabled ||
            (global.state.resultsCategoriesEnabled &&
              !global.state.resultsCategoriesDone) ||
            (global.state.resultsRedirectsEnabled &&
              !global.state.resultsRedirectsDone)
          "
        >
          <img
            class="searchiconsmall svg-icon"
            :class="{
              itemdisabled:
                global.state.inputsDisabled ||
                (global.state.resultsCategoriesEnabled &&
                  !global.state.resultsCategoriesDone) ||
                (global.state.resultsRedirectsEnabled &&
                  !global.state.resultsRedirectsDone)
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
        <label for="filter" class="filterlabel"
          ><img
            class="titleiconsmall svg-icon"
            src="../assets/images/text-tool.svg"
        /></label>
        <input
          type="text"
          id="filter"
          class="titleinputarea"
          :placeholder="$t('filter-results-titles')"
          :value="global.state.filter"
          @input="resetFirstItem(), filterChanged($event.target.value)"
          :disabled="global.state.inputsDisabled"
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
        <label for="filterCategories" class="filterlabel">
          <img
            class="categoriesiconsmall svg-icon"
            src="../assets/images/document.svg"
          />
        </label>
        <input
          type="text"
          id="filterCategories"
          class="categoriesinputarea"
          :placeholder="$t('filter-results-categories')"
          :value="global.state.filterCategories"
          @input="
            resetFirstItem(), filterCategoriesChanged($event.target.value)
          "
          :disabled="
            global.state.inputsDisabled ||
            !global.state.resultsCategoriesDone ||
            !global.state.resultsCategoriesEnabled
          "
        />
      </form>
    </div>

    <div
      id="item5"
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
          :disabled="
            global.state.inputsDisabled ||
            (global.state.resultsCategoriesEnabled &&
              !global.state.resultsCategoriesDone)
          "
          @change="resultsCategoriesChanged($event.target.checked)"
        />
        <label
          class="checkboxlabel"
          :class="{
            itemdisabled:
              global.state.inputsDisabled ||
              (global.state.resultsCategoriesEnabled &&
                !global.state.resultsCategoriesDone)
          }"
          for="resultsCategories"
        >
          <img
            class="categoriesicon svg-icon"
            src="../assets/images/document.svg"
          />
        </label>
      </span>
      <span>
        <input
          id="resultsRedirects"
          class="checkbox"
          type="checkbox"
          :checked="global.state.resultsRedirectsEnabled"
          :disabled="
            global.state.inputsDisabled ||
            (global.state.resultsRedirectsEnabled &&
              !global.state.resultsRedirectsDone)
          "
          @change="resultsRedirectsChanged($event.target.checked)"
        />
        <label
          class="checkboxlabel"
          :class="{
            itemdisabled:
              global.state.inputsDisabled ||
              (global.state.resultsRedirectsEnabled &&
                !global.state.resultsRedirectsDone)
          }"
          for="resultsRedirects"
        >
          <img
            class="redirectsicon svg-icon"
            src="../assets/images/forward-hand-drawn-arrow-pointing-to-right.svg"
          />
        </label>
      </span>
    </div>

    <div
      id="item6"
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
          <img
            class="desktopicon svg-icon"
            src="../assets/images/desktop-pc.svg"
          />
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
          ><img
            class="mobileicon svg-icon"
            src="../assets/images/smartphone.svg"
          />
        </label>

        <span class="menuanchor">
          <div
            @click.stop="optionsMenuClicked"
            id="optionsmenuiconcontainer"
            class="optionsmenuiconcontainer"
          >
            <img
              class="burgericon svg-icon"
              src="../assets/images/burger-menu.svg"
            />
          </div>
          <div id="optionsmenu">
            <OptionsMenu
              ref="optionsmenu"
              @hideMenu="hideOptionsMenu"
            ></OptionsMenu>
          </div>
        </span>
      </form>
    </div>
  </div>
</template>
<script setup>
import { inject, onMounted, ref } from 'vue'

const locale = import.meta.env.VITE_VUE_APP_I18N_LOCALE

const global = inject('global')

const optionsmenu = ref(null)
let optionsmenuvisible = false

const emit = defineEmits([
  'fetchDataClicked',
  'resultsRedirectsChanged',
  'resultsCategoriesChanged',
  'languageSwitched',
  'mode-switched'
])

// can this be done more elegantly?
function fetchData(submitEvent) {
  let value = ''
  for (const element of submitEvent.target.elements) {
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
}
function resultsRedirectsChanged(value) {
  global.setResultsRedirectsEnabled(value)
  emit('resultsRedirectsChanged', value)
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

function optionsMenuClicked() {
  if (!optionsmenuvisible) {
    document.getElementById('optionsmenu').style.display = 'block'
    document.getElementById('optionsmenuiconcontainer').style.backgroundColor =
      '7a4c65'
    optionsmenuvisible = true
  } else {
    document.getElementById('optionsmenu').style.display = 'none'
    document.getElementById('optionsmenuiconcontainer').style.backgroundColor =
      '#555'
    optionsmenuvisible = false
  }
}

function hideOptionsMenu() {
  document.getElementById('optionsmenu').style.display = 'none'
  document.getElementById('optionsmenuiconcontainer').style.backgroundColor =
    '#555'
  optionsmenuvisible = false
}

onMounted(() => {
  document.onclick = (event) => {
    // defined in OptionsMenu.vue
    const menu = document.getElementById('menucontainer')
    if (!menu.contains(event.target) && optionsmenuvisible) {
      hideOptionsMenu()
    }
  }

  // init
  languageSwitched(import.meta.env.VITE_VUE_APP_I18N_LOCALE)

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
   * @param {String} redirects - Enable/disable results redirects, on or off valid (boolean to global.state.resultsRedirectsEnabled)
   * @param {String} titlefilter - String to filter results titles with (global.state.filter)
   * @param {String} categoriesfilter - String to filter results categories with (global.state.filterCategories)
   * @param {String} cache - Enable/disable cache, on or off valid (boolean to global.state.cacheEnabled)
   * @param {String} cachemaxage - Cache max age, valid 1h, 6h, 1d, 1w, 4w (global.state.cacheMaxAge)
   * @param {String} search - Wikipedia page to search for (global.state.title)
   */

  const urlParameters = new URLSearchParams(window.location.search)

  const mode = urlParameters.get('mode')
  const lang = urlParameters.get('lang')
  const categories = urlParameters.get('categories')
  const redirects = urlParameters.get('redirects')
  const titlefilter = urlParameters.get('titlefilter')
  const categoriesfilter = urlParameters.get('categoriesfilter')
  const cache = urlParameters.get('cache')
  const cachemaxage = urlParameters.get('cachemaxage')
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

  if (cache === 'on' || cache === 'off') {
    switch (cache) {
      case 'on':
        global.setCacheEnabled(true)
        break
      case 'off':
        global.setCacheEnabled(false)
    }
    optionsmenu.value.cacheSettingsUpdated()
  }

  if (
    cachemaxage === '1h' ||
    cachemaxage === '6h' ||
    cachemaxage === '1d' ||
    cachemaxage === '1w' ||
    cachemaxage === '4w'
  ) {
    switch (cachemaxage) {
      case '1h':
        global.setCacheMaxAge(global.constants.cachemaxage1h)
        break
      case '6h':
        global.setCacheMaxAge(global.constants.cachemaxage6h)
        break
      case '1d':
        global.setCacheMaxAge(global.constants.cachemaxage1d)
        break
      case '1w':
        global.setCacheMaxAge(global.constants.cachemaxage1w)
        break
      case '4w':
        global.setCacheMaxAge(global.constants.cachemaxage4w)
    }
    optionsmenu.value.cacheSettingsUpdated()
  }

  // do search last after evaluating all other parameters
  if (search && search.length > 0) {
    emit('fetchDataClicked', search)
  }
})
</script>
<style scoped>
img.svg-icon {
  filter: invert(100%) brightness(90%);
}
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

@media only screen and (max-width: 890px) {
  #item2,
  #item3,
  #item4 {
    flex-basis: 50%;
  }
}

@media only screen and (max-width: 400px) {
  #item3,
  #item4 {
    flex-basis: 90%;
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

.radiobutton,
.checkbox {
  opacity: 0;
  width: 0;
  position: fixed;
}
.radiobutton:checked + label,
.checkbox:checked + label {
  background-color: #7a4c65;
}
.radiobutton:focus + label,
.checkbox:focus + label {
  border: 1px dashed #666;
}

.radiolabel,
.checkboxlabel,
.optionsmenuiconcontainer {
  display: inline-block;
  background-color: #555;
  padding: 1px 1px;
  border: 1px solid #666;
  font-size: 85%;
  margin: 3px;
}
@media (hover: hover) and (pointer: fine) {
  .radiobutton:hover + label,
  .checkbox:hover + label,
  .optionsmenuiconcontainer:hover {
    filter: brightness(1.2);
  }
}
.itemdisabled {
  filter: brightness(0.6);
}

.searchbutton {
  border: none;
  background-color: transparent;
}
.categoriesicon,
.redirectsicon,
.desktopicon,
.mobileicon,
.flagicon,
.burgericon {
  width: 2.66em;
  height: 1.4em;
  vertical-align: middle;
}

.flagicon {
  padding: 2px;
}

.filterlabel {
  display: flex;
}

.titleiconsmall,
.categoriesiconsmall {
  width: 1.4em;
  height: auto;
}

.searchiconsmall {
  width: 1.4em;
  height: auto;
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

.menuanchor {
  /* for absolute positioning of menu */
  position: relative;
  /* expand span to dimensions of child (label) */
  display: inline-block;
}

#optionsmenu {
  display: none;
}
</style>
