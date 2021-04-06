<template>
  <form @submit.prevent="getJson">
    <input id="title" v-model="title" />
    <button type="submit">Get JSON</button>
  </form>
  <h1>Linked Wikipedia pages</h1>

  <form>
    <label for="filter">Filter:</label>
    <input id="filter" v-model="filter" />
  </form>
  <ul>
    <template
      v-for="(page, index) in jsonDataFullQuery.query.pages"
      :key="index"
    >
      <!-- if pageid exists, then actual wikipedia page, otherwise page negative and just link, no actual page -->
      <li
        v-if="
          page.pageid && page.title.toLowerCase().includes(filter.toLowerCase())
        "
      >
        Title: {{ page.title }} - Full URL:
        <a :href="page.fullurl">{{ page.fullurl }}</a>
      </li>
    </template>
  </ul>
  <h1>Redirects</h1>
  <ul>
    <!-- text extracts and possible other info not fetched/displayed yet -->
    <!-- error case with page not existing  this.jsonDataFull = error/message (change later) not handled yet, then redirects does not exist, atm browser error -->
    <li
      v-for="(redirect, index) in jsonDataFullQuery.query.redirects"
      :key="index"
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
      }
    }
  },

  computed: {
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
</style>
