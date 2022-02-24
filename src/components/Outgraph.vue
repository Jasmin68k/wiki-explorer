<template>
  <div
    class="outgraph"
    ref="outgraphref"
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
    <title-button :outgraphref="outgraphref"></title-button>

    <div v-for="(page, index) in global.state.displayResultsArray" :key="index">
      <circle-button
        :index="index"
        :outgraphref="outgraphref"
        :coordinates="circleButtonCoordinates[index]"
        @circleButtonClicked="circleButtonClicked"
      >
      </circle-button>
    </div>

    <pie-navigation></pie-navigation>
  </div>
</template>
<script>
import { inject, watchEffect, ref, onMounted } from 'vue'
import TitleButton from './TitleButton.vue'
import CircleButton from './CircleButton.vue'
import PieNavigation from './PieNavigation.vue'

export default {
  name: 'Outgraph',
  setup() {
    const global = inject('global')

    const outgraphref = ref(null)
    let circleButtonCoordinates = []

    onMounted(() => {
      calcCoordinates()
    })

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

    watchEffect(() => calcCoordinates(global.state.scalingFactor))
    watchEffect(() => calcCoordinates(global.state.circleButtonRadius))
    watchEffect(() => calcCoordinates(global.state.displayResultsArray))

    return {
      global,
      outgraphref,
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
</style>
