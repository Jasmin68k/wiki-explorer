<template>
  <div
    class="inputform-flex-container"
    :class="{
      mobile: global.state.mobileMode
    }"
  >
    <div
      id="item1"
      :class="{
        mobile: global.state.mobileMode
      }"
    >
      <form>
        <input
          class="radiobutton"
          type="radio"
          id="en"
          value="en"
          :disabled="
            !global.state.showHelp &&
            (global.state.inputsDisabled ||
              (global.state.resultsCategoriesEnabled &&
                !global.state.resultsCategoriesDone))
          "
          @change="languageSwitched($event.target.value)"
          ref="langEn"
        />
        <label
          class="radiolabel"
          :class="{
            itemdisabled:
              !global.state.showHelp &&
              (global.state.inputsDisabled ||
                (global.state.resultsCategoriesEnabled &&
                  !global.state.resultsCategoriesDone))
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
            !global.state.showHelp &&
            (global.state.inputsDisabled ||
              (global.state.resultsCategoriesEnabled &&
                !global.state.resultsCategoriesDone))
          "
          @change="languageSwitched($event.target.value)"
          ref="langDe"
        />
        <label
          class="radiolabel"
          :class="{
            itemdisabled:
              !global.state.showHelp &&
              (global.state.inputsDisabled ||
                (global.state.resultsCategoriesEnabled &&
                  !global.state.resultsCategoriesDone))
          }"
          for="de"
          ><img class="flagicon" src="../assets/images/de-flag.svg"
        /></label>
      </form>
    </div>
    <div
      id="item2"
      :class="{
        mobile: global.state.mobileMode
      }"
    >
      <form class="inputform" @submit.prevent="fetchData">
        <input
          type="text"
          id="title"
          class="searchinputarea"
          :placeholder="$t('search-on-wikipedia')"
          :value="global.state.title"
          @input="titleChanged($event.target.value)"
          :disabled="
            global.state.inputsDisabled ||
            (global.state.resultsCategoriesEnabled &&
              !global.state.resultsCategoriesDone)
          "
        />
        <button
          class="searchbutton"
          type="submit"
          :disabled="
            global.state.inputsDisabled ||
            (global.state.resultsCategoriesEnabled &&
              !global.state.resultsCategoriesDone)
          "
        >
          <img
            class="searchiconsmall"
            :class="{
              itemdisabled:
                global.state.inputsDisabled ||
                (global.state.resultsCategoriesEnabled &&
                  !global.state.resultsCategoriesDone)
            }"
            src="../assets/images/search.svg"
          />
        </button>
      </form>
    </div>

    <div
      id="item3"
      :class="{
        mobile: global.state.mobileMode
      }"
    >
      <form class="inputform" @submit.prevent="">
        <label for="filter"
          ><img class="titleiconsmall" src="../assets/images/text-tool.svg"
        /></label>
        <input
          type="text"
          id="filter"
          class="titleinputarea"
          :placeholder="$t('filter-results-titles')"
          :value="global.state.filter"
          @input="resetFirstItem(), filterChanged($event.target.value)"
          :disabled="
            global.state.inputsDisabled ||
            (global.state.mobileMode &&
              global.state.mobileDisplay === 'maininfo')
          "
        />
      </form>
    </div>
    <div
      id="item4"
      :class="{
        mobile: global.state.mobileMode
      }"
    >
      <form class="inputform" @submit.prevent="">
        <label for="filterCategories">
          <img
            class="categoriesiconsmall"
            src="../assets/images/document.svg"
          />
        </label>
        <input
          type="text"
          id="filterCategories"
          class="categoriesinputarea"
          :placeholder="$t('filter-results-categories')"
          :value="global.state.filterCategories"
          @input="
            resetFirstItem(), filterCategoriesChanged($event.target.value)
          "
          :disabled="
            global.state.inputsDisabled ||
            !global.state.resultsCategoriesDone ||
            !global.state.resultsCategoriesEnabled ||
            (global.state.mobileMode &&
              global.state.mobileDisplay === 'maininfo')
          "
        />
      </form>
    </div>

    <div
      id="item5"
      :class="{
        mobile: global.state.mobileMode
      }"
      v-if="global.state.mobileMode"
    >
      <input
        class="radiobutton"
        type="radio"
        :disabled="global.state.showHelp"
        id="outgraph"
        value="outgraph"
        :checked="global.state.mobileDisplay === 'outgraph'"
        @change="mobileDisplaySwitched($event.target.value)"
      />
      <label
        class="radiolabel"
        for="outgraph"
        :class="{ itemdisabled: global.state.showHelp }"
        ><img class="graphicon" src="../assets/images/analytics-graph.svg"
      /></label>
      <input
        class="radiobutton"
        type="radio"
        :disabled="global.state.showHelp || global.state.showCatsRedir"
        id="maininfo"
        value="maininfo"
        :checked="global.state.mobileDisplay === 'maininfo'"
        @change="mobileDisplaySwitched($event.target.value)"
      />
      <label
        class="radiolabel"
        for="maininfo"
        :class="{
          itemdisabled: global.state.showHelp || global.state.showCatsRedir
        }"
        ><img class="titleicon" src="../assets/images/text-tool.svg"
      /></label>
      <input
        class="radiobutton"
        type="radio"
        :disabled="
          global.state.showHelp ||
          global.state.showCatsRedir ||
          (global.state.mobileMode && !global.state.resultsCategoriesEnabled)
        "
        id="categories"
        value="categories"
        :checked="global.state.mobileDisplay === 'categories'"
        @change="mobileDisplaySwitched($event.target.value)"
      />
      <label
        class="radiolabel"
        for="categories"
        :class="{
          itemdisabled:
            global.state.showHelp ||
            global.state.showCatsRedir ||
            (global.state.mobileMode && !global.state.resultsCategoriesEnabled)
        }"
      >
        <img class="checkboxfiltericon" src="../assets/images/document2.svg" />
      </label>
    </div>
    <div
      id="item6"
      :class="{
        mobile: global.state.mobileMode
      }"
    >
      <span>
        <input
          id="resultsCategories"
          class="checkbox"
          type="checkbox"
          :checked="global.state.resultsCategoriesEnabled"
          :disabled="
            global.state.inputsDisabled ||
            (global.state.mobileMode &&
              (global.state.mobileDisplay === 'maininfo' ||
                global.state.mobileDisplay === 'categories'))
          "
          @change="resultsCategoriesChanged($event.target.checked)"
        />
        <label
          class="checkboxlabel"
          :class="{
            itemdisabled:
              (global.state.mobileMode && global.state.showCatsRedir) ||
              global.state.inputsDisabled ||
              (global.state.mobileMode &&
                (global.state.mobileDisplay === 'maininfo' ||
                  global.state.mobileDisplay === 'categories'))
          }"
          for="resultsCategories"
        >
          <img class="categoriesicon" src="../assets/images/document.svg" />
        </label>
      </span>
      <span v-if="!global.state.mobileMode">
        <input
          id="checkboxFilter"
          class="checkbox"
          type="checkbox"
          :checked="global.state.checkboxFilterEnabled"
          :disabled="
            (global.state.mobileMode && global.state.showCatsRedir) ||
            global.state.inputsDisabled ||
            !global.state.resultsCategoriesEnabled
          "
          @change="checkboxFilterEnabledChanged($event.target.checked)"
        />
        <label
          class="checkboxlabel"
          :class="{
            itemdisabled:
              global.state.inputsDisabled ||
              !global.state.resultsCategoriesEnabled
          }"
          for="checkboxFilter"
        >
          <img
            class="checkboxfiltericon"
            :class="{
              itemdisabled:
                global.state.inputsDisabled ||
                !global.state.resultsCategoriesEnabled
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
            global.state.inputsDisabled ||
            (global.state.mobileMode &&
              (global.state.mobileDisplay === 'maininfo' ||
                global.state.mobileDisplay === 'categories'))
          "
          :checked="global.state.resultsRedirectsEnabled"
          @change="resultsRedirectsChanged($event.target.checked)"
        />
        <label
          class="checkboxlabel"
          :class="{
            itemdisabled:
              global.state.inputsDisabled ||
              (global.state.mobileMode &&
                (global.state.mobileDisplay === 'maininfo' ||
                  global.state.mobileDisplay === 'categories'))
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
    <div v-if="!global.state.mobileMode" id="item7">
      <form>
        <input
          class="radiobutton"
          type="radio"
          id="catsclick"
          value="catsclick"
          :disabled="
            global.state.inputsDisabled ||
            (global.state.resultsCategoriesEnabled &&
              !global.state.resultsCategoriesDone) ||
            (global.state.mobileMode &&
              (global.state.mobileDisplay === 'maininfo' ||
                global.state.mobileDisplay === 'categories'))
          "
          ref="catsClick"
          @change="categoriesOnHoverOrClickChanged($event.target.value)"
        />
        <label
          class="radiolabel"
          :class="{
            itemdisabled:
              global.state.inputsDisabled ||
              (global.state.resultsCategoriesEnabled &&
                !global.state.resultsCategoriesDone) ||
              (global.state.mobileMode &&
                (global.state.mobileDisplay === 'maininfo' ||
                  global.state.mobileDisplay === 'categories'))
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
            global.state.inputsDisabled ||
            (global.state.resultsCategoriesEnabled &&
              !global.state.resultsCategoriesDone) ||
            (global.state.mobileMode &&
              (global.state.mobileDisplay === 'maininfo' ||
                global.state.mobileDisplay === 'categories'))
          "
          ref="catsHover"
          @change="categoriesOnHoverOrClickChanged($event.target.value)"
        />
        <label
          class="radiolabel"
          :class="{
            itemdisabled:
              global.state.inputsDisabled ||
              (global.state.resultsCategoriesEnabled &&
                !global.state.resultsCategoriesDone) ||
              (global.state.mobileMode &&
                (global.state.mobileDisplay === 'maininfo' ||
                  global.state.mobileDisplay === 'categories'))
          }"
          for="catshover"
          ><img class="hovericon" src="../assets/images/mouse-hover.svg"
        /></label>
      </form>
    </div>

    <div
      id="item8"
      :class="{
        mobile: global.state.mobileMode
      }"
    >
      <form>
        <input
          class="radiobutton"
          type="radio"
          id="search"
          value="search"
          :disabled="global.state.inputsDisabled"
          @change="buttonModeSwitched($event.target.value)"
          ref="search"
        />
        <label
          class="radiolabel"
          :class="{
            itemdisabled: global.state.inputsDisabled
          }"
          for="search"
          ><img class="searchicon" src="../assets/images/search.svg"
        /></label>
        <input
          class="radiobutton"
          type="radio"
          id="catsredir"
          value="catsredir"
          :disabled="
            global.state.inputsDisabled ||
            (global.state.resultsCategoriesEnabled &&
              !global.state.resultsCategoriesDone) ||
            (global.state.resultsRedirectsEnabled &&
              !global.state.resultsRedirectsDone)
          "
          @change="buttonModeSwitched($event.target.value)"
          ref="catsredir"
        />
        <label
          class="radiolabel"
          :class="{
            itemdisabled:
              global.state.inputsDisabled ||
              (global.state.resultsCategoriesEnabled &&
                !global.state.resultsCategoriesDone) ||
              (global.state.resultsRedirectsEnabled &&
                !global.state.resultsRedirectsDone) ||
              (!global.state.resultsCategoriesEnabled &&
                !global.state.resultsRedirectsEnabled)
          }"
          for="catsredir"
        >
          <div class="catsredircontainer">
            <img class="catsrediricon" src="../assets/images/document.svg" />
            <img
              class="catsrediricon"
              src="../assets/images/forward-hand-drawn-arrow-pointing-to-right.svg"
            />
          </div>
        </label>
        <input
          class="radiobutton"
          type="radio"
          id="wiki"
          value="wiki"
          :disabled="global.state.inputsDisabled"
          @change="buttonModeSwitched($event.target.value)"
          ref="wiki"
        />
        <label
          class="radiolabel"
          :class="{
            itemdisabled: global.state.inputsDisabled
          }"
          for="wiki"
        >
          <div class="wikipediaiconcontainer">
            <img
              class="wikipediaiconsmall"
              src="../assets/images/wikipedia.svg"
            />
          </div>
        </label>
      </form>
    </div>

    <div
      id="item9"
      :class="{
        mobile: global.state.mobileMode
      }"
    >
      <form>
        <input
          class="radiobutton"
          type="radio"
          id="desktop"
          value="desktop"
          :checked="!global.state.mobileMode"
          :disabled="
            !global.state.showHelp &&
            (global.state.inputsDisabled ||
              (global.state.resultsCategoriesEnabled &&
                !global.state.resultsCategoriesDone))
          "
          @change="modeSwitched($event.target.value)"
        />
        <label
          class="radiolabel"
          :class="{
            itemdisabled:
              !global.state.showHelp &&
              (global.state.inputsDisabled ||
                (global.state.resultsCategoriesEnabled &&
                  !global.state.resultsCategoriesDone))
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
          :checked="global.state.mobileMode"
          :disabled="
            !global.state.showHelp &&
            (global.state.inputsDisabled ||
              (global.state.resultsCategoriesEnabled &&
                !global.state.resultsCategoriesDone))
          "
          @change="modeSwitched($event.target.value)"
        />

        <label
          class="radiolabel"
          :class="{
            itemdisabled:
              !global.state.showHelp &&
              (global.state.inputsDisabled ||
                (global.state.resultsCategoriesEnabled &&
                  !global.state.resultsCategoriesDone))
          }"
          for="mobile"
          ><img class="mobileicon" src="../assets/images/smartphone.svg" />
        </label>

        <span>
          <input
            id="showHelp"
            class="checkbox"
            type="checkbox"
            :checked="global.state.showHelp"
            @change="showHelpClicked($event.target.checked)"
          />
          <label class="checkboxlabel" for="showHelp">
            <img class="helpicon" src="../assets/images/question-mark.svg" />
          </label>
        </span>
      </form>
    </div>
  </div>
