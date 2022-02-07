<template>
  <div
    class="piebackground"
    :style="{
      width:
        global.state.circleButtonRadius * 1.0 * global.state.scalingFactor +
        'px',
      height:
        global.state.circleButtonRadius * 1.0 * global.state.scalingFactor +
        'px',
      visibility:
        global.state.filteredResultsArray.length > 0 ? 'visible' : 'hidden'
    }"
    @pointermove="pieNavigation($event)"
    @pointerdown="mouseDown($event)"
    @pointerup="mouseUp"
    @pointerleave="mouseUp"
    @wheel="wheelSpin($event)"
  ></div>

  <svg
    class="pieslicecontainer"
    viewBox="-1 -1 2 2"
    :style="{
      width:
        global.state.circleButtonRadius * 1.0 * global.state.scalingFactor +
        'px',
      height:
        global.state.circleButtonRadius * 1.0 * global.state.scalingFactor +
        'px',
      visibility:
        global.state.filteredResultsArray.length > 0 ? 'visible' : 'hidden'
    }"
  >
    <clipPath id="piesliceclip">
      <circle cx="0" cy="0" r="1" />
    </clipPath>
    <path id="pieslice" vector-effect="non-scaling-stroke" :d="slice" />
  </svg>

  <span
    :style="{
      visibility:
        global.state.filteredResultsArray.length > 0 && global.state.mobileMode
          ? 'visible'
          : 'hidden'
    }"
    class="pagecount"
  >
    <img
      src="../assets/images/left-arrow.svg"
      @click="prevItem"
      class="leftarrow"
      :style="{
        height:
          global.state.circleButtonRadius * 0.01 * global.state.scalingFactor +
          'em',
        top: 32 - global.state.circleButtonRadius / 200 + '%',
        left: 40 - global.state.circleButtonRadius * 0.007 + '%'
      }"
      :class="{
        itemdisabled:
          global.state.inputsDisabled ||
          global.state.filteredResultsArray.length === 0 ||
          (global.state.mobileMode &&
            (global.state.mobileDisplay === 'maininfo' ||
              global.state.mobileDisplay === 'categories'))
      }"
    />
    <img
      src="../assets/images/right-arrow.svg"
      @click="nextItem"
      class="rightarrow"
      :style="{
        height:
          global.state.circleButtonRadius * 0.01 * global.state.scalingFactor +
          'em',
        top: 32 - global.state.circleButtonRadius / 200 + '%',
        left: 60 + global.state.circleButtonRadius * 0.007 + '%'
      }"
      :class="{
        itemdisabled:
          global.state.inputsDisabled ||
          global.state.filteredResultsArray.length === 0 ||
          (global.state.mobileMode &&
            (global.state.mobileDisplay === 'maininfo' ||
              global.state.mobileDisplay === 'categories'))
      }"
    />
  </span>
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

    function nextItem() {
      let item = global.state.graphFirstItem

      item += 1
      if (item > global.state.filteredResultsArray.length) {
        item -= global.state.filteredResultsArray.length
      }
      angle += 360 / global.state.filteredResultsArray.length

      global.setGraphFirstItem(item)
      drawSlice()
    }

    function prevItem() {
      let item = global.state.graphFirstItem
      item -= 1
      if (item < 1) {
        item += global.state.filteredResultsArray.length
      }
      angle -= 360 / global.state.filteredResultsArray.length
      global.setGraphFirstItem(item)
      drawSlice()
    }

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
      pieNavigation(event)
    }
    function mouseUp() {
      mousedown = false
    }

    function pieNavigation(event) {
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

        doNavigation(x, y)
      }
    }

    function doNavigation(x, y) {
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

        slice.value = `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArc} 1 ${endX} ${endY} L 0 0`
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
      pieNavigation,
      mouseDown,
      mouseUp,
      wheelSpin,
      prevItem,
      nextItem,
      slice
    }
  }
}
</script>
<style scoped>
.piebackground {
  border-radius: 50%;
  background-color: cornflowerblue;
  /* border and outline half of pieslice stroke width, since half of the stroke on arc is clipped - could also remove arc (using border/outline),
  but might come in handy later for other designs
  could also draw lines and arc in separate paths with lines half stroke width of arc, making 1 px lines possible (arc using 2px,
  half of them clipped), then no outline/border combo needed here */
  outline: 1px solid black;
  border: 1px solid black;
  position: absolute;
  left: 50%;
  top: 50%;
  /* move pixel position to center of button */
  transform: translate(-50%, -50%);
  z-index: 1;
  touch-action: none;
}
.pieslicecontainer {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 2;
  pointer-events: none;
  transform: translate(-50%, -50%) rotate(-90deg);
}
#pieslice {
  stroke: black;
  stroke-width: 2px;
  fill: lightblue;
  clip-path: url(#piesliceclip);
}

.leftarrow {
  position: absolute;
  /* left: 37.5%; */
  /* top: 31%; */

  transform: translate(-50%, -50%);
}
.rightarrow {
  position: absolute;
  /* left: 62.5%; */
  /* top: 31%; */

  transform: translate(-50%, -50%);
}
@media (hover: hover) and (pointer: fine) {
  .leftarrow:hover,
  .rightarrow:hover {
    filter: invert(0.5);
  }
}
</style>
