<template>
  <div
    class="outgraph"
    :style="{
      width:
        (global.state.circleButtonRadius * 1.25 * 2 + 220) *
          global.state.scalingFactor +
        'px',
      height:
        (global.state.circleButtonRadius * 2 + 100) *
          global.state.scalingFactor +
        'px'
    }"
  >
    <canvas class="outgraphcanvas" ref="outgraphcanvasref"></canvas>

    <title-button
      :title="title"
      :title-missing="titleMissing"
      :redirects="redirects"
      :categories-array="categoriesArray"
      :url="url"
      :outgraphcanvasref="outgraphcanvasref"
      :redirects-done="redirectsDone"
    ></title-button>

    <div v-for="(page, index) in displayResultsArray" :key="index">
      <circle-button
        :index="index"
        :display-results-array="displayResultsArray"
        :results-redirects-done="resultsRedirectsDone"
        :outgraphcanvasref="outgraphcanvasref"
        @circleButtonClicked="circleButtonClicked"
      >
      </circle-button>
    </div>
  </div>
</template>
<script>
import { inject, watchEffect, nextTick, ref, onMounted } from 'vue'
import TitleButton from './TitleButton.vue'
import CircleButton from './CircleButton.vue'

export default {
  name: 'Outgraph',
  setup(props) {
    const global = inject('global')

    const outgraphcanvasref = ref(null)
    onMounted(() => clearCanvasAndDrawLines())

    function clearCanvas() {
      if (outgraphcanvasref.value) {
        const canvas = outgraphcanvasref.value
        const ctx = canvas.getContext('2d')
        const width = canvas.offsetWidth
        const height = canvas.offsetHeight
        canvas.width = width
        canvas.height = height
        ctx.clearRect(0, 0, width, height)
      }
    }
    function drawLines() {
      if (outgraphcanvasref.value) {
        const canvas = outgraphcanvasref.value
        const ctx = canvas.getContext('2d')
        const width = canvas.offsetWidth
        const height = canvas.offsetHeight
        canvas.width = width
        canvas.height = height
        const middleX = width / 2
        const middleY = height / 2
        for (let i = 0; i < props.displayResultsArray.length; i++) {
          ctx.beginPath()
          ctx.moveTo(middleX, middleY)
          const angle =
            ((270 +
              (360 / (Math.round(props.displayResultsArray.length / 2) * 2)) *
                i) *
              Math.PI) /
            180
          const angle2 =
            ((360 / (Math.round(props.displayResultsArray.length / 2) * 2)) *
              i *
              Math.PI) /
            180
          const length =
            i % 2 === 0
              ? global.state.circleButtonRadius *
                global.state.scalingFactor *
                (1 + Math.abs(Math.sin(angle2)) * 0.25)
              : (global.state.circleButtonRadius / 1.5) *
                global.state.scalingFactor *
                (1 + Math.abs(Math.sin(angle2)) * 0.25)
          ctx.lineTo(
            length * Math.cos(angle) + middleX,
            length * Math.sin(angle) + middleY
          )
          ctx.stroke()
        }
      }
    }
    async function clearCanvasAndDrawLines() {
      await nextTick()
      clearCanvas()
      drawLines()
    }

    function displayResultsArrayWatch() {
      if (
        props.displayResultsArray.length > 0 &&
        !global.state.inputsDisabled
      ) {
        drawLines()
      } else clearCanvas()
    }
    watchEffect(() => clearCanvasAndDrawLines(global.state.scalingFactor))
    watchEffect(() => clearCanvasAndDrawLines(global.state.circleButtonRadius))
    watchEffect(() => displayResultsArrayWatch(props.displayResultsArray))

    return { global, outgraphcanvasref }
  },
  components: { TitleButton, CircleButton },
  emits: ['circleButtonClicked'],

  props: {
    title: { required: true, default: '', type: String },
    url: { required: true, default: '', type: String },
    redirects: { required: true, default: () => [], type: Array },
    displayResultsArray: { required: true, default: () => [], type: Array },
    categoriesArray: { required: true, default: () => [], type: Array },
    resultsRedirectsDone: { required: true, default: true, type: Boolean },
    titleMissing: { required: true, default: true, type: Boolean },
    redirectsDone: { required: true, default: false, type: Boolean }
  },
  methods: {
    circleButtonClicked(index) {
      this.$emit('circleButtonClicked', index)
    }
  }
}
</script>
<style scoped>
.outgraph {
  margin: auto;
  position: relative;
}
.outgraphcanvas {
  width: 100%;
  height: 100%;
}
</style>
