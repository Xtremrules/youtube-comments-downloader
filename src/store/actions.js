import request from '../api'

export default {
  reset (context) {
    context.commit('reset')
  },
  getVideo (context) {
    const url = new URL(context.state.api.url + 'videos')
    const params = {
      key: context.state.api.key,
      id: context.state.videoId,
      part: 'snippet,statistics'
    }

    return request(url, params)
      .then(response => {
        context.commit('video', response.items[0])
      })
  },
  getCommentThreads (context, pageToken) {
    const url = new URL(context.state.api.url + 'commentThreads')
    const params = {
      key: context.state.api.key,
      videoId: context.state.videoId,
      part: 'snippet,replies',
      maxResults: 100
    }

    if (pageToken) {
      params.pageToken = pageToken
    }

    context.state.loading = true

    return request(url, params)
      .then(response => {
        if (response.nextPageToken) {
          context.dispatch('getCommentThreads', response.nextPageToken)
        }

        response.items.forEach(comment => {
          context.commit('comment', comment)

          if (comment.snippet.totalReplyCount > 0) {
            context.dispatch('getComments', comment.snippet.topLevelComment.id)
          }
        })

        if (!response.nextPageToken) {
          context.state.loading = false
        }
      })
      .catch(error => {
        context.state.loading = false
        context.state.error = {
          videoId: params.videoId,
          pageToken: pageToken || false,
          ...error
        }
      })
  },
  getComments (context, commentId, pageToken) {
    const url = new URL(context.state.api.url + 'comments')
    const params = {
      key: context.state.api.key,
      parentId: commentId,
      part: 'snippet',
      maxResults: 100
    }

    if (pageToken) {
      params.pageToken = pageToken
    }

    return request(url, params)
      .then(response => {
        if (response.nextPageToken) {
          context.dispatch('getComments', response.nextPageToken)
        }

        response.items.forEach(reply => {
          context.commit('commentReply', { commentId, reply })
        })
      })
      .catch(error => {
        context.state.loading = false
        context.state.error = {
          videoId: params.videoId,
          commentId,
          pageToken: pageToken || false,
          ...error
        }
      })
  }
}
