<template>
  <div
    v-show="!global.state.inputsDisabled"
    class="circlebutton"
    :class="{ hoverdisabled: !global.state.categoriesOnHover }"
    :style="{
      left: coordinates.x + 'px',
      top: coordinates.y + 'px',
      'line-height': 100 + '%',
      width: global.state.mobileMode ? 125 * 0.66 + 'px' : 125 + 'px',
      height: global.state.mobileMode ? 75 * 0.66 + 'px' : 75 + 'px'
    }"
    v-on="{ mouseenter: hoverCircleButton }"
  >
    <button
      ref="buttonref"
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
        'font-size': global.state.mobileMode ? 83.4 * 0.66 + '%' : 83.4 + '%'
      }"
      :disabled="
        global.state.displayResultsArray[index].missing ||
        (global.state.resultsCategoriesEnabled &&
          !global.state.resultsCategoriesDone) ||
        (global.state.resultsRedirectsEnabled &&
          !global.state.resultsRedirectsDone)
      "
      @click.prevent="circleButton($event, index)"
      @auxclick.prevent="circleButtonMiddle(index)"
    >
      {{ global.state.displayResultsArray[index].title }}
    </button>
  </div>
</template>
<script>
import { inject, onMounted, onUpdated, ref } from 'vue'
export default {
  name: 'CircleButton',
  setup(props, { emit }) {
    const global = inject('global')

    const buttonref = ref(null)

    onMounted(() => {
      adjustFontSize()
    })

    onUpdated(() => {
      adjustFontSize()
    })

    // make font smaller, if otherwise button text overflows
    function adjustFontSize() {
      if (buttonref.value.scrollHeight > buttonref.value.clientHeight) {
        let fontsize = parseFloat(buttonref.value.style['font-size'])
        fontsize -= 1
        buttonref.value.style['font-size'] = fontsize + '%'
        adjustFontSize()
      }
    }

    function hoverCircleButton() {
      if (!global.state.mobileMode && global.state.categoriesOnHover) {
        if (!global.showCatsRedir) {
          global.setShowCatsRedir(true)
          emit('circleButtonWindowResizeTrigger')
        }
        global.setCatsRedirResult(global.state.displayResultsArray[props.index])
      }
    }

    return {
      global,
      hoverCircleButton,
      buttonref
    }
  },

  emits: ['circleButtonClicked', 'circleButtonWindowResizeTrigger'],
  props: {
    index: { required: true, default: -1, type: Number },
    coordinates: {
      required: true,
      default: () => {
        return {
          x: -5000,
          y: -5000
        }
      },
      type: Object
    }
  },
  methods: {
    circleButton(event, index) {
      this.$emit('circleButtonClicked', { event: event, index: index })
    },
    circleButtonMiddle(index) {
      if (!this.global.state.displayResultsArray[index].missing) {
        window.open(this.global.state.displayResultsArray[index].url, '_blank')
      }
    }
  }
}
</script>
<style scoped>
.missing {
  color: red;
}
.circlebuttonactual {
  border: none;
  padding: 0;
  background-color: lightgoldenrodyellow;
  overflow-wrap: anywhere;
  width: 100%;
  height: 100%;
}
@media (hover: hover) and (pointer: fine) {
  .circlebuttonactualhover:hover {
    background-color: palegoldenrod;
  }
}
.circlebutton {
  border: 1px solid black;
  position: absolute;
  z-index: 3;
  /* move pixel position to center of button */
  transform: translate(-50%, -50%);
  padding: 0;
  background-color: lightgoldenrodyellow;
  overflow-wrap: anywhere;
}

@media (hover: hover) and (pointer: fine) {
  .circlebutton:hover {
    z-index: 4;
  }
}
</style>
