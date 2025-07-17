import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ✅ Element Plus 전체 import
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 앱 생성 및 등록
const app = createApp(App)
app.use(router)
app.use(ElementPlus) // ✅ Element Plus 등록
app.mount('#app')