</template>
<script>
import { inject, computed } from 'vue'

export default {
  name: 'InputForm',
  emits: [
    'fetchDataClicked',
    'resultsRedirectsChanged',
    'showHelpClicked',
    'resultsCategoriesChanged',
    'checkboxFilterEnabledChanged',
    'languageSwitched',
    'mode-switched',
    'mobile-display-switched',
    'button-mode-switched'
  ],

  setup() {
    const global = inject('global')

    const numberOfPages = computed(() =>
      Math.ceil(
        global.state.filteredResultsArray.length / global.state.sizePerPage
      )
    )

    return { global, numberOfPages }
  },

  methods: {
    // can this be done more elegantly?
    fetchData(submitEvent) {
      let value = ''
      for (let element of submitEvent.target.elements) {
        if (element.id === 'title') {
          value = element.value
          break
        }
      }
      this.$emit('fetchDataClicked', value)
    },
    resultsCategoriesChanged(value) {
      if (
        value === false &&
        this.global.state.resultsRedirectsEnabled === false
      ) {
        this.buttonModeSwitched('search')
      }

      this.global.setResultsCategoriesEnabled(value)
      this.resetFirstItem()
      this.$emit('resultsCategoriesChanged', value)
    },
    resultsRedirectsChanged(value) {
      if (
        value === false &&
        this.global.state.resultsCategoriesEnabled === false
      ) {
        this.buttonModeSwitched('search')
      }

      this.global.setResultsRedirectsEnabled(value)
      this.$emit('resultsRedirectsChanged', value)
    },
    titleChanged(value) {
      this.global.setTitle(value)
    },
    filterChanged(value) {
      this.global.setFilter(value)
    },
    filterCategoriesChanged(value) {
      this.global.setFilterCategories(value)
    },
    resetFirstItem() {
      this.global.setGraphFirstItem(1)
    },
    checkboxFilterEnabledChanged(value) {
      this.global.setCheckboxFilterEnabled(value)
      this.resetFirstItem()
      this.$emit('checkboxFilterEnabledChanged', value)
    },
    languageSwitched(value) {
      if (value === 'en') {
        this.$refs.langEn.checked = true
        this.$refs.langDe.checked = false
      } else {
        this.$refs.langEn.checked = false
        this.$refs.langDe.checked = true
      }

      this.$emit('languageSwitched', value)
    },

    buttonModeSwitched(value) {
      switch (value) {
        case 'search':
          if (!this.global.state.mobileMode) {
            this.global.setShowCatsRedir(false)
          }

          this.$refs.search.checked = true
          this.$refs.catsredir.checked = false
          this.$refs.wiki.checked = false

          break
        case 'catsredir':
          if (!this.global.state.mobileMode) {
            this.global.setShowCatsRedir(true)
          }

          this.$refs.search.checked = false
          this.$refs.catsredir.checked = true
          this.$refs.wiki.checked = false

          break
        case 'wiki':
          if (!this.global.state.mobileMode) {
            this.global.setShowCatsRedir(false)
          }

          this.$refs.search.checked = false
          this.$refs.catsredir.checked = false
          this.$refs.wiki.checked = true

          break
      }
      this.global.setButtonMode(value)
      this.$emit('button-mode-switched')
    },

    categoriesOnHoverOrClickChanged(value) {
      if (value === 'catshover') {
        this.$refs.catsHover.checked = true
        this.$refs.catsClick.checked = false
      } else {
        this.$refs.catsHover.checked = false
        this.$refs.catsClick.checked = true
      }

      if (value === 'catshover') {
        this.global.setCategoriesOnHover(true)
      } else {
        this.global.setCategoriesOnHover(false)
      }
    },
    modeSwitched(value) {
      if (value === 'mobile') {
        this.global.setMobileMode(true)
        this.global.setCategoriesOnHover(false)
      } else {
        this.global.setMobileMode(false)

        this.$nextTick(() => {
          this.categoriesOnHoverOrClickChanged('catshover')
        })
      }
      this.global.setShowCatsRedir(false)
      this.buttonModeSwitched('search')
      this.$emit('mode-switched', value)
    },
    mobileDisplaySwitched(value) {
      this.global.setMobileDisplay(value)
      this.$emit('mobile-display-switched', value)
    },
    showHelpClicked(value) {
      this.global.setShowHelp(value)
      this.$emit('showHelpClicked', value)
    }
  },
  mounted() {
    // init
    this.languageSwitched('en')
    this.buttonModeSwitched('search')
    this.categoriesOnHoverOrClickChanged('catshover')

    if (window.matchMedia('(orientation: landscape)').matches) {
      if (window.innerWidth < 950) {
        this.modeSwitched('mobile')
        this.categoriesOnHoverOrClickChanged('catsclick')
      }
    } else {
      if (window.innerWidth < 800) {
        this.modeSwitched('mobile')
        this.categoriesOnHoverOrClickChanged('catsclick')
      }
    }

    // handle parameters from URL
    /**
     * URL Parameters
     * @param {String} mode - Enable mobile/desktop mode, desktop or mobile valid (-> gloabl.state.mobileMode true/false)
     * @param {String} lang - UI and Wikipedia language, en or de valid (-> global.state.language)
     * @param {String} categories - Enable/disable results categories, on or off valid (boolean to global.state.resultsCategoriesEnabled)
     * @param {String} titlefilter - String to filter results titles with (global.state.filter)
     * @param {String} categoriesfilter - String to filter results categories with (global.state.filterCategories)
     * @param {String} mobileview - Mobile mode only: Switch view mode, valid results, extract, categories (outgraph, maininfo, categories -> global.state.mobileDisplay)
     * @param {String} checkboxfilter - Desktop mode only: Enable/disable checkbox categories filter, on or off valid (boolean to global.state.checkboxFilterEnabled)
     * @param {String} redirects - Enable/disable redirects, on or off valid (boolean to global.state.resultsRedirectsEnabled)
     * @param {String} categoriesmode - Show categories on click or hover, valid click or hover
     * @param {String} buttonmode - Search, show categories/redirects or open Wikipedia on button click, valid search, catsredir, wiki
     * @param {String} search - Wikipedia page to search for (global.state.title)
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
    const buttonmode = urlParameters.get('buttonmode')
    const search = urlParameters.get('search')

    if (mode === 'desktop' || mode === 'mobile') {
      this.modeSwitched(mode)
    }

    if (lang === 'en' || lang === 'de') {
      this.languageSwitched(lang)
    }

    if (categories === 'on' || categories === 'off') {
      switch (categories) {
        case 'on':
          this.resultsCategoriesChanged(true)
          break

        case 'off':
          this.resultsCategoriesChanged(false)
          break
      }
    }

    if (titlefilter && titlefilter.length > 0) {
      this.resetFirstItem()
      this.filterChanged(titlefilter)
    }

    if (
      categoriesfilter &&
      categoriesfilter.length > 0 &&
      this.global.state.resultsCategoriesEnabled
    ) {
      this.resetFirstItem()
      this.filterCategoriesChanged(categoriesfilter)
    }

    if (
      this.global.state.mobileMode &&
      (mobileview === 'results' ||
        mobileview === 'extract' ||
        mobileview === 'categories')
    ) {
      switch (mobileview) {
        case 'results':
          this.mobileDisplaySwitched('outgraph')
          break
        case 'extract':
          this.mobileDisplaySwitched('maininfo')
          break
        case 'categories':
          this.mobileDisplaySwitched('categories')
          break
      }
    }

    if (
      !this.global.state.mobileMode &&
      (checkboxfilter === 'on' || checkboxfilter === 'off')
    ) {
      switch (checkboxfilter) {
        case 'on':
          if (this.global.state.resultsCategoriesEnabled) {
            this.checkboxFilterEnabledChanged(true)
          }
          break
        case 'off':
          this.checkboxFilterEnabledChanged(false)
          break
      }
    }

    if (redirects === 'on' || redirects === 'off') {
      switch (redirects) {
        case 'on':
          this.resultsRedirectsChanged(true)
          break
        case 'off':
          this.resultsRedirectsChanged(false)
      }
    }

    if (categoriesmode === 'click' || categoriesmode === 'hover') {
      switch (categoriesmode) {
        case 'click':
          this.categoriesOnHoverOrClickChanged('catsclick')
          break

        case 'hover':
          this.categoriesOnHoverOrClickChanged('catshover')
      }
    }

    if (categoriesmode === 'click' || categoriesmode === 'hover') {
      switch (categoriesmode) {
        case 'click':
          this.categoriesOnHoverOrClickChanged('catsclick')
          break

        case 'hover':
          this.categoriesOnHoverOrClickChanged('catshover')
      }
    }

    if (
      buttonmode === 'search' ||
      buttonmode === 'catsredir' ||
      buttonmode === 'wiki'
    ) {
      switch (buttonmode) {
        case 'search':
          this.buttonModeSwitched('search')
          break

        case 'catsredir':
          this.buttonModeSwitched('catsredir')
          break

        case 'wiki':
          this.buttonModeSwitched('wiki')
      }
    }

    // do search last after evaluating all other parameters
    if (search && search.length > 0) {
      this.$emit('fetchDataClicked', search)
    }
  }
}
</script>
<style scoped>
.inputform-flex-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

#item2,
#item3,
#item4 {
  flex-grow: 1;
}

@media only screen and (max-width: 1160px) {
  #item2,
  #item3,
  #item4 {
    flex-basis: 30%;
  }
}

@media only screen and (max-width: 950px) {
  #item2,
  #item3,
  #item4 {
    flex-basis: 50%;
  }
}

@media only screen and (max-width: 550px) {
  #item5.mobile,
  #item6,
  #item7 {
    flex-basis: 50%;
  }
}

.inputform {
  display: flex;
}
#title,
#filter,
#filterCategories {
  flex-grow: 1;
}
.fontsize70 {
  font-size: 70%;
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
@media (hover: hover) and (pointer: fine) {
  .radiobutton:hover + label,
  .checkbox:hover + label {
    filter: invert(0.25);
  }
}
.itemdisabled {
  filter: invert(0.75);
}

.searchbutton {
  border: none;
  background-color: transparent;
}
.categoriesicon,
.titleicon,
.checkboxfiltericon,
.redirectsicon,
.graphicon,
.desktopicon,
.mobileicon,
.flagicon,
.clickicon,
.hovericon,
.helpicon,
.searchicon,
.wikipediaiconcontainer,
.catsredircontainer {
  width: 2.66em;
  height: 1.4em;
  vertical-align: middle;
}

.flagicon {
  padding: 2px;
}

.searchiconsmall,
.titleiconsmall,
.categoriesiconsmall,
.wikipediaiconsmall {
  width: 1.4em;
  height: 1.4em;
  vertical-align: middle;
}

.catsrediricon {
  width: 1.3em;
  height: 1.3em;
  vertical-align: middle;
}

.searchinputarea,
.titleinputarea,
.categoriesinputarea {
  margin-top: 3px;
  margin-bottom: 3px;
  width: 150px;
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
</style>
