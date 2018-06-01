const functions = require('firebase-functions')
const admin = require('firebase-admin')
const axios = require('axios')
const express = require('express')
const https = require('https')

const httpsAgent = new https.Agent({ keepAlive: true })
const app = express();

const api = {
  url: 'https://www.googleapis.com/youtube/v3/',
  key: 'AIzaSyBtZceUHCZW1a3r93gzldAnF47BS23UgJE'
}

admin.initializeApp(functions.config().firebase)

function getCommentThreads(videoId, pageToken) {
  const params = {
    key: api.key,
    videoId: videoId,
    part: 'snippet,replies',
    maxResults: 100
  }

  if (pageToken) {
    params.pageToken = pageToken
  }

  return axios.get(api.url + 'commentThreads', { params, httpsAgent })
    .then(response => {
      if (response.data.nextPageToken) {
        getCommentThreads(videoId, response.data.nextPageToken)
      }

      response.data.items.forEach(comment => {
        const commentId = comment.snippet.topLevelComment.id

        admin.database().ref(`/video/${videoId}/fetchedComments`).push(commentId)
        admin.database().ref(`/video/${videoId}/comments/${commentId}`).set(comment)

        if (comment.snippet.totalReplyCount > 0) {
          admin.database().ref(`/video/${videoId}/comments/${commentId}/replies`).set({})
          getComments(videoId, commentId)
        }
      })

      return response
    })
}

function getComments (videoId, commentId, pageToken) {
  const params = {
    key: api.key,
    parentId: commentId,
    part: 'snippet',
    maxResults: 100
  }

  if (pageToken) {
    params.pageToken = pageToken
  }

  return axios.get(api.url + 'comments', { params, httpsAgent })
    .then(response => {
      if (response.data.nextPageToken) {
        getComments(commentId, response.data.nextPageToken)
      }

      response.data.items.forEach(reply => {
        const replyId = reply.id.replace(commentId + '.', '')
        admin.database().ref(`/video/${videoId}/fetchedComments`).push(replyId)
        admin.database().ref(`/video/${videoId}/comments/${commentId}/replies/${replyId}`).set(reply)
      })

      return response
    })
}

app.get('/:id', (req, res) => {
  const videoId = req.params.id

  axios.get(api.url + 'videos', {
    params: {
      key: api.key,
      id: videoId,
      part: 'snippet,statistics'
    },
    httpsAgent
  })
    .then(response => response.data.items[0])
    .then(video => {
      admin.database().ref(`/video/${videoId}`).set(video)
      return video
    })
    .catch(error => {
      res.status(500).send(error)
    })

  getCommentThreads(videoId)
  res.sendStatus(200)
})

exports.fetchComments = functions.https.onRequest(app)
