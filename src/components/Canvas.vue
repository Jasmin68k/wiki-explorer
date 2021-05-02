<template>
  <div id="canvas"></div>
</template>

<script>
import P5 from 'p5' // Package from npm

export default {
  name: 'Canvas',

  data() {
    return {
      rectX: 200,
      rectY: 200,
      rectW: 150,
      rectH: 75,
      bgColor: 50
    }
  },

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
        p5.background(this.bgColor)
        p5.ellipse(p5.mouseX, p5.mouseY, 40, 40)
        p5.text(this.moo, 50, 50)
        p5.rect(this.rectX, this.rectY, this.rectW, this.rectH)
      }
      p5.mousePressed = () => {
        if (
          p5.mouseX >= this.rectX &&
          p5.mouseX <= this.rectX + this.rectW &&
          p5.mouseY >= this.rectY &&
          p5.mouseY <= this.rectY + this.rectH
        ) {
          this.bgColor = p5.random(255)
        }
      }
    }

    // eslint-disable-next-line
    const p5canvas = new P5(script, 'canvas')
  }
}
</script>

<style></style>
