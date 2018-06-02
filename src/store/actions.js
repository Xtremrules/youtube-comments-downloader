import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/database'

const GET_VIDEO = 'https://us-central1-comments-downloader.cloudfunctions.net/getVideo'

export default {
  reset (context) {
    context.commit('reset')
  },
  async getVideo (context) {
    const videoId = context.state.videoId

    if (videoId) {
      context.commit('video', await axios.get(`${GET_VIDEO}/${videoId}`).then(response => response.data))
    }
  },
  async getCommentThreads (context) {
    const videoId = context.state.videoId
    context.commit('loading', true)

    await firebase.database().ref(`/video/${videoId}/details/isCurrent`).on('value', async snapshot => {
      const isCurrent = snapshot.val()

      if (isCurrent) {
        await firebase.database().ref(`/video/${videoId}/details/isCurrent`).off()
        const comments = await firebase.database().ref(`/video/${videoId}/comments`).once('value')
        context.commit('comments', comments.val())
        context.commit('loading', false)
      }
    })
  }
}
