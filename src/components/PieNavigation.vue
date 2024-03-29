<template>
  <div
    class="piebackground"
    :style="{
      width: global.state.mobileMode ? radius * 0.6 + 'px' : radius + 'px',

      height: global.state.mobileMode ? radius * 0.6 + 'px' : radius + 'px',
      visibility: global.state.filteredResults.length > 0 ? 'visible' : 'hidden'
    }"
    @pointermove="pieNavigation($event)"
    @pointerdown="mouseDown($event)"
    @pointerup="mouseUp"
    @pointerleave="mouseUp"
    @wheel="wheelSpin($event)"
  >
    <div v-if="resultsClasses.length > 0">
      <div
        v-for="(label, index) in resultsClasses"
        :key="index"
        class="labels"
        :class="{
          mobile: global.state.mobileMode
        }"
        :style="{
          transform: global.state.mobileMode
            ? 'rotate(' +
              (label.midAngle + 270) +
              'deg) translateX(' +
              ((radius / 2) * 0.6 + 15 * 0.6) +
              'px) rotate(' +
              -1 * (label.midAngle + 270) +
              'deg) translate(-50%, -50%)'
            : 'rotate(' +
              (label.midAngle + 270) +
              'deg) translateX(' +
              (radius / 2 + 15) +
              'px) rotate(' +
              -1 * (label.midAngle + 270) +
              'deg) translate(-50%, -50%)'
        }"
      >
        {{ label.chars }}
      </div>
    </div>
  </div>

  <svg
    class="pieslicecontainer"
    viewBox="-1 -1 2 2"
    :style="{
      width: global.state.mobileMode ? radius * 0.6 + 'px' : radius + 'px',
      height: global.state.mobileMode ? radius * 0.6 + 'px' : radius + 'px',
      visibility: global.state.filteredResults.length > 0 ? 'visible' : 'hidden'
    }"
  >
    <clipPath id="piesliceclip">
      <circle cx="0" cy="0" r="1" />
    </clipPath>
    <path id="pieslice" vector-effect="non-scaling-stroke" :d="slice" />
  </svg>

  <span
    :style="{
      visibility: global.state.filteredResults.length > 0 ? 'visible' : 'hidden'
    }"
    class="pagecount"
  >
    <img
      src="@/assets/images/left-arrow.svg"
      @click.prevent="prevItem"
      class="leftarrow svg-icon"
      :class="{ mobile: global.state.mobileMode }"
    />
    <img
      src="@/assets/images/right-arrow.svg"
      @click.prevent="nextItem"
      class="rightarrow svg-icon"
      :class="{ mobile: global.state.mobileMode }"
    />
  </span>
</template>

<script setup>
import { inject, computed, watchEffect, ref } from 'vue'

const global = inject('global')

// variable props not used so not declared with 'const props =' - otherwise tslint error unused var
// https://github.com/vuejs/eslint-plugin-vue/issues/1753
defineProps({
  radius: { required: true, default: 260, type: Number }
})

const slice = ref('')
let mousedown = false
let angle = global.state.pieAngleSaved

function nextItem() {
  let item = global.state.graphFirstItem

  item += 1
  if (item > global.state.filteredResults.length) {
    item -= global.state.filteredResults.length
  }
  angle += 360 / global.state.filteredResults.length

  global.setGraphFirstItem(item)
  drawSlice()
}

const resultsClasses = computed(function () {
  const minimumSliceWidth = 15

  if (global.state.filteredResults.length > 0 && !global.state.inputsDisabled) {
    const classes = []
    const angles = []
    let resultsIndex = 0
    let firstChar = global.state.filteredResults[resultsIndex].title
      .charAt(0)
      .toUpperCase()
    let charCount = 1

    while (resultsIndex < global.state.filteredResults.length) {
      if (
        global.state.filteredResults[resultsIndex + 1] &&
        global.state.filteredResults[resultsIndex + 1].title
          .charAt(0)
          .toUpperCase() === firstChar
      ) {
        resultsIndex++
        charCount++
      } else {
        classes.push({
          firstChar: firstChar,
          sliceAngleWidth:
            charCount * (360 / global.state.filteredResults.length)
        })

        if (global.state.filteredResults[resultsIndex + 1]) {
          firstChar = global.state.filteredResults[resultsIndex + 1].title
            .charAt(0)
            .toUpperCase()
        }

        resultsIndex++
        charCount = 1
      }
    }

    let classesIndex = 0
    let classAngle = 0
    let sliceAngle = 0
    let startAngle = 0
    let first = ''
    let second = ''
    let chars = ''

    while (classesIndex < classes.length) {
      sliceAngle += classes[classesIndex].sliceAngleWidth

      if (first === '') {
        first = classes[classesIndex].firstChar
      } else {
        second = classes[classesIndex].firstChar
      }
      classAngle += classes[classesIndex].sliceAngleWidth

      if (sliceAngle >= minimumSliceWidth) {
        if (second === '') {
          chars = first
        } else {
          chars = first + '-' + second
        }

        angles.push({
          chars: chars,
          startAngle: startAngle,
          endAngle: sliceAngle + startAngle,
          midAngle: sliceAngle + startAngle - sliceAngle / 2
        })
        sliceAngle = 0
        first = ''
        second = ''
        startAngle = classAngle
      }

      classesIndex++

      // if last slice < minimum width and not yet handled, add it
      if (
        classesIndex + 1 === classes.length &&
        angles[angles.length - 1].endAngle -
          angles[angles.length - 1].startAngle <
          minimumSliceWidth
      ) {
        const anglesLastChar = angles[angles.length - 1].chars.slice(-1)

        if (!(anglesLastChar === classes[classesIndex.firstChar])) {
          const addAngle = 360 - angles[angles.length - 1].endAngle
          const lastChar = classes[classes.length - 1].firstChar
          let lastClassChars = angles[angles.length - 1].chars

          if (lastClassChars.length > 1) {
            lastClassChars = lastClassChars.slice(0, -1).concat(lastChar)
          } else {
            lastClassChars = lastClassChars.concat('-').concat(lastChar)
          }

          angles[angles.length - 1].chars = lastClassChars
          angles[angles.length - 1].endAngle += addAngle
          angles[angles.length - 1].midAngle =
            (angles[angles.length - 1].endAngle +
              angles[angles.length - 1].startAngle) /
            2
        }
      }
    }

    return angles
  } else {
    return []
  }
})

