<template>
  <form
    @submit.prevent="clearCanvas(), getJson(), getMainInfo(), getCategories()"
  >
    <input id="title" v-model="title" :disabled="inputsDisabled" />
    <button type="submit" :disabled="inputsDisabled">Get JSON</button>
  </form>
  <form>
    <input
      id="resultsCategories"
      type="checkbox"
      :disabled="inputsDisabled"
      v-model="resultsCategoriesEnabled"
    />
    <label for="resultsCategories"
      >Results categories enabled (slower init, esp. on big pages)</label
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
  <form>
    <button @click.prevent="prevPage" :disabled="inputsDisabled">
      Prev. page
    </button>
    <button @click.prevent="nextPage" :disabled="inputsDisabled">
      Next page
    </button>
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
    :disabled="inputsDisabled"
    @input="drawLines(), resetPageNumber()"
  />

  <p>Size per page: {{ sizePerPage }}</p>
  <p>Page: {{ pageNumber + 1 }}</p>
  <p>Results: {{ filteredResultsArray.length }}</p>
  <p>Showing from {{ indexStart + 1 }} to {{ indexEnd + 1 }}</p>
  <h1>Output</h1>
  <div id="outgraph">
    <canvas id="outgraphcanvas"></canvas>

    <button
      id="titlebutton"
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
  <h1>Extract</h1>
  <!-- <p>{{ extract }}</p> -->
  <p id="extract" v-html="extract"></p>
  <div v-show="returnedImage">
    <h1>Image</h1>
    <img id="returnedImage" :src="returnedImage" />
  </div>
  <h1>Categories</h1>
  <ul>
    <li v-for="category in categoriesArray" :key="category">
      {{ category }}
    </li>
  </ul>

  <h1>Linked Wikipedia pages</h1>

  <ul>
    <li v-for="page in filteredResultsArray" :key="page.pageid">
      <h2 :class="{ missing: page.missing }">{{ page.title }}</h2>
      <p>
        <a :href="page.fullurl">{{ page.fullurl }}</a>
      </p>
      <h3 v-show="resultsCategoriesEnabled && page.categories">Categories</h3>
      <ul
        v-show="resultsCategoriesEnabled"
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

  <h1>Redirects</h1>
  <ul>
    <!-- text extracts and possible other info not fetched/displayed yet -->
    <!-- error case with page not existing  this.jsonDataFull = error/message (change later) not handled yet, then redirects does not exist, atm browser error -->
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
      jsonDataFullQuery: {
        // placeholder for no error before GetJson button pressed
        query: { pages: '', redirects: '' }
      },
      jsonDataFullQueryPart: {
        query: { pages: '', redirects: '' }
      },
      categoriesArray: [],
      categoriesQueryPart: {
        query: { pages: '' }
      },
      extract: '',
      pageNumber: 0,
      sizePerPage: 12,
      returnedTitle: '',
      returnedUrl: '',
      returnedImage: '',
      redirectsArray: [],
      resultsCategoriesEnabled: true,
      inputsDisabled: false
    }
  },

  computed: {
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
      // let url =
      //   'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&indexpageids&titles=' +
      //   this.title +
      //   '&origin=*'

      // let url =
      //   'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|info&exintro&redirects=1&indexpageids&inprop=url&titles=' +
      //   this.title +
      //   '&origin=*'

      let url =
        'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|info|pageimages&piprop=original&exintro&redirects=1&indexpageids&inprop=url&titles=' +
        this.title +
        '&origin=*'

      return url
    },

    // separate categories fetch, instead of adding to main info, for simple continue handling
    categoriesUrl() {
      // non hidden categories only

      // !!!
      // maybe switch to https://en.wikipedia.org/w/api.php?action=query&generator=categories&redirects&gcllimit=max&gclshow=!hidden&format=jsonfm&titles=Commodore%2064 later...gives simpler data structure
      // !!!

      let url =
        'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=categories&redirects&cllimit=max&clshow=!hidden&titles=' +
        this.title +
        '&origin=*'

      //    TEMP     limit 2 for continue testing
      // let url =
      //   'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=categories&redirects&cllimit=2&clshow=!hidden&titles=' +
      //   this.title +
      //   '&origin=*'

      // if (this.categoriesQueryPart.continue) {
      //   url += '&continue='
      //   url += this.categoriesQueryPart.continue.continue
      //   url += '&clcontinue='
      //   url += this.categoriesQueryPart.continue.clcontinue
      // }

      if (this.categoriesQueryPart.continue) {
        const continueArray = Object.entries(this.categoriesQueryPart.continue)

        continueArray.forEach((element) => {
          url += '&' + element[0] + '=' + element[1]
        })
      }

      return url
    },
    pageUrl() {
      // origin=* important for CORS on wikimedia api

      // API Query Namespace 0 filtered incl full URL plus redirects
      // 'https://en.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&gplnamespace=0&format=json&titles=Commodore_64&prop=info&inprop=url&origin=*'

      // API Query Namespace 0 filtered incl full URL
      // 'https://en.wikipedia.org/w/api.php?action=query&generator=links&gpllimit=max&gplnamespace=0&format=json&titles=Commodore_64&prop=info&inprop=url&origin=*'

      // API Query Namespace 0 filtered titles only
      // 'https://en.wikipedia.org/w/api.php?action=query&prop=links&redirects&pllimit=500&format=json&titles=Commodore_64&format=json&plnamespace=0&origin=*'

      // for testing random json data
      // 'https://jsonplaceholder.typicode.com/todos/1'
      // for testing error code
      // 'https://httpstat.us/404'
      // for testing malformed url etc.
      // 'htXXXtps://httpstat.us/404'

      // origin=* important for CORS on wikimedia api

      // https://en.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&gplnamespace=0&format=json&titles=Commodore%2064&prop=info|categories&inprop=url&cllimit=max&clshow=!hidden
      // https://en.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&gplnamespace=0&format=json&titles=Commodore%2064&prop=info&inprop=url

      let url

      if (!this.resultsCategoriesEnabled) {
        url =
          'https://en.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&gplnamespace=0&format=json&titles=' +
          this.title +
          '&prop=info&inprop=url&origin=*'
      } else {
        url =
          'https://en.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&gplnamespace=0&format=json&titles=' +
          this.title +
          '&prop=info|categories&inprop=url&cllimit=max&clshow=!hidden&origin=*'
      }
      //!!!
      // what about both continue at same time...possible? handle!
      //!!!

      if (this.jsonDataFullQueryPart.continue) {
        // url += '&continue='
        // url += this.jsonDataFullQueryPart.continue.continue

        const continueArray = Object.entries(
          this.jsonDataFullQueryPart.continue
        )

        continueArray.forEach((element) => {
          url += '&' + element[0] + '=' + element[1]
        })

        // console.log(url)
        // console.log(
        //   continueArray[0][0],
        //   continueArray[0][1],
        //   continueArray[1][0],
        //   continueArray[1][1],
        //   continueArray[2][0],
        //   continueArray[2][1],
        //   continueArray[3][0],
        //   continueArray[3][1]
        // )

        // url +=
        //   '&' +
        //   continueArray[0][0] +
        //   '=' +
        //   continueArray[0][1] +
        //   '&' +
        //   continueArray[1][0] +
        //   '=' +
        //   continueArray[1][1]

        // url += '&gplcontinue='
        // url += this.jsonDataFullQueryPart.continue.gplcontinue
      }

      return url
    },
    filteredResultsArray() {
      let resultsArray = Object.entries(this.jsonDataFullQuery.query.pages)

      let filteredArray
      // filter unused first index (equals pageid in second index)
      filteredArray = resultsArray.map((entry, index, array) => array[index][1])

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
    // https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
    mergeDeep(target, ...sources) {
      if (!sources.length) return target
      const source = sources.shift()

      if (this.isObject(target) && this.isObject(source)) {
        for (const key in source) {
          if (this.isObject(source[key])) {
            if (!target[key]) Object.assign(target, { [key]: {} })
            this.mergeDeep(target[key], source[key])
          } else {
            Object.assign(target, { [key]: source[key] })
          }
        }
      }

      return this.mergeDeep(target, ...sources)
    },
    isObject(item) {
      return item && typeof item === 'object' && !Array.isArray(item)
    },

    async getJson() {
      this.inputsDisabled = true
      // try catch block for catching network errors from Promise, otherwise error in browser console - getJson().catch in computed not possible (no async in computed)

      // clean old
      this.jsonDataFullQuery = {
        query: { pages: '', redirects: '' }
      }

      this.redirectsArray = []

      do {
        try {
          const response = await fetch(this.pageUrl)

          // ok = true on http 200-299 good response
          if (!response.ok) {
            const message = `ERROR: ${response.status} ${response.statusText}`
            this.jsonDataFullQuery = message
            throw new Error(message)
          } else {
            this.jsonDataFullQueryPart = await response.json()

            // this.jsonDataFullQuery.query.pages = {
            //   // reversed - don't delete existing categories - not working properly
            //   // clcontinue returns whole list, with categories going through
            //   ...this.jsonDataFullQueryPart.query.pages,
            //   ...this.jsonDataFullQuery.query.pages
            // }

            if (!this.resultsCategoriesEnabled) {
              this.jsonDataFullQuery.query.pages = {
                ...this.jsonDataFullQuery.query.pages,
                ...this.jsonDataFullQueryPart.query.pages
              }
            } else {
              // this joins categories etc - order matters
              this.jsonDataFullQuery.query.pages = this.mergeDeep(
                this.jsonDataFullQueryPart.query.pages,
                this.jsonDataFullQuery.query.pages
              )
            }
            // deep merge since introduction of categories...with clcontinue for categories, generator returns full list of pages again
            // but categories only piece by piece....old approach overwrote old info, since generator with categories does not return
            // info like fullurl, title, missing...
            // could be separated in separate fetch functions, but who cares
            // https://stackoverflow.com/questions/56256758/how-to-merge-nested-objects-in-javascript

            // console.log(Object.entries(this.jsonDataFullQueryPart.query.pages))

            //!!!
            //still buggy/missing categories?
            //
            // this.jsonDataFullQuery.query.pages = Object.assign(
            //   {},
            //   JSON.parse(
            //     JSON.stringify(this.jsonDataFullQueryPart.query.pages)
            //   ),
            //   JSON.parse(JSON.stringify(this.jsonDataFullQuery.query.pages))
            // )

            // this.jsonDataFullQuery.query.redirects = Object.assign(
            //   {},
            //   JSON.parse(
            //     JSON.stringify(this.jsonDataFullQueryPart.query.redirects)
            //   ),
            //   JSON.parse(JSON.stringify(this.jsonDataFullQuery.query.redirects))
            // )

            // for (const property in this.jsonDataFullQueryPart.query.pages) {
            //   // console.log(
            //   //   `${property}: ${this.jsonDataFullQueryPart.query.pages[property]}`
            //   // )
            //   for (const property2 in this.jsonDataFullQueryPart.query.pages[
            //     property
            //   ]) {
            //     console.log(
            //       `${property2}: ${this.jsonDataFullQueryPart.query.pages[property][property2]}`
            //     )
            //     // this.jsonDataFullQuery.query.pages[property][
            //     //   property2
            //     // ] = this.jsonDataFullQueryPart.query.pages[property][property2]
            //   }
            // }

            // move first steps from filteredarray computed here?...
            // 2/3 steps gpl und cl continue!
            // define(d) order in query?
            // generator = categores|links!?

            // let pagesArray = Object.entries(
            //   this.jsonDataFullQueryPart.query.pages
            // )
            // pagesArray = pagesArray.map(
            //   (entry, index, array) => array[index][1]
            // )
            // // sum varies with differing gpllimit not always example commodore 64...why?
            // console.log(pagesArray.length)

            // this overwrites old existing redirects, same problem as in later old categories implementation
            // pages have unique keys (same as pageid) - redirects is an array of objects [{from / to}]
            // this.jsonDataFullQuery.query.redirects = {
            //   ...this.jsonDataFullQuery.query.redirects,
            //   ...this.jsonDataFullQueryPart.query.redirects
            // }

            //
            // INSERT REDIRECTS
            //

            // !!!!!!!!!

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
            // this also seems buggy and varying - maybe? only with categories...repetitions with categories
            // FIX
            // if (this.jsonDataFullQueryPart.query.redirects) {
            //   for (
            //     let i = 0;
            //     i < this.jsonDataFullQueryPart.query.redirects.length;
            //     i++
            //   ) {
            //     this.redirectsArray.push(
            //       this.jsonDataFullQueryPart.query.redirects[i]
            //     )
            //   }
            // }
          }
        } catch (error) {
          this.jsonDataFullQuery = error
        }
      } while (this.jsonDataFullQueryPart.continue)

      let resultsArray = Object.entries(this.jsonDataFullQuery.query.pages)

      // console.log(resultsArray[0][0])
      // console.log(resultsArray[0][1])

      // console.log(resultsArray[1][0])
      // console.log(resultsArray[1][1])

      let filteredArray
      // filter unused first index (equals pageid in second index)
      filteredArray = resultsArray.map((entry, index, array) => array[index][1])

      // console.log(filteredArray[0])
      // console.log(filteredArray[1])

      // remove unused array fields and mark missing- is there a more elegant way?
      // is this needed at all for performence in computed filteredresultsarray?
      // reduce even further? remove query.pages?
      let usedKeys
      if (!this.resultsCategoriesEnabled) {
        usedKeys = ['pageid', 'title', 'fullurl', 'missing']
      } else {
        usedKeys = ['pageid', 'title', 'fullurl', 'missing', 'categories']
      }
      // const usedKeys = ['pageid', 'title', 'fullurl', 'missing']
      filteredArray.forEach((element) => {
        let filteredArrayKeys = Object.keys(element)
        filteredArrayKeys.forEach((key) => {
          if (!usedKeys.includes(key)) {
            // this also removes them in this.jsonDataFullQuery.query.pages and this.jsonDataFullQueryPart.query.pages - WHY?
            // -> object reference...
            delete element[key]
          }
          // for easy class binding in template, otherwise missing just empty
          // ... example "Commodore 64" -> missing Phoenix Park Hotel
          if (key === 'missing') {
            element[key] = true
          }
        })
      })

      // let testArray = Object.entries(this.jsonDataFullQuery.query.pages)
      // console.log(testArray)

      // not sure if necessary
      // this.redirectsArray.sort()

      // sort arrayobject by from
      this.redirectsArray.sort((a, b) => (a.from > b.from ? 1 : -1))

      this.resetPageNumber()

      // //temp categories full test
      // let counter = 0
      // let testArray = Object.entries(this.jsonDataFullQuery.query.pages)
      // let testFiltered = testArray.map((entry, index, array) => array[index][1])
      // testFiltered.forEach((element) => {
      //   let keys = Object.keys(element)
      //   keys.forEach((key) => {
      //     if (key === 'categories') {
      //       // console.log(element[key])
      //       counter++
      //     }
      //   })
      // })
      // console.log(counter)
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
          //  else {
          //   this.returnedImage = ''
          // }
        }
      } catch (error) {
        this.jsonDataFullQuery = error
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

            let resultsArray = Object.entries(
              this.categoriesQueryPart.query.pages
            )

            for (let i = 0; i < resultsArray[0][1].categories.length; i++) {
              this.categoriesArray.push(resultsArray[0][1].categories[i].title)
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
      const canvas = document.getElementById('outgraphcanvas')
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
      const canvas = document.getElementById('outgraphcanvas')
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
      // console.log(
      //   `Circle button ${index} - ${this.displayResultsArray[index].title} clicked.`
      // )
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
#outgraph {
  margin: auto;
  position: relative;
  width: 800px;
  height: 600px;
  border: 1px solid black;
}
#outgraphcanvas {
  width: 100%;
  height: 100%;
}

#titlebutton {
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
#extract {
  text-align: left;
}
/* #returnedImageContainer { */
/* margin: auto;
  position: relative;
  width: 800px;
  height: 600px; */
/* } */
#returnedImage {
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
