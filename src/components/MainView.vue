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
      <div>Grid Container</div>
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
  background-color: red;
  padding: 5px;
  height: 100vh;
}

.inputform-flex-container {
  display: flex;
  /* flex-wrap: wrap; */
  justify-content: space-around;
  /* align-items: center; */
  /* align-content: space-around; */
  background-color: green;
  padding: 5px;
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
}

.grid-container {
  background-color: lightpink;
  border: 1px solid black;
  flex: 1 0 auto;
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
