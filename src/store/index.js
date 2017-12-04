import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import actions from './actions'
import mutations from './mutations'

export default new Vuex.Store({
  state: {
    loading: false,
    error: false,
    videoId: '',
    comments: [],
    commentsCount: 0
  },
  mutations,
  actions
})
