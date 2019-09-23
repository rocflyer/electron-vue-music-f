import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import iView from 'iview';
import 'iview/dist/styles/iview.css';

import animated from 'animate.css/animate.css'
import 'materialize-css/dist/css/materialize.min.css'
import materialize from 'materialize-css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(iView)
// Vue.use(animated)
// Vue.use(materialize)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
