<template>
  <div
    v-show="!inputsDisabled"
    class="circlebutton"
    :style="{
      '--angle': 270 + (360 / displayResultsArray.length) * index + 'deg'
    }"
    :ref="`circlebutton${index}`"
    @mouseover="hoverButtonOn(index)"
    @mouseleave="hoverButtonOff(index)"
  >
    <button
      :class="{ missing: displayResultsArray[index].missing }"
      :disabled="
        displayResultsArray[index].missing ||
        (resultsCategoriesEnabled && !resultsCategoriesDone)
      "
      @click.prevent="circleButton(index), hoverButtonOff(index)"
    >
      {{ displayResultsArray[index].title }}
    </button>
    <div v-if="!displayResultsArray[index].missing">
      <a
        :style="{ 'font-size': '0.7rem' }"
        :href="displayResultsArray[index].fullurl"
        target="_blank"
        >Show on Wikipedia</a
      >
    </div>
    <div v-if="resultsRedirectsEnabled" :style="{ 'font-size': '0.7rem' }">
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
      '--postop': hoverBottom + 'px'
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
  props: {
    index: { required: true, default: -1, type: Number },
    inputsDisabled: { required: true, default: false, type: Boolean },
    resultsRedirectsEnabled: { required: true, default: true, type: Boolean },
    displayResultsArray: { required: true, default: () => [], type: Array },
    resultsCategoriesEnabled: { required: true, default: true, type: Boolean },
    resultsCategoriesDone: { required: true, default: true, type: Boolean }
  },
  methods: {
    hoverButtonOn(index) {
      this.$refs[`circlebutton${index}`].style.zIndex = 3

      this.hoverButtonIndex = index
      this.hoverRight =
        this.$refs[`circlebutton${index}`].getBoundingClientRect().right -
        this.$parent.$refs['outgraphcanvas'].getBoundingClientRect().left
      this.hoverBottom =
        this.$refs[`circlebutton${index}`].getBoundingClientRect().bottom -
        this.$parent.$refs['outgraphcanvas'].getBoundingClientRect().top

      // setTimeout(() => (this.hoverButton = true), 1000)
      this.hoverButton = true
    },
    hoverButtonOff(index) {
      this.$refs[`circlebutton${index}`].style.zIndex = 1
      this.hoverButton = false
      this.hoverButtonIndex = -1
    },
    circleButton(index) {
      this.$parent.$emit('circleButtonClicked', index)
    }
  }
}
</script>
<style scoped>
ul {
  list-style-type: none; /* Remove bullets */
  padding: 0; /* Remove padding */
  margin: 0; /* Remove margins */
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
  transform: translate(-50%, -50%) rotate(var(--angle)) translate(250px)
    rotate(calc(-1 * var(--angle)));
}
.circlebuttonhover {
  font-size: 0.7rem;
  background-color: lightgrey;
  border: 1px solid black;
  position: absolute;
  left: var(--posleft);
  top: var(--postop);
  z-index: 5;
  /* left: 0px;
  top: 0px; */
}
</style>
