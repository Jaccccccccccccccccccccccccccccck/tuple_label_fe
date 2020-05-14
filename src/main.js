import iView from 'iview';
import 'iview/dist/styles/iview.css';
import Vue from 'vue';
import App from './App.vue';
import router from './router';



Vue.config.productionTip = false
Vue.use(iView);
Vue.use(require('vue-shortkey'));

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
