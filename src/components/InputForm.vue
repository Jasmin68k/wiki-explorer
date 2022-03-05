<template>
  <div class="inputform-flex-container" ref="inputformflexcontainer">
    <div
      class="inputform-flex-item-1"
      :style="{
        'margin-left': portraitMode && global.state.mobileMode ? '5px' : '',
        'margin-top': portraitMode && global.state.mobileMode ? '5px' : ''
      }"
    >
      <form>
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
      </form>

      <form>
        <input
          class="radiobutton"
          type="radio"
          id="en"
          value="en"
          :disabled="
            !global.state.showHelp &&
            (global.state.inputsDisabled ||
              (global.state.resultsCategoriesEnabled &&
                !global.state.resultsCategoriesDone))
          "
          @change="languageSwitched($event.target.value)"
          ref="langEn"
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
          :disabled="
            !global.state.showHelp &&
            (global.state.inputsDisabled ||
              (global.state.resultsCategoriesEnabled &&
                !global.state.resultsCategoriesDone))
          "
          @change="languageSwitched($event.target.value)"
          ref="langDe"
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

      <form @submit.prevent="fetchData">
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
              !global.state.resultsCategoriesDone)
          "
          :style="{
            width: portraitMode && global.state.mobileMode ? '108px' : ''
          }"
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

      <form @submit.prevent="">
        <label for="filter"
          ><img class="titleiconsmall" src="../assets/images/text-tool.svg"
        /></label>
        <input
          type="text"
          id="filter"
          class="titleinputarea"
          :placeholder="$t('filter-results-titles')"
          :value="global.state.filter"
          @input="resetFirstItem(), filterChanged($event.target.value)"
          :disabled="
            global.state.inputsDisabled ||
            (global.state.mobileMode &&
              global.state.mobileDisplay === 'maininfo')
          "
          :style="{
            width: portraitMode && global.state.mobileMode ? '120px' : ''
          }"
        />
      </form>

      <form @submit.prevent="">
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
          :placeholder="$t('filter-results-categories')"
          :value="global.state.filterCategories"
          @input="
            resetFirstItem(), filterCategoriesChanged($event.target.value)
          "
          :disabled="
            global.state.inputsDisabled ||
            !global.state.resultsCategoriesDone ||
            !global.state.resultsCategoriesEnabled ||
            (global.state.mobileMode &&
              global.state.mobileDisplay === 'maininfo')
          "
          :style="{
            width: portraitMode && global.state.mobileMode ? '120px' : ''
          }"
        />
      </form>
    </div>
    <div
      class="inputform-flex-item-2"
      :style="{
        'margin-top': portraitMode && global.state.mobileMode ? '5px' : ''
      }"
    >
      <div v-if="global.state.mobileMode">
        <input
          class="radiobutton"
          type="radio"
          :disabled="global.state.showHelp"
          id="outgraph"
          value="outgraph"
          :checked="global.state.mobileDisplay === 'outgraph'"
          @change="mobileDisplaySwitched($event.target.value)"
        />
        <label
          class="radiolabel"
          for="outgraph"
          :class="{ itemdisabled: global.state.showHelp }"
          ><img class="graphicon" src="../assets/images/analytics-graph.svg"
        /></label>
        <input
          class="radiobutton"
          type="radio"
          :disabled="global.state.showHelp"
          id="maininfo"
          value="maininfo"
          :checked="global.state.mobileDisplay === 'maininfo'"
          @change="mobileDisplaySwitched($event.target.value)"
        />
        <label
          class="radiolabel"
          for="maininfo"
          :class="{ itemdisabled: global.state.showHelp }"
          ><img class="titleicon" src="../assets/images/text-tool.svg"
        /></label>
        <input
          class="radiobutton"
          type="radio"
          :disabled="
            global.state.showHelp ||
            (global.state.mobileMode && !global.state.resultsCategoriesEnabled)
          "
          id="categories"
          value="categories"
          :checked="global.state.mobileDisplay === 'categories'"
          @change="mobileDisplaySwitched($event.target.value)"
        />
        <label
          class="radiolabel"
          for="categories"
          :class="{
            itemdisabled:
              global.state.showHelp ||
              (global.state.mobileMode &&
                !global.state.resultsCategoriesEnabled)
          }"
        >
          <img
            class="checkboxfiltericon"
            src="../assets/images/document2.svg"
          />
        </label>
      </div>

      <div>
        <span>
          <input
            id="resultsCategories"
            class="checkbox"
            type="checkbox"
            :checked="global.state.resultsCategoriesEnabled"
            :disabled="
              global.state.inputsDisabled ||
              (global.state.mobileMode &&
                (global.state.mobileDisplay === 'maininfo' ||
                  global.state.mobileDisplay === 'categories'))
            "
            @change="resultsCategoriesChanged($event.target.checked)"
          />
          <label
            class="checkboxlabel"
            :class="{
              itemdisabled:
                global.state.inputsDisabled ||
                (global.state.mobileMode &&
                  (global.state.mobileDisplay === 'maininfo' ||
                    global.state.mobileDisplay === 'categories'))
            }"
            for="resultsCategories"
          >
            <img class="categoriesicon" src="../assets/images/document.svg" />
          </label>
        </span>
        <span v-if="!global.state.mobileMode">
          <input
            id="checkboxFilter"
            class="checkbox"
            type="checkbox"
            :checked="global.state.checkboxFilterEnabled"
            :disabled="
              global.state.inputsDisabled ||
              !global.state.resultsCategoriesEnabled
            "
            @change="checkboxFilterEnabledChanged($event.target.checked)"
          />
          <label
            class="checkboxlabel"
            :class="{
              itemdisabled:
                global.state.inputsDisabled ||
                !global.state.resultsCategoriesEnabled
            }"
            for="checkboxFilter"
          >
            <img
              class="checkboxfiltericon"
              :class="{
                itemdisabled:
                  global.state.inputsDisabled ||
                  !global.state.resultsCategoriesEnabled
              }"
              src="../assets/images/document2.svg"
            />
          </label>
        </span>
        <span>
          <input
            id="resultsRedirects"
            class="checkbox"
            type="checkbox"
            :disabled="
              global.state.inputsDisabled ||
              (global.state.mobileMode &&
                (global.state.mobileDisplay === 'maininfo' ||
                  global.state.mobileDisplay === 'categories'))
            "
            :checked="global.state.resultsRedirectsEnabled"
            @change="resultsRedirectsChanged($event.target.checked)"
          />
          <label
            class="checkboxlabel"
            :class="{
              itemdisabled:
                global.state.inputsDisabled ||
                (global.state.mobileMode &&
                  (global.state.mobileDisplay === 'maininfo' ||
                    global.state.mobileDisplay === 'categories'))
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

      <form>
        <span
          ><img class="categoriesiconsmall" src="../assets/images/document.svg"
        /></span>
        <input
          class="radiobutton"
          type="radio"
          id="catsclick"
          value="catsclick"
          :disabled="
            global.state.inputsDisabled ||
            (global.state.resultsCategoriesEnabled &&
              !global.state.resultsCategoriesDone) ||
            (global.state.mobileMode &&
              (global.state.mobileDisplay === 'maininfo' ||
                global.state.mobileDisplay === 'categories'))
          "
          ref="catsClick"
          @change="categoriesOnHoverOrClickChanged($event.target.value)"
        />
        <label
          class="radiolabel"
          :class="{
            itemdisabled:
              global.state.inputsDisabled ||
              (global.state.resultsCategoriesEnabled &&
                !global.state.resultsCategoriesDone) ||
              (global.state.mobileMode &&
                (global.state.mobileDisplay === 'maininfo' ||
                  global.state.mobileDisplay === 'categories'))
          }"
          for="catsclick"
          ><img class="clickicon" src="../assets/images/mouse-click.svg"
        /></label>
        <input
          class="radiobutton"
          type="radio"
          id="catshover"
          value="catshover"
          :disabled="
            global.state.inputsDisabled ||
            (global.state.resultsCategoriesEnabled &&
              !global.state.resultsCategoriesDone) ||
            (global.state.mobileMode &&
              (global.state.mobileDisplay === 'maininfo' ||
                global.state.mobileDisplay === 'categories'))
          "
          ref="catsHover"
          @change="categoriesOnHoverOrClickChanged($event.target.value)"
        />
        <label
          class="radiolabel"
          :class="{
            itemdisabled:
              global.state.inputsDisabled ||
              (global.state.resultsCategoriesEnabled &&
                !global.state.resultsCategoriesDone) ||
              (global.state.mobileMode &&
                (global.state.mobileDisplay === 'maininfo' ||
                  global.state.mobileDisplay === 'categories'))
          }"
          for="catshover"
          ><img class="hovericon" src="../assets/images/mouse-hover.svg"
        /></label>
      </form>
      <div>
        <span
          v-show="
            global.state.resultsCategoriesEnabled &&
            !global.state.resultsCategoriesDone
          "
          ><img class="fetchingicon" src="../assets/images/document.svg"
        /></span>
        <span
          v-show="
            global.state.resultsRedirectsEnabled &&
            !global.state.resultsRedirectsDone
          "
          ><img
            class="fetchingicon"
            src="../assets/images/forward-hand-drawn-arrow-pointing-to-right.svg"
        /></span>
        <span class="fontsize90"
          >{{ $t('results')
          }}{{ global.state.filteredResultsArray.length }}</span
        >
        <span
          v-show="
            global.state.resultsRedirectsEnabled &&
            !global.state.resultsRedirectsDone
          "
          ><img
            class="fetchingicon"
            src="../assets/images/forward-hand-drawn-arrow-pointing-to-right.svg"
        /></span>
        <span
          v-show="
            global.state.resultsCategoriesEnabled &&
            !global.state.resultsCategoriesDone
          "
          ><img class="fetchingicon" src="../assets/images/document.svg"
        /></span>
      </div>
      <div
        class="fontsize90"
        :style="{
          visibility:
            global.state.filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
      >
        {{ $t('showing') }}{{ $t('from') }}{{ global.state.indexStart + 1
        }}{{ $t('to')
        }}{{
          global.state.indexEnd + 1 > global.state.filteredResultsArray.length
            ? global.state.indexEnd +
              1 -
              global.state.filteredResultsArray.length
            : global.state.indexEnd + 1
        }}
      </div>
    </div>
  </div>
