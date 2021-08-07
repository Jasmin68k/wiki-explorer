<template>
  <div
    class="titlebutton"
    :style="{
      'line-height': 100 * scalingFactor + '%'
    }"
    v-show="!inputsDisabled && title && !titleMissing"
    ref="titlebutton"
    @mouseover="hoverButtonTitleOn"
    @mouseleave="hoverButtonTitleOff"
  >
    <button
      :style="{
        'font-size': 83.4 * scalingFactor + '%'
      }"
      @click.prevent="titleButton(), hoverButtonTitleOff()"
    >
      {{ title }}
    </button>
    <div
      v-if="resultsRedirectsEnabled"
      :style="{ 'font-size': 70 * scalingFactor + '%' }"
    >
      {{ redirect }}
    </div>
  </div>
  <div
    v-if="!inputsDisabled && hoverButtonTitle && categoriesArray.length > 0"
    class="titlebuttonhover"
    :style="{
      '--poslefttitle': hoverRightTitle + 'px',
      '--postoptitle': hoverBottomTitle + 'px',
      'font-size': 70 * scalingFactor + '%'
    }"
  >
    <ul v-for="category in categoriesArray" :key="category">
      <li>
        {{ category }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'TitleButton',
  data() {
    return {
      hoverRightTitle: 0,
      hoverBottomTitle: 0,
      hoverButtonTitle: false
    }
  },
  props: {
    inputsDisabled: { required: true, default: false, type: Boolean },
    title: { required: true, default: '', type: String },
    resultsRedirectsEnabled: { required: true, default: true, type: Boolean },
    redirect: { required: true, default: '', type: String },
    categoriesArray: { required: true, default: () => [], type: Array },
    titleMissing: { required: true, default: true, type: Boolean },
    url: { required: true, default: '', type: String },
    outgraphcanvasref: { required: true, default: {} },
    scalingFactor: { required: true, default: 1.0, type: Number }
  },
  methods: {
    hoverButtonTitleOn() {
      this.hoverRightTitle =
        this.$refs['titlebutton'].getBoundingClientRect().right -
        this.outgraphcanvasref.getBoundingClientRect().left
      this.hoverBottomTitle =
        this.$refs['titlebutton'].getBoundingClientRect().bottom -
        this.outgraphcanvasref.getBoundingClientRect().top

      this.hoverButtonTitle = true
    },
    hoverButtonTitleOff() {
      this.hoverButtonTitle = false
    },
    titleButton() {
      // window.location = this.url
      window.open(this.url, '_blank')
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

.titlebutton {
  background-color: lightgrey;
  border: 1px solid black;
  position: absolute;
  left: 50%;
  top: 50%;
  /* move pixel position to center of button */
  transform: translate(-50%, -50%);
  z-index: 1;
}

.titlebuttonhover {
  background-color: lightgrey;
  border: 1px solid black;
  position: absolute;
  left: var(--poslefttitle);
  top: var(--postoptitle);
  z-index: 5;
}
</style>
