<template>
  <form @submit.prevent="getJson">
    <input id="page" v-model="page" />
    <button type="submit">Get JSON</button>
  </form>
  <h1>Redirects</h1>
  <ul>
    <!-- text extracts and possible other info not fetched/displayed yet -->
    <!-- error case with page not existing  this.jsonDataFull = error/message (change later) not handled yet, then redirects does not exist, atm browser error -->
    <li v-for="(redirect, index) in jsonDataFull.query.redirects" :key="index">
      {{ redirect.from }} -> {{ redirect.to }}
    </li>
  </ul>
  <h1>Linked Wikipedia pages</h1>
  <ul>
    <li v-for="(page, index) in jsonDataFull.query.pages" :key="index">
      Title: {{ page.title }} - Full URL:
      <a :href="page.fullurl">{{ page.fullurl }}</a>
      <!-- also accessible page.pageid for pageid exposed as jsonDataFull.query.pages.123456 -->
    </li>
  </ul>
</template>

<script>
export default {
  name: 'MainView',

  data() {
    return {
      jsonDataFull: {
        // placeholder for no error before GetJson button pressed
        query: ''
      },
      page: ''
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

      const url =
        'https://en.wikipedia.org/w/api.php?action=query&generator=links&redirects&gpllimit=max&&gplnamespace=0&format=json&titles=' +
        this.page +
        '&prop=info&inprop=url&origin=*'
      return url
    }
  },

  methods: {
    async getJson() {
      // !!! no handling yet of wikimedia continue.gplcontinue case. fetch more results !!!

      // try catch block for catching network errors from Promise, otherwise error in browser console - getJson().catch in computed not possible (no async in computed)
      try {
        // origin=* important for CORS on wikimedia api
        const response = await fetch(this.pageUrl)

        // ok = true on http 200-299 good response
        if (!response.ok) {
          const message = `ERROR: ${response.status} ${response.statusText}`
          this.jsonDataFull = message
          throw new Error(message)
        } else {
          const data = await response.json()
          this.jsonDataFull = data
        }
      } catch (error) {
        this.jsonDataFull = error
      }
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
