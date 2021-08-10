<template>
  <div class="container">
    <div class="inputform">
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

      <div
        :style="{
          visibility:
            resultsCategoriesEnabled && !resultsCategoriesDone
              ? 'visible'
              : 'hidden',
          color: 'red'
        }"
      >
        {{ $t('fetching-results-categories') }}
      </div>

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

      <input
        type="range"
        min="1"
        :max="24"
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
      <br />

      <div
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
      >
        {{ $t('page') }}{{ pageNumber + 1 }}{{ $t('of') }}{{ numberOfPages }}
      </div>
      <p>{{ $t('results') }}{{ filteredResultsArray.length }}</p>
      <p
        :style="{
          visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
        }"
      >
        {{ $t('showing') }}{{ $t('from') }}{{ indexStart + 1 }}{{ $t('to')
        }}{{ indexEnd + 1 }}
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
    </div>
    <div class="inputcategoriescontainer" ref="inputcategoriescontainer">
      <categories-checkbox-filter
        v-if="
          resultsCategoriesEnabled &&
          resultsCategoriesAllArray.length > 0 &&
          resultsCategoriesDone &&
          checkboxFilterEnabled
        "
        :items="resultsCategoriesAllArray"
        :items-full="resultsCategoriesAllArrayUnfiltered"
        :root-height="scrollboxContainerHeight"
        @resultsCategoriesCheckboxChanged="resultsCategoriesCheckboxChanged"
        @categoriesAll="categoriesAll"
        @categoriesNone="categoriesNone"
      ></categories-checkbox-filter>
    </div>
  </div>
</template>
<script>
import CategoriesCheckboxFilter from './CategoriesCheckboxFilter.vue'

export default {
  name: 'InputForm',
  components: { CategoriesCheckboxFilter },

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
    'scalingFactorChanged'
  ],

  props: {
    parentTitle: { required: true, default: '', type: String },
    inputsDisabled: { required: true, default: false, type: Boolean },
    resultsCategoriesDone: { required: true, default: true, type: Boolean },
    filteredResultsArray: { required: true, default: () => [], type: Array },
    resultsCategoriesAllArray: {
      required: true,
      default: () => [],
      type: Array
    },
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
    scrollboxContainerHeight() {
      return this.$refs.inputcategoriescontainer.getBoundingClientRect().height
    },

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
      sizePerPage: 12,
      checkedCategories: new Set(),
      scalingFactor: 1.0
    }
  },

  methods: {
    fetchData() {
      this.$emit('fetchDataClicked', this.title)
    },
    resultsCategoriesChanged() {
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
    resultsCategoriesCheckboxChanged(value) {
      this.resetPageNumber()
      this.$emit('resultsCategoriesCheckboxChanged', value)
    },

    categoriesAll(value) {
      this.resetPageNumber()

      this.$emit('resultsCategoriesCheckboxChanged', value)
    },
    categoriesNone(value) {
      this.resetPageNumber()
      this.$emit('resultsCategoriesCheckboxChanged', value)
    },
    checkboxFilterEnabledChange() {
      this.resetPageNumber()

      this.$emit('checkboxFilterEnabledChanged', this.checkboxFilterEnabled)

      this.checkedCategories = new Set(this.resultsCategoriesAllArrayUnfiltered)
      this.$emit('resultsCategoriesCheckboxChanged', this.checkedCategories)
    },
    languageSwitched() {
      this.$emit('languageSwitched', this.language)
    },
    scalingFactorChanged() {
      this.$emit('scalingFactorChanged', this.scalingFactor)
    }
  },
  mounted() {
    this.scalingFactor = Math.min(1, window.innerWidth / 1080)
    this.$emit('scalingFactorChanged', this.scalingFactor)
  }
}
</script>
<style scoped>
.container {
  display: flex;
}
.inputform {
  flex: 1;
}
.inputcategoriescontainer {
  flex: 1;
  position: relative;
}
</style>
