<template>
  <form @submit.prevent="getJson(), getMainInfo(), getCategories()">
    <input id="title" v-model="title" :disabled="inputsDisabled" />
    <button type="submit" :disabled="inputsDisabled">Fetch data</button>
  </form>
  <form>
    <input
      id="resultsCategories"
      type="checkbox"
      :disabled="inputsDisabled"
      v-model="resultsCategoriesEnabled"
    />
    <label for="resultsCategories"
      >Show categories on hover (slow init, esp. on big pages)</label
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
    Fetching categories...
  </div>

  <form>
    <input
      id="resultsRedirects"
      type="checkbox"
      :disabled="inputsDisabled"
      v-model="resultsRedirectsEnabled"
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
      @input="resetPageNumber"
      :disabled="inputsDisabled"
    />
  </form>

  <form @submit.prevent="">
    <label for="filterCategories">Filter categories:</label>
    <input
      id="filterCategories"
      v-model="filterCategories"
      @input="resetPageNumber"
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

  <br />
  <outgraph
    :inputs-disabled="inputsDisabled"
    :returned-title="returnedTitle"
    :returned-url="returnedUrl"
    :results-redirects-enabled="resultsRedirectsEnabled"
    :returned-redirect="returnedRedirect"
    :display-results-array="displayResultsArray"
    :categories-array="categoriesArray"
    :results-categories-enabled="resultsCategoriesEnabled"
    :results-categories-done="resultsCategoriesDone"
    @circleButtonClicked="circleButtonClicked"
  ></outgraph>

  <main-title-info :extract="extract" :image="returnedImage"></main-title-info>
</template>

<script>
import MainTitleInfo from './MainTitleInfo.vue'
import Outgraph from './Outgraph.vue'

