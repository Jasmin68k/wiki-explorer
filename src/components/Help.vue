<template>
  <div class="grid-container-help">
    <div class="twocolumns help-text">
      <h1>Wiki-Explorer</h1>
      <p>{{ $t('help-intro1') }}</p>
      <p>{{ $t('help-intro2') }}</p>
      <p>{{ $t('help-intro3') }}</p>
    </div>
    <div>
      <div class="icon-help-container">
        <img class="icon-help" src="../assets/images/question-mark.svg" />
      </div>
    </div>
    <div class="help-text">
      {{ $t('help-help') }}
    </div>
    <div>
      <div class="icon-help-container">
        <img class="icon-help" src="../assets/images/desktop-pc.svg" />
      </div>
      <div class="icon-help-container">
        <img class="icon-help" src="../assets/images/smartphone.svg" />
      </div>
    </div>
    <div class="help-text">
      {{ $t('help-desktop-mobile') }}
    </div>
    <div>
      <div class="icon-help-container">
        <img class="icon-help" src="../assets/images/us-flag.svg" />
      </div>
      <div class="icon-help-container">
        <img class="icon-help" src="../assets/images/de-flag.svg" />
      </div>
    </div>
    <div class="help-text">
      {{ $t('help-language') }}
    </div>
    <div>
      <input class="help-input" :placeholder="$t('search-on-wikipedia')" />
      <img class="icon-help-small-right" src="../assets/images/search.svg" />
    </div>
    <div class="help-text">
      {{ $t('help-search') }}
    </div>
    <div>
      <img class="icon-help-small-left" src="../assets/images/text-tool.svg" />
      <input class="help-input" :placeholder="$t('filter-results-titles')" />
    </div>
    <div class="help-text">
      {{ $t('help-filter-titles') }}
    </div>
    <div>
      <img class="icon-help-small-left" src="../assets/images/document.svg" />
      <input
        class="help-input"
        :placeholder="$t('filter-results-categories')"
      />
    </div>
    <div class="help-text">
      {{ $t('help-filter-categories') }}
    </div>
    <div>
      <div class="icon-help-container">
        <img class="icon-help" src="../assets/images/analytics-graph.svg" />
      </div>
      <div class="icon-help-container">
        <img class="icon-help" src="../assets/images/text-tool.svg" />
      </div>
      <div class="icon-help-container">
        <img class="icon-help" src="../assets/images/document2.svg" />
      </div>
    </div>
    <div class="help-text">
      {{ $t('help-mobile-view') }}
    </div>
    <div>
      <div class="icon-help-container">
        <img class="icon-help" src="../assets/images/document.svg" />
      </div>
    </div>
    <div class="help-text">
      {{ $t('help-categories-switch1') }}
      <span
        ><img
          class="icon-help3"
          :style="{
            filter:
              'invert(16%) sepia(63%) saturate(7441%) hue-rotate(0deg) brightness(105%) contrast(124%)'
          }"
          src="../assets/images/document.svg"
      /></span>
      {{ $t('help-categories-switch2') }}
    </div>
    <div>
      <div class="icon-help-container">
        <img class="icon-help" src="../assets/images/document2.svg" />
      </div>
    </div>
    <div class="help-text">
      {{ $t('help-checkboxfilter-switch') }}
    </div>
    <div>
      <div class="icon-help-container">
        <img
          class="icon-help"
          src="../assets/images/forward-hand-drawn-arrow-pointing-to-right.svg"
        />
      </div>
    </div>
    <div class="help-text">
      {{ $t('help-redirects-switch1') }}
      <span
        ><img
          class="icon-help3"
          :style="{
            filter:
              'invert(16%) sepia(63%) saturate(7441%) hue-rotate(0deg) brightness(105%) contrast(124%)'
          }"
          src="../assets/images/forward-hand-drawn-arrow-pointing-to-right.svg"
      /></span>
      {{ $t('help-redirects-switch2') }}
    </div>
    <div>
      <div class="icon-help-container">
        <img class="icon-help" src="../assets/images/mouse-click.svg" />
      </div>
      <div class="icon-help-container">
        <img class="icon-help" src="../assets/images/mouse-hover.svg" />
      </div>
    </div>
    <div class="help-text">
      {{ $t('help-categoriesclickhover-switch1') }}
      <span><img class="icon-help3" src="../assets/images/document.svg" /></span
      >{{ $t('help-categoriesclickhover-switch2') }}
    </div>
    <div>
      <div>
        <img
          class="icon-help-small-left3"
          src="../assets/images/left-arrow.svg"
        />
        <img
          class="icon-help-small-right3"
          src="../assets/images/right-arrow.svg"
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
        {{ $t('help-outro13d') }}<br />
        {{ $t('help-outro13e') }}<br />
        {{ $t('help-outro13f') }}<br />
        {{ $t('help-outro13g') }}<br />
        {{ $t('help-outro13h') }}<br />
        {{ $t('help-outro13i') }}<br />
        {{ $t('help-outro13j') }}
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Help',
  data() {
    return {
      currentUrl: ''
    }
  },
  mounted() {
    // both versions work
    // this.currentUrl = window.location.origin + window.location.pathname
    this.currentUrl = window.location.href.split('?')[0]
  }
}
</script>
<style scoped>
.grid-container-help {
  display: grid;
  grid-template-columns: minmax(130px, 1fr) minmax(230px, 7fr);
  align-items: center;
}
.icon-help-container {
  display: inline-block;
  background-color: #ddd;
  padding: 1px 1px;
  border: 1px solid black;
  font-size: 76.5%;
  margin: 3px;
}
.icon-help {
  width: 2.66em;
  height: 1.4em;
  vertical-align: middle;
}
.icon-help3 {
  height: 1em;
  vertical-align: middle;
}

.icon-help-small-left {
  width: 1.4em;
  height: 1.4em;
  vertical-align: middle;
  font-size: 90%;
  margin-top: 2px;
  margin-right: -5px;
}

.icon-help-small-left2 {
  width: 1.4em;
  height: 1.4em;
  vertical-align: middle;
  font-size: 90%;
}

.icon-help-small-left3 {
  height: 1.75em;
  vertical-align: middle;
  font-size: 90%;
  margin-top: 2px;
  margin-right: 15px;
}

.icon-help-small-right {
  width: 1.4em;
  height: 1.4em;
  vertical-align: middle;
  font-size: 83.3%;
  margin-top: 2px;
  margin-left: 1px;
}

.icon-help-small-right3 {
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
</style>
