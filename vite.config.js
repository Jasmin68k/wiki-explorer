import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

export default defineConfig({
  // uncomment for debugging bugs in production
  // build: {
  //   minify: false
  // },
  plugins: [
    vue(), // you need to install `@vitejs/plugin-vue`
    vueI18n({
      compositionOnly: false,

      // you need to set i18n resource including paths !
      include: path.resolve(__dirname, './locales/**')
    })
  ]
})
