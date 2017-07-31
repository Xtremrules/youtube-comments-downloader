// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueTimeago from 'vue-timeago'
import VueLazyload from 'vue-lazyload'

import './assets/css/yt.css'

Vue.config.productionTip = false

Vue.use(VueTimeago, {
  name: 'timeago', // component name, `timeago` by default
  locale: 'en-US',
  locales: {
    'en-US': [
      'just now',
      ['%s second ago', '%s seconds ago'],
      ['%s minute ago', '%s minutes ago'],
      ['%s hour ago', '%s hours ago'],
      ['%s day ago', '%s days ago'],
      ['%s week ago', '%s weeks ago'],
      ['%s month ago', '%s months ago'],
      ['%s year ago', '%s years ago']
    ]
  }
})

Vue.use(VueLazyload)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
