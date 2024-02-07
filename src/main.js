// Components
import App from '@/App.vue'
import i18n from '@/i18n'

// Composables
import { createApp } from 'vue'

const app = createApp(App).use(i18n)

app.mount('#app')
