<template>
  <div
    class="piebackground"
    :style="{
      width:
        global.state.circleButtonRadius * 0.85 * global.state.scalingFactor +
        'px',
      height:
        global.state.circleButtonRadius * 0.85 * global.state.scalingFactor +
        'px',
      visibility:
        global.state.filteredResultsArray.length > 0 ? 'visible' : 'hidden'
    }"
    @mousemove="pieNavigationClicked($event)"
    @mousedown="mouseDown($event)"
    @mouseup="mouseUp"
  ></div>
</template>
<script>
import { inject } from 'vue'

export default {
  name: 'PieNavigation',
  setup() {
    const global = inject('global')

    let mousedown = false

    function mouseDown(event) {
      mousedown = true
      //for init on click before move
      pieNavigationClicked(event)
    }
    function mouseUp() {
      mousedown = false
    }

    function pieNavigationClicked(event) {
      // normalize coordinates to unit circle
      const xRaw =
        (event.offsetX - event.target.offsetWidth / 2) /
        (event.target.offsetWidth / 2)
      const yRaw =
        (event.offsetY - event.target.offsetHeight / 2) /
        (event.target.offsetHeight / 2)
      const length = Math.sqrt(xRaw * xRaw + yRaw * yRaw)
      const x = xRaw / length
      const y = yRaw / length

      let angle = (Math.atan2(-y, -x) * 180) / Math.PI + 180

      // map to 0 degrees on top of circle
      angle += 90
      angle %= 360
      if (mousedown) {
        // map angle range to number/index [+1] of results
        let resultStart = parseInt(
          Math.max(
            1,
            Math.ceil((global.state.filteredResultsArray.length / 360) * angle)
          ),
          10
        )

        // map mouse to middle of pie slice - not always precise, depending on odd/even sizePerPage, maybe
        // use precise version with proper angle calc later
        resultStart -= parseInt(global.state.sizePerPage / 2, 10)
        if (resultStart < 1) {
          resultStart += global.state.filteredResultsArray.length
        }

        global.setGraphFirstItem(resultStart)
      }
    }

    return {
      global,
      pieNavigationClicked,
      mouseDown,
      mouseUp
    }
  }
}
</script>
<style scoped>
.piebackground {
  border-radius: 50%;
  background-color: lightblue;
  border: 1px solid black;
  position: absolute;
  left: 50%;
  top: 50%;
  /* move pixel position to center of button */
  transform: translate(-50%, -50%);
  z-index: 1;
}
</style>
