<template>
  <div class="page-flex-container" ref="flexcontainer">
    <input-form
      :inputs-disabled="inputsDisabled"
      :results-categories-done="resultsCategoriesDone"
      :filtered-results-array="filteredResultsArray"
      :results-categories-all-array-unfiltered="
        resultsCategoriesAllArrayUnfiltered
      "
      :parent-title="title"
      :mobile-mode="mobileMode"
      :checkbox-dirty="checkboxDirty"
      @fetchDataClicked="fetchDataClicked"
      @resultsCategoriesChanged="resultsCategoriesChanged"
      @resultsRedirectsChanged="resultsRedirectsChanged"
      @filterChanged="filterChanged"
      @filterCategoriesChanged="filterCategoriesChanged"
      @indexStartChanged="indexStartChanged"
      @indexEndChanged="indexEndChanged"
      @checkboxFilterEnabledChanged="checkboxFilterEnabledChanged"
      @languageSwitched="languageSwitched"
      @scalingFactorChanged="scalingFactorChanged"
      @circleButtonRadiusChanged="circleButtonRadiusChanged"
      @categoriesHoverClickChanged="categoriesHoverClickChanged"
      @gridWidthNocategoriesChanged="gridWidthNocategoriesChanged"
      @gridHeightChanged="gridHeightChanged"
      @modeSwitched="modeSwitched"
      @mobileDisplaySwitched="mobileDisplaySwitched"
      ref="inputForm"
    ></input-form>

    <div
      :class="{
        'grid-container':
          checkboxFilterEnabled && resultsCategoriesEnabled && !mobileMode,
        'grid-container-nocategories':
          (!checkboxFilterEnabled || !resultsCategoriesEnabled) && !mobileMode,
        'grid-container-mobile': mobileMode
      }"
      :style="{
        '--gridwidthnocategories': gridWidthNocategories + 'px',
        '--gridheightsubtract': gridHeightSubtract + 'px',
        '--gridmobileheight': scrollboxContainerHeight + 'px'
      }"
      ref="gridcontainer"
    >
      <div
        v-if="
          (!mobileMode && checkboxFilterEnabled) ||
          (mobileMode && mobileCategories)
        "
        class="inputcategoriescontainer"
        :class="{
          'grid-item-categories': !mobileMode,
          'grid-item-categories-mobile': mobileMode
        }"
        :style="{
          '--categoriesmobileheight': scrollboxContainerHeight + 'px'
        }"
        ref="inputcategoriescontainer"
      >
        <categories-checkbox-filter
          v-if="
            ((!mobileMode && resultsCategoriesEnabled) ||
              (mobileMode && mobileCategories)) &&
            resultsCategoriesAllArray.length > 0 &&
            resultsCategoriesDone
          "
          :items="resultsCategoriesAllArray"
          :root-height="scrollboxContainerHeight"
          :checked-init="checkedCategories"
          @resultsCategoriesCheckboxChanged="resultsCategoriesCheckboxChanged"
          @categoriesAll="categoriesAll"
          @categoriesNone="resultsCategoriesCheckboxChanged"
        ></categories-checkbox-filter>
      </div>

      <outgraph
        v-if="!mobileMode || (mobileMode && mobileOutgraph)"
        class="grid-item-graph"
        ref="outgraph"
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
        :circle-button-radius="circleButtonRadius"
        :categories-on-hover="categoriesOnHover"
        @circleButtonClicked="circleButtonClicked"
      ></outgraph>

      <main-title-info
        v-if="!mobileMode || (mobileMode && mobileMainInfo)"
        :class="{
          'grid-item-maininfo': !mobileMode,
          'grid-item-maininfo-mobile': mobileMode
        }"
        :extract="extract"
        :image="returnedImage"
      ></main-title-info>
    </div>
  </div>
</template>

<script>
import InputForm from './InputForm.vue'
import MainTitleInfo from './MainTitleInfo.vue'
import Outgraph from './Outgraph.vue'
import CategoriesCheckboxFilter from './CategoriesCheckboxFilter.vue'