</template>
<script>
import { inject, computed } from 'vue'

export default {
  name: 'InputForm',
  emits: [
    'fetchDataClicked',
    'resultsRedirectsChanged',
    'showHelpClicked',
    'resultsCategoriesChanged',
    'checkboxFilterEnabledChanged',
    'languageSwitched',
    'mode-switched',
    'mobile-display-switched'
  ],

  setup() {
    const global = inject('global')

    const numberOfPages = computed(() =>
      Math.ceil(
        global.state.filteredResultsArray.length / global.state.sizePerPage
      )
    )

    return { global, numberOfPages }
  },
  data() {
    return {
      portraitMode: false
    }
  },

  methods: {
    // can this be done more elegantly?
    fetchData(submitEvent) {
      let value = ''
      for (let element of submitEvent.target.elements) {
        if (element.id === 'title') {
          value = element.value
          break
        }
      }
      this.$emit('fetchDataClicked', value)
    },
    resultsCategoriesChanged(value) {
      this.global.setResultsCategoriesEnabled(value)
      this.resetFirstItem()
      this.$emit('resultsCategoriesChanged', value)
    },
    resultsRedirectsChanged(value) {
      this.global.setResultsRedirectsEnabled(value)
      this.$emit('resultsRedirectsChanged', value)
    },
    titleChanged(value) {
      this.global.setTitle(value)
    },
    filterChanged(value) {
      this.global.setFilter(value)
    },
    filterCategoriesChanged(value) {
      this.global.setFilterCategories(value)
    },
    resetFirstItem() {
      this.global.setGraphFirstItem(1)
    },
    checkboxFilterEnabledChanged(value) {
      this.global.setCheckboxFilterEnabled(value)
      this.resetFirstItem()
      this.$emit('checkboxFilterEnabledChanged', value)
    },
    languageSwitched(value) {
      if (value === 'en') {
        this.$refs.langEn.checked = true
        this.$refs.langDe.checked = false
      } else {
        this.$refs.langEn.checked = false
        this.$refs.langDe.checked = true
      }

      this.$emit('languageSwitched', value)
    },
    categoriesOnHoverOrClickChanged(value) {
      if (value === 'catshover') {
        this.$refs.catsHover.checked = true
        this.$refs.catsClick.checked = false
      } else {
        this.$refs.catsHover.checked = false
        this.$refs.catsClick.checked = true
      }

      if (value === 'catshover') {
        this.global.setCategoriesOnHover(true)
      } else {
        this.global.setCategoriesOnHover(false)
      }
    },
    modeSwitched(value) {
      if (value === 'mobile') {
        this.global.setMobileMode(true)
      } else {
        this.global.setMobileMode(false)
      }
      this.$emit('mode-switched', value)
    },
    mobileDisplaySwitched(value) {
      this.global.setMobileDisplay(value)
      this.$emit('mobile-display-switched', value)
    },
    showHelpClicked(value) {
      this.global.setShowHelp(value)
      this.$emit('showHelpClicked', value)
    }
  },
  mounted() {
    // init
    this.languageSwitched('en')
    this.categoriesOnHoverOrClickChanged('catshover')

    if (window.matchMedia('(orientation: landscape)').matches) {
      if (window.innerWidth < 860) {
        this.modeSwitched('mobile')
        this.categoriesOnHoverOrClickChanged('catsclick')
      }
    } else {
      if (window.innerWidth < 610) {
        this.modeSwitched('mobile')
        this.categoriesOnHoverOrClickChanged('catsclick')
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
     * @param {String} mobileview - Mobile mode only: Switch view mode, valid results, extract, categories (outgraph, maininfo, categories -> global.state.mobileDisplay)
     * @param {String} checkboxfilter - Desktop mode only: Enable/disable checkbox categories filter, on or off valid (boolean to global.state.checkboxFilterEnabled)
     * @param {String} redirects - Enable/disable redirects, on or off valid (boolean to global.state.resultsRedirectsEnabled)
     * @param {String} categoriesmode - Show categories on click or hover, valid click or hover
     * @param {String} search - Wikipedia page to search for (global.state.title)
     */

    const urlParameters = new URLSearchParams(window.location.search)

    const mode = urlParameters.get('mode')
    const lang = urlParameters.get('lang')
    const titlefilter = urlParameters.get('titlefilter')
    const categoriesfilter = urlParameters.get('categoriesfilter')
    const categories = urlParameters.get('categories')
    const mobileview = urlParameters.get('mobileview')
    const checkboxfilter = urlParameters.get('checkboxfilter')
    const redirects = urlParameters.get('redirects')
    const categoriesmode = urlParameters.get('categoriesmode')
    const search = urlParameters.get('search')

    if (mode === 'desktop' || mode === 'mobile') {
      this.modeSwitched(mode)
    }

    if (lang === 'en' || lang === 'de') {
      this.languageSwitched(lang)
    }

    if (categories === 'on' || categories === 'off') {
      switch (categories) {
        case 'on':
          this.resultsCategoriesChanged(true)
          break

        case 'off':
          this.resultsCategoriesChanged(false)
          break
      }
    }

    if (titlefilter && titlefilter.length > 0) {
      this.resetFirstItem()
      this.filterChanged(titlefilter)
    }

    if (
      categoriesfilter &&
      categoriesfilter.length > 0 &&
      this.global.state.resultsCategoriesEnabled
    ) {
      this.resetFirstItem()
      this.filterCategoriesChanged(categoriesfilter)
    }

    if (
      this.global.state.mobileMode &&
      (mobileview === 'results' ||
        mobileview === 'extract' ||
        mobileview === 'categories')
    ) {
      switch (mobileview) {
        case 'results':
          this.mobileDisplaySwitched('outgraph')
          break
        case 'extract':
          this.mobileDisplaySwitched('maininfo')
          break
        case 'categories':
          this.mobileDisplaySwitched('categories')
          break
      }
    }

    if (
      !this.global.state.mobileMode &&
      (checkboxfilter === 'on' || checkboxfilter === 'off')
    ) {
      switch (checkboxfilter) {
        case 'on':
          if (this.global.state.resultsCategoriesEnabled) {
            this.checkboxFilterEnabledChanged(true)
          }
          break
        case 'off':
          this.checkboxFilterEnabledChanged(false)
          break
      }
    }

    if (redirects === 'on' || redirects === 'off') {
      switch (redirects) {
        case 'on':
          this.resultsRedirectsChanged(true)
          break
        case 'off':
          this.resultsRedirectsChanged(false)
      }
    }

    if (categoriesmode === 'click' || categoriesmode === 'hover') {
      switch (categoriesmode) {
        case 'click':
          this.categoriesOnHoverOrClickChanged('catsclick')
          break

        case 'hover':
          this.categoriesOnHoverOrClickChanged('catshover')
      }
    }

    // do search last after evaluating all other parameters
    if (search && search.length > 0) {
      this.$emit('fetchDataClicked', search)
    }
  }
}
</script>
<style scoped>
.fontsize90 {
  font-size: 90%;
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
.inputform-flex-container {
  display: flex;
  justify-content: space-around;
  flex: 0 1 auto;
}

.inputform-flex-item-1,
.inputform-flex-item-2 {
  flex: 0 1 auto;
  font-size: 90%;
}
.itemdisabled {
  filter: invert(0.75);
}

.pagecount {
  display: inline-block;
  width: 180px;
}
@media (hover: hover) and (pointer: fine) {
  .searchicon:hover {
    filter: invert(0.5);
  }
}
.searchbutton {
  border: none;
  background-color: transparent;
}

.categoriesicon,
.titleicon,
.searchicon,
.checkboxfiltericon,
.redirectsicon,
.graphicon,
.desktopicon,
.mobileicon,
.flagicon,
.clickicon,
.hovericon,
.helpicon {
  width: 2.66em;
  height: 1.4em;
  vertical-align: middle;
}

.flagicon {
  padding: 2px;
}

.searchiconsmall,
.titleiconsmall,
.categoriesiconsmall {
  width: 1.4em;
  height: 1.4em;
  vertical-align: middle;
}

.numberresultsicon {
  height: 1em;
}

.absolutebottomcenter {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.rotate90deg {
  transform: rotate(90deg);
}

.searchinputarea,
.titleinputarea,
.categoriesinputarea {
  margin-top: 3px;
  margin-bottom: 3px;
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

.positionrelative {
  position: relative;
}

.inputformflexitem3fixedwidth {
  width: 24px;
}

.slidervertical {
  width: var(--height);
  transform-origin: left;
  transform: rotate(90deg) translateY(-50%) translateX(-3%);
}

@media (orientation: landscape) {
  .inputform-flex-container {
    flex-direction: column;
    min-width: 250px;
    width: 250px;
  }
}

@media (orientation: portrait) {
  .inputform-flex-container {
    flex-direction: row;
  }
}
</style>
