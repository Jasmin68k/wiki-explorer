<template>
  <form @submit.prevent="FetchData()">
    <input id="title" v-model="title" :disabled="inputsDisabled" />
    <button type="submit" :disabled="inputsDisabled">Fetch data</button>
  </form>
  <form>
    <input
      id="resultsCategories"
      type="checkbox"
      :disabled="inputsDisabled"
      v-model="resultsCategoriesEnabled"
      @change="resultsCategoriesChanged(), resetPageNumber()"
    />
    <label for="resultsCategories"
      >Show results categories on hover (slow init, esp. on big pages)</label
    >
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
    Fetching results categories...
  </div>

  <form>
    <input
      id="resultsRedirects"
      type="checkbox"
      :disabled="inputsDisabled"
      v-model="resultsRedirectsEnabled"
      @change="resultsRedirectsChanged"
    />
    <label for="resultsRedirects"
      >Show used redirects (not all possible ones)</label
    >
  </form>

  <form @submit.prevent="">
    <label for="filter">Filter titles:</label>
    <input
      id="filter"
      v-model="filter"
      @input="resetPageNumber(), filterChanged()"
      :disabled="inputsDisabled"
    />
  </form>

  <form @submit.prevent="">
    <label for="filterCategories">Filter categories:</label>
    <input
      id="filterCategories"
      v-model="filterCategories"
      @input="resetPageNumber(), filterCategoriesChanged()"
      :disabled="
        inputsDisabled || !resultsCategoriesDone || !resultsCategoriesEnabled
      "
    />
  </form>

  <input
    type="range"
    min="1"
    :max="
      filteredResultsArray.length === 0
        ? sizePerPage
        : filteredResultsArray.length <= 24
        ? filteredResultsArray.length
        : 24
    "
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
    Results per page: {{ sizePerPage }}
  </div>
  <br />

  <div
    :style="{
      visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
    }"
  >
    Page: {{ pageNumber + 1 }} of
    {{ numberOfPages }}
  </div>
  <p>Results: {{ filteredResultsArray.length }}</p>
  <p
    :style="{
      visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
    }"
  >
    Showing from {{ indexStart + 1 }} to {{ indexEnd + 1 }}
  </p>
  <form
    :style="{
      visibility: filteredResultsArray.length > 0 ? 'visible' : 'hidden'
    }"
  >
    <button
      @click.prevent="prevPage"
      :disabled="
        inputsDisabled || filteredResultsArray.length === 0 || pageNumber === 0
      "
    >
      Prev. page
    </button>
    <button
      @click.prevent="nextPage"
      :disabled="
        inputsDisabled ||
        filteredResultsArray.length === 0 ||
        pageNumber + 1 === numberOfPages
      "
    >
      Next page
    </button>
  </form>
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
    'indexEndChanged'
  ],

  props: {
    inputsDisabled: { required: true, default: false, type: Boolean },
    resultsCategoriesDone: { required: true, default: true, type: Boolean },
    filteredResultsArray: { required: true, default: () => [], type: Array }
  },
  watch: {
    indexStart() {
      this.$emit('indexStartChanged', this.indexStart)
    },
    indexEnd() {
      this.$emit('indexEndChanged', this.indexEnd)
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
      title: '',
      filter: '',
      resultsCategoriesEnabled: true,
      resultsRedirectsEnabled: true,
      filterCategories: '',
      pageNumber: 0,
      sizePerPage: 12
    }
  },

  methods: {
    FetchData() {
      this.$emit('fetchDataClicked', this.title)
    },
    resultsCategoriesChanged() {
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
    // called from parent
    titleChanged(value) {
      this.title = value
    }
  }
}
</script>
<style scoped></style>
