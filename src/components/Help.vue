<template>
  <div class="grid-container-help">
    <div class="closebuttoncontainer twocolumns">
      <div @click="closeButtonClicked" class="closebutton">
        <img class="svg-icon" src="@/assets/images/close-button.svg" />
      </div>
    </div>

    <div class="twocolumns help-text">
      <h1>{{ $t('title') }}</h1>
      <p>{{ $t('help-intro1') }}</p>
      <p>{{ $t('help-intro2') }}</p>
    </div>
    <div>
      <div class="icon-help-container">
        <img class="icon-help svg-icon" src="@/assets/images/burger-menu.svg" />
      </div>
    </div>
    <div class="help-text">
      {{ $t('help-help') }}
    </div>
    <div>
      <div class="icon-help-container">
        <img class="icon-help svg-icon" src="@/assets/images/desktop-pc.svg" />
      </div>
      <div class="icon-help-container">
        <img class="icon-help svg-icon" src="@/assets/images/smartphone.svg" />
      </div>
    </div>
    <div class="help-text">
      {{ $t('help-desktop-mobile') }}
    </div>
    <div>
      <div class="icon-help-container">
        <img class="icon-help" src="@/assets/images/us-flag.svg" />
      </div>
      <div class="icon-help-container">
        <img class="icon-help" src="@/assets/images/de-flag.svg" />
      </div>
    </div>
    <div class="help-text">
      {{ $t('help-language') }}
    </div>
    <div class="icon-help-small-right-container">
      <input
        class="help-input"
        :placeholder="$t('search-on-wikipedia')"
        @mousedown.prevent
      />
      <img
        class="icon-help-small-right svg-icon"
        src="@/assets/images/search.svg"
      />
    </div>
    <div class="help-text">
      {{ $t('help-search') }}
    </div>
    <div class="icon-help-small-left-container">
      <img
        class="icon-help-small-left svg-icon"
        src="@/assets/images/text-tool.svg"
      />
      <input
        class="help-input"
        :placeholder="$t('filter-results-titles')"
        @mousedown.prevent
      />
    </div>
    <div class="help-text">
      {{ $t('help-filter-titles') }}
    </div>
    <div class="icon-help-small-left-container">
      <img
        class="icon-help-small-left svg-icon"
        src="@/assets/images/document.svg"
      />
      <input
        class="help-input"
        :placeholder="$t('filter-results-categories')"
        @mousedown.prevent
      />
    </div>
    <div class="help-text">
      {{ $t('help-filter-categories') }}
    </div>
    <div>
      <div class="icon-help-container">
        <img class="icon-help svg-icon" src="@/assets/images/document.svg" />
      </div>
    </div>
    <div class="help-text">
      {{ $t('help-categories-switch1') }}
      <span
        ><img
          class="icon-help2"
          :style="{
            filter:
              'invert(86%) sepia(33%) saturate(941%) hue-rotate(250deg) brightness(120%) contrast(124%)'
          }"
          src="@/assets/images/document.svg"
      /></span>
      {{ $t('help-categories-switch2') }}
    </div>
    <div>
      <div class="icon-help-container svg-icon">
        <img
          class="icon-help svg-icon"
          src="@/assets/images/forward-hand-drawn-arrow-pointing-to-right.svg"
        />
      </div>
    </div>
    <div class="help-text">
      {{ $t('help-redirects-switch1') }}
      <span
        ><img
          class="icon-help2"
          :style="{
            filter:
              'invert(86%) sepia(33%) saturate(941%) hue-rotate(250deg) brightness(120%) contrast(124%)'
          }"
          src="@/assets/images/forward-hand-drawn-arrow-pointing-to-right.svg"
      /></span>
      {{ $t('help-redirects-switch2') }}
    </div>

    <div>
      <div>
        <img
          class="icon-help-small-left2 svg-icon"
          src="@/assets/images/left-arrow.svg"
        />
        <img
          class="icon-help-small-right2 svg-icon"
          src="@/assets/images/right-arrow.svg"
        />
      </div>
    </div>
    <div class="help-text">
      {{ $t('help-arrows') }}
    </div>
    <div class="twocolumns help-text">
      <h2>{{ $t('help-outro0') }}</h2>
      <p>{{ $t('help-outro1') }}</p>
      <p>
        <em>{{ currentUrl + $t('help-outro2') }}</em>
      </p>
      <h3>{{ $t('help-outro3') }}</h3>
      <p>{{ $t('help-outro4') }}</p>
      <p>
        <a :href="currentUrl + $t('help-outro5')" target="_blank">{{
          currentUrl + $t('help-outro5')
        }}</a>
      </p>
      <p>{{ $t('help-outro6') }}</p>
      <p>
        <a :href="currentUrl + $t('help-outro7')" target="_blank">{{
          currentUrl + $t('help-outro7')
        }}</a>
      </p>
      <p>{{ $t('help-outro8') }}</p>
      <p>
        <a :href="currentUrl + $t('help-outro9')" target="_blank">{{
          currentUrl + $t('help-outro9')
        }}</a>
      </p>
      <p>{{ $t('help-outro10') }}</p>
      <p>
        <a :href="currentUrl + $t('help-outro11')" target="_blank">{{
          currentUrl + $t('help-outro11')
        }}</a>
      </p>
      <p>{{ $t('help-outro12') }}</p>
      <p>
        {{ $t('help-outro13a') }}<br />
        {{ $t('help-outro13b') }}<br />
        {{ $t('help-outro13c') }}<br />
        {{ $t('help-outro13h') }}<br />
        {{ $t('help-outro13d') }}<br />
        {{ $t('help-outro13e') }}<br />
        {{ $t('help-outro13f') }}<br />
        {{ $t('help-outro13g') }}<br />
        {{ $t('help-outro13k') }}
      </p>
      <h2>{{ $t('firefox-note1') }}</h2>
      <p>{{ $t('firefox-note2') }}</p>
      <ol>
        <li>{{ $t('firefox-note3') }}</li>
        <li>{{ $t('firefox-note4') }}</li>
        <li>{{ $t('firefox-note5') }}</li>
      </ol>
      <h3>{{ $t('firefox-note6') }}</h3>
      <ul>
        <li>{{ $t('firefox-note7') }}</li>
        <li>
          {{ $t('firefox-note8') }}
        </li>
      </ul>
      <p>{{ $t('firefox-note9') }}</p>
      <p>
        {{ $t('firefox-note10') }}
      </p>
      <hr />
      <p class="footer">
        {{ $t('help-footer1') }}<br /><img
          src="@/assets/images/github-mark.svg"
          alt="GitHub"
          class="inline-image"
        />
        <a href="https://github.com/Jasmin68k/wiki-explorer" target="_blank">{{
          $t('help-footer2')
        }}</a>
        <br />
        {{ $t('help-footer3') }}
      </p>
      <hr />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from 'vue'

