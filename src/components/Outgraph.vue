<template>
  <div class="outgraph" ref="outgraphref">
    <title-button
      :outgraphref="outgraphref"
      @titleButtonClicked="titleButtonClicked"
    ></title-button>

    <div v-for="(page, index) in global.state.displayResultsArray" :key="index">
      <circle-button
        :index="index"
        :outgraphref="outgraphref"
        :coordinates="circleButtonCoordinates.value[index]"
        @circleButtonClicked="circleButtonClicked"
      >
      </circle-button>
    </div>

    <pie-navigation :radius="pieNavigationRadius"></pie-navigation>
  </div>
</template>
<script>
import {
  inject,
  watchEffect,
  ref,
  onMounted,
  nextTick,
  reactive,
  onUnmounted
} from 'vue'
import TitleButton from './TitleButton.vue'
import CircleButton from './CircleButton.vue'
import PieNavigation from './PieNavigation.vue'

export default {
  name: 'Outgraph',
  setup() {
    const global = inject('global')

    onMounted(() => {
      window.addEventListener('resize', calcCoordinates)
      calcCoordinates()
    })

    const pieNavigationRadius = 260

    const outgraphref = ref(null)
    let circleButtonCoordinates = reactive([])
    // init empty, otherwise not defined and error in mobile mode switch back from other than outgraph mode
    circleButtonCoordinates.value = []

    async function calcCoordinates() {
      await nextTick()

      if (outgraphref.value) {
        const width = outgraphref.value.offsetWidth
        const height = outgraphref.value.offsetHeight

        const pieWidth = global.state.mobileMode
          ? pieNavigationRadius * 0.66
          : pieNavigationRadius
        const pieHeight = global.state.mobileMode
          ? pieNavigationRadius * 0.66
          : pieNavigationRadius

        const pieMinX = width / 2 - pieWidth / 2
        const pieMaxX = width / 2 + pieWidth / 2
        const pieMinY = height / 2 - pieHeight / 2
        const pieMaxY = height / 2 + pieHeight / 2

        // fix button (max-)width/height later, still calced as in circle
        const itemWidth = global.state.mobileMode ? 150 * 0.66 : 150
        const itemHeight = global.state.mobileMode ? 100 * 0.66 : 100

        const xCount = Math.floor(width / itemWidth)
        const yCount = Math.floor(height / itemHeight)
        const xSpace = width % itemWidth
        const ySpace = height % itemHeight

        // using temp in order not to overwrite coordinates prop on buttons while calculating
        let CoordinatesTemp = []

        for (let y = 0; y < yCount; y++) {
          for (let x = 0; x < xCount; x++) {
            const xCoord = x * itemWidth + xSpace / 2 + itemWidth / 2
            const yCoord = y * itemHeight + ySpace / 2 + itemHeight / 2

            if (
              !(xCoord > pieMinX - itemWidth / 2) ||
              !(xCoord < pieMaxX + itemWidth / 2) ||
              !(yCoord > pieMinY - itemHeight / 2) ||
              !(yCoord < pieMaxY + itemHeight / 2)
            ) {
              CoordinatesTemp.push({
                x: xCoord,
                y: yCoord
              })
            }
          }
        }

        global.setSizePerPage(CoordinatesTemp.length)
        circleButtonCoordinates.value = CoordinatesTemp
      }
    }

    watchEffect(() => calcCoordinates(global.state.displayResultsArray))
    watchEffect(() => calcCoordinates(global.state.mobileMode))
    watchEffect(() => calcCoordinates(global.state.checkboxFilterEnabled))
    watchEffect(() => calcCoordinates(global.state.showCatsRedir))

    onUnmounted(() => {
      window.removeEventListener('resize', calcCoordinates)
    })

    return {
      global,
      outgraphref,
      circleButtonCoordinates,
      pieNavigationRadius
    }
  },
  components: { TitleButton, CircleButton, PieNavigation },
  emits: ['circleButtonClicked', 'titleButtonClicked'],

  methods: {
    circleButtonClicked(index) {
      this.$emit('circleButtonClicked', index)
    },
    titleButtonClicked() {
      this.$emit('titleButtonClicked')
    }
  }
}
</script>
<style scoped>
.outgraph {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
