import request from '../api'

export default {
  getComments (context, pageToken) {
    const url = new URL('https://www.googleapis.com/youtube/v3/commentThreads')
    const params = {
      key: 'AIzaSyAyYPux1VOpcbKk2V_FKt3nPxfz6lu437k',
      videoId: context.state.videoId,
      part: 'snippet,replies',
      maxResults: 100
    }

    if (pageToken) {
      params.pageToken = pageToken
    }

    request(url, params)
      .then(response => {
        if (response.nextPageToken) {
          context.dispatch('getComments', { pageToken: response.nextPageToken })
        }
        response.items.forEach(comment => {
          context.commit('comment', comment)
        })

        if (!response.nextPageToken) {
          context.state.loading = false
        }
      })
      .catch(error => {
        context.state.loading = false
        context.state.error = error
        return {
          items: []
        }
      })
  }
}
