<template>
  <!-- Don't use v-show, then label height calulcation doesn't work in onMounted leading to vertical overflow -->
  <div
    :style="{
      visibility: global.state.mainInfoDone ? 'visible' : 'hidden'
    }"
    class="tabbed"
    ref="tabbed"
  >
    <input
      v-if="global.state.mobileMode"
      id="tab1"
      type="radio"
      name="tabs"
      ref="tab1"
      @click="tabSelection($event.target.id)"
    />
    <input
      :disabled="!global.state.resultsCategoriesEnabled"
      id="tab2"
      type="radio"
      name="tabs"
      ref="tab2"
      @click="tabSelection($event.target.id)"
    />
    <input
      :disabled="!global.state.resultsCategoriesEnabled"
      id="tab3"
      type="radio"
      name="tabs"
      @click="tabSelection($event.target.id)"
    />
    <input
      :disabled="!global.state.resultsRedirectsEnabled"
      id="tab4"
      type="radio"
      name="tabs"
      ref="tab4"
      @click="tabSelection($event.target.id)"
    />
    <input
      id="tab5"
      type="radio"
      name="tabs"
      ref="tab5"
      @click="tabSelection($event.target.id)"
    />

    <nav>
      <label v-if="global.state.mobileMode" for="tab1"
        ><div class="tabiconcontainer">
          <img
            class="tabicon svg-icon"
            src="@/assets/images/analytics-graph.svg"
          /></div
      ></label>
      <label
        :class="{
          itemdisabled: !global.state.resultsCategoriesEnabled
        }"
        for="tab2"
      >
        <div class="tabiconcontainer">
          <img class="tabicon svg-icon" src="@/assets/images/document.svg" />
        </div>
      </label>
      <label
        :class="{ itemdisabled: !global.state.resultsCategoriesEnabled }"
        for="tab3"
      >
        <div class="tabiconcontainer">
          <img class="tabicon svg-icon" src="@/assets/images/document2.svg" />
        </div>
      </label>
      <label
        :class="{
          itemdisabled: !global.state.resultsRedirectsEnabled
        }"
        for="tab4"
      >
        <div class="tabiconcontainer">
          <img
            class="tabicon svg-icon"
            src="@/assets/images/forward-hand-drawn-arrow-pointing-to-right.svg"
          />
        </div>
      </label>
      <label for="tab5" ref="label5"
        ><div class="tabiconcontainer">
          <img
            class="tabicon svg-icon"
            src="@/assets/images/text-tool.svg"
          /></div
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

      <Categories
        v-if="global.state.resultsCategoriesEnabled"
        class="tab2"
      ></Categories>

      <div v-if="global.state.resultsCategoriesEnabled" class="tab3">
        <CategoriesCheckboxFilter
          v-if="
            global.state.resultsCategoriesEnabled &&
            global.state.resultsCategoriesDone &&
            props.categoriesAll.length > 0 &&
            global.state.activeTab === 'tab3'
          "
          :items="props.categoriesAll"
          :rootHeight="scrollboxContainerHeight"
          @windowResize="windowResized"
        ></CategoriesCheckboxFilter>
      </div>

      <Redirects
        v-if="global.state.resultsRedirectsEnabled"
        class="tab4"
      ></Redirects>

      <MainTitleInfo class="tab5"></MainTitleInfo>
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

const global = inject('global')
const emit = defineEmits(['circleButtonClicked'])
const tab1 = ref(null)
const tab2 = ref(null)
const tab5 = ref(null)
const label5 = ref(null)
const tabbed = ref(null)
const scrollboxContainerHeight = ref(300)
const navHeight = ref(10)

const outgraphref = ref(null)
const props = defineProps({
  categoriesAll: { required: true, default: () => [], type: Array }
})

// switch to tab other than graph, when leaving mobileMode
// switch to graph when entering mobile
watchEffect(() => {
  if (!global.state.mobileMode) {
    if (tab5.value) {
      tab5.value.checked = true
      global.setActiveTab('tab5')
    }
  } else {
    if (tab1.value) {
      tab1.value.checked = true
      global.setActiveTab('tab1')
    }
  }
})

watchEffect(() => {
  if (
    !global.state.resultsCategoriesEnabled &&
    global.state.activeTab === 'tab2'
  ) {
    tab5.value.checked = true
    global.setActiveTab('tab5')
  }
})

watchEffect(() => {
  if (
    !global.state.resultsCategoriesEnabled &&
    global.state.activeTab === 'tab3'
  ) {
    tab5.value.checked = true
    global.setActiveTab('tab5')
  }
})

watchEffect(() => {
  if (
    !global.state.resultsRedirectsEnabled &&
    global.state.activeTab === 'tab4'
  ) {
    tab5.value.checked = true
    global.setActiveTab('tab5')
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

  global.setActiveTab(id)

  // recalc coordinates, when chosen from not visible state in mobile mode, otherwise won't work after resize with graph not visible
  if (id === 'tab1') {
    outgraphref.value.calcCoordinates()
  }
}

async function windowResized() {
  await nextTick()

  // add proper check for highest of all labels and possible second row
  navHeight.value = label5.value.getBoundingClientRect().height

  scrollboxContainerHeight.value =
    tabbed.value.getBoundingClientRect().height - navHeight.value
}

onMounted(async () => {
  window.addEventListener('resize', windowResized)
  await nextTick()
  if (tab1.value) {
    tab1.value.checked = true
    global.setActiveTab('tab1')
  } else {
    if (tab2.value) {
      tab2.value.checked = true
      global.setActiveTab('tab2')
    } else {
      if (tab5.value) {
        tab5.value.checked = true
        global.setActiveTab('tab5')
      }
    }
  }

  windowResized()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', windowResized)
})
</script>

<style scoped>
img.svg-icon {
  filter: invert(100%) brightness(90%);
}
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
#tab4:checked ~ section .tab4,
#tab3:checked ~ section .tab3,
#tab5:checked ~ section .tab5 {
  display: block;
}

nav label {
  float: left;
  padding: 3px 3px;
  border-top: 1px solid #666;
  border-right: 1px solid #666;
  background: #555;
  color: #666;
  font-size: 85%;
  border-bottom: 1px solid #666;
}

nav label:nth-child(1) {
  border-left: 1px solid #666;
}
@media (hover: hover) and (pointer: fine) {
  nav label:hover {
    filter: brightness(1.2);
  }
}
nav label:active {
  background: #ffffff;
}

#tab1:checked ~ nav label[for='tab1'],
#tab2:checked ~ nav label[for='tab2'],
#tab3:checked ~ nav label[for='tab3'],
#tab4:checked ~ nav label[for='tab4'],
#tab5:checked ~ nav label[for='tab5'] {
  background: #7a4c65;
  color: black;
  position: relative;
}

.tabbed {
  height: 100%;
}
.tab2,
.tab3,
.tab4,
.tab5 {
  overflow-y: auto;
}
.tab1,
.tab2,
.tab3,
.tab4,
.tab5 {
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
.itemdisabled {
  filter: brightness(0.6);
}
</style>
