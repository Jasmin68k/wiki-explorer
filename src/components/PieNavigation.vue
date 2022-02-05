<template>
  <div
    class="piebackground"
    :style="{
      width:
        global.state.circleButtonRadius * 0.9 * global.state.scalingFactor +
        'px',
      height:
        global.state.circleButtonRadius * 0.9 * global.state.scalingFactor +
        'px',
      visibility:
        global.state.filteredResultsArray.length > 0 ? 'visible' : 'hidden'
    }"
    @mousemove="pieNavigationClicked($event)"
    @mousedown="mouseDown($event)"
    @mouseup="mouseUp"
    @wheel="wheelSpin($event)"
  ></div>

  <svg
    class="pieslicecontainer"
    viewBox="-1 -1 2 2"
    :style="{
      width:
        global.state.circleButtonRadius * 0.9 * global.state.scalingFactor +
        'px',
      height:
        global.state.circleButtonRadius * 0.9 * global.state.scalingFactor +
        'px',
      visibility:
        global.state.filteredResultsArray.length > 0 ? 'visible' : 'hidden'
    }"
  >
    <path class="pieslice" vector-effect="non-scaling-stroke" :d="slice" />
  </svg>
</template>
<script>
import { inject, watchEffect, ref } from 'vue'

export default {
  name: 'PieNavigation',
  setup() {
    const global = inject('global')

    let slice = ref('')
    let mousedown = false
    let angle = 0

    function wheelSpin(event) {
      const delta = event.wheelDeltaY

      if (delta !== 0) {
        let item = global.state.graphFirstItem

        switch (true) {
          case delta < 0:
            item += 1
            if (item > global.state.filteredResultsArray.length) {
              item -= global.state.filteredResultsArray.length
            }
            angle += 360 / global.state.filteredResultsArray.length
            break
          case delta > 0:
            item -= 1
            if (item < 1) {
              item += global.state.filteredResultsArray.length
            }
            angle -= 360 / global.state.filteredResultsArray.length
            break
        }
        global.setGraphFirstItem(item)
        drawSlice()
      }
    }

    function mouseDown(event) {
      mousedown = true
      //for init on click before move
      pieNavigationClicked(event)
    }
    function mouseUp() {
      mousedown = false
    }

    function pieNavigationClicked(event) {
      if (mousedown) {
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

        angle = calcAngle(x, y)

        // map to 0 degrees on top of circle
        angle += 90
        // map mouse pointer to middle of slice
        angle -=
          (360 / global.state.filteredResultsArray.length) *
          (global.state.sizePerPage / 2)
        // clean up over-/undershoot
        angle %= 360

        // map angle range to number/index [+1] of results
        let resultStart = parseInt(
          Math.max(
            1,
            Math.ceil((global.state.filteredResultsArray.length / 360) * angle)
          ),
          10
        )
        if (resultStart < 1) {
          resultStart += global.state.filteredResultsArray.length
        }

        drawSlice()

        global.setGraphFirstItem(resultStart)
      }
    }

    function calcAngle(x, y) {
      return (Math.atan2(-y, -x) * 180) / Math.PI + 180
    }

    function drawSlice() {
      if (
        global.state.sizePerPage >= global.state.filteredResultsArray.length
      ) {
        // slice covers whole circle
        // need to draw using two arcs, otherwise won't work
        slice.value = 'M 1 0 A 1 1 0 0 1 -1 0 M -1 0 A 1 1 0 0 1 1 0'
      } else {
        const anglePerResult = 360 / global.state.filteredResultsArray.length

        const angleStart = angle
        const angleEnd = angle + anglePerResult * global.state.sizePerPage

        const startX = Math.cos((2 * Math.PI * angleStart) / 360)
        const startY = Math.sin((2 * Math.PI * angleStart) / 360)
        const endX = Math.cos((2 * Math.PI * angleEnd) / 360)
        const endY = Math.sin((2 * Math.PI * angleEnd) / 360)

        const largeArc =
          anglePerResult * global.state.sizePerPage > 180 ? '1' : '0'

        slice.value = `M ${startX} ${startY} A 1 1 0 ${largeArc} 1 ${endX} ${endY} L 0 0 L ${startX} ${startY}`
      }
    }

    //reset slice to start, when indexStart is reset (which happens on new title, filters changed etc.)
    function resetSlice() {
      if (global.state.indexStart === 0) {
        angle = calcAngle(1, 0)
        drawSlice()
      }
    }
    watchEffect(() => resetSlice(global.state.indexStart))

    return {
      global,
      pieNavigationClicked,
      mouseDown,
      mouseUp,
      wheelSpin,
      slice
    }
  }
}
</script>
<style scoped>
.piebackground {
  border-radius: 50%;
  background-color: cornflowerblue;
  /* border: 1px solid black; */
  position: absolute;
  left: 50%;
  top: 50%;
  /* move pixel position to center of button */
  transform: translate(-50%, -50%);
  z-index: 1;
}
.pieslicecontainer {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 2;
  pointer-events: none;
  transform: translate(-50%, -50%) rotate(-90deg);
}
.pieslice {
  fill: lightblue;
  /* stroke: black;
  stroke-width: 1px; */
}
</style>
