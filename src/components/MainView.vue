<template>
  <div class="page-flex-container" ref="flexcontainer">
    <input-form
      :inputs-disabled="inputsDisabled"
      :results-categories-done="resultsCategoriesDone"
      :results-redirects-done="resultsRedirectsDone"
      :filtered-results-array-length="filteredResultsArray.length"
      :mobile-mode="inputFormState.mobileMode"
      :mobile-display="inputFormState.mobileDisplay"
      :number-of-pages="numberOfPages"
      :page-number="pageNumber"
      :index-start="indexStart"
      :index-end="indexEnd"
      v-model:scalingFactor="inputFormState.scalingFactor"
      v-model:filter="inputFormState.filter"
      v-model:filterCategories="inputFormState.filterCategories"
      v-model:title="inputFormState.title"
      v-model:showHelp="inputFormState.showHelp"
      v-model:resultsCategoriesEnabled="inputFormState.resultsCategoriesEnabled"
      v-model:checkboxFilterEnabled="inputFormState.checkboxFilterEnabled"
      v-model:resultsRedirectsEnabled="inputFormState.resultsRedirectsEnabled"
      v-model:sizePerPage="inputFormState.sizePerPage"
      v-model:scalingFactorSaved="inputFormState.scalingFactorSaved"
      v-model:circleButtonRadius="inputFormState.circleButtonRadius"
      v-model:circleButtonRadiusSaved="inputFormState.circleButtonRadiusSaved"
      @pageNumberChanged="pageNumberChanged"
      @update:title="fetchDataClicked"
      @update:showHelp="showHelpSwitched"
      @update:resultsCategoriesEnabled="resultsCategoriesChanged"
      @update:resultsRedirectsEnabled="resultsRedirectsChanged"
      @update:checkboxFilterEnabled="checkboxFilterEnabledChanged"
      @languageSwitched="languageSwitched"
      @categoriesHoverClickChanged="categoriesHoverClickChanged"
      @gridWidthNocategoriesChanged="gridWidthNocategoriesChanged"
      @gridHeightChanged="gridHeightChanged"
      @modeSwitched="modeSwitched"
      @mobileDisplaySwitched="mobileDisplaySwitched"
      ref="inputForm"
    ></input-form>

    <div
      v-if="!inputFormState.showHelp"
      class="grid-container-base"
      :class="{
        mobile: inputFormState.mobileMode,
        'grid-container':
          inputFormState.checkboxFilterEnabled &&
          inputFormState.resultsCategoriesEnabled &&
          !inputFormState.mobileMode,
        'grid-container-nocategories':
          (!inputFormState.checkboxFilterEnabled ||
            !inputFormState.resultsCategoriesEnabled) &&
          !inputFormState.mobileMode
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
          (!inputFormState.mobileMode &&
            inputFormState.checkboxFilterEnabled) ||
          (inputFormState.mobileMode &&
            inputFormState.mobileDisplay === 'categories')
        "
        class="inputcategoriescontainer grid-item-categories"
        :class="{
          mobile: inputFormState.mobileMode
        }"
        :style="{
          '--categoriesmobileheight': scrollboxContainerHeight + 'px'
        }"
        ref="inputcategoriescontainer"
      >
        <categories-checkbox-filter
          v-if="
            ((!inputFormState.mobileMode &&
              inputFormState.resultsCategoriesEnabled) ||
              (inputFormState.mobileMode &&
                inputFormState.mobileDisplay === 'categories')) &&
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
        v-if="
          !inputFormState.mobileMode ||
          (inputFormState.mobileMode &&
            inputFormState.mobileDisplay === 'outgraph')
        "
        class="grid-item-graph"
        ref="outgraph"
        :inputs-disabled="inputsDisabled"
        :title="titlePage.title"
        :url="titlePage.url"
        :results-redirects-enabled="inputFormState.resultsRedirectsEnabled"
        :redirects="titlePage.redirects"
        :display-results-array="displayResultsArray"
        :categories-array="titlePage.categories"
        :results-categories-enabled="inputFormState.resultsCategoriesEnabled"
        :results-categories-done="resultsCategoriesDone"
        :results-redirects-done="resultsRedirectsDone"
        :title-missing="titlePage.missing"
        :scaling-factor="inputFormState.scalingFactor"
        :circle-button-radius="inputFormState.circleButtonRadius"
        :categories-on-hover="inputFormState.categoriesOnHover"
        :redirects-done="redirectsDone"
        @circleButtonClicked="circleButtonClicked"
      ></outgraph>

      <main-title-info
        v-if="
          !inputFormState.mobileMode ||
          (inputFormState.mobileMode &&
            inputFormState.mobileDisplay === 'maininfo')
        "
        class="grid-item-maininfo"
        :class="{
          mobile: inputFormState.mobileMode
        }"
        :extract="titlePage.extract"
        :image="titlePage.image"
      ></main-title-info>
    </div>

    <div v-if="inputFormState.showHelp" class="help-container">
      <help></help>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
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
  setup() {
    // state of inputForm in composition API style
    const inputFormState = reactive({
      filter: '',
      filterCategories: '',
      title: '',
      showHelp: false,
      mobileMode: false,
      language: 'en',
      mobileDisplay: 'outgraph',
      resultsCategoriesEnabled: true,
      resultsRedirectsEnabled: false,
      checkboxFilterEnabled: true,
      categoriesOnHover: true,
      sizePerPage: 16,
      scalingFactor: 1.0,
      scalingFactorSaved: 1.0,
      circleButtonRadius: 260,
      circleButtonRadiusSaved: 260
    })
    return { inputFormState }
  },
  data() {
    return {
      checkedCategories: new Set(),
      resultsCategoriesDone: true,
      resultsRedirectsDone: true,
      inputsDisabled: false,

      // Api-User-Agent can be used instead of regular User-Agent (good practice, not always enforced by wikimedia)
      // User-Agent might not be possible to set in every browser
      fetchHeaders: new Headers({
        'Api-User-Agent': 'WikiExplorer/0.1',
        'User-Agent': 'WikiExplorer/0.1'
      }),
      gridWidthNocategories: 1520,
      gridHeightSubtract: 0,
      scrollboxContainerHeight: 300,
      titlePage: new TitlePage(),
      redirectsDone: false,
      pageNumber: 0
    }
  },
  computed: {
    indexStart() {
      let indexStart = this.pageNumber * this.inputFormState.sizePerPage
      if (indexStart > this.filteredResultsArray.length - 1) {
        indexStart = this.filteredResultsArray.length - 1
      }

      return indexStart
    },
    indexEnd() {
      let indexEnd = (this.pageNumber + 1) * this.inputFormState.sizePerPage - 1

      if (indexEnd > this.filteredResultsArray.length - 1) {
        indexEnd = this.filteredResultsArray.length - 1
      }

      if (indexEnd < 0) {
        indexEnd = 0
      }

      return indexEnd
    },
    numberOfPages() {
      return Math.ceil(
        this.filteredResultsArray.length / this.inputFormState.sizePerPage
      )
    },
    filteredResultsArray() {
      if (this.inputsDisabled) {
        return []
      }

      let filteredArray = Array.from(resultsMap.values())

      // apply titles filter
      filteredArray = filteredArray.filter((page) =>
        page.title
          .toLowerCase()
          .includes(this.inputFormState.filter.toLowerCase())
      )

      // good - maybe rewrite without ternary
      // needs to check this.inputFormState.filterCategories, otherwise -> when categoryfilter = '' this only shows pages, which have at least one non empty category!! and thereby ALSO excludes missing!
      if (
        this.inputFormState.resultsCategoriesEnabled &&
        this.resultsCategoriesDone &&
        this.inputFormState.filterCategories
      ) {
        filteredArray = filteredArray.filter((page) =>
          page.categories
            ? page.categories.find((item) =>
                item
                  .toLowerCase()
                  .includes(this.inputFormState.filterCategories.toLowerCase())
              )
            : null
        )
      }

      if (
        this.inputFormState.resultsCategoriesEnabled &&
        this.resultsCategoriesDone &&
        ((!this.inputFormState.mobileMode &&
          this.inputFormState.checkboxFilterEnabled) ||
          this.inputFormState.mobileMode)
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
          this.inputFormState.resultsCategoriesEnabled &&
          ((!this.inputFormState.mobileMode &&
            this.inputFormState.checkboxFilterEnabled) ||
            this.inputFormState.mobileMode)
        )
      ) {
        return []
      }
      let allCategoriesSet = new Set()

      for (const pageId of resultsMap.keys()) {
        const resultPage = resultsMap.get(pageId)
        if (
          resultPage.categories &&
          resultPage.title
            .toLowerCase()
            .includes(this.inputFormState.filter.toLowerCase())
        ) {
          resultPage.categories.forEach((category) =>
            // no duplicate check needed in Set
            category
              .toLowerCase()
              .includes(this.inputFormState.filterCategories.toLowerCase())
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
      if (
        !(
          this.resultsCategoriesDone &&
          this.inputFormState.resultsCategoriesEnabled
        )
      ) {
        return []
      }
      let allCategoriesSet = new Set()

      for (const pageId of resultsMap.keys()) {
        const resultPage = resultsMap.get(pageId)
        if (resultPage.categories) {
          // Set doesn't allow duplicate values, so no check needed
          resultPage.categories.forEach((category) =>
            allCategoriesSet.add(category)
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
      do {
        try {
          let pageUrl =
            'https://' +
            this.inputFormState.language +
            '.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&gplnamespace=0&format=json&titles=' +
            this.inputFormState.title +
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
        } catch (error) {
          // add error/display for user or similar
          console.error(`${error.name}: ${error.message}`)
        }
      } while (jsonDataFullQueryPart.continue)

      this.resultsCategoriesDone = false

      if (this.inputFormState.resultsCategoriesEnabled) {
        this.getResultsCategories()
      }

      this.resultsRedirectsDone = false

      if (this.inputFormState.resultsRedirectsEnabled) {
        this.getResultsRedirects()
      }

      this.pageNumber = 0

      this.inputsDisabled = false
    },

    async getResultsCategories() {
      // with big pages this requires lots of api fetches, which makes up majority of the wait time

      // skip fetch when no results
      if (resultsMap.size > 0) {
        do {
          try {
            // separate categories results fetch for major speedup compared to getting info and categories prop at same time (more redundant props to go through)

            let pageUrlCategories =
              'https://' +
              this.inputFormState.language +
              '.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&gplnamespace=0&format=json&titles=' +
              this.inputFormState.title +
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
          this.inputFormState.language +
          '.wikipedia.org/w/api.php?action=query&format=json&titles=' +
          this.inputFormState.title +
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
    async getResultsRedirects() {
      // skip fetch when no results
      if (resultsMap.size > 0) {
        let resultsPromises = new Map()

        // initial throttle value in ms
        const throttle = 20
        // number of retries with throttle doubled each time
        const retries = 10

        // parallelized fetching of redirects
        for (const pageId of resultsMap.keys()) {
          const resultPage = resultsMap.get(pageId)
          // don't fire too many at once -> 429/ratelimited
          await new Promise((resolve) => setTimeout(resolve, throttle))
          resultsPromises.set(
            pageId,
            this.getSingleRedirect(resultPage, throttle, retries)
          )
        }
        for (const pagePromise of resultsPromises.values()) {
          await pagePromise
        }
      }
      this.resultsRedirectsDone = true
    },

    // for parallelized fetching of redirects
    async getSingleRedirect(resultPage, throttle, retries) {
      let redirectsQueryPart = {}

      do {
        try {
          let redirectsUrl =
            'https://' +
            this.inputFormState.language +
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

          const response = await this.fetchRetry(
            redirectsUrl,
            {
              headers: this.fetchHeaders
            },
            retries,
            throttle
          )

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
    },

    async fetchRetry(url, options, retries, throttle) {
      // wiki returns cross origin request blocked, code 429, when too fast
      let response = ''
      try {
        response = await fetch(url, options)
        if (response.ok) {
          return response
        }
        // in case fetch does not throw (usually does not for regular 4xx 5xx errors, but wiki cross origin blocked with 429), but !response.ok
        // console.log('FETCH FAILED WITHOUT THROW')
        throw new NetworkError()
      } catch (error) {
        if (retries <= 1) {
          //empty on fetch throw
          let message = ''
          if (response) {
            message = `${response.status} ${response.statusText}`
          } else {
            message = 'API Fetch thrown. No status response.'
          }
          throw new NetworkError(message)
        }
        await new Promise((resolve) => setTimeout(resolve, throttle * 2))
        return await this.fetchRetry(url, options, retries - 1, throttle * 2)
      }
    },

    async getMainInfo() {
      this.titlePage.extract = ''
      this.titlePage.image = ''

      this.titlePage.missing = true
      try {
        let mainInfoUrl =
          'https://' +
          this.inputFormState.language +
          '.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|info|pageimages&piprop=original&exintro&redirects=1&indexpageids&inprop=url&titles=' +
          this.inputFormState.title +
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
            this.inputFormState.language +
            '.wikipedia.org/w/api.php?action=query&format=json&prop=categories&redirects&cllimit=max&clshow=!hidden&titles=' +
            this.inputFormState.title +
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
            this.inputFormState.language +
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
      this.inputFormState.title = this.displayResultsArray[index].title
      await this.getRedirectTarget()
      this.getMainInfo()
      this.getJson()
    },
    async fetchDataClicked(value) {
      if (value) {
        await this.getRedirectTarget()
        this.getMainInfo()
        this.getJson()
      }
    },
    resultsCategoriesChanged() {
      if (
        this.inputFormState.resultsCategoriesEnabled &&
        !this.resultsCategoriesDone
      ) {
        this.getResultsCategories()
      }
      if (
        this.inputFormState.resultsCategoriesEnabled &&
        this.resultsCategoriesDone
      ) {
        this.checkedCategories = new Set(
          this.resultsCategoriesAllArrayUnfiltered
        )
      }
    },
    resultsRedirectsChanged() {
      if (
        this.inputFormState.resultsRedirectsEnabled &&
        !this.resultsRedirectsDone
      ) {
        this.getResultsRedirects()
      }
    },
    pageNumberChanged(value) {
      this.pageNumber = value
    },
    resultsCategoriesCheckboxChanged(value) {
      this.pageNumber = 0

      if (!this.inputFormState.checkboxFilterEnabled) {
        // enable in desktop when changed in mobile
        this.inputFormState.checkboxFilterEnabled = true
      }

      this.checkedCategories = value
    },
    categoriesAll(value) {
      this.pageNumber = 0

      this.checkedCategories = value
    },
    checkboxFilterEnabledChanged() {
      // for switch from desktop to mobile
      if (!this.inputFormState.checkboxFilterEnabled) {
        this.checkedCategories = new Set(
          this.resultsCategoriesAllArrayUnfiltered
        )
      }

      if (this.inputFormState.checkboxFilterEnabled) {
        this.checkedCategories = new Set(
          this.resultsCategoriesAllArrayUnfiltered
        )
      }
    },
    languageSwitched(value) {
      this.$i18n.locale = value
      this.inputFormState.language = value
    },
    categoriesHoverClickChanged(value) {
      if (value === 'catshover') {
        this.inputFormState.categoriesOnHover = true
      } else {
        this.inputFormState.categoriesOnHover = false
      }
    },
    gridWidthNocategoriesChanged(value) {
      this.gridWidthNocategories = value
    },
    gridHeightChanged(value) {
      this.gridHeightSubtract = value
      // needed for init, first display, otherwise --gridmobileheight wrong
      if (this.inputFormState.mobileMode) {
        this.scrollboxContainerHeight =
          this.$refs.flexcontainer.getBoundingClientRect().height -
          this.gridHeightSubtract
      }
    },
    modeSwitched(value) {
      if (value === 'mobile') {
        this.inputFormState.mobileMode = true
      } else {
        this.inputFormState.mobileMode = false
      }
      this.windowResized()
    },
    mobileDisplaySwitched(value) {
      this.inputFormState.mobileDisplay = value
      this.windowResized()
    },
    showHelpSwitched() {
      this.inputsDisabled = this.inputFormState.showHelp
    },
    windowResized() {
      this.$nextTick(() => {
        if (!this.inputFormState.mobileMode) {
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
  position: relative;
}
.page-flex-container {
  display: flex;
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
  grid-template-columns: min-content minmax(320px, 1fr);
  grid-template-rows: min-content minmax(0, 1fr);
  height: calc(100% - var(--gridheightsubtract));
}

.grid-container-nocategories {
  grid-template-columns: var(--gridwidthnocategories);
  grid-template-rows: min-content minmax(0, 1fr);
  height: calc(100% - var(--gridheightsubtract));
}

.grid-container-base.mobile {
  grid-template-columns: var(--gridwidthnocategories);
  grid-template-rows: var(--gridmobileheight);
}

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
