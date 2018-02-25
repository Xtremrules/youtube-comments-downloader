import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api: {
      url: 'https://www.googleapis.com/youtube/v3/',
      key: 'AIzaSyAyYPux1VOpcbKk2V_FKt3nPxfz6lu437k'
    },
    loading: false,
    error: false,
    videoId: '',
    video: false,
    comments: [],
    commentsCount: 0
  },
  mutations,
  actions
})
