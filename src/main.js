import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ✅ Element Plus 전체 import
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// Element Plus Icons 추가
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


// 앱 생성 및 등록
const app = createApp(App)

// 모든 Element Plus 아이콘 컴포넌트 등록
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
app.use(ElementPlus) // ✅ Element Plus 등록
app.mount('#app')
