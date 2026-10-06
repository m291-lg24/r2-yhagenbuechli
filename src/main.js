import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useMatchStore } from './stores/matchStore'
import { useTaskStore } from './stores/taskStore'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const matchStore = useMatchStore(pinia)
const taskStore = useTaskStore(pinia)

matchStore.loadMatches()
taskStore.loadTasks()

app.mount('#app')