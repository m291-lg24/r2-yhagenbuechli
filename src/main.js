import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useMatchStore } from './stores/matchStore'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const matchStore = useMatchStore()
matchStore.loadMatches()

app.mount('#app')