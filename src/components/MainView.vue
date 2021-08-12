<template>
  <input-form
    :inputs-disabled="inputsDisabled"
    :results-categories-done="resultsCategoriesDone"
    :filtered-results-array="filteredResultsArray"
    :results-categories-all-array="resultsCategoriesAllArray"
    :results-categories-all-array-unfiltered="
      resultsCategoriesAllArrayUnfiltered
    "
    :parent-title="title"
    @fetchDataClicked="fetchDataClicked"
    @resultsCategoriesChanged="resultsCategoriesChanged"
    @resultsRedirectsChanged="resultsRedirectsChanged"
    @filterChanged="filterChanged"
    @filterCategoriesChanged="filterCategoriesChanged"
    @indexStartChanged="indexStartChanged"
    @indexEndChanged="indexEndChanged"
    @resultsCategoriesCheckboxChanged="resultsCategoriesCheckboxChanged"
    @checkboxFilterEnabledChanged="checkboxFilterEnabledChanged"
    @languageSwitched="languageSwitched"
    @scalingFactorChanged="scalingFactorChanged"
    @categoriesHoverClickChanged="categoriesHoverClickChanged"
    ref="inputForm"
  ></input-form>

  <br />
  <outgraph
    :inputs-disabled="inputsDisabled"
    :title="returnedTitle"
    :url="returnedUrl"
    :results-redirects-enabled="resultsRedirectsEnabled"
    :redirect="returnedRedirect"
    :display-results-array="displayResultsArray"
    :categories-array="categoriesArray"
    :results-categories-enabled="resultsCategoriesEnabled"
    :results-categories-done="resultsCategoriesDone"
    :title-missing="titleMissing"
    :scaling-factor="scalingFactor"
    :categories-on-hover="categoriesOnHover"
    @circleButtonClicked="circleButtonClicked"
  ></outgraph>

  <main-title-info :extract="extract" :image="returnedImage"></main-title-info>
</template>

<script>
import InputForm from './InputForm.vue'
import MainTitleInfo from './MainTitleInfo.vue'
import Outgraph from './Outgraph.vue'