export default {
  name: 'MainView',
  components: { MainTitleInfo, Outgraph },
  data() {
    return {
      title: '',
      filter: '',
      filterCategories: '',
      jsonDataFullQueryPart: {},
      categoriesArray: [],
      categoriesQueryPart: {},
      extract: '',
      pageNumber: 0,
      sizePerPage: 12,
      returnedTitle: '',
      returnedUrl: '',
      returnedImage: '',
      returnedRedirect: '',
      resultsCategoriesEnabled: true,
      resultsCategoriesDone: true,
      resultsRedirectsEnabled: true,
      inputsDisabled: false,
      resultsObject: {},
      // Api-User-Agent can be used instead of regular User-Agent (good practice, not always enforced by wikimedia)
      // User-Agent might not be possible to set in every browser
      fetchHeaders: new Headers({
        'Api-User-Agent': 'WikiExplorer/0.1',
        'User-Agent': 'WikiExplorer/0.1'
      })
    }
  },

  watch: {
    resultsCategoriesEnabled() {
      if (
        this.resultsCategoriesEnabled === true &&
        this.resultsCategoriesDone === false
      ) {
        this.getResultsCategories()
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
    },
    mainInfoUrl() {
      let url =
        'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|info|pageimages&piprop=original&exintro&redirects=1&indexpageids&inprop=url&titles=' +
        this.title +
        '&origin=*'

      return url
    },

    // separate categories fetch, instead of adding to main info, for simple continue handling
    categoriesUrl() {
      let url =
        'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=categories&redirects&cllimit=max&clshow=!hidden&titles=' +
        this.title +
        '&origin=*'

      if (this.categoriesQueryPart.continue) {
        for (const property in this.categoriesQueryPart.continue) {
          url +=
            '&' + property + '=' + this.categoriesQueryPart.continue[property]
        }
      }

      return url
    },
    pageUrl() {
      let url =
        'https://en.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&gplnamespace=0&format=json&titles=' +
        this.title +
        '&prop=info&inprop=url&origin=*'

      if (this.jsonDataFullQueryPart.continue) {
        for (const property in this.jsonDataFullQueryPart.continue) {
          url +=
            '&' + property + '=' + this.jsonDataFullQueryPart.continue[property]
        }
      }

      return url
    },
    // separate categories results fetch for major speedup compared to getting info and categories prop at same time (more redundant props to go through)
    pageUrlCategories() {
      let url =
        'https://en.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&gplnamespace=0&format=json&titles=' +
        this.title +
        '&prop=categories&cllimit=max&clshow=!hidden&origin=*'

      if (this.jsonDataFullQueryPart.continue) {
        for (const property in this.jsonDataFullQueryPart.continue) {
          url +=
            '&' + property + '=' + this.jsonDataFullQueryPart.continue[property]
        }
      }

      return url
    },

    filteredResultsArray() {
      let filteredArray = Object.values(this.resultsObject)

      // apply titles filter
      filteredArray = filteredArray.filter((page) =>
        page.title.toLowerCase().includes(this.filter.toLowerCase())
      )

      // good - maybe rewrite without ternary
      if (this.resultsCategoriesEnabled && this.resultsCategoriesDone) {
        filteredArray = filteredArray.filter((page) =>
          page.categories
            ? page.categories.find((item) =>
                item.toLowerCase().includes(this.filterCategories.toLowerCase())
              )
            : null
        )
      }

      // sort
      filteredArray = filteredArray.sort((a, b) => {
        return a.title.localeCompare(b.title)
      })

      return filteredArray
    },

    displayResultsArray() {
      let displayArray = this.filteredResultsArray
      displayArray = displayArray.filter(
        (page, index) => index >= this.indexStart && index <= this.indexEnd
      )

      return displayArray
    }
  },

  methods: {
    async getJson() {
      this.inputsDisabled = true
      this.resultsCategoriesDone = false

      let redirectsArray = []
      this.resultsObject = {}

      // let start2, end2, start3, end3, start4, end4, start5, end5
      // let timecountertitle = 0
      // let rounds = 0

      do {
        // const start = performance.now()

        try {
          // start4 = performance.now()

          const response = await fetch(this.pageUrl, {
            headers: this.fetchHeaders
          })

          // end4 = performance.now()

          if (!response.ok) {
            const message = `ERROR: ${response.status} ${response.statusText}`
            throw new Error(message)
          } else {
            // start5 = performance.now()
            this.jsonDataFullQueryPart = await response.json()

            // end5 = performance.now()
            // start2 = performance.now()

            for (const property in this.jsonDataFullQueryPart.query.pages) {
              if (!this.resultsObject[property]) {
                this.resultsObject[property] = {
                  ...this.jsonDataFullQueryPart.query.pages[property]
                }
              }
            }

            // end2 = performance.now()
            // start3 = performance.now()

            if (this.jsonDataFullQueryPart.query.redirects) {
              const redir = this.jsonDataFullQueryPart.query.redirects

              for (let i = 0; i < redir.length; i++) {
                let found = false
                for (let j = 0; j < redirectsArray.length && !found; j++) {
                  found = redirectsArray[j].from === redir[i].from
                }
                if (!found) {
                  redirectsArray.push(redir[i])
                }
              }
            }
          }

          // end3 = performance.now()
        } catch (error) {
          throw new Error(error)
        }

        // rounds++
        // const end = performance.now()
        // console.log(
        //   `Time title full (round ${rounds}): ${end - start} ms / API fetch: ${
        //     end4 - start4
        //   } ms - JSONify ${end5 - start5} ms - Title insert alone: ${
        //     end2 - start2
        //   } ms - Redirects push alone: ${end3 - start3} ms`
        // )
        // timecountertitle += end - start
      } while (this.jsonDataFullQueryPart.continue)
      // console.log(`Time title all (${rounds} rounds): ${timecountertitle} ms`)

      // let start = performance.now()
      let usedKeys = ['pageid', 'title', 'fullurl', 'missing']
      for (const property in this.resultsObject) {
        for (const key in this.resultsObject[property]) {
          if (!usedKeys.includes(key)) {
            delete this.resultsObject[property][key]
          }
          if (key === 'missing') {
            this.resultsObject[property][key] = true
          }
        }
      }
      // let end = performance.now()
      // console.log(`Time remove unused keys: ${end - start} ms`)

      if (this.resultsCategoriesEnabled) {
        this.getResultsCategories()
      }

      // start = performance.now()
      // redirectsArray.sort((a, b) => (a.from > b.from ? 1 : -1))
      // end = performance.now()
      // console.log(`Time sort redirects: ${end - start} ms`)

      // attaching redirects to appropriate pages in resultsobject - if redirectsArray not used
      // otherwise, sort above not needed.
      // could also maybe scrape this from redirectsarray directly on display, but going for
      // having it all in one data structure
      // THESE ARE ONLY REDIRECTS USED ON SEARCHED PAGE, NOT ALL POSSIBLE ONES
      // for all redirects for a given page use prop=redirects
      // https://en.wikipedia.org/w/api.php?action=query&generator=links&gpllimit=max&gplnamespace=0&format=json&titles=C64&prop=redirects&rdlimit=max
      // can possibly be combined into api fetch for all results, but not useful here, long list for each result and does not have any direct relation to searched page

      // let counter = 0
      for (const property in this.resultsObject) {
        let redirectFrom = []

        for (let i = 0; i < redirectsArray.length; i++) {
          if (this.resultsObject[property].title === redirectsArray[i].to) {
            // console.log(
            //   `${counter} to: ${redirectsArray[i].to} from: ${redirectsArray[i].from}`
            // )
            // counter++
            redirectFrom.push(redirectsArray[i].from)
            // break - do not break here, several possible!
          }
        }
        if (redirectFrom.length > 0) {
          // console.log(
          //   `${this.resultsObject[property].title} from ${redirectFrom}`
          // )
          redirectFrom.sort()
          this.resultsObject[property].redirectFrom = [...redirectFrom]
          redirectFrom = []
        }
      }

      // start = performance.now()
      this.resetPageNumber()
      // end = performance.now()
      // console.log(`Time reset pagenumber: ${end - start} ms`)

      this.inputsDisabled = false
    },

    async getResultsCategories() {
      // with big pages this requires lots of api fetches, which makes up majority of the wait time

      // let timecountercategories = 0
      // let start2, end2, start3, end3, start4, end4
      // let rounds = 0

      do {
        // const start = performance.now()

        try {
          // start3 = performance.now()

          const response = await fetch(this.pageUrlCategories, {
            headers: this.fetchHeaders
          })

          // end3 = performance.now()
          if (!response.ok) {
            const message = `ERROR: ${response.status} ${response.statusText}`
            throw new Error(message)
          } else {
            // start4 = performance.now()
            this.jsonDataFullQueryPart = await response.json()
            // end4 = performance.now()
            // start2 = performance.now()

            for (const property in this.jsonDataFullQueryPart.query.pages) {
              if (this.jsonDataFullQueryPart.query.pages[property].categories) {
                if (!this.resultsObject[property].categories) {
                  this.resultsObject[property].categories = []
                }

                this.jsonDataFullQueryPart.query.pages[
                  property
                ].categories.forEach((category) =>
                  this.resultsObject[property].categories.push(category.title)
                )

                // filter "Category:" at beginning
                for (
                  let i = 0;
                  i < this.resultsObject[property].categories.length;
                  i++
                ) {
                  // not sure it always starts with "Category:", check and only remove if it does
                  if (
                    this.resultsObject[property].categories[i].startsWith(
                      'Category:'
                    )
                  ) {
                    this.resultsObject[property].categories[i] =
                      this.resultsObject[property].categories[i].substring(9)
                  }
                }
              }
            }

            // end2 = performance.now()
          }
        } catch (error) {
          throw new Error(error)
        }

        // rounds++
        // const end = performance.now()
        // console.log(
        //   `Time categories full (round ${rounds}): ${
        //     end - start
        //   } ms / API fetch: ${end3 - start3} ms - JSONify: ${
        //     end4 - start4
        //   } ms - Categories insert alone: ${end2 - start2} ms`
        // )
        // timecountercategories += end - start
      } while (this.jsonDataFullQueryPart.continue)
      // console.log(
      //   `Time categories all (${rounds} rounds): ${timecountercategories} ms`
      // )
      this.resultsCategoriesDone = true
    },

    async getMainInfo() {
      this.extract = ''
      this.returnedImage = ''
      this.returnedRedirect = ''

      try {
        const response = await fetch(this.mainInfoUrl, {
          headers: this.fetchHeaders
        })

        // ok = true on http 200-299 good response
        if (!response.ok) {
          const message = `ERROR: ${response.status} ${response.statusText}`
          this.extract = message
          throw new Error(message)
        } else {
          // add error handling
          const responseFull = await response.json()
          const pageId = responseFull.query.pageids[0]
          this.extract = responseFull.query.pages[pageId].extract
          this.returnedTitle = responseFull.query.pages[pageId].title
          this.returnedUrl = responseFull.query.pages[pageId].fullurl

          if (responseFull.query.redirects) {
            if (responseFull.query.redirects[0].from) {
              this.returnedRedirect = responseFull.query.redirects[0].from
            }
          }
          // check if image exists
          if (
            (this.returnedImage = responseFull.query.pages[pageId].original)
          ) {
            this.returnedImage =
              responseFull.query.pages[pageId].original.source
          }
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async getCategories() {
      this.categoriesArray = []
      do {
        try {
          const response = await fetch(this.categoriesUrl, {
            headers: this.fetchHeaders
          })

          // ok = true on http 200-299 good response
          if (!response.ok) {
            const message = `ERROR: ${response.status} ${response.statusText}`
            this.categoriesArray = message
            throw new Error(message)
          } else {
            this.categoriesQueryPart = await response.json()

            let resultsArray = Object.values(
              this.categoriesQueryPart.query.pages
            )
            // ...query.pages has only one prop at this level equal to page id. -> array index [0]
            for (let i = 0; i < resultsArray[0].categories.length; i++) {
              this.categoriesArray.push(resultsArray[0].categories[i].title)
            }
          }
        } catch (error) {
          this.categoriesQueryPart = error
        }
      } while (this.categoriesQueryPart.continue)

      // filter "Category:" at beginning
      for (let i = 0; i < this.categoriesArray.length; i++) {
        // not sure it always starts with "Category:", check and only remove if it does
        if (this.categoriesArray[i].startsWith('Category:')) {
          this.categoriesArray[i] = this.categoriesArray[i].substring(9)
        }
      }

      //results seem sorted, but just to be sure
      // sort
      this.categoriesArray.sort()
    },
    circleButtonClicked(index) {
      this.title = this.displayResultsArray[index].title

      this.getJson()
      this.getMainInfo()
      this.getCategories()
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
    resetPageNumber() {
      this.pageNumber = 0
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
