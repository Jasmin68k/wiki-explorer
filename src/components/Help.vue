<template>
  <div class="grid-container-help">
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
      {{ $t('help-categories-switch') }}
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
      {{ $t('help-redirects-switch') }}
    </div>
    <div>
      <span>
        <img
          class="icon-help-small-left2"
          src="../assets/images/document.svg"
        />
      </span>
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
        <img class="icon-help2" src="../assets/images/analytics-graph.svg" />
      </div>
    </div>
    <div class="help-text">
      {{ $t('help-mobile-maxresults') }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'Help'
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
.icon-help2 {
  height: 1em;
  font-size: 90%;
  vertical-align: middle;
}
.icon-help3 {
  height: 1em;
  vertical-align: middle;
  margin-left: -0.25em;
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
  /* margin-top: 2px; */
  /* margin-right: -5px; */
}

.icon-help-small-right {
  width: 1.4em;
  height: 1.4em;
  vertical-align: middle;
  font-size: 83.3%;
  margin-top: 2px;
  margin-left: 1px;
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
  /* width: 90px; */
  min-width: 70%;
  max-width: 70%;
}
</style>
