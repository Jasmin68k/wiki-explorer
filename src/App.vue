<template>
  <MainView />
</template>

<script setup>
import { provide } from 'vue'
import global from '@/global.js'

provide('global', global)
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #d8d4cf;
  background-color: #181a1b;
}

#app input {
  border: 1px solid #666;
  background-color: #555;
  color: #d8d4cf;
}

#app input:focus {
  background-color: #7a4c65;
}

#app input::placeholder {
  color: #d8d4cf;
}

#app button {
  color: #d8d4cf;
}

#app a:link {
  color: #398bd8;
}

#app a:visited {
  color: #9651b1;
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
