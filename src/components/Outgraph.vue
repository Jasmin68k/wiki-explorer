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

    <title-button :outgraphcanvasref="outgraphcanvasref"></title-button>

    <div v-for="(page, index) in global.state.displayResultsArray" :key="index">
      <circle-button
        :index="index"
        :outgraphcanvasref="outgraphcanvasref"
        :coordinates="circleButtonCoordinates[index]"
        @circleButtonClicked="circleButtonClicked"
      >
      </circle-button>
    </div>

    <pie-navigation></pie-navigation>
  </div>
</template>
<script>
import { inject, watchEffect, nextTick, ref, onMounted } from 'vue'
import TitleButton from './TitleButton.vue'
import CircleButton from './CircleButton.vue'
import PieNavigation from './PieNavigation.vue'

export default {
  name: 'Outgraph',
  setup() {
    const global = inject('global')

    const outgraphcanvasref = ref(null)
    let circleButtonCoordinates = []

    onMounted(() => {
      clearCanvasAndDrawLines()
    })

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
        for (let i = 0; i < global.state.displayResultsArray.length; i++) {
          ctx.beginPath()
          ctx.moveTo(middleX, middleY)
          const angle =
            ((270 +
              (360 /
                (Math.round(global.state.displayResultsArray.length / 2) * 2)) *
                i) *
              Math.PI) /
            180
          const angle2 =
            ((360 /
              (Math.round(global.state.displayResultsArray.length / 2) * 2)) *
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
      calcCoordinates()
    }

    function displayResultsArrayWatch() {
      if (
        global.state.displayResultsArray.length > 0 &&
        !global.state.inputsDisabled
      ) {
        drawLines()
        calcCoordinates()
      } else clearCanvas()
    }

    function calcCoordinates() {
      for (let i = 0; i < global.state.displayResultsArray.length; i++) {
        const angle =
          270 +
          (360 /
            (Math.round(global.state.displayResultsArray.length / 2) * 2)) *
            i

        const radius =
          i % 2 === 0
            ? global.state.circleButtonRadius *
              global.state.scalingFactor *
              (1 +
                Math.abs(
                  Math.sin(
                    ((360 /
                      (Math.round(global.state.displayResultsArray.length / 2) *
                        2)) *
                      i *
                      Math.PI) /
                      180
                  )
                ) *
                  0.25)
            : (global.state.circleButtonRadius / 1.5) *
              global.state.scalingFactor *
              (1 +
                Math.abs(
                  Math.sin(
                    ((360 /
                      (Math.round(global.state.displayResultsArray.length / 2) *
                        2)) *
                      i *
                      Math.PI) /
                      180
                  )
                ) *
                  0.25)

        circleButtonCoordinates[i] = {
          x:
            radius * Math.cos(angle * (Math.PI / 180)) +
            ((global.state.circleButtonRadius * 1.25 * 2 + 220) *
              global.state.scalingFactor) /
              2,
          y:
            radius * Math.sin(angle * (Math.PI / 180)) +
            ((global.state.circleButtonRadius * 2 + 100) *
              global.state.scalingFactor) /
              2
        }
      }
    }

    watchEffect(() => clearCanvasAndDrawLines(global.state.scalingFactor))
    watchEffect(() => clearCanvasAndDrawLines(global.state.circleButtonRadius))
    watchEffect(() =>
      displayResultsArrayWatch(global.state.displayResultsArray)
    )

    return {
      global,
      outgraphcanvasref,
      circleButtonCoordinates
    }
  },
  components: { TitleButton, CircleButton, PieNavigation },
  emits: ['circleButtonClicked'],

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