const global = inject('global')

const currentUrl = ref('')

function closeButtonClicked() {
  global.setShowHelp(false)
  global.setInputsDisabled(false)
}

onMounted(() => {
  // both versions work
  // currentUrl.value = window.location.origin + window.location.pathname
  currentUrl.value = window.location.href.split('?')[0]
})
</script>
<style scoped>
img.svg-icon {
  filter: invert(100%) brightness(90%);
}
.grid-container-help {
  position: relative;

  display: grid;
  grid-template-columns: minmax(110px, 1fr) minmax(190px, 7fr);
  grid-auto-rows: min-content;
  align-items: center;
}
.icon-help-container {
  display: inline-block;
  background-color: #555;
  padding: 1px 1px;
  border: 1px solid #666;
  font-size: 76.5%;
  margin: 3px;
}
.icon-help {
  width: 2.66em;
  height: 1.4em;
  vertical-align: middle;
}

.icon-help2 {
  height: 1em;
  vertical-align: middle;
}

.icon-help-small-left-container,
.icon-help-small-right-container {
  display: flex;
  justify-content: center;
}

.icon-help-small-left {
  width: 1.4em;
  height: auto;
  margin-right: -5px;
}

.icon-help-small-left2 {
  height: 1.75em;
  vertical-align: middle;
  font-size: 90%;
  margin-top: 2px;
  margin-right: 15px;
}

.icon-help-small-right {
  width: 1.4em;
  height: auto;
  margin-left: 1px;
  font-size: 83.3%;
}

.icon-help-small-right2 {
  height: 1.75em;
  vertical-align: middle;
  font-size: 90%;
  margin-top: 2px;
  margin-left: 15px;
}

.help-text {
  padding-left: 5px;
  padding-right: 10px;
  text-align: justify;
  font-size: 90%;
  margin-top: 5px;
  margin-bottom: 5px;
}
.help-input {
  margin-left: 5px;
  margin-top: 3px;
  margin-bottom: 3px;
  margin-right: 3px;
  min-width: 70%;
  max-width: 70%;
}
.twocolumns {
  grid-column: 1 / 3;
}
.closebuttoncontainer {
  padding-right: 20px;
  position: sticky;
  top: 0;
  height: 0;
}
.closebutton {
  padding-top: 20px;
  width: 30px;
  float: right;
}
@media (hover: hover) and (pointer: fine) {
  .closebutton:hover {
    filter: brightness(1.2);
  }
}
.footer {
  text-align: center;
  font-size: 85%;
  line-height: 1.5;
}
.inline-image {
  height: 1em;
  margin-right: 0.5em;
  vertical-align: middle;
  filter: invert(100%) brightness(90%);
}
</style>
