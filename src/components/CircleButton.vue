<template>
  <div
    v-show="!global.state.inputsDisabled"
    class="circlebutton"
    :style="{
      left: coordinates.x + 'px',
      top: coordinates.y + 'px',
      'line-height': 100 + '%',
      width: global.state.mobileMode ? 125 * 0.6 + 'px' : 125 + 'px',
      height: global.state.mobileMode ? 75 * 0.6 + 'px' : 75 + 'px'
    }"
  >
    <button
      ref="buttonref"
      :class="{
        missing: global.state.displayResults[index].missing,
        circlebuttonactualhover:
          (!global.state.inputsDisabled &&
            global.state.resultsCategoriesEnabled &&
            global.state.resultsCategoriesDone) ||
          (!global.state.inputsDisabled &&
            !global.state.resultsCategoriesEnabled)
      }"
      class="circlebuttonactual"
      :style="{
        'font-size': global.state.mobileMode ? 83.4 * 0.6 + '%' : 83.4 + '%'
      }"
      :disabled="
        global.state.displayResults[index].missing ||
        (global.state.resultsCategoriesEnabled &&
          !global.state.resultsCategoriesDone) ||
        (global.state.resultsRedirectsEnabled &&
          !global.state.resultsRedirectsDone)
      "
      @click.prevent="circleButton($event, index)"
      @auxclick.prevent="circleButtonMiddle(index)"
    >
      {{ global.state.displayResults[index].title }}
    </button>
  </div>
</template>
<script setup>
import { inject, onMounted, onUpdated, ref } from 'vue'

const global = inject('global')

const emit = defineEmits(['circleButtonClicked'])

defineProps({
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
})

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

function circleButton(event, index) {
  emit('circleButtonClicked', { event: event, index: index })
}

function circleButtonMiddle(index) {
  if (!global.state.displayResults[index].missing) {
    window.open(global.state.displayResults[index].url, '_blank')
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
  background-color: rgb(109, 108, 57);

  overflow-wrap: anywhere;
  width: 100%;
  height: 100%;
}
@media (hover: hover) and (pointer: fine) {
  .circlebuttonactualhover:hover:not(.missing) {
    filter: brightness(1.2);
  }
}
.circlebutton {
  border: 1px solid #666;
  position: absolute;
  z-index: 3;
  /* move pixel position to center of button */
  transform: translate(-50%, -50%);
  padding: 0;
  background-color: rgb(109, 108, 57);
  overflow-wrap: anywhere;
}

@media (hover: hover) and (pointer: fine) {
  .circlebutton:hover {
    z-index: 4;
  }
}
</style>