export default {
  name: 'MainView',
  components: { InputForm, MainTitleInfo, Outgraph, CategoriesCheckboxFilter },
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
      circleButtonRadius: 260,
      categoriesOnHover: false,
      gridWidthNocategories: 1520,
      gridHeightSubtract: 0,
      scrollboxContainerHeight: 300,
      mobileMode: false,
      // enable one of these at a time in mobile mode
      mobileMainInfo: false,
      mobileCategories: false,
      mobileOutgraph: true,
      checkboxDirty: false
    }
  },

  // watch: {
  //   resultsCategoriesEnabled() {
  //     if (
  //       this.resultsCategoriesEnabled === true &&
  //       this.resultsCategoriesDone === false
  //     ) {
  //       this.getResultsCategories()
  //     }

  //     if (
  //       this.resultsCategoriesEnabled === true &&
  //       this.resultsCategoriesDone ===
  //     ) {
  //       this.checkedCategories = new Set(
  //         this.resultsCategoriesAllArrayUnfiltered
  //       )
  //     }
  //   }
  // },

  computed: {
    // scrollboxContainerHeight() {
    //   return this.$refs.inputcategoriescontainer.getBoundingClientRect().height
    // },

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
          ((!this.mobileMode && this.checkboxFilterEnabled) ||
            // (this.mobileMode && this.mobileCategories))
            this.mobileMode)
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
        ((!this.mobileMode && this.checkboxFilterEnabled) ||
          // (this.mobileMode && this.mobileCategories))
          this.mobileMode)
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
        this.resultsCategoriesEnabled

        // need to calc also with !this.checkboxFilterEnabled for switch to mobile
        // &&
        // ((!this.mobileMode && this.checkboxFilterEnabled) ||
        //   this.mobileMode)
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

      this.checkedCategories = new Set(this.resultsCategoriesAllArrayUnfiltered)
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

      if (this.resultsCategoriesEnabled && !this.resultsCategoriesDone) {
        this.getResultsCategories()
      }
      if (this.resultsCategoriesEnabled && this.resultsCategoriesDone) {
        this.checkedCategories = new Set(
          this.resultsCategoriesAllArrayUnfiltered
        )
      }

      if (!this.resultsCategoriesEnabled) {
        this.checkboxDirty = false
      }
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
      this.$refs.inputForm.resetPageNumber()
      this.checkboxDirty = true

      if (!this.checkboxFilterEnabled) {
        // enable in desktop when changed in mobile
        this.$refs.inputForm.setCheckboxFilterEnabled()
        this.checkboxFilterEnabled = true
      }

      this.checkedCategories = value
    },
    categoriesAll(value) {
      this.$refs.inputForm.resetPageNumber()
      this.checkboxDirty = false
      this.checkedCategories = value
    },
    checkboxFilterEnabledChanged(value) {
      // for switch from desktop to mobile
      if (!value) {
        this.checkedCategories = new Set(
          this.resultsCategoriesAllArrayUnfiltered
        )
      }

      this.checkboxFilterEnabled = value

      if (this.checkboxFilterEnabled) {
        this.checkedCategories = new Set(
          this.resultsCategoriesAllArrayUnfiltered
        )
      }

      if (!this.checkboxFilterEnabled) {
        this.checkboxDirty = false
      }
    },
    languageSwitched(value) {
      this.$i18n.locale = value
      this.language = value
    },
    scalingFactorChanged(value) {
      this.scalingFactor = parseFloat(value)
    },
    circleButtonRadiusChanged(value) {
      this.circleButtonRadius = parseInt(value)
    },
    categoriesHoverClickChanged(value) {
      if (value === 'catshover') {
        this.categoriesOnHover = true
      } else {
        this.categoriesOnHover = false
      }
    },
    gridWidthNocategoriesChanged(value) {
      this.gridWidthNocategories = value
    },
    gridHeightChanged(value) {
      this.gridHeightSubtract = value
    },
    modeSwitched(value) {
      if (value === 'mobile') {
        this.mobileMode = true
      } else {
        this.mobileMode = false
      }
      this.windowResized()
    },
    mobileDisplaySwitched(value) {
      switch (value) {
        case 'outgraph':
          this.mobileMainInfo = false
          this.mobileCategories = false
          this.mobileOutgraph = true
          break
        case 'maininfo':
          this.mobileOutgraph = false
          this.mobileCategories = false
          this.mobileMainInfo = true
          break
        case 'categories':
          this.mobileOutgraph = false
          this.mobileMainInfo = false
          this.mobileCategories = true
      }
    },
    windowResized() {
      this.$nextTick(() => {
        if (!this.mobileMode) {
          if (this.$refs.inputcategoriescontainer) {
            this.scrollboxContainerHeight =
              this.$refs.inputcategoriescontainer.getBoundingClientRect().height
          }
        } else {
          this.scrollboxContainerHeight =
            this.$refs.flexcontainer.getBoundingClientRect().height -
            this.gridHeightSubtract

          this.$refs.inputForm.windowResized()
        }
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
.inputcategoriescontainer {
  /* height temp till layout */
  /* height: 300px; */
  position: relative;
}
.page-flex-container {
  display: flex;
  /* flex-wrap: wrap; */
  /* justify-content: flex-start; */
  /* align-items: center; */
  /* align-content: space-around; */
  height: 100vh;

  /* only needed in mobile portrait mode - workaround scrollbars */
  overflow: hidden;
}

@media (orientation: landscape) {
  .page-flex-container {
    flex-direction: row;
  }
}

@media (orientation: portrait) {
  .page-flex-container {
    flex-direction: column;
  }
}

.grid-container {
  /* background-color: lightpink; */
  /* border: 1px solid black; */
  flex: 1 0 auto;
  display: grid;
  grid-template-columns: min-content minmax(320px, 1fr);
  grid-template-rows: min-content minmax(0, 1fr);
  /* height: 100%; */
  height: calc(100% - var(--gridheightsubtract));

  /* overflow-y: hidden; */
}

.grid-container-nocategories {
  /* background-color: lightpink; */
  /* border: 1px solid black; */
  flex: 1 0 auto;
  display: grid;
  grid-template-columns: var(--gridwidthnocategories);
  grid-template-rows: min-content minmax(0, 1fr);
  /* height: 100%; */
  height: calc(100% - var(--gridheightsubtract));

  /* overflow-y: hidden; */
}

.grid-container-mobile {
  /* background-color: lightpink; */
  /* border: 1px solid black; */
  flex: 1 0 auto;
  display: grid;
  grid-template-columns: var(--gridwidthnocategories);
  grid-template-rows: var(--gridmobileheight);
  /* grid-template-rows: minmax(0, 1fr); */
  /* height: 100%; */

  /* overflow-x: hidden; */

  /* overflow-y: hidden; */
}

/* .grid-item-graph, */
/* .grid-item-maininfo, */
/* .grid-item-categories { */
/* background-color: cadetblue; */
/* border: 1px solid black; */
/* } */

.grid-item-graph {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

.grid-item-categories {
  grid-column: 2 / 3;
  grid-row: 1 / 3;
}

.grid-item-maininfo {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  overflow-y: auto;
}

.grid-item-categories-mobile {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  height: var(--categoriesmobileheight);
}

.grid-item-maininfo-mobile {
  grid-column: 1 / 2;
  grid-row: 1 / 2;

  overflow-y: auto;
}
</style>
