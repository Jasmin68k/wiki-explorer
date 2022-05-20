<template>
  <div class="tabbed" ref="tabbed">
    <input
      v-if="global.state.mobileMode"
      checked="true"
      id="tab1"
      type="radio"
      name="tabs"
      @click="tabSelection($event.target.id)"
    />
    <input
      checked="true"
      id="tab2"
      type="radio"
      name="tabs"
      ref="tab2"
      @click="tabSelection($event.target.id)"
    />
    <input
      id="tab3"
      type="radio"
      name="tabs"
      @click="tabSelection($event.target.id)"
    />
    <input
      id="tab4"
      type="radio"
      name="tabs"
      ref="tab4"
      @click="tabSelection($event.target.id)"
    />

    <nav>
      <label v-if="global.state.mobileMode" for="tab1"
        ><div class="tabiconcontainer">
          <img
            class="tabicon"
            src="../assets/images/analytics-graph.svg"
          /></div
      ></label>
      <label for="tab2"
        ><div class="tabiconcontainer">
          <span>
            <img class="tabdoubleicon" src="../assets/images/document.svg"
          /></span>
          <span>
            <img
              class="tabdoubleicon"
              src="../assets/images/forward-hand-drawn-arrow-pointing-to-right.svg"
          /></span>
        </div>
      </label>
      <label for="tab3"
        ><div class="tabiconcontainer">
          <span>
            <img class="tabdoubleicon" src="../assets/images/document.svg"
          /></span>
          <span>
            <img class="tabdoubleicon" src="../assets/images/document2.svg"
          /></span></div
      ></label>
      <label for="tab4" ref="label4"
        ><div class="tabiconcontainer">
          <img class="tabicon" src="../assets/images/text-tool.svg" /></div
      ></label>
    </nav>

    <section>
      <Outgraph
        v-if="global.state.mobileMode"
        class="tab1"
        @circleButtonClicked="circleButtonClicked"
        ref="outgraphref"
      >
      </Outgraph>

      <CategoriesRedirects class="tab2"></CategoriesRedirects>
      <div class="tab3">
        <CategoriesCheckboxFilter
          v-if="
            global.state.resultsCategoriesEnabled &&
            global.state.resultsCategoriesDone &&
            props.categoriesAll.length > 0 &&
            tab3active
          "
          :items="props.categoriesAll"
          :rootHeight="scrollboxContainerHeight"
          @windowResize="windowResized"
        ></CategoriesCheckboxFilter>
      </div>

      <MainTitleInfo class="tab4"></MainTitleInfo>
    </section>
  </div>
</template>

<script setup>
import {
  inject,
  ref,
  watchEffect,
  nextTick,
  onMounted,
  onBeforeUnmount
} from 'vue'
import MainTitleInfo from './MainTitleInfo.vue'
import CategoriesRedirects from './CategoriesRedirects.vue'
import CategoriesCheckboxFilter from './CategoriesCheckboxFilter.vue'
import Outgraph from './Outgraph.vue'

// import { useI18n } from 'vue-i18n/index'
// const { t } = useI18n({})
const global = inject('global')
const emit = defineEmits(['circleButtonClicked'])
const tab2 = ref(null)
const tab4 = ref(null)
const label4 = ref(null)
const tabbed = ref(null)
const scrollboxContainerHeight = ref(300)
const navHeight = ref(10)
const tab3active = ref(false)
const outgraphref = ref(null)
const props = defineProps({
  categoriesAll: { required: true, default: () => [], type: Array }
})

// switch to tab other than graph, when leaving mobileMode
watchEffect(() => {
  if (!global.state.mobileMode) {
    if (tab2.value) {
      tab2.value.checked = true
    } else {
      if (tab4.value) {
        tab4.value.checked = true
      }
    }
  }
})

function circleButtonClicked(clickData) {
  emit('circleButtonClicked', clickData)
}

// This is needed to have CategoriesCheckboxFilter only rendered after tab is active
// otherwise calculcateInitialRowHeight will not work, since spacer.value.children is empty
// with display: none
function tabSelection(id) {
  windowResized()

  tab3active.value = id === 'tab3'

  // recalc coordinates, when chosen from not visible state in mobile mode, otherwise won't work after resize with graph not visible
  if (id === 'tab1') {
    outgraphref.value.calcCoordinates()
  }
}

async function windowResized() {
  await nextTick()

  // add proper check for highest of all labels and possible second row
  navHeight.value = label4.value.getBoundingClientRect().height
  scrollboxContainerHeight.value =
    tabbed.value.getBoundingClientRect().height - navHeight.value
}

onMounted(() => {
  window.addEventListener('resize', windowResized)
  windowResized()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', windowResized)
})
</script>

<style scoped>
.tabbed section {
  display: block;
  margin-left: 0;
  clear: both;
  position: relative;
  height: calc(100% - v-bind(navHeight + 'px'));
}

.tabbed > input,
.tabbed section > div {
  display: none;
}

#tab1:checked ~ section .tab1,
#tab2:checked ~ section .tab2,
#tab3:checked ~ section .tab3,
#tab4:checked ~ section .tab4 {
  display: block;
}

nav label {
  float: left;
  padding: 3px 3px;
  border-top: 1px solid black;
  border-right: 1px solid black;
  background: #ddd;
  color: black;
  font-size: 85%;
  border-bottom: 1px solid black;
}

nav label:nth-child(1) {
  border-left: 1px solid black;
}
nav label:hover {
  filter: invert(0.25);
}
nav label:active {
  background: #ffffff;
}

#tab1:checked ~ nav label[for='tab1'],
#tab2:checked ~ nav label[for='tab2'],
#tab3:checked ~ nav label[for='tab3'],
#tab4:checked ~ nav label[for='tab4'] {
  background: mistyrose;
  color: black;
  position: relative;
}

.tabbed {
  height: 100%;
}
.tab2,
.tab3,
.tab4 {
  overflow-y: auto;
}
.tab1,
.tab2,
.tab3,
.tab4 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.tabiconcontainer {
  width: 3.6em;
  height: 1.2em;
  vertical-align: middle;
}
.tabicon {
  height: 100%;
}
.tabdoubleicon {
  height: 100%;
  margin-left: 3px;
  margin-right: 3px;
}
</style>
