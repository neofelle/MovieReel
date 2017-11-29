// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import lodash from 'lodash';
import Vuetify from 'vuetify';
import VueTruncate from 'vue-truncate-filter';
import vueResource from 'vue-resource';
import 'vuetify/dist/vuetify.css';
import './stylus/main.styl';
import AlertMsg from './view/template/Alert';

import { store } from './store';
import App from './App';
import router from './router';

Vue.use(Vuetify);
Vue.use(vueResource);
Vue.use(VueTruncate);
Vue.component('app-alert', AlertMsg);
Vue.config.productionTip = false;

Object.defineProperty(Vue.prototype, '$lodash', { value: lodash });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
