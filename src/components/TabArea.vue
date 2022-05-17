<template>
  <!-- <h4>Tab Area</h4>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, harum
    consectetur. Quas esse ipsum corporis, velit molestiae officia. Beatae animi
    exercitationem illum necessitatibus eligendi ipsam repudiandae fugit facere
    porro culpa est, voluptates, velit explicabo nihil accusantium? Corporis
    dignissimos, laboriosam quos mollitia accusantium rem, molestias culpa dolor
    perferendis inventore doloremque iusto reiciendis minus facilis recusandae
    illum, iste laudantium tempore! Voluptatum, recusandae! Blanditiis quasi
    laudantium cum temporibus eligendi animi sed soluta, asperiores id nobis
    eius voluptatem cumque omnis accusantium, qui atque incidunt eum fugiat,
    magnam explicabo iusto! Laudantium quam porro iure quos, voluptatum itaque
    molestiae. Laudantium libero, est voluptatem vitae magni et.
  </p> -->

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
      <label v-if="global.state.mobileMode" for="tab1">Graph[T]</label>
      <label for="tab2">Catsredirs[T]</label>
      <label for="tab3">Checkbox[T]</label>
      <label for="tab4" ref="label4">Maininfo[T]</label>
    </nav>

    <section>
      <div v-if="global.state.mobileMode" class="tab1" :style="heightStyle">
        grapharea[T] Lorem ipsum dolor sit amet consectetur adipisicing elit. At
        nihil dicta, repellat laudantium, libero laboriosam facilis
        necessitatibus tempore totam nulla provident exercitationem culpa sed
        voluptate eum debitis consequatur nisi suscipit pariatur, blanditiis
        inventore minus. Quibusdam dolores veritatis natus explicabo labore!
        Dolore ab iusto voluptatem voluptate molestiae, aliquid est
        exercitationem itaque esse! Non eos facilis harum repudiandae unde ullam
        culpa ipsa dolor expedita necessitatibus quasi tempore in quis totam, ab
        odit error accusantium et dolorem atque quas voluptatem blanditiis
        facere. Eos voluptates suscipit reiciendis delectus, fugiat asperiores
        placeat animi nulla ut illo quis praesentium accusantium hic at iure
        laudantium mollitia eius.
      </div>
      <div class="tab2" :style="heightStyle">
        <CategoriesRedirects></CategoriesRedirects>
      </div>
      <div class="tab3" :style="heightStyle">
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
      <div class="tab4" :style="heightStyle">
        <MainTitleInfo></MainTitleInfo>
      </div>
    </section>
  </div>
</template>

<script setup>
import {
  inject,
  ref,
  reactive,
  watchEffect,
  nextTick,
  onMounted,
  onBeforeUnmount
} from 'vue'
import MainTitleInfo from './MainTitleInfo.vue'
import CategoriesRedirects from './CategoriesRedirects.vue'
import CategoriesCheckboxFilter from './CategoriesCheckboxFilter.vue'

// import { useI18n } from 'vue-i18n/index'
// const { t } = useI18n({})
const global = inject('global')
const tab2 = ref(null)
const tab4 = ref(null)
const label4 = ref(null)
const tabbed = ref(null)
const scrollboxContainerHeight = ref(300)
const heightStyle = reactive({ height: '500px' })
const tab3active = ref(false)

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

// This is needed to have CategoriesCheckboxFilter only rendered after tab is active
// otherwise calculcateInitialRowHeight will not work, since spacer.value.children is empty
// with display: none
function tabSelection(id) {
  windowResized()
  tab3active.value = id === 'tab3'
}

async function windowResized() {
  await nextTick()
  scrollboxContainerHeight.value =
    tabbed.value.getBoundingClientRect().height -
    label4.value.getBoundingClientRect().height
  heightStyle['height'] = scrollboxContainerHeight.value + 'px'
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
}

.tabbed > input,
.tabbed section > div {
  display: none;
}

/* .tabbed section > div { */
/* padding: 0; */
/* width: 100%; */
/* border: 1px solid black; */
/* background: #fff; */
/* line-height: 1.5em; */
/* letter-spacing: 0.3px; */
/* color: #444; */
/* } */

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

/* #tab1:checked ~ nav label[for='tab1']:after,
#tab2:checked ~ nav label[for='tab2']:after,
#tab3:checked ~ nav label[for='tab3']:after,
#tab4:checked ~ nav label[for='tab4']:after {
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  background: white;
  left: 0;
} */
.tabbed {
  height: 100%;
}
.tab1,
.tab2,
.tab3,
.tab4 {
  overflow-y: auto;
}
.tab3 {
  position: relative;
}
</style>
