import { createApp } from 'vue'
import App from './App.vue'
import Designer from './components/Designer.vue'

// 全局注册设计器组件
const app = createApp(App)
app.component('Designer', Designer)
app.mount('#app')