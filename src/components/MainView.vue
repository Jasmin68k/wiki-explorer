<template>
  <div class="page-flex-container" ref="flexcontainer">
    <input-form
      :inputs-disabled="inputsDisabled"
      :results-categories-done="resultsCategoriesDone"
      :results-redirects-done="resultsRedirectsDone"
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
      @showHelpSwitched="showHelpSwitched"
      ref="inputForm"
    ></input-form>

    <div
      v-if="!showHelp"
      class="grid-container-base"
      :class="{
        mobile: mobileMode,
        'grid-container':
          checkboxFilterEnabled && resultsCategoriesEnabled && !mobileMode,
        'grid-container-nocategories':
          (!checkboxFilterEnabled || !resultsCategoriesEnabled) && !mobileMode
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
        class="inputcategoriescontainer grid-item-categories"
        :class="{
          mobile: mobileMode
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
        :title="titlePage.title"
        :url="titlePage.url"
        :results-redirects-enabled="resultsRedirectsEnabled"
        :redirects="titlePage.redirects"
        :display-results-array="displayResultsArray"
        :categories-array="titlePage.categories"
        :results-categories-enabled="resultsCategoriesEnabled"
        :results-categories-done="resultsCategoriesDone"
        :results-redirects-done="resultsRedirectsDone"
        :title-missing="titlePage.missing"
        :scaling-factor="scalingFactor"
        :circle-button-radius="circleButtonRadius"
        :categories-on-hover="categoriesOnHover"
        :redirects-done="redirectsDone"
        @circleButtonClicked="circleButtonClicked"
      ></outgraph>

      <main-title-info
        v-if="!mobileMode || (mobileMode && mobileMainInfo)"
        class="grid-item-maininfo"
        :class="{
          mobile: mobileMode
        }"
        :extract="titlePage.extract"
        :image="titlePage.image"
      ></main-title-info>
    </div>

    <div v-if="showHelp" class="help-container">
      <help></help>
    </div>
  </div>
</template>

<script>
import InputForm from './InputForm.vue'
import MainTitleInfo from './MainTitleInfo.vue'
import Outgraph from './Outgraph.vue'
import CategoriesCheckboxFilter from './CategoriesCheckboxFilter.vue'
import Help from './Help.vue'
import { Page, TitlePage } from '../datamodels.js'
import { NetworkError, DataError } from '../customerrors.js'

let resultsMap = new Map()
let jsonDataFullQueryPart = {}
let redirectTargetGlobal = ''

