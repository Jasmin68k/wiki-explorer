<template>
  <div class="page-flex-container">
    <div class="inputform-flex-container">
      <div class="inputform-flex-item-1">
        <div>InputForm Flex Item 1</div>
      </div>
      <div class="inputform-flex-item-2">
        <div>InputForm Flex Item 2</div>
      </div>
      <div class="inputform-flex-item-3">
        <div>InputForm Flex Item 3</div>
      </div>
      <div class="inputform-flex-item-4">
        <div>InputForm Flex Item 4</div>
      </div>
      <div class="inputform-flex-item-5">
        <div>InputForm Flex Item 5</div>
      </div>
    </div>
    <div class="grid-container">
      <div class="grid-item-graph">Graph</div>
      <div class="grid-item-maininfo">Main info</div>
      <div class="grid-item-categories">Categories</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainView'
}
</script>

<style scoped>
.page-flex-container {
  display: flex;
  /* flex-wrap: wrap; */
  /* justify-content: flex-start; */
  /* align-items: center; */
  /* align-content: space-around; */
  height: 100vh;
}

.inputform-flex-container {
  display: flex;
  /* flex-wrap: wrap; */
  justify-content: space-around;
  /* align-items: center; */
  /* align-content: space-around; */
  background-color: green;
  flex: 0 1 auto;
}

.inputform-flex-item-1,
.inputform-flex-item-2,
.inputform-flex-item-3,
.inputform-flex-item-4,
.inputform-flex-item-5 {
  background-color: lightgreen;
  border: 1px solid black;
  flex: 0 1 auto;
  width: 400px;
}

.grid-container {
  background-color: lightpink;
  border: 1px solid black;
  flex: 1 0 auto;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
}

.grid-item-graph,
.grid-item-maininfo,
.grid-item-categories {
  background-color: cadetblue;
  border: 1px solid black;
}

.grid-item-graph {
  grid-column: 1 / 2;
  grid-row: 1;
  width: 860px;
  height: 620px;
}

.grid-item-categories {
  grid-column: 2 / 3;
  grid-row: 1 / 3;
}

.grid-item-maininfo {
  grid-column: 1 / 2;
  grid-row: 2;
}
@media (orientation: landscape) {
  .page-flex-container {
    flex-direction: row;
  }
  .inputform-flex-container {
    flex-direction: column;
  }
}

@media (orientation: portrait) {
  .page-flex-container {
    flex-direction: column;
  }

  .inputform-flex-container {
    flex-direction: row;
  }
}
</style>
