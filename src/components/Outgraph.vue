<template>
  <div class="outgraph">
    <canvas class="outgraphcanvas" ref="outgraphcanvas"></canvas>

    <title-button
      :inputs-disabled="inputsDisabled"
      :title="title"
      :title-missing="titleMissing"
      :results-redirects-enabled="resultsRedirectsEnabled"
      :redirect="redirect"
      :categories-array="categoriesArray"
      :url="url"
      :outgraphcanvasref="outgraphcanvasref"
    ></title-button>

    <div v-for="(page, index) in displayResultsArray" :key="index">
      <circle-button
        :index="index"
        :inputs-disabled="inputsDisabled"
        :display-results-array="displayResultsArray"
        :results-categories-enabled="resultsCategoriesEnabled"
        :results-categories-done="resultsCategoriesDone"
        :results-redirects-enabled="resultsRedirectsEnabled"
        :outgraphcanvasref="outgraphcanvasref"
        :circle-button-radius="circleButtonRadius"
        @circleButtonClicked="circleButtonClicked"
      >
      </circle-button>
    </div>
  </div>
</template>
<script>
import TitleButton from './TitleButton.vue'
import CircleButton from './CircleButton.vue'

export default {
  name: 'Outgraph',
  components: { TitleButton, CircleButton },
  // avoid vue bug https://github.com/vuejs/vue-next/issues/2540 [just console warning]
  // should not be needed, when fixed
  // interestingly, this component doesn't show bug, even when this is omitted
  emits: ['circleButtonClicked'],

  props: {
    inputsDisabled: { required: true, default: false, type: Boolean },
    title: { required: true, default: '', type: String },
    url: { required: true, default: '', type: String },
    resultsRedirectsEnabled: { required: true, default: true, type: Boolean },
    redirect: { required: true, default: '', type: String },
    displayResultsArray: { required: true, default: () => [], type: Array },
    categoriesArray: { required: true, default: () => [], type: Array },
    resultsCategoriesEnabled: { required: true, default: true, type: Boolean },
    resultsCategoriesDone: { required: true, default: true, type: Boolean },
    titleMissing: { required: true, default: true, type: Boolean }
  },
  data() {
    return {
      outgraphcanvasref: {},
      circleButtonRadius: 250
    }
  },
  watch: {
    displayResultsArray() {
      if (this.displayResultsArray.length > 0 && !this.inputsDisabled) {
        this.drawLines()
      } else this.clearCanvas()
    }
  },
  methods: {
    clearCanvas() {
      const canvas = document.getElementsByClassName('outgraphcanvas')[0]
      const ctx = canvas.getContext('2d')
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      canvas.width = width
      canvas.height = height
      ctx.clearRect(0, 0, width, height)
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
        const length = this.circleButtonRadius
        ctx.lineTo(
          length * Math.cos(angle) + middleX,
          length * Math.sin(angle) + middleY
        )
        ctx.stroke()
      }
    },
    circleButtonClicked(index) {
      this.$emit('circleButtonClicked', index)
    }
  },
  mounted() {
    this.outgraphcanvasref = this.$refs['outgraphcanvas']
  }
}
</script>
<style scoped>
.outgraph {
  margin: auto;
  position: relative;
  width: 800px;
  height: 600px;
}
.outgraphcanvas {
  width: 100%;
  height: 100%;
}
</style>
