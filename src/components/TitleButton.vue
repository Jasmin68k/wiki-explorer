<template>
  <div
    class="titlebutton"
    :class="{ hoverdisabled: !global.state.categoriesOnHover }"
    :style="{
      'line-height': 100 * scalingFactor + '%',
      'max-width': 200 * scalingFactor + 'px'
    }"
    v-show="
      global.state.resultsRedirectsEnabled
        ? !inputsDisabled && title && !titleMissing && redirectsDone
        : !inputsDisabled && title && !titleMissing
    "
    ref="titlebutton"
    v-on="{ mouseenter: initHoverButtonTitleCoords }"
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
            icongriditem1start: !global.state.categoriesOnHover,
            icongriditem1center: global.state.categoriesOnHover
          }"
          :style="{ 'line-height': 100 * scalingFactor + '%' }"
        >
          <a :href="url" target="_blank"
            ><img
              class="icon"
              :class="{
                iconverticalalignmiddle: global.state.categoriesOnHover,
                iconverticalaligntop: !global.state.categoriesOnHover
              }"
              :style="{
                height: 0.67 * scalingFactor + 0.33 + 'rem'
              }"
              alt="Wiki"
              src="../assets/images/wikipedia.svg"
          /></a>
        </span>
        <span
          v-if="!global.state.categoriesOnHover"
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
      class="redirects"
      v-if="global.state.resultsRedirectsEnabled && redirectsDone"
      :style="{
        'font-size': 70 * scalingFactor + '%',
        '--maxheight': circleButtonRadius * scalingFactor * 0.3 + 'px'
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
    v-if="!inputsDisabled && categoriesArray.length > 0"
    class="titlebuttonhover"
    :class="{
      titlebuttonhoverdisplayoverride: titleButtonHoverOverride,
      hoverdisabled: !global.state.categoriesOnHover
    }"
    :style="{
      '--poslefttitle': hoverRightTitle + 'px',
      '--postoptitle': hoverBottomTitle - 1 + 'px',
      'font-size': 70 * scalingFactor + '%',
      '--maxheight': circleButtonRadius * scalingFactor * 0.3 + 'px'
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
      if (titlebutton.value && props.outgraphcanvasref.getBoundingClientRect) {
        hoverRightTitle.value =
          titlebutton.value.getBoundingClientRect().left -
          props.outgraphcanvasref.getBoundingClientRect().left
        hoverBottomTitle.value =
          titlebutton.value.getBoundingClientRect().bottom -
          props.outgraphcanvasref.getBoundingClientRect().top
      }
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

    watchEffect(
      async () =>
        await nextTick().then(
          initHoverButtonTitleCoords(global.state.resultsRedirectsEnabled)
        )
    )
    watchEffect(
      async () =>
        await nextTick().then(initHoverButtonTitleCoords(props.scalingFactor))
    )
    watchEffect(
      async () =>
        await nextTick().then(
          initHoverButtonTitleCoords(props.circleButtonRadius)
        )
    )
    watchEffect(() =>
      titleButtonHoverOverrideOff(global.state.categoriesOnHover)
    )
    watchEffect(() => titleButtonHoverOverrideOff(props.inputsDisabled))

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
    inputsDisabled: { required: true, default: false, type: Boolean },
    title: { required: true, default: '', type: String },
    redirects: { required: true, default: () => [], type: Array },
    categoriesArray: { required: true, default: () => [], type: Array },
    titleMissing: { required: true, default: true, type: Boolean },
    url: { required: true, default: '', type: String },
    outgraphcanvasref: { required: true, default: {} },
    circleButtonRadius: { required: true, default: 250, type: Number },
    scalingFactor: { required: true, default: 1.0, type: Number },
    redirectsDone: { required: true, default: false, type: Boolean }
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
