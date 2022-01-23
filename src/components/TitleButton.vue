<template>
  <div
    class="titlebutton"
    :class="{ hoverdisabled: !global.state.categoriesOnHover }"
    :style="{
      'line-height': 100 * global.state.scalingFactor + '%',
      'max-width': 200 * global.state.scalingFactor + 'px'
    }"
    v-show="
      global.state.resultsRedirectsEnabled
        ? !global.state.inputsDisabled &&
          title &&
          !titleMissing &&
          global.state.redirectsDone
        : !global.state.inputsDisabled && title && !titleMissing
    "
    ref="titlebutton"
    v-on="{ mouseenter: initHoverButtonTitleCoords }"
  >
    <div
      class="buttonicongridcontainer"
      :style="{
        'grid-template-columns':
          'auto ' + (0.67 * global.state.scalingFactor + 0.33) + 'rem'
      }"
    >
      <button
        class="titlebuttonactual"
        :style="{
          'font-size': 83.4 * global.state.scalingFactor + '%',
          'min-width': 50 * global.state.scalingFactor + 'px'
        }"
        @click.prevent="titleButton(), hoverButtonTitleOff()"
      >
        {{ title }}
      </button>

      <div class="icongridcontainer">
        <span
          :class="{
            icongriditem1start: !global.state.categoriesOnHover,
            icongriditem1center: global.state.categoriesOnHover
          }"
          :style="{ 'line-height': 100 * global.state.scalingFactor + '%' }"
        >
          <a :href="url" target="_blank"
            ><img
              class="icon"
              :class="{
                iconverticalalignmiddle: global.state.categoriesOnHover,
                iconverticalaligntop: !global.state.categoriesOnHover
              }"
              :style="{
                height: 0.67 * global.state.scalingFactor + 0.33 + 'rem'
              }"
              alt="Wiki"
              src="../assets/images/wikipedia.svg"
          /></a>
        </span>
        <span
          v-if="!global.state.categoriesOnHover"
          class="icongriditem2"
          :style="{ 'line-height': 100 * global.state.scalingFactor + '%' }"
        >
          <img
            @click="catsClick()"
            class="icon"
            :style="{
              height: 0.67 * global.state.scalingFactor + 0.33 + 'rem',
              'vertical-align': 'top'
            }"
            alt="Cats"
            src="../assets/images/document.svg"
          />
        </span>
      </div>
    </div>

    <div
      class="redirects"
      v-if="global.state.resultsRedirectsEnabled && global.state.redirectsDone"
      :style="{
        'font-size': 70 * global.state.scalingFactor + '%',
        '--maxheight':
          global.state.circleButtonRadius * global.state.scalingFactor * 0.3 +
          'px'
      }"
    >
      <ul>
        <li v-for="(redirect, index) in redirects" :key="index">
          {{ redirect }}
        </li>
      </ul>
    </div>
  </div>

  <div
    v-if="!global.state.inputsDisabled && categoriesArray.length > 0"
    class="titlebuttonhover"
    :class="{
      titlebuttonhoverdisplayoverride: titleButtonHoverOverride,
      hoverdisabled: !global.state.categoriesOnHover
    }"
    :style="{
      '--poslefttitle': hoverRightTitle + 'px',
      '--postoptitle': hoverBottomTitle - 1 + 'px',
      'font-size': 70 * global.state.scalingFactor + '%',
      '--maxheight':
        global.state.circleButtonRadius * global.state.scalingFactor * 0.3 +
        'px'
    }"
  >
    <ul>
      <li v-for="category in categoriesArray" :key="category">
        {{ category }}
      </li>
    </ul>
  </div>
</template>
<script>
import { inject, ref, watchEffect, nextTick } from 'vue'

export default {
  name: 'TitleButton',
  setup(props) {
    const global = inject('global')

    // template ref
    const titlebutton = ref(null)

    // instance data
    const hoverRightTitle = ref(0)
    const hoverBottomTitle = ref(0)
    const titleButtonHoverOverride = ref(false)

    function initHoverButtonTitleCoords() {
      if (props.outgraphcanvasref) {
        if (
          titlebutton.value &&
          props.outgraphcanvasref.getBoundingClientRect
        ) {
          hoverRightTitle.value =
            titlebutton.value.getBoundingClientRect().left -
            props.outgraphcanvasref.getBoundingClientRect().left
          hoverBottomTitle.value =
            titlebutton.value.getBoundingClientRect().bottom -
            props.outgraphcanvasref.getBoundingClientRect().top
        }
      }
    }
    async function initHoverButtonTitleCoordsNextTick() {
      await nextTick()
      initHoverButtonTitleCoords()
    }

    function titleButtonHoverOverrideOff() {
      titleButtonHoverOverride.value = false
    }
    function catsClick() {
      if (!titleButtonHoverOverride.value) {
        initHoverButtonTitleCoords()
        titleButtonHoverOverride.value = true
      } else titleButtonHoverOverride.value = false
    }

    watchEffect(() =>
      initHoverButtonTitleCoordsNextTick(global.state.resultsRedirectsEnabled)
    )
    watchEffect(() =>
      initHoverButtonTitleCoordsNextTick(global.state.scalingFactor)
    )
    watchEffect(() =>
      initHoverButtonTitleCoordsNextTick(global.state.circleButtonRadius)
    )
    watchEffect(() =>
      titleButtonHoverOverrideOff(global.state.categoriesOnHover)
    )
    watchEffect(() => titleButtonHoverOverrideOff(global.state.inputsDisabled))

    return {
      global,
      titlebutton,
      hoverRightTitle,
      hoverBottomTitle,
      titleButtonHoverOverride,
      initHoverButtonTitleCoords,
      catsClick
    }
  },
  props: {
    title: { required: true, default: '', type: String },
    redirects: { required: true, default: () => [], type: Array },
    categoriesArray: { required: true, default: () => [], type: Array },
    titleMissing: { required: true, default: true, type: Boolean },
    url: { required: true, default: '', type: String },
    outgraphcanvasref: { required: true, default: {} }
  },
  methods: {
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
  padding: 0;
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
  max-height: var(--maxheight);
  overflow-y: auto;
  display: none;
}

.titlebuttonhoverdisplayoverride {
  display: block;
}

.titlebutton:hover {
  z-index: 3;
}

.titlebutton:not(.hoverdisabled):hover + .titlebuttonhover:not(.hoverdisabled) {
  display: block;
}

.titlebuttonhover:hover {
  display: block;
}

.redirects {
  background-color: lavender;
  max-height: var(--maxheight);
  overflow-y: auto;
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
