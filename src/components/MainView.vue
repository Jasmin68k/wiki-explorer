<template>
  <form
    @submit.prevent="clearCanvas(), getJson(), getMainInfo(), getCategories()"
  >
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
      >Results categories enabled (slower init, esp. on big pages, requires lots
      of API fetches)</label
    >
  </form>
  <form @submit.prevent="">
    <label for="filter">Filter:</label>
    <input
      id="filter"
      v-model="filter"
      @input="resetPageNumber"
      :disabled="inputsDisabled"
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
    @input="drawLines(), resetPageNumber()"
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

  <h1>Output</h1>
  <div class="outgraph">
    <canvas class="outgraphcanvas"></canvas>

    <button
      class="titlebutton"
      v-show="!inputsDisabled && returnedTitle"
      @click.prevent="titleButton"
    >
      {{ returnedTitle }}
    </button>

    <button
      v-show="!inputsDisabled"
      class="circlebutton"
      v-for="(page, index) in displayResultsArray"
      :key="index"
      :class="{ missing: page.missing }"
      :style="{
        '--angle': 270 + (360 / displayResultsArray.length) * index + 'deg'
      }"
      :disabled="page.missing"
      @click.prevent="circleButton(index)"
    >
      {{ page.title }}
    </button>
  </div>
  <h1 v-show="extract">Extract</h1>
  <p class="extract" v-html="extract"></p>
  <div v-show="returnedImage">
    <h1>Image</h1>
    <img class="returnedImage" :src="returnedImage" />
  </div>
  <h1 v-show="categoriesArray.length > 0">Categories</h1>
  <ul>
    <li v-for="category in categoriesArray" :key="category">
      {{ category }}
    </li>
  </ul>

  <h1 v-show="filteredResultsArray.length > 0">Linked Wikipedia pages</h1>

  <ul>
    <li v-for="page in filteredResultsArray" :key="page.pageid">
      <h2 :class="{ missing: page.missing }">{{ page.title }}</h2>
      <p>
        <a :href="page.fullurl">{{ page.fullurl }}</a>
      </p>
      <h3
        v-show="resultsCategoriesEnabled && page.categories && !inputsDisabled"
      >
        Categories
      </h3>
      <ul
        v-show="resultsCategoriesEnabled && !inputsDisabled"
        v-for="category in page.categories"
        :key="category.title"
      >
        <li>
          {{
            category.title.startsWith('Category:')
              ? category.title.substring(9)
              : category.title
          }}
        </li>
      </ul>
    </li>
  </ul>

  <h1 v-show="redirectsArray.length > 0">Redirects</h1>
  <ul>
    <li v-for="redirect in redirectsArray" :key="redirect.from">
      {{ redirect.from }} -> {{ redirect.to }}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'MainView',

  data() {
    return {
      title: '',
      filter: '',
      jsonDataFullQueryPart: {},
      categoriesArray: [],
      categoriesQueryPart: {},
      extract: '',
      pageNumber: 0,
      sizePerPage: 12,
      returnedTitle: '',
      returnedUrl: '',
      returnedImage: '',
      redirectsArray: [],
      resultsCategoriesEnabled: true,
      inputsDisabled: false,
      resultsObject: {}
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

      // apply filter
      filteredArray = filteredArray.filter((page) =>
        page.title.toLowerCase().includes(this.filter.toLowerCase())
      )

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

      this.redirectsArray = []
      this.resultsObject = {}

      let start2, end2, start3, end3, start4, end4, start5, end5

      let timecountertitle = 0
      do {
        const start = performance.now()

        try {
          start4 = performance.now()

          const response = await fetch(this.pageUrl)

          end4 = performance.now()

          if (!response.ok) {
            const message = `ERROR: ${response.status} ${response.statusText}`
            throw new Error(message)
          } else {
            start5 = performance.now()
            this.jsonDataFullQueryPart = await response.json()
            end5 = performance.now()

            start2 = performance.now()

            for (const property in this.jsonDataFullQueryPart.query.pages) {
              if (!this.resultsObject[property]) {
                this.resultsObject[property] = {
                  ...this.jsonDataFullQueryPart.query.pages[property]
                }
              }
            }
            end2 = performance.now()

            start3 = performance.now()

            if (this.jsonDataFullQueryPart.query.redirects) {
              const redir = this.jsonDataFullQueryPart.query.redirects

              for (let i = 0; i < redir.length; i++) {
                let found = false
                for (let j = 0; j < this.redirectsArray.length && !found; j++) {
                  found = this.redirectsArray[j].from === redir[i].from
                }
                if (!found) {
                  this.redirectsArray.push(redir[i])
                }
              }
            }
          }

          end3 = performance.now()
        } catch (error) {
          throw new Error(error)
        }

        const end = performance.now()
        console.log(
          `Time title full: ${end - start} ms - API fetch: ${
            end4 - start4
          } ms - JSONify ${end5 - start5} ms - Title insert alone: ${
            end2 - start2
          } ms - Redirects push alone: ${end3 - start3} ms`
        )
        timecountertitle += end - start
      } while (this.jsonDataFullQueryPart.continue)
      console.log(`Time title: ${timecountertitle} ms`)

      let start = performance.now()
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
      let end = performance.now()
      console.log(`Time remove unused keys: ${end - start} ms`)

      // with big pages this requires lots of api fetches, which makes up majority of the wait time
      if (this.resultsCategoriesEnabled) {
        let timecountercategories = 0

        let start2, end2, start3, end3, start4, end4

        do {
          const start = performance.now()

          try {
            start3 = performance.now()
            const response = await fetch(this.pageUrlCategories)
            end3 = performance.now()
            if (!response.ok) {
              const message = `ERROR: ${response.status} ${response.statusText}`
              throw new Error(message)
            } else {
              start4 = performance.now()
              this.jsonDataFullQueryPart = await response.json()
              end4 = performance.now()
              start2 = performance.now()

              for (const property in this.jsonDataFullQueryPart.query.pages) {
                if (
                  this.jsonDataFullQueryPart.query.pages[property].categories
                ) {
                  this.resultsObject[property].categories =
                    this.jsonDataFullQueryPart.query.pages[property].categories
                }
              }

              end2 = performance.now()
            }
          } catch (error) {
            throw new Error(error)
          }

          const end = performance.now()
          console.log(
            `Time categories: ${end - start} ms - API fetch: ${
              end3 - start3
            } ms - JSONify: ${end4 - start4} ms - Categories insert alone: ${
              end2 - start2
            } ms`
          )
          timecountercategories += end - start
        } while (this.jsonDataFullQueryPart.continue)
        console.log(`Time categories all: ${timecountercategories} ms`)
      }

      start = performance.now()
      this.redirectsArray.sort((a, b) => (a.from > b.from ? 1 : -1))
      end = performance.now()
      console.log(`Time sort redirects: ${end - start} ms`)

      start = performance.now()
      this.resetPageNumber()
      end = performance.now()
      console.log(`Time reset pagenumber: ${end - start} ms`)

      this.inputsDisabled = false
    },
    async getMainInfo() {
      this.extract = ''
      this.returnedImage = ''

      try {
        const response = await fetch(this.mainInfoUrl)

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
          const response = await fetch(this.categoriesUrl)

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
    drawLines() {
      const canvas = document.getElementsByClassName('outgraphcanvas')[0]
      const ctx = canvas.getContext('2d')
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      canvas.width = width
      canvas.height = height

      const middleX = width / 2
      const middleY = height / 2
      for (let i = 0; i < this.displayResultsArray.length; i++) {
        ctx.beginPath()
        ctx.moveTo(middleX, middleY)
        const angle =
          ((270 + (360 / this.displayResultsArray.length) * i) * Math.PI) / 180
        const length = 250
        ctx.lineTo(
          length * Math.cos(angle) + middleX,
          length * Math.sin(angle) + middleY
        )
        ctx.stroke()
      }
    },
    clearCanvas() {
      const canvas = document.getElementsByClassName('outgraphcanvas')[0]
      const ctx = canvas.getContext('2d')
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      canvas.width = width
      canvas.height = height
      ctx.clearRect(0, 0, width, height)
    },
    titleButton() {
      // window.location = this.returnedUrl
      window.open(this.returnedUrl, '_blank')
    },
    circleButton(index) {
      this.title = this.displayResultsArray[index].title
      this.clearCanvas()
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
      this.drawLines()
    },
    prevPage() {
      if (this.pageNumber > 0) {
        this.pageNumber--
      }

      this.drawLines()
    },
    resetPageNumber() {
      this.pageNumber = 0
      this.drawLines()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none; /* Remove bullets */
  padding: 0; /* Remove padding */
  margin: 0; /* Remove margins */
}
.missing {
  color: red;
}
.outgraph {
  margin: auto;
  position: relative;
  width: 800px;
  height: 600px;
  border: 1px solid black;
}
.outgraphcanvas {
  width: 100%;
  height: 100%;
}

.titlebutton {
  position: absolute;
  left: 50%;
  top: 50%;
  /* move pixel position to center of button */
  transform: translate(-50%, -50%);
}
.circlebutton {
  position: absolute;
  left: 50%;
  top: 50%;
  /* move pixel position to center of button and arrange in circle - translate(...px) still fix, calc later */
  transform: translate(-50%, -50%) rotate(var(--angle)) translate(250px)
    rotate(calc(-1 * var(--angle)));
}
.extract {
  text-align: left;
}
/* #returnedImageContainer { */
/* margin: auto;
  position: relative;
  width: 800px;
  height: 600px; */
/* } */
.returnedImage {
  margin: auto;
  position: relative;
  max-width: 800px;
  max-height: 600px;
  width: auto;
  height: auto;
  /* max-width: 100%;
  max-height: 100%; */
}
</style>