export default {
  name: 'MainView',
  components: {
    InputForm,
    MainTitleInfo,
    Outgraph,
    CategoriesCheckboxFilter,
    Help
  },
  data() {
    return {
      language: 'en',
      indexStart: 0,
      indexEnd: 0,
      title: '',
      filter: '',
      filterCategories: '',
      checkedCategories: new Set(),
      checkboxFilterEnabled: true,
      resultsCategoriesEnabled: true,
      resultsCategoriesDone: true,
      resultsRedirectsEnabled: false,
      resultsRedirectsDone: true,
      inputsDisabled: false,

      // Api-User-Agent can be used instead of regular User-Agent (good practice, not always enforced by wikimedia)
      // User-Agent might not be possible to set in every browser
      fetchHeaders: new Headers({
        'Api-User-Agent': 'WikiExplorer/0.1',
        'User-Agent': 'WikiExplorer/0.1'
      }),
      scalingFactor: 1.0,
      circleButtonRadius: 260,
      categoriesOnHover: true,
      gridWidthNocategories: 1520,
      gridHeightSubtract: 0,
      scrollboxContainerHeight: 300,
      mobileMode: false,
      // enable one of these at a time in mobile mode
      mobileMainInfo: false,
      mobileCategories: false,
      mobileOutgraph: true,
      checkboxDirty: false,
      titlePage: new TitlePage(),
      redirectsDone: false,
      showHelp: false
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

    filteredResultsArray() {
      if (this.inputsDisabled) {
        return []
      }

      let filteredArray = Array.from(resultsMap.values())

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
                item.toLowerCase().includes(this.filterCategories.toLowerCase())
              )
            : null
        )
      }

      if (
        this.resultsCategoriesEnabled &&
        this.resultsCategoriesDone &&
        ((!this.mobileMode && this.checkboxFilterEnabled) || this.mobileMode)
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
    },

    displayResultsArray() {
      if (this.inputsDisabled) {
        return []
      }
      return this.filteredResultsArray.slice(this.indexStart, this.indexEnd + 1)
    },
    resultsCategoriesAllArray() {
      if (
        !(
          this.resultsCategoriesDone &&
          this.resultsCategoriesEnabled &&
          ((!this.mobileMode && this.checkboxFilterEnabled) || this.mobileMode)
        )
      ) {
        return []
      }
      let allCategoriesSet = new Set()

      for (const pageId of resultsMap.keys()) {
        const resultPage = resultsMap.get(pageId)
        if (
          resultPage.categories &&
          resultPage.title.toLowerCase().includes(this.filter.toLowerCase())
        ) {
          resultPage.categories.forEach((category) =>
            !allCategoriesSet.has(category) &&
            category.toLowerCase().includes(this.filterCategories.toLowerCase())
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
    },
    resultsCategoriesAllArrayUnfiltered() {
      if (!(this.resultsCategoriesDone && this.resultsCategoriesEnabled)) {
        return []
      }
      let allCategoriesSet = new Set()

      for (const pageId of resultsMap.keys()) {
        const resultPage = resultsMap.get(pageId)
        if (resultPage.categories) {
          resultPage.categories.forEach((category) =>
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
    }
  },

  methods: {
    async getJson() {
      this.inputsDisabled = true

      resultsMap.clear()
      // const redirects = {}

      do {
        try {
          let pageUrl =
            'https://' +
            this.language +
            '.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&gplnamespace=0&format=json&titles=' +
            this.title +
            '&prop=info&inprop=url&origin=*'

          if (jsonDataFullQueryPart.continue) {
            for (const continueToken of Object.keys(
              jsonDataFullQueryPart.continue
            )) {
              pageUrl +=
                '&' +
                continueToken +
                '=' +
                jsonDataFullQueryPart.continue[continueToken]
            }
          }

          const response = await fetch(pageUrl, {
            headers: this.fetchHeaders
          })

          if (!response.ok) {
            const message = `${response.status} ${response.statusText}`
            throw new NetworkError(message)
          }
          jsonDataFullQueryPart = await response.json()

          if (!jsonDataFullQueryPart.query) {
            throw new DataError('No result from API')
          }

          for (const pageId of Object.keys(jsonDataFullQueryPart.query.pages)) {
            // ignore (sometimes) appearing title page in results
            if (
              !(
                jsonDataFullQueryPart.query.pages[pageId].title ===
                redirectTargetGlobal
              )
            ) {
              if (jsonDataFullQueryPart.query.pages[pageId].missing !== '') {
                resultsMap.set(
                  pageId,
                  new Page({
                    title: jsonDataFullQueryPart.query.pages[pageId].title,
                    url: jsonDataFullQueryPart.query.pages[pageId].fullurl,
                    pageid: jsonDataFullQueryPart.query.pages[pageId].pageid,
                    missing: false
                  })
                )
              } else {
                resultsMap.set(
                  pageId,
                  new Page({
                    title: jsonDataFullQueryPart.query.pages[pageId].title,
                    url: jsonDataFullQueryPart.query.pages[pageId].fullurl,
                    // in case of missing page jsonDataFullQueryPart.query.pages[pageId].pageid does not exist,
                    // which is otherwise identical to pageId.
                    // the values for pageId for all missing pages are consecutive negative integers starting at -1,
                    // which naturally do not reference an actual Wikipedia page, but are assigned here to
                    // Page's pageid to make it unique, too.
                    pageid: pageId
                  })
                )
              }
            }
          }

          // if (!jsonDataFullQueryPart.query.redirects) {
          //   continue
          // }

          // for (const redirect of jsonDataFullQueryPart.query.redirects) {
          //   redirects[redirect.from] = redirect
          // }
        } catch (error) {
          // add error/display for user or similar
          console.error(`${error.name}: ${error.message}`)
        }
      } while (jsonDataFullQueryPart.continue)

      // const redirectsArray = Object.values(redirects)

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

      // for (const pageId of resultsMap.keys()) {
      //   const resultPage = resultsMap.get(pageId)
      //   let redirectFrom = []

      //   for (let i = 0; i < redirectsArray.length; i++) {
      //     if (resultPage.title === redirectsArray[i].to) {
      //       redirectFrom.push(redirectsArray[i].from)
      //       // break - do not break here, several possible!
      //     }
      //   }
      //   if (redirectFrom.length > 0) {
      //     redirectFrom.sort()
      //     resultPage.redirects = [...redirectFrom]
      //     redirectFrom = []
      //   }
      // }

      this.resultsRedirectsDone = false

      if (this.resultsRedirectsEnabled) {
        this.getResultsRedirects()
      }

      this.$refs.inputForm.resetPageNumber()

      this.inputsDisabled = false
    },

    async getResultsCategories() {
      // with big pages this requires lots of api fetches, which makes up majority of the wait time

      // skip fetch when no results
      if (resultsMap.size > 0) {
        do {
          try {
            // separate categories results fetch for major speedup compared to getting info and categories prop at same time (more redundant props to go through)

            // remove redirects and use proper redirecttarget for title
            let pageUrlCategories =
              'https://' +
              this.language +
              '.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&gplnamespace=0&format=json&titles=' +
              this.title +
              '&prop=categories&cllimit=max&clshow=!hidden&origin=*'

            if (jsonDataFullQueryPart.continue) {
              for (const continueToken of Object.keys(
                jsonDataFullQueryPart.continue
              )) {
                pageUrlCategories +=
                  '&' +
                  continueToken +
                  '=' +
                  jsonDataFullQueryPart.continue[continueToken]
              }
            }

            const response = await fetch(pageUrlCategories, {
              headers: this.fetchHeaders
            })

            if (!response.ok) {
              const message = `${response.status} ${response.statusText}`
              throw new NetworkError(message)
            }
            jsonDataFullQueryPart = await response.json()

            if (!jsonDataFullQueryPart.query) {
              throw new DataError('No result from API')
            }

            for (const pageId of Object.keys(
              jsonDataFullQueryPart.query.pages
            )) {
              const page = jsonDataFullQueryPart.query.pages[pageId]

              // ignore possibly non existing (ignored before) title page in results
              if (!(page.title === redirectTargetGlobal)) {
                const resultPage = resultsMap.get(pageId)
                if (page.categories) {
                  // if (!resultPage.categories) {
                  //   resultPage.categories = []
                  // }

                  page.categories.forEach((category) =>
                    resultPage.categories.push(category.title)
                  )

                  // filter "Category:" at beginning
                  for (let i = 0; i < resultPage.categories.length; i++) {
                    // not sure it always starts with "Category:", check and only remove if it does
                    if (
                      resultPage.categories[i].startsWith(
                        this.$t('category-prefix')
                      )
                    ) {
                      resultPage.categories[i] = resultPage.categories[
                        i
                      ].substring(this.$t('category-prefix').length)
                    }
                  }
                }
              }
            }
          } catch (error) {
            // add error/display for user or similar
            console.error(error.message)
          }
        } while (jsonDataFullQueryPart.continue)

        // add emptycategory to objects without category for filter
        for (const pageId of resultsMap.keys()) {
          const resultPage = resultsMap.get(pageId)
          if (resultPage.categories.length === 0) {
            resultPage.categories = [this.$t('no-category')]
          }
        }
      }

      this.resultsCategoriesDone = true

      this.checkedCategories = new Set(this.resultsCategoriesAllArrayUnfiltered)
    },

    async getRedirectTarget() {
      try {
        let redirectTargetUrl =
          'https://' +
          this.language +
          '.wikipedia.org/w/api.php?action=query&format=json&titles=' +
          this.title +
          '&redirects&origin=*'

        const response = await fetch(redirectTargetUrl, {
          headers: this.fetchHeaders
        })
        // ok = true on http 200-299 good response
        if (!response.ok) {
          const message = `${response.status} ${response.statusText}`
          throw new NetworkError(message)
        }

        const redirectFull = await response.json()

        if (redirectFull.query.pages) {
          const pageId = Object.keys(redirectFull.query.pages)[0]
          redirectTargetGlobal = redirectFull.query.pages[pageId].title
        }
      } catch (error) {
        // add error/display for user or similar
        console.error(error.message)
      }
    },

    // this faster method doesn't get all redirects - seems to skip ones which are redirects and not original names in title page
    // async getResultsRedirects() {
    //   // skip fetch when no results
    //   if (resultsMap.size > 0) {
    //     let redirectsQueryPart = {}

    //     do {
    //       try {
    //         let redirectsUrl =
    //           'https://' +
    //           this.language +
    //           '.wikipedia.org/w/api.php?action=query&generator=links&gpllimit=max&gplnamespace=0&format=json&prop=redirects&rdlimit=max&titles=' +
    //           redirectTargetGlobal +
    //           '&origin=*'

    //         if (redirectsQueryPart.continue) {
    //           for (const continueToken of Object.keys(
    //             redirectsQueryPart.continue
    //           )) {
    //             redirectsUrl +=
    //               '&' +
    //               continueToken +
    //               '=' +
    //               redirectsQueryPart.continue[continueToken]
    //           }
    //         }

    //         const response = await fetch(redirectsUrl, {
    //           headers: this.fetchHeaders
    //         })

    //         // ok = true on http 200-299 good response
    //         if (!response.ok) {
    //           const message = `${response.status} ${response.statusText}`
    //           throw new NetworkError(message)
    //         }
    //         redirectsQueryPart = await response.json()

    //         if (!redirectsQueryPart.query) {
    //           throw new DataError('No result from API')
    //         }

    //         for (const pageId of Object.keys(redirectsQueryPart.query.pages)) {
    //           const page = redirectsQueryPart.query.pages[pageId]

    //           // ignore possibly non existing (ignored before) title page in results
    //           if (!(page.title === redirectTargetGlobal)) {
    //             const resultPage = resultsMap.get(pageId)
    //             if (page.redirects) {
    //               page.redirects.forEach((redirect) =>
    //                 resultPage.redirects.push(redirect.title)
    //               )
    //             }
    //           }
    //         }
    //       } catch (error) {
    //         // add error/display for user or similar
    //         console.error(error.message)
    //       }
    //     } while (redirectsQueryPart.continue)

    //     //sort
    //     for (const pageId of resultsMap.keys()) {
    //       const resultPage = resultsMap.get(pageId)
    //       resultPage.redirects.sort()
    //     }
    //   }
    //   this.resultsRedirectsDone = true
    // },

    async getResultsRedirects() {
      // skip fetch when no results
      if (resultsMap.size > 0) {
        for (const pageId of resultsMap.keys()) {
          const resultPage = resultsMap.get(pageId)

          let redirectsQueryPart = {}

          do {
            try {
              let redirectsUrl =
                'https://' +
                this.language +
                '.wikipedia.org/w/api.php?action=query&prop=redirects&format=json&rdlimit=max&titles=' +
                resultPage.title +
                '&origin=*'
              if (redirectsQueryPart.continue) {
                for (const continueToken of Object.keys(
                  redirectsQueryPart.continue
                )) {
                  redirectsUrl +=
                    '&' +
                    continueToken +
                    '=' +
                    redirectsQueryPart.continue[continueToken]
                }
              }

              const response = await fetch(redirectsUrl, {
                headers: this.fetchHeaders
              })

              // ok = true on http 200-299 good response
              if (!response.ok) {
                const message = `${response.status} ${response.statusText}`
                throw new NetworkError(message)
              }
              redirectsQueryPart = await response.json()

              let resultsArray = Object.values(redirectsQueryPart.query.pages)

              if (!resultsArray[0].redirects) {
                continue
              }

              // ...query.pages has only one prop at this level equal to page id. -> array index [0]
              for (let i = 0; i < resultsArray[0].redirects.length; i++) {
                resultPage.redirects.push(resultsArray[0].redirects[i].title)
              }
            } catch (error) {
              // add error/display for user or similar
              console.error(error.message)
            }
          } while (redirectsQueryPart.continue)

          //sort
          resultPage.redirects.sort()
        }
      }
      this.resultsRedirectsDone = true
    },

    async getMainInfo() {
      this.titlePage.extract = ''
      this.titlePage.image = ''

      this.titlePage.missing = true
      // let redirectTarget = ''
      try {
        let mainInfoUrl =
          'https://' +
          this.language +
          '.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|info|pageimages&piprop=original&exintro&redirects=1&indexpageids&inprop=url&titles=' +
          this.title +
          '&origin=*'

        const response = await fetch(mainInfoUrl, {
          headers: this.fetchHeaders
        })

        // ok = true on http 200-299 good response
        if (!response.ok) {
          const message = `${response.status} ${response.statusText}`
          throw new NetworkError(message)
        }
        // add error handling
        const responseFull = await response.json()
        const pageId = responseFull.query.pageids[0]
        if (responseFull.query.pages[pageId].extract) {
          this.titlePage.extract = responseFull.query.pages[pageId].extract
        }
        this.titlePage.title = responseFull.query.pages[pageId].title
        this.titlePage.url = responseFull.query.pages[pageId].fullurl
        this.titlePage.pageid = pageId

        if (responseFull.query.pages[pageId].missing !== '') {
          this.titlePage.missing = false
        }

        // if (responseFull.query.redirects) {
        //   if (responseFull.query.redirects[0].to) {
        //     redirectTarget = responseFull.query.redirects[0].to
        //   }
        // } else {
        //   redirectTarget = this.title
        // }

        // check if image exists
        if (
          (this.titlePage.image = responseFull.query.pages[pageId].original)
        ) {
          this.titlePage.image =
            responseFull.query.pages[pageId].original.source
        }
      } catch (error) {
        // add error/display for user or similar
        console.error(error.message)
      }

      this.redirectsDone = false

      if (!this.titlePage.missing) {
        this.getCategories()
        this.getRedirects()
      }
    },
    async getCategories() {
      this.titlePage.categories = []

      let categoriesQueryPart = {}

      do {
        try {
          // separate categories fetch, instead of adding to main info, for simple continue handling
          let categoriesUrl =
            'https://' +
            this.language +
            '.wikipedia.org/w/api.php?action=query&format=json&prop=categories&redirects&cllimit=max&clshow=!hidden&titles=' +
            this.title +
            '&origin=*'

          if (categoriesQueryPart.continue) {
            for (const continueToken of Object.keys(
              categoriesQueryPart.continue
            )) {
              categoriesUrl +=
                '&' +
                continueToken +
                '=' +
                categoriesQueryPart.continue[continueToken]
            }
          }

          const response = await fetch(categoriesUrl, {
            headers: this.fetchHeaders
          })

          // ok = true on http 200-299 good response
          if (!response.ok) {
            const message = `${response.status} ${response.statusText}`
            throw new NetworkError(message)
          }
          categoriesQueryPart = await response.json()

          let resultsArray = Object.values(categoriesQueryPart.query.pages)

          if (!resultsArray[0].categories) {
            continue
          }
          // ...query.pages has only one prop at this level equal to page id. -> array index [0]
          for (let i = 0; i < resultsArray[0].categories.length; i++) {
            this.titlePage.categories.push(resultsArray[0].categories[i].title)
          }
        } catch (error) {
          // add error/display for user or similar
          console.error(error.message)
        }
      } while (categoriesQueryPart.continue)

      // filter "Category:" at beginning
      for (let i = 0; i < this.titlePage.categories.length; i++) {
        // not sure it always starts with "Category:", check and only remove if it does
        if (
          this.titlePage.categories[i].startsWith(this.$t('category-prefix'))
        ) {
          this.titlePage.categories[i] = this.titlePage.categories[i].substring(
            this.$t('category-prefix').length
          )
        }
      }

      //sort - results seem sorted, but just to be sure
      this.titlePage.categories.sort()
    },

    async getRedirects() {
      this.titlePage.redirects = []
      let redirectsQueryPart = {}

      do {
        try {
          let redirectsUrl =
            'https://' +
            this.language +
            '.wikipedia.org/w/api.php?action=query&prop=redirects&format=json&rdlimit=max&titles=' +
            redirectTargetGlobal +
            '&origin=*'
          if (redirectsQueryPart.continue) {
            for (const continueToken of Object.keys(
              redirectsQueryPart.continue
            )) {
              redirectsUrl +=
                '&' +
                continueToken +
                '=' +
                redirectsQueryPart.continue[continueToken]
            }
          }

          const response = await fetch(redirectsUrl, {
            headers: this.fetchHeaders
          })

          // ok = true on http 200-299 good response
          if (!response.ok) {
            const message = `${response.status} ${response.statusText}`
            throw new NetworkError(message)
          }
          redirectsQueryPart = await response.json()

          let resultsArray = Object.values(redirectsQueryPart.query.pages)

          if (!resultsArray[0].redirects) {
            continue
          }
          // ...query.pages has only one prop at this level equal to page id. -> array index [0]
          for (let i = 0; i < resultsArray[0].redirects.length; i++) {
            this.titlePage.redirects.push(resultsArray[0].redirects[i].title)
          }
        } catch (error) {
          // add error/display for user or similar
          console.error(error.message)
        }
      } while (redirectsQueryPart.continue)

      //sort
      this.titlePage.redirects.sort()
      this.redirectsDone = true
    },

    async circleButtonClicked(index) {
      this.title = this.displayResultsArray[index].title
      await this.getRedirectTarget()
      this.getMainInfo()
      this.getJson()
    },
    async fetchDataClicked(value) {
      if (value) {
        this.title = value
        await this.getRedirectTarget()
        this.getMainInfo()
        this.getJson()
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

      if (this.resultsRedirectsEnabled && !this.resultsRedirectsDone) {
        this.getResultsRedirects()
      }
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
      // needed for init, first display, otherwise --gridmobileheight wrong
      if (this.mobileMode) {
        this.scrollboxContainerHeight =
          this.$refs.flexcontainer.getBoundingClientRect().height -
          this.gridHeightSubtract
      }
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
      this.windowResized()
    },
    showHelpSwitched(value) {
      // this.windowResized()
      this.inputsDisabled = value
      this.showHelp = value
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

.grid-container-base {
  flex: 1 0 auto;
  display: grid;
}

.grid-container {
  /* background-color: lightpink; */
  /* border: 1px solid black; */
  grid-template-columns: min-content minmax(320px, 1fr);
  grid-template-rows: min-content minmax(0, 1fr);
  /* height: 100%; */
  height: calc(100% - var(--gridheightsubtract));

  /* overflow-y: hidden; */
}

.grid-container-nocategories {
  /* background-color: lightpink; */
  /* border: 1px solid black; */
  grid-template-columns: var(--gridwidthnocategories);
  grid-template-rows: min-content minmax(0, 1fr);
  /* height: 100%; */
  height: calc(100% - var(--gridheightsubtract));

  /* overflow-y: hidden; */
}

.grid-container-base.mobile {
  /* background-color: lightpink; */
  /* border: 1px solid black; */
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

.grid-item-categories.mobile {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  height: var(--categoriesmobileheight);
}

.grid-item-maininfo.mobile {
  grid-column: 1 / 2;
  grid-row: 1 / 2;

  overflow-y: auto;
}
.help-container {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  width: 100%;
  overflow-y: auto;
}
</style>
