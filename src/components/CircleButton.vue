<template>
  <div
    v-show="!global.state.inputsDisabled"
    class="circlebutton"
    :class="{ hoverdisabled: !global.state.categoriesOnHover }"
    :style="{
      left: coordinates.x + 'px',
      top: coordinates.y + 'px',
      'line-height': 100 * global.state.scalingFactor + '%',
      'max-width':
        100 *
          global.state.scalingFactor *
          (1 +
            Math.abs(
              Math.sin(
                ((360 /
                  (Math.round(global.state.displayResultsArray.length / 2) *
                    2)) *
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
        !global.state.displayResultsArray[index].missing
          ? {
              'grid-template-columns':
                'auto ' + (0.67 * global.state.scalingFactor + 0.33) + 'rem'
            }
          : { 'grid-template-columns': 'auto ' }
      ]"
    >
      <button
        :class="{
          missing: global.state.displayResultsArray[index].missing,
          circlebuttonactualhover:
            (!global.state.inputsDisabled &&
              global.state.resultsCategoriesEnabled &&
              global.state.resultsCategoriesDone) ||
            (!global.state.inputsDisabled &&
              !global.state.resultsCategoriesEnabled)
        }"
        class="circlebuttonactual"
        :style="{
          'font-size': 83.4 * global.state.scalingFactor + '%',
          'min-width': 50 * global.state.scalingFactor + 'px'
        }"
        :disabled="
          global.state.displayResultsArray[index].missing ||
          (global.state.resultsCategoriesEnabled &&
            !global.state.resultsCategoriesDone) ||
          (global.state.resultsRedirectsEnabled &&
            !global.state.resultsRedirectsDone)
        "
        @click.prevent="circleButton(index)"
      >
        {{ global.state.displayResultsArray[index].title }}
      </button>

      <div class="icongridcontainer">
        <span
          v-if="!global.state.displayResultsArray[index].missing"
          :class="{
            icongriditem1start:
              global.state.resultsCategoriesEnabled &&
              !global.state.categoriesOnHover,
            icongriditem1center:
              !global.state.resultsCategoriesEnabled ||
              (global.state.resultsCategoriesEnabled &&
                global.state.categoriesOnHover)
          }"
          :style="{ 'line-height': 100 * global.state.scalingFactor + '%' }"
        >
          <a :href="global.state.displayResultsArray[index].url" target="_blank"
            ><img
              class="icon"
              :class="{
                iconverticalalignmiddle:
                  global.state.categoriesOnHover ||
                  !global.state.resultsCategoriesEnabled,
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
          v-if="
            !global.state.displayResultsArray[index].missing &&
            global.state.resultsCategoriesEnabled &&
            !global.state.categoriesOnHover
          "
          class="icongriditem2"
          :style="{ 'line-height': 100 * global.state.scalingFactor + '%' }"
        >
          <img
            @click="catsClick"
            :class="{ icon: global.state.resultsCategoriesDone }"
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
      v-if="
        global.state.resultsRedirectsEnabled &&
        global.state.resultsRedirectsDone
      "
      :style="{
        'font-size': 70 * global.state.scalingFactor + '%',
        '--maxheight':
          global.state.circleButtonRadius * global.state.scalingFactor * 0.3 +
          'px'
      }"
    >
      <ul>
        <li
          v-for="(redirect, index) in global.state.displayResultsArray[index]
            .redirects"
          :key="index"
        >
          {{ redirect }}
        </li>
      </ul>
    </div>
  </div>

  <div
    v-if="
      !global.state.inputsDisabled &&
      global.state.displayResultsArray.length > 0 &&
      global.state.resultsCategoriesEnabled &&
      global.state.resultsCategoriesDone &&
      global.state.displayResultsArray[index].categories
    "
    class="circlebuttonhover"
    :class="{
      circlebuttonhoverdisplayoverride: circleButtonHoverOverride,
      hoverdisabled: !global.state.categoriesOnHover
    }"
    :style="{
      '--posleft': hoverRight + 'px',
      '--postop': hoverBottom - 1 + 'px',
      'font-size': 70 * global.state.scalingFactor + '%',
      '--maxheight':
        global.state.circleButtonRadius * global.state.scalingFactor * 0.3 +
        'px'
    }"
  >
    <ul>
      <li
        v-for="category in global.state.displayResultsArray[index].categories"
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
  setup(props) {
    const global = inject('global')

    // template ref
    const circlebutton = ref(null)

    // instance data
    const hoverRight = ref(0)
    const hoverBottom = ref(0)
    const circleButtonHoverOverride = ref(false)

    function initHoverButtonCircleCoords() {
      if (circlebutton.value && props.outgraphref.getBoundingClientRect) {
        hoverRight.value =
          circlebutton.value.getBoundingClientRect().left -
          props.outgraphref.getBoundingClientRect().left
        hoverBottom.value =
          circlebutton.value.getBoundingClientRect().bottom -
          props.outgraphref.getBoundingClientRect().top
      }
    }
    async function initHoverButtonCircleCoordsNextTick() {
      await nextTick()
      initHoverButtonCircleCoords()
    }
    function circleButtonHoverOverrideOff() {
      circleButtonHoverOverride.value = false
    }
    function catsClick() {
      if (global.state.resultsCategoriesDone) {
        if (!circleButtonHoverOverride.value) {
          initHoverButtonCircleCoords()
          circleButtonHoverOverride.value = true
        } else circleButtonHoverOverride.value = false
      }
    }

    watchEffect(() =>
      initHoverButtonCircleCoordsNextTick(global.state.resultsRedirectsEnabled)
    )
    watchEffect(() =>
      initHoverButtonCircleCoordsNextTick(global.state.scalingFactor)
    )
    watchEffect(() =>
      initHoverButtonCircleCoordsNextTick(global.state.circleButtonRadius)
    )
    watchEffect(() =>
      initHoverButtonCircleCoordsNextTick(global.state.resultsRedirectsDone)
    )
    watchEffect(() =>
      circleButtonHoverOverrideOff(global.state.categoriesOnHover)
    )
    watchEffect(() =>
      circleButtonHoverOverrideOff(global.state.displayResultsArray)
    )

    return {
      global,
      circlebutton,
      hoverRight,
      hoverBottom,
      circleButtonHoverOverride,
      initHoverButtonCircleCoords,
      catsClick
    }
  },

  emits: ['circleButtonClicked'],
  props: {
    index: { required: true, default: -1, type: Number },
    outgraphref: { required: true, default: {} },
    coordinates: { required: true, default: () => {}, type: Object }
  },
  methods: {
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
@media (hover: hover) and (pointer: fine) {
  .circlebuttonactualhover:hover {
    background-color: palegoldenrod;
  }
}
.circlebutton {
  background-color: lightgrey;
  border: 1px solid black;
  position: absolute;
  z-index: 3;
  /* move pixel position to center of button */
  transform: translate(-50%, -50%);
}

@media (hover: hover) and (pointer: fine) {
  .circlebutton:hover {
    z-index: 4;
  }
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
@media (hover: hover) and (pointer: fine) {
  .circlebutton:hover {
    z-index: 4;
  }
}
@media (hover: hover) and (pointer: fine) {
  .circlebutton:not(.hoverdisabled):hover
    + .circlebuttonhover:not(.hoverdisabled) {
    display: block;
  }
}
@media (hover: hover) and (pointer: fine) {
  .circlebuttonhover:hover {
    display: block;
  }
}
@media (hover: hover) and (pointer: fine) {
  .icon:hover {
    filter: invert(1);
  }
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
