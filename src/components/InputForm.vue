<template>
  <div class="inputform-flex-container" ref="inputformflexcontainer">
    <div
      class="inputform-flex-item-1"
      :style="{
        'margin-left': portraitMode && mobileMode ? '5px' : '',
        'margin-top': portraitMode && mobileMode ? '5px' : ''
      }"
    >
      <form>
        <span>
          <input
            id="showHelp"
            class="checkbox"
            type="checkbox"
            v-model="showHelp"
            @change="showHelpClicked"
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
          :disabled="
            !showHelp &&
            (inputsDisabled ||
              (resultsCategoriesEnabled && !resultsCategoriesDone))
          "
          v-model="mode"
          @change="modeSwitched"
        />
        <label
          class="radiolabel"
          :class="{
            itemdisabled:
              !showHelp &&
              (inputsDisabled ||
                (resultsCategoriesEnabled && !resultsCategoriesDone))
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
          :disabled="
            !showHelp &&
            (inputsDisabled ||
              (resultsCategoriesEnabled && !resultsCategoriesDone))
          "
          v-model="mode"
          @change="modeSwitched"
        />
        <label
          class="radiolabel"
          :class="{
            itemdisabled:
              !showHelp &&
              (inputsDisabled ||
                (resultsCategoriesEnabled && !resultsCategoriesDone))
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
            !showHelp &&
            (inputsDisabled ||
              (resultsCategoriesEnabled && !resultsCategoriesDone))
          "
          v-model="language"
          @change="languageSwitched"
        />
        <label
          class="radiolabel"
          :class="{
            itemdisabled:
              !showHelp &&
              (inputsDisabled ||
                (resultsCategoriesEnabled && !resultsCategoriesDone))
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
            !showHelp &&
            (inputsDisabled ||
              (resultsCategoriesEnabled && !resultsCategoriesDone))
          "
          v-model="language"
          @change="languageSwitched"
        />
        <label
          class="radiolabel"
          :class="{
            itemdisabled:
              !showHelp &&
              (inputsDisabled ||
                (resultsCategoriesEnabled && !resultsCategoriesDone))
          }"
          for="de"
          ><img class="flagicon" src="../assets/images/de-flag.svg"
        /></label>
      </form>

      <form @submit.prevent="fetchData()">
        <input
          id="title"
          class="searchinputarea"
          :placeholder="$t('search-on-wikipedia')"
          v-model="title"
          :disabled="
            inputsDisabled ||
            (resultsCategoriesEnabled && !resultsCategoriesDone)
          "
          :style="{
            width: portraitMode && mobileMode ? '108px' : ''
          }"
        />
        <button
          class="searchbutton"
          type="submit"
          :disabled="
            inputsDisabled ||
            (resultsCategoriesEnabled && !resultsCategoriesDone)
          "
        >
          <img
            class="searchiconsmall"
            :class="{
              itemdisabled:
                inputsDisabled ||
                (resultsCategoriesEnabled && !resultsCategoriesDone)
            }"
            src="../assets/images/search.svg"
          />
        </button>
      </form>

      <form>
        <label for="filter"
          ><img class="titleiconsmall" src="../assets/images/text-tool.svg"
        /></label>
        <input
          type="text"
          id="filter"
          class="titleinputarea"
          :placeholder="$t('filter-results-titles')"
          :value="filter"
          @input="resetPageNumber(), filterChanged($event.target.value)"
          :disabled="
            inputsDisabled || (mobileMode && mobileDisplay === 'maininfo')
          "
          :style="{
            width: portraitMode && mobileMode ? '120px' : ''
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
          id="filterCategories"
          class="categoriesinputarea"
          :placeholder="$t('filter-results-categories')"
          v-model="filterCategories"
          @input="resetPageNumber(), filterCategoriesChanged()"
          :disabled="
            inputsDisabled ||
            !resultsCategoriesDone ||
            !resultsCategoriesEnabled ||
            (mobileMode && mobileDisplay === 'maininfo')
          "
          :style="{
            width: portraitMode && mobileMode ? '120px' : ''
          }"
        />
      </form>
    </div>
    <div
      class="inputform-flex-item-2"
      :style="{
        'margin-top': portraitMode && mobileMode ? '5px' : ''
      }"
    >
      <div v-if="mobileMode">
        <input
          class="radiobutton"
          type="radio"
          :disabled="showHelp"
          id="outgraph"
          value="outgraph"
          v-model="mobileDisplay"
          @change="mobileDisplaySwitched"
        />
        <label
          class="radiolabel"
          for="outgraph"
          :class="{ itemdisabled: showHelp }"
          ><img class="graphicon" src="../assets/images/analytics-graph.svg"
        /></label>
        <input
          class="radiobutton"
          type="radio"
          :disabled="showHelp"
          id="maininfo"
          value="maininfo"
          v-model="mobileDisplay"
          @change="mobileDisplaySwitched"
        />
        <label
          class="radiolabel"
          for="maininfo"
          :class="{ itemdisabled: showHelp }"
          ><img class="titleicon" src="../assets/images/text-tool.svg"
        /></label>
        <input
          class="radiobutton"
          type="radio"
          :disabled="showHelp || (mobileMode && !resultsCategoriesEnabled)"
          id="categories"
          value="categories"
          v-model="mobileDisplay"
          @change="mobileDisplaySwitched"
        />
        <label
          class="radiolabel"
          for="categories"
          :class="{
            'checkbox-dirty': checkboxDirty,

            itemdisabled: showHelp || (mobileMode && !resultsCategoriesEnabled)
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
            :disabled="
              inputsDisabled ||
              (mobileMode &&
                (mobileDisplay === 'maininfo' ||
                  mobileDisplay === 'categories'))
            "
            v-model="resultsCategoriesEnabled"
            @change="resultsCategoriesChanged"
          />
          <label
            class="checkboxlabel"
            :class="{
              itemdisabled:
                inputsDisabled ||
                (mobileMode &&
                  (mobileDisplay === 'maininfo' ||
                    mobileDisplay === 'categories'))
            }"
            for="resultsCategories"
          >
            <img class="categoriesicon" src="../assets/images/document.svg" />
          </label>
        </span>
        <span v-if="!mobileMode">
          <input
            id="checkboxFilter"
            class="checkbox"
            type="checkbox"
            :disabled="inputsDisabled || !resultsCategoriesEnabled"
            v-model="checkboxFilterEnabled"
            @change="checkboxFilterEnabledChange"
          />
          <label
            class="checkboxlabel"
            :class="{
              itemdisabled: inputsDisabled || !resultsCategoriesEnabled
            }"
            for="checkboxFilter"
          >
            <img
              class="checkboxfiltericon"
              :class="{
                itemdisabled: inputsDisabled || !resultsCategoriesEnabled
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
              inputsDisabled ||
              (mobileMode &&
                (mobileDisplay === 'maininfo' ||
                  mobileDisplay === 'categories'))
            "
            v-model="resultsRedirectsEnabled"
            @change="resultsRedirectsChanged"
          />
          <label
            class="checkboxlabel"
            :class="{
              itemdisabled:
                inputsDisabled ||
                (mobileMode &&
                  (mobileDisplay === 'maininfo' ||
                    mobileDisplay === 'categories'))
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
            inputsDisabled ||
            (resultsCategoriesEnabled && !resultsCategoriesDone) ||
            (mobileMode &&
              (mobileDisplay === 'maininfo' || mobileDisplay === 'categories'))
          "
          v-model="categoriesOnHoverOrClick"
          @change="categoriesOnHoverOrClickChanged"
        />
        <label
          class="radiolabel"
          :class="{
            itemdisabled:
              inputsDisabled ||
              (resultsCategoriesEnabled && !resultsCategoriesDone) ||
              (mobileMode &&
                (mobileDisplay === 'maininfo' ||
                  mobileDisplay === 'categories'))
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
            inputsDisabled ||
            (resultsCategoriesEnabled && !resultsCategoriesDone) ||
            (mobileMode &&
              (mobileDisplay === 'maininfo' || mobileDisplay === 'categories'))
          "
          v-model="categoriesOnHoverOrClick"
          @change="categoriesOnHoverOrClickChanged"
        />
        <label
          class="radiolabel"
          :class="{
            itemdisabled:
              inputsDisabled ||
              (resultsCategoriesEnabled && !resultsCategoriesDone) ||
              (mobileMode &&
                (mobileDisplay === 'maininfo' ||
                  mobileDisplay === 'categories'))
          }"
          for="catshover"
          ><img class="hovericon" src="../assets/images/mouse-hover.svg"
        /></label>
      </form>
      <div>
        <span v-show="resultsCategoriesEnabled && !resultsCategoriesDone"
          ><img class="fetchingicon" src="../assets/images/document.svg"
        /></span>
        <span v-show="resultsRedirectsEnabled && !resultsRedirectsDone"
          ><img
            class="fetchingicon"
            src="../assets/images/forward-hand-drawn-arrow-pointing-to-right.svg"
        /></span>
        <span class="fontsize90"
          >{{ $t('results') }}{{ filteredResultsArray.length }}</span
        >
        <span v-show="resultsRedirectsEnabled && !resultsRedirectsDone"
          ><img
            class="fetchingicon"
            src="../assets/images/forward-hand-drawn-arrow-pointing-to-right.svg"
        /></span>
        <span v-show="resultsCategoriesEnabled && !resultsCategoriesDone"
          ><img class="fetchingicon" src="../assets/images/document.svg"
        /></span>
      </div>
      <div
        class="fontsize90"
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
      >
        {{ $t('showing') }}{{ $t('from') }}{{ indexStart + 1 }}{{ $t('to')
        }}{{ indexEnd + 1 }}
      </div>
      <span
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
        class="pagecount"
      >
        <img
          src="../assets/images/left-arrow.svg"
          @click="prevPage"
          class="leftarrow"
          :class="{
            itemdisabled:
              inputsDisabled ||
              filteredResultsArray.length === 0 ||
              pageNumber === 0 ||
              (mobileMode &&
                (mobileDisplay === 'maininfo' ||
                  mobileDisplay === 'categories'))
          }"
        />

        <span class="pageinfotext fontsize90">
          {{ $t('page') }}{{ pageNumber + 1 }}{{ $t('of')
          }}{{ numberOfPages }}</span
        >

        <img
          src="../assets/images/right-arrow.svg"
          @click="nextPage"
          class="rightarrow"
          :class="{
            itemdisabled:
              inputsDisabled ||
              filteredResultsArray.length === 0 ||
              pageNumber + 1 === numberOfPages ||
              (mobileMode &&
                (mobileDisplay === 'maininfo' ||
                  mobileDisplay === 'categories'))
          }"
        />
      </span>
    </div>

    <div
      class="inputform-flex-item-3"
      :class="{
        positionrelative: mobileMode && portraitMode,
        inputformflexitem3fixedwidth: mobileMode && portraitMode
      }"
      :style="{
        'margin-right': portraitMode && mobileMode ? '10px' : '',
        'margin-top': portraitMode && mobileMode ? '5px' : ''
      }"
    >
      <input
        type="range"
        min="2"
        step="2"
        :max="40"
        v-model="sizePerPage"
        :disabled="
          inputsDisabled ||
          filteredResultsArray.length === 0 ||
          (mobileMode &&
            (mobileDisplay === 'maininfo' || mobileDisplay === 'categories'))
        "
        :class="{ slidervertical: portraitMode && mobileMode }"
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden',
          '--height': flexContainerHeight * 0.75 + 'px'
        }"
        @input="resetPageNumber()"
      />
      <div
        v-show="!mobileMode"
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
      >
        {{ $t('max-results-per-page') }}{{ sizePerPage }}
      </div>
      <div
        v-show="mobileMode"
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
        :class="{ absolutebottomcenter: portraitMode }"
      >
        <img
          class="numberresultsicon"
          src="../assets/images/analytics-graph.svg"
        />
      </div>

      <input
        v-if="!mobileMode"
        type="range"
        min="0.33"
        max="1.0"
        step="0.01"
        v-model="scalingFactor"
        :disabled="
          inputsDisabled ||
          filteredResultsArray.length === 0 ||
          (mobileMode &&
            (mobileDisplay === 'maininfo' || mobileDisplay === 'categories'))
        "
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
        @input="scalingFactorChanged"
      />
      <div
        v-if="!mobileMode"
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
      >
        {{ $t('scale-graph') }}
      </div>
      <input
        v-if="!mobileMode"
        type="range"
        min="200"
        max="650"
        step="1"
        v-model="circleButtonRadius"
        :disabled="
          inputsDisabled ||
          filteredResultsArray.length === 0 ||
          (mobileMode &&
            (mobileDisplay === 'maininfo' || mobileDisplay === 'categories'))
        "
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
        @input="circleButtonRadiusChanged"
      />
      <div
        v-if="!mobileMode"
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
      >
        {{ $t('graph-radius') }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'InputForm',

  // avoid vue bug https://github.com/vuejs/vue-next/issues/2540 [just console warning]
  // should not be needed, when fixed
  emits: [
    'fetchDataClicked',
    'resultsCategoriesChanged',
    'resultsRedirectsChanged',
    'update:filter',
    'filterCategoriesChanged',
    'indexStartChanged',
    'indexEndChanged',
    // 'resultsCategoriesCheckboxChanged',
    'checkboxFilterEnabledChanged',
    'languageSwitched',
    'scalingFactorChanged',
    'categories-hover-click-changed',
    'circle-button-radius-changed',
    'grid-width-nocategories-changed',
    'grid-height-changed',
    'mode-switched',
    'mobile-display-switched',
    'show-help-switched'
  ],

  props: {
    parentTitle: { required: true, default: '', type: String },
    inputsDisabled: { required: true, default: false, type: Boolean },
    resultsCategoriesDone: { required: true, default: true, type: Boolean },
    resultsRedirectsDone: { required: true, default: true, type: Boolean },
    checkboxDirty: { required: true, default: false, type: Boolean },
    filteredResultsArray: { required: true, default: () => [], type: Array },
    // resultsCategoriesAllArrayUnfiltered: {
    //   required: true,
    //   default: () => [],
    //   type: Array
    // },
    mobileMode: { required: true, default: false, type: Boolean },
    filter: { required: true, default: '', type: String }
  },
  watch: {
    indexStart() {
      this.$emit('indexStartChanged', this.indexStart)
    },
    indexEnd() {
      this.$emit('indexEndChanged', this.indexEnd)
    },
    parentTitle() {
      if (this.parentTitle) {
        this.title = this.parentTitle
      }
    }
  },

  computed: {
    numberOfPages() {
      return Math.ceil(this.filteredResultsArray.length / this.sizePerPage)
    },
    indexStart() {
      let indexStart = this.pageNumber * this.sizePerPage
      if (indexStart > this.filteredResultsArray.length - 1) {
        indexStart = this.filteredResultsArray.length - 1
      }

      return indexStart
    },
    indexEnd() {
      let indexEnd = (this.pageNumber + 1) * this.sizePerPage - 1

      if (indexEnd > this.filteredResultsArray.length - 1) {
        indexEnd = this.filteredResultsArray.length - 1
      }

      if (indexEnd < 0) {
        indexEnd = 0
      }

      return indexEnd
    }
  },
  data() {
    return {
      language: 'en',
      title: '',
      // filter: '',
      resultsCategoriesEnabled: true,
      resultsRedirectsEnabled: false,
      checkboxFilterEnabled: true,
      filterCategories: '',
      pageNumber: 0,
      sizePerPage: 16,
      // checkedCategories: new Set(),
      scalingFactor: 1.0,
      circleButtonRadius: 260,
      scalingFactorSaved: 1.0,
      circleButtonRadiusSaved: 260,
      categoriesOnHoverOrClick: 'catshover',
      mode: 'desktop',
      mobileDisplay: 'outgraph',
      portraitMode: false,
      flexContainerHeight: 0,
      showHelp: false
    }
  },

  methods: {
    fetchData() {
      this.$emit('fetchDataClicked', this.title)
    },
    resultsCategoriesChanged() {
      this.windowResized()
      this.resetPageNumber()
      this.$emit('resultsCategoriesChanged', this.resultsCategoriesEnabled)
    },
    resultsRedirectsChanged() {
      this.$emit('resultsRedirectsChanged', this.resultsRedirectsEnabled)
    },
    filterChanged(value) {
      this.$emit('update:filter', value)
    },
    filterCategoriesChanged() {
      this.$emit('filterCategoriesChanged', this.filterCategories)
    },
    // indexChanged() {
    //   this.$emit('indexChanged', this.indexStart, this.indexEnd)
    // },

    resetPageNumber() {
      this.pageNumber = 0
    },
    nextPage() {
      if (
        this.pageNumber + 1 <
        this.filteredResultsArray.length / this.sizePerPage
      ) {
        this.pageNumber++
      }
    },
    prevPage() {
      if (this.pageNumber > 0) {
        this.pageNumber--
      }
    },
    checkboxFilterEnabledChange() {
      this.windowResized()
      this.resetPageNumber()

      this.$emit('checkboxFilterEnabledChanged', this.checkboxFilterEnabled)

      // this.checkedCategories = new Set(this.resultsCategoriesAllArrayUnfiltered)
      // this.$emit('resultsCategoriesCheckboxChanged', this.checkedCategories)
    },
    languageSwitched() {
      this.$emit('languageSwitched', this.language)
    },

    categoriesOnHoverOrClickChanged() {
      this.$emit(
        'categories-hover-click-changed',
        this.categoriesOnHoverOrClick
      )
    },
    scalingFactorChanged() {
      this.$emit('scalingFactorChanged', this.scalingFactor)
    },
    circleButtonRadiusChanged() {
      this.$emit('circle-button-radius-changed', this.circleButtonRadius)
    },
    modeSwitched() {
      if (this.mode === 'mobile') {
        this.scalingFactorSaved = this.scalingFactor
        this.circleButtonRadiusSaved = this.circleButtonRadius
        this.circleButtonRadius = 260
      } else {
        this.scalingFactor = this.scalingFactorSaved
        this.circleButtonRadius = this.circleButtonRadiusSaved
      }
      // only emit radius, scalingFactor is recalculated in windowResized, called in MainView ONLY on switch TO mobile mode
      // this way scale and radius are saved and reapplied for desktop mode
      this.$emit('circle-button-radius-changed', this.circleButtonRadius)

      this.$emit('mode-switched', this.mode)
    },
    mobileDisplaySwitched() {
      this.$emit('mobile-display-switched', this.mobileDisplay)
    },
    setCheckboxFilterEnabled() {
      this.checkboxFilterEnabled = true
    },
    showHelpClicked() {
      // resize needed here, not after emit in MainView
      this.windowResized()
      this.$emit('show-help-switched', this.showHelp)
    },
    windowResized() {
      this.$nextTick(() => {
        let vw
        if (typeof window.visualViewport === 'undefined') {
          vw = Math.min(window.innerWidth, document.documentElement.clientWidth)
        } else {
          vw = Math.min(
            window.innerWidth,
            document.documentElement.clientWidth,
            window.visualViewport.width
          )
        }

        //min width categories checkbox filter
        if (
          this.checkboxFilterEnabled &&
          this.resultsCategoriesEnabled &&
          !this.mobileMode &&
          !this.showHelp
        ) {
          vw -= 320
        }

        // remove inputform width in landscape
        if (window.matchMedia('(orientation: landscape)').matches) {
          vw -= this.$refs.inputformflexcontainer.getBoundingClientRect().width
        }

        // if (!this.checkboxFilterEnabled) {
        this.$emit('grid-width-nocategories-changed', vw)
        // }

        let vh
        if (window.matchMedia('(orientation: portrait)').matches) {
          vh = this.$refs.inputformflexcontainer.getBoundingClientRect().height
          this.portraitMode = true
        } else {
          vh = 0
          this.portraitMode = false
        }

        this.flexContainerHeight = vh

        this.$emit('grid-height-changed', vh)

        if (!this.showHelp) {
          let sf = vw / (this.circleButtonRadius * 1.25 * 2 + 220)

          sf = Math.min(1.0, sf)
          // documentElement.clientWidth can be unreliable, 0 or wrong values...simple safety measure here
          // also generally restricting to min 0.33
          sf = Math.max(0.33, sf)

          this.scalingFactor = sf

          this.$emit('scalingFactorChanged', this.scalingFactor)
        }
      })
    }
  },
  mounted() {
    window.addEventListener('resize', this.windowResized)

    if (window.matchMedia('(orientation: landscape)').matches) {
      if (window.innerWidth < 860) {
        this.mode = 'mobile'
        this.categoriesOnHoverOrClick = 'catsclick'
        this.$emit(
          'categories-hover-click-changed',
          this.categoriesOnHoverOrClick
        )

        this.modeSwitched()
      }
    } else {
      if (window.innerWidth < 610) {
        this.mode = 'mobile'
        this.categoriesOnHoverOrClick = 'catsclick'
        this.$emit(
          'categories-hover-click-changed',
          this.categoriesOnHoverOrClick
        )

        this.modeSwitched()
      }
    }

    this.windowResized()

    // handle parameters from URL
    /**
     * URL Parameters
     * @param {String} mode - Enable mobile/desktop mode, desktop or mobile valid (this.mode)
     * @param {String} lang - UI and Wikipedia language, en or de valid (this.language)
     * @param {String} categories - Enable/disable results categories, on or off valid (boolean to this.resultsCategoriesEnabled)
     * @param {String} titlefilter - String to filter results titles with (this.filter)
     * @param {String} categoriesfilter - String to filter results categories with (this.filterCategories)
     * @param {String} mobileview - Mobile mode only: Switch view mode, valid graph, extract, categories (outgraph, maininfo, categories -> this.mobileDisplay)
     * @param {String} checkboxfilter - Desktop mode only: Enable/disable checkbox categories filter, on or off valid (boolean to this.checkboxFilterEnabled)
     * @param {String} redirects - Enable/disable redirects, on or off valid (boolean to this.resultsRedirectsEnabled)
     * @param {String} categoriesmode - Show categories on click or hover, valid click or hover (this.categoriesOnHoverOrClick)
     * @param {String} resultsperpage - parse to int, range 2-40, number of results per page (this.sizePerPage)
     * @param {String} search - Wikipedia page to search for (this.title)
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
    let resultsperpage = parseInt(urlParameters.get('resultsperpage'), 10)
    const search = urlParameters.get('search')

    if (mode === 'desktop' || mode === 'mobile') {
      this.mode = mode
      this.modeSwitched()
    }

    if (lang === 'en' || lang === 'de') {
      this.language = lang
      this.languageSwitched()
    }

    if (categories === 'on' || categories === 'off') {
      switch (categories) {
        case 'on':
          this.resultsCategoriesEnabled = true
          break

        case 'off':
          this.resultsCategoriesEnabled = false
          break
      }
      this.resultsCategoriesChanged()
    }

    if (titlefilter && titlefilter.length > 0) {
      // this.filter = titlefilter
      this.resetPageNumber()
      this.filterChanged(titlefilter)
    }

    if (
      categoriesfilter &&
      categoriesfilter.length > 0 &&
      this.resultsCategoriesEnabled
    ) {
      this.filterCategories = categoriesfilter
      this.resetPageNumber()
      this.filterCategoriesChanged()
    }

    if (
      this.mode === 'mobile' &&
      (mobileview === 'graph' ||
        mobileview === 'extract' ||
        mobileview === 'categories')
    ) {
      switch (mobileview) {
        case 'graph':
          this.mobileDisplay = 'outgraph'
          this.mobileDisplaySwitched()
          break
        case 'extract':
          this.mobileDisplay = 'maininfo'
          this.mobileDisplaySwitched()
          break
        case 'categories':
          if (this.resultsCategoriesEnabled) {
            this.mobileDisplay = 'categories'
            this.mobileDisplaySwitched()
          }
          break
      }
    }

    if (
      this.mode === 'desktop' &&
      (checkboxfilter === 'on' || checkboxfilter === 'off')
    ) {
      switch (checkboxfilter) {
        case 'on':
          if (this.resultsCategoriesEnabled) {
            this.checkboxFilterEnabled = true
          }
          this.checkboxFilterEnabledChange()
          break
        case 'off':
          this.checkboxFilterEnabled = false
          this.checkboxFilterEnabledChange()
          break
      }
    }

    if (redirects === 'on' || redirects === 'off') {
      switch (redirects) {
        case 'on':
          this.resultsRedirectsEnabled = true
          break
        case 'off':
          this.resultsRedirectsEnabled = false
          break
      }
      this.resultsRedirectsChanged()
    }

    if (categoriesmode === 'click' || categoriesmode === 'hover') {
      switch (categoriesmode) {
        case 'click':
          this.categoriesOnHoverOrClick = 'catsclick'
          break

        case 'hover':
          this.categoriesOnHoverOrClick = 'catshover'
          break
      }
      this.categoriesOnHoverOrClickChanged()
    }

    if (!isNaN(resultsperpage)) {
      resultsperpage = Math.max(2, Math.min(40, resultsperpage))
      this.sizePerPage = resultsperpage
      this.resetPageNumber()
    }

    // do search last after evaluating all other parameters
    if (search && search.length > 0) {
      this.title = search
      this.fetchData()
    }
  },
  beforeUnMount() {
    window.removeEventListener('resize', this.windowResized)
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

.radiobutton:hover + label,
.checkbox:hover + label {
  filter: invert(0.25);
}

.inputform-flex-container {
  display: flex;
  /* flex-wrap: wrap; */
  justify-content: space-around;
  /* align-items: center; */
  /* align-content: space-around; */
  /* background-color: green; */
  flex: 0 1 auto;
}

.inputform-flex-item-1,
.inputform-flex-item-2,
.inputform-flex-item-3 {
  /* background-color: lightgreen; */
  /* border: 1px solid black; */
  flex: 0 1 auto;
  font-size: 90%;
  /* width: 400px; */
}

/* .inputform-flex-item-1 {
  background-color: lightblue;
}

.inputform-flex-item-2 {
  background-color: lightcyan;
}

.inputform-flex-item-3 {
  background-color: lightgreen;
} */

.checkbox-dirty {
  text-decoration: underline;
}

.leftarrow {
  height: 1.75em;
  float: left;
  margin-left: 5px;
}
.rightarrow {
  height: 1.75em;
  float: right;
  margin-right: 5px;
}

.leftarrow:hover,
.rightarrow:hover {
  filter: invert(0.5);
}
.itemdisabled {
  filter: invert(0.75);
}

.pagecount {
  display: inline-block;
  width: 180px;
}

.pageinfotext {
  vertical-align: middle;
}

.searchicon:hover {
  filter: invert(0.5);
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
