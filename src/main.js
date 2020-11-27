import './../node_modules/bulma/css/bulma.css';
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

Vue.prototype.$events = new Vue();

new Vue({
  render: h => h(App),
}).$mount('#app')
