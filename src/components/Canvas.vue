<template>
  <div id="canvas"></div>
</template>

<script>
import P5 from 'p5' // Package from npm

export default {
  name: 'Canvas',
  props: {
    moo: String
  },

  mounted() {
    const script = (p5) => {
      p5.setup = () => {
        p5.createCanvas(window.innerWidth, window.innerHeight)
      }
      p5.draw = () => {
        p5.clear()
        p5.ellipse(p5.mouseX, p5.mouseY, 40, 40)
        p5.text(this.moo, 50, 50)
      }
    }

    // eslint-disable-next-line
    const p5canvas = new P5(script, 'canvas')
  }
}
</script>

<style></style>
