<template>
  <div class="inputform-flex-container" ref="inputformflexcontainer">
    <div class="inputform-flex-item-1">
      <form @submit.prevent="fetchData()">
        <input
          id="title"
          v-model="title"
          :disabled="
            inputsDisabled ||
            (resultsCategoriesEnabled && !resultsCategoriesDone)
          "
        />
        <button
          type="submit"
          :disabled="
            inputsDisabled ||
            (resultsCategoriesEnabled && !resultsCategoriesDone)
          "
        >
          {{ $t('fetch-data') }}
        </button>
      </form>
      <form>
        <input
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

        <label for="en">{{ $t('language-en') }}</label>
        <input
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
        <label for="de">{{ $t('language-de') }}</label>
      </form>

      <form @submit.prevent="">
        <label for="filter">{{ $t('filter-results-titles') }}</label>
        <input
          id="filter"
          v-model="filter"
          @input="resetPageNumber(), filterChanged()"
          :disabled="inputsDisabled"
        />
      </form>

      <form @submit.prevent="">
        <label for="filterCategories">{{
          $t('filter-results-categories')
        }}</label>
        <input
          id="filterCategories"
          v-model="filterCategories"
          @input="resetPageNumber(), filterCategoriesChanged()"
          :disabled="
            inputsDisabled ||
            !resultsCategoriesDone ||
            !resultsCategoriesEnabled
          "
        />
      </form>
    </div>
    <div class="inputform-flex-item-2">
      <form>
        <input
          id="resultsCategories"
          type="checkbox"
          :disabled="inputsDisabled"
          v-model="resultsCategoriesEnabled"
          @change="resultsCategoriesChanged"
        />
        <label for="resultsCategories">{{
          $t('show-results-categories')
        }}</label>
      </form>
      <form>
        <input
          id="checkboxFilter"
          type="checkbox"
          :disabled="inputsDisabled || !resultsCategoriesEnabled"
          v-model="checkboxFilterEnabled"
          @change="checkboxFilterEnabledChange"
        />
        <label for="checkboxFilter">{{
          $t('enable-categories-checkbox-filter')
        }}</label>
      </form>

      <form>
        <input
          id="resultsRedirects"
          type="checkbox"
          :disabled="inputsDisabled"
          v-model="resultsRedirectsEnabled"
          @change="resultsRedirectsChanged"
        />
        <label for="resultsRedirects">{{ $t('show-used-redirects') }}</label>
      </form>

      <form>
        <span>{{ $t('show-cats-on') }}</span>
        <input
          type="radio"
          id="catsclick"
          value="catsclick"
          :disabled="
            inputsDisabled ||
            (resultsCategoriesEnabled && !resultsCategoriesDone)
          "
          v-model="categoriesOnHoverOrClick"
          @change="categoriesOnHoverOrClickChanged"
        />
        <label for="catsclick">{{ $t('cats-click') }}</label>
        <input
          type="radio"
          id="catshover"
          value="catshover"
          :disabled="
            inputsDisabled ||
            (resultsCategoriesEnabled && !resultsCategoriesDone)
          "
          v-model="categoriesOnHoverOrClick"
          @change="categoriesOnHoverOrClickChanged"
        />
        <label for="catshover">{{ $t('cats-hover') }}</label>
      </form>
    </div>

    <div class="inputform-flex-item-3">
      <input
        type="range"
        min="2"
        step="2"
        :max="40"
        v-model="sizePerPage"
        :disabled="inputsDisabled || filteredResultsArray.length === 0"
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
        type="range"
        min="0.33"
        max="1.0"
        step="0.01"
        v-model="scalingFactor"
        :disabled="inputsDisabled || filteredResultsArray.length === 0"
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
        @input="scalingFactorChanged"
      />
      <div
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
      >
        {{ $t('scale-graph') }}
      </div>
      <input
        type="range"
        min="200"
        max="650"
        step="1"
        v-model="circleButtonRadius"
        :disabled="inputsDisabled || filteredResultsArray.length === 0"
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
        @input="circleButtonRadiusChanged"
      />
      <div
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
      >
        {{ $t('graph-radius') }}
      </div>
    </div>
    <div class="inputform-flex-item-4">
      <p>{{ $t('results') }}{{ filteredResultsArray.length }}</p>
      <p
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
      >
        {{ $t('showing') }}{{ $t('from') }}{{ indexStart + 1 }}{{ $t('to')
        }}{{ indexEnd + 1 }}
      </p>
    </div>
    <div class="inputform-flex-item-5">
      <p
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
      >
        {{ $t('page') }}{{ pageNumber + 1 }}{{ $t('of') }}{{ numberOfPages }}
      </p>

      <form
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
      >
        <button
          @click.prevent="prevPage"
          :disabled="
            inputsDisabled ||
            filteredResultsArray.length === 0 ||
            pageNumber === 0
          "
        >
          {{ $t('prev-page') }}
        </button>
        <button
          @click.prevent="nextPage"
          :disabled="
            inputsDisabled ||
            filteredResultsArray.length === 0 ||
            pageNumber + 1 === numberOfPages
          "
        >
          {{ $t('next-page') }}
        </button>
      </form>
      <p
        :style="{
          visibility:
            resultsCategoriesEnabled && !resultsCategoriesDone
              ? 'visible'
              : 'hidden',
          color: 'red'
        }"
      >
        {{ $t('fetching-results-categories') }}
      </p>
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
    'resultsCategoriesCheckboxChanged',
    'checkboxFilterEnabledChanged',
    'languageSwitched',
    'scalingFactorChanged',
    'categories-hover-click-changed',
    'circle-button-radius-changed',
    'grid-width-nocategories-changed',
    'grid-height-changed'
  ],

  props: {
    parentTitle: { required: true, default: '', type: String },
    inputsDisabled: { required: true, default: false, type: Boolean },
    resultsCategoriesDone: { required: true, default: true, type: Boolean },
    filteredResultsArray: { required: true, default: () => [], type: Array },
    resultsCategoriesAllArrayUnfiltered: {
      required: true,
      default: () => [],
      type: Array
    }
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
      checkedCategories: new Set(),
      scalingFactor: 1.0,
      circleButtonRadius: 260,
      categoriesOnHoverOrClick: 'catsclick'
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

      this.checkedCategories = new Set(this.resultsCategoriesAllArrayUnfiltered)
      this.$emit('resultsCategoriesCheckboxChanged', this.checkedCategories)
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
        if (this.checkboxFilterEnabled && this.resultsCategoriesEnabled) {
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
.inputform-flex-item-4,
.inputform-flex-item-5 {
  /* background-color: lightgreen; */
  /* border: 1px solid black; */
  flex: 0 1 auto;
  /* width: 400px; */
}

@media (orientation: landscape) {
  .inputform-flex-container {
    flex-direction: column;
    min-width: 400px;
    width: 400px;
  }
}

@media (orientation: portrait) {
  .inputform-flex-container {
    flex-direction: row;
  }
}
</style>
