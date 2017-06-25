// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import './assets/theme/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'

import './css/style.scss'

  Vue.use(ElementUI, { locale })
Vue.component(CollapseTransition.name, CollapseTransition)

Vue.config.productionTip = false

/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
// var router = router;