function prevItem() {
  let item = global.state.graphFirstItem
  item -= 1
  if (item < 1) {
    item += global.state.filteredResults.length
  }
  angle -= 360 / global.state.filteredResults.length
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
        if (item > global.state.filteredResults.length) {
          item -= global.state.filteredResults.length
        }
        angle += 360 / global.state.filteredResults.length
        break
      case delta > 0:
        item -= 1
        if (item < 1) {
          item += global.state.filteredResults.length
        }
        angle -= 360 / global.state.filteredResults.length
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
    (360 / global.state.filteredResults.length) * (global.state.sizePerPage / 2)
  // clean up over-/undershoot
  angle %= 360

  // map angle range to number/index [+1] of results
  let resultStart = Math.floor(
    Math.max(1, Math.ceil((global.state.filteredResults.length / 360) * angle)),
    10
  )
  if (resultStart < 1) {
    resultStart += global.state.filteredResults.length
  }

  drawSlice()

  // needs to be done here now continuously, instead of in unMounted, since
  // when switching desktop/mobile mode unMounted happens after setup/mount new
  global.setPieAngleSaved(angle)

  global.setGraphFirstItem(resultStart)
}

function calcAngle(x, y) {
  return (Math.atan2(-y, -x) * 180) / Math.PI + 180
}

function drawSlice() {
  if (global.state.sizePerPage >= global.state.filteredResults.length) {
    // slice covers whole circle
    // need to draw using two arcs, otherwise won't work
    slice.value = 'M 1 0 A 1 1 0 0 1 -1 0 M -1 0 A 1 1 0 0 1 1 0'
  } else {
    const anglePerResult = 360 / global.state.filteredResults.length

    const angleStart = angle
    const angleEnd = angle + anglePerResult * global.state.sizePerPage

    const startX = Math.cos((2 * Math.PI * angleStart) / 360)
    const startY = Math.sin((2 * Math.PI * angleStart) / 360)
    const endX = Math.cos((2 * Math.PI * angleEnd) / 360)
    const endY = Math.sin((2 * Math.PI * angleEnd) / 360)

    const largeArc = anglePerResult * global.state.sizePerPage > 180 ? '1' : '0'

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
watchEffect(() => drawSlice(global.state.sizePerPage))
</script>
<style scoped>
img.svg-icon {
  filter: invert(100%) brightness(90%);
}

.piebackground {
  border-radius: 50%;
  background-color: rgb(29, 71, 148);
  /* border and outline half of pieslice stroke width, since half of the stroke on arc is clipped - could also remove arc (using border/outline),
  but might come in handy later for other designs
  could also draw lines and arc in separate paths with lines half stroke width of arc, making 1 px lines possible (arc using 2px,
  half of them clipped), then no outline/border combo needed here */
  outline: 1px solid #666;
  border: 1px solid #666;
  position: absolute;
  left: 50%;
  top: 50%;
  /* move pixel position to center of button */
  transform: translate(-50%, -50%);
  z-index: 1;
  touch-action: none;
}
.labels {
  position: absolute;
  left: 50%;
  top: 50%;
  pointer-events: none;
  touch-action: none;
  font-size: 75%;
}
.labels.mobile {
  font-size: 49.5%;
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
  stroke: #666;
  stroke-width: 2px;
  fill: rgb(78, 147, 170);
  clip-path: url(#piesliceclip);
}

.leftarrow {
  position: absolute;
  transform: translate(-50%, -50%);
  height: 2.65em;
  left: calc(50% - 120px);
  top: calc(50% - 130px);
}
.leftarrow.mobile {
  height: 1.75em;
  left: calc(50% - 74px);
  top: calc(50% - 76px);
}
.rightarrow {
  position: absolute;
  transform: translate(-50%, -50%);
  height: 2.65em;
  left: calc(50% + 120px);
  top: calc(50% - 130px);
}
.rightarrow.mobile {
  height: 1.75em;
  left: calc(50% + 74px);
  top: calc(50% - 76px);
}

@media (hover: hover) and (pointer: fine) {
  .leftarrow:hover,
  .rightarrow:hover {
    filter: invert(100%) brightness(90%) brightness(1.2);
  }
}
</style>
