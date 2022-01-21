<template>
  <MainView />
</template>

<script>
import MainView from './components/MainView.vue'
import global from './global.js'

export default {
  name: 'App',
  provide: { global: global },
  components: {
    MainView
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body,
html {
  margin: 0;
  padding: 0;
}
* {
  box-sizing: border-box;
}
</style>
