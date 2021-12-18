<template>
  <div class="root" ref="root" :style="rootStyle">
    <div class="viewport" ref="viewport" :style="viewportStyle">
      <ul class="spacer" ref="spacer" :style="spacerStyle">
        <li v-for="item in visibleItems" :key="item">
          <input
            type="checkbox"
            :id="item"
            :value="item"
            v-model="checkedCategories"
            @change="resultsCategoriesCheckboxChanged"
          />
          <label :for="item">{{ item }}</label>
        </li>
      </ul>
    </div>
  </div>
  <div class="checkboxbuttons">
    <button @click.prevent="categoriesAll">{{ $t('all') }}</button>
    <button @click.prevent="categoriesNone">{{ $t('none') }}</button>
  </div>
</template>
<script>
// Virtual scrollbox concept mainly taken from:
// https://dev.to/adamklein/build-your-own-virtual-scroll-part-i-11ib
// https://stackoverflow.com/questions/60924305/how-to-make-virtual-scroll
// https://codepen.io/zupkode/pen/oNgaqLv

export default {
  name: 'CategoriesCheckboxFilter',
  emits: [
    'resultsCategoriesCheckboxChanged',
    'categoriesAll',
    'categoriesNone'
  ],

  props: {
    items: { required: true, default: () => [], type: Array },
    // itemsFull: { required: true, default: () => [], type: Array },
    rootHeight: { required: true, default: 300, type: Number },
    checkedInit: { required: true, default: () => new Set(), type: Set }
  },
  data() {
    return {
      // Height of each row, give it an initial value but this gets calculated dynamically on mounted
      rowHeight: 30,
      // Current scroll top position, we update this inside the scroll event handler
      scrollTop: 0,
      // Extra padding at the top and bottom so that the items transition smoothly
      // Think of it as extra items just before the viewport starts and just after the viewport ends
      nodePadding: 20,
      checkedCategories: new Set()
    }
  },

  computed: {
    // Total height of the viewport = number of items in the array x height of each item
    viewportHeight() {
      return this.itemCount * this.rowHeight
    },
    // Out of all the items in the massive array, we only render a subset of them
    // This is the starting index from which we show a few items
    startIndex() {
      let startNode =
        Math.floor(this.scrollTop / this.rowHeight) - this.nodePadding
      startNode = Math.max(0, startNode)
      return startNode
    },
    // This is the number of items we show after the starting index
    // If the array has a total 10000 items, we want to show items from say index 1049 till 1069
    // visible node count is that number 20 and starting index is 1049
    visibleNodeCount() {
      let count =
        Math.ceil(this.rootHeight / this.rowHeight) + 2 * this.nodePadding
      count = Math.min(this.itemCount - this.startIndex, count)
      return count
    },
    // Subset of items shown from the full array
    visibleItems() {
      return this.items.slice(
        this.startIndex,
        this.startIndex + this.visibleNodeCount
      )
    },
    itemCount() {
      return this.items.length
    },
    // The amount by which we need to translateY the items shown on the screen so that the scrollbar shows up correctly
    offsetY() {
      return this.startIndex * this.rowHeight
    },
    // This is the direct list container, we apply a translateY to this
    spacerStyle() {
      return {
        transform: 'translateY(' + this.offsetY + 'px)'
      }
    },
    viewportStyle() {
      return {
        overflow: 'hidden',
        height: this.viewportHeight + 'px',
        position: 'relative'
      }
    },
    rootStyle() {
      return {
        height: this.rootHeight + 'px',
        overflow: 'auto'
      }
    }
  },
  methods: {
    categoriesAll() {
      // Temp construct fixes checkboxes not updated from unchecked to check in certain situations,
      // e. g. none, scroll max down, filter categories, all
      // also triggers v-model update only at end, might even be faster

      // let checkedCategoriesTemp = new Set(this.checkedCategories)
      let checkedCategoriesTemp = new Set()

      // this.items.forEach((item) =>
      //   !checkedCategoriesTemp.has(item)
      //     ? checkedCategoriesTemp.add(item)
      //     : null
      // )

      // no duplicate check needed in Set
      this.items.forEach((item) => checkedCategoriesTemp.add(item))

      this.checkedCategories = checkedCategoriesTemp

      this.$emit('categoriesAll', this.checkedCategories)
    },
    categoriesNone() {
      // https://stackoverflow.com/a/44204227
      // ECMAScript 6 sets can permit faster computing of the elements of one array that aren't in the other
      // Since the lookup complexity for the V8 engine browsers use these days is O(1), the time complexity of the whole algorithm is O(n)
      const toRemove = new Set(this.items)

      let tempArray = Array.from(this.checkedCategories)
      tempArray = tempArray.filter((x) => !toRemove.has(x))

      this.checkedCategories = new Set(tempArray)

      this.$emit('categoriesNone', this.checkedCategories)
    },

    handleScroll() {
      this.scrollTop = this.$refs.root.scrollTop
    },
    // Find the largest height amongst all the children
    // Remember each row has to be of the same height
    // I am working on the different height version
    calculateInitialRowHeight() {
      const children = this.$refs.spacer.children
      let largestHeight = 0
      for (let i = 0; i < children.length; i++) {
        if (children[i].offsetHeight > largestHeight) {
          largestHeight = children[i].offsetHeight
        }
      }
      return largestHeight
    },
    resultsCategoriesCheckboxChanged() {
      this.$emit('resultsCategoriesCheckboxChanged', this.checkedCategories)
    }
  },
  mounted() {
    // emit did not work for whatever reason
    this.$parent.windowResized()

    // this.checkedCategories = new Set(this.itemsFull)
    // this.$emit('resultsCategoriesCheckboxChanged', this.checkedCategories)

    this.checkedCategories = new Set(this.checkedInit)

    this.$refs.root.addEventListener('scroll', this.handleScroll, {
      passive: true
    })
    // Calculate that initial row height dynamically
    const largestHeight = this.calculateInitialRowHeight()
    this.rowHeight =
      typeof largestHeight !== 'undefined' && largestHeight !== null
        ? largestHeight
        : 30
  },
  // unmounted() this.$refs.root = null -> error
  beforeUnmount() {
    this.$refs.root.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped>
ul {
  list-style-type: none; /* Remove bullets */
  padding: 0; /* Remove padding */
  margin: 0; /* Remove margins */
  overflow: hidden;
}
li {
  white-space: nowrap;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.viewport {
  overflow-y: auto;
}

.checkboxbuttons {
  /* position: fixed; */
  position: absolute;
  right: 30px;
  z-index: 1;
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
