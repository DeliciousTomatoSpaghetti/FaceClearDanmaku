import { createApp } from 'vue';
import App from './App.vue';
const app = createApp(App);
app.mount('#app');
import { hello } from "danmaku";
console.log(hello("world"));
