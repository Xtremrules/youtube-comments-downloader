// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueTimeago from 'vue-timeago'
import firebase from 'firebase/app'
import 'lazysizes'

import store from './store'
import App from './App'

import Vuetify from 'vuetify/es5/components/Vuetify'
import VApp from 'vuetify/es5/components/VApp'

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
  components: { App },
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyBonqknJcTB4DcQmfTdipXXXzDpEXHZo0g',
      authDomain: 'comments-downloader.firebaseapp.com',
      databaseURL: 'https://comments-downloader.firebaseio.com',
      projectId: 'comments-downloader',
      storageBucket: 'comments-downloader.appspot.com',
      messagingSenderId: '764770048899'
    })
  }
})
