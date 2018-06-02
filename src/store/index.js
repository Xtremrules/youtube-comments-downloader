import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    error: false,
    videoId: '',
    video: false,
    comments: {},
    search: ''
  },
  mutations,
  actions,
  getters: {
    comments: (state, getters) => {
      const comments = JSON.parse(JSON.stringify(state.comments))

      return Object.keys(comments)
        .map(commentId => {
          const comment = comments[commentId]
          comment.replies = getters.replies(commentId)
          return comment
        })
        .sort((a, b) => b.likes - a.likes)
    },
    commentsWithText: (state, getters) => text => {
      const comments = JSON.parse(JSON.stringify(getters.comments))

      return comments.filter(comment => {
        if (comment.replies) {
          comment.replies = comment.replies.filter(reply => {
            return reply.text.search(new RegExp(text, 'i')) >= 0
          })
        }
        return comment.text.search(new RegExp(text, 'i')) >= 0 || (comment.replies && comment.replies.length)
      })
    },
    replies: state => id => {
      if (!state.comments[id].replies) {
        return []
      }

      return Object.values(state.comments[id].replies).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      )
    }
  }
})
