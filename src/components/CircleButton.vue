<template>
  <div
    v-show="!inputsDisabled"
    class="circlebutton"
    :class="{ hoverdisabled: !categoriesOnHover }"
    :style="{
      '--angle':
        270 +
        (360 / (Math.round(displayResultsArray.length / 2) * 2)) * index +
        'deg',
      '--radius':
        index % 2 === 0
          ? circleButtonRadius *
              scalingFactor *
              (1 +
                Math.abs(
                  Math.sin(
                    ((360 / (Math.round(displayResultsArray.length / 2) * 2)) *
                      index *
                      Math.PI) /
                      180
                  )
                ) *
                  0.25) +
            'px'
          : (circleButtonRadius / 1.5) *
              scalingFactor *
              (1 +
                Math.abs(
                  Math.sin(
                    ((360 / (Math.round(displayResultsArray.length / 2) * 2)) *
                      index *
                      Math.PI) /
                      180
                  )
                ) *
                  0.25) +
            'px',
      '--minusangle':
        -1 *
          (270 +
            (360 / (Math.round(displayResultsArray.length / 2) * 2)) * index) +
        'deg',
      'line-height': 100 * scalingFactor + '%',
      'max-width':
        100 *
          scalingFactor *
          (1 +
            Math.abs(
              Math.sin(
                ((360 / (Math.round(displayResultsArray.length / 2) * 2)) *
                  index *
                  Math.PI) /
                  180
              )
            ) *
              1.0) +
        'px'
    }"
    ref="circlebutton"
    v-on="{ mouseenter: () => initHoverButtonCircleCoords(index) }"
  >
    <div
      class="buttonicongridcontainer"
      :style="[
        !displayResultsArray[index].missing
          ? {
              'grid-template-columns':
                'auto ' + (0.67 * scalingFactor + 0.33) + 'rem'
            }
          : { 'grid-template-columns': 'auto ' }
      ]"
    >
      <button
        :class="{
          missing: displayResultsArray[index].missing,
          circlebuttonactualhover:
            (!inputsDisabled &&
              global.state.resultsCategoriesEnabled &&
              resultsCategoriesDone) ||
            (!inputsDisabled && !global.state.resultsCategoriesEnabled)
        }"
        class="circlebuttonactual"
        :style="{
          'font-size': 83.4 * scalingFactor + '%',
          'min-width': 50 * scalingFactor + 'px'
        }"
        :disabled="
          displayResultsArray[index].missing ||
          (global.state.resultsCategoriesEnabled && !resultsCategoriesDone) ||
          (resultsRedirectsEnabled && !resultsRedirectsDone)
        "
        @click.prevent="circleButton(index)"
      >
        {{ displayResultsArray[index].title }}
      </button>

      <div class="icongridcontainer">
        <span
          v-if="!displayResultsArray[index].missing"
          :class="{
            icongriditem1start:
              global.state.resultsCategoriesEnabled && !categoriesOnHover,
            icongriditem1center:
              !global.state.resultsCategoriesEnabled ||
              (global.state.resultsCategoriesEnabled && categoriesOnHover)
          }"
          :style="{ 'line-height': 100 * scalingFactor + '%' }"
        >
          <a :href="displayResultsArray[index].url" target="_blank"
            ><img
              class="icon"
              :class="{
                iconverticalalignmiddle:
                  categoriesOnHover || !global.state.resultsCategoriesEnabled,
                iconverticalaligntop: !categoriesOnHover
              }"
              :style="{ height: 0.67 * scalingFactor + 0.33 + 'rem' }"
              alt="Wiki"
              src="../assets/images/wikipedia.svg"
          /></a>
        </span>
        <span
          v-if="
            !displayResultsArray[index].missing &&
            global.state.resultsCategoriesEnabled &&
            !categoriesOnHover
          "
          class="icongriditem2"
          :style="{ 'line-height': 100 * scalingFactor + '%' }"
        >
          <img
            @click="catsClick(index)"
            :class="{ icon: resultsCategoriesDone }"
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
      v-if="resultsRedirectsEnabled && resultsRedirectsDone"
      :style="{
        'font-size': 70 * scalingFactor + '%',
        '--maxheight': circleButtonRadius * scalingFactor * 0.3 + 'px'
      }"
    >
      <ul>
        <li
          v-for="(redirect, index) in displayResultsArray[index].redirects"
          :key="index"
        >
          {{ redirect }}
        </li>
      </ul>
    </div>
  </div>

  <div
    v-if="
      !inputsDisabled &&
      displayResultsArray.length > 0 &&
      global.state.resultsCategoriesEnabled &&
      resultsCategoriesDone &&
      displayResultsArray[index].categories
    "
    class="circlebuttonhover"
    :class="{
      circlebuttonhoverdisplayoverride: circleButtonHoverOverride,
      hoverdisabled: !categoriesOnHover
    }"
    :style="{
      '--posleft': hoverRight + 'px',
      '--postop': hoverBottom - 1 + 'px',
      'font-size': 70 * scalingFactor + '%',
      '--maxheight': circleButtonRadius * scalingFactor * 0.3 + 'px'
    }"
  >
    <ul>
      <li
        v-for="category in displayResultsArray[index].categories"
        :key="category"
      >
        {{ category }}
      </li>
    </ul>
  </div>