export default {
  name: 'MainView',
  components: { InputForm, MainTitleInfo, Outgraph },
  data() {
    return {
      language: 'en',
      indexStart: 0,
      indexEnd: 0,
      title: '',
      filter: '',
      filterCategories: '',
      jsonDataFullQueryPart: {},
      categoriesArray: [],
      checkedCategories: new Set(),
      categoriesQueryPart: {},
      extract: '',
      checkboxFilterEnabled: true,
      returnedTitle: '',
      returnedUrl: '',
      returnedImage: '',
      returnedRedirect: '',
      resultsCategoriesEnabled: true,
      resultsCategoriesDone: true,
      resultsRedirectsEnabled: true,
      inputsDisabled: false,
      resultsObject: {},
      titleMissing: true,
      // Api-User-Agent can be used instead of regular User-Agent (good practice, not always enforced by wikimedia)
      // User-Agent might not be possible to set in every browser
      fetchHeaders: new Headers({
        'Api-User-Agent': 'WikiExplorer/0.1',
        'User-Agent': 'WikiExplorer/0.1'
      }),
      scalingFactor: 1.0,
      categoriesOnHover: false
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
    mainInfoUrl() {
      let url =
        'https://' +
        this.language +
        '.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|info|pageimages&piprop=original&exintro&redirects=1&indexpageids&inprop=url&titles=' +
        this.title +
        '&origin=*'

      return url
    },

    // separate categories fetch, instead of adding to main info, for simple continue handling
    categoriesUrl() {
      let url =
        'https://' +
        this.language +
        '.wikipedia.org/w/api.php?action=query&format=json&prop=categories&redirects&cllimit=max&clshow=!hidden&titles=' +
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
        'https://' +
        this.language +
        '.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&gplnamespace=0&format=json&titles=' +
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
        'https://' +
        this.language +
        '.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&gplnamespace=0&format=json&titles=' +
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
      if (!this.inputsDisabled) {
        let filteredArray = Object.values(this.resultsObject)

        // apply titles filter
        filteredArray = filteredArray.filter((page) =>
          page.title.toLowerCase().includes(this.filter.toLowerCase())
        )

        // good - maybe rewrite without ternary
        // needs to check this.filterCategories, otherwise -> when categoryfilter = '' this only shows pages, which have at least one non empty category!! and thereby ALSO excludes missing!
        if (
          this.resultsCategoriesEnabled &&
          this.resultsCategoriesDone &&
          this.filterCategories
        ) {
          filteredArray = filteredArray.filter((page) =>
            page.categories
              ? page.categories.find((item) =>
                  item
                    .toLowerCase()
                    .includes(this.filterCategories.toLowerCase())
                )
              : null
          )
        }

        if (
          this.resultsCategoriesEnabled &&
          this.resultsCategoriesDone &&
          this.checkboxFilterEnabled
        ) {
          filteredArray = filteredArray.filter((page) =>
            page.categories
              ? page.categories.find((item) => this.checkedCategories.has(item))
              : null
          )
        }

        // sort
        filteredArray = filteredArray.sort((a, b) => {
          return a.title.localeCompare(b.title)
        })

        return filteredArray
      } else {
        return []
      }
    },

    displayResultsArray() {
      if (!this.inputsDisabled) {
        return this.filteredResultsArray.slice(
          this.indexStart,
          this.indexEnd + 1
        )
      } else {
        return []
      }
    },
    resultsCategoriesAllArray() {
      if (
        this.resultsCategoriesDone &&
        this.resultsCategoriesEnabled &&
        this.checkboxFilterEnabled
      ) {
        let allCategoriesSet = new Set()

        for (const property in this.resultsObject) {
          if (
            this.resultsObject[property].categories &&
            this.resultsObject[property].title
              .toLowerCase()
              .includes(this.filter.toLowerCase())
          ) {
            this.resultsObject[property].categories.forEach((category) =>
              !allCategoriesSet.has(category) &&
              category
                .toLowerCase()
                .includes(this.filterCategories.toLowerCase())
                ? allCategoriesSet.add(category)
                : null
            )
          }
        }

        let allCategories = Array.from(allCategoriesSet)

        allCategories = allCategories.sort((a, b) => {
          return a.localeCompare(b)
        })

        return allCategories
      } else {
        return []
      }
    },
    resultsCategoriesAllArrayUnfiltered() {
      if (
        this.resultsCategoriesDone &&
        this.resultsCategoriesEnabled &&
        this.checkboxFilterEnabled
      ) {
        let allCategoriesSet = new Set()

        for (const property in this.resultsObject) {
          if (this.resultsObject[property].categories) {
            this.resultsObject[property].categories.forEach((category) =>
              !allCategoriesSet.has(category)
                ? allCategoriesSet.add(category)
                : null
            )
          }
        }

        let allCategories = Array.from(allCategoriesSet)

        allCategories = allCategories.sort((a, b) => {
          return a.localeCompare(b)
        })

        return allCategories
      } else {
        return []
      }
    }
  },

  methods: {
    async getJson() {
      this.inputsDisabled = true

      let redirectsArray = []
      this.resultsObject = {}

      do {
        try {
          const response = await fetch(this.pageUrl, {
            headers: this.fetchHeaders
          })

          if (!response.ok) {
            const message = `ERROR: ${response.status} ${response.statusText}`
            throw new Error(message)
          } else {
            this.jsonDataFullQueryPart = await response.json()

            // prevent console error when no result
            if (this.jsonDataFullQueryPart.query) {
              for (const property in this.jsonDataFullQueryPart.query.pages) {
                if (!this.resultsObject[property]) {
                  this.resultsObject[property] = {
                    ...this.jsonDataFullQueryPart.query.pages[property]
                  }
                }
              }

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
          }
        } catch (error) {
          throw new Error(error)
        }
      } while (this.jsonDataFullQueryPart.continue)
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

      this.resultsCategoriesDone = false

      if (this.resultsCategoriesEnabled) {
        this.getResultsCategories()
      }

      // attaching redirects to appropriate pages in resultsobject - if redirectsArray not used
      // otherwise, sort above not needed.
      // could also maybe scrape this from redirectsarray directly on display, but going for
      // having it all in one data structure
      // THESE ARE ONLY REDIRECTS USED ON SEARCHED PAGE, NOT ALL POSSIBLE ONES
      // for all redirects for a given page use prop=redirects
      // https://en.wikipedia.org/w/api.php?action=query&generator=links&gpllimit=max&gplnamespace=0&format=json&titles=C64&prop=redirects&rdlimit=max
      // can possibly be combined into api fetch for all results, but not useful here, long list for each result and does not have any direct relation to searched page

      for (const property in this.resultsObject) {
        let redirectFrom = []

        for (let i = 0; i < redirectsArray.length; i++) {
          if (this.resultsObject[property].title === redirectsArray[i].to) {
            redirectFrom.push(redirectsArray[i].from)
            // break - do not break here, several possible!
          }
        }
        if (redirectFrom.length > 0) {
          redirectFrom.sort()
          this.resultsObject[property].redirectFrom = [...redirectFrom]
          redirectFrom = []
        }
      }

      this.$refs.inputForm.resetPageNumber()

      this.inputsDisabled = false
    },

    async getResultsCategories() {
      // with big pages this requires lots of api fetches, which makes up majority of the wait time

      // skip fetch when no results
      if (Object.keys(this.resultsObject).length > 0) {
        do {
          try {
            const response = await fetch(this.pageUrlCategories, {
              headers: this.fetchHeaders
            })

            if (!response.ok) {
              const message = `ERROR: ${response.status} ${response.statusText}`
              throw new Error(message)
            } else {
              this.jsonDataFullQueryPart = await response.json()

              // no console error on no result
              if (this.jsonDataFullQueryPart.query) {
                for (const property in this.jsonDataFullQueryPart.query.pages) {
                  if (
                    this.jsonDataFullQueryPart.query.pages[property].categories
                  ) {
                    if (!this.resultsObject[property].categories) {
                      this.resultsObject[property].categories = []
                    }

                    this.jsonDataFullQueryPart.query.pages[
                      property
                    ].categories.forEach((category) =>
                      this.resultsObject[property].categories.push(
                        category.title
                      )
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
                          this.$t('category-prefix')
                        )
                      ) {
                        this.resultsObject[property].categories[i] =
                          this.resultsObject[property].categories[i].substring(
                            this.$t('category-prefix').length
                          )
                      }
                    }
                  }
                }
              }
            }
          } catch (error) {
            throw new Error(error)
          }
        } while (this.jsonDataFullQueryPart.continue)

        // add emptycategory to objects without category for filter
        for (const property in this.resultsObject) {
          if (!this.resultsObject[property].categories) {
            this.resultsObject[property].categories = [this.$t('no-category')]
          }
        }
      }

      this.resultsCategoriesDone = true
    },

    async getMainInfo() {
      this.extract = ''
      this.returnedImage = ''
      this.returnedRedirect = ''
      this.titleMissing = true

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
          if (responseFull.query.pages[pageId].extract) {
            this.extract = responseFull.query.pages[pageId].extract
          }
          this.returnedTitle = responseFull.query.pages[pageId].title
          this.returnedUrl = responseFull.query.pages[pageId].fullurl

          if (responseFull.query.pages[pageId].missing !== '') {
            this.titleMissing = false
          }

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
      if (this.titleMissing === false) {
        this.getCategories()
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

            if (resultsArray[0].categories) {
              // ...query.pages has only one prop at this level equal to page id. -> array index [0]
              for (let i = 0; i < resultsArray[0].categories.length; i++) {
                this.categoriesArray.push(resultsArray[0].categories[i].title)
              }
            }
          }
        } catch (error) {
          throw new Error(error)
        }
      } while (this.categoriesQueryPart.continue)

      // filter "Category:" at beginning
      for (let i = 0; i < this.categoriesArray.length; i++) {
        // not sure it always starts with "Category:", check and only remove if it does
        if (this.categoriesArray[i].startsWith(this.$t('category-prefix'))) {
          this.categoriesArray[i] = this.categoriesArray[i].substring(
            this.$t('category-prefix').length
          )
        }
      }

      //sort - results seem sorted, but just to be sure
      this.categoriesArray.sort()
    },
    circleButtonClicked(index) {
      this.title = this.displayResultsArray[index].title

      this.getJson()
      this.getMainInfo()
    },
    fetchDataClicked(value) {
      if (value) {
        this.title = value

        this.getJson()
        this.getMainInfo()
      }
    },
    resultsCategoriesChanged(value) {
      this.resultsCategoriesEnabled = value
    },
    resultsRedirectsChanged(value) {
      this.resultsRedirectsEnabled = value
    },
    filterChanged(value) {
      this.filter = value
    },
    filterCategoriesChanged(value) {
      this.filterCategories = value
    },
    indexStartChanged(value) {
      this.indexStart = value
    },
    indexEndChanged(value) {
      this.indexEnd = value
    },
    resultsCategoriesCheckboxChanged(value) {
      this.checkedCategories = value
    },
    checkboxFilterEnabledChanged(value) {
      this.checkboxFilterEnabled = value
    },
    languageSwitched(value) {
      this.$i18n.locale = value
      this.language = value
    },
    scalingFactorChanged(value) {
      this.scalingFactor = parseFloat(value)
    },
    categoriesHoverClickChanged(value) {
      if (value === 'catshover') {
        this.categoriesOnHover = true
      } else {
        this.categoriesOnHover = false
      }
    }
  }
}
</script>

<style scoped></style>
