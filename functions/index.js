const functions = require('firebase-functions')
const admin = require('firebase-admin')
const { google } = require('googleapis')

const youtube = google.youtube({
  version: 'v3',
  auth: functions.config().youtube.key
})

admin.initializeApp()

function getCommentThreads(videoId, pageToken) {
  const params = {
    videoId: videoId,
    part: 'snippet,replies',
    maxResults: 100
  }

  if (pageToken) {
    params.pageToken = pageToken
  }

  return youtube.commentThreads.list(params)
    .then(response => {
      const promises = []

      if (response.data.nextPageToken) {
        promises.push(getCommentThreads(videoId, response.data.nextPageToken))
      }

      response.data.items.forEach(comment => {
        const commentId = comment.snippet.topLevelComment.id

        promises.push(admin.database().ref(`/video/${videoId}/fetchedComments`).push(commentId))
        promises.push(admin.database().ref(`/video/${videoId}/comments/${commentId}`).set(comment))
        
        if (comment.snippet.totalReplyCount > 0) {
          promises.push(admin.database().ref(`/video/${videoId}/comments/${commentId}/replies`).remove())
          promises.push(getComments(videoId, commentId))
        }
      })

      return Promise.all(promises)
    })
}

function getComments (videoId, commentId, pageToken) {
  const params = {
    parentId: commentId,
    part: 'snippet',
    maxResults: 100
  }

  if (pageToken) {
    params.pageToken = pageToken
  }

  return youtube.comments.list(params)
    .then(response => {
      const promises = []

      if (response.data.nextPageToken) {
        promises.push(getComments(commentId, response.data.nextPageToken))
      }

      response.data.items.forEach(reply => {
        const replyId = reply.id.replace(commentId + '.', '')
        promises.push(admin.database().ref(`/video/${videoId}/fetchedComments`).push(replyId))
        promises.push(admin.database().ref(`/video/${videoId}/comments/${commentId}/replies/${replyId}`).set(reply))
      })

      return Promise.all(promises)
    })
}

function getVideo(videoId) {
  return youtube.videos.list({
    id: videoId,
    part: 'snippet,statistics'
  })
    .then(response => response.data.items[0])
    .then(video => admin.database().ref(`/video/${videoId}`).update(video))
}

exports.getComments = functions.database.ref('/events/comments/{eventId}/videoId').onCreate((snapshot, context) => {
  const videoId = snapshot.val();

  return getCommentThreads(videoId)
    .then(() => admin.database().ref(`/video/${videoId}/fetchedComments`).once('value'))
    .then(comments => admin.database().ref(`/video/${videoId}/fetchedComments`).set(Object.keys(comments.val()).length))
    .then(() => admin.database().ref(`/events/comments/${context.params.eventId}`).remove())
})

exports.getVideo = functions.database.ref('/events/video/{eventId}/videoId').onCreate((snapshot, context) => {
  const videoId = snapshot.val();
  
  return getVideo(videoId)
    .then(() => admin.database().ref(`/events/video/${context.params.eventId}`).remove())
})
