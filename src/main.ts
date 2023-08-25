import {Component, createApp} from 'vue';
import { createPinia } from 'pinia';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import {router} from './router';
import 'element-plus/dist/index.css';
import './assets/css/icon.css';
import EditModel from './components/EditModel.vue'
import TableModel from "./components/TableModel.vue";
const app = createApp(App);
app.use(createPinia());
app.use(router);

// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, <Component>component);
}
app.component("edit-model", EditModel);
app.component("table-model", TableModel);

app.mount('#app');
