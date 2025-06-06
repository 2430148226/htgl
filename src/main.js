import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// ======= 引入 Element Plus ==========
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// ====================================

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)  // <<=== 加上这一行

app.mount('#app')
