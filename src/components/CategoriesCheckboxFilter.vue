<template>
  <div class="root" ref="root" :style="rootStyle">
    <div class="viewport" :style="viewportStyle">
      <div class="spacer" ref="spacer" :style="spacerStyle">
        <div class="items" v-for="item in visibleItems" :key="item">
          <input
            class="itemsinput"
            type="checkbox"
            :id="item"
            :value="item"
            v-model="global.statefull.checkedCategories"
            @change="resultsCategoriesCheckboxChanged"
          />
          <label class="itemslabel" :for="item">{{ item }}</label>
        </div>
      </div>
    </div>
  </div>
  <div class="checkboxbuttonscontainer">
    <button class="checkboxbuttons" @click.prevent="categoriesAll">
      {{ $t('all') }}
    </button>
    <button class="checkboxbuttons" @click.prevent="categoriesNone">
      {{ $t('none') }}
    </button>
  </div>
</template>
<script setup>
// Virtual scrollbox concept mainly taken from:
// https://dev.to/adamklein/build-your-own-virtual-scroll-part-i-11ib
// https://stackoverflow.com/questions/60924305/how-to-make-virtual-scroll
// https://codepen.io/zupkode/pen/oNgaqLv

import { inject, computed, onMounted, onBeforeUnmount, ref } from 'vue'

const global = inject('global')

const root = ref(null)
const spacer = ref(null)

const emit = defineEmits(['windowResize'])

const props = defineProps({
  items: { required: true, default: () => [], type: Array },
  rootHeight: { required: true, default: 300, type: Number }
})

// Height of each row, give it an initial value but this gets calculated dynamically on mounted
const rowHeight = ref(30)
// Current scroll top position, we update this inside the scroll event handler
const scrollTop = ref(0)
// Extra padding at the top and bottom so that the items transition smoothly
// Think of it as extra items just before the viewport starts and just after the viewport ends
// not ref, hardcoded
const nodePadding = 20

// Total height of the viewport = number of items in the array x height of each item

const viewportHeight = computed(() => itemCount.value * rowHeight.value)

// Out of all the items in the massive array, we only render a subset of them
// This is the starting index from which we show a few items

const startIndex = computed(function () {
  let startNode = Math.floor(scrollTop.value / rowHeight.value) - nodePadding
  startNode = Math.max(0, startNode)

  return startNode
})

// This is the number of items we show after the starting index
// If the array has a total 10000 items, we want to show items from say index 1049 till 1069
// visible node count is that number 20 and starting index is 1049

const visibleNodeCount = computed(function () {
  let count = Math.ceil(props.rootHeight / rowHeight.value) + 2 * nodePadding
  count = Math.min(itemCount.value - startIndex.value, count)
  return count
})

// Subset of items shown from the full array

const visibleItems = computed(() =>
  props.items.slice(startIndex.value, startIndex.value + visibleNodeCount.value)
)

const itemCount = computed(() => props.items.length)

// The amount by which we need to translateY the items shown on the screen so that the scrollbar shows up correctly
const offsetY = computed(() => startIndex.value * rowHeight.value)

// This is the direct list container, we apply a translateY to this
const spacerStyle = computed(function () {
  return {
    transform: 'translateY(' + offsetY.value + 'px)'
  }
})

const viewportStyle = computed(function () {
  return {
    overflow: 'hidden',
    height: viewportHeight.value + 'px',
    position: 'relative'
  }
})

const rootStyle = computed(function () {
  return {
    height: props.rootHeight + 'px',
    overflow: 'auto'
  }
})

function categoriesAll() {
  // Temp construct fixes checkboxes not updated from unchecked to check in certain situations,
  // e. g. none, scroll max down, filter categories, all
  // also triggers v-model update only at end, might even be faster

  const checkedCategoriesTemp = new Set()
  // no duplicate check needed in Set
  props.items.forEach((item) => checkedCategoriesTemp.add(item))
  global.statefull.checkedCategories = checkedCategoriesTemp
  global.setGraphFirstItem(1)
}
function categoriesNone() {
  // https://stackoverflow.com/a/44204227
  // ECMAScript 6 sets can permit faster computing of the elements of one array that aren't in the other
  // Since the lookup complexity for the V8 engine browsers use these days is O(1), the time complexity of the whole algorithm is O(n)
  const toRemove = new Set(props.items)

  let temp = Array.from(global.statefull.checkedCategories)
  temp = temp.filter((x) => !toRemove.has(x))

  global.statefull.checkedCategories = new Set(temp)

  global.setGraphFirstItem(1)
}
function resultsCategoriesCheckboxChanged() {
  global.setGraphFirstItem(1)
}
function handleScroll() {
  scrollTop.value = root.value.scrollTop
}

// Find the largest height amongst all the children
// Remember each row has to be of the same height
// I am working on the different height version

function calculateInitialRowHeight() {
  let largestHeight = 0
  const children = spacer.value.children

  for (let i = 0; i < children.length; i++) {
    if (children[i].offsetHeight > largestHeight) {
      largestHeight = children[i].offsetHeight
    }
  }

  return largestHeight
}

function initRowHeight() {
  // Calculate that initial row height dynamically
  const largestHeight = calculateInitialRowHeight()

  rowHeight.value =
    typeof largestHeight !== 'undefined' && largestHeight !== null
      ? largestHeight
      : 30
}

onMounted(() => {
  // emit did not work for whatever reason
  // $parent.windowResized()

  // script setup testing with emit again
  emit('windowResize')

  root.value.addEventListener('scroll', handleScroll, {
    passive: true
  })

  initRowHeight()
})

// unmounted() root.value === null -> error
onBeforeUnmount(() => {
  root.value.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.spacer {
  overflow: hidden;
}

.items {
  white-space: nowrap;
  display: flex;
}

.itemsinput {
  height: 25px;
  accent-color: #ddd;
}
.itemslabel {
  line-height: 25px;
  width: 100%;
}

@media (hover: hover) and (pointer: fine) {
  .items:hover {
    background-color: #ddd;
  }
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.viewport {
  overflow-y: auto;
}

.checkboxbuttonscontainer {
  position: absolute;
  right: 20px;
  top: 5px;
  z-index: 1;
}
.checkboxbuttons {
  vertical-align: middle;
  width: 4em;
  height: 1.8em;
  margin-left: 3px;
  margin-right: 3px;
  border-radius: 0;
  border: 1px solid black;
  background-color: #ddd;
}
.checkboxbuttons:hover {
  filter: invert(0.25);
}

.root {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  overflow: auto;
  text-align: left;
  overscroll-behavior: none;
  padding-left: 5px;
}
</style>
