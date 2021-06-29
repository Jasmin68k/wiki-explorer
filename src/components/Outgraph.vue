<template>
  <div class="outgraph">
    <canvas class="outgraphcanvas" ref="outgraphcanvas"></canvas>

    <div
      class="titlebutton"
      v-show="!inputsDisabled && returnedTitle && !titleMissing"
      ref="titlebutton"
      @mouseover="hoverButtonTitleOn"
      @mouseleave="hoverButtonTitleOff"
    >
      <button @click.prevent="titleButton(), hoverButtonTitleOff()">
        {{ returnedTitle }}
      </button>
      <div v-if="resultsRedirectsEnabled" :style="{ 'font-size': '0.7rem' }">
        {{ returnedRedirect }}
      </div>
    </div>
    <div
      v-show="!inputsDisabled"
      class="circlebutton"
      v-for="(page, index) in displayResultsArray"
      :key="index"
      :style="{
        '--angle': 270 + (360 / displayResultsArray.length) * index + 'deg'
      }"
      :ref="`circlebutton${index}`"
      @mouseover="hoverButtonOn(index)"
      @mouseleave="hoverButtonOff"
    >
      <button
        :class="{ missing: page.missing }"
        :disabled="
          page.missing || (resultsCategoriesEnabled && !resultsCategoriesDone)
        "
        @click.prevent="circleButton(index), hoverButtonOff()"
      >
        {{ page.title }}
      </button>
      <div v-if="!page.missing">
        <a
          :style="{ 'font-size': '0.7rem' }"
          :href="displayResultsArray[index].fullurl"
          target="_blank"
          >Show on Wikipedia</a
        >
      </div>
      <div v-if="resultsRedirectsEnabled" :style="{ 'font-size': '0.7rem' }">
        <ul v-for="(redirect, index) in page.redirectFrom" :key="index">
          <li>{{ redirect }}</li>
        </ul>
      </div>
    </div>

    <div
      v-if="
        !inputsDisabled &&
        hoverButtonTitle &&
        categoriesArray.length > 0 &&
        resultsCategoriesEnabled
      "
      class="titlebuttonhover"
      :style="{
        '--poslefttitle': hoverRightTitle + 'px',
        '--postoptitle': hoverBottomTitle + 'px'
      }"
    >
      <ul v-for="category in categoriesArray" :key="category">
        <li>
          {{ category }}
        </li>
      </ul>
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
  </div>
</template>
<script>
export default {
  name: 'Outgraph',

  // avoid vue bug https://github.com/vuejs/vue-next/issues/2540 [just console warning]
  // should not be needed, when fixed
  // interestingly, this component doesn't show bug, even when this is omitted
  emits: ['circleButtonClicked'],

  data() {
    return {
      hoverRightTitle: 0,
      hoverBottomTitle: 0,
      hoverRight: 0,
      hoverBottom: 0,
      hoverButton: false,
      hoverButtonTitle: false,
      hoverButtonIndex: -1
    }
  },
  props: {
    inputsDisabled: { required: true, default: false, type: Boolean },
    returnedTitle: { required: true, default: '', type: String },
    returnedUrl: { required: true, default: '', type: String },
    resultsRedirectsEnabled: { required: true, default: true, type: Boolean },
    returnedRedirect: { required: true, default: '', type: String },
    displayResultsArray: { required: true, default: () => [], type: Array },
    categoriesArray: { required: true, default: () => [], type: Array },
    resultsCategoriesEnabled: { required: true, default: true, type: Boolean },
    resultsCategoriesDone: { required: true, default: true, type: Boolean },
    titleMissing: { required: true, default: true, type: Boolean }
  },

  watch: {
    displayResultsArray() {
      if (this.displayResultsArray.length > 0 && !this.inputsDisabled) {
        this.drawLines()
      } else this.clearCanvas()
    }
  },
  methods: {
    clearCanvas() {
      const canvas = document.getElementsByClassName('outgraphcanvas')[0]
      const ctx = canvas.getContext('2d')
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      canvas.width = width
      canvas.height = height
      ctx.clearRect(0, 0, width, height)
    },
    drawLines() {
      const canvas = document.getElementsByClassName('outgraphcanvas')[0]
      const ctx = canvas.getContext('2d')
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      canvas.width = width
      canvas.height = height

      const middleX = width / 2
      const middleY = height / 2
      for (let i = 0; i < this.displayResultsArray.length; i++) {
        ctx.beginPath()
        ctx.moveTo(middleX, middleY)
        const angle =
          ((270 + (360 / this.displayResultsArray.length) * i) * Math.PI) / 180
        const length = 250
        ctx.lineTo(
          length * Math.cos(angle) + middleX,
          length * Math.sin(angle) + middleY
        )
        ctx.stroke()
      }
    },
    hoverButtonTitleOn() {
      this.hoverRightTitle =
        this.$refs['titlebutton'].getBoundingClientRect().right -
        this.$refs['outgraphcanvas'].getBoundingClientRect().left
      this.hoverBottomTitle =
        this.$refs['titlebutton'].getBoundingClientRect().bottom -
        this.$refs['outgraphcanvas'].getBoundingClientRect().top

      // setTimeout(() => (this.hoverButtonTitle = true), 1000)
      this.hoverButtonTitle = true
    },
    hoverButtonTitleOff() {
      this.hoverButtonTitle = false
    },
    titleButton() {
      // window.location = this.returnedUrl
      window.open(this.returnedUrl, '_blank')
    },
    hoverButtonOn(index) {
      this.hoverButtonIndex = index
      this.hoverRight =
        this.$refs[`circlebutton${index}`].getBoundingClientRect().right -
        this.$refs['outgraphcanvas'].getBoundingClientRect().left
      this.hoverBottom =
        this.$refs[`circlebutton${index}`].getBoundingClientRect().bottom -
        this.$refs['outgraphcanvas'].getBoundingClientRect().top

      // setTimeout(() => (this.hoverButton = true), 1000)
      this.hoverButton = true
    },
    hoverButtonOff() {
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
}
.missing {
  color: red;
}
.outgraph {
  margin: auto;
  position: relative;
  width: 1200px;
  height: 600px;
  /* border: 1px solid black; */
}
.outgraphcanvas {
  width: 100%;
  height: 100%;
}
.titlebutton {
  background-color: lightgrey;
  border: 1px solid black;
  position: absolute;
  left: 50%;
  top: 50%;
  /* move pixel position to center of button */
  transform: translate(-50%, -50%);
}
.circlebutton {
  background-color: lightgrey;
  border: 1px solid black;
  position: absolute;
  left: 50%;
  top: 50%;
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
  /* left: 0px;
  top: 0px; */
}
.titlebuttonhover {
  font-size: 0.7rem;
  background-color: lightgrey;
  border: 1px solid black;
  position: absolute;
  left: var(--poslefttitle);
  top: var(--postoptitle);
  /* left: 0px;
  top: 0px; */
}
</style>
