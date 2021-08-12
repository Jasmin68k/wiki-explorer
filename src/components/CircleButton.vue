<template>
  <div
    v-show="!inputsDisabled"
    class="circlebutton"
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
    :ref="`circlebutton${index}`"
    v-on="{
      mouseover: categoriesOnHover ? () => hoverButtonOn(index) : null,
      mouseleave: categoriesOnHover ? hoverButtonOff : null
    }"
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
        :class="{ missing: displayResultsArray[index].missing }"
        class="circlebuttonactual"
        :style="{
          'font-size': 83.4 * scalingFactor + '%',
          'min-width': 50 * scalingFactor + 'px'
        }"
        :disabled="
          displayResultsArray[index].missing ||
          (resultsCategoriesEnabled && !resultsCategoriesDone)
        "
        @click.prevent="circleButton(index), hoverButtonOff(index)"
      >
        {{ displayResultsArray[index].title }}
      </button>

      <div class="icongridcontainer">
        <span
          v-if="!displayResultsArray[index].missing"
          :class="{
            icongriditem1start: resultsCategoriesEnabled && !categoriesOnHover,
            icongriditem1center:
              !resultsCategoriesEnabled ||
              (resultsCategoriesEnabled && categoriesOnHover)
          }"
          :style="{ 'line-height': 100 * scalingFactor + '%' }"
        >
          <a :href="displayResultsArray[index].fullurl" target="_blank"
            ><img
              class="icon"
              :class="{
                iconverticalalignmiddle: categoriesOnHover,
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
            resultsCategoriesEnabled &&
            !categoriesOnHover
          "
          class="icongriditem2"
          :style="{ 'line-height': 100 * scalingFactor + '%' }"
        >
          <img
            @click="catsClick(index)"
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
      '--postop': hoverBottom - 1 + 'px',
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
    scalingFactor: { required: true, default: 1.0, type: Number },
    categoriesOnHover: { required: true, default: true, type: Boolean }
  },
  watch: {
    displayResultsArray() {
      this.hoverButtonOff()
    },
    categoriesOnHover() {
      this.hoverButtonOff()
    }
  },
  methods: {
    hoverButtonOn(index) {
      this.hoverButtonIndex = index

      this.hoverRight =
        this.$refs[`circlebutton${index}`].getBoundingClientRect().left -
        this.outgraphcanvasref.getBoundingClientRect().left
      this.hoverBottom =
        this.$refs[`circlebutton${index}`].getBoundingClientRect().bottom -
        this.outgraphcanvasref.getBoundingClientRect().top

      this.hoverButton = true
    },
    hoverButtonOff() {
      this.hoverButton = false
      this.hoverButtonIndex = -1
    },
    circleButton(index) {
      this.$emit('circleButtonClicked', index)
    },
    catsClick(index) {
      this.hoverButton ? this.hoverButtonOff(index) : this.hoverButtonOn(index)
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
  padding: 0px;
  background-color: lightgoldenrodyellow;
  overflow-wrap: anywhere;
}
.circlebuttonactual:hover {
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
}
.iconverticalaligntop {
  vertical-align: top;
}
.iconverticalalignmiddle {
  vertical-align: middle;
}
</style>
