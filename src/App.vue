<template>
  <MainView />
</template>

<script setup>
import { provide } from 'vue'
import global from './global.js'

provide('global', global)
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
