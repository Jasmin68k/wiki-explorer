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

  <div>
    <div class="tabbed">
      <input
        v-if="global.state.mobileMode"
        checked="true"
        id="tab1"
        type="radio"
        name="tabs"
      />
      <input checked="true" id="tab2" type="radio" name="tabs" ref="tab2" />
      <input id="tab3" type="radio" name="tabs" />
      <input id="tab4" type="radio" name="tabs" />

      <nav>
        <label v-if="global.state.mobileMode" for="tab1">Graph[T]</label>
        <label for="tab2">Catsredirs[T]</label>
        <label for="tab3">Checkbox[T]</label>
        <label for="tab4">Maininfo[T]</label>
      </nav>

      <section>
        <div v-if="global.state.mobileMode" class="tab1">
          grapharea[T] Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Perspiciatis labore fugit ad maxime laboriosam perferendis accusamus,
          suscipit voluptatum at omnis aperiam odio natus, ut dolores, iusto
          ipsum. Voluptatem omnis nemo fugit in ab amet, laboriosam nobis
          cupiditate aliquid nisi dolorum nam, a autem explicabo voluptate fuga
          aperiam facere eveniet voluptatibus id distinctio modi. Aperiam omnis
          reiciendis facere tempora est sint modi debitis quod iure
          exercitationem nesciunt ut explicabo qui voluptates totam, sequi
          assumenda perspiciatis quidem. Iusto deserunt voluptatem expedita,
          enim nisi laborum placeat quasi. Natus porro laudantium placeat rerum
          recusandae facilis aut dolorem deleniti sed blanditiis cum, aliquam
          dolorum sunt.
        </div>
        <div class="tab2">
          catsredirsarea[T] Lorem ipsum, dolor sit amet consectetur adipisicing
          elit. Vero sapiente ratione molestias deleniti maiores totam hic unde
          commodi voluptatibus dolorum nemo doloribus, omnis ducimus sit id ex
          beatae earum corrupti soluta saepe quidem sequi! Optio, magnam? Harum,
          animi quibusdam blanditiis itaque exercitationem earum! Ex fugit
          doloribus enim iure? Provident, dignissimos? Nostrum at beatae aut
          iure dolores aliquid illo ratione debitis, alias praesentium quae
          maiores, cum quas in nemo! Eius magni magnam aliquid dolorem provident
          maiores quae quaerat quia numquam rerum similique odio, laborum ipsum
          delectus sapiente porro ducimus tenetur! Ducimus praesentium a
          tenetur, assumenda distinctio cumque unde vitae eius ab.
        </div>
        <div class="tab3">
          checkboxarea[T] Lorem ipsum dolor sit amet consectetur, adipisicing
          elit. Aliquam quod ratione totam perferendis tempora necessitatibus
          dolorem, atque unde, aut assumenda veritatis tempore facere itaque
          ipsa consequatur vitae voluptatem qui nisi voluptate commodi mollitia
          alias excepturi. Aliquam sint expedita, nemo illum nostrum quae! Ex,
          fugiat optio. Impedit molestias fugiat totam tempore incidunt facere.
          Assumenda quod sunt tempora sed pariatur, consequuntur ducimus nisi
          quibusdam, ipsa vitae maxime recusandae sequi repudiandae fugit nobis
          ea. Fugiat voluptatum ipsam quod libero unde delectus architecto neque
          perspiciatis blanditiis, distinctio aut exercitationem porro, alias
          nisi velit pariatur reprehenderit iusto saepe aliquam, nesciunt
          cupiditate. Nostrum et atque consequuntur?
        </div>
        <div class="tab4">
          maininfoarea[T] Lorem, ipsum dolor sit amet consectetur adipisicing
          elit. Nulla sequi autem iure vitae a quos et temporibus, totam
          voluptas laboriosam, eveniet dolor? Praesentium dolore aut nisi
          laborum fugiat ipsa enim beatae, fuga dolorum ut, non, vero alias id
          dolores qui facilis. Hic animi dicta, cupiditate quos, magnam
          veritatis aliquam necessitatibus iste sapiente beatae rerum a eligendi
          harum repellat alias culpa mollitia aspernatur earum suscipit nemo
          quasi quas voluptate incidunt. Deserunt dolor corporis architecto
          illum eum non cupiditate. Dolorum ex expedita quae. Incidunt
          blanditiis alias qui at corporis ab corrupti expedita, aliquam
          doloribus culpa perferendis, veritatis quo explicabo mollitia minima
          ducimus.
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, watchEffect } from 'vue'
// import { useI18n } from 'vue-i18n/index'
// const { t } = useI18n({})
const global = inject('global')
const tab2 = ref(null)

// switch to tab2, when leaving mobile mode
watchEffect(() => {
  if (tab2.value && !global.state.mobileMode) {
    tab2.value.checked = true
  }
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
</style>
