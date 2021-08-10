<template>
  <div
    v-show="!inputsDisabled"
    class="circlebutton"
    :style="{
      '--angle': 270 + (360 / displayResultsArray.length) * index + 'deg',
      '--radius': circleButtonRadius * scalingFactor + 'px',
      '--minusangle':
        -1 * (270 + (360 / displayResultsArray.length) * index) + 'deg',
      'line-height': 100 * scalingFactor + '%'
    }"
    :ref="`circlebutton${index}`"
    @mouseover="hoverButtonOn(index)"
    @mouseleave="hoverButtonOff(index)"
  >
    <button
      :class="{ missing: displayResultsArray[index].missing }"
      :style="{
        'font-size': 83.4 * scalingFactor + '%'
      }"
      :disabled="
        displayResultsArray[index].missing ||
        (resultsCategoriesEnabled && !resultsCategoriesDone)
      "
      @click.prevent="circleButton(index), hoverButtonOff(index)"
    >
      {{ displayResultsArray[index].title }}
    </button>
    <div
      v-if="!displayResultsArray[index].missing"
      :style="{ 'line-height': 100 * scalingFactor + '%' }"
    >
      <a
        :style="{ 'font-size': 70 * scalingFactor + '%' }"
        :href="displayResultsArray[index].fullurl"
        target="_blank"
        >Show on Wikipedia</a
      >
    </div>
    <div
      v-if="resultsRedirectsEnabled"
      :style="{ 'font-size': 70 * scalingFactor + '%' }"
    >
      <ul
        v-for="(redirect, index) in displayResultsArray[index].redirectFrom"
        :key="index"
      >
        <li>{{ redirect }}</li>
      </ul>
    </div>
  </div>

  <div
    v-if="
      !inputsDisabled &&
      hoverButton &&
      displayResultsArray.length > 0 &&
      resultsCategoriesEnabled &&
      resultsCategoriesDone &&
      displayResultsArray[hoverButtonIndex].categories
    "
    class="circlebuttonhover"
    :style="{
      '--posleft': hoverRight + 'px',
      '--postop': hoverBottom + 'px',
      'font-size': 70 * scalingFactor + '%'
    }"
  >
    <ul
      v-for="category in displayResultsArray[hoverButtonIndex].categories"
      :key="category"
    >
      <li>
        {{ category }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'CircleButton',
  data() {
    return {
      hoverRight: 0,
      hoverBottom: 0,
      hoverButton: false,
      hoverButtonIndex: -1
    }
  },

  emits: ['circleButtonClicked'],
  props: {
    index: { required: true, default: -1, type: Number },
    inputsDisabled: { required: true, default: false, type: Boolean },
    resultsRedirectsEnabled: { required: true, default: true, type: Boolean },
    displayResultsArray: { required: true, default: () => [], type: Array },
    resultsCategoriesEnabled: { required: true, default: true, type: Boolean },
    resultsCategoriesDone: { required: true, default: true, type: Boolean },
    outgraphcanvasref: { required: true, default: {} },
    circleButtonRadius: { required: true, default: 250, type: Number },
    scalingFactor: { required: true, default: 1.0, type: Number }
  },
  methods: {
    hoverButtonOn(index) {
      this.$refs[`circlebutton${index}`].style.zIndex = 3

      this.hoverButtonIndex = index

      this.hoverRight =
        this.$refs[`circlebutton${index}`].getBoundingClientRect().right -
        this.outgraphcanvasref.getBoundingClientRect().left
      this.hoverBottom =
        this.$refs[`circlebutton${index}`].getBoundingClientRect().bottom -
        this.outgraphcanvasref.getBoundingClientRect().top

      this.hoverButton = true
    },
    hoverButtonOff(index) {
      this.$refs[`circlebutton${index}`].style.zIndex = 1
      this.hoverButton = false
      this.hoverButtonIndex = -1
    },
    circleButton(index) {
      this.$emit('circleButtonClicked', index)
    }
  }
}
</script>
<style scoped>
ul {
  list-style-type: none; /* Remove bullets */
  padding: 0; /* Remove padding */
  margin: 0; /* Remove margins */
  white-space: nowrap;
}
.missing {
  color: red;
}

.circlebutton {
  background-color: lightgrey;
  border: 1px solid black;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  /* move pixel position to center of button and arrange in circle - translate(...px) still fix, calc later */
  /* transform: translate(-50%, -50%) rotate(var(--angle)) translate(var(--radius))
    rotate(calc(-1 * var(--angle))); */
  /* using minusangle as extra var as workaround, since calc() in css seems not to work with deg unit in older firefox */
  transform: translate(-50%, -50%) rotate(var(--angle)) translate(var(--radius))
    rotate(var(--minusangle));
}
.circlebuttonhover {
  background-color: lightgrey;
  border: 1px solid black;
  position: absolute;
  left: var(--posleft);
  top: var(--postop);
  z-index: 5;
}
</style>
