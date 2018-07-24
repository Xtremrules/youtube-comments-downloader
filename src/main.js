// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import VueTimeago from 'vue-timeago'
import 'lazysizes'

import store from './store'
import App from './App'

import Vuetify from 'vuetify/es5/components/Vuetify'
import VApp from 'vuetify/es5/components/VApp'

Raven
  .config('https://b65ddccb9c594cbcb1d6a114d7d9d5c4@sentry.io/152451')
  .addPlugin(RavenVue, Vue)
  .install()

Vue.use(Vuetify, {
  components: {
    Vuetify,
    VApp
  }
})

require('vuetify/src/stylus/app.styl')

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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})
