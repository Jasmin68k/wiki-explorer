<template>
  <MainView />
  <Canvas />
</template>

<script>
import MainView from './components/MainView.vue'
import Canvas from './components/Canvas.vue'

export default {
  name: 'App',
  components: {
    MainView,
    Canvas
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
  margin-top: 60px;
}
</style>
