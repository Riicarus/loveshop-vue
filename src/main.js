import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'

const app = createApp(App)
app.use(router)
app.use(VueAxios, axios)
app.use(ElementPlus)
app.mount('#app')
app.use(store)