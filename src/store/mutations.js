export default {
  videoId (state, id) {
    state.videoId = id
  },
  comment (state, comment) {
    state.commentsCount++

    const object = {
      id: comment.snippet.topLevelComment.id,
      name: comment.snippet.topLevelComment.snippet.authorDisplayName,
      avatar: comment.snippet.topLevelComment.snippet.authorProfileImageUrl,
      channel: comment.snippet.topLevelComment.snippet.authorChannelUrl,
      date: comment.snippet.topLevelComment.snippet.publishedAt,
      likes: comment.snippet.topLevelComment.snippet.likeCount,
      text: comment.snippet.topLevelComment.snippet.textDisplay
    }

    if (comment.replies) {
      object.replies = []

      comment.replies.comments.forEach(reply => {
        state.commentsCount++

        object.replies.push({
          id: reply.id,
          name: reply.snippet.authorDisplayName,
          avatar: reply.snippet.authorProfileImageUrl,
          channel: reply.snippet.authorChannelUrl,
          date: reply.snippet.publishedAt,
          likes: reply.snippet.likeCount,
          text: reply.snippet.textDisplay
        })
      })
    }

    state.comments.push(object)
  },
  increment (state) {
    state.commentsCount++
  }
}