</template>
<script>
import { inject, ref, watchEffect, nextTick } from 'vue'
export default {
  name: 'CircleButton',
  data() {
    return {
      circleButtonHoverOverride: false
    }
  },
  setup(props) {
    const global = inject('global')

    // template ref
    const circlebutton = ref(null)

    // instance data
    const hoverRight = ref(0)
    const hoverBottom = ref(0)

    function initHoverButtonCircleCoords() {
      if (circlebutton.value && props.outgraphcanvasref.getBoundingClientRect) {
        hoverRight.value =
          circlebutton.value.getBoundingClientRect().left -
          props.outgraphcanvasref.getBoundingClientRect().left
        hoverBottom.value =
          circlebutton.value.getBoundingClientRect().bottom -
          props.outgraphcanvasref.getBoundingClientRect().top
      }
    }

    watchEffect(
      async () =>
        await nextTick().then(
          initHoverButtonCircleCoords(props.resultsRedirectsEnabled)
        )
    )
    watchEffect(
      async () =>
        await nextTick().then(initHoverButtonCircleCoords(props.scalingFactor))
    )
    watchEffect(
      async () =>
        await nextTick().then(
          initHoverButtonCircleCoords(props.circleButtonRadius)
        )
    )
    watchEffect(
      async () =>
        await nextTick().then(
          initHoverButtonCircleCoords(props.resultsRedirectsDone)
        )
    )

    return {
      global,
      circlebutton,
      hoverRight,
      hoverBottom,
      initHoverButtonCircleCoords
    }
  },

  emits: ['circleButtonClicked'],
  props: {
    index: { required: true, default: -1, type: Number },
    inputsDisabled: { required: true, default: false, type: Boolean },
    resultsRedirectsEnabled: { required: true, default: false, type: Boolean },
    displayResultsArray: { required: true, default: () => [], type: Array },
    resultsCategoriesDone: { required: true, default: true, type: Boolean },
    resultsRedirectsDone: { required: true, default: true, type: Boolean },
    outgraphcanvasref: { required: true, default: {} },
    circleButtonRadius: { required: true, default: 250, type: Number },
    scalingFactor: { required: true, default: 1.0, type: Number },
    categoriesOnHover: { required: true, default: true, type: Boolean }
  },

  watch: {
    displayResultsArray() {
      this.circleButtonHoverOverride = false
    },
    categoriesOnHover() {
      this.circleButtonHoverOverride = false
    }
  },
  methods: {
    circleButton(index) {
      this.$emit('circleButtonClicked', index)
    },
    catsClick(index) {
      if (this.resultsCategoriesDone) {
        if (!this.circleButtonHoverOverride) {
          this.initHoverButtonCircleCoords(index)
          this.circleButtonHoverOverride = true
        } else this.circleButtonHoverOverride = false
      }
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
.missing {
  color: red;
}
.circlebuttonactual {
  border: none;
  padding: 0;
  background-color: lightgoldenrodyellow;
  overflow-wrap: anywhere;
}
.circlebuttonactualhover:hover {
  background-color: palegoldenrod;
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
.circlebutton:hover {
  z-index: 3;
}
.circlebuttonhover {
  background-color: honeydew;
  border: 1px solid black;
  position: absolute;
  left: var(--posleft);
  top: var(--postop);
  z-index: 5;
  max-height: var(--maxheight);
  overflow-y: auto;
  display: none;
}

.circlebuttonhoverdisplayoverride {
  display: block;
}

.circlebutton:hover {
  z-index: 3;
}

.circlebutton:not(.hoverdisabled):hover
  + .circlebuttonhover:not(.hoverdisabled) {
  display: block;
}

.circlebuttonhover:hover {
  display: block;
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
.buttonicongridcontainer {
  display: grid;
}
.redirects {
  background-color: lavender;
  max-height: var(--maxheight);
  overflow-y: auto;
}
.iconverticalaligntop {
  vertical-align: top;
}
.iconverticalalignmiddle {
  vertical-align: middle;
}
</style>
