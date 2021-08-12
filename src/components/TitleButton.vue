<template>
  <div
    class="titlebutton"
    :style="{
      'line-height': 100 * scalingFactor + '%',
      'max-width': 200 * scalingFactor + 'px'
    }"
    v-show="!inputsDisabled && title && !titleMissing"
    ref="titlebutton"
    v-on="{
      mouseover: categoriesOnHover ? hoverButtonTitleOn : null,
      mouseleave: categoriesOnHover ? hoverButtonTitleOff : null
    }"
  >
    <div
      class="buttonicongridcontainer"
      :style="{
        'grid-template-columns': 'auto ' + (0.67 * scalingFactor + 0.33) + 'rem'
      }"
    >
      <button
        class="titlebuttonactual"
        :style="{
          'font-size': 83.4 * scalingFactor + '%',
          'min-width': 50 * scalingFactor + 'px'
        }"
        @click.prevent="titleButton(), hoverButtonTitleOff()"
      >
        {{ title }}
      </button>

      <div class="icongridcontainer">
        <span
          :class="{
            icongriditem1start: !categoriesOnHover,
            icongriditem1center: categoriesOnHover
          }"
          :style="{ 'line-height': 100 * scalingFactor + '%' }"
        >
          <a :href="url" target="_blank"
            ><img
              class="icon"
              :class="{
                iconverticalalignmiddle: categoriesOnHover,
                iconverticalaligntop: !categoriesOnHover
              }"
              :style="{
                height: 0.67 * scalingFactor + 0.33 + 'rem'
              }"
              alt="Wiki"
              src="../assets/images/wikipedia.svg"
          /></a>
        </span>
        <span
          v-if="!categoriesOnHover"
          class="icongriditem2"
          :style="{ 'line-height': 100 * scalingFactor + '%' }"
        >
          <img
            @click="catsClick()"
            class="icon"
            :style="{
              height: 0.67 * scalingFactor + 0.33 + 'rem',
              'vertical-align': 'top'
            }"
            alt="Cats"
            src="../assets/images/document.svg"
          />
        </span>
      </div>
    </div>

    <div
      class="redirect"
      v-if="resultsRedirectsEnabled"
      :style="{ 'font-size': 70 * scalingFactor + '%' }"
    >
      <ul>
        <li>{{ redirect }}</li>
      </ul>
    </div>
  </div>
  <div
    v-if="!inputsDisabled && hoverButtonTitle && categoriesArray.length > 0"
    class="titlebuttonhover"
    :style="{
      '--poslefttitle': hoverRightTitle + 'px',
      '--postoptitle': hoverBottomTitle - 1 + 'px',
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
    scalingFactor: { required: true, default: 1.0, type: Number },
    categoriesOnHover: { required: true, default: true, type: Boolean }
  },
  watch: {
    categoriesOnHover() {
      this.hoverButtonTitleOff()
    },
    inputsDisabled() {
      this.hoverButtonTitleOff()
    }
  },

  methods: {
    hoverButtonTitleOn() {
      this.hoverRightTitle =
        this.$refs['titlebutton'].getBoundingClientRect().left -
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
    },
    catsClick() {
      this.hoverButtonTitle
        ? this.hoverButtonTitleOff()
        : this.hoverButtonTitleOn()
    }
  }
}
</script>
<style scoped>
ul {
  list-style-type: none; /* Remove bullets */
  padding: 0; /* Remove padding */
  margin: 0; /* Remove margins */
  /* indent second and following lines */
  text-indent: -0.5rem;
  margin-left: 0.5rem;
}
ul li {
  text-align: left;
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
.titlebuttonactual {
  border: none;
  padding: 0px;
  background-color: lightgoldenrodyellow;
  overflow-wrap: anywhere;
}
.titlebuttonactual:hover {
  background-color: palegoldenrod;
}

.titlebuttonhover {
  background-color: honeydew;
  border: 1px solid black;
  position: absolute;
  left: var(--poslefttitle);
  top: var(--postoptitle);
  z-index: 5;
}
.redirect {
  background-color: lavender;
}
.buttonicongridcontainer {
  display: grid;
}
.icon:hover {
  filter: invert(1);
}
.icongridcontainer {
  display: inline-grid;
  background-color: mistyrose;
}
.icongriditem1start {
  align-self: start;
}
.icongriditem1center {
  align-self: center;
}
.icongriditem2 {
  align-self: end;
}
.iconverticalaligntop {
  vertical-align: top;
}
.iconverticalalignmiddle {
  vertical-align: middle;
}
</style>
