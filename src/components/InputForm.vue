<template>
  <div class="inputform-flex-container" ref="inputformflexcontainer">
    <div class="inputform-flex-item-1">
      <form>
        <input
          class="radiobutton"
          type="radio"
          id="desktop"
          value="desktop"
          :disabled="
            inputsDisabled ||
            (resultsCategoriesEnabled && !resultsCategoriesDone)
          "
          v-model="mode"
          @change="modeSwitched"
        />

        <label class="radiolabel" for="desktop">{{ $t('desktop-mode') }}</label>
        <input
          class="radiobutton"
          type="radio"
          id="mobile"
          value="mobile"
          :disabled="
            inputsDisabled ||
            (resultsCategoriesEnabled && !resultsCategoriesDone)
          "
          v-model="mode"
          @change="modeSwitched"
        />
        <label class="radiolabel" for="mobile">{{ $t('mobile-mode') }}</label>
      </form>

      <form>
        <input
          class="radiobutton"
          type="radio"
          id="en"
          value="en"
          :disabled="
            inputsDisabled ||
            (resultsCategoriesEnabled && !resultsCategoriesDone)
          "
          v-model="language"
          @change="languageSwitched"
        />

        <label class="radiolabel" for="en">{{ $t('language-en') }}</label>
        <input
          class="radiobutton"
          type="radio"
          id="de"
          value="de"
          :disabled="
            inputsDisabled ||
            (resultsCategoriesEnabled && !resultsCategoriesDone)
          "
          v-model="language"
          @change="languageSwitched"
        />
        <label class="radiolabel" for="de">{{ $t('language-de') }}</label>
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
        />
        <button
          class="searchbutton"
          type="submit"
          :disabled="
            inputsDisabled ||
            (resultsCategoriesEnabled && !resultsCategoriesDone)
          "
        >
          <img class="searchicon" src="../assets/images/search.svg" />
        </button>
      </form>

      <form @submit.prevent="">
        <label for="filter"
          ><img class="titleicon" src="../assets/images/text-tool.svg"
        /></label>
        <input
          id="filter"
          class="titleinputarea"
          :placeholder="$t('filter-results-titles')"
          v-model="filter"
          @input="resetPageNumber(), filterChanged()"
          :disabled="
            inputsDisabled || (mobileMode && mobileDisplay === 'maininfo')
          "
        />
      </form>

      <form @submit.prevent="">
        <label for="filterCategories">
          <img class="categoriesicon" src="../assets/images/document.svg" />
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
        />
      </form>
    </div>
    <div class="inputform-flex-item-2">
      <div v-if="mobileMode">
        <input
          class="radiobutton"
          type="radio"
          id="outgraph"
          value="outgraph"
          :disabled="
            inputsDisabled ||
            (resultsCategoriesEnabled && !resultsCategoriesDone)
          "
          v-model="mobileDisplay"
          @change="mobileDisplaySwitched"
        />
        <label class="radiolabel" for="outgraph"
          ><img class="graphicon" src="../assets/images/analytics-graph.svg"
        /></label>
        <input
          class="radiobutton"
          type="radio"
          id="maininfo"
          value="maininfo"
          :disabled="
            inputsDisabled ||
            (resultsCategoriesEnabled && !resultsCategoriesDone)
          "
          v-model="mobileDisplay"
          @change="mobileDisplaySwitched"
        />
        <label class="radiolabel" for="maininfo"
          ><img class="titleicon" src="../assets/images/text-tool.svg"
        /></label>
        <input
          class="radiobutton"
          type="radio"
          id="categories"
          value="categories"
          :disabled="
            inputsDisabled ||
            (resultsCategoriesEnabled && !resultsCategoriesDone) ||
            !resultsCategoriesEnabled
          "
          v-model="mobileDisplay"
          @change="mobileDisplaySwitched"
        />
        <label
          class="radiolabel"
          for="categories"
          :class="{
            'checkbox-dirty': checkboxDirty
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
          <label class="checkboxlabel" for="resultsCategories">
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
          <label class="checkboxlabel" for="checkboxFilter">
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
          <label class="checkboxlabel" for="resultsRedirects">
            <img
              class="redirectsicon"
              src="../assets/images/forward-hand-drawn-arrow-pointing-to-right.svg"
            />
          </label>
        </span>
      </div>

      <form>
        <span
          ><img class="categoriesicon" src="../assets/images/document.svg"
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
        <label class="radiolabel" for="catsclick">{{ $t('cats-click') }}</label>
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
        <label class="radiolabel" for="catshover">{{ $t('cats-hover') }}</label>
      </form>
    </div>

    <div class="inputform-flex-item-3">
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
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
        @input="resetPageNumber()"
      />
      <div
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
      >
        {{ $t('max-results-per-page') }}{{ sizePerPage }}
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

    <div class="inputform-flex-item-4">
      <p>
        <span v-show="resultsCategoriesEnabled && !resultsCategoriesDone"
          ><img
            class="categoriesicon fetchingicon"
            src="../assets/images/document.svg"
        /></span>
        <span>{{ $t('results') }}{{ filteredResultsArray.length }}</span>
        <span v-show="resultsCategoriesEnabled && !resultsCategoriesDone"
          ><img
            class="categoriesicon fetchingicon"
            src="../assets/images/document.svg"
        /></span>
      </p>
      <p
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
      >
        {{ $t('showing') }}{{ $t('from') }}{{ indexStart + 1 }}{{ $t('to')
        }}{{ indexEnd + 1 }}
      </p>
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

        <span class="pageinfotext">
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
    'filterChanged',
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
    'mobile-display-switched'
  ],

  props: {
    parentTitle: { required: true, default: '', type: String },
    inputsDisabled: { required: true, default: false, type: Boolean },
    resultsCategoriesDone: { required: true, default: true, type: Boolean },
    checkboxDirty: { required: true, default: false, type: Boolean },
    filteredResultsArray: { required: true, default: () => [], type: Array },
    // resultsCategoriesAllArrayUnfiltered: {
    //   required: true,
    //   default: () => [],
    //   type: Array
    // },
    mobileMode: { required: true, default: false, type: Boolean }
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
      filter: '',
      resultsCategoriesEnabled: true,
      resultsRedirectsEnabled: true,
      checkboxFilterEnabled: true,
      filterCategories: '',
      pageNumber: 0,
      sizePerPage: 16,
      // checkedCategories: new Set(),
      scalingFactor: 1.0,
      circleButtonRadius: 260,
      scalingFactorSaved: 1.0,
      circleButtonRadiusSaved: 260,
      categoriesOnHoverOrClick: 'catsclick',
      mode: 'desktop',
      mobileDisplay: 'outgraph'
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
    filterChanged() {
      this.$emit('filterChanged', this.filter)
    },
    filterCategoriesChanged() {
      this.$emit('filterCategoriesChanged', this.filterCategories)
    },
    indexChanged() {
      this.$emit('indexChanged', this.indexStart, this.indexEnd)
    },

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
          !this.mobileMode
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
        } else {
          vh = 0
        }
        this.$emit('grid-height-changed', vh)

        let sf = vw / (this.circleButtonRadius * 1.25 * 2 + 220)

        sf = Math.min(1.0, sf)
        // documentElement.clientWidth can be unreliable, 0 or wrong values...simple safety measure here
        // also generally restricting to min 0.33
        sf = Math.max(0.33, sf)

        this.scalingFactor = sf

        this.$emit('scalingFactorChanged', this.scalingFactor)
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
.inputform-flex-item-3,
.inputform-flex-item-4 {
  /* background-color: lightgreen; */
  /* border: 1px solid black; */
  flex: 0 1 auto;
  /* width: 400px; */
}

/* .inputform-flex-item-1 {
  background-color: lightblue;
}
.inputform-flex-item-2 {
  background-color: lightcoral;
}
.inputform-flex-item-3 {
  background-color: lightcyan;
}
.inputform-flex-item-4 {
  background-color: lightgoldenrodyellow;
} */

.checkbox-dirty {
  text-decoration: underline;
}

.leftarrow {
  height: 1.75em;
  float: left;
}
.leftarrow:hover,
.rightarrow:hover {
  filter: invert(0.5);
}
.rightarrow {
  height: 1.75em;
  float: right;
}
.itemdisabled {
  filter: invert(0.75);
}

.pagecount {
  display: inline-block;
  width: 200px;
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
.graphicon {
  height: 1.4em;
  vertical-align: middle;
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
  margin-left: 0.5em;
  margin-right: 0.5em;
  filter: invert(16%) sepia(63%) saturate(7441%) hue-rotate(0deg)
    brightness(105%) contrast(124%);
  animation: fadeIn 0.35s infinite alternate;
  height: 1em;
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
