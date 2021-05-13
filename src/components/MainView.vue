<template>
  <form @submit.prevent="clearCanvas(), getJson()">
    <input id="title" v-model="title" />
    <button type="submit">Get JSON</button>
  </form>
  <form @submit.prevent="">
    <label for="filter">Filter:</label>
    <input id="filter" v-model="filter" @input="resetPageNumber" />
  </form>
  <form>
    <button @click.prevent="prevPage">Prev. page</button>
    <button @click.prevent="nextPage">Next page</button>
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
    @input="drawLines(), resetPageNumber()"
  />

  <p>Size per page: {{ sizePerPage }}</p>
  <p>Page: {{ pageNumber + 1 }}</p>
  <p>Results: {{ filteredResultsArray.length }}</p>
  <p>Showing from {{ indexStart + 1 }} to {{ indexEnd + 1 }}</p>
  <h1>Output</h1>
  <div id="outgraph">
    <canvas id="outgraphcanvas"></canvas>
    <button id="titlebutton" @click.prevent="titleButton">
      {{ title }}
    </button>
    <button
      id="circlebutton"
      v-for="(page, index) in displayResultsArray"
      :style="{
        '--angle': 270 + (360 / displayResultsArray.length) * index + 'deg'
      }"
      :key="index"
      @click.prevent="circleButton(index)"
    >
      {{ page.title }}
    </button>
  </div>

  <h1>Linked Wikipedia pages</h1>
  <ul>
    <li v-for="page in filteredResultsArray" :key="page.pageid">
      <span :class="{ missing: page.missing }">Title: {{ page.title }}</span>
      - Full URL:
      <a :href="page.fullurl">{{ page.fullurl }}</a>
    </li>
  </ul>

  <h1>Redirects</h1>
  <ul>
    <!-- text extracts and possible other info not fetched/displayed yet -->
    <!-- error case with page not existing  this.jsonDataFull = error/message (change later) not handled yet, then redirects does not exist, atm browser error -->
    <li
      v-for="redirect in jsonDataFullQuery.query.redirects"
      :key="redirect.from"
    >
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
      pageNumber: 0,
      sizePerPage: 12
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
    pageUrl() {
      // origin=* important for CORS on wikimedia api

      // API Query Namespace 0 filtered incl full URL plus redirects
      // 'https://en.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&&gplnamespace=0&format=json&titles=Commodore_64&prop=info&inprop=url&origin=*'

      // API Query Namespace 0 filtered incl full URL
      // 'https://en.wikipedia.org/w/api.php?action=query&generator=links&gpllimit=max&&gplnamespace=0&format=json&titles=Commodore_64&prop=info&inprop=url&origin=*'

      // API Query Namespace 0 filtered titles only
      // 'https://en.wikipedia.org/w/api.php?action=query&prop=links&redirects&pllimit=500&format=json&titles=Commodore_64&format=json&plnamespace=0&origin=*'

      // for testing random json data
      // 'https://jsonplaceholder.typicode.com/todos/1'
      // for testing error code
      // 'https://httpstat.us/404'
      // for testing malformed url etc.
      // 'htXXXtps://httpstat.us/404'

      // origin=* important for CORS on wikimedia api

      let url =
        'https://en.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&&gplnamespace=0&format=json&titles=' +
        this.title +
        '&prop=info&inprop=url&origin=*'

      if (this.jsonDataFullQueryPart.continue) {
        url += '&continue='
        url += this.jsonDataFullQueryPart.continue.continue
        url += '&gplcontinue='
        url += this.jsonDataFullQueryPart.continue.gplcontinue
      }

      return url
    },
    filteredResultsArray() {
      let resultsArray = Object.entries(this.jsonDataFullQuery.query.pages)

      let filteredArray
      // filter unused first index (equals pageid in second index)
      filteredArray = resultsArray.map((entry, index, array) => array[index][1])

      // remove unused array fields and mark missing- is there a more elegant way?
      const usedKeys = ['pageid', 'title', 'fullurl', 'missing']
      filteredArray.forEach((element) => {
        let filteredArrayKeys = Object.keys(element)
        filteredArrayKeys.forEach((key) => {
          if (!usedKeys.includes(key)) {
            delete element[key]
          }
          // for easy class binding in template, otherwise missing just empty
          // ... example "Commodore 64" -> missing Phoenix Park Hotel
          if (key === 'missing') {
            element[key] = true
          }
        })
      })

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
      // !!! no handling yet of wikimedia continue.gplcontinue case. fetch more results !!!

      // try catch block for catching network errors from Promise, otherwise error in browser console - getJson().catch in computed not possible (no async in computed)

      // clean old
      this.jsonDataFullQuery = {
        query: { pages: '', redirects: '' }
      }

      // this.jsonDataFullQueryPart = {
      //   query: { pages: '', redirects: '' }
      // }

      do {
        try {
          // console.log(this.pageUrl)

          const response = await fetch(this.pageUrl)

          // ok = true on http 200-299 good response
          if (!response.ok) {
            const message = `ERROR: ${response.status} ${response.statusText}`
            this.jsonDataFullQuery = message
            throw new Error(message)
          } else {
            this.jsonDataFullQueryPart = await response.json()

            this.jsonDataFullQuery.query.pages = {
              ...this.jsonDataFullQuery.query.pages,
              ...this.jsonDataFullQueryPart.query.pages
            }
            this.jsonDataFullQuery.query.redirects = {
              ...this.jsonDataFullQuery.query.redirects,
              ...this.jsonDataFullQueryPart.query.redirects
            }
          }
        } catch (error) {
          this.jsonDataFullQuery = error
        }
      } while (this.jsonDataFullQueryPart.continue)

      this.resetPageNumber()
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
      console.log('Title button clicked.')
    },
    circleButton(index) {
      console.log(`Circle button ${index} clicked.`)
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
#circlebutton {
  position: absolute;
  left: 50%;
  top: 50%;
  /* move pixel position to center of button and arrange in circle - translate(...px) still fix, calc later */
  transform: translate(-50%, -50%) rotate(var(--angle)) translate(250px)
    rotate(calc(-1 * var(--angle)));
}
</style>
